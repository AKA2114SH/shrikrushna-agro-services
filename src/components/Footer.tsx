'use client';

import React from 'react';
import Link from 'next/link';
import { useLanguage } from '@/context/LanguageContext';
import { Sprout, Phone, MapPin, Clock, ShieldCheck, FileCheck, MessageCircle, Award } from 'lucide-react';

export default function Footer() {
  const { t } = useLanguage();

  return (
    <footer className="bg-slate-950 text-slate-300 pt-14 pb-8 border-t-4 border-agro-600">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 pb-12 border-b border-slate-800">
          {/* Col 1: Brand & Bio */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-agro-600 to-agro-800 flex items-center justify-center text-white shadow-agro">
                <Sprout className="w-5 h-5 text-emerald-300" />
              </div>
              <span className="font-bold text-lg text-white">
                {t.brandName}
              </span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              {t.footerDesc}
            </p>
            <div className="bg-slate-900 border border-slate-800 rounded-lg p-3 text-xs space-y-1">
              <div className="text-emerald-400 font-bold flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4" />
                <span>अधिकृत परवानाधारक कृषी केंद्र</span>
              </div>
              <p className="text-[11px] text-slate-400">
                FL: FL/NSK/SINNAR/2024/089<br />
                SL: SL/NSK/SINNAR/2024/112 | GST: 27AAAFS5678K1Z5
              </p>
            </div>
          </div>

          {/* Col 2: Agronomist Team (Verified Experts) */}
          <div className="space-y-4">
            <h4 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <Award className="w-4 h-4 text-emerald-400" />
              <span>{t.agronomists}</span>
            </h4>
            <div className="space-y-3 text-xs">
              <div className="bg-slate-900 p-3 rounded-lg border border-slate-800">
                <p className="font-bold text-white text-sm">{t.shubhamName}</p>
                <p className="text-emerald-400 text-xs">{t.shubhamRole}</p>
                <a
                  href="tel:+918605620843"
                  className="inline-flex items-center gap-1.5 text-slate-300 hover:text-white mt-1.5 font-medium"
                >
                  <Phone className="w-3.5 h-3.5 text-emerald-400" />
                  <span>+91 8605620843</span>
                </a>
              </div>

              <div className="bg-slate-900 p-3 rounded-lg border border-slate-800">
                <p className="font-bold text-white text-sm">{t.jagdishName}</p>
                <p className="text-emerald-400 text-xs">{t.jagdishRole}</p>
                <a
                  href="tel:+918888474456"
                  className="inline-flex items-center gap-1.5 text-slate-300 hover:text-white mt-1.5 font-medium"
                >
                  <Phone className="w-3.5 h-3.5 text-emerald-400" />
                  <span>+91 8888474456</span>
                </a>
              </div>
            </div>
          </div>

          {/* Col 3: Quick Navigation */}
          <div className="space-y-4">
            <h4 className="text-sm font-bold text-white uppercase tracking-wider">
              द्रुत दुवे (Quick Links)
            </h4>
            <ul className="space-y-2 text-xs font-medium text-slate-400">
              <li>
                <Link href="/products" className="hover:text-emerald-400 transition">
                  • {t.navProducts}
                </Link>
              </li>
              <li>
                <Link href="/advisory" className="hover:text-emerald-400 transition">
                  • {t.navAdvisory} (कांदा, द्राक्ष, डाळिंब)
                </Link>
              </li>
              <li>
                <Link href="/quotation" className="hover:text-emerald-400 transition">
                  • {t.navQuotation}
                </Link>
              </li>
              <li>
                <Link href="/admin" className="hover:text-emerald-400 transition">
                  • {t.navAdmin} (ERP Management)
                </Link>
              </li>
              <li>
                <a
                  href="https://wa.me/918605620843"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-emerald-400 transition text-emerald-400 flex items-center gap-1 mt-3"
                >
                  <MessageCircle className="w-3.5 h-3.5" />
                  <span>थेट व्हॉट्सॲप चॅट सुरू करा</span>
                </a>
              </li>
            </ul>
          </div>

          {/* Col 4: Shop Location & Timings */}
          <div className="space-y-4">
            <h4 className="text-sm font-bold text-white uppercase tracking-wider">
              पत्ता व वेळ (Store Location)
            </h4>
            <div className="space-y-2.5 text-xs text-slate-400">
              <div className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
                <span>
                  मुख्य बाजारपेठ, सिन्नर, जिल्हा नाशिक, महाराष्ट्र - ४२२१०३.
                </span>
              </div>
              <div className="flex items-start gap-2">
                <Clock className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
                <span>{t.businessHours}</span>
              </div>
              <div className="pt-2">
                <a
                  href="https://maps.google.com/?q=Sinnar,Nashik"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block bg-slate-900 hover:bg-slate-800 text-emerald-400 hover:text-emerald-300 px-3 py-1.5 rounded border border-slate-800 font-semibold transition"
                >
                  📍 Google Maps वर रस्ता पहा
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Safety Disclaimer */}
        <div className="py-6 border-b border-slate-900 text-center text-[11px] text-slate-500 max-w-4xl mx-auto">
          <p>{t.disclaimer}</p>
        </div>

        {/* Bottom bar */}
        <div className="pt-6 flex flex-col sm:flex-row justify-between items-center text-xs text-slate-500 gap-3">
          <p>{t.copyright}</p>
          <div className="flex items-center gap-2">
            <span>अधिकृत कृषी सल्लागार:</span>
            <span className="text-emerald-400 font-bold">शुभम गमाणे (8605620843)</span>
            <span>|</span>
            <span className="text-emerald-400 font-bold">जगदीश बोडके (8888474456)</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
