"use client";

// The proposal's water, behind the page: bubbles rising, and a thin aqua line
// on the right edge that shows how deep you've scrolled. Both stay out of the
// way of screen readers, and the bubbles stop for people who prefer less motion.

import { useEffect, useRef } from "react";

type Bubble = { x: number; y: number; r: number; speed: number; sway: number; alpha: number };

export default function Ocean() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const depthRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const depth = depthRef.current!;
    const setDepth = () => {
      const room = document.documentElement.scrollHeight - window.innerHeight;
      depth.style.transform = `scaleY(${room > 0 ? window.scrollY / room : 0})`;
    };
    window.addEventListener("scroll", setDepth, { passive: true });
    window.addEventListener("resize", setDepth);
    setDepth();

    const still = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const canvas = canvasRef.current!;
    const ctx = canvas.getContext("2d");
    let raf = 0;
    let w = 0, h = 0;
    const size = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = window.innerWidth; h = window.innerHeight;
      canvas.width = w * dpr; canvas.height = h * dpr;
      ctx?.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    const bubble = (anywhere: boolean): Bubble => ({
      x: Math.random() * w,
      y: anywhere ? Math.random() * h : h + 10,
      r: 1 + Math.random() * 3.5,
      speed: 0.15 + Math.random() * 0.45,
      sway: Math.random() * 6.28,
      alpha: 0.12 + Math.random() * 0.2,
    });

    if (!still && ctx) {
      window.addEventListener("resize", size);
      size();
      const bubbles = Array.from({ length: w < 700 ? 14 : 28 }, () => bubble(true));
      const frame = () => {
        ctx.clearRect(0, 0, w, h);
        bubbles.forEach((b, i) => {
          b.y -= b.speed;
          b.sway += 0.012;
          if (b.y < -10) { bubbles[i] = bubble(false); return; }
          ctx.beginPath();
          ctx.arc(b.x + Math.sin(b.sway) * 10, b.y, b.r, 0, 6.29);
          ctx.strokeStyle = `rgba(190, 240, 245, ${b.alpha})`;
          ctx.stroke();
        });
        raf = requestAnimationFrame(frame);
      };
      frame();
    }

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", setDepth);
      window.removeEventListener("resize", setDepth);
      window.removeEventListener("resize", size);
    };
  }, []);

  return (
    <>
      <canvas id="bubbles" ref={canvasRef} aria-hidden="true" />
      <div className="depth" ref={depthRef} aria-hidden="true" />
    </>
  );
}
