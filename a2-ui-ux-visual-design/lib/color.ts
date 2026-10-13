// Color math shared by the mood boards and the design systems.

// WCAG relative luminance of a hex color, from 0 (black) to 1 (white).
export function luminance(hex: string) {
  const [r, g, b] = [1, 3, 5].map((start) => {
    const channel = parseInt(hex.slice(start, start + 2), 16) / 255;
    return channel <= 0.03928
      ? channel / 12.92
      : ((channel + 0.055) / 1.055) ** 2.4;
  });
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

// WCAG contrast ratio between two hex colors, from 1 (same) to 21.
export function contrast(a: string, b: string) {
  const [light, dark] = [luminance(a), luminance(b)].sort((x, y) => y - x);
  return (light + 0.05) / (dark + 0.05);
}

// `amount` of the first color mixed into the second, as a hex.
// mix("#000000", "#FFFFFF", 0.2) is white with 20% black.
export function mix(first: string, second: string, amount: number) {
  const channels = [1, 3, 5].map((start) => {
    const a = parseInt(first.slice(start, start + 2), 16);
    const b = parseInt(second.slice(start, start + 2), 16);
    return Math.round(a * amount + b * (1 - amount))
      .toString(16)
      .padStart(2, "0");
  });
  return `#${channels.join("").toUpperCase()}`;
}

// A fix for a text color that is too faint on `background`: the same color
// with just enough of `toward` mixed in to reach the target ratio.
export function darkenToContrast(
  color: string,
  background: string,
  toward: string,
  target = 4.5,
) {
  for (let amount = 1; amount >= 0; amount -= 0.01) {
    const candidate = mix(color, toward, amount);
    if (contrast(candidate, background) >= target) return candidate;
  }
  return toward;
}
