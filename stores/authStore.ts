import { Session, User } from '@supabase/supabase-js';
import { create } from 'zustand';

import { UserProfile } from '@/lib/types';

interface AuthStoreState {
  session: Session | null;
  user: User | null;
  profile: UserProfile | null;
  joinedCommunityCount: number;
  isHydrating: boolean;
  setSnapshot: (payload: {
    session: Session | null;
    user: User | null;
    profile: UserProfile | null;
    joinedCommunityCount: number;
  }) => void;
  finishHydration: () => void;
  reset: () => void;
}

export const useAuthStore = create<AuthStoreState>((set) => ({
  session: null,
  user: null,
  profile: null,
  joinedCommunityCount: 0,
  isHydrating: true,
  setSnapshot: ({ session, user, profile, joinedCommunityCount }) =>
    set({
      session,
      user,
      profile,
      joinedCommunityCount,
      isHydrating: false,
    }),
  finishHydration: () =>
    set({
      isHydrating: false,
    }),
  reset: () =>
    set({
      session: null,
      user: null,
      profile: null,
      joinedCommunityCount: 0,
      isHydrating: false,
    }),
}));
