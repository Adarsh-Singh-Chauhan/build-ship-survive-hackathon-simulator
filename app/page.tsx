"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  Terminal,
  Clock,
  ChevronRight,
  Code2,
  Cpu,
  Layers,
  Shield,
  Sparkles,
  Trophy,
  Users,
  Rocket,
  Timer,
  Crown,
  Zap,
  Star,
  Target,
  Sun,
  Moon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useGameStore } from "@/store/gameStore";
import { playMutedClick, playSubtleHover } from "@/lib/sound";
import { PROBLEMS } from "@/data/problems";
import { JUDGES } from "@/data/judges";
import { TECH_POOL } from "@/data/techItems";
import ParticleBackground from "@/components/game/ParticleBackground";

// ─── Animated Counter Hook ─────────────────────────────────────────────────
function useCountUp(target: number, duration: number = 2000, delay: number = 0) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    const timeout = setTimeout(() => {
      let start = 0;
      const step = target / (duration / 16);
      const interval = setInterval(() => {
        start += step;
        if (start >= target) {
          setCount(target);
          clearInterval(interval);
        } else {
          setCount(Math.floor(start));
        }
      }, 16);
      return () => clearInterval(interval);
    }, delay);
    return () => clearTimeout(timeout);
  }, [target, duration, delay]);
  return count;
}

// ─── Typewriter Effect ─────────────────────────────────────────────────────
const TAGLINES = [
  "BUILD. SHIP. SURVIVE.",
  "IDEATE. EXECUTE. PITCH.",
  "HACK. ITERATE. WIN.",
  "CODE. COMPETE. CONQUER.",
];

function TypewriterTitle() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [displayText, setDisplayText] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const currentTagline = TAGLINES[currentIndex];
    const speed = isDeleting ? 40 : 80;

    if (!isDeleting && displayText === currentTagline) {
      const timeout = setTimeout(() => setIsDeleting(true), 2500);
      return () => clearTimeout(timeout);
    }

    if (isDeleting && displayText === "") {
      setIsDeleting(false);
      setCurrentIndex((prev) => (prev + 1) % TAGLINES.length);
      return;
    }

    const timeout = setTimeout(() => {
      setDisplayText(
        isDeleting
          ? currentTagline.substring(0, displayText.length - 1)
          : currentTagline.substring(0, displayText.length + 1)
      );
    }, speed);

    return () => clearTimeout(timeout);
  }, [displayText, isDeleting, currentIndex]);

  // Split displayed text to highlight the last word differently
  const words = displayText.split(". ").filter(Boolean);
  
  return (
    <h1 className="text-3xl sm:text-5xl md:text-6xl font-black font-sans tracking-tight text-neutral-900 dark:text-neutral-100 uppercase leading-none min-h-[1.2em]">
      {words.map((word, i) => (
        <span key={i}>
          {i === words.length - 1 ? (
            <span className="text-neutral-400 dark:text-neutral-500 font-light">{word}</span>
          ) : (
            <span>{word}. </span>
          )}
        </span>
      ))}
      <span className="inline-block w-[3px] h-[0.8em] bg-neutral-900 dark:bg-neutral-100 ml-1 animate-pulse align-middle" />
    </h1>
  );
}

// ─── Animated Countdown ────────────────────────────────────────────────────
function HackathonCountdown() {
  const [time, setTime] = useState({ hours: 36, minutes: 0, seconds: 0 });

  useEffect(() => {
    const interval = setInterval(() => {
      setTime((prev) => {
        let { hours, minutes, seconds } = prev;
        seconds--;
        if (seconds < 0) {
          seconds = 59;
          minutes--;
        }
        if (minutes < 0) {
          minutes = 59;
          hours--;
        }
        if (hours < 0) {
          hours = 35;
          minutes = 59;
          seconds = 59;
        }
        return { hours, minutes, seconds };
      });
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const pad = (n: number) => String(n).padStart(2, "0");

  return (
    <div className="flex items-center gap-1.5 font-mono text-sm select-none">
      <div className="flex items-center gap-1">
        <span className="inline-flex items-center justify-center w-9 h-9 rounded-md bg-neutral-900 dark:bg-neutral-100 text-white dark:text-neutral-900 font-black text-lg tabular-nums">
          {pad(time.hours)}
        </span>
        <span className="text-neutral-400 font-bold animate-pulse">:</span>
        <span className="inline-flex items-center justify-center w-9 h-9 rounded-md bg-neutral-900 dark:bg-neutral-100 text-white dark:text-neutral-900 font-black text-lg tabular-nums">
          {pad(time.minutes)}
        </span>
        <span className="text-neutral-400 font-bold animate-pulse">:</span>
        <span className="inline-flex items-center justify-center w-9 h-9 rounded-md bg-neutral-900 dark:bg-neutral-100 text-white dark:text-neutral-900 font-black text-lg tabular-nums">
          {pad(time.seconds)}
        </span>
      </div>
      <span className="text-[9px] text-neutral-500 dark:text-neutral-400 uppercase tracking-widest font-bold ml-2">
        Remaining
      </span>
    </div>
  );
}

/** Stagger animation container variant */
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.1,
    },
  },
};

/** Fade-up animation for children */
const itemVariants = {
  hidden: { opacity: 0, y: 12 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.4, ease: [0.16, 1, 0.3, 1] as const },
  },
};

