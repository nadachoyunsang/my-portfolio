import Container from '@/components/ui/Container';

interface FooterProps {
  email: string;
  siteName?: string;
}

export default function Footer({ email, siteName = 'YJ-CJS' }: FooterProps) {
  return (
    <section id="contact" className="border-t border-border">
      <Container
        as="footer"
        maxWidth="max-w-3xl"
        role="contentinfo"
        className="py-16 text-center"
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
          &copy; {new Date().getFullYear()} {siteName}. All rights reserved.
        </p>
      </Container>
    </section>
  );
}
