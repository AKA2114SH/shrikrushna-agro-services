'use client';

import React, { useState } from 'react';
import { X, Send, Plus, Trash2, CheckCircle2, MessageCircle, FileText } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';
import { Product } from '@/lib/store';

interface QuotationModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialProduct?: Product | null;
  availableProducts: Product[];
}

export default function QuotationModal({
  isOpen,
  onClose,
  initialProduct,
  availableProducts,
}: QuotationModalProps) {
  const { t } = useLanguage();
  const [farmerName, setFarmerName] = useState('');
  const [farmerPhone, setFarmerPhone] = useState('');
  const [farmerVillage, setFarmerVillage] = useState('');
  const [crop, setCrop] = useState('कांदा (Onion)');
  const [items, setItems] = useState<Array<{ productId: string; quantity: number }>>([]);
  const [submitted, setSubmitted] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  React.useEffect(() => {
    if (initialProduct) {
      setItems([{ productId: initialProduct.id, quantity: 1 }]);
    } else if (items.length === 0 && availableProducts.length > 0) {
      setItems([{ productId: availableProducts[0].id, quantity: 5 }]);
    }
  }, [initialProduct, availableProducts]);

  if (!isOpen) return null;

  const addItem = () => {
    if (availableProducts.length > 0) {
      setItems([...items, { productId: availableProducts[0].id, quantity: 1 }]);
    }
  };

  const removeItem = (index: number) => {
    setItems(items.filter((_, i) => i !== index));
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
    const p = availableProducts.find((prod) => prod.id === it.productId);
    if (p) {
      estimatedTotal += p.sellingPrice * it.quantity;
    }
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!farmerName || !farmerPhone || items.length === 0) return;

    setLoading(true);
    try {
      const payloadItems = items.map((it) => {
        const prod = availableProducts.find((p) => p.id === it.productId);
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
        setSubmitted(data.quotation);
      }
    } catch {
      alert('कोटेशन विनंती पाठवताना त्रुटी आली. कृपया पुन्हा प्रयत्न करा.');
    } finally {
      setLoading(false);
    }
  };

  const handleWhatsAppShare = () => {
    let text = `*📋 श्री कृष्ण ॲग्रो सर्व्हिसेस - कोटेशन विनंती*\n\n`;
    text += `*शेतकरी नाव*: ${farmerName || 'शेतकरी मित्र'}\n`;
    text += `*मोबाईल*: ${farmerPhone}\n`;
    text += `*गाव*: ${farmerVillage || 'सिन्नर'}\n`;
    text += `*पीक*: ${crop}\n\n`;
    text += `*मागणी उत्पादने:*\n`;
    items.forEach((it, idx) => {
      const p = availableProducts.find((prod) => prod.id === it.productId);
      if (p) {
        text += `${idx + 1}. ${p.nameMr} (${p.packSize}) — ${it.quantity} नग\n`;
      }
    });
    text += `\n*अंदाजे रक्कम*: ₹${estimatedTotal.toLocaleString('en-IN')}\n\nकृपया अधिकृत दरपत्रक PDF पाठवावे.`;

    const encoded = encodeURIComponent(text);
    window.open(`https://wa.me/918605620843?text=${encoded}`, '_blank');
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-xl w-full overflow-hidden border border-emerald-100 flex flex-col max-h-[90vh]">
        {/* Modal Header */}
        <div className="bg-gradient-to-r from-agro-800 to-agro-900 text-white p-4 sm:p-5 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <FileText className="w-5 h-5 text-emerald-300" />
            <div>
              <h3 className="font-bold text-base sm:text-lg">{t.quoteModalTitle}</h3>
              <p className="text-xs text-emerald-200">{t.brandName}, सिन्नर</p>
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
            <div className="text-center py-6 space-y-3">
              <CheckCircle2 className="w-14 h-14 text-emerald-600 mx-auto animate-bounce" />
              <h4 className="text-lg font-bold text-slate-800">
                कोटेशन विनंती यशस्वीरित्या नोंदवली गेली!
              </h4>
              <p className="text-slate-600 text-xs max-w-md mx-auto">
                कोटेशन क्रमांक: <strong>{submitted.quotationNumber}</strong>. आमचे कृषी तज्ञ शुभम गमाणे व जगदीश बोडके लवकरच आपल्याशी संपर्क करतील.
              </p>
              <div className="pt-4 flex flex-col sm:flex-row justify-center gap-3">
                <a
                  href={`/api/quotations/${submitted.id}?format=html`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-agro-700 text-white font-bold px-4 py-2 rounded-lg text-xs hover:bg-agro-800"
                >
                  📄 कोटेशन स्लिप पहा / प्रिंट करा
                </a>
                <button
                  onClick={handleWhatsAppShare}
                  className="bg-emerald-600 text-white font-bold px-4 py-2 rounded-lg text-xs hover:bg-emerald-700 flex items-center justify-center gap-1.5"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>WhatsApp वर पाठवा</span>
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
                    className="w-full border border-slate-300 rounded-lg p-2 text-xs focus:ring-1 focus:ring-agro-600"
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
                    className="w-full border border-slate-300 rounded-lg p-2 text-xs focus:ring-1 focus:ring-agro-600"
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
                    placeholder="उदा. मुसळगाव / पांगरी / सिन्नर"
                    className="w-full border border-slate-300 rounded-lg p-2 text-xs focus:ring-1 focus:ring-agro-600"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    {t.cropType}
                  </label>
                  <select
                    value={crop}
                    onChange={(e) => setCrop(e.target.value)}
                    className="w-full border border-slate-300 rounded-lg p-2 text-xs focus:ring-1 focus:ring-agro-600 bg-white"
                  >
                    <option value="कांदा (Onion)">कांदा (Onion)</option>
                    <option value="द्राक्ष (Grapes)">द्राक्ष (Grapes)</option>
                    <option value="डाळिंब (Pomegranate)">डाळिंब (Pomegranate)</option>
                    <option value="टोमॅटो (Tomato)">टोमॅटो (Tomato)</option>
                    <option value="भाजीपाला (Vegetables)">भाजीपाला (Vegetables)</option>
                    <option value="ऊस (Sugarcane)">ऊस (Sugarcane)</option>
                  </select>
                </div>
              </div>

              {/* Product Selection Items */}
              <div className="border border-slate-200 rounded-xl p-3 bg-slate-50 space-y-2.5">
                <div className="flex justify-between items-center">
                  <span className="font-bold text-slate-800">
                    मागणी उत्पादने (Products List)
                  </span>
                  <button
                    type="button"
                    onClick={addItem}
                    className="text-agro-700 font-bold hover:underline flex items-center gap-1 text-xs"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>आणखी जोडा</span>
                  </button>
                </div>

                {items.map((it, idx) => {
                  const selProd = availableProducts.find((p) => p.id === it.productId);
                  return (
                    <div
                      key={idx}
                      className="bg-white p-2.5 rounded-lg border border-slate-200 flex items-center gap-2"
                    >
                      <select
                        value={it.productId}
                        onChange={(e) => updateItemProduct(idx, e.target.value)}
                        className="flex-1 border border-slate-200 rounded p-1.5 text-xs bg-white"
                      >
                        {availableProducts.map((p) => (
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
                        className="w-16 border border-slate-200 rounded p-1.5 text-xs text-center font-bold"
                      />
                      <span className="text-[11px] text-slate-500 font-medium whitespace-nowrap">
                        = ₹{((selProd?.sellingPrice || 0) * it.quantity).toLocaleString('en-IN')}
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

                <div className="pt-2 flex justify-between items-center text-xs font-bold text-agro-900 border-t border-slate-200">
                  <span>अंदाजे एकूण रक्कम (Approx Total):</span>
                  <span className="text-sm text-agro-700">₹{estimatedTotal.toLocaleString('en-IN')}</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-2 flex flex-col sm:flex-row gap-2">
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 bg-gradient-to-r from-agro-700 to-agro-800 hover:from-agro-800 hover:to-agro-900 text-white font-bold py-2.5 rounded-xl transition flex items-center justify-center gap-2"
                >
                  <Send className="w-4 h-4" />
                  <span>{loading ? 'नोंदवत आहे...' : t.sendQuoteRequest}</span>
                </button>
                <button
                  type="button"
                  onClick={handleWhatsAppShare}
                  className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-2.5 px-4 rounded-xl transition flex items-center justify-center gap-2"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>थेट WhatsApp कोटेशन</span>
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
