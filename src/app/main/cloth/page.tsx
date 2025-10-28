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

async function attachAuthors(
  supabase: ReturnType<typeof CreateClient>,
  rows: Array<{
    board_uuid: string;
    created_at: string;
    user_id: string;
    image: string | null;
    text: string;
    keyword: string | null;
    gender: string | null;
    season: string | null;
  }>
): Promise<BoardBase[]> {
  const ids = Array.from(new Set(rows.map(r => r.user_id).filter(Boolean)));
  if (ids.length === 0) {
    return rows.map(r => ({
      ...r,
      author: { id: r.user_id, username: null, profile_url: null },
    })) as BoardBase[];
  }

  const { data: profiles } = await supabase
    .from('profiles')
    .select('id, username, profile_url')
    .in('id', ids);

  const map = new Map<string, Profile>();
  for (const p of profiles ?? []) {
    const pr = p as unknown as Profile;
    map.set(pr.id, pr);
  }

  return rows.map(r => ({
    ...r,
    author:
      map.get(r.user_id) ?? { id: r.user_id, username: null, profile_url: null },
  })) as BoardBase[];
}

export default function LandingPage() {
  const router = useRouter();
  const supabase = CreateClient();

  const [showOnboarding, setShowOnboarding] = useState(false);

  const [_modalOpen, _setModalOpen] = useState(false);
  const [_selectedBoard, _setSelectedBoard] = useState<BoardBase | null>(null);

  const [boards, setBoards] = useState<BoardBase[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [topBoards, setTopBoards] = useState<BoardWithMetrics[]>([]);
  const [loadingTop, setLoadingTop] = useState(true);

  const [me, setMe] = useState<string | null>(null);
  const [userGender, setUserGender] = useState<string | null>(null);

  const [bookmarked, setBookmarked] = useState<Set<string>>(new Set());

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

  const currentTemp = useWeatherStore((s) => s.currentTemp);
  const season = useMemo(() => getSeasonEN(currentTemp), [currentTemp]);

  useEffect(() => {
    let unsub: { unsubscribe: () => void } | null = null;

    void (async () => {
      const { data, error } = await supabase.auth.getUser();
      if (!error && data.user) {
        setMe(data.user.id);

        const { data: profile } = await supabase
          .from('profiles')
          .select('gender')
          .eq('id', data.user.id)
          .single();
        setUserGender(profile?.gender ?? null);

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
            season
          `
          )
          .order('created_at', { ascending: false })
          .limit(60);

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
          const unique = new Map<string, any>();
          for (const row of data ?? []) {
            if (!unique.has(row.board_uuid)) unique.set(row.board_uuid, row);
          }
          const cleaned = Array.from(unique.values());
          const withAuthor = await attachAuthors(supabase, cleaned);
          setBoards(withAuthor);
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
            season
          `
          )
          .gte('created_at', weekAgoISO)
          .order('created_at', { ascending: false })
          .limit(200);

        if (userGender) q = q.eq('gender', userGender);

        const { data: recentRaw, error: boardsErr } = await q;
        if (boardsErr) throw boardsErr;

        const recentBoardsRaw =
          (recentRaw ?? []) as unknown as Omit<BoardBase, 'author'>[];

        if (recentBoardsRaw.length === 0) {
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
              season
            `
            )
            .order('created_at', { ascending: false })
            .limit(5);

          if (latestErr) throw latestErr;

          const latestRawRows =
            (latestRaw ?? []) as unknown as Omit<BoardBase, 'author'>[];
          const latestWithAuthor = await attachAuthors(supabase, latestRawRows);

          if (!aborted) {
            setTopBoards(
              latestWithAuthor.map<BoardWithMetrics>((b) => ({
                ...b,
                bookmark_count_7d: 0,
                bookmark_rate_per_hour: 0,
              }))
            );
          }
          return;
        }

        const recentWithAuthor = await attachAuthors(supabase, recentBoardsRaw);
        const ids = recentWithAuthor.map((b) => b.board_uuid);

        const { data: bmRows } = await supabase
          .from('bookmark')
          .select('board_id, created_at')
          .in('board_id', ids)
          .gte('created_at', weekAgoISO);

        const counts = new Map<string, number>();
        for (const row of bmRows ?? []) {
          const key = (row as any).board_id as string;
          counts.set(key, (counts.get(key) ?? 0) + 1);
        }

        const withRate: BoardWithMetrics[] = recentWithAuthor.map((b) => {
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
              season
            `
            )
            .order('created_at', { ascending: false })
            .limit(5);

          const latestRawRows =
            (latestRaw ?? []) as unknown as Omit<BoardBase, 'author'>[];
          const latestWithAuthor = await attachAuthors(supabase, latestRawRows);

          top5 = latestWithAuthor.map<BoardWithMetrics>((b) => ({
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
            ? bookmarkCounts.get(_selectedBoard.board_uuid) ?? 0
            : undefined
        }
        onToggleBookmark={() => {
          if (!_selectedBoard) return;
          const id = _selectedBoard.board_uuid;
          const wasOn = bookmarked.has(id);
          void toggleBookmark(id);
          {/*
          void toggleBookmark(id).then(() => {
            const delta = wasOn ? -1 : +1;
            bumpCount(id, delta);
          });
          */}
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
