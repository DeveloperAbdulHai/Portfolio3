import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const Navbar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 24);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Home', href: '/' },
    { name: 'About', href: '/about' },
    { name: 'Services', href: '/services' },
    { name: 'Portfolio', href: '/portfolio' },
    { name: 'Blog', href: '/blog' },
    { name: 'Contact', href: '/contact' },
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <motion.header
      initial={{ opacity: 0, y: -16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] }}
      className={`fixed inset-x-0 top-0 z-50 transition-[background-color,border-color] duration-300 ${
        scrolled
          ? 'bg-[var(--_theme---base--surface--raised)] border-b border-[var(--_theme---base--border--subtle)]'
          : 'bg-transparent border-b border-transparent'
      }`}
    >
      <div className="mx-auto max-w-[1400px] px-6 sm:px-10 lg:px-14">
        <nav className="flex h-16 sm:h-18 items-center justify-between gap-6">
          {/* Brand — Playfair Display */}
          <Link
            to="/"
            className="font-brand text-xl sm:text-2xl font-semibold tracking-tight text-[var(--_theme---base--text--primary)] hover:text-[var(--_theme---accent)] transition-colors"
          >
            Md Abdul Hai
          </Link>

          {/* Desktop: nav + CTA */}
          <div className="hidden md:flex items-center gap-10">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.href}
                className={`font-body text-sm font-medium transition-colors ${
                  isActive(link.href)
                    ? 'text-[var(--_theme---accent)]'
                    : 'text-[var(--_theme---base--text--secondary)] hover:text-[var(--_theme---base--text--primary)]'
                }`}
              >
                {link.name}
              </Link>
            ))}
            <Link
              to="/contact"
              className="font-body text-sm font-semibold text-black bg-white px-5 py-2.5 rounded-full hover:bg-white/90 transition-colors"
            >
              Start a project
            </Link>
          </div>

          {/* Mobile menu trigger */}
          <button
            type="button"
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden p-2.5 -mr-2 text-[var(--_theme---base--text--primary)] rounded-lg hover:bg-[var(--_theme---base--surface--overlay)] transition-colors"
            aria-label={isOpen ? 'Close menu' : 'Open menu'}
          >
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </nav>
      </div>

      {/* Mobile menu — full list with design system typography */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.25 }}
            className="md:hidden overflow-hidden bg-[var(--_theme---base--surface--raised)] border-b border-[var(--_theme---base--border--subtle)]"
          >
            <div className="px-6 py-8 flex flex-col gap-1">
              {navLinks.map((link, i) => (
                <motion.div
                  key={link.name}
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.03 * i }}
                >
                  <Link
                    to={link.href}
                    onClick={() => setIsOpen(false)}
                    className={`block py-3.5 px-3 rounded-lg font-body text-base font-medium ${
                      isActive(link.href)
                        ? 'text-[var(--_theme---accent)] bg-[var(--_theme---accent)]/10'
                        : 'text-[var(--_theme---base--text--secondary)] hover:text-[var(--_theme---base--text--primary)] hover:bg-[var(--_theme---base--surface--overlay)]'
                    }`}
                  >
                    {link.name}
                  </Link>
                </motion.div>
              ))}
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }} className="pt-4 mt-2 border-t border-[var(--_theme---base--border--subtle)]">
                <Link
                  to="/contact"
                  onClick={() => setIsOpen(false)}
                  className="block w-full py-4 text-center font-body text-sm font-semibold text-black bg-white rounded-full hover:bg-white/90 transition-colors"
                >
                  Start a project
                </Link>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
};

export default Navbar;
