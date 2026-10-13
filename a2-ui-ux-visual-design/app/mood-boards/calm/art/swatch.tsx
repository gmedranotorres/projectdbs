import {
  readableOn,
  type PaletteColor,
} from "@/components/mood-board/palette";
import { palette } from "../palette";

// A color filling the tile, labeled with its job and hex value.
export function Swatch({ color }: { color: PaletteColor }) {
  return (
    <div
      className="flex h-full flex-col justify-end p-3"
      style={{
        backgroundColor: color.hex,
        color: readableOn(color.hex, palette.ink.hex, palette.warmWhite.hex),
      }}
    >
      <p className="text-[11px] leading-4">{color.role}</p>
      <p className="font-(family-name:--newsreader) text-[clamp(1.125rem,13cqi,1.625rem)] leading-tight">
        {color.hex}
      </p>
    </div>
  );
}
