'use client';

import { useEffect, useRef } from 'react';

interface IntroBackgroundProps {
  url: string;
}

export default function IntroBackground({ url }: IntroBackgroundProps) {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    if (mq.matches) {
      videoRef.current?.pause();
    }

    const handleChange = (e: MediaQueryListEvent) => {
      if (e.matches) {
        videoRef.current?.pause();
      } else {
        videoRef.current?.play();
      }
    };

    mq.addEventListener('change', handleChange);
    return () => mq.removeEventListener('change', handleChange);
  }, []);

  return (
    <video
      ref={videoRef}
      autoPlay
      muted
      loop
      playsInline
      className="absolute inset-0 h-full w-full object-cover"
    >
      <source src={url} type="video/mp4" />
    </video>
  );
}
