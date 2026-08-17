'use client';

import React, { useState, useEffect } from 'react';
import { AlertCircle, Database, RefreshCw, CheckCircle2 } from 'lucide-react';
import Link from 'next/link';

export default function DemoBanner() {
  const [isDemo, setIsDemo] = useState(true);
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState('');

  useEffect(() => {
    fetch('/api/admin/settings')
      .then((res) => res.json())
      .then((data) => {
        if (data && typeof data.isDemoActive === 'boolean') {
          setIsDemo(data.isDemoActive);
        }
      })
      .catch(() => {});
  }, []);

  if (!isDemo) {
    return (
      <div className="bg-emerald-900 text-emerald-100 text-xs px-4 py-1.5 flex items-center justify-between border-b border-emerald-800">
        <div className="flex items-center gap-2">
          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
          <span><strong>PRODUCTION MODE ACTIVE:</strong> Clean verified business database. No mock data mixed.</span>
        </div>
        <Link href="/admin" className="underline font-semibold hover:text-white">
          Admin ERP
        </Link>
      </div>
    );
  }

  return (
    <div className="bg-amber-500 text-slate-950 text-xs px-3 sm:px-6 py-2 font-medium flex flex-wrap items-center justify-between gap-2 shadow-sm border-b border-amber-600">
      <div className="flex items-center gap-2">
        <AlertCircle className="w-4 h-4 text-slate-900 flex-shrink-0 animate-bounce" />
        <span>
          <strong>DEMO / TEST MODE:</strong> Using simulated Sinnar agricultural dataset for QA & testing.
          Real business data will be imported during final onboarding.
        </span>
      </div>
      <div className="flex items-center gap-3">
        <Link
          href="/admin"
          className="bg-slate-900 text-white px-2.5 py-1 rounded text-xs hover:bg-slate-800 transition font-semibold"
        >
          Open ERP & Onboarding
        </Link>
      </div>
    </div>
  );
}
