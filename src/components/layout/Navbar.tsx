'use client';

import { useState, useCallback, useEffect } from 'react';
import Link from 'next/link';
import Container from '@/components/layout/Container';
import Button from '@/components/ui/Button';
import { MenuIcon, CloseIcon } from '@/components/icons';
import { NAV_LINKS, APP_NAME } from '@/lib/constants';

/**
 * Responsive navigation bar with glassmorphism and mobile drawer.
 */
export default function Navbar() {
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  const toggleMobile = useCallback(() => {
    setIsMobileOpen((prev) => !prev);
  }, []);

  const closeMobile = useCallback(() => {
    setIsMobileOpen(false);
  }, []);

  // Track scroll for glass background intensity
  useEffect(() => {
    function handleScroll() {
      setIsScrolled(window.scrollY > 20);
    }
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    if (isMobileOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isMobileOpen]);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? 'glass-strong shadow-lg shadow-black/5'
          : 'bg-transparent'
      }`}
      role="banner"
    >
      <Container>
        <nav
          className="flex items-center justify-between h-16"
          aria-label="Main navigation"
        >
          {/* Logo */}
          <Link
            href="/"
            className="flex items-center gap-2 text-lg font-bold tracking-tight text-foreground hover:text-accent transition-colors"
            aria-label={`${APP_NAME} — Home`}
          >
            <span className="text-xl">🔭</span>
            <span>{APP_NAME}</span>
          </Link>

          {/* Desktop Links */}
          <ul className="hidden md:flex items-center gap-1" role="list">
            {NAV_LINKS.map((link) => (
              <li key={link.id}>
                <Link
                  href={link.href}
                  id={link.id}
                  className="px-4 py-2 text-sm text-muted hover:text-foreground rounded-lg hover:bg-surface transition-all duration-200"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>

          {/* Desktop CTA */}
          <div className="hidden md:block">
            <Button size="sm" variant="outline">
              Get Started
            </Button>
          </div>

          {/* Mobile Toggle */}
          <button
            type="button"
            className="md:hidden p-2 rounded-lg text-muted hover:text-foreground hover:bg-surface transition-colors"
            onClick={toggleMobile}
            aria-expanded={isMobileOpen}
            aria-controls="mobile-menu"
            aria-label={isMobileOpen ? 'Close menu' : 'Open menu'}
          >
            {isMobileOpen ? (
              <CloseIcon className="h-5 w-5" />
            ) : (
              <MenuIcon className="h-5 w-5" />
            )}
          </button>
        </nav>
      </Container>

      {/* Mobile Drawer */}
      {/* Backdrop */}
      <div
        className={`fixed inset-0 bg-black/50 transition-opacity duration-300 md:hidden ${
          isMobileOpen
            ? 'opacity-100 pointer-events-auto'
            : 'opacity-0 pointer-events-none'
        }`}
        onClick={closeMobile}
        aria-hidden="true"
      />

      {/* Drawer Panel */}
      <div
        id="mobile-menu"
        className={`fixed top-0 right-0 h-full w-72 glass-strong shadow-2xl transform transition-transform duration-300 ease-out md:hidden ${
          isMobileOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
        role="dialog"
        aria-modal="true"
        aria-label="Mobile navigation"
      >
        <div className="flex flex-col h-full pt-20 px-6 pb-8">
          <ul className="flex flex-col gap-1" role="list">
            {NAV_LINKS.map((link) => (
              <li key={link.id}>
                <Link
                  href={link.href}
                  id={`${link.id}-mobile`}
                  className="block px-4 py-3 text-sm text-muted hover:text-foreground rounded-xl hover:bg-surface transition-all duration-200"
                  onClick={closeMobile}
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
          <div className="mt-6">
            <Button fullWidth variant="primary" size="md" onClick={closeMobile}>
              Get Started
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
}
