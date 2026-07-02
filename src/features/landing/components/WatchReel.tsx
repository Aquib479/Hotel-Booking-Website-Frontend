import { Play } from "lucide-react";

interface WatchReelProps {
  onPlay?: () => void;
}

export function WatchReel({ onPlay }: WatchReelProps) {
  return (
    <div className="flex flex-col items-center gap-3">
      <button
        type="button"
        onClick={onPlay}
        aria-label="Watch reel"
        className="flex size-16 items-center justify-center rounded-full border-2 border-white/70 bg-white/10 text-white backdrop-blur-sm transition-transform hover:scale-105 hover:bg-white/20 sm:size-20"
      >
        <Play className="ml-1 size-7 fill-white sm:size-8" />
      </button>
    </div>
  );
}
