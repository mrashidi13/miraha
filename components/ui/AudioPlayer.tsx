'use client';

import { useRef, useState } from 'react';

export function AudioPlayer({ src }: { src: string }) {
  const ref = useRef<HTMLAudioElement>(null);
  const [playing, setPlaying] = useState(false);

  function toggle() {
    if (!ref.current) return;
    if (playing) {
      ref.current.pause();
    } else {
      ref.current.play();
    }
    setPlaying(!playing);
  }

  return (
    <>
      <audio
        ref={ref}
        src={src}
        onEnded={() => setPlaying(false)}
        className="hidden"
      />
      <button
        onClick={toggle}
        aria-label={playing ? 'Pause' : 'Listen'}
        className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-accent text-white text-sm font-body hover:bg-accent-hover transition-colors"
      >
        {playing ? (
          <svg className="w-4 h-4" viewBox="0 0 20 20" fill="currentColor">
            <rect x="4" y="3" width="4" height="14" rx="1" />
            <rect x="12" y="3" width="4" height="14" rx="1" />
          </svg>
        ) : (
          <svg className="w-4 h-4" viewBox="0 0 20 20" fill="currentColor">
            <path d="M6.3 2.841A1.5 1.5 0 004 4.11V15.89a1.5 1.5 0 002.3 1.269l9.344-5.89a1.5 1.5 0 000-2.538L6.3 2.84z" />
          </svg>
        )}
        {playing ? 'Pause' : 'Listen'}
      </button>
    </>
  );
}
