'use client';

import { useEffect, useRef } from 'react';

interface IntroBackgroundProps {
  url: string;
}

export default function IntroBackground({ url }: IntroBackgroundProps) {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');

    if (!mq.matches) {
      videoRef.current?.play().catch(() => {});
    }

    const handleChange = (e: MediaQueryListEvent) => {
      if (e.matches) {
        videoRef.current?.pause();
      } else {
        videoRef.current?.play().catch(() => {});
      }
    };

    mq.addEventListener('change', handleChange);
    return () => mq.removeEventListener('change', handleChange);
  }, []);

  return (
    <video
      ref={videoRef}
      muted
      loop
      playsInline
      aria-hidden="true"
      className="absolute inset-0 h-full w-full object-cover"
    >
      <source src={url} type="video/mp4" />
    </video>
  );
}
