'use client';

import { useEffect, useState } from 'react';

const NAV_ITEMS = [
  { label: '소개', href: '#about' },
  { label: '블로그', href: '#blog' },
  { label: '연락처', href: '#contact' },
];

export default function Header() {
  const [activeSection, setActiveSection] = useState('');
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id);
          }
        }
      },
      { rootMargin: '-50% 0px -50% 0px' },
    );

    const sections = document.querySelectorAll('section[id]');
    sections.forEach((section) => observer.observe(section));

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();

    return () => {
      observer.disconnect();
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const linkClass = (href: string) =>
    `transition-colors ${
      activeSection === href.slice(1)
        ? 'text-accent'
        : 'text-muted hover:text-foreground'
    }`;

  return (
    <header
      role="banner"
      className={`sticky top-0 z-50 transition-colors duration-300 ${
        scrolled || menuOpen
          ? 'bg-background/80 backdrop-blur-md border-b border-border'
          : 'bg-transparent'
      }`}
    >
      <div className="mx-auto flex max-w-3xl items-center justify-between px-6 py-4">
        <a href="#" className="text-lg font-bold text-foreground">
          YJ-CJS
        </a>

        {/* 데스크톱 네비게이션 */}
        <nav aria-label="메인 메뉴" className="hidden gap-6 sm:flex">
          {NAV_ITEMS.map(({ label, href }) => (
            <a key={href} href={href} className={`text-sm ${linkClass(href)}`}>
              {label}
            </a>
          ))}
        </nav>

        {/* 모바일 햄버거 버튼 */}
        <button
          type="button"
          onClick={() => setMenuOpen(!menuOpen)}
          className="sm:hidden p-1 text-muted hover:text-foreground"
          aria-label={menuOpen ? '메뉴 닫기' : '메뉴 열기'}
          aria-expanded={menuOpen}
        >
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
          >
            {menuOpen ? (
              <>
                <line x1="6" y1="6" x2="18" y2="18" />
                <line x1="6" y1="18" x2="18" y2="6" />
              </>
            ) : (
              <>
                <line x1="4" y1="7" x2="20" y2="7" />
                <line x1="4" y1="12" x2="20" y2="12" />
                <line x1="4" y1="17" x2="20" y2="17" />
              </>
            )}
          </svg>
        </button>
      </div>

      {/* 모바일 메뉴 */}
      {menuOpen && (
        <nav
          aria-label="모바일 메뉴"
          className="border-t border-border px-6 pb-4 sm:hidden"
        >
          {NAV_ITEMS.map(({ label, href }) => (
            <a
              key={href}
              href={href}
              onClick={() => setMenuOpen(false)}
              className={`block py-3 text-sm ${linkClass(href)}`}
            >
              {label}
            </a>
          ))}
        </nav>
      )}
    </header>
  );
}
