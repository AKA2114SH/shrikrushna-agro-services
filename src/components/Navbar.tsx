'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useLanguage } from '@/context/LanguageContext';
import {
  Sprout,
  Phone,
  MessageCircle,
  FileText,
  Menu,
  X,
  Languages,
  ShieldCheck,
  UserCheck,
} from 'lucide-react';

export default function Navbar() {
  const { lang, setLang, t } = useLanguage();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-emerald-100 shadow-sm">
      {/* Top micro-bar for quick contact */}
      <div className="bg-agro-900 text-emerald-100 text-xs py-1.5 px-4 sm:px-8 flex justify-between items-center">
        <div className="flex items-center gap-4">
          <span className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            <span>📍 {t.location}</span>
          </span>
          <span className="hidden md:inline text-emerald-300">
            ⏰ {t.businessHours}
          </span>
        </div>
        <div className="flex items-center gap-4">
          <a
            href="tel:+918605620843"
            className="hover:text-white flex items-center gap-1 font-medium transition"
          >
            <Phone className="w-3 h-3 text-emerald-400" />
            <span>8605620843</span>
          </a>
          <span className="hidden sm:inline text-emerald-600">|</span>
          <a
            href="https://wa.me/918605620843?text=नमस्कार%2C%20मला%20कृषी%20उत्पादनांविषयी%20माहिती%20हवी%20आहे."
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-emerald-300 flex items-center gap-1 text-emerald-300 font-semibold"
          >
            <MessageCircle className="w-3 h-3 text-emerald-400" />
            <span>WhatsApp</span>
          </a>
        </div>
      </div>

      {/* Main navigation */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-18 py-2">
          {/* Brand Identity */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-agro-700 to-agro-900 flex items-center justify-center text-white shadow-agro group-hover:scale-105 transition">
              <Sprout className="w-6 h-6 text-emerald-300" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-lg sm:text-xl text-agro-950 tracking-tight">
                  {t.brandName}
                </span>
                <span className="hidden lg:inline-block bg-agro-100 text-agro-800 text-[10px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wider">
                  Sinnar
                </span>
              </div>
              <p className="text-xs text-emerald-700 font-medium line-clamp-1">
                {t.brandTagline}
              </p>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-6 text-sm font-semibold text-slate-700">
            <Link href="/" className="hover:text-agro-700 transition">
              {t.navHome}
            </Link>
            <Link href="/products" className="hover:text-agro-700 transition">
              {t.navProducts}
            </Link>
            <Link href="/advisory" className="hover:text-agro-700 transition">
              {t.navAdvisory}
            </Link>
            <Link href="/quotation" className="hover:text-agro-700 transition">
              {t.navQuotation}
            </Link>
            <Link href="/admin" className="hover:text-agro-700 transition flex items-center gap-1 text-slate-600">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>{t.navAdmin}</span>
            </Link>
          </nav>

          {/* Right Action CTA & Language Toggle */}
          <div className="hidden sm:flex items-center gap-3">
            {/* Language Switcher */}
            <button
              onClick={() => setLang(lang === 'mr' ? 'en' : 'mr')}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 text-xs font-bold text-slate-700 hover:bg-slate-50 transition"
              title="भाषा बदला / Change Language"
            >
              <Languages className="w-3.5 h-3.5 text-agro-700" />
              <span>{lang === 'mr' ? 'English' : 'मराठी'}</span>
            </button>

            {/* Instant Quotation CTA */}
            <Link
              href="/quotation"
              className="flex items-center gap-2 bg-gradient-to-r from-agro-700 to-agro-800 hover:from-agro-800 hover:to-agro-900 text-white text-xs sm:text-sm font-bold px-4 py-2 rounded-lg shadow-agro hover-lift transition"
            >
              <FileText className="w-4 h-4" />
              <span>{t.getQuotation}</span>
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <div className="flex md:hidden items-center gap-2">
            <button
              onClick={() => setLang(lang === 'mr' ? 'en' : 'mr')}
              className="px-2.5 py-1 rounded border border-slate-200 text-xs font-bold text-slate-800"
            >
              {lang === 'mr' ? 'EN' : 'मराठी'}
            </button>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-slate-700 hover:text-agro-800"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white border-b border-emerald-100 px-4 pt-2 pb-6 space-y-3 shadow-lg">
          <Link
            href="/"
            onClick={() => setMobileMenuOpen(false)}
            className="block py-2 text-base font-semibold text-slate-800 border-b border-slate-100"
          >
            {t.navHome}
          </Link>
          <Link
            href="/products"
            onClick={() => setMobileMenuOpen(false)}
            className="block py-2 text-base font-semibold text-slate-800 border-b border-slate-100"
          >
            {t.navProducts}
          </Link>
          <Link
            href="/advisory"
            onClick={() => setMobileMenuOpen(false)}
            className="block py-2 text-base font-semibold text-slate-800 border-b border-slate-100"
          >
            {t.navAdvisory}
          </Link>
          <Link
            href="/quotation"
            onClick={() => setMobileMenuOpen(false)}
            className="block py-2 text-base font-semibold text-slate-800 border-b border-slate-100"
          >
            {t.navQuotation}
          </Link>
          <Link
            href="/admin"
            onClick={() => setMobileMenuOpen(false)}
            className="block py-2 text-base font-semibold text-agro-800 flex items-center gap-2"
          >
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>{t.navAdmin} (ERP)</span>
          </Link>

          <div className="pt-2">
            <Link
              href="/quotation"
              onClick={() => setMobileMenuOpen(false)}
              className="w-full text-center block bg-agro-700 text-white font-bold py-2.5 rounded-lg shadow-sm"
            >
              {t.getQuotation}
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
