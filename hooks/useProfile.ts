import { useQuery } from '@tanstack/react-query';

import { supabase } from '@/lib/supabase';
import { FeedPost, Post, PostAuthorPreview, UserProfile } from '@/lib/types';

type MaybeRelation<T> = T | T[] | null;

interface ProfileStats {
  postsCount: number;
  followersCount: number;
  followingCount: number;
}

interface RawProfilePost extends Post {
  author: MaybeRelation<PostAuthorPreview>;
}

function getAspectRatioSeed(postId: string) {
  const aspectRatioOptions = [0.74, 0.82, 0.95, 1.08, 1.22, 0.68] as const;
  const total = [...postId].reduce((sum, character) => sum + character.charCodeAt(0), 0);
  return aspectRatioOptions[total % aspectRatioOptions.length];
}

function normalizeRelation<T>(relation: MaybeRelation<T>) {
  if (Array.isArray(relation)) {
    return relation[0] ?? null;
  }

  return relation ?? null;
}

async function fetchProfile(profileId: string) {
  const { data, error } = await supabase.from('users_profile').select('*').eq('id', profileId).maybeSingle();

  if (error) {
    throw error;
  }

  return (data as UserProfile | null) ?? null;
}

async function fetchProfileStats(profileId: string) {
  const [{ count: postsCount, error: postsError }, { count: followersCount, error: followersError }, { count: followingCount, error: followingError }] =
    await Promise.all([
      supabase.from('posts').select('id', { count: 'exact', head: true }).eq('author_id', profileId),
      supabase.from('follows').select('id', { count: 'exact', head: true }).eq('following_id', profileId),
      supabase.from('follows').select('id', { count: 'exact', head: true }).eq('follower_id', profileId),
    ]);

  if (postsError) {
    throw postsError;
  }

  if (followersError) {
    throw followersError;
  }

  if (followingError) {
    throw followingError;
  }

  return {
    postsCount: postsCount ?? 0,
    followersCount: followersCount ?? 0,
    followingCount: followingCount ?? 0,
  } satisfies ProfileStats;
}

async function fetchProfilePosts(profileId: string) {
  const { data, error } = await supabase
    .from('posts')
    .select(
      `
        id,
        author_id,
        title,
        description,
        images,
        medium_tags,
        subject_tags,
        community_id,
        likes_count,
        comments_count,
        created_at,
        author:users_profile!posts_author_id_fkey (
          id,
          username,
          display_name,
          avatar_url,
          is_professional
        )
      `,
    )
    .eq('author_id', profileId)
    .order('created_at', { ascending: false });

  if (error) {
    throw error;
  }

  return ((data as RawProfilePost[] | null) ?? []).map((post) => ({
    ...post,
    author: normalizeRelation(post.author),
    community: null,
    image_aspect_ratio: getAspectRatioSeed(post.id),
    preview_image_url: post.images[0] ?? null,
  })) satisfies FeedPost[];
}

export function useProfile(profileId?: string) {
  return useQuery({
    queryKey: ['profile', profileId],
    queryFn: () => fetchProfile(profileId!),
    enabled: Boolean(profileId),
  });
}

export function useProfileStats(profileId?: string) {
  return useQuery({
    queryKey: ['profile-stats', profileId],
    queryFn: () => fetchProfileStats(profileId!),
    enabled: Boolean(profileId),
    placeholderData: {
      postsCount: 0,
      followersCount: 0,
      followingCount: 0,
    },
  });
}

export function useProfilePosts(profileId?: string) {
  return useQuery({
    queryKey: ['profile-posts', profileId],
    queryFn: () => fetchProfilePosts(profileId!),
    enabled: Boolean(profileId),
    placeholderData: [],
  });
}
