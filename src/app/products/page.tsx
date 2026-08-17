'use client';

import React, { useState, useEffect } from 'react';
import { useLanguage } from '@/context/LanguageContext';
import { Search, Filter, Sprout, FileText, CheckCircle2, AlertCircle } from 'lucide-react';
import { Product, Category, Brand } from '@/lib/store';
import QuotationModal from '@/components/QuotationModal';

export default function ProductsPage() {
  const { t } = useLanguage();
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [brands, setBrands] = useState<Brand[]>([]);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedBrand, setSelectedBrand] = useState('all');
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [activeProduct, setActiveProduct] = useState<Product | null>(null);

  useEffect(() => {
    fetch('/api/products')
      .then((r) => r.json())
      .then((data) => {
        if (data.products) setProducts(data.products);
        if (data.categories) setCategories(data.categories);
        if (data.brands) setBrands(data.brands);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const filtered = products.filter((p) => {
    const matchCat = selectedCategory === 'all' || p.categoryId === selectedCategory;
    const matchBrand = selectedBrand === 'all' || p.brandId === selectedBrand;
    const matchSearch =
      !search ||
      p.nameMr.toLowerCase().includes(search.toLowerCase()) ||
      p.nameEn.toLowerCase().includes(search.toLowerCase()) ||
      p.brandName.toLowerCase().includes(search.toLowerCase()) ||
      (p.technicalName && p.technicalName.toLowerCase().includes(search.toLowerCase()));
    return matchCat && matchBrand && matchSearch;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Header */}
      <div className="bg-gradient-to-r from-agro-900 to-agro-800 text-white rounded-3xl p-6 sm:p-10 shadow-agro-lg">
        <div className="max-w-2xl space-y-2">
          <span className="text-emerald-300 font-bold text-xs uppercase tracking-wider">
            {t.brandName}, सिन्नर
          </span>
          <h1 className="text-2xl sm:text-4xl font-extrabold">{t.catalogueTitle}</h1>
          <p className="text-xs sm:text-sm text-emerald-100/90 leading-relaxed">
            बियाणे, रासायनिक खते, विद्राव्य खते, कीटकनाशके, बुरशीनाशके आणि सूक्ष्म अन्नद्रव्यांची प्रमाणित सूची.
          </p>
        </div>
      </div>

      {/* Main Grid: Sidebar Filters + Products */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 items-start">
        {/* Sidebar Filters */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm space-y-6">
          <div className="flex items-center gap-2 font-bold text-slate-900 text-sm pb-3 border-b border-slate-100">
            <Filter className="w-4 h-4 text-agro-700" />
            <span>फिल्टर्स (Filters)</span>
          </div>

          {/* Search */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">शोध (Search)</label>
            <div className="relative">
              <Search className="w-3.5 h-3.5 absolute left-3 top-3 text-slate-400" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="नाव किंवा घटक..."
                className="w-full pl-9 pr-3 py-2 border border-slate-300 rounded-lg text-xs focus:ring-1 focus:ring-agro-600"
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
              <option value="all">सर्व कंपन्या ({brands.length})</option>
              {brands.map((b) => (
                <option key={b.id} value={b.id}>
                  {b.name}
                </option>
              ))}
            </select>
          </div>

          <div className="pt-2">
            <button
              onClick={() => {
                setSelectedCategory('all');
                setSelectedBrand('all');
                setSearch('');
              }}
              className="w-full text-center text-xs text-slate-500 hover:text-slate-800 font-semibold underline"
            >
              फिल्टर पूर्ववत करा (Reset)
            </button>
          </div>
        </div>

        {/* Product Cards */}
        <div className="lg:col-span-3 space-y-4">
          <div className="flex justify-between items-center text-xs font-bold text-slate-600">
            <span>उपलब्ध उत्पादने: {filtered.length}</span>
          </div>

          {loading ? (
            <div className="text-center py-12 text-slate-500 text-sm">लोड होत आहे...</div>
          ) : filtered.length === 0 ? (
            <div className="bg-white rounded-2xl p-10 border border-slate-200 text-center space-y-2">
              <Sprout className="w-12 h-12 text-slate-300 mx-auto" />
              <p className="font-bold text-slate-700">या निकषानुसार उत्पादने आढळली नाहीत</p>
              <p className="text-xs text-slate-500">कृपया फिल्टर बदलून पहा.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {filtered.map((p) => (
                <div
                  key={p.id}
                  className="bg-white rounded-2xl border border-slate-200/80 p-4 flex flex-col justify-between shadow-sm hover-lift transition"
                >
                  <div className="space-y-2.5">
                    <div className="flex justify-between items-center text-[10px]">
                      <span className="bg-slate-100 text-slate-700 px-2 py-0.5 rounded font-bold">
                        {p.brandName}
                      </span>
                      <span
                        className={`font-bold px-2 py-0.5 rounded ${
                          p.totalStock > 0
                            ? 'bg-emerald-50 text-emerald-700'
                            : 'bg-amber-50 text-amber-700'
                        }`}
                      >
                        {p.totalStock > 0 ? t.inStock : t.outOfStock}
                      </span>
                    </div>

                    <div>
                      <h3 className="font-bold text-slate-900 text-sm">{p.nameMr}</h3>
                      <p className="text-xs text-slate-500 line-clamp-1">{p.nameEn}</p>
                      {p.technicalName && (
                        <p className="text-[11px] text-emerald-700 font-medium mt-1 bg-emerald-50 px-1.5 py-0.5 rounded line-clamp-1">
                          घटक: {p.technicalName}
                        </p>
                      )}
                    </div>

                    <div className="text-xs text-slate-600 space-y-1">
                      <p><strong>पॅकिंग:</strong> {p.packSize}</p>
                      {p.targetCrops && (
                        <p className="text-[11px] text-slate-500 line-clamp-1">
                          <strong>पिके:</strong> {p.targetCrops}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="pt-4 mt-3 border-t border-slate-100 flex items-center justify-between">
                    <div>
                      <span className="text-[10px] text-slate-400 line-through">
                        MRP ₹{p.mrp}
                      </span>
                      <p className="text-base font-extrabold text-agro-900">
                        ₹{p.sellingPrice}
                      </p>
                    </div>
                    <button
                      onClick={() => {
                        setActiveProduct(p);
                        setModalOpen(true);
                      }}
                      className="bg-agro-700 hover:bg-agro-800 text-white text-xs font-bold px-3 py-2 rounded-lg transition flex items-center gap-1"
                    >
                      <FileText className="w-3.5 h-3.5" />
                      <span>कोटेशन</span>
                    </button>
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
