import { create } from 'zustand';
import { Tweet, POOL_OF_TWEETS } from '@/data/tweets';

interface TweetState {
  visibleTweets: Tweet[];
  queue: Tweet[];
  initializeQueue: () => void;
  popTweet: () => void;
  addTweet: (tweet: Tweet) => void;
  clearTweets: () => void;
}

export const useTweetStore = create<TweetState>((set, get) => ({
  visibleTweets: [],
  queue: [],

  initializeQueue: () => {
    // Sort tweets by timeOffset so they appear in order
    const sortedQueue = [...POOL_OF_TWEETS].sort((a, b) => a.timeOffset - b.timeOffset);
    set({ queue: sortedQueue, visibleTweets: [] });
  },

  popTweet: () => {
    const { queue, visibleTweets } = get();
    if (queue.length > 0) {
      const tweetToPop = queue[0];
      const newQueue = queue.slice(1);
      set({
        queue: newQueue,
        visibleTweets: [tweetToPop, ...visibleTweets].slice(0, 10) // Keep max 10 tweets
      });
    }
  },

  addTweet: (tweet: Tweet) => {
    set((state) => ({
      visibleTweets: [tweet, ...state.visibleTweets].slice(0, 10)
    }));
  },

  clearTweets: () => {
    set({ visibleTweets: [], queue: [] });
  }
}));
