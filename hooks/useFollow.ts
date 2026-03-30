import * as Haptics from 'expo-haptics';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/lib/supabase';

const buildFollowQueryKey = (targetUserId?: string, viewerId?: string) => [
  'profile-follow',
  targetUserId ?? 'unknown',
  viewerId ?? 'guest',
];

async function fetchFollowState(targetUserId: string, viewerId: string) {
  const { data, error } = await supabase
    .from('follows')
    .select('id')
    .eq('follower_id', viewerId)
    .eq('following_id', targetUserId)
    .maybeSingle();

  if (error) {
    throw error;
  }

  return Boolean(data);
}

export function useFollow(targetUserId?: string) {
  const queryClient = useQueryClient();
  const { user } = useAuth();
  const queryKey = buildFollowQueryKey(targetUserId, user?.id);
  const canFollow = Boolean(targetUserId && user?.id && user.id !== targetUserId);

  const followStateQuery = useQuery({
    queryKey,
    queryFn: () => fetchFollowState(targetUserId!, user!.id),
    enabled: canFollow,
    initialData: false,
  });

  const toggleFollowMutation = useMutation({
    mutationFn: async (nextFollowing: boolean) => {
      if (!targetUserId || !user) {
        throw new Error('You need an active session before following artists.');
      }

      if (nextFollowing) {
        const { error } = await supabase.from('follows').insert({
          follower_id: user.id,
          following_id: targetUserId,
        });

        if (error) {
          throw error;
        }

        return nextFollowing;
      }

      const { error } = await supabase
        .from('follows')
        .delete()
        .eq('follower_id', user.id)
        .eq('following_id', targetUserId);

      if (error) {
        throw error;
      }

      return nextFollowing;
    },
    onMutate: async (nextFollowing) => {
      await queryClient.cancelQueries({ queryKey });
      const previousFollowing = queryClient.getQueryData<boolean>(queryKey) ?? false;
      queryClient.setQueryData(queryKey, nextFollowing);
      await Haptics.selectionAsync();
      return { previousFollowing };
    },
    onError: (_error, _nextFollowing, context) => {
      queryClient.setQueryData(queryKey, context?.previousFollowing ?? false);
    },
    onSettled: async () => {
      await queryClient.invalidateQueries({ queryKey });

      if (targetUserId) {
        await queryClient.invalidateQueries({ queryKey: ['profile-stats', targetUserId] });
      }

      if (user?.id) {
        await queryClient.invalidateQueries({ queryKey: ['profile-stats', user.id] });
      }
    },
  });

  return {
    canFollow,
    isFollowing: canFollow ? followStateQuery.data ?? false : false,
    isLoading: followStateQuery.isLoading,
    error: toggleFollowMutation.error,
    toggleFollow: async () => {
      if (!canFollow) {
        return;
      }

      const nextFollowing = !(followStateQuery.data ?? false);
      await toggleFollowMutation.mutateAsync(nextFollowing);
    },
    isPending: toggleFollowMutation.isPending,
  };
}
