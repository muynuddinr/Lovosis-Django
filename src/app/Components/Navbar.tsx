'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import logo from '../../../public/logo0bg.png';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navItems = [
    { href: '/', label: 'Home' },
    { href: '/Aboutus', label: 'About' },
    { href: '/Services', label: 'Services' },
    { href: '/Products', label: 'Products' },
    { href: '/Certificates', label: 'Certificates' },
    { href: '/Gallery', label: 'Gallery' },
  ];

  const isActive = (href: string) => pathname === href;

  // Conditional styles
  const bgClass = scrolled 
    ? 'bg-slate-900 border-red-500/20' 
    : 'bg-white/95 border-gray-100/50';
  const textClass = scrolled ? 'text-white' : 'text-gray-900';
  const linkClass = scrolled 
    ? 'text-gray-300 hover:text-white' 
    : 'text-gray-600 hover:text-red-600';
  const activeClass = scrolled ? 'text-red-400' : 'text-red-600';

  return (
    <nav className={`sticky top-0 z-50 transition-colors duration-300 border-b ${bgClass}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 flex-shrink-0">
            <img
              src={logo.src}
              alt="Lovosis Logo"
              className="w-24 h-20 object-contain"
            />
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center gap-6">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`text-sm font-medium transition-colors ${
                  isActive(item.href) ? activeClass : linkClass
                }`}
              >
                {item.label}
              </Link>
            ))}
          </div>

          {/* Right Side */}
          <div className="flex items-center gap-4">
            <Link
              href="/contact"
              className="hidden md:inline-block px-4 py-1.5 text-sm font-semibold text-red-600 border border-red-600 rounded-lg hover:bg-red-600 hover:text-white transition-all"
            >
              Contact
            </Link>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsOpen(!isOpen)}
              className={`lg:hidden w-10 h-10 flex flex-col items-center justify-center gap-1 rounded-lg transition-colors ${
                scrolled ? 'hover:bg-white/10' : 'hover:bg-gray-100'
              }`}
              aria-label="Menu"
            >
              <span
                className={`w-5 h-0.5 rounded-full transition-all ${
                  scrolled ? 'bg-white' : 'bg-gray-700'
                } ${isOpen ? 'rotate-45 translate-y-1.5' : ''}`}
              />
              <span
                className={`w-5 h-0.5 rounded-full transition-all ${
                  scrolled ? 'bg-white' : 'bg-gray-700'
                } ${isOpen ? 'opacity-0' : ''}`}
              />
              <span
                className={`w-5 h-0.5 rounded-full transition-all ${
                  scrolled ? 'bg-white' : 'bg-gray-700'
                } ${isOpen ? '-rotate-45 -translate-y-1.5' : ''}`}
              />
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isOpen && (
          <div className={`lg:hidden pb-4 border-t transition-colors ${scrolled ? 'border-blue-500/20 bg-slate-800/50' : 'border-gray-100'}`}>
            <div className="space-y-1 pt-4">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setIsOpen(false)}
                  className={`block px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    isActive(item.href)
                      ? scrolled ? 'text-blue-400 bg-white/10' : 'text-blue-600 bg-blue-50'
                      : linkClass
                  }`}
                >
                  {item.label}
                </Link>
              ))}
              <Link
                href="/contact"
                onClick={() => setIsOpen(false)}
                className="block mt-3 mx-4 px-4 py-2 text-sm font-semibold text-center text-red-600 border border-red-600 rounded-lg hover:bg-red-600 hover:text-white transition-all"
              >
                Contact
              </Link>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}