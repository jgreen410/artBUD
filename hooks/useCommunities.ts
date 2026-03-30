import * as Haptics from 'expo-haptics';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/lib/supabase';
import { Community } from '@/lib/types';

const COMMUNITIES_QUERY_KEY = 'communities';

export const launchCommunitySeed: Community[] = [
  {
    id: '10000000-0000-4000-8000-000000000001',
    name: 'Painting',
    slug: 'painting',
    description:
      'Oil, acrylic, watercolor, and gouache artists sharing finished work and process-forward experiments.',
    icon_emoji: '🎨',
    cover_image_url: 'https://picsum.photos/seed/artbud-painting/1200/800',
    member_count: 0,
    is_launched: true,
    created_at: '2026-03-29T00:00:00.000Z',
  },
  {
    id: '10000000-0000-4000-8000-000000000002',
    name: 'Drawing',
    slug: 'drawing',
    description:
      'Pencil, charcoal, ink, and pastel work from sketchbook studies to polished illustration.',
    icon_emoji: '✏️',
    cover_image_url: 'https://picsum.photos/seed/artbud-drawing/1200/800',
    member_count: 0,
    is_launched: true,
    created_at: '2026-03-29T00:00:00.000Z',
  },
  {
    id: '10000000-0000-4000-8000-000000000003',
    name: 'Digital Art',
    slug: 'digital-art',
    description:
      'Illustration, 3D, concept art, and AI-assisted workflows shaped for digital makers.',
    icon_emoji: '🖥️',
    cover_image_url: 'https://picsum.photos/seed/artbud-digital/1200/800',
    member_count: 0,
    is_launched: true,
    created_at: '2026-03-29T00:00:00.000Z',
  },
  {
    id: '10000000-0000-4000-8000-000000000004',
    name: 'Photography',
    slug: 'photography',
    description:
      'Portraits, landscapes, documentary work, and experimental photography under one roof.',
    icon_emoji: '📷',
    cover_image_url: 'https://picsum.photos/seed/artbud-photo/1200/800',
    member_count: 0,
    is_launched: true,
    created_at: '2026-03-29T00:00:00.000Z',
  },
  {
    id: '10000000-0000-4000-8000-000000000005',
    name: 'Sculpture & Ceramics',
    slug: 'sculpture-ceramics',
    description:
      'Clay, stone, bronze, and functional ceramics from hobby makers to established studios.',
    icon_emoji: '🏺',
    cover_image_url: 'https://picsum.photos/seed/artbud-ceramics/1200/800',
    member_count: 0,
    is_launched: true,
    created_at: '2026-03-29T00:00:00.000Z',
  },
  {
    id: '10000000-0000-4000-8000-000000000006',
    name: 'Mixed Media & Collage',
    slug: 'mixed-media-collage',
    description:
      'Layered physical and digital compositions, collage experiments, and hybrid practices.',
    icon_emoji: '✂️',
    cover_image_url: 'https://picsum.photos/seed/artbud-mixed/1200/800',
    member_count: 0,
    is_launched: true,
    created_at: '2026-03-29T00:00:00.000Z',
  },
];

