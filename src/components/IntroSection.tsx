import type { Award } from '@/types/award';

interface IntroSectionProps {
  name: string;
  job: string;
  bio: string;
  awards: Award[];
  backgroundVideoUrl?: string | null;
}

export default function IntroSection({
  name,
  job,
  bio,
  awards,
  backgroundVideoUrl,
}: IntroSectionProps) {
  return (
    <section
      id="about"
      className="relative flex h-screen flex-col items-center justify-center overflow-hidden px-6 py-24"
    >
      {backgroundVideoUrl && (
        <>
          <video
            autoPlay
            muted
            loop
            playsInline
            className="absolute inset-0 h-full w-full object-cover"
          >
            <source src={backgroundVideoUrl} type="video/mp4" />
          </video>
          <div className="absolute inset-0 bg-black/50" />
        </>
      )}
      <div
        className="relative z-10 max-w-2xl text-center"
        style={
          backgroundVideoUrl
            ? { textShadow: '0 2px 8px rgba(0,0,0,0.5)' }
            : undefined
        }
      >
        <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
          {name}
        </h1>
        <p className="mt-4 text-lg text-muted">{job}</p>
        <p className="mt-8 text-lg leading-relaxed text-foreground/80 whitespace-pre-line">
          {bio}
        </p>
        {awards.length > 0 && (
          <div className="mt-12">
            <h2 className="text-lg font-semibold text-foreground/90">
              수상 내역
            </h2>
            <ul className="mt-4 space-y-2 text-sm text-foreground/70">
              {awards.map((award) => (
                <li key={award.id}>
                  {award.name} — {award.organization} ({award.year})
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </section>
  );
}
