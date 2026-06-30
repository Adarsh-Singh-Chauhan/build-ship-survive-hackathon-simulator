'use client';

import { useEffect, useRef } from 'react';

interface Particle {
  x: number;
  y: number;
  speed: number;
  opacity: number;
  char: string;
  size: number;
  drift: number;
}

const CODE_CHARS = ['{', '}', '</>', '//', '=>', '()', '[]', '&&', '||', '++', '**', '!=', '===', 'fn', 'let', 'if', '0x', '::'];

export default function ParticleBackground({ isDark = false }: { isDark?: boolean }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particlesRef = useRef<Particle[]>([]);
  const animationRef = useRef<number>(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    // Respect reduced motion
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    // Initialize particles
    const particleCount = Math.min(35, Math.floor(window.innerWidth / 40));
    particlesRef.current = Array.from({ length: particleCount }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      speed: 0.15 + Math.random() * 0.35,
      opacity: 0.04 + Math.random() * 0.08,
      char: CODE_CHARS[Math.floor(Math.random() * CODE_CHARS.length)],
      size: 9 + Math.random() * 5,
      drift: (Math.random() - 0.5) * 0.3,
    }));

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const color = isDark ? '255, 255, 255' : '0, 0, 0';

      particlesRef.current.forEach((p) => {
        ctx.font = `${p.size}px "Geist Mono", "SF Mono", "Fira Code", monospace`;
        ctx.fillStyle = `rgba(${color}, ${p.opacity})`;
        ctx.fillText(p.char, p.x, p.y);

        // Move upward
        p.y -= p.speed;
        p.x += p.drift;

        // Reset when off screen
        if (p.y < -20) {
          p.y = canvas.height + 20;
          p.x = Math.random() * canvas.width;
          p.char = CODE_CHARS[Math.floor(Math.random() * CODE_CHARS.length)];
        }
        if (p.x < -20) p.x = canvas.width + 20;
        if (p.x > canvas.width + 20) p.x = -20;
      });

      animationRef.current = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      cancelAnimationFrame(animationRef.current);
      window.removeEventListener('resize', resize);
    };
  }, [isDark]);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 pointer-events-none z-0"
      aria-hidden="true"
    />
  );
}