export const futureCommunitySeed: Community[] = [
  {
    id: '10000000-0000-4000-8000-000000000007',
    name: 'Printmaking & Letterpress',
    slug: 'printmaking-letterpress',
    description: 'Prints, letterpress experiments, relief techniques, and ink-forward editions.',
    icon_emoji: '🖨️',
    cover_image_url: 'https://picsum.photos/seed/artbud-print/1200/800',
    member_count: 0,
    is_launched: false,
    created_at: '2026-03-29T00:00:00.000Z',
  },
  {
    id: '10000000-0000-4000-8000-000000000008',
    name: 'Textile & Fiber Art',
    slug: 'textile-fiber-art',
    description: 'Weaving, embroidery, quilting, tufting, and material-led fiber work.',
    icon_emoji: '🧵',
    cover_image_url: 'https://picsum.photos/seed/artbud-fiber/1200/800',
    member_count: 0,
    is_launched: false,
    created_at: '2026-03-29T00:00:00.000Z',
  },
  {
    id: '10000000-0000-4000-8000-000000000009',
    name: 'Street Art & Murals',
    slug: 'street-art-murals',
    description: 'Walls, public space interventions, mural planning, and large-scale surface work.',
    icon_emoji: '🎭',
    cover_image_url: 'https://picsum.photos/seed/artbud-street/1200/800',
    member_count: 0,
    is_launched: false,
    created_at: '2026-03-29T00:00:00.000Z',
  },
  {
    id: '10000000-0000-4000-8000-000000000010',
    name: 'Calligraphy & Lettering',
    slug: 'calligraphy-lettering',
    description: 'Brush lettering, calligraphic systems, and expressive type made by hand.',
    icon_emoji: '🖋️',
    cover_image_url: 'https://picsum.photos/seed/artbud-lettering/1200/800',
    member_count: 0,
    is_launched: false,
    created_at: '2026-03-29T00:00:00.000Z',
  },
  {
    id: '10000000-0000-4000-8000-000000000011',
    name: 'Film & Video Art',
    slug: 'film-video-art',
    description: 'Moving-image practice from experimental shorts to visual essays and loops.',
    icon_emoji: '🎬',
    cover_image_url: 'https://picsum.photos/seed/artbud-film/1200/800',
    member_count: 0,
    is_launched: false,
    created_at: '2026-03-29T00:00:00.000Z',
  },
  {
    id: '10000000-0000-4000-8000-000000000012',
    name: 'Jewelry & Metalwork',
    slug: 'jewelry-metalwork',
    description: 'Wearable metal, fabrication, casting, and finely detailed small-form objects.',
    icon_emoji: '💍',
    cover_image_url: 'https://picsum.photos/seed/artbud-metal/1200/800',
    member_count: 0,
    is_launched: false,
    created_at: '2026-03-29T00:00:00.000Z',
  },
];

const allCommunitySeed = [...launchCommunitySeed, ...futureCommunitySeed];

interface JoinedCommunityRelationRow {
  community: Community | Community[] | null;
}

function normalizeCommunityRelation(row: JoinedCommunityRelationRow) {
  return Array.isArray(row.community) ? row.community[0] ?? null : row.community;
}

function updateCommunityCount(community: Community, delta: number) {
  return {
    ...community,
    member_count: Math.max(0, community.member_count + delta),
  };
}

async function fetchCommunities() {
  const { data, error } = await supabase
    .from('communities')
    .select('*')
    .eq('is_launched', true)
    .order('member_count', { ascending: false })
    .order('name', { ascending: true });

  if (error) {
    throw error;
  }

  return (data as Community[] | null) ?? [];
}

async function fetchAllCommunities() {
  const { data, error } = await supabase
    .from('communities')
    .select('*')
    .order('is_launched', { ascending: false })
    .order('member_count', { ascending: false })
    .order('name', { ascending: true });

  if (error) {
    throw error;
  }

  return (data as Community[] | null) ?? [];
}

async function fetchCommunity(communityId: string) {
  const { data, error } = await supabase
    .from('communities')
    .select('*')
    .eq('id', communityId)
    .maybeSingle();

  if (error) {
    throw error;
  }

  return (data as Community | null) ?? null;
}

async function fetchJoinedCommunities(userId: string) {
  const { data, error } = await supabase
    .from('community_members')
    .select(
      `
        community:communities!community_members_community_id_fkey (
          id,
          name,
          slug,
          description,
          icon_emoji,
          cover_image_url,
          member_count,
          is_launched,
          created_at
        )
      `,
    )
    .eq('user_id', userId)
    .order('joined_at', { ascending: true });

  if (error) {
    throw error;
  }

  return ((data as JoinedCommunityRelationRow[] | null) ?? [])
    .map(normalizeCommunityRelation)
    .filter((community): community is Community => Boolean(community));
}

export function useCommunities() {
  return useQuery({
    queryKey: [COMMUNITIES_QUERY_KEY, 'launched'],
    queryFn: fetchCommunities,
    placeholderData: launchCommunitySeed,
  });
}

export function useAllCommunities() {
  return useQuery({
    queryKey: [COMMUNITIES_QUERY_KEY, 'all'],
    queryFn: fetchAllCommunities,
    placeholderData: allCommunitySeed,
  });
}

