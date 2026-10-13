// A halftone, as one SVG path: dots on a 45° screen, each sized by how dark
// the picture is at that spot. `shade` gives the darkness from 0 (paper) to
// 1 (solid ink); `inside` can limit the dots to a shape.
export function halftone({
  width,
  height,
  pitch,
  shade,
  inside = () => true,
}: {
  width: number;
  height: number;
  pitch: number;
  shade: (x: number, y: number) => number;
  inside?: (x: number, y: number) => boolean;
}) {
  const step = pitch / Math.SQRT2;
  let path = "";
  for (let row = 0; row * step <= height; row++) {
    const y = row * step;
    for (let x = (row % 2) * step; x <= width; x += step * 2) {
      if (!inside(x, y)) continue;
      // The dot's area, not its radius, follows the darkness.
      const darkness = Math.min(1, Math.max(0, shade(x, y)));
      const r = Math.sqrt(darkness) * pitch * 0.6;
      if (r < 0.4) continue;
      const radius = r.toFixed(2);
      path += `M${(x - r).toFixed(1)} ${y.toFixed(1)}a${radius} ${radius} 0 1 0 ${(2 * r).toFixed(2)} 0a${radius} ${radius} 0 1 0 ${(-2 * r).toFixed(2)} 0`;
    }
  }
  return path;
}
