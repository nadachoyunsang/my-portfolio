import BlogSection from '@/components/BlogSection';
import Footer from '@/components/Footer';
import Header from '@/components/Header';
import IntroSection from '@/components/IntroSection';
import { getAwards } from '@/lib/awards';
import { getCategories } from '@/lib/categories';
import { getPublishedPosts } from '@/lib/posts';
import { getSiteContent } from '@/lib/siteContent';
import { createClient } from '@/lib/supabase/server';
import { getIntroVideoUrl } from '@/lib/video';

export default async function Home() {
  const supabase = await createClient();
  const [content, posts, categories, awards, introVideoUrl] = await Promise.all(
    [
      getSiteContent(),
      getPublishedPosts(),
      getCategories(),
      getAwards(),
      getIntroVideoUrl(supabase),
    ],
  );

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
          awards={awards}
          backgroundVideoUrl={introVideoUrl}
        />
        <BlogSection
          posts={posts}
          categories={categories}
          defaultGridSize={
            (content.default_grid_size as 'sm' | 'md' | 'lg') || 'md'
          }
        />
        <Footer
          email={content.contact_email || 'hello@example.com'}
          siteName={content.site_name || 'YJ-CJS'}
        />
      </main>
    </>
  );
}
