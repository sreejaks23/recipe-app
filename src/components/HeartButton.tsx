interface Props { active: boolean; onClick: () => void; className?: string }

export default function HeartButton({ active, onClick, className = "" }: Props) {
  return (
    <button
      type="button"
      aria-pressed={active}
      aria-label={active ? "Remove from favorites" : "Save to favorites"}
      onClick={(e) => { e.stopPropagation(); onClick(); }}
      className={`grid size-9 place-items-center rounded-full bg-white/90 shadow transition hover:scale-110 ${className}`}
    >
      <svg viewBox="0 0 24 24" className={`size-5 ${active ? "fill-red-500 stroke-red-500" : "fill-none stroke-ink"}`} strokeWidth="2">
        <path d="M12 21s-7.5-4.6-9.5-9.3C1.1 8.4 3 5 6.4 5c2 0 3.6 1.1 4.6 2.6h2C14 6.1 15.6 5 17.6 5 21 5 22.9 8.4 21.5 11.7 19.5 16.4 12 21 12 21z" />
      </svg>
    </button>
  ); 
}
