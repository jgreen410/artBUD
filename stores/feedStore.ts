import { create } from 'zustand';

interface FeedStoreState {
  selectedCommunityId: string | null;
  myFeedSelectedCommunityId: string | null;
  homeScrollOffset: number;
  myFeedScrollOffset: number;
  setSelectedCommunityId: (communityId: string | null) => void;
  setMyFeedSelectedCommunityId: (communityId: string | null) => void;
  setHomeScrollOffset: (offset: number) => void;
  setMyFeedScrollOffset: (offset: number) => void;
}

export const useFeedStore = create<FeedStoreState>((set) => ({
  selectedCommunityId: null,
  myFeedSelectedCommunityId: null,
  homeScrollOffset: 0,
  myFeedScrollOffset: 0,
  setSelectedCommunityId: (selectedCommunityId) =>
    set({
      selectedCommunityId,
    }),
  setMyFeedSelectedCommunityId: (myFeedSelectedCommunityId) =>
    set({
      myFeedSelectedCommunityId,
    }),
  setHomeScrollOffset: (homeScrollOffset) =>
    set({
      homeScrollOffset,
    }),
  setMyFeedScrollOffset: (myFeedScrollOffset) =>
    set({
      myFeedScrollOffset,
    }),
}));
