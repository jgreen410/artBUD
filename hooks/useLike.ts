import * as Haptics from 'expo-haptics';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { useAuth } from '@/hooks/useAuth';
import { updatePostCaches } from '@/hooks/usePosts';
import { supabase } from '@/lib/supabase';

const buildLikeQueryKey = (postId?: string, userId?: string) => ['post-like', postId ?? 'unknown', userId ?? 'guest'];

async function fetchLikeState(postId: string, userId: string) {
  const { data, error } = await supabase
    .from('likes')
    .select('id')
    .eq('post_id', postId)
    .eq('user_id', userId)
    .maybeSingle();

  if (error) {
    throw error;
  }

  return Boolean(data);
}

export function useLike(postId?: string) {
  const queryClient = useQueryClient();
  const { user } = useAuth();
  const queryKey = buildLikeQueryKey(postId, user?.id);

  const likeStateQuery = useQuery({
    queryKey,
    queryFn: () => fetchLikeState(postId!, user!.id),
    enabled: Boolean(postId && user?.id),
    initialData: false,
  });

  const toggleLikeMutation = useMutation({
    mutationFn: async (nextLiked: boolean) => {
      if (!postId || !user) {
        throw new Error('You need an active session before liking artwork.');
      }

      if (nextLiked) {
        const { error } = await supabase.from('likes').insert({
          post_id: postId,
          user_id: user.id,
        });

        if (error) {
          throw error;
        }

        return nextLiked;
      }

      const { error } = await supabase.from('likes').delete().eq('post_id', postId).eq('user_id', user.id);

      if (error) {
        throw error;
      }

      return nextLiked;
    },
    onMutate: async (nextLiked) => {
      if (!postId) {
        return null;
      }

      await queryClient.cancelQueries({ queryKey });

      const previousLiked = queryClient.getQueryData<boolean>(queryKey) ?? false;

      queryClient.setQueryData(queryKey, nextLiked);
      updatePostCaches(queryClient, postId, (post) => ({
        ...post,
        likes_count: Math.max(0, post.likes_count + (nextLiked ? 1 : -1)),
      }));

      await Haptics.selectionAsync();

      return { previousLiked };
    },
    onError: (_error, nextLiked, context) => {
      if (!postId) {
        return;
      }

      queryClient.setQueryData(queryKey, context?.previousLiked ?? false);
      updatePostCaches(queryClient, postId, (post) => ({
        ...post,
        likes_count: Math.max(0, post.likes_count + (nextLiked ? -1 : 1)),
      }));
    },
    onSettled: async () => {
      await queryClient.invalidateQueries({ queryKey });

      if (postId) {
        await queryClient.invalidateQueries({ queryKey: ['post', postId] });
        await queryClient.invalidateQueries({ queryKey: ['posts'] });
      }
    },
  });

  return {
    isLiked: likeStateQuery.data ?? false,
    isLoading: likeStateQuery.isLoading,
    error: toggleLikeMutation.error,
    toggleLike: async () => {
      const nextLiked = !(likeStateQuery.data ?? false);
      await toggleLikeMutation.mutateAsync(nextLiked);
    },
    isPending: toggleLikeMutation.isPending,
  };
}
