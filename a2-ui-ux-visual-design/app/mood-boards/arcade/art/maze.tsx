"use client";

import { useEffect, useRef } from "react";

// A generative tile, drawn on a canvas: the one-line maze of early home
// computers. Each cell gets a diagonal leaning left or right at random. The
// tile starts most of the way full, then keeps typing one cell at a time and
// scrolls up when it reaches the bottom, so the maze is different on every
// visit and never finishes.
//
// With reduced motion it draws one full maze and stops.

const COLUMNS = 10;
const CELLS_PER_SECOND = 24;
// A diagonal is drawn as a staircase of this many blocks, to keep it pixel art.
const BLOCKS = 4;
const ROWS_PER_COLOR = 3;
const COLORS = ["--cyan", "--magenta", "--yellow", "--lime"];

type Line = { leanRight: boolean[]; color: string };

export function Maze() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const context = canvas?.getContext("2d");
    if (!canvas || !context) return;

    // The board's own colors, read from its CSS variables.
    const styles = getComputedStyle(canvas);
    const colors = COLORS.map((name) => styles.getPropertyValue(name).trim());
    const cursorColor = styles.getPropertyValue("--white").trim();
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

    let lines: Line[] = [];
    let linesMade = 0;
    let cell = 0;
    let visibleRows = 0;
    let onScreen = true;
    let frame = 0;
    let lastTime = 0;
    let owed = 0;

    const newLine = (): Line => ({
      leanRight: [],
      color: colors[Math.floor(linesMade++ / ROWS_PER_COLOR) % colors.length],
    });

    const draw = (showCursor: boolean) => {
      context.clearRect(0, 0, canvas.width, canvas.height);
      const block = cell / BLOCKS;
      lines.forEach((line, row) => {
        context.fillStyle = line.color;
        line.leanRight.forEach((leanRight, column) => {
          for (let step = 0; step < BLOCKS; step++) {
            const across = leanRight ? BLOCKS - 1 - step : step;
            const x = Math.round(column * cell + across * block);
            const y = Math.round(row * cell + step * block);
            context.fillRect(
              x,
              y,
              Math.round(column * cell + (across + 1) * block) - x,
              Math.round(row * cell + (step + 1) * block) - y,
            );
          }
        });
      });
      const current = lines.at(-1);
      if (showCursor && current) {
        context.fillStyle = cursorColor;
        context.fillRect(
          Math.round(current.leanRight.length * cell),
          Math.round((lines.length - 1) * cell),
          Math.round(cell),
          Math.round(cell),
        );
      }
    };

    const addCell = () => {
      let current = lines.at(-1);
      if (!current || current.leanRight.length === COLUMNS) {
        current = newLine();
        lines.push(current);
        if (lines.length > visibleRows) lines.shift();
      }
      current.leanRight.push(Math.random() < 0.5);
    };

    const tick = (time: number) => {
      owed += ((time - (lastTime || time)) / 1000) * CELLS_PER_SECOND;
      lastTime = time;
      // After a long pause (a hidden tab), don't replay everything at once.
      owed = Math.min(owed, COLUMNS);
      for (; owed >= 1; owed--) addCell();
      draw(true);
      frame = requestAnimationFrame(tick);
    };

    const start = () => {
      cancelAnimationFrame(frame);
      const bounds = canvas.getBoundingClientRect();
      if (bounds.width === 0) return;
      const scale = window.devicePixelRatio || 1;
      canvas.width = Math.round(bounds.width * scale);
      canvas.height = Math.round(bounds.height * scale);
      cell = canvas.width / COLUMNS;
      visibleRows = Math.ceil(canvas.height / cell);
      lines = [];
      linesMade = 0;
      lastTime = 0;
      owed = 0;

      if (reducedMotion.matches) {
        // The still frame: a whole maze at once.
        for (let count = 0; count < visibleRows * COLUMNS; count++) addCell();
        draw(false);
        return;
      }
      // Start with all but the last two rows, so the tile is never empty.
      const head = Math.max(0, visibleRows - 2) * COLUMNS;
      for (let count = 0; count < head; count++) addCell();
      draw(true);
      if (onScreen) frame = requestAnimationFrame(tick);
    };

    // Redraw when the tile changes size, and rest while it is off screen.
    const sizeWatcher = new ResizeObserver(start);
    sizeWatcher.observe(canvas);
    const viewWatcher = new IntersectionObserver(([entry]) => {
      onScreen = entry.isIntersecting;
      cancelAnimationFrame(frame);
      if (onScreen && !reducedMotion.matches && cell > 0) {
        lastTime = 0;
        frame = requestAnimationFrame(tick);
      }
    });
    viewWatcher.observe(canvas);
    reducedMotion.addEventListener("change", start);

    return () => {
      cancelAnimationFrame(frame);
      sizeWatcher.disconnect();
      viewWatcher.disconnect();
      reducedMotion.removeEventListener("change", start);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="block h-full w-full bg-(--navy)"
      role="img"
      aria-label="A maze of diagonal strokes, generated at random."
    />
  );
}
