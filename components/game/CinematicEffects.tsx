'use client';

import { useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// ─── Confetti Canvas ──────────────────────────────────────────────────────
function ConfettiCanvas({ color = 'gold', duration = 3000 }: { color?: 'gold' | 'red'; duration?: number }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const colors = color === 'gold'
      ? ['#fbbf24', '#f59e0b', '#d97706', '#ffffff', '#fef3c7', '#fde68a']
      : ['#ef4444', '#dc2626', '#b91c1c', '#7f1d1d', '#fca5a5', '#fee2e2'];

    interface Particle {
      x: number; y: number; w: number; h: number;
      color: string; rotation: number; rotSpeed: number;
      vx: number; vy: number; gravity: number; opacity: number;
    }

    const particles: Particle[] = Array.from({ length: 120 }, () => ({
      x: Math.random() * canvas.width,
      y: -20 - Math.random() * 200,
      w: 4 + Math.random() * 6,
      h: 8 + Math.random() * 10,
      color: colors[Math.floor(Math.random() * colors.length)],
      rotation: Math.random() * Math.PI * 2,
      rotSpeed: (Math.random() - 0.5) * 0.15,
      vx: (Math.random() - 0.5) * 4,
      vy: 2 + Math.random() * 4,
      gravity: 0.05 + Math.random() * 0.05,
      opacity: 1,
    }));

    let animId: number;
    const startTime = Date.now();

    const animate = () => {
      const elapsed = Date.now() - startTime;
      if (elapsed > duration) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        return;
      }

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      particles.forEach((p) => {
        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate(p.rotation);
        ctx.globalAlpha = p.opacity;
        ctx.fillStyle = p.color;
        ctx.fillRect(-p.w / 2, -p.h / 2, p.w, p.h);
        ctx.restore();

        p.vy += p.gravity;
        p.x += p.vx;
        p.y += p.vy;
        p.rotation += p.rotSpeed;

        if (elapsed > duration * 0.7) {
          p.opacity = Math.max(0, p.opacity - 0.02);
        }
      });

      animId = requestAnimationFrame(animate);
    };

    animate();
    return () => cancelAnimationFrame(animId);
  }, [color, duration]);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-[90]"
      aria-hidden="true"
    />
  );
}

// ─── Screen Shake ────────────────────────────────────────────────────────
function ScreenShake({ duration = 600 }: { duration?: number }) {
  useEffect(() => {
    const root = document.getElementById('__next') || document.body;
    root.style.animation = `shake ${duration}ms ease-in-out`;
    const timer = setTimeout(() => {
      root.style.animation = '';
    }, duration);
    return () => {
      clearTimeout(timer);
      root.style.animation = '';
    };
  }, [duration]);
  return null;
}

// ─── Spotlight Effect ─────────────────────────────────────────────────────
function SpotlightEffect() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 1 }}
      className="fixed inset-0 pointer-events-none z-[85]"
      style={{
        background: 'radial-gradient(circle at 50% 40%, transparent 30%, rgba(0,0,0,0.5) 100%)',
      }}
    />
  );
}

// ─── Glitch Effect ────────────────────────────────────────────────────────
function GlitchEffect({ duration = 2000 }: { duration?: number }) {
  useEffect(() => {
    const root = document.getElementById('__next') || document.body;
    root.classList.add('glitch-active');
    const timer = setTimeout(() => {
      root.classList.remove('glitch-active');
    }, duration);
    return () => {
      clearTimeout(timer);
      root.classList.remove('glitch-active');
    };
  }, [duration]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: [0, 0.3, 0, 0.2, 0, 0.4, 0] }}
      transition={{ duration: duration / 1000, ease: 'linear' }}
      className="fixed inset-0 pointer-events-none z-[85] bg-red-600/10 mix-blend-multiply"
    />
  );
}

// ─── Main Export ──────────────────────────────────────────────────────────
interface CinematicEffectsProps {
  effect: 'confetti-gold' | 'confetti-red' | 'screen-shake' | 'spotlight' | 'glitch' | null;
  onComplete?: () => void;
}

export default function CinematicEffects({ effect, onComplete }: CinematicEffectsProps) {
  useEffect(() => {
    if (!effect) return;
    const durations: Record<string, number> = {
      'confetti-gold': 3500,
      'confetti-red': 2500,
      'screen-shake': 600,
      'spotlight': 3000,
      'glitch': 2000,
    };
    const timer = setTimeout(() => {
      onComplete?.();
    }, durations[effect] || 3000);
    return () => clearTimeout(timer);
  }, [effect, onComplete]);

  return (
    <AnimatePresence>
      {effect === 'confetti-gold' && <ConfettiCanvas color="gold" duration={3500} />}
      {effect === 'confetti-red' && <ConfettiCanvas color="red" duration={2500} />}
      {effect === 'screen-shake' && <ScreenShake duration={600} />}
      {effect === 'spotlight' && <SpotlightEffect />}
      {effect === 'glitch' && <GlitchEffect duration={2000} />}
    </AnimatePresence>
  );
}
