import {
  readableOn,
  type PaletteColor,
} from "@/components/mood-board/palette";
import { palette } from "../palette";

// A color filling the tile, labeled with its job and hex value. The thin
// edge keeps the paper colors visible on the paper page.
export function Swatch({ color }: { color: PaletteColor }) {
  return (
    <div
      className="flex h-full flex-col justify-between border border-(--ink)/20 p-3"
      style={{
        backgroundColor: color.hex,
        color: readableOn(color.hex, palette.ink.hex, palette.paper.hex),
      }}
    >
      <p className="font-(family-name:--inter) text-[10px] leading-4 font-medium tracking-[0.12em] uppercase">
        {color.role}
      </p>
      <p className="font-(family-name:--playfair) text-[clamp(1.125rem,13cqi,1.625rem)] leading-none lining-nums">
        {color.hex}
      </p>
    </div>
  );
}
