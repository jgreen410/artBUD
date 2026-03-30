import {
  InfiniteData,
  QueryClient,
  useInfiniteQuery,
  useMutation,
  useQuery,
  useQueryClient,
} from '@tanstack/react-query';
import * as Haptics from 'expo-haptics';

import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/lib/supabase';
import { Comment, CommentWithAuthor, FeedPost, Post, PostAuthorPreview, PostDetail } from '@/lib/types';
import { LocalImageAsset, uploadPostImages } from '@/utils/imageUpload';

const PAGE_SIZE = 20;
const aspectRatioOptions = [0.74, 0.82, 0.95, 1.08, 1.22, 0.68] as const;

const POSTS_QUERY_KEY = 'posts';
const POST_QUERY_KEY = 'post';
const POST_COMMENTS_QUERY_KEY = 'post-comments';

type MaybeRelation<T> = T | T[] | null;

interface RawFeedPost extends Post {
  author: MaybeRelation<NonNullable<FeedPost['author']>>;
  community: MaybeRelation<NonNullable<FeedPost['community']>>;
}

interface RawComment extends Comment {
  author: MaybeRelation<PostAuthorPreview>;
}

interface PostsPage {
  items: FeedPost[];
  nextPage: number | null;
}

interface CreatePostInput {
  title: string;
  description?: string;
  communityId: string;
  mediumTags: string[];
  subjectTags: string[];
  images: LocalImageAsset[];
}

interface PostFeedFilters {
  communityId?: string | null;
  communityIds?: string[];
}

function getAspectRatioSeed(postId: string) {
  const total = [...postId].reduce((sum, character) => sum + character.charCodeAt(0), 0);
  return aspectRatioOptions[total % aspectRatioOptions.length];
}

function normalizeRelation<T>(relation: MaybeRelation<T>) {
  if (Array.isArray(relation)) {
    return relation[0] ?? null;
  }

  return relation ?? null;
}

function mapRawPost(post: RawFeedPost): FeedPost {
  return {
    ...post,
    author: normalizeRelation(post.author),
    community: normalizeRelation(post.community),
    image_aspect_ratio: getAspectRatioSeed(post.id),
    preview_image_url: post.images[0] ?? null,
  };
}

function mapRawComment(comment: RawComment): CommentWithAuthor {
  return {
    ...comment,
    author: normalizeRelation(comment.author),
  };
}

export function updatePostCaches(
  queryClient: QueryClient,
  postId: string,
  updater: (post: FeedPost) => FeedPost,
) {
  queryClient.setQueryData<PostDetail | null>([POST_QUERY_KEY, postId], (current) =>
    current ? updater(current) : current,
  );

  queryClient.setQueriesData<InfiniteData<PostsPage>>({ queryKey: [POSTS_QUERY_KEY] }, (current) => {
    if (!current) {
      return current;
    }

    return {
      ...current,
      pages: current.pages.map((page) => ({
        ...page,
        items: page.items.map((post) => (post.id === postId ? updater(post) : post)),
      })),
    };
  });
}

async function fetchPostsPage(page: number, filters: PostFeedFilters) {
  const { communityId = null, communityIds = [] } = filters;
  let query = supabase
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
        ),
        community:communities!posts_community_id_fkey (
          id,
          name,
          slug,
          icon_emoji
        )
      `,
    )
    .order('created_at', { ascending: false })
    .range(page * PAGE_SIZE, page * PAGE_SIZE + PAGE_SIZE - 1);

  if (communityId) {
    query = query.eq('community_id', communityId);
  } else if (communityIds.length > 0) {
    query = query.in('community_id', communityIds);
  }

  const { data, error } = await query;

  if (error) {
    throw error;
  }

  const rows = (data as RawFeedPost[] | null) ?? [];
  const items = rows.map(mapRawPost);

  return {
    items,
    nextPage: rows.length < PAGE_SIZE ? null : page + 1,
  } satisfies PostsPage;
}

async function fetchPostDetail(postId: string) {
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
        ),
        community:communities!posts_community_id_fkey (
          id,
          name,
          slug,
          icon_emoji
        )
      `,
    )
    .eq('id', postId)
    .maybeSingle();

  if (error) {
    throw error;
  }

  if (!data) {
    return null;
  }

  return mapRawPost(data as RawFeedPost);
}

