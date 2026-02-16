import Footer from '@/components/Footer';
import Header from '@/components/Header';
import IntroSection from '@/components/IntroSection';
import { getSiteContent } from '@/lib/siteContent';

export default async function Home() {
  const content = await getSiteContent();

  return (
    <>
      <Header />
      <main>
        <IntroSection
          name={content.intro_name || '홍길동'}
          job={content.intro_job || '기자 / 작가'}
          bio={
            content.intro_bio ||
            '안녕하세요. 다큐멘터리, 책, 기사를 소개합니다.'
          }
        />
        <section id="blog" className="min-h-[60vh] px-6 py-24">
          <div className="mx-auto max-w-3xl text-center">
            <h2 className="text-2xl font-bold">Blog</h2>
            <p className="mt-4 text-muted">게시글이 곧 추가됩니다.</p>
          </div>
        </section>
        <Footer email={content.contact_email || 'hello@example.com'} />
      </main>
    </>
  );
}
