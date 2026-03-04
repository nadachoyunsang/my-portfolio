import IntroBackground from '@/components/IntroBackground';
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
      className={`relative flex flex-col items-center justify-center px-6 py-24 ${
        backgroundVideoUrl ? 'h-screen overflow-hidden' : 'min-h-[80vh]'
      }`}
    >
      {backgroundVideoUrl && (
        <>
          <IntroBackground url={backgroundVideoUrl} />
          <div className="absolute inset-0 bg-black/50" />
        </>
      )}
      <div
        className={`relative z-10 max-w-2xl text-center ${
          backgroundVideoUrl ? '[text-shadow:0_2px_8px_rgba(0,0,0,0.5)]' : ''
        }`}
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