export default function LandingPage() {
  const router = useRouter();
  const resetGame = useGameStore((s) => s.resetGame);
  const setGameMode = useGameStore((s) => s.setGameMode);
  const theme = useGameStore((s) => s.theme);
  const toggleTheme = useGameStore((s) => s.toggleTheme);

  const [isLocal, setIsLocal] = useState(false);
  useEffect(() => {
    if (typeof window !== "undefined") {
      setIsLocal(
        window.location.hostname === "localhost" ||
        window.location.hostname === "127.0.0.1"
      );
    }
  }, []);

  // Animated counters
  const problemCount = useCountUp(22, 1500, 500);
  const techCount = useCountUp(114, 2000, 700);
  const judgeCount = useCountUp(5, 800, 900);

  const handleLaunch = () => {
    playMutedClick();
    resetGame();
    setGameMode("classic");
    router.push("/game");
  };

  const handleDebugSkip = () => {
    playMutedClick();
    
    // Pick a random problem
    const randomProblem = PROBLEMS[Math.floor(Math.random() * PROBLEMS.length)];
    
    // Choose Node.js and Next.js from tech pool, or mock them
    const nextTech = TECH_POOL.find(t => t.id === 'tech-next') || {
      id: 'tech-next',
      name: 'Next.js',
      icon: 'layers',
      category: 'frontend',
      difficulty: 2,
      synergies: ['tech-vercel', 'tech-supabase', 'tech-openai'],
    };
    
    const nodeTech = TECH_POOL.find(t => t.id === 'tech-node') || {
      id: 'tech-node',
      name: 'Node.js',
      icon: 'server',
      category: 'backend',
      difficulty: 2,
      synergies: ['tech-react', 'tech-mongodb', 'tech-docker'],
    };

    const vercelTech = TECH_POOL.find(t => t.id === 'tech-vercel') || {
      id: 'tech-vercel',
      name: 'Vercel',
      icon: 'cloud',
      category: 'devops',
      difficulty: 1,
      synergies: ['tech-next', 'tech-react'],
    };

    const postgresTech = TECH_POOL.find(t => t.id === 'tech-postgres') || {
      id: 'tech-postgres',
      name: 'PostgreSQL',
      icon: 'database',
      category: 'database',
      difficulty: 3,
      synergies: ['tech-fastapi', 'tech-supabase', 'tech-aws'],
    };

    const mockTechStack = [nextTech, nodeTech, vercelTech, postgresTech] as any[];

    // Pick a judge
    const mockJudge = JUDGES[0] || {
      id: 'judge-builder',
      name: 'Uday Sharma',
      avatar: '🔥',
      title: 'EdTech Creator & Hackathon Specialist',
      personality: 'technical',
    };

    // Features
    const mockFeatures = [
      {
        id: 'feat-1',
        name: 'Core Adaptation Engine',
        description: 'Dynamically adapts user experience in real-time based on tracking parameters.',
        effort: 'high',
        impact: 'high',
      },
      {
        id: 'feat-2',
        name: 'Real-Time Telemetry Dashboard',
        description: 'Sleek visual representation of the prototype pipeline outputs.',
        effort: 'medium',
        impact: 'high',
      },
      {
        id: 'feat-3',
        name: 'Offline-First Sandbox Cache',
        description: 'Saves full workspace logic inside the client cache.',
        effort: 'low',
        impact: 'medium',
      }
    ] as any[];

    // Update the Zustand store using setState
    useGameStore.setState({
      stage: 'results',
      phase: 'RESULTS',
      isGameStarted: true,
      isGameOver: true,
      isTimerPaused: true,
      selectedProblem: randomProblem,
      solutionDirection: `We built a web application powered by a Next.js frontend combined with a robust Node.js server to solve the core challenges of ${randomProblem.title}.`,
      techStack: mockTechStack,
      usp: 'Ultra-low latency real-time telemetry rendering with automated sandboxed isolation.',
      features: mockFeatures,
      mentorName: 'Dr. Priya Kapoor',
      businessModel: 'SaaS monthly subscriptions with flexible tiered enterprise pricing.',
      pitchText: `Our product solves the core problems of ${randomProblem.title} by using Next.js for high-fidelity interactive client routing, coupled with Node.js on the backend. This allows instantaneous response tracking and complete runtime isolation.`,
      score: {
        innovation: 23,
        execution: 24,
        design: 21,
        pitch: 22,
        bonus: 5,
        total: 95
      },
      currentJudge: mockJudge as any,
      judgeFeedback: [
        {
          judgeId: mockJudge.id,
          score: 95,
          comment: `Superb execution! The Next.js and Node.js synergy is beautifully justified here, and the architecture is remarkably clean and scalable.`,
          highlight: 'Outstanding code quality, modern layout aesthetics, and clear monetization workflows.'
        }
      ],
      chaosHistory: ['api-rate-limit-resolved', 'database-crash-survived'],
      difficulty: 'easy',
      gameMode: 'classic',
      activeModifiers: []
    });

    router.push("/game");
  };

  const isDark = theme === 'dark';

  return (
    <div className="relative min-h-screen flex flex-col overflow-hidden bg-[#fafaf8] dark:bg-[#0a0a0b] text-neutral-900 dark:text-neutral-100 font-mono text-xs transition-colors duration-300">
      {/* Particle Background */}
      <ParticleBackground isDark={isDark} />
      
      <div className="absolute inset-0 grid-pattern pointer-events-none z-0 opacity-[0.4] dark:opacity-[0.15]" />

      {/* Navigation Header */}
      <nav className="relative z-10 flex items-center justify-between px-6 md:px-12 py-4 border-b border-neutral-200 dark:border-neutral-800 bg-[#fafaf8]/50 dark:bg-[#0a0a0b]/50 backdrop-blur-sm select-none">
        <Link href="/" className="flex items-center gap-3 hover:opacity-80 transition-opacity cursor-pointer group">
          <div className="p-2 rounded bg-neutral-100 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 text-neutral-800 dark:text-neutral-200 group-hover:border-neutral-300 dark:group-hover:border-neutral-600 transition-colors">
            <Terminal className="w-4 h-4" />
          </div>
          <span className="font-sans font-bold text-sm tracking-tight text-neutral-900 dark:text-neutral-100">
            THE HACKATHON <span className="text-neutral-500 dark:text-neutral-400 font-normal">SIMULATOR</span>
          </span>
        </Link>
        <div className="flex items-center gap-3">
          <button
            onClick={() => {
              playMutedClick();
              toggleTheme();
            }}
            className="p-2 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-800 border border-transparent hover:border-neutral-200 dark:hover:border-neutral-700 transition-all"
            aria-label="Toggle theme"
          >
            {isDark ? (
              <Sun className="w-4 h-4 text-amber-400" />
            ) : (
              <Moon className="w-4 h-4 text-neutral-600" />
            )}
          </button>
          <span className="text-[10px] text-neutral-400 dark:text-neutral-500 font-mono tracking-wider font-bold">
            v2.5.0//STABLE_BUILD
          </span>
        </div>
      </nav>

      {/* Main Container */}
      <main className="relative z-10 flex-1 flex flex-col items-center justify-center px-6 max-md:py-4 py-6 max-w-5xl mx-auto w-full max-md:space-y-5 space-y-8">
        
        {/* Core Hero Section */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="text-center max-w-3xl mx-auto space-y-5"
        >
          <motion.div variants={itemVariants} className="flex justify-center">
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-neutral-200 dark:border-neutral-700 bg-[#f4f4f2] dark:bg-neutral-800/50 text-neutral-600 dark:text-neutral-400 text-[9px] font-bold tracking-wider uppercase select-none backdrop-blur-sm">
              <Zap className="w-3 h-3 text-amber-500" />
              A DECISION-DRIVEN SIMULATION GAME
            </span>
          </motion.div>

          <motion.div variants={itemVariants}>
            <TypewriterTitle />
          </motion.div>

          <motion.p
            variants={itemVariants}
            className="text-xs sm:text-sm text-neutral-500 dark:text-neutral-400 font-sans font-light leading-relaxed max-w-xl mx-auto"
          >
            Experience a complete hackathon journey from problem discovery to final judging. 
            Build under time pressure, collaborate with AI teammates, 
            survive mentor reviews, and defend your decisions before specialist judges.
          </motion.p>

          {/* Countdown Timer */}
          <motion.div variants={itemVariants} className="flex justify-center">
            <HackathonCountdown />
          </motion.div>
        </motion.div>

        {/* Central Premium Launch Card */}
        <motion.div
          initial={{ opacity: 0, y: 20, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
          className="w-full max-w-lg relative"
        >
          {/* Glow effect behind card */}
          <div className="absolute -inset-1 bg-gradient-to-r from-neutral-200 via-neutral-300 to-neutral-200 dark:from-neutral-700 dark:via-neutral-600 dark:to-neutral-700 rounded-xl blur-sm opacity-50 dark:opacity-30" />
          
          <div className="relative bg-white dark:bg-neutral-900 border-2 border-neutral-800 dark:border-neutral-600 rounded-xl max-md:p-5 p-7 shadow-[4px_4px_0px_rgba(0,0,0,0.08)] dark:shadow-[4px_4px_0px_rgba(255,255,255,0.02)] text-left select-none overflow-hidden max-md:space-y-4 space-y-6">
            <div className="absolute top-2 right-3 font-mono text-[8px] text-neutral-400 dark:text-neutral-500 font-bold select-none">
              GAME RUNNER V2.5
            </div>

            {/* Info pills */}
            <div className="flex flex-wrap gap-2">
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800 text-emerald-700 dark:text-emerald-400 text-[9px] font-bold">
                <Timer className="w-3 h-3" />
                10 MIN SESSION
              </span>
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 text-amber-700 dark:text-amber-400 text-[9px] font-bold">
                <Crown className="w-3 h-3" />
                S-TIER POSSIBLE
              </span>
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 text-blue-700 dark:text-blue-400 text-[9px] font-bold">
                <Users className="w-3 h-3" />
                AI TEAM
              </span>
            </div>

            {/* Steps */}
            <div className="space-y-3 text-[10px] leading-relaxed text-neutral-600 dark:text-neutral-400 font-sans">
              {[
                { step: "01", text: "Choose a real-world problem statement." },
                { step: "02", text: "Build architecture using technologies that fit." },
                { step: "03", text: "Collaborate with teammates who critique your project." },
                { step: "04", text: "Create a pitch deck, survive reviews, and face judging." },
              ].map((item) => (
                <div key={item.step} className="flex gap-2.5 items-start">
                  <span className="font-mono text-neutral-900 dark:text-neutral-100 font-bold mt-0.5 shrink-0">
                    {item.step}/
                  </span>
                  <span>{item.text}</span>
                </div>
              ))}
            </div>

            {/* Primary CTA */}
            <Button
              onClick={handleLaunch}
              onMouseEnter={playSubtleHover}
              className="w-full h-12 bg-neutral-900 dark:bg-neutral-100 text-white dark:text-neutral-900 hover:bg-neutral-800 dark:hover:bg-neutral-200 font-bold tracking-wider rounded-lg border border-neutral-900 dark:border-neutral-100 focus-visible:ring-2 focus-visible:ring-neutral-900 dark:focus-visible:ring-neutral-100 focus-visible:outline-none flex items-center justify-center gap-2.5 cursor-pointer transition-all hover:-translate-y-0.5 active:translate-y-0 shadow-md hover:shadow-lg text-sm"
            >
              <Rocket className="w-4 h-4" />
              START YOUR FIRST HACKATHON
              <ChevronRight className="w-4 h-4" />
            </Button>

            {/* Subtitle under CTA */}
            <p className="text-center text-[9px] text-neutral-400 dark:text-neutral-500 font-mono">
              NO SIGN-UP REQUIRED — 100% CLIENT-SIDE — ZERO BACKEND
            </p>

            {isLocal && (
              <button
                onClick={handleDebugSkip}
                className="mt-1 w-full text-center font-mono text-[9px] text-amber-500 hover:text-amber-600 font-bold uppercase transition-colors cursor-pointer border border-dashed border-amber-300 dark:border-amber-700 py-1.5 rounded hover:bg-[#fffbeb] dark:hover:bg-amber-900/10 transition-all duration-150"
              >
                🛠️ SKIP TO RESULTS DEMO (DEVELOPER ONLY)
              </button>
            )}
          </div>
        </motion.div>

        {/* Animated Stats Row */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="grid grid-cols-3 gap-4 w-full max-w-lg"
        >
          {[
            { icon: Target, label: "PROBLEMS", value: problemCount, suffix: "+" },
            { icon: Cpu, label: "TECH COMBOS", value: techCount, suffix: "+" },
            { icon: Star, label: "JUDGES", value: judgeCount, suffix: "" },
          ].map((stat) => (
            <div
              key={stat.label}
              className="flex flex-col items-center gap-1.5 p-3 rounded-lg border border-neutral-200 dark:border-neutral-800 bg-white/50 dark:bg-neutral-900/50 backdrop-blur-sm"
            >
              <stat.icon className="w-4 h-4 text-neutral-500 dark:text-neutral-400" />
              <span className="font-mono font-black text-xl text-neutral-900 dark:text-neutral-100 tabular-nums">
                {stat.value}{stat.suffix}
              </span>
              <span className="text-[8px] font-mono text-neutral-400 dark:text-neutral-500 tracking-widest font-bold uppercase">
                {stat.label}
              </span>
            </div>
          ))}
        </motion.div>

        {/* Feature Highlights Grid */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 w-full max-w-4xl select-none"
        >
          {[
            {
              icon: Users,
              title: "AI TEAMMATES",
              desc: "Each teammate has a role, personality, and opinions. Receive architecture reviews, design critiques, and real-time project discussions.",
            },
            {
              icon: Sparkles,
              title: "DYNAMIC PROJECT BUILDER",
              desc: "Generate problem statements, USPs, feature backlogs, business models, and pitch structures tailored to your project.",
            },
            {
              icon: Clock,
              title: "REAL HACKATHON FLOW",
              desc: "Problem Selection, Tech Stack, USP, Backlog, Pitch Deck, Mentor Review, Business Model, Judging, Results.",
            },
            {
              icon: Layers,
              title: "ARCHITECTURE REVIEWS",
              desc: "Your team challenges poor technical decisions, recommends better stacks, and helps optimize execution.",
            },
            {
              icon: Terminal,
              title: "PITCH DECK BUILDER",
              desc: "Build and organize your presentation through drag-and-drop storytelling and project strategy decisions.",
            },
            {
              icon: Shield,
              title: "FINAL JUDGING",
              desc: "Face judges with unique perspectives who evaluate your project, team decisions, architecture, and pitch strength.",
            },
          ].map((card) => (
            <motion.div
              key={card.title}
              whileHover={{ y: -3, borderColor: isDark ? "#525252" : "#737373" }}
              transition={{ duration: 0.15 }}
              className="p-4 bg-white dark:bg-neutral-900/80 border border-neutral-200 dark:border-neutral-800 rounded-lg text-left space-y-1.5 shadow-[0_1px_2px_rgba(0,0,0,0.01)] transition-colors backdrop-blur-sm"
            >
              <div className="flex items-center gap-2 text-neutral-900 dark:text-neutral-100">
                <card.icon className="w-3.5 h-3.5 text-neutral-700 dark:text-neutral-300" />
                <span className="font-bold text-[10px] uppercase tracking-wide">{card.title}</span>
              </div>
              <p className="text-[9px] text-neutral-500 dark:text-neutral-400 font-sans font-light leading-relaxed">
                {card.desc}
              </p>
            </motion.div>
          ))}
        </motion.div>
      </main>

      {/* Footer */}
      <footer className="relative z-10 text-center py-5 text-[9px] text-neutral-400 dark:text-neutral-500 border-t border-neutral-200 dark:border-neutral-800 select-none">
        <div className="flex items-center justify-center gap-2">
          <Terminal className="w-3 h-3 text-neutral-400 dark:text-neutral-500" />
          <span>
            THE HACKATHON SIMULATOR v2.5 — ZERO BACKEND — 100% LOCAL CLIENT-SIDE SYSTEM
          </span>
        </div>
      </footer>
    </div>
  );
}
