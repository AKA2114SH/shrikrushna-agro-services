'use client';

import React, { useState, useEffect } from 'react';
import { useLanguage } from '@/context/LanguageContext';
import {
  ShieldCheck,
  ShoppingCart,
  Package,
  Truck,
  Users,
  FileText,
  DollarSign,
  TrendingUp,
  MessageCircle,
  Bot,
  Settings,
  History,
  Lock,
  Plus,
  Printer,
  AlertTriangle,
  RefreshCw,
  CheckCircle2,
  Trash2,
  Phone,
  Send,
  Sparkles,
  Download,
  Upload,
  UserCheck,
} from 'lucide-react';
import { UserRole } from '@/lib/auth';
import {
  Product,
  Customer,
  Supplier,
  Sale,
  Purchase,
  Quotation,
  Expense,
  StockMovement,
  StaffMember,
  BusinessProfile,
} from '@/lib/store';

export default function AdminPage() {
  const { t } = useLanguage();

  // Active Role State (For real-time demo & RBAC validation)
  const [currentRole, setCurrentRole] = useState<UserRole>('OWNER');
  const [currentUser, setCurrentUser] = useState<{ name: string; phone: string }>({
    name: 'Shri Krishna Agro Owner',
    phone: '9800000001',
  });

  // Active Module Tab
  const [activeTab, setActiveTab] = useState<
    | 'dashboard'
    | 'pos'
    | 'inventory'
    | 'purchases'
    | 'customers'
    | 'quotations'
    | 'expenses'
    | 'whatsapp'
    | 'owner_ai'
    | 'staff'
    | 'audit'
    | 'settings'
  >('dashboard');

  // Master Data State
  const [kpis, setKpis] = useState<any>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [sales, setSales] = useState<Sale[]>([]);
  const [purchases, setPurchases] = useState<Purchase[]>([]);
  const [quotations, setQuotations] = useState<Quotation[]>([]);
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [movements, setMovements] = useState<StockMovement[]>([]);
  const [staff, setStaff] = useState<StaffMember[]>([]);
  const [profile, setProfile] = useState<BusinessProfile | null>(null);
  const [auditLogs, setAuditLogs] = useState<any[]>([]);
  const [isDemoActive, setIsDemoActive] = useState<boolean>(true);
  const [loading, setLoading] = useState<boolean>(true);
  const [feedback, setFeedback] = useState<string>('');

  // POS Form State
  const [posCustomer, setPosCustomer] = useState<string>('');
  const [posCustomerName, setPosCustomerName] = useState<string>('');
  const [posCustomerPhone, setPosCustomerPhone] = useState<string>('');
  const [posCustomerVillage, setPosCustomerVillage] = useState<string>('');
  const [posItems, setPosItems] = useState<Array<{ productId: string; quantity: number; unitPrice: number; gstRate: number }>>([]);
  const [posDiscount, setPosDiscount] = useState<number>(0);
  const [posPaymentMethod, setPosPaymentMethod] = useState<'CASH' | 'UPI' | 'BANK_TRANSFER' | 'CREDIT'>('CASH');
  const [posPaidAmount, setPosPaidAmount] = useState<number>(0);

  // Purchase Form State
  const [purSupplier, setPurSupplier] = useState<string>('');
  const [purInvoice, setPurInvoice] = useState<string>('');
  const [purItems, setPurItems] = useState<Array<{ productId: string; batchNumber: string; mfgDate: string; expiryDate: string; quantity: number; unitCost: number; gstRate: number }>>([]);
  const [purFreight, setPurFreight] = useState<number>(0);
  const [purPaidAmount, setPurPaidAmount] = useState<number>(0);

  // Expense Form State
  const [expCategory, setExpCategory] = useState<any>('RENT');
  const [expAmount, setExpAmount] = useState<number>(0);
  const [expMethod, setExpMethod] = useState<'CASH' | 'UPI' | 'BANK_TRANSFER'>('CASH');
  const [expVendor, setExpVendor] = useState<string>('');
  const [expNotes, setExpNotes] = useState<string>('');

  // Owner AI Query State
  const [aiQuery, setAiQuery] = useState<string>('');
  const [aiResponse, setAiResponse] = useState<any>(null);
  const [aiLoading, setAiLoading] = useState<boolean>(false);

  // WhatsApp Simulator State
  const [simPhone, setSimPhone] = useState<string>('9822114477');
  const [simName, setSimName] = useState<string>('बाबासाहेब देशमुख (Babasaheb)');
  const [simMessage, setSimMessage] = useState<string>('१९:१९:१९ चे काय दर आहेत?');
  const [simHistory, setSimHistory] = useState<any[]>([]);
  const [simLoading, setSimLoading] = useState<boolean>(false);

  // Load All Master ERP Data
  const refreshData = async () => {
    setLoading(true);
    try {
      // 1. Authenticate session with current demo role
      await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone: currentUser.phone, role: currentRole }),
      });

      // 2. Fetch data parallelly
      const [pRes, cRes, supRes, sRes, purRes, qRes, eRes, kRes, stRes, setRes, logRes, waRes] =
        await Promise.all([
          fetch('/api/products').then((r) => r.json()),
          fetch('/api/customers').then((r) => r.json()).catch(() => ({ customers: [] })),
          fetch('/api/purchases').then((r) => r.json()).catch(() => ({ purchases: [] })),
          fetch('/api/sales').then((r) => r.json()).catch(() => ({ sales: [] })),
          fetch('/api/purchases').then((r) => r.json()).catch(() => ({ purchases: [] })),
          fetch('/api/quotations').then((r) => r.json()).catch(() => ({ quotations: [] })),
          fetch('/api/expenses').then((r) => r.json()).catch(() => ({ expenses: [] })),
          fetch('/api/reports/kpis').then((r) => r.json()).catch(() => ({ kpis: null })),
          fetch('/api/admin/staff').then((r) => r.json()).catch(() => ({ staff: [] })),
          fetch('/api/admin/settings').then((r) => r.json()).catch(() => ({ profile: null })),
          fetch('/api/admin/audit-logs').then((r) => r.json()).catch(() => ({ logs: [] })),
          fetch('/api/whatsapp/webhook').then((r) => r.json()).catch(() => ({ history: [] })),
        ]);

      if (pRes.products) setProducts(pRes.products);
      if (cRes.customers) setCustomers(cRes.customers);
      if (sRes.sales) setSales(sRes.sales);
      if (purRes.purchases) setPurchases(purRes.purchases);
      if (qRes.quotations) setQuotations(qRes.quotations);
      if (eRes.expenses) setExpenses(eRes.expenses);
      if (kRes.kpis) setKpis(kRes.kpis);
      if (stRes.staff) setStaff(stRes.staff);
      if (setRes.profile) setProfile(setRes.profile);
      if (typeof setRes.isDemoActive === 'boolean') setIsDemoActive(setRes.isDemoActive);
      if (logRes.logs) setAuditLogs(logRes.logs);
      if (waRes.history) setSimHistory(waRes.history);

      // Suppliers fallback from store
      if (cRes.customers && cRes.customers.length > 0 && !posCustomer) {
        setPosCustomer(cRes.customers[0].id);
        setPosCustomerName(cRes.customers[0].name);
        setPosCustomerPhone(cRes.customers[0].phone);
        setPosCustomerVillage(cRes.customers[0].village);
      }
    } catch {
      console.error('Error loading admin ERP data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refreshData();
  }, [currentRole]);

  // Switch role handler
  const handleRoleChange = (role: UserRole) => {
    setCurrentRole(role);
    if (role === 'OWNER') {
      setCurrentUser({ name: 'Shri Krishna Agro Owner', phone: '9800000001' });
    } else if (role === 'AGRONOMIST') {
      setCurrentUser({ name: 'Shubham Gamane (B.Sc Agri)', phone: '8605620843' });
    } else if (role === 'MANAGER') {
      setCurrentUser({ name: 'Kishor Gite (Store Manager)', phone: '9800000002' });
    } else if (role === 'CASHIER') {
      setCurrentUser({ name: 'Prashant Shinde (Cashier)', phone: '9800000003' });
    } else if (role === 'ACCOUNTANT') {
      setCurrentUser({ name: 'Suresh Pingle (Accountant)', phone: '9800000004' });
    }
  };

  // Add POS item
  const addPosItem = () => {
    if (products.length > 0) {
      const p = products[0];
      setPosItems([
        ...posItems,
        { productId: p.id, quantity: 1, unitPrice: p.sellingPrice, gstRate: p.gstRate },
      ]);
    }
  };

  // Submit POS Sale
  const handlePosSale = async (e: React.FormEvent) => {
    e.preventDefault();
    if (posItems.length === 0) {
      alert('कृपया किमान एक उत्पादन जोडा.');
      return;
    }

    try {
      const res = await fetch('/api/sales', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customerId: posCustomer || undefined,
          customerName: posCustomerName || 'Walk-in Farmer',
          customerPhone: posCustomerPhone,
          customerVillage: posCustomerVillage,
          items: posItems,
          discountAmount: posDiscount,
          paymentMethod: posPaymentMethod,
          paidAmount: posPaidAmount !== undefined ? posPaidAmount : (posPaymentMethod === 'CREDIT' ? 0 : computePosTotal()),
        }),
      });

      const data = await res.json();
      if (data.success) {
        setFeedback(`✅ विक्री यशस्वी! बिल क्रमांक: ${data.sale.invoiceNumber}`);
        setPosItems([]);
        refreshData();
      } else {
        alert(data.error || 'विक्री नोंदवण्यात त्रुटी आली.');
      }
    } catch {
      alert('विक्री प्रक्रिया अयशस्वी.');
    }
  };

  // Compute POS total
  const computePosTotal = () => {
    let sub = 0;
    let tax = 0;
    posItems.forEach((it) => {
      const line = it.quantity * it.unitPrice;
      sub += line;
      tax += (line * it.gstRate) / 100;
    });
    return Math.round(sub + tax - posDiscount);
  };

  // Settle Customer Khata Payment
  const settlePayment = async (customerId: string, amount: number) => {
    if (!amount || amount <= 0) return;
    try {
      const res = await fetch('/api/customers', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'RECORD_PAYMENT',
          customerId,
          amount,
          paymentMethod: 'CASH',
        }),
      });
      const data = await res.json();
      if (data.success) {
        setFeedback(`✅ पेमेंट जमा झाले. नवीन बाकी: ₹${data.customer.outstandingBalance}`);
        refreshData();
      }
    } catch {
      alert('पेमेंट नोंदवण्यात त्रुटी आली.');
    }
  };

  // Record Operating Expense
  const handleRecordExpense = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!expAmount || expAmount <= 0) return;
    try {
      const res = await fetch('/api/expenses', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          category: expCategory,
          amount: expAmount,
          paymentMethod: expMethod,
          vendor: expVendor,
          notes: expNotes,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setFeedback(`✅ खर्च नोंदवला: ₹${data.expense.amount} (${data.expense.category})`);
        setExpAmount(0);
        setExpVendor('');
        setExpNotes('');
        refreshData();
      } else {
        alert(data.error || 'खर्च नोंदवण्यात अडचण आली.');
      }
    } catch {
      alert('त्रुटी आली.');
    }
  };

  // Submit Owner AI Query
  const handleOwnerAI = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!aiQuery.trim()) return;
    setAiLoading(true);
    try {
      const res = await fetch('/api/ai/owner', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: aiQuery }),
      });
      const data = await res.json();
      if (data.success) {
        setAiResponse(data.result);
      } else {
        alert(data.error || 'AI क्वेरी अयशस्वी.');
      }
    } catch {
      alert('AI कडून प्रतिसाद मिळाला नाही.');
    } finally {
      setAiLoading(false);
    }
  };

  // Submit WhatsApp Simulator Message
  const handleSimulateWhatsApp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!simMessage.trim()) return;
    setSimLoading(true);
    try {
      const res = await fetch('/api/whatsapp/webhook', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fromPhone: simPhone,
          senderName: simName,
          message: simMessage,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setSimMessage('');
        const waRes = await fetch('/api/whatsapp/webhook').then((r) => r.json());
        if (waRes.history) setSimHistory(waRes.history);
      }
    } catch {
      alert('WhatsApp सिम्युलेटर त्रुटी.');
    } finally {
      setSimLoading(false);
    }
  };

  // Clean Production DB / Reset Demo
  const handleDatabaseReset = async (action: 'CLEAN_PRODUCTION' | 'RESET_DEMO') => {
    const confirmMsg =
      action === 'CLEAN_PRODUCTION'
        ? '⚠️ तुम्ही खात्रीशीर आहात? सर्व डेमो डेटा हटवला जाईल आणि स्वच्छ उत्पादन डेटाबेस तयार होईल.'
        : 'डेमो डेटा पुन्हा रीसेट करायचा आहे का?';
    if (!confirm(confirmMsg)) return;

    try {
      const res = await fetch('/api/admin/demo-reset', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action }),
      });
      const data = await res.json();
      if (data.success) {
        alert(data.message);
        refreshData();
      } else {
        alert(data.error || 'डेटाबेस रीसेट अयशस्वी.');
      }
    } catch {
      alert('त्रुटी आली.');
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 text-slate-900 pb-20">
      {/* Top Header & Role Switcher */}
      <div className="bg-slate-900 text-white border-b border-slate-800 px-4 sm:px-8 py-3.5">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-agro-700 flex items-center justify-center text-white shadow-agro">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="font-extrabold text-base sm:text-lg">
                  श्री कृष्ण ॲग्रो सर्व्हिसेस — ERP Operating System
                </h1>
                <span className="bg-emerald-500/20 text-emerald-300 text-[10px] px-2 py-0.5 rounded font-bold border border-emerald-500/30">
                  {isDemoActive ? '🟡 DEMO MODE' : '🟢 PRODUCTION MODE'}
                </span>
              </div>
              <p className="text-xs text-slate-400">
                सिन्नर, नाशिक • लॉग इन: <strong>{currentUser.name}</strong> ({currentRole})
              </p>
            </div>
          </div>

          {/* Role Switcher Toolbar */}
          <div className="flex items-center gap-2 bg-slate-800 p-1 rounded-xl text-xs font-bold">
            <span className="px-2 text-slate-400 flex items-center gap-1">
              <UserCheck className="w-3.5 h-3.5 text-emerald-400" />
              <span>Role:</span>
            </span>
            {(['OWNER', 'MANAGER', 'AGRONOMIST', 'CASHIER', 'ACCOUNTANT'] as UserRole[]).map((r) => (
              <button
                key={r}
                onClick={() => handleRoleChange(r)}
                className={`px-2.5 py-1 rounded-lg transition ${
                  currentRole === r
                    ? 'bg-agro-700 text-white shadow-sm'
                    : 'text-slate-300 hover:text-white hover:bg-slate-700/60'
                }`}
              >
                {r}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main ERP Layout Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 space-y-6">
        {/* Feedback Alert if any */}
        {feedback && (
          <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 px-4 py-2.5 rounded-xl text-xs font-bold flex justify-between items-center shadow-sm">
            <span>{feedback}</span>
            <button onClick={() => setFeedback('')} className="text-emerald-950 font-extrabold">✕</button>
          </div>
        )}

        {/* ------------------------------------------------------------- */}
        {/* TOP KPI OVERVIEW CARDS */}
        {/* ------------------------------------------------------------- */}
        {kpis ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
            <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm space-y-1">
              <p className="text-[11px] font-bold text-slate-500 uppercase">एकूण महसूल (Revenue)</p>
              <p className="text-lg font-extrabold text-slate-900">₹{kpis.totalRevenue.toLocaleString('en-IN')}</p>
              <p className="text-[10px] text-slate-400">रोख: ₹{kpis.cashRevenue} | UPI: ₹{kpis.upiRevenue}</p>
            </div>

            <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm space-y-1">
              <p className="text-[11px] font-bold text-slate-500 uppercase">माल खरेदी खर्च (COGS)</p>
              <p className="text-lg font-extrabold text-slate-700">₹{kpis.totalCOGS.toLocaleString('en-IN')}</p>
              <p className="text-[10px] text-slate-400">ढोबळ नफा: ₹{kpis.grossProfit}</p>
            </div>

            <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm space-y-1">
              <p className="text-[11px] font-bold text-slate-500 uppercase">दुकान खर्च (Expenses)</p>
              <p className="text-lg font-extrabold text-red-600">₹{kpis.totalExpenses.toLocaleString('en-IN')}</p>
              <p className="text-[10px] text-slate-400">भाडे, वीज, ट्रान्सपोर्ट</p>
            </div>

            <div className="bg-emerald-900 text-white p-4 rounded-2xl shadow-sm space-y-1 border border-emerald-800">
              <p className="text-[11px] font-bold text-emerald-300 uppercase">निव्वळ नफा (Net Profit)</p>
              <p className="text-xl font-black text-white">₹{kpis.netProfit.toLocaleString('en-IN')}</p>
              <p className="text-[10px] text-emerald-200">मार्जिन: {kpis.netMarginPercent}%</p>
            </div>

            <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm space-y-1">
              <p className="text-[11px] font-bold text-slate-500 uppercase">शेतकरी उधारी (Khata)</p>
              <p className="text-lg font-extrabold text-amber-700">₹{kpis.creditOutstanding.toLocaleString('en-IN')}</p>
              <p className="text-[10px] text-slate-400">सप्लायर देणे: ₹{kpis.supplierPayables}</p>
            </div>

            <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm space-y-1">
              <p className="text-[11px] font-bold text-slate-500 uppercase">स्टॉक अलर्ट</p>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold bg-amber-100 text-amber-900 px-2 py-0.5 rounded">
                  कमी: {kpis.lowStockCount}
                </span>
                <span className="text-xs font-bold bg-red-100 text-red-900 px-2 py-0.5 rounded">
                  मुदत: {kpis.expiringBatchesCount}
                </span>
              </div>
              <p className="text-[10px] text-slate-400">एकूण माल मूल्य: ₹{kpis.totalInventoryValue.toLocaleString('en-IN')}</p>
            </div>
          </div>
        ) : (
          <div className="bg-amber-50 border border-amber-200 text-amber-900 p-4 rounded-2xl text-xs flex items-center justify-between">
            <span>🔒 नफा व महसूल अहवाल फक्त Owner व Accountant भूमिकेसाठी उपलब्ध आहेत.</span>
            <button onClick={() => handleRoleChange('OWNER')} className="font-bold underline">
              Owner Mode चालू करा
            </button>
          </div>
        )}

        {/* ------------------------------------------------------------- */}
        {/* MASTER ERP NAVIGATION TABS */}
        {/* ------------------------------------------------------------- */}
        <div className="bg-white rounded-2xl p-2 border border-slate-200 shadow-sm flex items-center gap-1.5 overflow-x-auto scrollbar-none text-xs font-bold text-slate-700">
          <button
            onClick={() => setActiveTab('dashboard')}
            className={`px-3.5 py-2 rounded-xl flex items-center gap-1.5 whitespace-nowrap transition ${
              activeTab === 'dashboard' ? 'bg-agro-800 text-white' : 'hover:bg-slate-100'
            }`}
          >
            <TrendingUp className="w-4 h-4" />
            <span>डॅशबोर्ड (Overview)</span>
          </button>

          <button
            onClick={() => setActiveTab('pos')}
            className={`px-3.5 py-2 rounded-xl flex items-center gap-1.5 whitespace-nowrap transition ${
              activeTab === 'pos' ? 'bg-agro-800 text-white' : 'hover:bg-slate-100'
            }`}
          >
            <ShoppingCart className="w-4 h-4" />
            <span>विक्री काऊंटर (POS Sale)</span>
          </button>

          <button
            onClick={() => setActiveTab('inventory')}
            className={`px-3.5 py-2 rounded-xl flex items-center gap-1.5 whitespace-nowrap transition ${
              activeTab === 'inventory' ? 'bg-agro-800 text-white' : 'hover:bg-slate-100'
            }`}
          >
            <Package className="w-4 h-4" />
            <span>स्टॉक व बॅचेस (Inventory)</span>
          </button>

          <button
            onClick={() => setActiveTab('purchases')}
            className={`px-3.5 py-2 rounded-xl flex items-center gap-1.5 whitespace-nowrap transition ${
              activeTab === 'purchases' ? 'bg-agro-800 text-white' : 'hover:bg-slate-100'
            }`}
          >
            <Truck className="w-4 h-4" />
            <span>खरेदी नोंद (Purchases)</span>
          </button>

          <button
            onClick={() => setActiveTab('customers')}
            className={`px-3.5 py-2 rounded-xl flex items-center gap-1.5 whitespace-nowrap transition ${
              activeTab === 'customers' ? 'bg-agro-800 text-white' : 'hover:bg-slate-100'
            }`}
          >
            <Users className="w-4 h-4" />
            <span>शेतकरी उधारी (Khata CRM)</span>
          </button>

          <button
            onClick={() => setActiveTab('quotations')}
            className={`px-3.5 py-2 rounded-xl flex items-center gap-1.5 whitespace-nowrap transition ${
              activeTab === 'quotations' ? 'bg-agro-800 text-white' : 'hover:bg-slate-100'
            }`}
          >
            <FileText className="w-4 h-4" />
            <span>कोटेशन्स (Quotations)</span>
          </button>

          <button
            onClick={() => setActiveTab('expenses')}
            className={`px-3.5 py-2 rounded-xl flex items-center gap-1.5 whitespace-nowrap transition ${
              activeTab === 'expenses' ? 'bg-agro-800 text-white' : 'hover:bg-slate-100'
            }`}
          >
            <DollarSign className="w-4 h-4" />
            <span>दुकान खर्च (Expenses)</span>
          </button>

          <button
            onClick={() => setActiveTab('whatsapp')}
            className={`px-3.5 py-2 rounded-xl flex items-center gap-1.5 whitespace-nowrap transition ${
              activeTab === 'whatsapp' ? 'bg-agro-800 text-white' : 'hover:bg-slate-100'
            }`}
          >
            <MessageCircle className="w-4 h-4" />
            <span>WhatsApp AI हब</span>
          </button>

          <button
            onClick={() => setActiveTab('owner_ai')}
            className={`px-3.5 py-2 rounded-xl flex items-center gap-1.5 whitespace-nowrap transition ${
              activeTab === 'owner_ai' ? 'bg-agro-800 text-white' : 'hover:bg-slate-100'
            }`}
          >
            <Bot className="w-4 h-4" />
            <span>Owner AI असिस्टंट</span>
          </button>

          <button
            onClick={() => setActiveTab('staff')}
            className={`px-3.5 py-2 rounded-xl flex items-center gap-1.5 whitespace-nowrap transition ${
              activeTab === 'staff' ? 'bg-agro-800 text-white' : 'hover:bg-slate-100'
            }`}
          >
            <UserCheck className="w-4 h-4" />
            <span>कर्मचारी व भूमिका (Staff)</span>
          </button>

          <button
            onClick={() => setActiveTab('audit')}
            className={`px-3.5 py-2 rounded-xl flex items-center gap-1.5 whitespace-nowrap transition ${
              activeTab === 'audit' ? 'bg-agro-800 text-white' : 'hover:bg-slate-100'
            }`}
          >
            <History className="w-4 h-4" />
            <span>ऑडिट ट्रेल (Logs)</span>
          </button>

          <button
            onClick={() => setActiveTab('settings')}
            className={`px-3.5 py-2 rounded-xl flex items-center gap-1.5 whitespace-nowrap transition ${
              activeTab === 'settings' ? 'bg-agro-800 text-white' : 'hover:bg-slate-100'
            }`}
          >
            <Settings className="w-4 h-4" />
            <span>ऑनबोर्डिंग व सेटिंग्ज</span>
          </button>
        </div>

        {/* ------------------------------------------------------------- */}
        {/* TAB 1: POS SALES BILLING COUNTER */}
        {/* ------------------------------------------------------------- */}
        {activeTab === 'pos' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            <div className="lg:col-span-8 bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-5">
              <div className="flex justify-between items-center pb-3 border-b border-slate-100">
                <h3 className="font-extrabold text-base text-slate-900 flex items-center gap-2">
                  <ShoppingCart className="w-5 h-5 text-agro-700" />
                  <span>नवीन विक्री बिल तयार करा (POS Billing)</span>
                </h3>
                <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-lg">
                  Billing Operator: {currentUser.name}
                </span>
              </div>

              {/* Customer Selector */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">ग्राहक निवडा / नवीन</label>
                  <select
                    value={posCustomer}
                    onChange={(e) => {
                      const cId = e.target.value;
                      setPosCustomer(cId);
                      const c = customers.find((cust) => cust.id === cId);
                      if (c) {
                        setPosCustomerName(c.name);
                        setPosCustomerPhone(c.phone);
                        setPosCustomerVillage(c.village);
                      } else {
                        setPosCustomerName('');
                      }
                    }}
                    className="w-full border border-slate-300 rounded-lg p-2 bg-white"
                  >
                    <option value="">Walk-in Customer (थेट शेतकरी)</option>
                    {customers.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name} ({c.village}) — उधारी: ₹{c.outstandingBalance}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">नाव</label>
                  <input
                    type="text"
                    value={posCustomerName}
                    onChange={(e) => setPosCustomerName(e.target.value)}
                    placeholder="शेतकऱ्याचे नाव"
                    className="w-full border border-slate-300 rounded-lg p-2"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">मोबाईल</label>
                  <input
                    type="tel"
                    value={posCustomerPhone}
                    onChange={(e) => setPosCustomerPhone(e.target.value)}
                    placeholder="98XXXXXXXX"
                    className="w-full border border-slate-300 rounded-lg p-2"
                  />
                </div>
              </div>

              {/* Items Counter */}
              <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 space-y-3">
                <div className="flex justify-between items-center">
                  <span className="font-bold text-xs text-slate-800">उत्पादने (Product Items)</span>
                  <button
                    type="button"
                    onClick={addPosItem}
                    className="bg-agro-700 hover:bg-agro-800 text-white text-xs font-bold px-3 py-1.5 rounded-lg flex items-center gap-1"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>आयटम जोडा</span>
                  </button>
                </div>

                {posItems.length === 0 ? (
                  <p className="text-xs text-slate-500 py-4 text-center">
                    बिल बनवण्यासाठी &quot;आयटम जोडा&quot; बटणावर क्लिक करा.
                  </p>
                ) : (
                  posItems.map((it, idx) => {
                    const sel = products.find((p) => p.id === it.productId);
                    return (
                      <div
                        key={idx}
                        className="bg-white p-2.5 rounded-xl border border-slate-200 flex flex-wrap sm:flex-nowrap items-center gap-2 text-xs"
                      >
                        <select
                          value={it.productId}
                          onChange={(e) => {
                            const pId = e.target.value;
                            const next = [...posItems];
                            const p = products.find((prod) => prod.id === pId);
                            next[idx].productId = pId;
                            if (p) {
                              next[idx].unitPrice = p.sellingPrice;
                              next[idx].gstRate = p.gstRate;
                            }
                            setPosItems(next);
                          }}
                          className="flex-1 border border-slate-200 rounded p-1.5 bg-white font-medium"
                        >
                          {products.map((p) => (
                            <option key={p.id} value={p.id}>
                              {p.nameMr} ({p.packSize}) — शिल्लक: {p.totalStock} {p.unit}
                            </option>
                          ))}
                        </select>

                        <div className="flex items-center gap-1">
                          <label className="text-[10px] text-slate-500">नग:</label>
                          <input
                            type="number"
                            min="1"
                            max={sel?.totalStock || 100}
                            value={it.quantity}
                            onChange={(e) => {
                              const next = [...posItems];
                              next[idx].quantity = Number(e.target.value);
                              setPosItems(next);
                            }}
                            className="w-14 border border-slate-200 rounded p-1.5 text-center font-bold"
                          />
                        </div>

                        <div className="flex items-center gap-1">
                          <label className="text-[10px] text-slate-500">दर ₹:</label>
                          <input
                            type="number"
                            value={it.unitPrice}
                            onChange={(e) => {
                              const next = [...posItems];
                              next[idx].unitPrice = Number(e.target.value);
                              setPosItems(next);
                            }}
                            className="w-20 border border-slate-200 rounded p-1.5 text-center font-bold"
                          />
                        </div>

                        <span className="font-extrabold text-agro-900 min-w-[70px] text-right">
                          ₹{((it.quantity * it.unitPrice) * (1 + it.gstRate / 100)).toFixed(0)}
                        </span>

                        <button
                          type="button"
                          onClick={() => setPosItems(posItems.filter((_, i) => i !== idx))}
                          className="text-red-500 hover:text-red-700 p-1"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    );
                  })
                )}
              </div>

              {/* Payment Method, Discount & Partial Payment Input */}
              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-3">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">पेमेंट प्रकार (Payment Method)</label>
                    <select
                      value={posPaymentMethod}
                      onChange={(e) => setPosPaymentMethod(e.target.value as any)}
                      className="w-full border border-slate-300 rounded-lg p-2 bg-white font-bold"
                    >
                      <option value="CASH">💵 रोख (Cash)</option>
                      <option value="UPI">📱 UPI / QR Code</option>
                      <option value="BANK_TRANSFER">🏦 बँक ट्रान्सफर</option>
                      <option value="CREDIT">📋 पूर्ण उधारी (Full Credit)</option>
                    </select>
                  </div>
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">सूट / डिस्काउंट ₹</label>
                    <input
                      type="number"
                      value={posDiscount}
                      onChange={(e) => setPosDiscount(Number(e.target.value))}
                      className="w-full border border-slate-300 rounded-lg p-2"
                      placeholder="0"
                    />
                  </div>
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">आता जमा केलेली रक्कम ₹ (Paid Now)</label>
                    <input
                      type="number"
                      value={posPaidAmount !== undefined ? posPaidAmount : computePosTotal()}
                      onChange={(e) => setPosPaidAmount(Number(e.target.value))}
                      className="w-full border border-slate-300 rounded-lg p-2 font-bold text-agro-900 bg-white"
                      placeholder="उदा. अर्धी रक्कम किंवा पूर्ण रक्कम"
                    />
                  </div>
                </div>

                {/* Live Split Calculation & Khata Balance Display */}
                {(() => {
                  const total = computePosTotal();
                  const paid = posPaidAmount !== undefined ? posPaidAmount : (posPaymentMethod === 'CREDIT' ? 0 : total);
                  const remaining = Math.max(0, total - paid);
                  return (
                    <div className="pt-2 border-t border-slate-200 grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs">
                      <div className="bg-white p-2.5 rounded-xl border border-slate-200">
                        <span className="text-slate-500 block text-[11px]">एकूण बिल रक्कम:</span>
                        <strong className="text-sm text-slate-900">₹{total.toLocaleString('en-IN')}</strong>
                      </div>
                      <div className="bg-emerald-50 p-2.5 rounded-xl border border-emerald-200">
                        <span className="text-emerald-700 block text-[11px]">आता जमा (Paid):</span>
                        <strong className="text-sm text-emerald-800">₹{paid.toLocaleString('en-IN')}</strong>
                      </div>
                      <div className={`p-2.5 rounded-xl border ${remaining > 0 ? 'bg-amber-50 border-amber-300' : 'bg-slate-100 border-slate-200'}`}>
                        <span className="text-slate-600 block text-[11px]">शिल्लक उधारी (Khata Balance):</span>
                        <strong className={`text-sm ${remaining > 0 ? 'text-amber-900 font-extrabold' : 'text-slate-700'}`}>
                          ₹{remaining.toLocaleString('en-IN')}
                        </strong>
                        {remaining > 0 && (
                          <span className="block text-[10px] text-amber-800 font-medium mt-0.5">
                            👉 ही रक्कम शेतकऱ्याच्या खात्यात नोंदवली जाईल.
                          </span>
                        )}
                      </div>
                    </div>
                  );
                })()}
              </div>

              <div className="flex flex-col sm:flex-row justify-between items-center gap-3 pt-2">
                <span className="font-extrabold text-sm text-slate-700">
                  निवडलेला शेतकरी: <span className="text-agro-800 font-bold">{posCustomerName || 'Walk-in Farmer'}</span>
                </span>
                <button
                  type="button"
                  onClick={handlePosSale}
                  className="w-full sm:w-auto bg-gradient-to-r from-agro-700 to-agro-900 text-white font-bold px-6 py-3 rounded-xl hover:from-agro-800 hover:to-agro-950 transition shadow-agro flex items-center justify-center gap-2 text-xs"
                >
                  <Printer className="w-4 h-4" />
                  <span>बिल पूर्ण करा व पावती प्रिंट करा</span>
                </button>
              </div>
            </div>

            {/* Right: Recent Invoices List */}
            <div className="lg:col-span-4 bg-white rounded-3xl p-5 border border-slate-200 shadow-sm space-y-4">
              <h4 className="font-bold text-sm text-slate-900 pb-2 border-b border-slate-100">
                नुकतीच झालेली बिले (Recent Invoices)
              </h4>
              <div className="space-y-2.5 max-h-96 overflow-y-auto">
                {sales.map((s) => (
                  <div key={s.id} className="bg-slate-50 p-3 rounded-xl border border-slate-200 text-xs space-y-1">
                    <div className="flex justify-between font-bold">
                      <span>{s.invoiceNumber}</span>
                      <span className="text-agro-800">₹{s.grandTotal}</span>
                    </div>
                    <div className="flex justify-between text-[11px] text-slate-500">
                      <span>{s.customerName}</span>
                      <span className="font-semibold text-emerald-700">{s.paymentMethod} ({s.paymentStatus})</span>
                    </div>
                    <div className="pt-1 flex justify-end">
                      <a
                        href={`/api/sales/${s.id}?format=html`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-agro-700 hover:underline font-bold text-[11px] flex items-center gap-1"
                      >
                        <Printer className="w-3 h-3" />
                        <span>पावती प्रिंट</span>
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ------------------------------------------------------------- */}
        {/* TAB 2: INVENTORY & BATCH / EXPIRY MANAGEMENT */}
        {/* ------------------------------------------------------------- */}
        {activeTab === 'inventory' && (
          <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
              <div>
                <h3 className="font-extrabold text-lg text-slate-900 flex items-center gap-2">
                  <Package className="w-5 h-5 text-agro-700" />
                  <span>केंद्रीय इन्व्हेंटरी, बॅचेस व एक्सपायरी ट्रॅकिंग</span>
                </h3>
                <p className="text-xs text-slate-500">
                  प्रत्येक स्टॉक बदल अपरिवर्तनीय (Immutable) स्टॉक मूव्हमेंट लेजर द्वारे नोंदवला जातो.
                </p>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-slate-100 text-slate-700 font-bold border-b border-slate-200">
                    <th className="p-3">उत्पादन नाव (Product)</th>
                    <th className="p-3">कंपनी</th>
                    <th className="p-3">पॅकिंग</th>
                    <th className="p-3">बॅच क्र.</th>
                    <th className="p-3">मुदत तारीख (Expiry)</th>
                    <th className="p-3">दर (MRP / Sell)</th>
                    <th className="p-3">उपलब्ध स्टॉक</th>
                    <th className="p-3">स्थिती</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-medium">
                  {products.map((p) => {
                    const batch = p.batches?.[0];
                    const isLow = p.totalStock <= p.minStockLevel;
                    return (
                      <tr key={p.id} className="hover:bg-slate-50">
                        <td className="p-3 font-bold text-slate-900">{p.nameMr}</td>
                        <td className="p-3 text-slate-600">{p.brandName}</td>
                        <td className="p-3">{p.packSize}</td>
                        <td className="p-3 font-mono">{batch?.batchNumber || '-'}</td>
                        <td className="p-3">
                          {batch?.expiryDate ? (
                            <span className="font-mono text-slate-700">{batch.expiryDate}</span>
                          ) : (
                            '-'
                          )}
                        </td>
                        <td className="p-3">
                          <span className="line-through text-slate-400">₹{p.mrp}</span> /{' '}
                          <strong className="text-agro-800">₹{p.sellingPrice}</strong>
                        </td>
                        <td className="p-3 font-extrabold text-slate-900">
                          {p.totalStock} {p.unit}
                        </td>
                        <td className="p-3">
                          {isLow ? (
                            <span className="bg-red-100 text-red-800 text-[10px] font-bold px-2 py-0.5 rounded-full">
                              ⚠️ कमी स्टॉक ({p.minStockLevel})
                            </span>
                          ) : (
                            <span className="bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2 py-0.5 rounded-full">
                              ✅ मुबलक
                            </span>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ------------------------------------------------------------- */}
        {/* TAB 3: PURCHASES & LANDED COST */}
        {/* ------------------------------------------------------------- */}
        {activeTab === 'purchases' && (
          <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-6">
            <div className="flex justify-between items-center pb-3 border-b border-slate-100">
              <div>
                <h3 className="font-extrabold text-lg text-slate-900 flex items-center gap-2">
                  <Truck className="w-5 h-5 text-agro-700" />
                  <span>खरेदी नोंदी व लँडेड कॉस्टिंग (Purchases)</span>
                </h3>
                <p className="text-xs text-slate-500">
                  नवीन मालाची आवक, बॅच नोंद, GST व ट्रान्सपोर्ट खर्च समावेश.
                </p>
              </div>
            </div>

            <div className="space-y-3">
              {purchases.length === 0 ? (
                <p className="text-xs text-slate-500 text-center py-8">खरेदी नोंदी उपलब्ध नाहीत.</p>
              ) : (
                purchases.map((pur) => (
                  <div key={pur.id} className="bg-slate-50 p-4 rounded-2xl border border-slate-200 text-xs space-y-2">
                    <div className="flex justify-between font-bold text-slate-900">
                      <span>इनव्हॉइस: {pur.invoiceNumber} ({pur.supplierName})</span>
                      <span className="text-agro-800 font-extrabold">एकूण: ₹{pur.grandTotal.toLocaleString('en-IN')}</span>
                    </div>
                    <p className="text-slate-500">
                      मालाची किंमत: ₹{pur.subtotal} | GST: ₹{pur.taxAmount} | ट्रान्सपोर्ट: ₹{pur.freightCost} | पेमेंट: {pur.paymentMethod}
                    </p>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {/* ------------------------------------------------------------- */}
        {/* TAB 4: FARMER CRM & KHATA (CREDIT) */}
        {/* ------------------------------------------------------------- */}
        {activeTab === 'customers' && (
          <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-6">
            <div className="flex justify-between items-center pb-3 border-b border-slate-100">
              <div>
                <h3 className="font-extrabold text-lg text-slate-900 flex items-center gap-2">
                  <Users className="w-5 h-5 text-agro-700" />
                  <span>शेतकरी खातेवही व उधारी व्यवस्थापन (Farmer Khata CRM)</span>
                </h3>
                <p className="text-xs text-slate-500">
                  सिन्नर परिसरातील शेतकऱ्यांची पिके, जमीन क्षेत्र व थकबाकी ट्रॅकिंग.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {customers.map((c) => (
                <div key={c.id} className="bg-slate-50 p-5 rounded-2xl border border-slate-200 text-xs space-y-3">
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="font-bold text-sm text-slate-900">{c.name}</h4>
                      <p className="text-slate-500">📍 {c.village}, सिन्नर • 📞 {c.phone}</p>
                    </div>
                    <span
                      className={`font-extrabold px-2 py-0.5 rounded text-[11px] ${
                        c.outstandingBalance > 0 ? 'bg-amber-100 text-amber-900' : 'bg-emerald-100 text-emerald-900'
                      }`}
                    >
                      बाकी: ₹{c.outstandingBalance.toLocaleString('en-IN')}
                    </span>
                  </div>

                  <div className="text-[11px] bg-white p-2.5 rounded-xl border border-slate-200 space-y-1">
                    <p className="font-bold text-slate-700">पिके व क्षेत्र (Crops):</p>
                    {c.crops?.map((cr, idx) => (
                      <p key={idx} className="text-slate-600">
                        • {cr.cropName} ({cr.acreage} एकर)
                      </p>
                    ))}
                  </div>

                  <div className="flex gap-2 pt-1">
                    {c.outstandingBalance > 0 && (
                      <>
                        <button
                          onClick={() => {
                            const amt = prompt(`${c.name} कडून जमा रक्कम टाका (₹):`, `${c.outstandingBalance}`);
                            if (amt) settlePayment(c.id, Number(amt));
                          }}
                          className="flex-1 bg-agro-700 hover:bg-agro-800 text-white font-bold py-1.5 rounded-lg text-center"
                        >
                          पेमेंट जमा करा
                        </button>
                        <a
                          href={`https://wa.me/91${c.phone}?text=${encodeURIComponent(
                            `नमस्कार ${c.name}, श्री कृष्ण ॲग्रो सर्व्हिसेस, सिन्नर कडे आपली ₹${c.outstandingBalance} उधारी शिल्लक आहे. कृपया वेळेवर भरणा करावा. धन्यवाद!`
                          )}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="bg-emerald-600 hover:bg-emerald-700 text-white p-1.5 rounded-lg flex items-center justify-center"
                          title="WhatsApp आठवण पाठवा"
                        >
                          <MessageCircle className="w-4 h-4" />
                        </a>
                      </>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ------------------------------------------------------------- */}
        {/* TAB 5: QUOTATION ENGINE */}
        {/* ------------------------------------------------------------- */}
        {activeTab === 'quotations' && (
          <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-6">
            <div className="flex justify-between items-center pb-3 border-b border-slate-100">
              <div>
                <h3 className="font-extrabold text-lg text-slate-900 flex items-center gap-2">
                  <FileText className="w-5 h-5 text-agro-700" />
                  <span>अधिकृत कोटेशन्स (Quotation Engine)</span>
                </h3>
                <p className="text-xs text-slate-500">
                  युनिक सिरियल क्रमांक (QTN-YYYY-XXXX) व ब्रँडेड A4 PDF निर्मिती.
                </p>
              </div>
            </div>

            <div className="space-y-3">
              {quotations.map((q) => (
                <div key={q.id} className="bg-slate-50 p-4 rounded-2xl border border-slate-200 text-xs flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-sm text-agro-900">{q.quotationNumber}</span>
                      <span className="bg-slate-200 text-slate-700 text-[10px] px-2 py-0.5 rounded font-bold">
                        {q.status}
                      </span>
                    </div>
                    <p className="text-slate-600 mt-1">
                      ग्राहक: <strong>{q.customerName}</strong> ({q.customerPhone}) • {q.customerVillage || 'सिन्नर'}
                    </p>
                    <p className="text-slate-400 text-[11px]">
                      तयार केले: {q.createdByName} • मुदत: {new Date(q.validUntil).toLocaleDateString('en-IN')}
                    </p>
                  </div>

                  <div className="flex items-center gap-3">
                    <span className="text-base font-extrabold text-slate-900">
                      ₹{q.grandTotal.toLocaleString('en-IN')}
                    </span>
                    <a
                      href={`/api/quotations/${q.id}?format=html`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="bg-agro-700 hover:bg-agro-800 text-white font-bold px-3 py-1.5 rounded-lg flex items-center gap-1"
                    >
                      <Printer className="w-3.5 h-3.5" />
                      <span>पावती PDF</span>
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ------------------------------------------------------------- */}
        {/* TAB 6: EXPENSES & NET PROFIT ENGINE */}
        {/* ------------------------------------------------------------- */}
        {activeTab === 'expenses' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            <div className="lg:col-span-5 bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4">
              <h3 className="font-extrabold text-base text-slate-900 flex items-center gap-2 pb-2 border-b border-slate-100">
                <DollarSign className="w-5 h-5 text-red-600" />
                <span>दुकान खर्च नोंदवा (Record Expense)</span>
              </h3>

              <form onSubmit={handleRecordExpense} className="space-y-3 text-xs">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">खर्च प्रकार (Category)</label>
                  <select
                    value={expCategory}
                    onChange={(e) => setExpCategory(e.target.value)}
                    className="w-full border border-slate-300 rounded-lg p-2 bg-white"
                  >
                    <option value="RENT">दुकान भाडे (Rent)</option>
                    <option value="ELECTRICITY">वीज बिल (Electricity)</option>
                    <option value="SALARY">कर्मचारी पगार (Salary)</option>
                    <option value="TRANSPORT">ट्रान्सपोर्ट / हमाली (Transport)</option>
                    <option value="MARKETING">मार्केटिंग व जाहिरात</option>
                    <option value="MAINTENANCE">दुकान मेंटेनन्स</option>
                    <option value="OFFICE">स्टेशनरी व चहापान</option>
                    <option value="OTHER">इतर किरकोळ खर्च</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">रक्कम ₹</label>
                  <input
                    type="number"
                    required
                    value={expAmount || ''}
                    onChange={(e) => setExpAmount(Number(e.target.value))}
                    placeholder="उदा. 2500"
                    className="w-full border border-slate-300 rounded-lg p-2 font-bold"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">देणारा / विक्रेता (Vendor)</label>
                  <input
                    type="text"
                    value={expVendor}
                    onChange={(e) => setExpVendor(e.target.value)}
                    placeholder="उदा. MSEDCL / ट्रान्सपोर्ट ऑपरेटर"
                    className="w-full border border-slate-300 rounded-lg p-2"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">पेमेंट माध्यम</label>
                  <select
                    value={expMethod}
                    onChange={(e) => setExpMethod(e.target.value as any)}
                    className="w-full border border-slate-300 rounded-lg p-2 bg-white"
                  >
                    <option value="CASH">रोख (Cash)</option>
                    <option value="UPI">UPI</option>
                    <option value="BANK_TRANSFER">बँक ट्रान्सफर</option>
                  </select>
                </div>

                <button
                  type="submit"
                  className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-2.5 rounded-xl transition"
                >
                  खर्च नोंदवा
                </button>
              </form>
            </div>

            <div className="lg:col-span-7 bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4">
              <h3 className="font-extrabold text-base text-slate-900 pb-2 border-b border-slate-100">
                खर्चाचा इतिहास (Expense Logs)
              </h3>
              <div className="space-y-2 max-h-96 overflow-y-auto">
                {expenses.map((e) => (
                  <div key={e.id} className="bg-slate-50 p-3 rounded-xl border border-slate-200 text-xs flex justify-between items-center">
                    <div>
                      <p className="font-bold text-slate-800">{e.category} — {e.vendor}</p>
                      <p className="text-slate-400 text-[11px]">{new Date(e.expenseDate).toLocaleDateString('en-IN')} • नोंद: {e.recordedByName}</p>
                    </div>
                    <span className="font-extrabold text-red-600 text-sm">
                      - ₹{e.amount.toLocaleString('en-IN')}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ------------------------------------------------------------- */}
        {/* TAB 7: WHATSAPP AI ASSISTANT SIMULATOR */}
        {/* ------------------------------------------------------------- */}
        {activeTab === 'whatsapp' && (
          <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-6">
            <div className="border-b border-slate-100 pb-3">
              <h3 className="font-extrabold text-lg text-slate-900 flex items-center gap-2">
                <MessageCircle className="w-5 h-5 text-emerald-600" />
                <span>WhatsApp AI असिस्टंट - लाइव्ह सिम्युलेटर (Live Sandbox)</span>
              </h3>
              <p className="text-xs text-slate-500">
                शेतकऱ्यांनी विचारलेल्या प्रश्नांना AI कडून नियंत्रित डेटाबेस टूल्सद्वारे मिळणारी अचूक उत्तरे तपासा.
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              {/* Simulator Input */}
              <div className="lg:col-span-5 bg-slate-50 p-5 rounded-2xl border border-slate-200 space-y-4 text-xs">
                <h4 className="font-bold text-slate-900">मेसेज पाठवा (Inbound Simulation)</h4>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">शेतकरी नाव</label>
                  <input
                    type="text"
                    value={simName}
                    onChange={(e) => setSimName(e.target.value)}
                    className="w-full border border-slate-300 rounded-lg p-2 bg-white"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">शेतकरी मोबाईल</label>
                  <input
                    type="tel"
                    value={simPhone}
                    onChange={(e) => setSimPhone(e.target.value)}
                    className="w-full border border-slate-300 rounded-lg p-2 bg-white font-mono"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">व्हॉट्सॲप मेसेज</label>
                  <textarea
                    rows={3}
                    value={simMessage}
                    onChange={(e) => setSimMessage(e.target.value)}
                    placeholder="उदा. १९:१९:१९ चे दर काय आहेत?"
                    className="w-full border border-slate-300 rounded-lg p-2 bg-white"
                  />
                </div>

                <div className="flex flex-wrap gap-1.5 pt-1">
                  <span className="text-[10px] text-slate-500 block w-full">नमुना प्रश्न:</span>
                  <button
                    type="button"
                    onClick={() => setSimMessage('१९:१९:१९ आणि नॅटिव्हो चे दर काय आहेत?')}
                    className="bg-white border border-slate-200 px-2 py-1 rounded text-[10px] hover:bg-slate-100"
                  >
                    दर विचारणे
                  </button>
                  <button
                    type="button"
                    onClick={() => setSimMessage('दुकान कुठे आहे आणि वेळ काय आहे?')}
                    className="bg-white border border-slate-200 px-2 py-1 rounded text-[10px] hover:bg-slate-100"
                  >
                    पत्ता व वेळ
                  </button>
                  <button
                    type="button"
                    onClick={() => setSimMessage('कांदा करप्यासाठी औषध सांगा')}
                    className="bg-white border border-slate-200 px-2 py-1 rounded text-[10px] hover:bg-slate-100"
                  >
                    तज्ञ सल्ला
                  </button>
                </div>

                <button
                  type="button"
                  disabled={simLoading}
                  onClick={handleSimulateWhatsApp}
                  className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-2.5 rounded-xl transition flex items-center justify-center gap-1.5"
                >
                  <Send className="w-4 h-4" />
                  <span>{simLoading ? 'प्रक्रिया चालू आहे...' : 'मेसेज पाठवा (Run Simulator)'}</span>
                </button>
              </div>

              {/* Chat Stream Screen */}
              <div className="lg:col-span-7 bg-slate-900 text-white p-5 rounded-2xl border border-slate-800 space-y-3">
                <div className="flex justify-between items-center pb-2 border-b border-slate-800 text-xs">
                  <span className="text-emerald-400 font-bold">WhatsApp Live Conversation Stream</span>
                  <span className="text-slate-400 text-[10px]">{simHistory.length} मेसेज</span>
                </div>

                <div className="h-80 overflow-y-auto space-y-3 pr-1 text-xs">
                  {simHistory.map((m, idx) => (
                    <div
                      key={idx}
                      className={`flex ${m.direction === 'INBOUND' ? 'justify-start' : 'justify-end'}`}
                    >
                      <div
                        className={`max-w-[85%] rounded-2xl p-3 whitespace-pre-line leading-relaxed ${
                          m.direction === 'INBOUND'
                            ? 'bg-slate-800 text-slate-100 rounded-bl-none border border-slate-700'
                            : 'bg-emerald-800 text-white rounded-br-none'
                        }`}
                      >
                        <p className="text-[10px] font-bold text-emerald-300 mb-1">
                          {m.direction === 'INBOUND' ? `👤 ${m.senderName} (${m.phone})` : '🤖 Shri Krishna Agro AI'}
                        </p>
                        <p>{m.text}</p>
                        {m.toolUsed && (
                          <span className="block text-[9px] mt-1.5 text-emerald-200 bg-emerald-950/60 px-2 py-0.5 rounded">
                            🔧 Tool Executed: {m.toolUsed}
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ------------------------------------------------------------- */}
        {/* TAB 8: OWNER AI BUSINESS ASSISTANT */}
        {/* ------------------------------------------------------------- */}
        {activeTab === 'owner_ai' && (
          <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-6">
            <div className="border-b border-slate-100 pb-3">
              <h3 className="font-extrabold text-lg text-slate-900 flex items-center gap-2">
                <Bot className="w-5 h-5 text-agro-700" />
                <span>Owner AI खाजगी बिझनेस असिस्टंट (मराठी + English)</span>
              </h3>
              <p className="text-xs text-slate-500">
                दुकान मालकांसाठी थेट व्यवसायाच्या विक्री, नफा, कमी स्टॉक व शेतकरी उधारीवर आधारित व्हॉइस/टेक्स्ट विश्लेषण.
              </p>
            </div>

            <form onSubmit={handleOwnerAI} className="space-y-3">
              <div className="relative">
                <input
                  type="text"
                  value={aiQuery}
                  onChange={(e) => setAiQuery(e.target.value)}
                  placeholder="उदा. आजची विक्री किती? / कोणता माल कमी आहे? / या महिन्याचा नफा दाखव..."
                  className="w-full pl-4 pr-24 py-3.5 border border-slate-300 rounded-2xl text-xs sm:text-sm focus:ring-2 focus:ring-agro-600 focus:outline-none shadow-sm"
                />
                <button
                  type="submit"
                  disabled={aiLoading || !aiQuery.trim()}
                  className="absolute right-2 top-2 bottom-2 bg-agro-700 hover:bg-agro-800 text-white font-bold px-4 rounded-xl text-xs transition flex items-center gap-1"
                >
                  <Sparkles className="w-4 h-4" />
                  <span>{aiLoading ? 'शोधत आहे...' : 'विचारा'}</span>
                </button>
              </div>

              {/* Sample Quick Query Buttons */}
              <div className="flex flex-wrap gap-2 text-xs font-semibold text-slate-600">
                <span>नमुना प्रश्न:</span>
                <button
                  type="button"
                  onClick={() => setAiQuery('आजची विक्री किती झाली?')}
                  className="bg-slate-100 hover:bg-slate-200 px-3 py-1 rounded-lg text-slate-800"
                >
                  आजची विक्री किती?
                </button>
                <button
                  type="button"
                  onClick={() => setAiQuery('कोणता माल संपत आला आहे?')}
                  className="bg-slate-100 hover:bg-slate-200 px-3 py-1 rounded-lg text-slate-800"
                >
                  कमी स्टॉक रिपोर्ट
                </button>
                <button
                  type="button"
                  onClick={() => setAiQuery('निव्वळ नफा आणि मार्जिन किती आहे?')}
                  className="bg-slate-100 hover:bg-slate-200 px-3 py-1 rounded-lg text-slate-800"
                >
                  नफा व तोटा
                </button>
                <button
                  type="button"
                  onClick={() => setAiQuery('शेतकऱ्यांची उधारी किती बाकी आहे?')}
                  className="bg-slate-100 hover:bg-slate-200 px-3 py-1 rounded-lg text-slate-800"
                >
                  शेतकरी उधारी
                </button>
              </div>
            </form>

            {/* AI Response Card */}
            {aiResponse && (
              <div className="bg-emerald-950 text-white p-6 rounded-2xl border border-emerald-800 shadow-lg space-y-4 animate-in fade-in duration-200">
                <div className="flex justify-between items-center border-b border-emerald-800 pb-2">
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-5 h-5 text-amber-400" />
                    <span className="font-bold text-sm text-emerald-200">AI बिझनेस उत्तर (Verified DB Tool)</span>
                  </div>
                  <span className="text-[10px] bg-emerald-900 text-emerald-300 px-2 py-0.5 rounded font-mono">
                    Tool: {aiResponse.toolUsed}
                  </span>
                </div>

                <div className="text-xs sm:text-sm whitespace-pre-line leading-relaxed text-emerald-50">
                  {aiResponse.answerMr}
                </div>
              </div>
            )}
          </div>
        )}

        {/* ------------------------------------------------------------- */}
        {/* TAB 9: STAFF & ROLE MANAGEMENT */}
        {/* ------------------------------------------------------------- */}
        {activeTab === 'staff' && (
          <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-6">
            <div className="flex justify-between items-center pb-3 border-b border-slate-100">
              <div>
                <h3 className="font-extrabold text-lg text-slate-900 flex items-center gap-2">
                  <UserCheck className="w-5 h-5 text-agro-700" />
                  <span>कर्मचारी खाते व भूमिका वाटप (Staff & RBAC)</span>
                </h3>
                <p className="text-xs text-slate-500">
                  मालक (Owner) द्वारे नियंत्रित कर्मचारी खाती व अधिकार वाटप.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {staff.map((s) => (
                <div key={s.id} className="bg-slate-50 p-4 rounded-2xl border border-slate-200 text-xs space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="font-bold text-sm text-slate-900">{s.name}</span>
                    <span className="bg-agro-800 text-white font-bold text-[10px] px-2 py-0.5 rounded">
                      {s.role}
                    </span>
                  </div>
                  <p className="text-slate-600">📞 {s.phone} • {s.email || 'N/A'}</p>
                  <p className="text-slate-500 text-[11px]">पात्रता: {s.qualification || 'कृषी सल्लागार'}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ------------------------------------------------------------- */}
        {/* TAB 10: SECURITY AUDIT TRAIL */}
        {/* ------------------------------------------------------------- */}
        {activeTab === 'audit' && (
          <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-6">
            <div className="flex justify-between items-center pb-3 border-b border-slate-100">
              <div>
                <h3 className="font-extrabold text-lg text-slate-900 flex items-center gap-2">
                  <History className="w-5 h-5 text-agro-700" />
                  <span>अपरिवर्तनीय सुरक्षा ऑडिट ट्रेल (Security Audit Logs)</span>
                </h3>
                <p className="text-xs text-slate-500">
                  प्रत्येक लॉगिन, विक्री, स्टॉक बदल व सेटिंग्ज बदलांची स्वयंचलित नोंद.
                </p>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-slate-100 text-slate-700 font-bold border-b border-slate-200">
                    <th className="p-3">वेळ (Timestamp)</th>
                    <th className="p-3">वापरकर्ता (User)</th>
                    <th className="p-3">क्रिया (Action)</th>
                    <th className="p-3">घटक (Entity)</th>
                    <th className="p-3">तपशील (Data)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-medium">
                  {auditLogs.map((log) => (
                    <tr key={log.id} className="hover:bg-slate-50">
                      <td className="p-3 font-mono text-slate-500">
                        {new Date(log.createdAt).toLocaleTimeString('en-IN')}
                      </td>
                      <td className="p-3">
                        <strong>{log.userName}</strong> ({log.userRole})
                      </td>
                      <td className="p-3 font-bold text-agro-800">{log.action}</td>
                      <td className="p-3 font-mono text-slate-600">{log.entity}</td>
                      <td className="p-3 font-mono text-[11px] text-slate-600 max-w-xs truncate">
                        {log.newData || '-'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ------------------------------------------------------------- */}
        {/* TAB 11: ONBOARDING SETUP WIZARD & SETTINGS */}
        {/* ------------------------------------------------------------- */}
        {activeTab === 'settings' && profile && (
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-8">
            <div className="flex justify-between items-center pb-4 border-b border-slate-100">
              <div>
                <h3 className="font-extrabold text-xl text-slate-900 flex items-center gap-2">
                  <Settings className="w-6 h-6 text-agro-700" />
                  <span>दुकान ऑनबोर्डिंग व व्यवसाय सेटिंग्ज (Business Setup Wizard)</span>
                </h3>
                <p className="text-xs text-slate-500">
                  परवाने, बँक तपशील, GST माहिती आणि स्वच्छ उत्पादन डेटाबेस व्यवस्थापन.
                </p>
              </div>
            </div>

            {/* Business Information Checklist */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs">
              <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200 space-y-3">
                <h4 className="font-bold text-sm text-slate-900">व्यवसाय व परवाना माहिती</h4>
                <div>
                  <label className="block text-slate-600 mb-1">दुकान नाव</label>
                  <input
                    type="text"
                    value={profile.displayName}
                    onChange={(e) => setProfile({ ...profile, displayName: e.target.value })}
                    className="w-full border border-slate-300 rounded p-2 bg-white font-bold"
                  />
                </div>
                <div>
                  <label className="block text-slate-600 mb-1">GSTIN</label>
                  <input
                    type="text"
                    value={profile.gstin}
                    onChange={(e) => setProfile({ ...profile, gstin: e.target.value })}
                    className="w-full border border-slate-300 rounded p-2 bg-white font-mono"
                  />
                </div>
                <div>
                  <label className="block text-slate-600 mb-1">खत परवाना क्र. (Fertilizer License)</label>
                  <input
                    type="text"
                    value={profile.fertilizerLicense}
                    onChange={(e) => setProfile({ ...profile, fertilizerLicense: e.target.value })}
                    className="w-full border border-slate-300 rounded p-2 bg-white font-mono"
                  />
                </div>
                <div>
                  <label className="block text-slate-600 mb-1">बियाणे परवाना क्र. (Seed License)</label>
                  <input
                    type="text"
                    value={profile.seedLicense}
                    onChange={(e) => setProfile({ ...profile, seedLicense: e.target.value })}
                    className="w-full border border-slate-300 rounded p-2 bg-white font-mono"
                  />
                </div>
              </div>

              <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200 space-y-3">
                <h4 className="font-bold text-sm text-slate-900">बँक व UPI पेमेंट तपशील</h4>
                <div>
                  <label className="block text-slate-600 mb-1">UPI VPA ID</label>
                  <input
                    type="text"
                    value={profile.upiId}
                    onChange={(e) => setProfile({ ...profile, upiId: e.target.value })}
                    className="w-full border border-slate-300 rounded p-2 bg-white font-bold text-agro-800"
                  />
                </div>
                <div>
                  <label className="block text-slate-600 mb-1">बँक नाव व शाखा</label>
                  <input
                    type="text"
                    value={`${profile.bankName} (${profile.bankBranch})`}
                    onChange={(e) => setProfile({ ...profile, bankName: e.target.value })}
                    className="w-full border border-slate-300 rounded p-2 bg-white"
                  />
                </div>
                <div>
                  <label className="block text-slate-600 mb-1">खाते क्रमांक व IFSC</label>
                  <input
                    type="text"
                    value={`${profile.bankAccountNo} • IFSC: ${profile.bankIfsc}`}
                    onChange={(e) => setProfile({ ...profile, bankAccountNo: e.target.value })}
                    className="w-full border border-slate-300 rounded p-2 bg-white font-mono"
                  />
                </div>
              </div>
            </div>

            {/* Data Clean / Demo Reset Control */}
            <div className="bg-amber-50 border border-amber-200 p-5 rounded-2xl space-y-3 text-xs">
              <h4 className="font-bold text-sm text-amber-950 flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-amber-700" />
                <span>डेटाबेस पर्यावरण व्यवस्थापन (Demo vs. Production Database)</span>
              </h4>
              <p className="text-amber-900 leading-relaxed">
                डेव्हलपमेंट व QA चाचण्या पूर्ण झाल्यावर खऱ्या दुकान सुरूवातीसाठी खालील &quot;स्वच्छ उत्पादन डेटाबेस सुरू करा&quot; बटण दाबा.
              </p>
              <div className="flex flex-wrap gap-3 pt-1">
                <button
                  type="button"
                  onClick={() => handleDatabaseReset('CLEAN_PRODUCTION')}
                  className="bg-red-700 hover:bg-red-800 text-white font-bold px-4 py-2 rounded-xl transition"
                >
                  🚀 स्वच्छ उत्पादन डेटाबेस सुरू करा (Purge All Demo Data)
                </button>
                <button
                  type="button"
                  onClick={() => handleDatabaseReset('RESET_DEMO')}
                  className="bg-white border border-slate-300 text-slate-800 font-bold px-4 py-2 rounded-xl hover:bg-slate-50 transition"
                >
                  🔄 सिन्नर डेमो डेटा पुन्हा लोड करा (Restore Demo Dataset)
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
