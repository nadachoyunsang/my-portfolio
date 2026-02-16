interface IntroSectionProps {
  name: string;
  job: string;
  bio: string;
}

export default function IntroSection({ name, job, bio }: IntroSectionProps) {
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
      </div>
    </section>
  );
}
