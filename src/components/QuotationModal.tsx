'use client';

import React, { useState } from 'react';
import { X, Send, Plus, Trash2, CheckCircle2, MessageCircle, FileText, Printer } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';
import store, { Product, Quotation, INITIAL_PRODUCTS } from '@/lib/store';

interface QuotationModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialProduct?: Product | null;
  availableProducts?: Product[];
}

export default function QuotationModal({
  isOpen,
  onClose,
  initialProduct,
  availableProducts = [],
}: QuotationModalProps) {
  const { t } = useLanguage();
  const allProds = availableProducts.length > 0 ? availableProducts : store.getProducts();

  const [farmerName, setFarmerName] = useState('');
  const [farmerPhone, setFarmerPhone] = useState('');
  const [farmerVillage, setFarmerVillage] = useState('');
  const [crop, setCrop] = useState('कांदा (Onion)');
  const [items, setItems] = useState<Array<{ productId: string; quantity: number }>>(() => {
    if (initialProduct) return [{ productId: initialProduct.id, quantity: 1 }];
    return [{ productId: allProds[0]?.id || 'prod-1', quantity: 2 }];
  });
  const [submitted, setSubmitted] = useState<Quotation | null>(null);
  const [loading, setLoading] = useState(false);

  React.useEffect(() => {
    if (initialProduct) {
      setItems([{ productId: initialProduct.id, quantity: 1 }]);
    }
  }, [initialProduct]);

  if (!isOpen) return null;

  const addItem = () => {
    const nextProd = allProds[items.length % allProds.length] || allProds[0];
    if (nextProd) {
      setItems([...items, { productId: nextProd.id, quantity: 1 }]);
    }
  };

  const removeItem = (index: number) => {
    if (items.length > 1) {
      setItems(items.filter((_, i) => i !== index));
    }
  };

  const updateItemProduct = (index: number, prodId: string) => {
    const next = [...items];
    next[index].productId = prodId;
    setItems(next);
  };

  const updateItemQty = (index: number, qty: number) => {
    const next = [...items];
    next[index].quantity = Math.max(1, qty);
    setItems(next);
  };

  // Estimate total
  let estimatedTotal = 0;
  items.forEach((it) => {
    const p = allProds.find((prod) => prod.id === it.productId) || store.getProductById(it.productId);
    if (p) {
      estimatedTotal += p.sellingPrice * it.quantity;
    }
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!farmerName.trim() || !farmerPhone.trim() || items.length === 0) {
      alert('कृपया नाव व मोबाईल नंबर प्रविष्ट करा.');
      return;
    }

    setLoading(true);
    try {
      const payloadItems = items.map((it) => {
        const prod = allProds.find((p) => p.id === it.productId) || store.getProductById(it.productId);
        const unitPrice = prod?.sellingPrice || 100;
        const gstRate = prod?.gstRate || 5;
        const lineSubtotal = unitPrice * it.quantity;
        const taxAmount = (lineSubtotal * gstRate) / 100;
        return {
          productId: it.productId,
          productName: prod?.nameMr || prod?.nameEn || 'उत्पादन',
          packSize: prod?.packSize || '1 नग',
          quantity: it.quantity,
          unitPrice,
          gstRate,
          totalPrice: Math.round(lineSubtotal + taxAmount),
        };
      });

      // 1. Save in store
      const newQuote = store.createQuotation({
        customerName: farmerName.trim(),
        customerPhone: farmerPhone.trim(),
        customerVillage: farmerVillage.trim() || 'सिन्नर',
        notes: `पीक: ${crop}`,
        items: payloadItems,
        createdByName: 'शेतकरी सेल्फ-कोटेशन (पॉपअप)',
      });

      setSubmitted(newQuote);

      // 2. Background attempt to API
      try {
        const apiUrl = `${process.env.NEXT_PUBLIC_API_URL || ''}/api/quotations`;
        await fetch(apiUrl, {
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
      alert('त्रुटी आली: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleWhatsAppShare = () => {
    let text = `🌾 *श्री कृष्ण ॲग्रो सर्व्हिसेस, सिन्नर — कोटेशन विनंती*\n\n`;
    text += `*शेतकरी नाव*: ${farmerName || 'शेतकरी मित्र'}\n`;
    text += `*मोबाईल*: ${farmerPhone}\n`;
    text += `*गाव*: ${farmerVillage || 'सिन्नर'}\n`;
    text += `*पीक*: ${crop}\n\n`;
    text += `*मागणी उत्पादने:*\n`;
    items.forEach((it, idx) => {
      const p = allProds.find((prod) => prod.id === it.productId) || store.getProductById(it.productId);
      if (p) {
        text += `${idx + 1}. ${p.nameMr} (${p.packSize}) — ${it.quantity} नग\n`;
      }
    });
    text += `\n*अंदाजे एकूण रक्कम*: ₹${estimatedTotal.toLocaleString('en-IN')}\n\n📍 श्री कृष्ण ॲग्रो सर्व्हिसेस, सिन्नर (नाशिक)\n📞 शुभम गमाणे: 8605620843 | जगदीश बोडके: 8888474456`;

    const encoded = encodeURIComponent(text);
    window.open(`https://wa.me/918605620843?text=${encoded}`, '_blank');
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4">
      <div className="bg-white rounded-3xl shadow-2xl max-w-xl w-full overflow-hidden border border-slate-200 flex flex-col max-h-[92vh]">
        {/* Modal Header */}
        <div className="bg-gradient-to-r from-agro-900 to-agro-800 text-white p-4 sm:p-5 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <FileText className="w-5 h-5 text-emerald-300" />
            <div>
              <h3 className="font-extrabold text-base sm:text-lg">{t.quoteModalTitle}</h3>
              <p className="text-xs text-emerald-200">श्री कृष्ण ॲग्रो सर्व्हिसेस, सिन्नर</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-emerald-200 hover:text-white p-1 rounded-lg transition"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-4 text-xs sm:text-sm">
          {submitted ? (
            <div className="text-center py-6 space-y-4">
              <CheckCircle2 className="w-14 h-14 text-emerald-600 mx-auto animate-bounce" />
              <div>
                <h4 className="text-lg font-extrabold text-slate-900">
                  कोटेशन यशस्वीरित्या नोंदवले गेले!
                </h4>
                <p className="text-slate-600 text-xs mt-1">
                  कोटेशन क्रमांक: <strong className="font-mono text-agro-800 text-sm">{submitted.quotationNumber}</strong>
                </p>
                <div className="inline-block bg-emerald-100 text-emerald-900 font-extrabold text-sm px-4 py-1 rounded-full mt-2">
                  एकूण रक्कम: ₹{Number(submitted?.grandTotal || 0).toLocaleString('en-IN')}
                </div>
              </div>

              <div className="pt-2 flex flex-col sm:flex-row justify-center gap-3">
                <button
                  type="button"
                  onClick={() => window.print()}
                  className="bg-agro-700 hover:bg-agro-800 text-white font-bold px-4 py-2.5 rounded-xl text-xs flex items-center justify-center gap-1.5 shadow-sm"
                >
                  <Printer className="w-4 h-4" />
                  <span>🖨️ कोटेशन स्लिप प्रिंट करा</span>
                </button>
                <button
                  type="button"
                  onClick={handleWhatsAppShare}
                  className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-4 py-2.5 rounded-xl text-xs flex items-center justify-center gap-1.5 shadow-sm"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>💬 WhatsApp वर पाठवा</span>
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    {t.farmerName} *
                  </label>
                  <input
                    type="text"
                    required
                    value={farmerName}
                    onChange={(e) => setFarmerName(e.target.value)}
                    placeholder="उदा. बाबासाहेब देशमुख"
                    className="w-full border border-slate-300 rounded-xl p-2.5 text-xs focus:ring-2 focus:ring-agro-600 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    {t.farmerPhone} *
                  </label>
                  <input
                    type="tel"
                    required
                    value={farmerPhone}
                    onChange={(e) => setFarmerPhone(e.target.value)}
                    placeholder="उदा. 9822114477"
                    className="w-full border border-slate-300 rounded-xl p-2.5 text-xs focus:ring-2 focus:ring-agro-600 focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    {t.farmerVillage}
                  </label>
                  <input
                    type="text"
                    value={farmerVillage}
                    onChange={(e) => setFarmerVillage(e.target.value)}
                    placeholder="उदा. मुसळगाव / पाटोळे / सिन्नर"
                    className="w-full border border-slate-300 rounded-xl p-2.5 text-xs focus:ring-2 focus:ring-agro-600 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    {t.cropType}
                  </label>
                  <select
                    value={crop}
                    onChange={(e) => setCrop(e.target.value)}
                    className="w-full border border-slate-300 rounded-xl p-2.5 text-xs focus:ring-2 focus:ring-agro-600 bg-white focus:outline-none font-medium"
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

              {/* Product Selection Items */}
              <div className="border border-slate-200 rounded-2xl p-3 sm:p-4 bg-slate-50 space-y-2.5">
                <div className="flex justify-between items-center pb-1 border-b border-slate-200">
                  <span className="font-extrabold text-slate-800 text-xs">
                    मागणी उत्पादने (Products List)
                  </span>
                  <button
                    type="button"
                    onClick={addItem}
                    className="bg-agro-700 hover:bg-agro-800 text-white font-bold px-2.5 py-1 rounded-lg flex items-center gap-1 text-[11px] transition shadow-xs"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>+ आयटम जोडा</span>
                  </button>
                </div>

                <div className="space-y-2">
                  {items.map((it, idx) => {
                    const selProd =
                      allProds.find((p) => p.id === it.productId) || store.getProductById(it.productId);
                    return (
                      <div
                        key={idx}
                        className="bg-white p-2.5 rounded-xl border border-slate-200 flex items-center gap-2 shadow-xs"
                      >
                        <select
                          value={it.productId}
                          onChange={(e) => updateItemProduct(idx, e.target.value)}
                          className="flex-1 border border-slate-200 rounded-lg p-2 text-xs bg-white font-medium"
                        >
                          {allProds.map((p) => (
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
                          className="w-16 border border-slate-200 rounded-lg p-2 text-xs text-center font-extrabold text-agro-900"
                        />
                        <span className="text-xs font-extrabold text-slate-800 whitespace-nowrap min-w-[70px] text-right font-mono">
                          ₹{((selProd?.sellingPrice || 0) * it.quantity).toLocaleString('en-IN')}
                        </span>
                        {items.length > 1 && (
                          <button
                            type="button"
                            onClick={() => removeItem(idx)}
                            className="text-red-500 hover:text-red-700 p-1 hover:bg-red-50 rounded"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    );
                  })}
                </div>

                <div className="pt-2 flex justify-between items-center text-xs font-extrabold text-slate-900 border-t border-slate-200">
                  <span>अंदाजे एकूण रक्कम:</span>
                  <span className="text-sm font-mono text-agro-700">₹{estimatedTotal.toLocaleString('en-IN')}</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-2 flex flex-col sm:flex-row gap-2">
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 bg-gradient-to-r from-agro-700 to-agro-800 hover:from-agro-800 hover:to-agro-900 text-white font-extrabold py-3 rounded-xl transition flex items-center justify-center gap-2 shadow-agro text-xs sm:text-sm"
                >
                  <Send className="w-4 h-4" />
                  <span>{loading ? 'नोंदवत आहे...' : t.sendQuoteRequest}</span>
                </button>
                <button
                  type="button"
                  onClick={handleWhatsAppShare}
                  className="bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold py-3 px-4 rounded-xl transition flex items-center justify-center gap-2 text-xs sm:text-sm"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>WhatsApp कोटेशन</span>
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
