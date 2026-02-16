interface FooterProps {
  email: string;
}

export default function Footer({ email }: FooterProps) {
  return (
    <section id="contact" className="border-t border-border">
      <footer
        role="contentinfo"
        className="mx-auto max-w-3xl px-6 py-16 text-center"
      >
        <h2 className="text-2xl font-bold">Contact</h2>
        <a
          href={`mailto:${email}`}
          aria-label={`이메일 보내기: ${email}`}
          className="mt-4 inline-block text-accent hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent rounded"
        >
          {email}
        </a>
        <p className="mt-8 text-sm text-muted">
          &copy; {new Date().getFullYear()} YJ-CJS. All rights reserved.
        </p>
      </footer>
    </section>
  );
}
