export interface Tweet {
  id: string;
  author: string;
  handle: string;
  avatar: string; // URL or emoji
  content: string;
  likes: number;
  retweets: number;
  timeOffset: number; // seconds after game start when it should appear, or triggered by events
}

export const POOL_OF_TWEETS: Tweet[] = [
  {
    id: "t1",
    author: "TechCrunch",
    handle: "@TechCrunch",
    avatar: "📰",
    content: "Hackathon weekend kicks off! Thousands of developers are chugging Red Bull and trying not to break production.",
    likes: 1240,
    retweets: 300,
    timeOffset: 5
  },
  {
    id: "t2",
    author: "10x Developer",
    handle: "@10xDev",
    avatar: "🤓",
    content: "If your MVP doesn't have a microservices architecture and Kubernetes cluster, are you even trying?",
    likes: 45,
    retweets: 12,
    timeOffset: 15
  },
  {
    id: "t3",
    author: "Sleep Deprived Dev",
    handle: "@NeedCoffee",
    avatar: "☕",
    content: "Why do I do this to myself? We just decided to pivot to blockchain. It's 3 AM.",
    likes: 890,
    retweets: 200,
    timeOffset: 45
  },
  {
    id: "t4",
    author: "VC Guy",
    handle: "@SiliconValleyVC",
    avatar: "💼",
    content: "Looking for the next unicorn at this hackathon. Must have AI, Web3, and a clear path to $100M ARR by next week.",
    likes: 210,
    retweets: 30,
    timeOffset: 75
  },
  {
    id: "t5",
    author: "Frontend Wizard",
    handle: "@CSSGod",
    avatar: "✨",
    content: "Spent 4 hours centering a div. The backend isn't ready anyway.",
    likes: 3200,
    retweets: 800,
    timeOffset: 120
  },
  {
    id: "t6",
    author: "Angry Mentor",
    handle: "@CodeReviewer",
    avatar: "🛑",
    content: "Just saw a team using jQuery in 2026. I'm calling the police.",
    likes: 450,
    retweets: 60,
    timeOffset: 160
  }
];
