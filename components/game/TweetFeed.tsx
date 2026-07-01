'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageSquare, Heart, Repeat2 } from 'lucide-react';
import { useTweetStore } from '@/store/tweetStore';
import { useGameStore } from '@/store/gameStore';
import { playSubtleHover } from '@/lib/sound';

export default function TweetFeed() {
  const { visibleTweets, queue, popTweet, initializeQueue, addTweet } = useTweetStore();
  const timeRemaining = useGameStore((s) => s.timeRemaining);
  const totalTime = useGameStore((s) => s.totalTime);
  const phase = useGameStore((s) => s.phase);
  const playerName = useGameStore((s) => s.playerName) || 'Team Lead';
  
  const [tweetInput, setTweetInput] = useState('');
  const [isGettingNews, setIsGettingNews] = useState(false);
  
  // Calculate elapsed time in seconds
  const elapsedTime = totalTime > 0 ? (totalTime - timeRemaining) : 0;

  const handlePostTweet = (e: React.FormEvent) => {
    e.preventDefault();
    if (!tweetInput.trim()) return;
    addTweet({
      id: `custom-tweet-${Date.now()}`,
      author: playerName,
      handle: '@lead_builder',
      content: tweetInput,
      avatar: '👨‍💻',
      likes: Math.floor(Math.random() * 15),
      retweets: 0,
      timeOffset: 0,
      phase: phase
    });
    setTweetInput('');
  };

  const handleGetNews = () => {
    setIsGettingNews(true);
    addTweet({
      id: `news-loading-${Date.now()}`,
      author: 'Tech News Bot',
      handle: '@technews',
      content: '📡 Scanning the hackathon floor for breaking news...',
      avatar: '🤖',
      likes: 0,
      retweets: 0,
      timeOffset: 0,
      phase: phase
    });
    setTimeout(() => {
      addTweet({
        id: `news-update-${Date.now()}`,
        author: 'Tech News Bot',
        handle: '@technews',
        content: `🚨 UPDATE: Teams are moving fast! Just saw an incredible ${phase || 'project'} being built. The energy is insane! 🔥`,
        avatar: '🤖',
        likes: Math.floor(Math.random() * 50) + 10,
        retweets: Math.floor(Math.random() * 5),
        timeOffset: 0,
        phase: phase
      });
      setIsGettingNews(false);
    }, 1500);
  };

  useEffect(() => {
    // Initialize queue when entering a gameplay phase
    if (phase !== 'LOBBY' && queue.length === 0 && visibleTweets.length === 0) {
      initializeQueue();
    }
  }, [phase, initializeQueue, queue.length, visibleTweets.length]);

  useEffect(() => {
    // Check if we should pop a tweet based on elapsed time
    if (queue.length > 0) {
      const nextTweet = queue[0];
      if (elapsedTime >= nextTweet.timeOffset) {
        popTweet();
        playSubtleHover();
      }
    }
  }, [elapsedTime, queue, popTweet]);

  if (phase === 'LOBBY' || phase === 'RESULTS') {
    return null;
  }

  return (
    <div className="w-full h-full flex flex-col bg-white/40 backdrop-blur-md border-l border-neutral-200/50 p-4 overflow-hidden rounded-xl md:rounded-none">
      <div className="flex items-center justify-between gap-2 mb-4 pb-2 border-b border-neutral-200">
        <div className="flex items-center gap-2">
          <MessageSquare className="w-5 h-5 text-blue-500" />
          <h3 className="font-bold text-neutral-800 tracking-tight">Tech Twitter</h3>
        </div>
        <button
          onClick={handleGetNews}
          disabled={isGettingNews}
          className="text-[10px] bg-blue-50 text-blue-600 font-bold px-2 py-1 rounded border border-blue-200 hover:bg-blue-100 disabled:opacity-50 uppercase"
        >
          {isGettingNews ? '...' : 'Get News Update'}
        </button>
      </div>
      
      <div className="flex-1 overflow-y-auto no-scrollbar space-y-4">
        <AnimatePresence initial={false}>
          {visibleTweets.map((tweet) => (
            <motion.div
              key={tweet.id}
              initial={{ opacity: 0, height: 0, scale: 0.9, y: -20 }}
              animate={{ opacity: 1, height: 'auto', scale: 1, y: 0 }}
              exit={{ opacity: 0, height: 0, scale: 0.9 }}
              transition={{ duration: 0.3, type: "spring", bounce: 0.3 }}
              className="p-3 bg-white border border-neutral-100 rounded-lg shadow-sm"
            >
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-full bg-neutral-100 flex items-center justify-center text-xl shrink-0">
                  {tweet.avatar}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1.5">
                    <span className="font-bold text-sm text-neutral-900 truncate">{tweet.author}</span>
                    <span className="text-xs text-neutral-500 truncate">{tweet.handle}</span>
                  </div>
                  <p className="text-sm text-neutral-700 mt-1 mb-2 leading-snug">
                    {tweet.content}
                  </p>
                  <div className="flex items-center gap-4 text-xs text-neutral-500">
                    <button className="flex items-center gap-1 hover:text-blue-500 transition-colors">
                      <MessageSquare className="w-3 h-3" />
                      <span>Reply</span>
                    </button>
                    <button className="flex items-center gap-1 hover:text-green-500 transition-colors">
                      <Repeat2 className="w-3 h-3" />
                      <span>{tweet.retweets}</span>
                    </button>
                    <button className="flex items-center gap-1 hover:text-red-500 transition-colors">
                      <Heart className="w-3 h-3" />
                      <span>{tweet.likes}</span>
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
        
        {visibleTweets.length === 0 && (
          <div className="text-center text-neutral-400 text-sm mt-10">
            Waiting for updates...
          </div>
        )}
      </div>

      <div className="mt-4 pt-3 border-t border-neutral-200 shrink-0">
        <form onSubmit={handlePostTweet} className="flex gap-2">
          <input
            type="text"
            value={tweetInput}
            onChange={(e) => setTweetInput(e.target.value)}
            placeholder="Post an update..."
            className="flex-1 text-[11px] font-sans bg-white border border-neutral-300 rounded px-3 py-1.5 focus:outline-none focus:border-blue-500"
          />
          <button
            type="submit"
            disabled={!tweetInput.trim()}
            className="bg-blue-500 text-white rounded px-3 text-[10px] font-bold cursor-pointer hover:bg-blue-600 disabled:opacity-50 transition-colors uppercase"
          >
            Post
          </button>
        </form>
      </div>
    </div>
  );
}
