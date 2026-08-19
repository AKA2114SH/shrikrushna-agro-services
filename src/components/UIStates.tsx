// Global Reusable UI States: Loading, Empty, Error, Success, Permission Denied
import React from 'react';
import { Loader2, AlertCircle, ShieldAlert, CheckCircle2, PackageOpen } from 'lucide-react';

export function LoadingState({ message = 'माहिती लोड होत आहे... (Loading...)' }: { message?: string }) {
  return (
    <div className="flex flex-col items-center justify-center p-12 text-center space-y-3 bg-white/60 backdrop-blur-xs rounded-2xl border border-slate-100 min-h-[220px]">
      <Loader2 className="w-8 h-8 text-agro-700 animate-spin" />
      <p className="text-xs sm:text-sm font-semibold text-slate-600 animate-pulse">{message}</p>
    </div>
  );
}

export function EmptyState({
  title = 'कोणतीही माहिती उपलब्ध नाही',
  description = 'सध्या येथे कोणतीही नोंद आढळली नाही.',
  actionLabel,
  onAction,
}: {
  title?: string;
  description?: string;
  actionLabel?: string;
  onAction?: () => void;
}) {
  return (
    <div className="flex flex-col items-center justify-center p-8 sm:p-12 text-center space-y-3 bg-slate-50/70 rounded-2xl border border-dashed border-slate-200 min-h-[200px]">
      <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center">
        <PackageOpen className="w-6 h-6" />
      </div>
      <div className="space-y-1 max-w-sm">
        <h4 className="text-sm sm:text-base font-bold text-slate-800">{title}</h4>
        <p className="text-xs text-slate-500">{description}</p>
      </div>
      {actionLabel && onAction && (
        <button
          type="button"
          onClick={onAction}
          className="mt-2 bg-agro-700 hover:bg-agro-800 text-white font-bold text-xs px-4 py-2 rounded-xl transition"
        >
          {actionLabel}
        </button>
      )}
    </div>
  );
}

export function ErrorState({
  message = 'माहिती लोड करताना त्रुटी आली. कृपया पुन्हा प्रयत्न करा.',
  onRetry,
}: {
  message?: string;
  onRetry?: () => void;
}) {
  return (
    <div className="flex flex-col items-center justify-center p-8 text-center space-y-3 bg-red-50/80 rounded-2xl border border-red-200 min-h-[180px]">
      <div className="w-10 h-10 rounded-full bg-red-100 text-red-600 flex items-center justify-center">
        <AlertCircle className="w-5 h-5" />
      </div>
      <div className="space-y-1 max-w-sm">
        <h4 className="text-sm font-bold text-red-900">तांत्रिक अडचण आली</h4>
        <p className="text-xs text-red-700">{message}</p>
      </div>
      {onRetry && (
        <button
          type="button"
          onClick={onRetry}
          className="mt-1 bg-red-600 hover:bg-red-700 text-white font-bold text-xs px-3.5 py-1.5 rounded-lg transition"
        >
          पुन्हा प्रयत्न करा (Retry)
        </button>
      )}
    </div>
  );
}

export function PermissionDeniedState({
  role = 'User',
  requiredPermission = 'Operation',
}: {
  role?: string;
  requiredPermission?: string;
}) {
  return (
    <div className="flex flex-col items-center justify-center p-8 sm:p-12 text-center space-y-3 bg-amber-50/70 rounded-2xl border border-amber-200 min-h-[220px]">
      <div className="w-12 h-12 rounded-full bg-amber-100 text-amber-700 flex items-center justify-center">
        <ShieldAlert className="w-6 h-6" />
      </div>
      <div className="space-y-1 max-w-md">
        <h4 className="text-sm sm:text-base font-bold text-amber-950">परवानगी नाकारली (Permission Denied)</h4>
        <p className="text-xs text-amber-800">
          आपल्या खात्याची भूमिका (<strong>{role}</strong>) या विभागासाठी अधिकृत नाही ({requiredPermission}).
        </p>
      </div>
    </div>
  );
}

export function SuccessFeedback({
  title = 'यशस्वी!',
  message = 'नोंद यशस्वीरित्या जतन झाली.',
  onClose,
}: {
  title?: string;
  message?: string;
  onClose?: () => void;
}) {
  return (
    <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl flex items-start gap-3">
      <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
      <div className="flex-1 text-xs">
        <h5 className="font-bold text-emerald-950">{title}</h5>
        <p className="text-emerald-800">{message}</p>
      </div>
      {onClose && (
        <button onClick={onClose} className="text-emerald-700 hover:text-emerald-900 font-bold text-xs">
          ✕
        </button>
      )}
    </div>
  );
}
