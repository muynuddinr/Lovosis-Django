'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import logo from '../../../public/logo0bg.png';

type ParentCategory = {
  id: number;
  title: string;
  slug: string;
  image: string;
  description: string;
};

type Category = {
  id: number;
  title: string;
  slug: string;
  image: string;
  description: string;
  parent_category: number;
};

type SubCategory = {
  id: number;
  title: string;
  slug: string;
  image: string;
  description: string;
  parent_category: number;
  category: number;
};

type Product = {
  id: number;
  title: string;
  slug: string;
  image: string;
  parent_category: number;
  category?: number;
  sub_category?: number;
};

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [productsDropdownOpen, setProductsDropdownOpen] = useState(false);
  const [parentCategories, setParentCategories] = useState<ParentCategory[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [subCategories, setSubCategories] = useState<SubCategory[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const fetchMenuData = async () => {
      try {
        const [parentsRes, categoriesRes, subsRes, productsRes] = await Promise.all([
          fetch('http://127.0.0.1:8000/api/parent-categories/'),
          fetch('http://127.0.0.1:8000/api/categories/'),
          fetch('http://127.0.0.1:8000/api/sub-categories/'),
          fetch('http://127.0.0.1:8000/api/products/')
        ]);
        setParentCategories(await parentsRes.json());
        setCategories(await categoriesRes.json());
        setSubCategories(await subsRes.json());
        setProducts(await productsRes.json());
      } catch (error) {
        console.error('Failed to fetch menu data:', error);
      }
    };
    fetchMenuData();
  }, []);

  const navItems = [
    { href: '/', label: 'Home' },
    { href: '/aboutus', label: 'About' },
    { href: '/services', label: 'Services' },
    { href: '/gallery', label: 'Gallery' },
    { href: '/Contact', label: 'Contact' },
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
            {/* Products Dropdown */}
            <div className="relative">
              <button
                onClick={() => setProductsDropdownOpen(!productsDropdownOpen)}
                className={`text-sm font-medium transition-colors ${
                  pathname.startsWith('/products') ? activeClass : linkClass
                }`}
              >
                Products
              </button>
              {productsDropdownOpen && (
                <div className="absolute top-full left-0 mt-2 w-96 max-h-96 overflow-y-auto bg-white border border-gray-200 rounded-lg shadow-lg z-50">
                  {parentCategories.map((parent) => (
                    <div key={parent.id} className="p-4 border-b border-gray-100 last:border-b-0">
                      <Link
                        href={`/products/${parent.slug}`}
                        onClick={() => setProductsDropdownOpen(false)}
                        className="flex items-center gap-3 hover:bg-gray-50 p-2 rounded"
                      >
                        <img
                          src={parent.image}
                          alt={parent.title}
                          className="w-10 h-10 object-cover rounded"
                        />
                        <span className="font-medium text-gray-900">{parent.title}</span>
                      </Link>
                      {/* Categories */}
                      {categories.filter(cat => cat.parent_category === parent.id).map((category) => (
                        <div key={category.id} className="ml-6 mt-2">
                          <Link
                            href={`/products/${parent.slug}/${category.slug}`}
                            onClick={() => setProductsDropdownOpen(false)}
                            className="flex items-center gap-3 hover:bg-gray-50 p-2 rounded"
                          >
                            <img
                              src={category.image}
                              alt={category.title}
                              className="w-8 h-8 object-cover rounded"
                            />
                            <span className="text-sm text-gray-700">{category.title}</span>
                          </Link>
                          {/* Subcategories */}
                          {subCategories.filter(sub => sub.category === category.id).map((sub) => (
                            <div key={sub.id} className="ml-6 mt-1">
                              <Link
                                href={`/products/${parent.slug}/${category.slug}/${sub.slug}`}
                                onClick={() => setProductsDropdownOpen(false)}
                                className="flex items-center gap-3 hover:bg-gray-50 p-2 rounded"
                              >
                                <img
                                  src={sub.image}
                                  alt={sub.title}
                                  className="w-6 h-6 object-cover rounded"
                                />
                                <span className="text-xs text-gray-600">{sub.title}</span>
                              </Link>
                              {/* Products under subcategory */}
                              {products.filter(prod => prod.sub_category === sub.id).slice(0, 3).map((product) => (
                                <Link
                                  key={product.id}
                                  href={`/products/${parent.slug}/${category.slug}/${sub.slug}/${product.slug}`}
                                  onClick={() => setProductsDropdownOpen(false)}
                                  className="flex items-center gap-3 hover:bg-gray-50 p-2 rounded ml-6 mt-1"
                                >
                                  <img
                                    src={product.image}
                                    alt={product.title}
                                    className="w-5 h-5 object-cover rounded"
                                  />
                                  <span className="text-xs text-gray-500">{product.title}</span>
                                </Link>
                              ))}
                            </div>
                          ))}
                          {/* Products under category */}
                          {products.filter(prod => prod.category === category.id && !prod.sub_category).slice(0, 3).map((product) => (
                            <Link
                              key={product.id}
                              href={`/products/${parent.slug}/${category.slug}/${product.slug}`}
                              onClick={() => setProductsDropdownOpen(false)}
                              className="flex items-center gap-3 hover:bg-gray-50 p-2 rounded ml-6 mt-1"
                            >
                              <img
                                src={product.image}
                                alt={product.title}
                                className="w-5 h-5 object-cover rounded"
                              />
                              <span className="text-xs text-gray-500">{product.title}</span>
                            </Link>
                          ))}
                        </div>
                      ))}
                      {/* Products under parent */}
                      {products.filter(prod => prod.parent_category === parent.id && !prod.category).slice(0, 3).map((product) => (
                        <Link
                          key={product.id}
                          href={`/products/${parent.slug}/${product.slug}`}
                          onClick={() => setProductsDropdownOpen(false)}
                          className="flex items-center gap-3 hover:bg-gray-50 p-2 rounded ml-6 mt-2"
                        >
                          <img
                            src={product.image}
                            alt={product.title}
                            className="w-5 h-5 object-cover rounded"
                          />
                          <span className="text-xs text-gray-500">{product.title}</span>
                        </Link>
                      ))}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Right Side */}
          <div className="flex items-center gap-4">
            <Link
              href="/contact"
              className="hidden md:inline-block px-4 py-1.5 text-sm font-semibold text-red-600 border border-red-600  hover:bg-red-600 hover:text-white transition-all"
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
              {/* Mobile Products Dropdown */}
              <div>
                <button
                  onClick={() => setProductsDropdownOpen(!productsDropdownOpen)}
                  className={`block w-full text-left px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    pathname.startsWith('/products')
                      ? scrolled ? 'text-blue-400 bg-white/10' : 'text-blue-600 bg-blue-50'
                      : linkClass
                  }`}
                >
                  Products
                </button>
                {productsDropdownOpen && (
                  <div className="ml-4 mt-2 space-y-2">
                    {parentCategories.map((parent) => (
                      <div key={parent.id}>
                        <Link
                          href={`/products/${parent.slug}`}
                          onClick={() => { setIsOpen(false); setProductsDropdownOpen(false); }}
                          className="flex items-center gap-3 hover:bg-gray-50 p-2 rounded"
                        >
                          <img
                            src={parent.image}
                            alt={parent.title}
                            className="w-8 h-8 object-cover rounded"
                          />
                          <span className="font-medium text-gray-900">{parent.title}</span>
                        </Link>
                        {/* Categories */}
                        {categories.filter(cat => cat.parent_category === parent.id).map((category) => (
                          <div key={category.id} className="ml-6">
                            <Link
                              href={`/products/${parent.slug}/${category.slug}`}
                              onClick={() => { setIsOpen(false); setProductsDropdownOpen(false); }}
                              className="flex items-center gap-3 hover:bg-gray-50 p-2 rounded"
                            >
                              <img
                                src={category.image}
                                alt={category.title}
                                className="w-6 h-6 object-cover rounded"
                              />
                              <span className="text-sm text-gray-700">{category.title}</span>
                            </Link>
                            {/* Subcategories */}
                            {subCategories.filter(sub => sub.category === category.id).map((sub) => (
                              <div key={sub.id} className="ml-6">
                                <Link
                                  href={`/products/${parent.slug}/${category.slug}/${sub.slug}`}
                                  onClick={() => { setIsOpen(false); setProductsDropdownOpen(false); }}
                                  className="flex items-center gap-3 hover:bg-gray-50 p-2 rounded"
                                >
                                  <img
                                    src={sub.image}
                                    alt={sub.title}
                                    className="w-5 h-5 object-cover rounded"
                                  />
                                  <span className="text-xs text-gray-600">{sub.title}</span>
                                </Link>
                              </div>
                            ))}
                          </div>
                        ))}
                      </div>
                    ))}
                  </div>
                )}
              </div>
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