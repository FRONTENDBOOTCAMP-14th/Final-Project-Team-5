'use client';

import React, { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { CreateClient } from '@/libs/supabase/client';

import Frame from '@/components/ui/Frame';
import ImageList from '@/components/ui/ImageList';
import ImageModal from '@/components/ui/ImageModal';
import KeywordList from '@/components/ui/KeywordList';
import MainCarousel from '@/components/ui/MainCarousel';
import NavigationBar from '@/components/ui/NavigationBar';
import OnboardingModal from '@/components/ui/OnboardingModal';
import WeatherDashboard from '@/components/ui/WeatherDashboard';
import WeatherSimpleBar from '@/components/ui/WeatherSimpleBar';
import { useWeatherStore } from '@/libs/store/weatherStore';

type Profile = {
  id: string;
  username: string | null;
  profile_url: string | null;
};

type BoardBase = {
  board_uuid: string;
  created_at: string;
  user_id: string;
  image: string | null;
  text: string;
  keyword: string | null;
  gender: string | null;
  season: string | null;
  author: Profile;
};

type BoardWithMetrics = BoardBase & {
  bookmark_count_7d: number;
  bookmark_rate_per_hour: number;
};

function getSeasonEN(
  currentTemp: number | undefined
): 'winter' | 'spring' | 'summer' | 'autumn' | null {
  const m = new Date().getMonth() + 1;
  if (currentTemp !== undefined && currentTemp < 5) return 'winter';
  if (currentTemp !== undefined && currentTemp >= 30) return 'summer';
  if (m === 12 || m <= 2) return 'winter';
  if (m <= 8) return 'spring';
  return 'autumn';
}

function hoursSince(dateISO: string): number {
  const created = new Date(dateISO).getTime();
  const now = Date.now();
  const hours = (now - created) / (1000 * 60 * 60);
  return Math.max(1 / 24, hours);
}

export default function LandingPage() {
  const router = useRouter();
  const supabase = CreateClient();

  // 온보딩 모달
  const [showOnboarding, setShowOnboarding] = useState(false);

  // 이미지 모달
  const [_modalOpen, _setModalOpen] = useState(false);
  const [_selectedBoard, _setSelectedBoard] = useState<BoardBase | null>(null);

  // 메인 그리드/캐러셀 데이터
  const [boards, setBoards] = useState<BoardBase[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [topBoards, setTopBoards] = useState<BoardWithMetrics[]>([]);
  const [loadingTop, setLoadingTop] = useState(true);

  const keywords = ['캐주얼', '스트릿', '미니멀', '스포티', '클래식', '워크웨어'];

  // 현재 기온 → 시즌
  const currentTemp = useWeatherStore((s) => s.currentTemp);
  const season = useMemo(() => getSeasonEN(currentTemp), [currentTemp]);

  // (선택) 로그인 상태 콘솔 확인 및 유지
  useEffect(() => {
    let unsub: { unsubscribe: () => void } | null = null;

    (async () => {
      const { data, error } = await supabase.auth.getUser();
      if (error) {
        console.error('[Supabase] getUser error:', error);
      } else {
        console.log('[Supabase] current user:', data.user);
      }
    })();

    const { data } = supabase.auth.onAuthStateChange((event, session) => {
      console.log('[Supabase] auth event:', event);
      console.log('[Supabase] session user:', session?.user);
    });
    unsub = { unsubscribe: data.subscription.unsubscribe };

    return () => {
      unsub?.unsubscribe();
    };
  }, [supabase]);

  // 온보딩 상태 체크
  useEffect(() => {
    (async function CheckOnboardingStatus() {
      try {
        const {
          data: { user },
        } = await supabase.auth.getUser();

        if (!user) {
          router.push('/auth/signin');
          return;
        }

        const { data: profile, error } = await supabase
          .from('profiles')
          .select('has_seen_onboarding')
          .eq('id', user.id)
          .single();

        if (error) {
          console.error('프로필 조회 에러:', error);
          return;
        }

        if (profile && !profile.has_seen_onboarding) {
          setShowOnboarding(true);
        }
      } catch (err) {
        console.error('온보딩 체크 에러:', err);
      }
    })();
  }, [router, supabase]);

  // 온보딩 모달 닫기 및 상태 업데이트
  async function HandleOnboardingClose() {
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) return;

      const { error } = await supabase
        .from('profiles')
        .update({ has_seen_onboarding: true })
        .eq('id', user.id);

      if (error) throw error;
      setShowOnboarding(false);
    } catch (err) {
      console.error('온보딩 상태 업데이트 에러:', err);
      setShowOnboarding(false);
    }
  }

  const handleImageClick = (board: BoardBase) => {
    _setSelectedBoard(board);
    _setModalOpen(true);
  };

  // 메인 그리드: 시즌 기준 최근 글
  useEffect(() => {
    let aborted = false;

    (async () => {
      try {
        setLoading(true);
        setError(null);

        let query = supabase
          .from('board')
          .select(
            `
            board_uuid,
            created_at,
            user_id,
            image,
            text,
            keyword,
            gender,
            season,
            author:profiles ( id, username, profile_url )
          `
          )
          .order('created_at', { ascending: false })
          .limit(30);

        if (season) query = query.eq('season', season);

        const { data, error } = await query;
        if (aborted) return;

        if (error) {
          setError(error.message);
        } else {
          const typed = (data ?? []) as BoardBase[];
          setBoards(typed);
        }
      } catch (e: any) {
        if (!aborted) setError(e?.message ?? '알 수 없는 오류');
      } finally {
        if (!aborted) setLoading(false);
      }
    })();

    return () => {
      aborted = true;
    };
  }, [season, supabase]);

  // 캐러셀: 지난 7일 "시간당 북마크 속도" 상위 5개 (강력한 fallback 포함)
  useEffect(() => {
    let aborted = false;

    (async () => {
      try {
        setLoadingTop(true);

        const now = new Date();
        const weekAgoISO = new Date(
          now.getTime() - 7 * 24 * 60 * 60 * 1000
        ).toISOString();

        // 1) 지난 7일 내 게시글
        const { data: recentRaw, error: boardsErr } = await supabase
          .from('board')
          .select(
            `
          board_uuid,
          created_at,
          user_id,
          image,
          text,
          keyword,
          gender,
          season,
          author:profiles ( id, username, profile_url )
        `
          )
          .gte('created_at', weekAgoISO)
          .order('created_at', { ascending: false })
          .limit(200);

        if (boardsErr) throw boardsErr;

        let recentBoards = (recentRaw ?? []) as BoardBase[];

        // 1-1) 7일 내 게시글이 없으면 → 최신 5개로 대체
        if (recentBoards.length === 0) {
          const { data: latestRaw, error: latestErr } = await supabase
            .from('board')
            .select(
              `
            board_uuid,
            created_at,
            user_id,
            image,
            text,
            keyword,
            gender,
            season,
            author:profiles ( id, username, profile_url )
          `
            )
            .order('created_at', { ascending: false })
            .limit(5);

          if (latestErr) throw latestErr;

          const latest = (latestRaw ?? []) as BoardBase[];
          if (!aborted) {
            setTopBoards(
              latest.map<BoardWithMetrics>((b) => ({
                ...b,
                bookmark_count_7d: 0,
                bookmark_rate_per_hour: 0,
              }))
            );
          }
          return;
        }

        const ids = recentBoards.map((b) => b.board_uuid);

        // 2) 지난 7일 북마크 행들
        const { data: bmRows, error: bmErr } = await supabase
          .from('bookmark')
          .select('board_id, created_at')
          .in('board_id', ids)
          .gte('created_at', weekAgoISO);

        // 2-1) 실패 시 최신 5개로 대체
        if (bmErr) {
          console.warn(
            '[Top5] bookmark select failed; fallback to latest 5:',
            bmErr
          );
          const { data: latestRaw, error: latestErr } = await supabase
            .from('board')
            .select(
              `
            board_uuid,
            created_at,
            user_id,
            image,
            text,
            keyword,
            gender,
            season,
            author:profiles ( id, username, profile_url )
          `
            )
            .order('created_at', { ascending: false })
            .limit(5);

          if (latestErr) throw latestErr;

          const latest = (latestRaw ?? []) as BoardBase[];
          if (!aborted) {
            setTopBoards(
              latest.map<BoardWithMetrics>((b) => ({
                ...b,
                bookmark_count_7d: 0,
                bookmark_rate_per_hour: 0,
              }))
            );
          }
          return;
        }

        const counts = new Map<string, number>();
        for (const row of bmRows ?? []) {
          const key = (row as unknown as { board_id: string }).board_id;
          counts.set(key, (counts.get(key) ?? 0) + 1);
        }

        // 3) 지표 구성
        const withRate: BoardWithMetrics[] = recentBoards.map((b) => {
          const cnt = counts.get(b.board_uuid) ?? 0;
          const rate = cnt / hoursSince(b.created_at);
          return {
            ...b,
            bookmark_count_7d: cnt,
            bookmark_rate_per_hour: rate,
          };
        });

        // 4) 정렬 후 상위 5개
        withRate.sort(
          (a, b) => b.bookmark_rate_per_hour - a.bookmark_rate_per_hour
        );
        let top5: BoardWithMetrics[] = withRate.slice(0, 5);

        // 5) 전부 0이거나 비어 있으면 최신 5개로 대체
        if (top5.length === 0 || top5.every((x) => x.bookmark_count_7d === 0)) {
          const { data: latestRaw, error: latestErr } = await supabase
            .from('board')
            .select(
              `
            board_uuid,
            created_at,
            user_id,
            image,
            text,
            keyword,
            gender,
            season,
            author:profiles ( id, username, profile_url )
          `
            )
            .order('created_at', { ascending: false })
            .limit(5);

          if (latestErr) throw latestErr;

          const latest = (latestRaw ?? []) as BoardBase[];
          top5 = latest.map<BoardWithMetrics>((b) => ({
            ...b,
            bookmark_count_7d: 0,
            bookmark_rate_per_hour: 0,
          }));
        }

        if (!aborted) setTopBoards(top5);
      } catch (e) {
        console.error('[Top5] fatal error → fallback to latest 5:', e);

        if (!aborted) {
          try {
            const { data: latestRaw } = await supabase
              .from('board')
              .select(
                `
              board_uuid,
              created_at,
              user_id,
              image,
              text,
              keyword,
              gender,
              season,
              author:profiles ( id, username, profile_url )
            `
              )
              .order('created_at', { ascending: false })
              .limit(5);

            const latest = (latestRaw ?? []) as BoardBase[];
            setTopBoards(
              latest.map<BoardWithMetrics>((b) => ({
                ...b,
                bookmark_count_7d: 0,
                bookmark_rate_per_hour: 0,
              }))
            );
          } catch {
            setTopBoards([]);
          }
        }
      } finally {
        if (!aborted) setLoadingTop(false);
      }
    })();

    return () => {
      aborted = true;
    };
  }, [supabase]);

  const placeholder = (i: number) => `/images/sample${(i % 5) + 1}.jpg`;

  return (
    <Frame paddingX={24} color="#D2E4FB">
      <WeatherDashboard />
      <WeatherSimpleBar style={{ marginTop: 20 }} />

      <span className="inline-block text-[18px] mt-[25px] font-bold">
        이렇게 입어보는거 어떤가요?
      </span>

      {/* 캐러셀: 지난 7일 북마크 비율 상위 5개 */}
      {!loadingTop && topBoards.length > 0 && (
        <MainCarousel
          items={topBoards.map((b, i) => ({
            id: b.board_uuid,
            image: b?.image && b.image.length > 0 ? b.image : placeholder(i),
            title: b?.text ?? '게시글',
            sub: `북마크 ${b.bookmark_count_7d} • ${b.bookmark_rate_per_hour.toFixed(
              2
            )}/h`,
          }))}
          onItemClick={(id) => {
            const found = topBoards.find((x) => x.board_uuid === id);
            if (found) {
              _setSelectedBoard(found);
              _setModalOpen(true);
            }
          }}
        />
      )}

      <span>이렇게 입어보는 것도 추천해요!</span>
      <KeywordList keywords={keywords} />

      {loading && (
        <div className="mt-3 text-sm text-gray-500">불러오는 중…</div>
      )}
      {error && (
        <div className="mt-3 text-sm text-red-600">불러오기 실패: {error}</div>
      )}

      {!loading && !error && boards.length === 0 && (
        <div className="mt-4 text-sm text-gray-500">표시할 게시물이 없습니다.</div>
      )}

      {!loading && !error && boards.length > 0 && (
        <div className="grid grid-cols-2 gap-2 mt-4">
          {boards.map((b, i) => {
            const src = b?.image && b.image.length > 0 ? b.image : placeholder(i);
            return (
              <div
                key={b.board_uuid ?? `tmp-${i}`}
                onClick={() => handleImageClick(b)}
                className="cursor-pointer"
              >
                <ImageList src={src} />
              </div>
            );
          })}
        </div>
      )}

      <NavigationBar />

      <ImageModal
        open={_modalOpen}
        onClose={() => _setModalOpen(false)}
        data={_selectedBoard ?? undefined}
      />

      <OnboardingModal
        isOpen={showOnboarding}
        onClose={HandleOnboardingClose}
      />
    </Frame>
  );
}
