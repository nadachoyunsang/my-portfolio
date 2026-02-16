import BlogSection from '@/components/BlogSection';
import Footer from '@/components/Footer';
import Header from '@/components/Header';
import IntroSection from '@/components/IntroSection';
import { getCategories } from '@/lib/categories';
import { getPublishedPosts } from '@/lib/posts';
import { getSiteContent } from '@/lib/siteContent';

export default async function Home() {
  const [content, posts, categories] = await Promise.all([
    getSiteContent(),
    getPublishedPosts(),
    getCategories(),
  ]);

  return (
    <>
      <Header siteName={content.site_name || 'YJ-CJS'} />
      <main id="main-content">
        <IntroSection
          name={content.intro_name || '홍길동'}
          job={content.intro_job || '기자 / 작가'}
          bio={
            content.intro_bio ||
            '안녕하세요. 다큐멘터리, 책, 기사를 소개합니다.'
          }
        />
        <BlogSection posts={posts} categories={categories} />
        <Footer
          email={content.contact_email || 'hello@example.com'}
          siteName={content.site_name || 'YJ-CJS'}
        />
      </main>
    </>
  );
}
