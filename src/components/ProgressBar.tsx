interface ProgressBarProps {
  current: number;
  total: number;
}

export default function ProgressBar({ current, total }: ProgressBarProps) {
  const percent = total > 0 ? Math.min((current / total) * 100, 100) : 0;

  return (
    <div className="h-1 w-full bg-bg-surface">
      <div
        className="h-full rounded-r-full transition-all duration-700 ease-out"
        style={{
          width: `${percent}%`,
          background: 'linear-gradient(90deg, #8b5cf6, #22d3ee)',
        }}
      />
    </div>
  );
}
