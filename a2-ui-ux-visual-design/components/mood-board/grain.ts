// Grain drawn in code: SVG fractal noise, cut down to specks of one color,
// returned as a repeating CSS background image.
//
// `frequency` sets the scale ("0.9" is fine grain; two numbers such as
// "0.01 0.6" stretch it into fibers). `density` is how much of the surface
// the specks cover and `strength` how dark they get, both from 0 to 1.
// `color` must be a plain hex: an SVG used as an image cannot read the
// page's CSS variables.
export function grain({
  frequency,
  color,
  density = 0.5,
  strength = 0.3,
  octaves = 3,
  seed = 1,
  tile = 240,
}: {
  frequency: string;
  color: string;
  density?: number;
  strength?: number;
  octaves?: number;
  seed?: number;
  tile?: number;
}) {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${tile}" height="${tile}"><filter id="g" x="0" y="0" width="100%" height="100%"><feTurbulence type="fractalNoise" baseFrequency="${frequency}" numOctaves="${octaves}" seed="${seed}" stitchTiles="stitch"/><feColorMatrix values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 ${(2 * strength).toFixed(3)} 0 0 0 ${((density - 1.25) * strength).toFixed(3)}" result="specks"/><feFlood flood-color="${color}"/><feComposite operator="in" in2="specks"/></filter><rect width="100%" height="100%" filter="url(#g)"/></svg>`;
  return `url("data:image/svg+xml,${encodeURIComponent(svg)}")`;
}
