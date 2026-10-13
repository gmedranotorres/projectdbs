import {
  readableOn,
  type PaletteColor,
} from "@/components/mood-board/palette";
import { palette } from "../palette";

// A color filling the tile, labeled with its job and hex value.
export function Swatch({ color }: { color: PaletteColor }) {
  return (
    <div
      className="flex h-full flex-col justify-end gap-1.5 p-3"
      style={{
        backgroundColor: color.hex,
        color: readableOn(color.hex, palette.navy.hex, palette.white.hex),
      }}
    >
      <p className="text-[11px] leading-4 font-bold uppercase">{color.role}</p>
      <p className="font-(family-name:--press-start) text-[clamp(0.625rem,8cqi,0.875rem)] leading-none">
        {color.hex}
      </p>
    </div>
  );
}
