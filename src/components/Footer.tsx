interface FooterProps {
  email: string;
}

export default function Footer({ email }: FooterProps) {
  return (
    <section id="contact" className="border-t border-border">
      <footer className="mx-auto max-w-3xl px-6 py-16 text-center">
        <h2 className="text-2xl font-bold">Contact</h2>
        <a
          href={`mailto:${email}`}
          className="mt-4 inline-block text-accent hover:underline"
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
