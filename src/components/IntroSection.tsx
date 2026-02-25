import type { Award } from '@/types/award';

interface IntroSectionProps {
  name: string;
  job: string;
  bio: string;
  awards: Award[];
}

export default function IntroSection({
  name,
  job,
  bio,
  awards,
}: IntroSectionProps) {
  return (
    <section
      id="about"
      className="flex min-h-[80vh] flex-col items-center justify-center px-6 py-24"
    >
      <div className="max-w-2xl text-center">
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