export function useCommunity(communityId?: string) {
  return useQuery({
    queryKey: [COMMUNITIES_QUERY_KEY, 'detail', communityId],
    queryFn: () => fetchCommunity(communityId!),
    enabled: Boolean(communityId),
    placeholderData:
      communityId ? allCommunitySeed.find((community) => community.id === communityId) ?? null : null,
  });
}

export function useJoinedCommunities() {
  const { user } = useAuth();

  return useQuery({
    queryKey: [COMMUNITIES_QUERY_KEY, 'joined', user?.id ?? 'guest'],
    queryFn: () => fetchJoinedCommunities(user!.id),
    enabled: Boolean(user?.id),
    placeholderData: [],
  });
}

export function useToggleCommunityMembership() {
  const queryClient = useQueryClient();
  const { user } = useAuth();

  return useMutation({
    mutationFn: async ({ communityId, isJoined }: { communityId: string; isJoined: boolean }) => {
      if (!user) {
        throw new Error('You need an active session before changing community membership.');
      }

      if (isJoined) {
        const { error } = await supabase
          .from('community_members')
          .delete()
          .eq('community_id', communityId)
          .eq('user_id', user.id);

        if (error) {
          throw error;
        }

        return { communityId, isJoined: false };
      }

      const { error } = await supabase.from('community_members').insert({
        community_id: communityId,
        user_id: user.id,
      });

      if (error) {
        throw error;
      }

      return { communityId, isJoined: true };
    },
    onMutate: async ({ communityId, isJoined }) => {
      if (!user) {
        return null;
      }

      const delta = isJoined ? -1 : 1;
      const launchedKey = [COMMUNITIES_QUERY_KEY, 'launched'];
      const allKey = [COMMUNITIES_QUERY_KEY, 'all'];
      const joinedKey = [COMMUNITIES_QUERY_KEY, 'joined', user.id];

      await Promise.all([
        queryClient.cancelQueries({ queryKey: launchedKey }),
        queryClient.cancelQueries({ queryKey: allKey }),
        queryClient.cancelQueries({ queryKey: joinedKey }),
      ]);

      const previousLaunched = queryClient.getQueryData<Community[]>(launchedKey) ?? [];
      const previousAll = queryClient.getQueryData<Community[]>(allKey) ?? [];
      const previousJoined = queryClient.getQueryData<Community[]>(joinedKey) ?? [];
      const targetCommunity =
        previousAll.find((community) => community.id === communityId) ??
        previousLaunched.find((community) => community.id === communityId) ??
        previousJoined.find((community) => community.id === communityId) ??
        null;

      queryClient.setQueryData<Community[]>(launchedKey, (current = []) =>
        current.map((community) =>
          community.id === communityId ? updateCommunityCount(community, delta) : community,
        ),
      );

      queryClient.setQueryData<Community[]>(allKey, (current = []) =>
        current.map((community) =>
          community.id === communityId ? updateCommunityCount(community, delta) : community,
        ),
      );

      queryClient.setQueryData<Community[]>(joinedKey, (current = []) => {
        if (isJoined) {
          return current.filter((community) => community.id !== communityId);
        }

        if (!targetCommunity || current.some((community) => community.id === communityId)) {
          return current;
        }

        return [...current, updateCommunityCount(targetCommunity, delta)];
      });

      await Haptics.selectionAsync();

      return {
        previousLaunched,
        previousAll,
        previousJoined,
        launchedKey,
        allKey,
        joinedKey,
      };
    },
    onError: (_error, _variables, context) => {
      if (!context) {
        return;
      }

      queryClient.setQueryData(context.launchedKey, context.previousLaunched);
      queryClient.setQueryData(context.allKey, context.previousAll);
      queryClient.setQueryData(context.joinedKey, context.previousJoined);
    },
    onSettled: async () => {
      if (!user) {
        return;
      }

      await Promise.all([
        queryClient.invalidateQueries({ queryKey: [COMMUNITIES_QUERY_KEY] }),
        queryClient.invalidateQueries({ queryKey: [COMMUNITIES_QUERY_KEY, 'joined', user.id] }),
      ]);
    },
  });
}
