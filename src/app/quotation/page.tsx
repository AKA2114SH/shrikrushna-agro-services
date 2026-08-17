'use client';

import React, { useState, useEffect } from 'react';
import { useLanguage } from '@/context/LanguageContext';
import { FileText, Search, Plus, Trash2, Send, CheckCircle2, MessageCircle, Printer, ArrowRight } from 'lucide-react';
import { Product, Quotation } from '@/lib/store';

export default function QuotationPage() {
  const { t } = useLanguage();
  const [products, setProducts] = useState<Product[]>([]);
  const [quotations, setQuotations] = useState<Quotation[]>([]);
  const [searchQuote, setSearchQuote] = useState('');
  const [farmerName, setFarmerName] = useState('');
  const [farmerPhone, setFarmerPhone] = useState('');
  const [farmerVillage, setFarmerVillage] = useState('');
  const [crop, setCrop] = useState('कांदा (Onion)');
  const [items, setItems] = useState<Array<{ productId: string; quantity: number }>>([]);
  const [loading, setLoading] = useState(false);
  const [createdQuote, setCreatedQuote] = useState<Quotation | null>(null);

  useEffect(() => {
    fetch('/api/products')
      .then((r) => r.json())
      .then((data) => {
        if (data.products) {
          setProducts(data.products);
          if (data.products.length > 0) {
            setItems([{ productId: data.products[0].id, quantity: 5 }]);
          }
        }
      });

    fetch('/api/quotations')
      .then((r) => r.json())
      .then((data) => {
        if (data.quotations) setQuotations(data.quotations);
      });
  }, []);

  const addItem = () => {
    if (products.length > 0) {
      setItems([...items, { productId: products[0].id, quantity: 1 }]);
    }
  };

  const removeItem = (idx: number) => {
    setItems(items.filter((_, i) => i !== idx));
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
    const p = products.find((prod) => prod.id === it.productId);
    if (p) {
      estimatedSubtotal += p.sellingPrice * it.quantity;
    }
  });

  const handleCreateQuotation = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!farmerName || !farmerPhone || items.length === 0) return;

    setLoading(true);
    try {
      const payloadItems = items.map((it) => {
        const prod = products.find((p) => p.id === it.productId);
        return {
          productId: it.productId,
          productName: prod?.nameMr || 'उत्पादन',
          packSize: prod?.packSize || '1',
          quantity: it.quantity,
          unitPrice: prod?.sellingPrice || 100,
          gstRate: prod?.gstRate || 5,
        };
      });

      const res = await fetch('/api/quotations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customerName: farmerName,
          customerPhone: farmerPhone,
          customerVillage: farmerVillage,
          notes: `पीक: ${crop}`,
          items: payloadItems,
        }),
      });

      const data = await res.json();
      if (data.success) {
        setCreatedQuote(data.quotation);
        setQuotations([data.quotation, ...quotations]);
      }
    } catch {
      alert('कोटेशन सबमिट करताना त्रुटी आली.');
    } finally {
      setLoading(false);
    }
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
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      {/* Header */}
      <div className="bg-gradient-to-r from-agro-900 to-agro-800 text-white rounded-3xl p-6 sm:p-10 shadow-agro-lg">
        <div className="max-w-3xl space-y-2">
          <span className="text-emerald-300 font-bold text-xs uppercase tracking-wider">
            {t.brandName}, सिन्नर
          </span>
          <h1 className="text-2xl sm:text-4xl font-extrabold">{t.navQuotation}</h1>
          <p className="text-xs sm:text-sm text-emerald-100/90 leading-relaxed">
            आपल्या शेतातील पिकासाठी आवश्यक खते व औषधांचे संगणकीय दरपत्रक मिळवा किंवा आधीचे कोटेशन शोधा.
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
            <div className="bg-emerald-50 rounded-2xl p-6 border border-emerald-200 text-center space-y-4">
              <CheckCircle2 className="w-12 h-12 text-emerald-600 mx-auto" />
              <h3 className="text-lg font-bold text-slate-900">
                कोटेशन तयार झाले: {createdQuote.quotationNumber}
              </h3>
              <p className="text-xs text-slate-600">
                एकूण रक्कम: <strong>₹{createdQuote.grandTotal.toLocaleString('en-IN')}</strong> | ग्राहक: {createdQuote.customerName}
              </p>
              <div className="flex flex-wrap justify-center gap-3 pt-2">
                <a
                  href={`/api/quotations/${createdQuote.id}?format=html`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-agro-700 hover:bg-agro-800 text-white font-bold text-xs px-4 py-2.5 rounded-xl transition flex items-center gap-1.5"
                >
                  <Printer className="w-4 h-4" />
                  <span>कोटेशन स्लिप उघडा / प्रिंट करा</span>
                </a>
                <button
                  onClick={() => setCreatedQuote(null)}
                  className="bg-white border border-slate-300 text-slate-700 font-bold text-xs px-4 py-2.5 rounded-xl hover:bg-slate-50"
                >
                  दुसरे कोटेशन बनवा
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleCreateQuotation} className="space-y-4 text-xs sm:text-sm">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    शेतकऱ्याचे नाव *
                  </label>
                  <input
                    type="text"
                    required
                    value={farmerName}
                    onChange={(e) => setFarmerName(e.target.value)}
                    placeholder="उदा. ज्ञानेश्वर आव्हाड"
                    className="w-full border border-slate-300 rounded-xl p-2.5 text-xs focus:ring-1 focus:ring-agro-600"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    मोबाईल नंबर (WhatsApp) *
                  </label>
                  <input
                    type="tel"
                    required
                    value={farmerPhone}
                    onChange={(e) => setFarmerPhone(e.target.value)}
                    placeholder="उदा. 9421558833"
                    className="w-full border border-slate-300 rounded-xl p-2.5 text-xs focus:ring-1 focus:ring-agro-600"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    गाव / पत्ता
                  </label>
                  <input
                    type="text"
                    value={farmerVillage}
                    onChange={(e) => setFarmerVillage(e.target.value)}
                    placeholder="उदा. डुबेरे / सिन्नर"
                    className="w-full border border-slate-300 rounded-xl p-2.5 text-xs focus:ring-1 focus:ring-agro-600"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    मुख्य पीक
                  </label>
                  <select
                    value={crop}
                    onChange={(e) => setCrop(e.target.value)}
                    className="w-full border border-slate-300 rounded-xl p-2.5 text-xs bg-white focus:ring-1 focus:ring-agro-600"
                  >
                    <option value="कांदा (Onion)">कांदा (Onion)</option>
                    <option value="द्राक्ष (Grapes)">द्राक्ष (Grapes)</option>
                    <option value="डाळिंब (Pomegranate)">डाळिंब (Pomegranate)</option>
                    <option value="टोमॅटो (Tomato)">टोमॅटो (Tomato)</option>
                    <option value="भाजीपाला (Vegetables)">भाजीपाला (Vegetables)</option>
                  </select>
                </div>
              </div>

              {/* Items Table */}
              <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 space-y-3">
                <div className="flex justify-between items-center">
                  <span className="font-bold text-slate-800">
                    उत्पादने व प्रमाण (Items & Quantity)
                  </span>
                  <button
                    type="button"
                    onClick={addItem}
                    className="text-agro-700 hover:text-agro-900 font-bold text-xs flex items-center gap-1"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>आयटम जोडा</span>
                  </button>
                </div>

                {items.map((it, idx) => {
                  const sel = products.find((p) => p.id === it.productId);
                  return (
                    <div
                      key={idx}
                      className="bg-white p-3 rounded-xl border border-slate-200 flex items-center gap-2"
                    >
                      <select
                        value={it.productId}
                        onChange={(e) => updateItemProd(idx, e.target.value)}
                        className="flex-1 border border-slate-200 rounded-lg p-2 text-xs bg-white"
                      >
                        {products.map((p) => (
                          <option key={p.id} value={p.id}>
                            {p.nameMr} ({p.packSize}) — ₹{p.sellingPrice}
                          </option>
                        ))}
                      </select>
                      <input
                        type="number"
                        min="1"
                        value={it.quantity}
                        onChange={(e) => updateItemQty(idx, Number(e.target.value))}
                        className="w-16 border border-slate-200 rounded-lg p-2 text-xs text-center font-bold"
                      />
                      <span className="text-xs font-bold text-slate-700 whitespace-nowrap min-w-[70px] text-right">
                        ₹{((sel?.sellingPrice || 0) * it.quantity).toLocaleString('en-IN')}
                      </span>
                      {items.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeItem(idx)}
                          className="text-red-500 hover:text-red-700 p-1"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  );
                })}

                <div className="pt-2 flex justify-between items-center text-xs font-bold text-agro-950 border-t border-slate-200">
                  <span>अंदाजे एकूण रक्कम:</span>
                  <span className="text-base text-agro-700">₹{estimatedSubtotal.toLocaleString('en-IN')}</span>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-agro-700 to-agro-800 hover:from-agro-800 hover:to-agro-900 text-white font-bold py-3.5 rounded-xl transition flex items-center justify-center gap-2 shadow-agro"
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
            <span>कोटेशन ट्रॅकर (Track Quotation)</span>
          </div>

          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
            <input
              type="text"
              value={searchQuote}
              onChange={(e) => setSearchQuote(e.target.value)}
              placeholder="कोटेशन क्र. किंवा मोबाईल नंबर..."
              className="w-full pl-9 pr-3 py-2.5 border border-slate-300 rounded-xl text-xs focus:ring-1 focus:ring-agro-600"
            />
          </div>

          <div className="space-y-3 max-h-96 overflow-y-auto pr-1">
            {filteredQuotes.length === 0 ? (
              <p className="text-xs text-slate-500 text-center py-6">
                कोणतेही कोटेशन आढळले नाही.
              </p>
            ) : (
              filteredQuotes.map((q) => (
                <div
                  key={q.id}
                  className="bg-slate-50 hover:bg-slate-100/80 p-3.5 rounded-xl border border-slate-200/80 text-xs space-y-1.5 transition"
                >
                  <div className="flex justify-between items-center">
                    <span className="font-bold text-agro-900">{q.quotationNumber}</span>
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        q.status === 'ACCEPTED'
                          ? 'bg-emerald-100 text-emerald-800'
                          : 'bg-amber-100 text-amber-800'
                      }`}
                    >
                      {q.status}
                    </span>
                  </div>
                  <div className="flex justify-between text-slate-600">
                    <span>{q.customerName} ({q.customerVillage || 'सिन्नर'})</span>
                    <span className="font-extrabold text-agro-800">₹{q.grandTotal.toLocaleString('en-IN')}</span>
                  </div>
                  <div className="pt-2 flex justify-between items-center border-t border-slate-200/60">
                    <span className="text-[10px] text-slate-400">
                      {new Date(q.createdAt).toLocaleDateString('en-IN')}
                    </span>
                    <a
                      href={`/api/quotations/${q.id}?format=html`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-agro-700 hover:text-agro-900 font-bold flex items-center gap-1 text-[11px]"
                    >
                      <span>पावती पहा</span>
                      <ArrowRight className="w-3 h-3" />
                    </a>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
