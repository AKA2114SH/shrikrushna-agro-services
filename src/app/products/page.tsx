'use client';

import React, { useState, useEffect } from 'react';
import { useLanguage } from '@/context/LanguageContext';
import { Search, Filter, Sprout, FileText, MessageCircle, Phone, Sparkles } from 'lucide-react';
import store, { Product, Category, Brand, INITIAL_PRODUCTS, INITIAL_CATEGORIES, INITIAL_BRANDS } from '@/lib/store';
import QuotationModal from '@/components/QuotationModal';
import ProductImage from '@/components/ProductImage';

export default function ProductsPage() {
  const { t } = useLanguage();
  // Pre-load from store directly for 100% instant rendering on GitHub Pages & offline
  const [products, setProducts] = useState<Product[]>(INITIAL_PRODUCTS);
  const [categories, setCategories] = useState<Category[]>(INITIAL_CATEGORIES);
  const [brands, setBrands] = useState<Brand[]>(INITIAL_BRANDS);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedBrand, setSelectedBrand] = useState('all');
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [activeProduct, setActiveProduct] = useState<Product | null>(null);

  useEffect(() => {
    const isGithubIo = typeof window !== 'undefined' && window.location.hostname.includes('github.io');
    if (!isGithubIo) {
      const apiUrl = `${process.env.NEXT_PUBLIC_API_URL || ''}/api/products`;
      fetch(apiUrl)
        .then((r) => {
          if (!r.ok) throw new Error('API unavailable');
          return r.json();
        })
        .then((data) => {
          if (data.products && data.products.length > 0) setProducts(data.products);
          if (data.categories && data.categories.length > 0) setCategories(data.categories);
          if (data.brands && data.brands.length > 0) setBrands(data.brands);
        })
        .catch(() => {
          setProducts(store.getProducts());
          setCategories(store.getCategories());
          setBrands(store.getBrands());
        });
    }
  }, []);

  const filtered = products.filter((p) => {
    const matchCat = selectedCategory === 'all' || p.categoryId === selectedCategory;
    const matchBrand = selectedBrand === 'all' || p.brandId === selectedBrand;
    const matchSearch =
      !search ||
      p.nameMr.toLowerCase().includes(search.toLowerCase()) ||
      p.nameEn.toLowerCase().includes(search.toLowerCase()) ||
      p.brandName.toLowerCase().includes(search.toLowerCase()) ||
      (p.technicalName && p.technicalName.toLowerCase().includes(search.toLowerCase())) ||
      (p.targetCrops && p.targetCrops.toLowerCase().includes(search.toLowerCase()));
    return matchCat && matchBrand && matchSearch;
  });

  return (
    <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-6 sm:py-10 space-y-6 sm:space-y-8">
      {/* Header */}
      <div className="bg-gradient-to-br from-agro-950 via-agro-900 to-agro-800 text-white rounded-3xl p-5 sm:p-10 shadow-agro-lg relative overflow-hidden">
        <div className="max-w-2xl space-y-2 relative z-10">
          <div className="inline-flex items-center gap-1.5 bg-emerald-800/80 text-emerald-300 text-[11px] font-bold px-3 py-1 rounded-full border border-emerald-600/40">
            <Sparkles className="w-3.5 h-3.5" />
            <span>श्री कृष्ण ॲग्रो सर्व्हिसेस • सिन्नर, नाशिक</span>
          </div>
          <h1 className="text-xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight">
            खते, कीटकनाशके, बुरशीनाशके व बियाणे कॅटलॉग
          </h1>
          <p className="text-xs sm:text-sm text-emerald-100/90 leading-relaxed">
            सिन्नर व नाशिक परिसरासाठी चालू बाजारभाव, १००% अस्सल खात्रीशीर उत्पादने व तज्ञांची शिफारस.
          </p>
        </div>
      </div>

      {/* Quick Mobile Category Badges */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none text-xs font-bold">
        <button
          onClick={() => setSelectedCategory('all')}
          className={`px-4 py-2 rounded-xl whitespace-nowrap transition shadow-sm ${
            selectedCategory === 'all'
              ? 'bg-agro-800 text-white'
              : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-50'
          }`}
        >
          सर्व उत्पादने ({products.length})
        </button>
        {categories.map((c) => (
          <button
            key={c.id}
            onClick={() => setSelectedCategory(c.id)}
            className={`px-4 py-2 rounded-xl whitespace-nowrap transition shadow-sm ${
              selectedCategory === c.id
                ? 'bg-agro-800 text-white'
                : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-50'
            }`}
          >
            {c.nameMr}
          </button>
        ))}
      </div>

      {/* Main Grid: Sidebar Filters + Products */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 items-start">
        {/* Sidebar Filters */}
        <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200 shadow-sm space-y-4 sm:space-y-6">
          <div className="flex items-center justify-between font-bold text-slate-900 text-sm pb-2 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <Filter className="w-4 h-4 text-agro-700" />
              <span>शोध व फिल्टर्स (Filters)</span>
            </div>
            {(search || selectedCategory !== 'all' || selectedBrand !== 'all') && (
              <button
                onClick={() => {
                  setSelectedCategory('all');
                  setSelectedBrand('all');
                  setSearch('');
                }}
                className="text-[11px] text-agro-700 font-bold hover:underline"
              >
                रीसेट
              </button>
            )}
          </div>

          {/* Search */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">उत्पादन किंवा रोग शोधा</label>
            <div className="relative">
              <Search className="w-3.5 h-3.5 absolute left-3 top-3 text-slate-400" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="उदा. १९:१९:१९, कोराजन, करपा, नॅटिव्हो..."
                className="w-full pl-9 pr-3 py-2 border border-slate-300 rounded-lg text-xs focus:ring-1 focus:ring-agro-600 shadow-sm"
              />
            </div>
          </div>

          {/* Categories */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">वर्गवारी (Category)</label>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full border border-slate-300 rounded-lg p-2 text-xs bg-white focus:ring-1 focus:ring-agro-600"
            >
              <option value="all">सर्व वर्गवारी ({categories.length})</option>
              {categories.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.nameMr}
                </option>
              ))}
            </select>
          </div>

          {/* Brands */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">कंपनी / ब्रँड (Brand)</label>
            <select
              value={selectedBrand}
              onChange={(e) => setSelectedBrand(e.target.value)}
              className="w-full border border-slate-300 rounded-lg p-2 text-xs bg-white focus:ring-1 focus:ring-agro-600"
            >
              <option value="all">सर्व नामांकित कंपन्या ({brands.length})</option>
              {brands.map((b) => (
                <option key={b.id} value={b.id}>
                  {b.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Product Cards */}
        <div className="lg:col-span-3 space-y-4">
          <div className="flex justify-between items-center text-xs font-bold text-slate-600 px-1">
            <span>दाखवत आहे: {filtered.length} उत्पादने</span>
            <span className="text-emerald-700 font-semibold">📍 थेट सिन्नर दुकानात उपलब्ध</span>
          </div>

          {loading ? (
            <div className="text-center py-12 text-slate-500 text-sm">उत्पादने लोड होत आहेत...</div>
          ) : filtered.length === 0 ? (
            <div className="bg-white rounded-2xl p-10 border border-slate-200 text-center space-y-2">
              <Sprout className="w-12 h-12 text-slate-300 mx-auto" />
              <p className="font-bold text-slate-700">या नावाने उत्पादन आढळले नाही</p>
              <p className="text-xs text-slate-500">कृपया दुसरे नाव किंवा फिल्टर निवडून पहा.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
              {filtered.map((p) => (
                <div
                  key={p.id}
                  className="bg-white rounded-2xl border border-slate-200/90 p-4 flex flex-col justify-between shadow-sm hover:shadow-md transition space-y-3"
                >
                  <div className="space-y-2">
                    {/* Product Visual Image Frame */}
                    <ProductImage product={p} />

                    <div className="flex justify-between items-center text-[10px]">
                      <span className="bg-slate-100 text-slate-800 px-2 py-0.5 rounded font-extrabold uppercase">
                        {p.categoryNameMr || 'कृषी निविष्ठा'}
                      </span>
                      <span
                        className={`font-bold px-2 py-0.5 rounded ${
                          p.totalStock > 0
                            ? 'bg-emerald-50 text-emerald-800'
                            : 'bg-amber-50 text-amber-800'
                        }`}
                      >
                        {p.totalStock > 0 ? `✅ साठ्यात उपलब्ध (${p.totalStock} ${p.unit})` : '⚠️ मर्यादित'}
                      </span>
                    </div>

                    <div>
                      <h3 className="font-extrabold text-slate-900 text-sm sm:text-base leading-snug">
                        {p.nameMr}
                      </h3>
                      <p className="text-[11px] text-slate-500 line-clamp-1">{p.nameEn}</p>
                      {p.technicalName && (
                        <p className="text-[11px] text-emerald-800 font-semibold mt-1 bg-emerald-50 px-2 py-1 rounded border border-emerald-100 line-clamp-1">
                          घटक: {p.technicalName}
                        </p>
                      )}
                    </div>

                    <div className="text-xs text-slate-600 space-y-1 bg-slate-50 p-2.5 rounded-xl">
                      <p className="flex justify-between">
                        <span className="text-slate-500">पॅकिंग:</span>
                        <strong className="text-slate-900">{p.packSize}</strong>
                      </p>
                      {p.dosageGuide && (
                        <p className="text-[11px] text-slate-600 line-clamp-2 pt-0.5">
                          <strong className="text-slate-700">फवारणी प्रमाण:</strong> {p.dosageGuide}
                        </p>
                      )}
                      {p.targetCrops && (
                        <p className="text-[11px] text-slate-500 line-clamp-1 pt-0.5">
                          <strong>उपयुक्त पिके:</strong> {p.targetCrops}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Pricing and Action Buttons */}
                  <div className="pt-3 border-t border-slate-100 space-y-2.5">
                    <div className="flex items-baseline justify-between">
                      <div>
                        <span className="text-[10px] text-slate-400 line-through mr-1.5">
                          MRP ₹{p.mrp}
                        </span>
                        <span className="text-base sm:text-lg font-extrabold text-agro-950">
                          ₹{p.sellingPrice}
                        </span>
                      </div>
                      <span className="text-[10px] bg-emerald-100 text-emerald-900 font-bold px-1.5 py-0.5 rounded">
                        चालू विक्री दर
                      </span>
                    </div>

                    <div className="grid grid-cols-2 gap-2 text-xs font-bold">
                      <button
                        onClick={() => {
                          setActiveProduct(p);
                          setModalOpen(true);
                        }}
                        className="bg-slate-100 hover:bg-slate-200 text-slate-800 py-2 rounded-xl transition flex items-center justify-center gap-1"
                      >
                        <FileText className="w-3.5 h-3.5 text-agro-700" />
                        <span>कोटेशन</span>
                      </button>

                      <a
                        href={`https://wa.me/918605620843?text=${encodeURIComponent(
                          `नमस्कार, मला श्री कृष्ण ॲग्रो सर्व्हिसेस कडून "${p.nameMr} (${p.packSize})" विषयी दर व उपलब्धतेची माहिती हवी आहे.`
                        )}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="bg-emerald-600 hover:bg-emerald-700 text-white py-2 rounded-xl transition flex items-center justify-center gap-1 shadow-sm"
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
        </div>
      </div>

      <QuotationModal
        isOpen={modalOpen}
        onClose={() => {
          setModalOpen(false);
          setActiveProduct(null);
        }}
        initialProduct={activeProduct}
        availableProducts={products}
      />
    </div>
  );
}
