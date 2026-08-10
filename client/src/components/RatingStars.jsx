export default function RatingStars({ value = 0, size = 'text-sm' }) {
  const compact = size === 'text-xs' || size === 'text-[11px]';

  return (
    <div className={`flex items-center gap-2 ${size} font-semibold text-[#9b6a3f]`}>
      <span className={`rounded-full bg-[#f0e4d6] uppercase tracking-[0.18em] text-[#7c5838] ${compact ? 'px-2 py-0.5 text-[0.58rem]' : 'px-3 py-1 text-[0.65rem]'}`}>Rating</span>
      <span>{Number(value).toFixed(1)}/5</span>
    </div>
  );
}
