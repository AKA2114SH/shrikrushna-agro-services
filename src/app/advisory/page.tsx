'use client';

import React, { useState } from 'react';
import { useLanguage } from '@/context/LanguageContext';
import {
  Sprout,
  ShieldCheck,
  Award,
  Phone,
  Droplets,
  Layers,
  Bug,
  Sparkles,
  Calendar,
  AlertTriangle,
} from 'lucide-react';

export default function AdvisoryPage() {
  const { t } = useLanguage();
  const [selectedCrop, setSelectedCrop] = useState<'onion' | 'grapes' | 'pomegranate' | 'tomato'>('onion');

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Header */}
      <div className="bg-gradient-to-r from-agro-900 to-agro-800 text-white rounded-3xl p-6 sm:p-10 shadow-agro-lg">
        <div className="max-w-3xl space-y-3">
          <div className="inline-flex items-center gap-2 bg-emerald-800 text-emerald-300 text-xs font-bold px-3 py-1 rounded-full">
            <Award className="w-4 h-4 text-amber-400" />
            <span>B.Sc Agri तज्ञांचे प्रमाणित मार्गदर्शन</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-extrabold">{t.advisoryTitle}</h1>
          <p className="text-xs sm:text-sm text-emerald-100/90 leading-relaxed">
            सिन्नर व नाशिक परिसरातील माती, हवामान व पीक पद्धतीनुसार तयार केलेले अधिकृत खत व फवारणी वेळापत्रक.
          </p>
        </div>
      </div>

      {/* Expert Badges */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="bg-white p-4 rounded-2xl border border-slate-200 flex items-center justify-between shadow-sm">
          <div>
            <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded">
              पीक सल्लागार
            </span>
            <h3 className="font-bold text-slate-900 text-base mt-1">{t.shubhamName}</h3>
            <p className="text-xs text-emerald-700">{t.shubhamRole}</p>
          </div>
          <a
            href="tel:+918605620843"
            className="bg-agro-700 hover:bg-agro-800 text-white p-2.5 rounded-xl transition flex items-center gap-1.5 text-xs font-bold"
          >
            <Phone className="w-4 h-4" />
            <span>८६०५६२०८४३</span>
          </a>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 flex items-center justify-between shadow-sm">
          <div>
            <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded">
              रोग व कीड नियंत्रक
            </span>
            <h3 className="font-bold text-slate-900 text-base mt-1">{t.jagdishName}</h3>
            <p className="text-xs text-emerald-700">{t.jagdishRole}</p>
          </div>
          <a
            href="tel:+918888474456"
            className="bg-agro-700 hover:bg-agro-800 text-white p-2.5 rounded-xl transition flex items-center gap-1.5 text-xs font-bold"
          >
            <Phone className="w-4 h-4" />
            <span>८८८८४७४४५६</span>
          </a>
        </div>
      </div>

      {/* Crop Tabs */}
      <div className="flex gap-2 border-b border-slate-200 overflow-x-auto pb-2 scrollbar-none text-xs sm:text-sm font-bold">
        <button
          onClick={() => setSelectedCrop('onion')}
          className={`px-4 py-2.5 rounded-xl transition flex items-center gap-2 whitespace-nowrap ${
            selectedCrop === 'onion'
              ? 'bg-agro-800 text-white shadow-sm'
              : 'bg-white text-slate-700 hover:bg-slate-50 border border-slate-200'
          }`}
        >
          <Sprout className="w-4 h-4" />
          <span>कांदा पीक (Onion)</span>
        </button>
        <button
          onClick={() => setSelectedCrop('grapes')}
          className={`px-4 py-2.5 rounded-xl transition flex items-center gap-2 whitespace-nowrap ${
            selectedCrop === 'grapes'
              ? 'bg-agro-800 text-white shadow-sm'
              : 'bg-white text-slate-700 hover:bg-slate-50 border border-slate-200'
          }`}
        >
          <Droplets className="w-4 h-4" />
          <span>द्राक्ष बाग (Grapes)</span>
        </button>
        <button
          onClick={() => setSelectedCrop('pomegranate')}
          className={`px-4 py-2.5 rounded-xl transition flex items-center gap-2 whitespace-nowrap ${
            selectedCrop === 'pomegranate'
              ? 'bg-agro-800 text-white shadow-sm'
              : 'bg-white text-slate-700 hover:bg-slate-50 border border-slate-200'
          }`}
        >
          <Layers className="w-4 h-4" />
          <span>डाळिंब (Pomegranate)</span>
        </button>
        <button
          onClick={() => setSelectedCrop('tomato')}
          className={`px-4 py-2.5 rounded-xl transition flex items-center gap-2 whitespace-nowrap ${
            selectedCrop === 'tomato'
              ? 'bg-agro-800 text-white shadow-sm'
              : 'bg-white text-slate-700 hover:bg-slate-50 border border-slate-200'
          }`}
        >
          <Bug className="w-4 h-4" />
          <span>टोमॅटो (Tomato)</span>
        </button>
      </div>

      {/* Crop Guide Content */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6">
        {selectedCrop === 'onion' && (
          <div className="space-y-6">
            <div className="border-b border-slate-100 pb-4">
              <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900">
                कांदा पीक संपूर्ण खत व फवारणी व्यवस्थापन
              </h2>
              <p className="text-xs text-slate-500 mt-1">
                खरिप, रांगडा व उन्हाळी कांद्यासाठी सिन्नर तालुक्यातील अनुभवी तज्ञांचे वेळापत्रक.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-5 text-xs">
              <div className="bg-emerald-50/70 p-4 rounded-2xl border border-emerald-100 space-y-2">
                <span className="font-bold text-agro-800 flex items-center gap-1.5">
                  <Calendar className="w-4 h-4" />
                  <span>टप्पा १: लागवड ते ३० दिवस</span>
                </span>
                <p className="text-slate-700">
                  <strong>पांढऱ्या मुळांची वाढ व शाकीय वाढ:</strong>
                </p>
                <ul className="list-disc pl-4 space-y-1 text-slate-600">
                  <li>ठिबकद्वारे: महाधन १९:१९:१९ (३-५ किलो प्रति एकर)</li>
                  <li>मायक्रोन्युट्रिएंट्स: चिलेटेड झिंक (१ ग्रॅम/लिटर)</li>
                  <li>कीड नियंत्रण: थ्रिप्ससाठी कराटे किंवा प्रोफेक्स सुपर फवारणी</li>
                </ul>
              </div>

              <div className="bg-emerald-50/70 p-4 rounded-2xl border border-emerald-100 space-y-2">
                <span className="font-bold text-agro-800 flex items-center gap-1.5">
                  <Calendar className="w-4 h-4" />
                  <span>टप्पा २: ३० ते ६० दिवस</span>
                </span>
                <p className="text-slate-700">
                  <strong>करपा प्रतिबंध व मान जाड होणे:</strong>
                </p>
                <ul className="list-disc pl-4 space-y-1 text-slate-600">
                  <li>खत: १२:६१:०० (मोनो अमोनियम फॉस्फेट) ४ किलो/एकर</li>
                  <li>बुरशीनाशक: बायर नॅटिव्हो (०.५ ग्रॅम/लिटर) किंवा ॲमिस्टार टॉप (१ मिली/लिटर)</li>
                  <li>सल्फर ८०% WDG (३ किलो प्रति एकर) जमिनीतून</li>
                </ul>
              </div>

              <div className="bg-emerald-50/70 p-4 rounded-2xl border border-emerald-100 space-y-2">
                <span className="font-bold text-agro-800 flex items-center gap-1.5">
                  <Calendar className="w-4 h-4" />
                  <span>टप्पा ३: ६० ते ९० दिवस (गाठ फुगवण)</span>
                </span>
                <p className="text-slate-700">
                  <strong>वजन, चमकदार रंग व टिकवण क्षमता:</strong>
                </p>
                <ul className="list-disc pl-4 space-y-1 text-slate-600">
                  <li>खत: महाधन ०:५२:३४ (५ किलो) + ००:००:५० (५ किलो)</li>
                  <li>बोरॉन २०% (१ ग्रॅम/लिटर) फवारणी</li>
                  <li>काढणीपूर्वी १५ दिवस पाणी देणे थांबवावे</li>
                </ul>
              </div>
            </div>
          </div>
        )}

        {selectedCrop === 'grapes' && (
          <div className="space-y-6">
            <div className="border-b border-slate-100 pb-4">
              <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900">
                द्राक्ष बाग रोग नियंत्रण व फुगवण मार्गदर्शक
              </h2>
              <p className="text-xs text-slate-500 mt-1">
                सिन्नर व नाशिक भागातील थॉम्पसन, सोनाका, अनुष्का जातींसाठी विशेष काळजी.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 text-xs">
              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-2">
                <h4 className="font-bold text-agro-800 text-sm">डावणी व भुरी रोग प्रतिबंध:</h4>
                <p className="text-slate-600 leading-relaxed">
                  ढगाळ वातावरण व दव पडताना बायर इन्फिनिटो किंवा सिंजेन्टा रेव्हस ची फवारणी. भुरीसाठी नॅटिव्हो किंवा लुना एक्सपिरियन्स योग्य मात्रेत वापरावे.
                </p>
              </div>
              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-2">
                <h4 className="font-bold text-agro-800 text-sm">मणी फुगवण व तडकणे रोखणे:</h4>
                <p className="text-slate-600 leading-relaxed">
                  यारालिवा नायट्राबोर (कॅल्शियम नायट्रेट + बोरॉन) ठिबकद्वारे १०-१५ किलो देणे. यामुळे मण्यांची त्वचा मजबूत राहून साखर व चमक वाढते.
                </p>
              </div>
            </div>
          </div>
        )}

        {selectedCrop === 'pomegranate' && (
          <div className="space-y-6">
            <div className="border-b border-slate-100 pb-4">
              <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900">
                डाळिंब बहार व्यवस्थापन व तेल्या प्रतिबंध
              </h2>
              <p className="text-xs text-slate-500 mt-1">
                भगवा डाळिंब बागेच्या चांगल्या उत्पादनासाठी तांत्रिक सूचना.
              </p>
            </div>
            <div className="bg-amber-50 border border-amber-200 p-4 rounded-2xl text-xs space-y-2 text-amber-950">
              <div className="font-bold flex items-center gap-1.5 text-amber-900">
                <AlertTriangle className="w-4 h-4 text-amber-700" />
                <span>महत्त्वाची सूचना:</span>
              </div>
              <p className="leading-relaxed">
                बहार धरताना पाण्याचा ताण योग्य पद्धतीने तोडावा. फुलधारणेच्या काळात जास्त रासायनिक बुरशीनाशके फवारू नयेत. परागीभवन व्यवस्थित होण्यासाठी जैविक टॉनिक वापरावे.
              </p>
            </div>
          </div>
        )}

        {selectedCrop === 'tomato' && (
          <div className="space-y-6">
            <div className="border-b border-slate-100 pb-4">
              <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900">
                टोमॅटो लागवड, नागअळी व व्हायरस संरक्षण
              </h2>
              <p className="text-xs text-slate-500 mt-1">
                टोमॅटोच्या दर्जेदार फळांसाठी कीड व्यवस्थापन.
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
                <h4 className="font-bold text-slate-800">फळपोखरणाऱ्या अळ्या:</h4>
                <p className="text-slate-600 mt-1">
                  कोराजन (६० मिली/एकर) किंवा फेम (५० मिली/एकर) फवारणी करा.
                </p>
              </div>
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
                <h4 className="font-bold text-slate-800">फुलगळ रोखणे:</h4>
                <p className="text-slate-600 mt-1">
                  १२:६१:०० खत व प्लॅनोफिक्स योग्य प्रमाणात फवारावे.
                </p>
              </div>
            </div>
          </div>
        )}

        <div className="pt-4 border-t border-slate-100 flex flex-col sm:flex-row justify-between items-center text-xs text-slate-500 gap-3">
          <span>सर्व शिफारसी उत्पादक कंपनीच्या अधिकृत लेबल निर्देशांनुसार लागू आहेत.</span>
          <a
            href="https://wa.me/918605620843"
            target="_blank"
            rel="noopener noreferrer"
            className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-4 py-2 rounded-lg"
          >
            व्हॉट्सॲपवर फोटो पाठवून सल्ला मिळवा
          </a>
        </div>
      </div>
    </div>
  );
}
