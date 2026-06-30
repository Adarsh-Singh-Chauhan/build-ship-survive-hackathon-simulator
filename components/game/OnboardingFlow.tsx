'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Terminal, Code2, Brain, Database, Shield, Leaf, ChevronRight, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { playMutedClick, playUnlockArpeggio, playSubtleHover } from '@/lib/sound';

const DOMAINS = [
  { id: 'ai', name: 'AI & Machine Learning', icon: Brain, color: 'text-purple-500' },
  { id: 'fintech', name: 'FinTech', icon: Database, color: 'text-blue-500' },
  { id: 'health', name: 'HealthTech', icon: Shield, color: 'text-emerald-500' },
  { id: 'cyber', name: 'Cybersecurity', icon: Terminal, color: 'text-red-500' },
  { id: 'sustainability', name: 'Sustainability', icon: Leaf, color: 'text-green-500' },
  { id: 'general', name: 'General Software', icon: Code2, color: 'text-neutral-500' },
];

interface OnboardingFlowProps {
  onComplete: (data: { experience: string; domain: string }) => void;
}

export default function OnboardingFlow({ onComplete }: OnboardingFlowProps) {
  const [step, setStep] = useState(1);
  const [experience, setExperience] = useState('');
  const [domain, setDomain] = useState('');
  const [isVisible, setIsVisible] = useState(true);

  // Check if already onboarded
  useEffect(() => {
    const hasOnboarded = localStorage.getItem('hasOnboarded_v2');
    if (hasOnboarded) {
      setIsVisible(false);
      onComplete({ experience: 'skipped', domain: 'skipped' });
    }
  }, [onComplete]);

  if (!isVisible) return null;

  const handleNext = () => {
    playMutedClick();
    if (step === 1 && experience) {
      setStep(2);
    } else if (step === 2 && domain) {
      finishOnboarding();
    }
  };

  const finishOnboarding = () => {
    playUnlockArpeggio();
    localStorage.setItem('hasOnboarded_v2', 'true');
    setIsVisible(false);
    onComplete({ experience, domain });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-md px-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 10 }}
        className="w-full max-w-lg bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-2xl shadow-2xl overflow-hidden font-sans"
      >
        <div className="p-6 sm:p-8 space-y-6">
          {/* Header */}
          <div className="space-y-2 text-center">
            <h2 className="text-2xl font-black uppercase tracking-tight text-neutral-900 dark:text-neutral-100">
              {step === 1 ? 'Welcome to the Hackathon' : 'Choose Your Domain'}
            </h2>
            <p className="text-sm text-neutral-500 dark:text-neutral-400 font-light">
              {step === 1
                ? 'Before we begin, let us tailor the simulation to your background.'
                : 'Which industry problem are you most interested in solving?'}
            </p>
          </div>

          {/* Step 1: Experience */}
          <AnimatePresence mode="wait">
            {step === 1 && (
              <motion.div
                key="step1"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className="grid grid-cols-1 gap-3"
              >
                {[
                  { id: 'beginner', title: 'First-time Hacker', desc: 'New to coding or hackathons' },
                  { id: 'intermediate', title: 'Experienced Builder', desc: 'Built a few projects before' },
                  { id: 'pro', title: 'Hackathon Veteran', desc: 'Here to win S-Tier' },
                ].map((level) => (
                  <button
                    key={level.id}
                    onClick={() => {
                      setExperience(level.id);
                      playSubtleHover();
                    }}
                    className={`flex items-start gap-4 p-4 rounded-xl border-2 transition-all text-left ${
                      experience === level.id
                        ? 'border-neutral-900 dark:border-neutral-100 bg-neutral-50 dark:bg-neutral-800'
                        : 'border-neutral-200 dark:border-neutral-800 hover:border-neutral-300 dark:hover:border-neutral-700'
                    }`}
                  >
                    <div className={`mt-0.5 w-5 h-5 rounded-full flex items-center justify-center border-2 ${
                      experience === level.id ? 'border-neutral-900 dark:border-neutral-100' : 'border-neutral-300 dark:border-neutral-700'
                    }`}>
                      {experience === level.id && <div className="w-2.5 h-2.5 rounded-full bg-neutral-900 dark:bg-neutral-100" />}
                    </div>
                    <div>
                      <div className="font-bold text-neutral-900 dark:text-neutral-100">{level.title}</div>
                      <div className="text-xs text-neutral-500 dark:text-neutral-400 mt-0.5">{level.desc}</div>
                    </div>
                  </button>
                ))}
              </motion.div>
            )}

            {/* Step 2: Domain */}
            {step === 2 && (
              <motion.div
                key="step2"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className="grid grid-cols-2 gap-3"
              >
                {DOMAINS.map((dom) => (
                  <button
                    key={dom.id}
                    onClick={() => {
                      setDomain(dom.id);
                      playSubtleHover();
                    }}
                    className={`flex flex-col items-center justify-center gap-3 p-4 rounded-xl border-2 transition-all text-center ${
                      domain === dom.id
                        ? 'border-neutral-900 dark:border-neutral-100 bg-neutral-50 dark:bg-neutral-800'
                        : 'border-neutral-200 dark:border-neutral-800 hover:border-neutral-300 dark:hover:border-neutral-700'
                    }`}
                  >
                    <dom.icon className={`w-8 h-8 ${dom.color}`} />
                    <span className="font-bold text-xs text-neutral-900 dark:text-neutral-100">{dom.name}</span>
                  </button>
                ))}
              </motion.div>
            )}
          </AnimatePresence>

          {/* Footer controls */}
          <div className="flex justify-between items-center pt-4 border-t border-neutral-100 dark:border-neutral-800">
            <div className="flex gap-1.5">
              <div className={`w-2 h-2 rounded-full ${step === 1 ? 'bg-neutral-900 dark:bg-neutral-100' : 'bg-neutral-200 dark:bg-neutral-800'}`} />
              <div className={`w-2 h-2 rounded-full ${step === 2 ? 'bg-neutral-900 dark:bg-neutral-100' : 'bg-neutral-200 dark:bg-neutral-800'}`} />
            </div>
            
            <Button
              onClick={handleNext}
              disabled={(step === 1 && !experience) || (step === 2 && !domain)}
              className="gap-2 px-6 bg-neutral-900 dark:bg-neutral-100 text-white dark:text-neutral-900"
            >
              {step === 1 ? 'CONTINUE' : 'START HACKATHON'}
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
