'use client';

import React, { useEffect, useMemo, useState } from 'react';
import { Heart } from 'lucide-react';
import { useRouter } from 'next/navigation';
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
import { CreateClient } from '@/libs/supabase/client';

interface Profile {
  id: string;
  username: string | null;
  profile_url: string | null;
}

interface BoardBase {
  board_uuid: string;
  created_at: string;
  user_id: string;
  image: string | null;
  text: string;
  keyword: string | null;
  gender: string | null;
  season: string | null;
  author: Profile;
}

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

  // 로그인/프로필
  const [me, setMe] = useState<string | null>(null);
  const [userGender, setUserGender] = useState<string | null>(null);

  // 내 북마크 상태
  const [bookmarked, setBookmarked] = useState<Set<string>>(new Set());

  // 캐러셀용 실시간 북마크 수
  const [bookmarkCounts, setBookmarkCounts] = useState<Map<string, number>>(
    new Map()
  );
  function bumpCount(boardId: string, delta: number) {
    setBookmarkCounts((prev) => {
      const next = new Map(prev);
      const cur = next.get(boardId) ?? 0;
      const v = Math.max(0, cur + delta);
      next.set(boardId, v);
      return next;
    });
  }

  // 키워드
  const keywords = [
    '캐주얼',
    '스트릿',
    '미니멀',
    '스포티',
    '클래식',
    '워크웨어',
  ];
  const [selectedKeywords, setSelectedKeywords] = useState<string[]>([]);
  function toggleKeyword(kw: string) {
    setSelectedKeywords((prev) =>
      prev.includes(kw) ? prev.filter((k) => k !== kw) : [...prev, kw]
    );
  }

  // 현재 기온 → 시즌
  const currentTemp = useWeatherStore((s) => s.currentTemp);
  const season = useMemo(() => getSeasonEN(currentTemp), [currentTemp]);

  // 로그인/성별/내 북마크 초기 로딩
  useEffect(() => {
    let unsub: { unsubscribe: () => void } | null = null;

    void (async () => {
      const { data, error } = await supabase.auth.getUser();
      if (!error && data.user) {
        setMe(data.user.id);

        // ✅ 프로필 성별 로딩
        const { data: profile } = await supabase
          .from('profiles')
          .select('gender')
          .eq('id', data.user.id)
          .single();
        setUserGender(profile?.gender ?? null);

        // 내 북마크 로딩
        const { data: myBms, error: bmErr } = await supabase
          .from('bookmark')
          .select('board_id')
          .eq('user_id', data.user.id);
        if (!bmErr && myBms) {
          setBookmarked(new Set(myBms.map((r) => r.board_id)));
        }
      }
    })();

    const { data } = supabase.auth.onAuthStateChange((event, session) => {
      const u = session?.user?.id ?? null;
      setMe(u);
    });
    unsub = { unsubscribe: data.subscription.unsubscribe };

    return () => {
      unsub?.unsubscribe();
    };
  }, [supabase]);

  // 온보딩 상태 체크
  useEffect(() => {
    void (async function CheckOnboardingStatus() {
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

  // 온보딩 닫기
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

  // 북마크 토글 (캐러셀은 실시간 카운트 반영, 그리드는 숫자 반영 X)
  async function toggleBookmark(boardId: string) {
    if (!me) {
      router.push('/auth/signin');
      return;
    }

    const isOn = bookmarked.has(boardId);

    if (isOn) {
      const { error } = await supabase
        .from('bookmark')
        .delete()
        .eq('board_id', boardId)
        .eq('user_id', me);

      if (!error) {
        const next = new Set(bookmarked);
        next.delete(boardId);
        setBookmarked(next);
        if (topBoards.some((tb) => tb.board_uuid === boardId))
          bumpCount(boardId, -1);
      } else {
        console.error('북마크 해제 실패:', error);
      }
    } else {
      const { error } = await supabase
        .from('bookmark')
        .insert({ board_id: boardId, user_id: me });

      if (!error) {
        const next = new Set(bookmarked);
        next.add(boardId);
        setBookmarked(next);
        if (topBoards.some((tb) => tb.board_uuid === boardId))
          bumpCount(boardId, +1);
      } else {
        console.error('북마크 등록 실패:', error);
      }
    }
  }

  // 메인 그리드: 시즌 + 성별 + (다중)키워드 기준
  useEffect(() => {
    let aborted = false;

    function buildOrIlike(keys: string[]) {
      const esc = (s: string) => s.replace(/,/g, '\\,');
      return keys.map((k) => `keyword.ilike.%${esc(k)}%`).join(',');
    }

    void (async () => {
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
          .limit(60); // 넉넉히 받고 클라에서 중복 제거

        if (season) query = query.eq('season', season);
        if (userGender) query = query.eq('gender', userGender);

        if (selectedKeywords.length > 0) {
          const orStr = buildOrIlike(selectedKeywords);
          query = query.or(orStr);
        }

        const { data, error } = await query;
        if (aborted) return;

        if (error) {
          setError(error.message);
        } else {
          // 중복 제거 (여러 키워드에 걸려도 같은 게시글은 1번만)
          const unique = new Map<string, BoardBase>();
          for (const row of (data ?? []) as BoardBase[]) {
            if (!unique.has(row.board_uuid)) unique.set(row.board_uuid, row);
          }
          setBoards(Array.from(unique.values()));
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
  }, [season, userGender, selectedKeywords, supabase]);

  // 캐러셀: 지난 7일 북마크 속도 Top5 (표시는 '북마크 N'만)
  useEffect(() => {
    let aborted = false;

    void (async () => {
      try {
        setLoadingTop(true);

        const now = new Date();
        const weekAgoISO = new Date(
          now.getTime() - 7 * 24 * 60 * 60 * 1000
        ).toISOString();

        let q = supabase
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

        // 캐러셀에도 성별 필터를 적용하려면 주석 해제
        if (userGender) q = q.eq('gender', userGender);

        const { data: recentRaw, error: boardsErr } = await q;
        if (boardsErr) throw boardsErr;

        const recentBoards = (recentRaw ?? []) as BoardBase[];

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

        const { data: bmRows, error: bmErr } = await supabase
          .from('bookmark')
          .select('board_id, created_at')
          .in('board_id', ids)
          .gte('created_at', weekAgoISO);

        if (bmErr) {
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
          const key = (row as any).board_id as string;
          counts.set(key, (counts.get(key) ?? 0) + 1);
        }

        const withRate: BoardWithMetrics[] = recentBoards.map((b) => {
          const cnt = counts.get(b.board_uuid) ?? 0;
          const rate = cnt / hoursSince(b.created_at);
          return {
            ...b,
            bookmark_count_7d: cnt,
            bookmark_rate_per_hour: rate,
          };
        });

        withRate.sort(
          (a, b) => b.bookmark_rate_per_hour - a.bookmark_rate_per_hour
        );
        let top5: BoardWithMetrics[] = withRate.slice(0, 5);

        if (top5.length === 0 || top5.every((x) => x.bookmark_count_7d === 0)) {
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
          top5 = latest.map<BoardWithMetrics>((b) => ({
            ...b,
            bookmark_count_7d: 0,
            bookmark_rate_per_hour: 0,
          }));
        }

        if (!aborted) setTopBoards(top5);
      } catch {
        if (!aborted) setTopBoards([]);
      } finally {
        if (!aborted) setLoadingTop(false);
      }
    })();

    return () => {
      aborted = true;
    };
  }, [supabase, userGender]);

  // 캐러셀 아이템들의 현재 누적 북마크 수 로딩 (초기값)
  useEffect(() => {
    const ids = topBoards.map((b) => b.board_uuid);
    if (ids.length === 0) return;

    let aborted = false;
    void (async () => {
      try {
        const { data, error } = await supabase
          .from('bookmark')
          .select('board_id')
          .in('board_id', ids);

        if (!error && !aborted) {
          const m = new Map<string, number>();
          for (const r of data ?? []) {
            const id = (r as any).board_id as string;
            m.set(id, (m.get(id) ?? 0) + 1);
          }
          setBookmarkCounts((prev) => {
            const next = new Map(prev);
            for (const id of ids) next.set(id, m.get(id) ?? 0);
            return next;
          });
        }
      } catch {
        /* noop */
      }
    })();

    return () => {
      aborted = true;
    };
  }, [topBoards, supabase]);

  const placeholder = (i: number) => `/images/sample${(i % 5) + 1}.jpg`;

  return (
    <Frame paddingX={24} paddingTopY={24} color="#D2E4FB">
      <WeatherDashboard />
      <WeatherSimpleBar style={{ marginTop: 20 }} />

      <span className="inline-block text-[18px] mt-[25px] font-bold">
        이렇게 입어보는거 어떤가요?
      </span>

      {/* 캐러셀: sub에 실시간 누적 북마크 수 */}
      {!loadingTop && topBoards.length > 0 && (
        <MainCarousel
          items={topBoards.map((b, i) => ({
            id: b.board_uuid,
            image: b?.image && b.image.length > 0 ? b.image : placeholder(i),
            title: b?.text ?? '게시글',
            sub: `북마크 ${bookmarkCounts.get(b.board_uuid) ?? 0}`,
          }))}
          onItemClick={(id) => {
            const found = topBoards.find((x) => x.board_uuid === id);
            if (found) {
              _setSelectedBoard(found);
              _setModalOpen(true);
            }
          }}
          bookmarkedSet={bookmarked}
          onToggleBookmark={(id) => {
            void toggleBookmark(id);
          }}
        />
      )}

      <span className="inline-block text-[18px] mt-[25px] font-bold">
        이렇게 입어보는 것도 추천해요!
      </span>

      {/* 키워드 선택 (다중) */}
      <KeywordList
        keywords={keywords}
        selected={selectedKeywords}
        onSelect={toggleKeyword}
      />

      {loading && (
        <div className="mt-3 text-sm text-gray-500">불러오는 중…</div>
      )}
      {error && (
        <div className="mt-3 text-sm text-red-600">불러오기 실패: {error}</div>
      )}

      {!loading && !error && boards.length === 0 && (
        <div className="mt-4 text-sm text-gray-500">
          표시할 게시물이 없습니다.
        </div>
      )}

      {/* 그리드: 하트 토글(숫자 실시간 X) */}
      {!loading && !error && boards.length > 0 && (
        <div className="grid grid-cols-2 gap-2 mt-4">
          {boards.map((b, i) => {
            const src =
              b?.image && b.image.length > 0 ? b.image : placeholder(i);
            const on = bookmarked.has(b.board_uuid);

            return (
              <div
                key={b.board_uuid ?? `tmp-${i}`}
                onClick={() => handleImageClick(b)}
                className="cursor-pointer relative"
              >
                <ImageList src={src} />
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    void toggleBookmark(b.board_uuid);
                  }}
                  className="absolute bottom-2 right-2 rounded-full bg-white/80 backdrop-blur-[2px] p-1 shadow"
                  aria-label={on ? '북마크 해제' : '북마크 등록'}
                  title={on ? '북마크 해제' : '북마크 등록'}
                >
                  <Heart
                    className={
                      on ? 'w-5 h-5 text-red-500' : 'w-5 h-5 text-gray-700'
                    }
                    fill={on ? 'currentColor' : 'transparent'}
                  />
                </button>
              </div>
            );
          })}
        </div>
      )}

      <NavigationBar />

      {/* 모달 렌더링 */}
      <ImageModal
        open={_modalOpen}
        onClose={() => _setModalOpen(false)}
        data={
          _selectedBoard
            ? {
                image: _selectedBoard.image ?? null,
                text: _selectedBoard.text ?? null,
                keyword: _selectedBoard.keyword ?? null,
                created_at: _selectedBoard.created_at ?? null,
                author: {
                  username: _selectedBoard.author?.username ?? null,
                  profile_url: _selectedBoard.author?.profile_url ?? null,
                },
              }
            : undefined
        }
        isBookmarked={
          _selectedBoard ? bookmarked.has(_selectedBoard.board_uuid) : false
        }
        bookmarkCount={
          _selectedBoard
            ? (bookmarkCounts.get(_selectedBoard.board_uuid) ?? 0)
            : undefined
        }
        onToggleBookmark={() => {
          if (!_selectedBoard) return;
          const id = _selectedBoard.board_uuid;
          const wasOn = bookmarked.has(id);
          void toggleBookmark(id).then(() => {
            // 캐러셀/모달 카운트 실시간 반영
            const delta = wasOn ? -1 : +1;
            bumpCount(id, delta);
          });
        }}
      />

      <OnboardingModal
        isOpen={showOnboarding}
        onClose={() => {
          void HandleOnboardingClose();
        }}
      />
    </Frame>
  );
}
