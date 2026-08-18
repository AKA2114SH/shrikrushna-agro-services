'use client';

import React, { useState, useEffect } from 'react';
import { useLanguage } from '@/context/LanguageContext';
import {
  FileText,
  Search,
  Plus,
  Trash2,
  Send,
  CheckCircle2,
  MessageCircle,
  Printer,
  X,
  Sparkles,
  Phone,
  Calendar,
  User,
  MapPin,
  Sprout,
  Download,
  Share2,
} from 'lucide-react';
import store, { Product, Quotation, INITIAL_PRODUCTS, INITIAL_QUOTATIONS } from '@/lib/store';

export default function QuotationPage() {
  const { t } = useLanguage();
  const [products, setProducts] = useState<Product[]>(() => store.getProducts());
  const [quotations, setQuotations] = useState<Quotation[]>(() => store.getQuotations());
  const [searchQuote, setSearchQuote] = useState('');
  const [farmerName, setFarmerName] = useState('');
  const [farmerPhone, setFarmerPhone] = useState('');
  const [farmerVillage, setFarmerVillage] = useState('');
  const [crop, setCrop] = useState('कांदा (Onion)');
  const [items, setItems] = useState<Array<{ productId: string; quantity: number }>>(() => [
    { productId: INITIAL_PRODUCTS[0]?.id || 'prod-1', quantity: 2 },
    { productId: INITIAL_PRODUCTS[8]?.id || 'prod-9', quantity: 1 },
  ]);
  const [loading, setLoading] = useState(false);
  const [createdQuote, setCreatedQuote] = useState<Quotation | null>(null);
  const [selectedQuoteForPrint, setSelectedQuoteForPrint] = useState<Quotation | null>(null);

  useEffect(() => {
    // Attempt live API refresh if backend server is running
    const apiUrl = `${process.env.NEXT_PUBLIC_API_URL || ''}/api/products`;
    fetch(apiUrl)
      .then((r) => r.json())
      .then((data) => {
        if (data.products && data.products.length > 0) {
          setProducts(data.products);
        }
      })
      .catch(() => {
        // Fallback to store
        setProducts(store.getProducts());
      });

    const quoteUrl = `${process.env.NEXT_PUBLIC_API_URL || ''}/api/quotations`;
    fetch(quoteUrl)
      .then((r) => r.json())
      .then((data) => {
        if (data.quotations && data.quotations.length > 0) {
          setQuotations(data.quotations);
        }
      })
      .catch(() => {
        setQuotations(store.getQuotations());
      });
  }, []);

  const addItem = () => {
    const nextProd =
      products[items.length % products.length] || products[0] || INITIAL_PRODUCTS[0];
    if (nextProd) {
      setItems((prev) => [...prev, { productId: nextProd.id, quantity: 1 }]);
    }
  };

  const removeItem = (idx: number) => {
    if (items.length > 1) {
      setItems(items.filter((_, i) => i !== idx));
    }
  };

  const updateItemProd = (idx: number, prodId: string) => {
    const next = [...items];
    next[idx].productId = prodId;
    setItems(next);
  };

  const updateItemQty = (idx: number, qty: number) => {
    const next = [...items];
    next[idx].quantity = Math.max(1, qty);
    setItems(next);
  };

  let estimatedSubtotal = 0;
  items.forEach((it) => {
    const p = products.find((prod) => prod.id === it.productId) || store.getProductById(it.productId);
    if (p) {
      estimatedSubtotal += p.sellingPrice * it.quantity;
    }
  });

  const handleCreateQuotation = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!farmerName.trim() || !farmerPhone.trim() || items.length === 0) {
      alert('कृपया शेतकऱ्याचे नाव व मोबाईल नंबर प्रविष्ट करा.');
      return;
    }

    setLoading(true);

    try {
      const payloadItems = items.map((it) => {
        const prod =
          products.find((p) => p.id === it.productId) || store.getProductById(it.productId);
        const unitPrice = prod?.sellingPrice || 100;
        const gstRate = prod?.gstRate || 5;
        const lineSubtotal = unitPrice * it.quantity;
        const taxAmount = (lineSubtotal * gstRate) / 100;
        return {
          productId: it.productId,
          productName: prod?.nameMr || prod?.nameEn || 'कृषी उत्पादन',
          packSize: prod?.packSize || '1 नग',
          quantity: it.quantity,
          unitPrice,
          gstRate,
          totalPrice: Math.round(lineSubtotal + taxAmount),
        };
      });

      // 1. Create in local store state immediately
      const newQuote = store.createQuotation({
        customerName: farmerName.trim(),
        customerPhone: farmerPhone.trim(),
        customerVillage: farmerVillage.trim() || 'सिन्नर',
        notes: `पीक: ${crop}`,
        items: payloadItems,
        createdByName: 'शेतकरी सेल्फ-कोटेशन (वेब पोर्टल)',
      });

      setCreatedQuote(newQuote);
      setQuotations(store.getQuotations());

      // 2. Background attempt to push to server API if backend exists
      try {
        const quoteUrl = `${process.env.NEXT_PUBLIC_API_URL || ''}/api/quotations`;
        await fetch(quoteUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            customerName: farmerName.trim(),
            customerPhone: farmerPhone.trim(),
            customerVillage: farmerVillage.trim() || 'सिन्नर',
            notes: `पीक: ${crop}`,
            items: payloadItems,
          }),
        });
      } catch {
        // Safe on static export
      }
    } catch (err: any) {
      alert('कोटेशन सबमिट करताना त्रुटी आली: ' + (err.message || 'Error'));
    } finally {
      setLoading(false);
    }
  };

  const getWhatsAppShareUrl = (quote: Quotation) => {
    const lines = quote.items
      .map((it, i) => `${i + 1}. ${it.productName} (${it.packSize}) x ${it.quantity} = ₹${it.totalPrice}`)
      .join('\n');
    const msg = `🌾 *श्री कृष्ण ॲग्रो सर्व्हिसेस, सिन्नर*\n📄 *संगणकीय कोटेशन क्र:* ${quote.quotationNumber}\n👤 *शेतकरी:* ${quote.customerName} (${quote.customerVillage || 'सिन्नर'})\n📱 *मोबाईल:* ${quote.customerPhone}\n🌱 *पीक:* ${quote.notes || 'शेती'}\n\n*मागणी केलेले साहित्य:*\n${lines}\n\n💰 *अंदाजे एकूण रक्कम:* ₹${quote.grandTotal.toLocaleString('en-IN')}\n\n📍 *पत्ता:* श्री कृष्ण ॲग्रो सर्व्हिसेस, सिन्नर, जि. नाशिक\n📞 शुभम गमाणे: 8605620843 | जगदीश बोडके: 8888474456`;
    return `https://wa.me/918605620843?text=${encodeURIComponent(msg)}`;
  };

  const filteredQuotes = quotations.filter((q) => {
    if (!searchQuote) return true;
    const s = searchQuote.toLowerCase();
    return (
      q.quotationNumber.toLowerCase().includes(s) ||
      q.customerName.toLowerCase().includes(s) ||
      q.customerPhone.includes(s)
    );
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10 space-y-8">
      {/* Header */}
      <div className="bg-gradient-to-br from-agro-950 via-agro-900 to-agro-800 text-white rounded-3xl p-6 sm:p-10 shadow-agro-lg relative overflow-hidden">
        <div className="max-w-3xl space-y-2 relative z-10">
          <div className="inline-flex items-center gap-1.5 bg-emerald-800/80 text-emerald-300 text-xs font-bold px-3 py-1 rounded-full border border-emerald-600/40">
            <Sparkles className="w-3.5 h-3.5" />
            <span>श्री कृष्ण ॲग्रो सर्व्हिसेस • सिन्नर, नाशिक</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight">
            संगणकीय कोटेशन / दरपत्रक (Request Quotation)
          </h1>
          <p className="text-xs sm:text-sm text-emerald-100/90 leading-relaxed">
            आपल्या शेतातील पिकासाठी आवश्यक खते, बियाणे व औषधांचे अधिकृत संगणकीय दरपत्रक मिळवा किंवा आधीचे कोटेशन शोधा.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Col: Quotation Builder Form */}
        <div className="lg:col-span-7 bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6">
          <div className="flex items-center gap-2 font-bold text-slate-900 text-base pb-3 border-b border-slate-100">
            <FileText className="w-5 h-5 text-agro-700" />
            <span>नवीन कोटेशन तयार करा (Generate Quotation)</span>
          </div>

          {createdQuote ? (
            <div className="bg-emerald-50 rounded-2xl p-6 border border-emerald-200 text-center space-y-5">
              <CheckCircle2 className="w-12 h-12 text-emerald-600 mx-auto animate-bounce" />
              <div>
                <h3 className="text-lg sm:text-xl font-extrabold text-slate-900">
                  कोटेशन यशस्वीरित्या तयार झाले!
                </h3>
                <p className="text-xs text-slate-600 mt-1">
                  कोटेशन क्र: <strong className="text-agro-800 font-mono text-sm">{createdQuote.quotationNumber}</strong> | शेतकरी: <strong>{createdQuote.customerName}</strong>
                </p>
                <div className="inline-block bg-emerald-100/80 border border-emerald-300 text-emerald-900 font-extrabold text-base px-4 py-1.5 rounded-full mt-2">
                  एकूण रक्कम: ₹{createdQuote.grandTotal.toLocaleString('en-IN')}
                </div>
              </div>

              <div className="flex flex-wrap justify-center gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setSelectedQuoteForPrint(createdQuote)}
                  className="bg-agro-700 hover:bg-agro-800 text-white font-bold text-xs sm:text-sm px-5 py-3 rounded-xl transition flex items-center gap-2 shadow-sm"
                >
                  <Printer className="w-4 h-4" />
                  <span>🖨️ कोटेशन बिल प्रिंट करा (Print Bill)</span>
                </button>

                <a
                  href={getWhatsAppShareUrl(createdQuote)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs sm:text-sm px-5 py-3 rounded-xl transition flex items-center gap-2 shadow-sm"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>💬 WhatsApp वर पाठवा</span>
                </a>

                <button
                  type="button"
                  onClick={() => {
                    setCreatedQuote(null);
                    setFarmerName('');
                    setFarmerPhone('');
                    setFarmerVillage('');
                  }}
                  className="bg-white border border-slate-300 text-slate-700 font-bold text-xs sm:text-sm px-4 py-3 rounded-xl hover:bg-slate-50 transition"
                >
                  दुसरे कोटेशन बनवा
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleCreateQuotation} className="space-y-5 text-xs sm:text-sm">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    शेतकऱ्याचे नाव (Farmer Name) *
                  </label>
                  <input
                    type="text"
                    required
                    value={farmerName}
                    onChange={(e) => setFarmerName(e.target.value)}
                    placeholder="उदा. ज्ञानेश्वर आव्हाड"
                    className="w-full border border-slate-300 rounded-xl p-3 text-xs sm:text-sm focus:ring-2 focus:ring-agro-600 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    मोबाईल नंबर (WhatsApp No) *
                  </label>
                  <input
                    type="tel"
                    required
                    value={farmerPhone}
                    onChange={(e) => setFarmerPhone(e.target.value)}
                    placeholder="उदा. 9421558833"
                    className="w-full border border-slate-300 rounded-xl p-3 text-xs sm:text-sm focus:ring-2 focus:ring-agro-600 focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    गाव / पत्ता (Village / Address)
                  </label>
                  <input
                    type="text"
                    value={farmerVillage}
                    onChange={(e) => setFarmerVillage(e.target.value)}
                    placeholder="उदा. डुबेरे, पाटोळे, सिन्नर"
                    className="w-full border border-slate-300 rounded-xl p-3 text-xs sm:text-sm focus:ring-2 focus:ring-agro-600 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    मुख्य पीक (Target Crop)
                  </label>
                  <select
                    value={crop}
                    onChange={(e) => setCrop(e.target.value)}
                    className="w-full border border-slate-300 rounded-xl p-3 text-xs sm:text-sm bg-white focus:ring-2 focus:ring-agro-600 focus:outline-none font-medium"
                  >
                    <option value="कांदा (Onion)">कांदा (Onion)</option>
                    <option value="द्राक्ष (Grapes)">द्राक्ष (Grapes)</option>
                    <option value="डाळिंब (Pomegranate)">डाळिंब (Pomegranate)</option>
                    <option value="टोमॅटो (Tomato)">टोमॅटो (Tomato)</option>
                    <option value="मका (Maize)">मका (Maize)</option>
                    <option value="सोयाबीन (Soybean)">सोयाबीन (Soybean)</option>
                    <option value="भाजीपाला (Vegetables)">भाजीपाला (Vegetables)</option>
                  </select>
                </div>
              </div>

              {/* Items Selection Card */}
              <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 sm:p-5 space-y-3">
                <div className="flex justify-between items-center pb-2 border-b border-slate-200">
                  <span className="font-extrabold text-slate-900 text-xs sm:text-sm flex items-center gap-1.5">
                    <Sprout className="w-4 h-4 text-agro-700" />
                    <span>उत्पादने व प्रमाण (Items & Quantity)</span>
                  </span>
                  <button
                    type="button"
                    onClick={addItem}
                    className="bg-agro-700 hover:bg-agro-800 text-white font-bold text-xs px-3 py-1.5 rounded-lg flex items-center gap-1 shadow-sm transition"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>+ आयटम जोडा</span>
                  </button>
                </div>

                <div className="space-y-2.5">
                  {items.map((it, idx) => {
                    const sel =
                      products.find((p) => p.id === it.productId) || store.getProductById(it.productId);
                    return (
                      <div
                        key={idx}
                        className="bg-white p-3 rounded-xl border border-slate-200 flex flex-col sm:flex-row items-stretch sm:items-center gap-2 shadow-xs"
                      >
                        <select
                          value={it.productId}
                          onChange={(e) => updateItemProd(idx, e.target.value)}
                          className="flex-1 border border-slate-200 rounded-lg p-2.5 text-xs bg-white font-medium text-slate-900"
                        >
                          {products.map((p) => (
                            <option key={p.id} value={p.id}>
                              {p.nameMr} ({p.packSize}) — ₹{p.sellingPrice}
                            </option>
                          ))}
                        </select>
                        <div className="flex items-center gap-2 justify-between sm:justify-end">
                          <div className="flex items-center gap-1">
                            <span className="text-[11px] text-slate-500 font-bold">प्रमाण:</span>
                            <input
                              type="number"
                              min="1"
                              value={it.quantity}
                              onChange={(e) => updateItemQty(idx, Number(e.target.value))}
                              className="w-16 border border-slate-200 rounded-lg p-2 text-xs text-center font-extrabold text-agro-900"
                            />
                          </div>
                          <span className="text-xs font-extrabold text-slate-800 whitespace-nowrap min-w-[75px] text-right">
                            ₹{((sel?.sellingPrice || 0) * it.quantity).toLocaleString('en-IN')}
                          </span>
                          {items.length > 1 && (
                            <button
                              type="button"
                              onClick={() => removeItem(idx)}
                              className="text-red-500 hover:text-red-700 p-1.5 rounded-lg hover:bg-red-50 transition"
                              title="हटवा"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>

                <div className="pt-3 flex justify-between items-center text-xs sm:text-sm font-extrabold text-slate-900 border-t border-slate-200">
                  <span>अंदाजे एकूण रक्कम:</span>
                  <span className="text-base sm:text-lg text-agro-700 font-mono">
                    ₹{estimatedSubtotal.toLocaleString('en-IN')}
                  </span>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-agro-700 to-agro-800 hover:from-agro-800 hover:to-agro-900 text-white font-extrabold py-3.5 rounded-xl transition flex items-center justify-center gap-2 shadow-agro text-sm cursor-pointer"
              >
                <Send className="w-4 h-4" />
                <span>{loading ? 'तयार करत आहे...' : 'कोटेशन तयार करा (Submit Request)'}</span>
              </button>
            </form>
          )}
        </div>

        {/* Right Col: Track Existing Quotations */}
        <div className="lg:col-span-5 bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-5">
          <div className="flex items-center gap-2 font-bold text-slate-900 text-base pb-3 border-b border-slate-100">
            <Search className="w-5 h-5 text-agro-700" />
            <span>कोटेशन ट्रॅकर व प्रिंट (Track & Print Quotation)</span>
          </div>

          <div className="relative">
            <Search className="w-4 h-4 absolute left-3.5 top-3.5 text-slate-400" />
            <input
              type="text"
              value={searchQuote}
              onChange={(e) => setSearchQuote(e.target.value)}
              placeholder="कोटेशन क्र. किंवा मोबाईल नंबर शोधा..."
              className="w-full pl-10 pr-3.5 py-3 border border-slate-300 rounded-xl text-xs sm:text-sm focus:ring-2 focus:ring-agro-600 focus:outline-none font-medium"
            />
          </div>

          <div className="space-y-3 max-h-[500px] overflow-y-auto pr-1">
            {filteredQuotes.length === 0 ? (
              <div className="text-center py-10 bg-slate-50 rounded-2xl border border-slate-100">
                <FileText className="w-10 h-10 text-slate-300 mx-auto mb-2" />
                <p className="text-xs text-slate-500 font-medium">कोणतेही कोटेशन आढळले नाही.</p>
              </div>
            ) : (
              filteredQuotes.map((q) => (
                <div
                  key={q.id}
                  className="bg-slate-50 hover:bg-slate-100/90 p-4 rounded-2xl border border-slate-200 text-xs space-y-2.5 transition"
                >
                  <div className="flex justify-between items-center">
                    <span className="font-extrabold text-agro-900 font-mono text-sm">
                      {q.quotationNumber}
                    </span>
                    <span
                      className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full ${
                        q.status === 'ACCEPTED'
                          ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                          : 'bg-amber-100 text-amber-800 border border-amber-300'
                      }`}
                    >
                      {q.status}
                    </span>
                  </div>
                  <div className="flex justify-between text-slate-700">
                    <span className="font-bold">
                      {q.customerName} ({q.customerVillage || 'सिन्नर'})
                    </span>
                    <span className="font-extrabold text-agro-800 font-mono text-sm">
                      ₹{q.grandTotal.toLocaleString('en-IN')}
                    </span>
                  </div>
                  <div className="text-[11px] text-slate-500 flex items-center justify-between">
                    <span>{q.customerPhone}</span>
                    <span>{new Date(q.createdAt).toLocaleDateString('en-IN')}</span>
                  </div>
                  <div className="pt-2 flex justify-between items-center border-t border-slate-200/80 gap-2">
                    <button
                      type="button"
                      onClick={() => setSelectedQuoteForPrint(q)}
                      className="bg-agro-700 hover:bg-agro-800 text-white font-bold px-3 py-1.5 rounded-lg flex items-center gap-1.5 text-[11px] transition shadow-xs"
                    >
                      <Printer className="w-3.5 h-3.5" />
                      <span>🖨️ बिल प्रिंट करा</span>
                    </button>
                    <a
                      href={getWhatsAppShareUrl(q)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-emerald-700 hover:text-emerald-800 font-bold flex items-center gap-1 text-[11px]"
                    >
                      <MessageCircle className="w-3.5 h-3.5" />
                      <span>WhatsApp</span>
                    </a>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* ============================================================= */}
      {/* AUTHENTIC PRINTABLE BILL / QUOTATION INVOICE MODAL */}
      {/* ============================================================= */}
      {selectedQuoteForPrint && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-3xl w-full max-h-[92vh] overflow-y-auto shadow-2xl border border-slate-200">
            {/* Modal Controls */}
            <div className="p-4 bg-slate-900 text-white flex justify-between items-center rounded-t-3xl sticky top-0 z-10 print:hidden">
              <div className="flex items-center gap-2">
                <FileText className="w-5 h-5 text-emerald-400" />
                <span className="font-bold text-sm">
                  कोटेशन पावती / बिल — {selectedQuoteForPrint.quotationNumber}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => window.print()}
                  className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold px-3.5 py-1.5 rounded-xl flex items-center gap-1.5 transition"
                >
                  <Printer className="w-4 h-4" />
                  <span>प्रिंट करा (Print)</span>
                </button>
                <button
                  onClick={() => setSelectedQuoteForPrint(null)}
                  className="text-slate-400 hover:text-white p-1 rounded-lg"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Printable Invoice Document */}
            <div className="p-6 sm:p-10 space-y-6 text-slate-900 bg-white" id="printable-quotation-bill">
              {/* Shop Header */}
              <div className="text-center border-b-2 border-agro-900 pb-5 space-y-1">
                <div className="text-[11px] font-bold tracking-widest text-agro-800 uppercase">
                  ॥ श्री गणेशाय नमः ॥
                </div>
                <h2 className="text-2xl sm:text-3xl font-extrabold text-agro-950">
                  श्री कृष्ण ॲग्रो सर्व्हिसेस
                </h2>
                <div className="text-xs sm:text-sm font-bold text-slate-700">
                  SHRI KRISHNA AGRO SERVICES, SINNAR
                </div>
                <p className="text-xs text-slate-600">
                  मु. पो. सिन्नर, जि. नाशिक, महाराष्ट्र • पिन: ४२२१०३
                </p>
                <div className="text-xs font-bold text-agro-900 flex flex-wrap justify-center gap-4 pt-1">
                  <span>📞 शुभम गमाणे: ८६०५६२०८४३</span>
                  <span>📞 जगदीश बोडके: ८८८८४७४४५६</span>
                </div>
              </div>

              {/* Quotation & Customer Details Grid */}
              <div className="grid grid-cols-2 gap-4 bg-slate-50 p-4 rounded-2xl border border-slate-200 text-xs">
                <div className="space-y-1">
                  <div>
                    <span className="text-slate-500 font-medium">शेतकऱ्याचे नाव:</span>{' '}
                    <strong className="text-slate-900 text-sm">{selectedQuoteForPrint.customerName}</strong>
                  </div>
                  <div>
                    <span className="text-slate-500 font-medium">मोबाईल:</span>{' '}
                    <strong>{selectedQuoteForPrint.customerPhone}</strong>
                  </div>
                  <div>
                    <span className="text-slate-500 font-medium">गाव / पत्ता:</span>{' '}
                    <strong>{selectedQuoteForPrint.customerVillage || 'सिन्नर'}</strong>
                  </div>
                </div>
                <div className="space-y-1 text-right">
                  <div>
                    <span className="text-slate-500 font-medium">कोटेशन क्र:</span>{' '}
                    <strong className="font-mono text-agro-900 text-sm">{selectedQuoteForPrint.quotationNumber}</strong>
                  </div>
                  <div>
                    <span className="text-slate-500 font-medium">दिनांक:</span>{' '}
                    <strong>{new Date(selectedQuoteForPrint.createdAt).toLocaleDateString('en-IN')}</strong>
                  </div>
                  <div>
                    <span className="text-slate-500 font-medium">वैधता:</span>{' '}
                    <strong>{selectedQuoteForPrint.validUntil} पर्यंत</strong>
                  </div>
                </div>
              </div>

              {/* Items Table */}
              <div className="overflow-x-auto">
                <table className="w-full text-xs text-left border-collapse">
                  <thead>
                    <tr className="bg-agro-900 text-white font-bold">
                      <th className="p-2.5 rounded-l-lg">अ.क्र.</th>
                      <th className="p-2.5">उत्पादन व तपशील</th>
                      <th className="p-2.5">पॅक साईझ</th>
                      <th className="p-2.5 text-center">प्रमाण</th>
                      <th className="p-2.5 text-right">दर (₹)</th>
                      <th className="p-2.5 text-right">जीएसटी</th>
                      <th className="p-2.5 text-right rounded-r-lg">एकूण रक्कम (₹)</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200">
                    {selectedQuoteForPrint.items.map((it, i) => (
                      <tr key={it.id || i} className="hover:bg-slate-50">
                        <td className="p-2.5 text-slate-500">{i + 1}</td>
                        <td className="p-2.5 font-bold text-slate-900">{it.productName}</td>
                        <td className="p-2.5 text-slate-600">{it.packSize}</td>
                        <td className="p-2.5 text-center font-bold">{it.quantity}</td>
                        <td className="p-2.5 text-right font-mono">₹{it.unitPrice}</td>
                        <td className="p-2.5 text-right text-slate-500">{it.gstRate}%</td>
                        <td className="p-2.5 text-right font-bold font-mono text-slate-900">
                          ₹{it.totalPrice.toLocaleString('en-IN')}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Total Calculation Summary */}
              <div className="flex justify-end pt-2">
                <div className="w-64 bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-1.5 text-xs">
                  <div className="flex justify-between text-slate-600">
                    <span>उपएकूण (Subtotal):</span>
                    <span className="font-mono">₹{selectedQuoteForPrint.subtotal.toLocaleString('en-IN')}</span>
                  </div>
                  <div className="flex justify-between text-slate-600">
                    <span>जीएसटी कर (GST):</span>
                    <span className="font-mono">₹{selectedQuoteForPrint.totalTax.toLocaleString('en-IN')}</span>
                  </div>
                  {selectedQuoteForPrint.discountAmount > 0 && (
                    <div className="flex justify-between text-emerald-700 font-bold">
                      <span>सवलत (Discount):</span>
                      <span className="font-mono">-₹{selectedQuoteForPrint.discountAmount}</span>
                    </div>
                  )}
                  <div className="flex justify-between text-sm font-extrabold text-agro-950 pt-2 border-t border-slate-300">
                    <span>एकूण रक्कम (Total):</span>
                    <span className="font-mono text-agro-800 text-base">
                      ₹{selectedQuoteForPrint.grandTotal.toLocaleString('en-IN')}
                    </span>
                  </div>
                </div>
              </div>

              {/* Terms & Footer Signatures */}
              <div className="pt-6 border-t border-slate-200 grid grid-cols-2 gap-6 items-end text-xs text-slate-600">
                <div className="space-y-1">
                  <div className="font-bold text-slate-800">नियम व अटी:</div>
                  <p className="text-[11px] leading-relaxed">
                    १. हे संगणकीय दरपत्रक १५ दिवसांसाठी वैध राहील.<br />
                    २. जीएसटी नियमानुसार पक्के बिल दिले जाईल.
                  </p>
                </div>
                <div className="text-right space-y-8">
                  <div className="font-bold text-agro-900">
                    श्री कृष्ण ॲग्रो सर्व्हिसेस, सिन्नर करिता
                  </div>
                  <div className="text-[11px] text-slate-500 font-medium">
                    अधिकृत स्वाक्षरी (शुभम गमाणे / जगदीश बोडके - B.Sc Agri)
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
