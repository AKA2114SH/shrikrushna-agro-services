'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useLanguage } from '@/context/LanguageContext';
import {
  Sprout,
  ShieldCheck,
  Award,
  Phone,
  MessageCircle,
  FileText,
  Search,
  CheckCircle2,
  MapPin,
  Clock,
  ChevronRight,
  Droplets,
  Layers,
  Bug,
  Sparkles,
  Zap,
  HelpCircle,
  TrendingUp,
} from 'lucide-react';
import { Product, Category } from '@/lib/store';
import QuotationModal from '@/components/QuotationModal';

export default function HomePage() {
  const { t } = useLanguage();
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(true);
  const [quoteModalOpen, setQuoteModalOpen] = useState<boolean>(false);
  const [selectedProductForQuote, setSelectedProductForQuote] = useState<Product | null>(null);

  useEffect(() => {
    fetch('/api/products')
      .then((res) => res.json())
      .then((data) => {
        if (data.products) setProducts(data.products);
        if (data.categories) setCategories(data.categories);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const filteredProducts = products.filter((p) => {
    const matchesCategory =
      selectedCategory === 'all' || p.categoryId === selectedCategory;
    const matchesSearch =
      !searchQuery ||
      p.nameMr.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.nameEn.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.brandName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (p.technicalName && p.technicalName.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  const openQuoteForProduct = (p: Product) => {
    setSelectedProductForQuote(p);
    setQuoteModalOpen(true);
  };

  return (
    <div className="space-y-16 pb-20">
      {/* ------------------------------------------------------------- */}
      {/* 1. HERO SECTION */}
      {/* ------------------------------------------------------------- */}
      <section className="relative bg-gradient-to-b from-agro-950 via-agro-900 to-agro-800 text-white pt-12 pb-20 px-4 sm:px-6 lg:px-8 overflow-hidden">
        {/* Decorative background glow */}
        <div className="absolute top-0 right-0 -mr-20 -mt-20 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none"></div>

        <div className="max-w-7xl mx-auto relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            {/* Hero Left Content */}
            <div className="lg:col-span-7 space-y-6">
              <div className="inline-flex items-center gap-2 bg-emerald-800/80 border border-emerald-500/30 text-emerald-300 text-xs font-bold px-3.5 py-1.5 rounded-full shadow-inner">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <span>{t.heroBadge}</span>
              </div>

              <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight leading-tight text-white">
                {t.heroTitle}
              </h1>

              <p className="text-sm sm:text-base text-emerald-100/90 max-w-2xl leading-relaxed">
                {t.heroSubtitle}
              </p>

              {/* Action Buttons */}
              <div className="pt-2 flex flex-wrap gap-3">
                <a
                  href="#products"
                  className="bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold px-6 py-3.5 rounded-xl shadow-agro-lg hover-lift transition text-sm flex items-center gap-2"
                >
                  <Sprout className="w-5 h-5 text-slate-950" />
                  <span>{t.heroCtaProducts}</span>
                </a>
                <a
                  href="https://wa.me/918605620843?text=नमस्कार%2C%20मला%20कृषी%20सल्ला%20व%20खतांच्या%20दरांविषयी%20माहिती%20हवी%20आहे."
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-white/10 hover:bg-white/20 border border-white/20 text-white font-bold px-6 py-3.5 rounded-xl backdrop-blur-md hover-lift transition text-sm flex items-center gap-2"
                >
                  <MessageCircle className="w-5 h-5 text-emerald-300" />
                  <span>{t.heroCtaChat}</span>
                </a>
              </div>

              {/* Quick Info Grid */}
              <div className="pt-6 grid grid-cols-2 sm:grid-cols-3 gap-3 border-t border-emerald-800/80 text-xs text-emerald-200">
                <div>
                  <p className="font-bold text-white text-sm">१००% अस्सल</p>
                  <p className="text-[11px] text-emerald-300">नामांकित कंपन्यांची उत्पादने</p>
                </div>
                <div>
                  <p className="font-bold text-white text-sm">B.Sc Agri तज्ञ</p>
                  <p className="text-[11px] text-emerald-300">थेट शास्त्रोक्त पीक मार्गदर्शन</p>
                </div>
                <div>
                  <p className="font-bold text-white text-sm">डिजिटल कोटेशन</p>
                  <p className="text-[11px] text-emerald-300">त्वरित WhatsApp वर पावती</p>
                </div>
              </div>
            </div>

            {/* Hero Right: Agronomist & Center Cards */}
            <div className="lg:col-span-5 space-y-4">
              <div className="glass-dark rounded-2xl p-6 text-white border border-emerald-500/20 shadow-2xl relative">
                <div className="flex items-center justify-between pb-4 border-b border-emerald-800">
                  <div className="flex items-center gap-2">
                    <Award className="w-5 h-5 text-amber-400" />
                    <h3 className="font-bold text-sm text-emerald-200 uppercase tracking-wider">
                      {t.agronomists}
                    </h3>
                  </div>
                  <span className="text-[10px] bg-emerald-800 text-emerald-300 px-2 py-0.5 rounded-full font-bold">
                    सिन्नर, नाशिक
                  </span>
                </div>

                <div className="space-y-4 pt-4">
                  {/* Shubham Gamane */}
                  <div className="bg-emerald-950/60 rounded-xl p-3.5 border border-emerald-700/40 flex items-center justify-between">
                    <div>
                      <h4 className="font-bold text-base text-white">{t.shubhamName}</h4>
                      <p className="text-xs text-emerald-300">{t.shubhamRole}</p>
                      <p className="text-[11px] text-slate-300 mt-1">
                        कांदा, द्राक्ष व भाजीपाला पीक पोषण तज्ञ
                      </p>
                    </div>
                    <a
                      href="tel:+918605620843"
                      className="bg-emerald-600 hover:bg-emerald-500 text-white p-2.5 rounded-lg transition"
                      title="कॉल करा"
                    >
                      <Phone className="w-4 h-4" />
                    </a>
                  </div>

                  {/* Jagdish Bodke */}
                  <div className="bg-emerald-950/60 rounded-xl p-3.5 border border-emerald-700/40 flex items-center justify-between">
                    <div>
                      <h4 className="font-bold text-base text-white">{t.jagdishName}</h4>
                      <p className="text-xs text-emerald-300">{t.jagdishRole}</p>
                      <p className="text-[11px] text-slate-300 mt-1">
                        डाळिंब, टोमॅटो व रोग-कीड नियंत्रण तज्ञ
                      </p>
                    </div>
                    <a
                      href="tel:+918888474456"
                      className="bg-emerald-600 hover:bg-emerald-500 text-white p-2.5 rounded-lg transition"
                      title="कॉल करा"
                    >
                      <Phone className="w-4 h-4" />
                    </a>
                  </div>
                </div>

                <div className="mt-4 pt-4 border-t border-emerald-800/80 flex items-center justify-between text-xs text-emerald-300">
                  <div className="flex items-center gap-1.5">
                    <Clock className="w-4 h-4 text-emerald-400" />
                    <span>८:०० AM ते ८:३० PM</span>
                  </div>
                  <button
                    onClick={() => setQuoteModalOpen(true)}
                    className="text-amber-300 font-bold hover:underline flex items-center gap-1"
                  >
                    <span>कोटेशन मागवा</span>
                    <ChevronRight className="w-3 h-3" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ------------------------------------------------------------- */}
      {/* 2. TRUST HIGHLIGHTS */}
      {/* ------------------------------------------------------------- */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-sm hover-lift transition">
            <div className="w-10 h-10 rounded-xl bg-emerald-100 text-agro-700 flex items-center justify-center mb-3">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-slate-900 text-sm">{t.trustItem1Title}</h3>
            <p className="text-xs text-slate-600 mt-1 leading-relaxed">{t.trustItem1Desc}</p>
          </div>

          <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-sm hover-lift transition">
            <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center mb-3">
              <Award className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-slate-900 text-sm">{t.trustItem2Title}</h3>
            <p className="text-xs text-slate-600 mt-1 leading-relaxed">{t.trustItem2Desc}</p>
          </div>

          <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-sm hover-lift transition">
            <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center mb-3">
              <TrendingUp className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-slate-900 text-sm">{t.trustItem3Title}</h3>
            <p className="text-xs text-slate-600 mt-1 leading-relaxed">{t.trustItem3Desc}</p>
          </div>

          <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-sm hover-lift transition">
            <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center mb-3">
              <MessageCircle className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-slate-900 text-sm">{t.trustItem4Title}</h3>
            <p className="text-xs text-slate-600 mt-1 leading-relaxed">{t.trustItem4Desc}</p>
          </div>
        </div>
      </section>

      {/* ------------------------------------------------------------- */}
      {/* 3. PRODUCT CATALOGUE & FILTER SHOWCASE */}
      {/* ------------------------------------------------------------- */}
      <section id="products" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 text-agro-700 text-xs font-bold uppercase tracking-wider mb-1">
              <Sprout className="w-4 h-4" />
              <span>{t.catalogueTitle}</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
              {t.catalogueSubtitle}
            </h2>
          </div>

          {/* Search Box */}
          <div className="w-full md:w-80 relative">
            <Search className="w-4 h-4 absolute left-3.5 top-3.5 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={t.searchPlaceholder}
              className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-300 rounded-xl text-xs sm:text-sm focus:outline-none focus:border-agro-600 shadow-sm"
            />
          </div>
        </div>

        {/* Category Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
          <button
            onClick={() => setSelectedCategory('all')}
            className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition ${
              selectedCategory === 'all'
                ? 'bg-agro-800 text-white shadow-sm'
                : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-50'
            }`}
          >
            {t.allCategories}
          </button>
          {categories.map((c) => (
            <button
              key={c.id}
              onClick={() => setSelectedCategory(c.id)}
              className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition ${
                selectedCategory === c.id
                  ? 'bg-agro-800 text-white shadow-sm'
                  : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-50'
              }`}
            >
              {c.nameMr}
            </button>
          ))}
        </div>

        {/* Product Cards Grid */}
        {loading ? (
          <div className="text-center py-12 text-slate-500 text-sm">
            उत्पादने लोड होत आहेत...
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-2xl border border-slate-200 p-8 space-y-2">
            <Sprout className="w-12 h-12 text-slate-300 mx-auto" />
            <h4 className="font-bold text-slate-700">कोणतीही उत्पादने सापडली नाहीत</h4>
            <p className="text-xs text-slate-500">कृपया वेगळा शब्द किंवा वर्गवारी निवडून शोधा.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {filteredProducts.map((p) => (
              <div
                key={p.id}
                className="bg-white rounded-2xl border border-slate-200/80 p-4 flex flex-col justify-between shadow-sm hover-lift transition group"
              >
                <div className="space-y-3">
                  {/* Category & Availability Tag */}
                  <div className="flex justify-between items-center text-[10px]">
                    <span className="bg-slate-100 text-slate-700 px-2.5 py-0.5 rounded-full font-bold">
                      {p.brandName}
                    </span>
                    <span
                      className={`font-bold px-2 py-0.5 rounded-full ${
                        p.totalStock > 0
                          ? 'bg-emerald-50 text-emerald-700'
                          : 'bg-amber-50 text-amber-700'
                      }`}
                    >
                      {p.totalStock > 0 ? `✅ ${t.inStock}` : `⏳ ${t.outOfStock}`}
                    </span>
                  </div>

                  {/* Product Title & Technical Spec */}
                  <div>
                    <h3 className="font-bold text-slate-900 text-sm group-hover:text-agro-700 transition">
                      {p.nameMr}
                    </h3>
                    <p className="text-xs text-slate-500 line-clamp-1">{p.nameEn}</p>
                    {p.technicalName && (
                      <p className="text-[11px] text-emerald-700 font-medium mt-1 bg-emerald-50/60 px-2 py-0.5 rounded">
                        घटक: {p.technicalName}
                      </p>
                    )}
                  </div>

                  {/* Pack Size & Crop Recommendation */}
                  <div className="text-xs text-slate-600 space-y-1">
                    <p>
                      <strong>{t.packSize}:</strong> {p.packSize}
                    </p>
                    {p.targetCrops && (
                      <p className="text-[11px] text-slate-500 line-clamp-1">
                        <strong>उपयुक्त पिके:</strong> {p.targetCrops}
                      </p>
                    )}
                  </div>
                </div>

                {/* Price & Action Buttons */}
                <div className="pt-3 mt-3 border-t border-slate-100 space-y-2">
                  <div className="flex items-baseline justify-between">
                    <div>
                      <span className="text-[10px] text-slate-400 line-through mr-1">
                        MRP ₹{p.mrp}
                      </span>
                      <span className="text-base font-extrabold text-agro-950">
                        ₹{p.sellingPrice}
                      </span>
                    </div>
                    <span className="text-[10px] bg-emerald-50 text-emerald-800 font-bold px-1.5 py-0.5 rounded">
                      चालू दर
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-1.5 text-xs font-bold pt-1">
                    <button
                      onClick={() => openQuoteForProduct(p)}
                      className="bg-slate-100 hover:bg-slate-200 text-slate-800 py-1.5 rounded-lg transition flex items-center justify-center gap-1"
                    >
                      <FileText className="w-3.5 h-3.5 text-agro-700" />
                      <span>कोटेशन</span>
                    </button>

                    <a
                      href={`https://wa.me/918605620843?text=${encodeURIComponent(
                        `नमस्कार, मला "${p.nameMr} (${p.packSize})" च्या दराविषयी माहिती हवी आहे.`
                      )}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="bg-emerald-600 hover:bg-emerald-700 text-white py-1.5 rounded-lg transition flex items-center justify-center gap-1 shadow-sm"
                    >
                      <MessageCircle className="w-3.5 h-3.5" />
                      <span>WhatsApp</span>
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* ------------------------------------------------------------- */}
      {/* 4. CROP ADVISORY PREVIEWS */}
      {/* ------------------------------------------------------------- */}
      <section className="bg-emerald-900/10 py-12 px-4 sm:px-6 lg:px-8 border-y border-emerald-200/60">
        <div className="max-w-7xl mx-auto space-y-8">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <span className="text-agro-700 font-bold text-xs uppercase tracking-wider">
              {t.advisoryTitle}
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
              {t.advisorySubtitle}
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Onion Guide */}
            <div className="bg-white rounded-2xl p-5 border border-emerald-100 shadow-sm space-y-3">
              <div className="flex items-center gap-2 text-agro-800 font-bold text-base">
                <Sprout className="w-5 h-5 text-emerald-600" />
                <h3>{t.onionTitle}</h3>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                रोपवाटिका ते काढणीपर्यंत संपूर्ण खत व जांभळा करपा / थ्रिप्स नियंत्रणासाठी शास्त्रोक्त फवारणी वेळापत्रक.
              </p>
              <div className="text-[11px] text-emerald-800 font-semibold bg-emerald-50 p-2 rounded-lg">
                💡 शिफारस: १९:१९:१९ सुरुवातीला, ०:५२:३४ गाठ फुगवणीच्या वेळी आणि नॅटिव्हो करप्यासाठी.
              </div>
              <Link
                href="/advisory"
                className="text-agro-700 hover:text-agro-900 font-bold text-xs inline-flex items-center gap-1 pt-1"
              >
                <span>{t.viewGuide}</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            {/* Grapes Guide */}
            <div className="bg-white rounded-2xl p-5 border border-emerald-100 shadow-sm space-y-3">
              <div className="flex items-center gap-2 text-agro-800 font-bold text-base">
                <Droplets className="w-5 h-5 text-emerald-600" />
                <h3>{t.grapesTitle}</h3>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                सिन्नर व नाशिक भागातील निर्यातक्षम द्राक्ष बागांसाठी डावणी, भुरी व घड फुगवण व्यवस्थापन.
              </p>
              <div className="text-[11px] text-emerald-800 font-semibold bg-emerald-50 p-2 rounded-lg">
                💡 शिफारस: नायट्राबोर कॅल्शियम, ॲमिस्टार टॉप आणि विद्राव्य सूक्ष्म अन्नद्रव्ये.
              </div>
              <Link
                href="/advisory"
                className="text-agro-700 hover:text-agro-900 font-bold text-xs inline-flex items-center gap-1 pt-1"
              >
                <span>{t.viewGuide}</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            {/* Pomegranate Guide */}
            <div className="bg-white rounded-2xl p-5 border border-emerald-100 shadow-sm space-y-3">
              <div className="flex items-center gap-2 text-agro-800 font-bold text-base">
                <Layers className="w-5 h-5 text-emerald-600" />
                <h3>{t.pomegranateTitle}</h3>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                मृग व हस्त बहार व्यवस्थापन, फळांवर डाग / तेल्या प्रतिबंध आणि तडकणे रोखण्यासाठी विशेष उपाय.
              </p>
              <div className="text-[11px] text-emerald-800 font-semibold bg-emerald-50 p-2 rounded-lg">
                💡 शिफारस: चिलेटेड झिंक, बोरॉन आणि जैविक बुरशीनाशकांचे योग्य मिश्रण.
              </div>
              <Link
                href="/advisory"
                className="text-agro-700 hover:text-agro-900 font-bold text-xs inline-flex items-center gap-1 pt-1"
              >
                <span>{t.viewGuide}</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            {/* Tomato Guide */}
            <div className="bg-white rounded-2xl p-5 border border-emerald-100 shadow-sm space-y-3">
              <div className="flex items-center gap-2 text-agro-800 font-bold text-base">
                <Bug className="w-5 h-5 text-emerald-600" />
                <h3>{t.tomatoTitle}</h3>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                नागअळी, फळपोखरणाऱ्या अळ्या व व्हायरस नियंत्रणासह भरघोस उत्पादनासाठी टॉनिक मार्गदर्शन.
              </p>
              <div className="text-[11px] text-emerald-800 font-semibold bg-emerald-50 p-2 rounded-lg">
                💡 शिफारस: कोराजन, स्ट्रेप्टोमायसिन आणि योग्य फुलधारणा संप्रेरके.
              </div>
              <Link
                href="/advisory"
                className="text-agro-700 hover:text-agro-900 font-bold text-xs inline-flex items-center gap-1 pt-1"
              >
                <span>{t.viewGuide}</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ------------------------------------------------------------- */}
      {/* 5. FREQUENTLY ASKED QUESTIONS (FAQ) */}
      {/* ------------------------------------------------------------- */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <div className="text-center space-y-2">
          <div className="inline-flex items-center gap-1 text-agro-700 text-xs font-bold uppercase">
            <HelpCircle className="w-4 h-4" />
            <span>नेहमी विचारले जाणारे प्रश्न (FAQ)</span>
          </div>
          <h2 className="text-2xl font-extrabold text-slate-900">
            शेतकऱ्यांचे महत्त्वाचे प्रश्न व उत्तरे
          </h2>
        </div>

        <div className="space-y-3 text-xs sm:text-sm">
          <div className="bg-white rounded-xl p-4 border border-slate-200">
            <p className="font-bold text-slate-800">
              १. श्री कृष्ण ॲग्रो सर्व्हिसेस कडून कोटेशन कसे मिळवावे?
            </p>
            <p className="text-slate-600 mt-1.5 leading-relaxed">
              आपण वेबसाइटवरील &quot;कोटेशन मिळवा&quot; बटणावर क्लिक करून आवश्यक उत्पादने निवडून थेट संगणकीय दरपत्रक मिळवू शकता किंवा आमच्या व्हॉट्सॲप नंबरवर (८६०५६२०८४३) यादी पाठवू शकता.
            </p>
          </div>

          <div className="bg-white rounded-xl p-4 border border-slate-200">
            <p className="font-bold text-slate-800">
              २. पिकांवरील रोगांसाठी कृषी तज्ञांचा थेट सल्ला मिळतो का?
            </p>
            <p className="text-slate-600 mt-1.5 leading-relaxed">
              होय, आमचे B.Sc Agri तज्ञ शुभम गमाणे व जगदीश बोडके हे प्रत्यक्ष दुकानात आणि व्हॉट्सॲपवर पिकांचे फोटो पाहून अचूक रोगनिदान व औषध फवारणी सल्ला विनामूल्य देतात.
            </p>
          </div>

          <div className="bg-white rounded-xl p-4 border border-slate-200">
            <p className="font-bold text-slate-800">
              ३. पेमेंटचे कोणते पर्याय उपलब्ध आहेत?
            </p>
            <p className="text-slate-600 mt-1.5 leading-relaxed">
              आम्ही रोख (Cash), UPI (Google Pay, PhonePe), थेट बँक ट्रान्सफर स्वीकारतो. तसेच नोंदणीकृत नियमित शेतकऱ्यांसाठी उधारी (Khata) सुविधा उपलब्ध आहे.
            </p>
          </div>
        </div>
      </section>

      {/* Quotation Modal Component */}
      <QuotationModal
        isOpen={quoteModalOpen}
        onClose={() => {
          setQuoteModalOpen(false);
          setSelectedProductForQuote(null);
        }}
        initialProduct={selectedProductForQuote}
        availableProducts={products}
      />
    </div>
  );
}
