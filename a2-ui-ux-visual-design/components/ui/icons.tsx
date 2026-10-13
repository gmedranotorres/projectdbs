// The library's few icons, drawn in code. Each takes the color of the text
// around it and is hidden from screen readers: the words beside an icon say
// what it means.

function Icon({ d, size = 16 }: { d: string; size?: number }) {
  return (
    <svg
      viewBox="0 0 16 16"
      width={size}
      height={size}
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d={d} />
    </svg>
  );
}

export const CheckIcon = () => <Icon d="M3 8.5 6.5 12 13 4.5" />;
export const CloseIcon = () => <Icon d="M4 4 12 12M12 4 4 12" />;
// a magnifying glass with nothing in it
export const EmptyIcon = () => <Icon d="M7 2.5A4.5 4.5 0 1 1 7 11.5A4.5 4.5 0 0 1 7 2.5ZM10.3 10.3 13.5 13.5" size={20} />;
// an exclamation mark
export const AlertIcon = () => <Icon d="M8 3.5V9M8 12V12.3" size={20} />;
// an arrow leaving a box: this opens somewhere else
export const ExternalIcon = () => <Icon d="M6 3.5H3.5V12.5H12.5V10M9 3.5H12.5V7M12.5 3.5 7.5 8.5" />;