async function fetchPostComments(postId: string) {
  const { data, error } = await supabase
    .from('comments')
    .select(
      `
        id,
        post_id,
        author_id,
        text,
        created_at,
        author:users_profile!comments_author_id_fkey (
          id,
          username,
          display_name,
          avatar_url,
          is_professional
        )
      `,
    )
    .eq('post_id', postId)
    .order('created_at', { ascending: true });

  if (error) {
    throw error;
  }

  return ((data as RawComment[] | null) ?? []).map(mapRawComment);
}

export function usePosts(communityId: string | null) {
  return useInfiniteQuery({
    initialPageParam: 0,
    queryKey: [POSTS_QUERY_KEY, communityId ?? 'all'],
    queryFn: ({ pageParam }) => fetchPostsPage(pageParam, { communityId }),
    getNextPageParam: (lastPage) => lastPage.nextPage,
  });
}

export function usePostsForCommunities(communityIds: string[]) {
  return useInfiniteQuery({
    initialPageParam: 0,
    queryKey: [POSTS_QUERY_KEY, 'joined', ...communityIds],
    queryFn: ({ pageParam }) => fetchPostsPage(pageParam, { communityIds }),
    enabled: communityIds.length > 0,
    getNextPageParam: (lastPage) => lastPage.nextPage,
  });
}

export function usePostDetail(postId?: string) {
  return useQuery({
    queryKey: [POST_QUERY_KEY, postId],
    queryFn: () => fetchPostDetail(postId!),
    enabled: Boolean(postId),
  });
}

export function usePostComments(postId?: string) {
  return useQuery({
    queryKey: [POST_COMMENTS_QUERY_KEY, postId],
    queryFn: () => fetchPostComments(postId!),
    enabled: Boolean(postId),
  });
}

export function useAddComment(postId?: string) {
  const queryClient = useQueryClient();
  const { profile, user } = useAuth();

  return useMutation({
    mutationFn: async (text: string) => {
      if (!postId || !user) {
        throw new Error('You need an account session before leaving a comment.');
      }

      const sanitizedText = text.trim();

      if (!sanitizedText) {
        throw new Error('Write a comment before posting it.');
      }

      const { data, error } = await supabase
        .from('comments')
        .insert({
          post_id: postId,
          author_id: user.id,
          text: sanitizedText,
        })
        .select('id, post_id, author_id, text, created_at')
        .single<Comment>();

      if (error) {
        throw error;
      }

      return data;
    },
    onSuccess: (comment) => {
      if (!postId) {
        return;
      }

      void Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);

      const localComment: CommentWithAuthor = {
        ...comment,
        author: profile
          ? {
              id: profile.id,
              username: profile.username,
              display_name: profile.display_name,
              avatar_url: profile.avatar_url,
              is_professional: profile.is_professional,
            }
          : null,
      };

      queryClient.setQueryData<CommentWithAuthor[]>(
        [POST_COMMENTS_QUERY_KEY, postId],
        (current = []) => [...current, localComment],
      );

      updatePostCaches(queryClient, postId, (post) => ({
        ...post,
        comments_count: post.comments_count + 1,
      }));

      void queryClient.invalidateQueries({ queryKey: [POST_QUERY_KEY, postId] });
      void queryClient.invalidateQueries({ queryKey: [POST_COMMENTS_QUERY_KEY, postId] });
    },
  });
}

export function useCreatePost() {
  const queryClient = useQueryClient();
  const { user } = useAuth();

  return useMutation({
    mutationFn: async ({
      title,
      description,
      communityId,
      mediumTags,
      subjectTags,
      images,
    }: CreatePostInput) => {
      if (!user) {
        throw new Error('You need an active session before publishing artwork.');
      }

      if (!title.trim()) {
        throw new Error('Add a title before publishing.');
      }

      if (!communityId) {
        throw new Error('Choose one of your joined communities before publishing.');
      }

      if (images.length < 1) {
        throw new Error('Add at least one artwork image before publishing.');
      }

      const uploadedImageUrls = await uploadPostImages(user.id, images);

      const { data, error } = await supabase
        .from('posts')
        .insert({
          author_id: user.id,
          title: title.trim(),
          description: description?.trim() || null,
          images: uploadedImageUrls,
          medium_tags: mediumTags,
          subject_tags: subjectTags,
          community_id: communityId,
        })
        .select('id')
        .single<{ id: string }>();

      if (error) {
        throw error;
      }

      return data.id;
    },
    onSuccess: async (postId) => {
      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: [POSTS_QUERY_KEY] }),
        queryClient.invalidateQueries({ queryKey: [POST_QUERY_KEY, postId] }),
        queryClient.invalidateQueries({ queryKey: ['communities', 'joined'] }),
      ]);
    },
  });
}
