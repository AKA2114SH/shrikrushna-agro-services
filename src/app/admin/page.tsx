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
  Edit3,
  Search,
  Eye,
  Check,
  Calendar,
  Layers,
  Sprout,
  ArrowDownRight,
  ArrowUpRight,
  Download,
  Database,
  CloudUpload,
  UserCheck,
} from 'lucide-react';
import store, {
  Product,
  Customer,
  Supplier,
  Sale,
  Purchase,
  Quotation,
  Expense,
  StockMovement,
  BusinessProfile,
  INITIAL_PRODUCTS,
  INITIAL_CUSTOMERS,
  INITIAL_CATEGORIES,
  INITIAL_BRANDS,
} from '@/lib/store';

// Registered Admin Users (Strict Max 2 Users Limit)
interface AdminUser {
  id: string;
  name: string;
  phone: string;
  email: string;
  pin: string;
  passwordHash: string;
  role: 'OWNER' | 'PARTNER';
}

const DEFAULT_ADMIN_USERS: AdminUser[] = [
  {
    id: 'adm-1',
    name: 'Akash Khatale (मुख्य मालक / Solutions Architect)',
    phone: '9373873065',
    email: 'akash@shrikrishnaagro.in',
    pin: '9373',
    passwordHash: 'admin@shrikrishna',
    role: 'OWNER',
  },
  {
    id: 'adm-2',
    name: 'Shubham Gamane (B.Sc Agri तज्ञ व भागीदार)',
    phone: '8605620843',
    email: 'shubham@shrikrishnaagro.in',
    pin: '8605',
    passwordHash: 'shubham@agro',
    role: 'PARTNER',
  },
];

export default function AdminPage() {
  const { t } = useLanguage();

  // Authentication State — Strict Max 2 Admin Users
  const [adminUsers, setAdminUsers] = useState<AdminUser[]>(DEFAULT_ADMIN_USERS);
  const [activeAdmin, setActiveAdmin] = useState<AdminUser | null>(DEFAULT_ADMIN_USERS[0]);
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState<boolean>(true);
  
  // Login Form State
  const [loginIdentifier, setLoginIdentifier] = useState<string>('9373873065');
  const [loginSecret, setLoginSecret] = useState<string>('9373');
  const [authError, setAuthError] = useState<string>('');

  // Active Module Tab
  const [activeTab, setActiveTab] = useState<
    | 'dashboard'
    | 'pos'
    | 'inventory'
    | 'purchases'
    | 'customers'
    | 'quotations'
    | 'expenses'
    | 'financials'
    | 'backup'
    | 'whatsapp'
    | 'owner_ai'
  >('dashboard');

  // Master Data State — Pre-loaded from store for 100% offline & GitHub Pages support
  const [kpis, setKpis] = useState<any>(() => store.getFinancialKPIs());
  const [products, setProducts] = useState<Product[]>(() => store.getProducts());
  const [customers, setCustomers] = useState<Customer[]>(() => store.getCustomers());
  const [suppliers, setSuppliers] = useState<Supplier[]>(() => store.getSuppliers());
  const [sales, setSales] = useState<Sale[]>(() => store.getSales());
  const [purchases, setPurchases] = useState<Purchase[]>(() => store.getPurchases());
  const [quotations, setQuotations] = useState<Quotation[]>(() => store.getQuotations());
  const [expenses, setExpenses] = useState<Expense[]>(() => store.getExpenses());
  const [movements, setMovements] = useState<StockMovement[]>(() => store.getStockMovements());
  const [profile, setProfile] = useState<BusinessProfile | null>(() => store.getProfile());
  const [feedback, setFeedback] = useState<string>('');

  // POS Billing Form State
  const [posCustomer, setPosCustomer] = useState<string>('cust-1');
  const [posCustomerName, setPosCustomerName] = useState<string>('Babasaheb Deshmukh');
  const [posCustomerPhone, setPosCustomerPhone] = useState<string>('9822114477');
  const [posCustomerVillage, setPosCustomerVillage] = useState<string>('मुसळगाव (Musalgaon)');
  const [posItems, setPosItems] = useState<
    Array<{ productId: string; quantity: number; unitPrice: number; gstRate: number }>
  >([
    { productId: 'prod-1', quantity: 2, unitPrice: 190, gstRate: 5 },
    { productId: 'prod-9', quantity: 1, unitPrice: 760, gstRate: 18 },
  ]);
  const [posDiscount, setPosDiscount] = useState<number>(0);
  const [posPaymentMethod, setPosPaymentMethod] = useState<'CASH' | 'UPI' | 'BANK_TRANSFER' | 'CREDIT'>('CASH');
  const [posPaidAmount, setPosPaidAmount] = useState<number>(500);

  // Add/Edit Product Modal State
  const [productModalOpen, setProductModalOpen] = useState<boolean>(false);
  const [editingProductId, setEditingProductId] = useState<string | null>(null);
  const [pNameMr, setPNameMr] = useState<string>('');
  const [pNameEn, setPNameEn] = useState<string>('');
  const [pCategoryId, setPCategoryId] = useState<string>('cat-1');
  const [pBrandName, setPBrandName] = useState<string>('Mahadhan');
  const [pPackSize, setPPackSize] = useState<string>('1 Kg Bag');
  const [pUnit, setPUnit] = useState<string>('Kg');
  const [pSellingPrice, setPSellingPrice] = useState<number>(200);
  const [pPurchasePrice, setPPurchasePrice] = useState<number>(160);
  const [pGstRate, setPGstRate] = useState<number>(5);
  const [pInitialStock, setPInitialStock] = useState<number>(50);
  const [pMinStock, setPMinStock] = useState<number>(10);
  const [pTechnicalName, setPTechnicalName] = useState<string>('');
  const [pTargetCrops, setPTargetCrops] = useState<string>('कांदा, द्राक्ष, भाजीपाला');
  const [pDosageGuide, setPDosageGuide] = useState<string>('५ ग्रॅम प्रति लिटर पाणी');
  const [pBatchNo, setPBatchNo] = useState<string>('BATCH-2026-01');
  const [pExpiryDate, setPExpiryDate] = useState<string>('2027-12-31');

  // Customer Payment Collection Modal
  const [paymentModalOpen, setPaymentModalOpen] = useState<boolean>(false);
  const [selectedKhataCustomer, setSelectedKhataCustomer] = useState<Customer | null>(null);
  const [collectAmount, setCollectAmount] = useState<number>(0);
  const [collectNotes, setCollectNotes] = useState<string>('');

  // Purchase Entry Form State
  const [purSupplier, setPurSupplier] = useState<string>('sup-1');
  const [purInvoice, setPurInvoice] = useState<string>('INV-DEALER-2026');
  const [purItems, setPurItems] = useState<
    Array<{
      productId: string;
      batchNumber: string;
      mfgDate: string;
      expiryDate: string;
      quantity: number;
      unitCost: number;
      gstRate: number;
    }>
  >([
    {
      productId: 'prod-1',
      batchNumber: 'MDH-2026-NEW',
      mfgDate: '2026-01-10',
      expiryDate: '2028-01-09',
      quantity: 50,
      unitCost: 155,
      gstRate: 5,
    },
  ]);
  const [purFreight, setPurFreight] = useState<number>(250);
  const [purPaidAmount, setPurPaidAmount] = useState<number>(8000);

  // Expense Form State
  const [expCategory, setExpCategory] = useState<any>('RENT');
  const [expAmount, setExpAmount] = useState<number>(12000);
  const [expMethod, setExpMethod] = useState<'CASH' | 'UPI' | 'BANK_TRANSFER'>('BANK_TRANSFER');
  const [expVendor, setExpVendor] = useState<string>('दुकान भाडे (Main Market Sinnar)');
  const [expNotes, setExpNotes] = useState<string>('मासिक दुकान भाडे');

  // Owner AI Query State
  const [aiQuery, setAiQuery] = useState<string>('गेल्या आठवड्यातील कांदा औषधांची विक्री आणि नफा कसा आहे?');
  const [aiResponse, setAiResponse] = useState<any>(null);
  const [aiLoading, setAiLoading] = useState<boolean>(false);

  // WhatsApp Simulator State
  const [simPhone, setSimPhone] = useState<string>('9822114477');
  const [simName, setSimName] = useState<string>('बाबासाहेब देशमुख (Babasaheb)');
  const [simMessage, setSimMessage] = useState<string>('१९:१९:१९ चे काय दर आहेत आणि कांदा फुगवणीसाठी काय औषध देऊ?');
  const [simHistory, setSimHistory] = useState<any[]>([
    {
      role: 'user',
      text: 'नमस्कार, १९:१९:१९ चे काय दर आहेत?',
      timestamp: '१०:१५ AM',
    },
    {
      role: 'assistant',
      text: 'नमस्कार बाबासाहेब! महाधन १९:१९:१९ चा चालू विक्री दर ₹१९० प्रति १ किलो आहे. दुकानात ८५ किलो साठा उपलब्ध आहे. कांदा फुगवणीसाठी महाधन ०:५२:३४ (₹२१०) देखील उपलब्ध आहे.',
      timestamp: '१०:१५ AM',
    },
  ]);
  const [simLoading, setSimLoading] = useState<boolean>(false);

  // Sync state from in-memory singleton store
  const syncStoreData = () => {
    setProducts([...store.getProducts()]);
    setCustomers([...store.getCustomers()]);
    setSuppliers([...store.getSuppliers()]);
    setSales([...store.getSales()]);
    setPurchases([...store.getPurchases()]);
    setQuotations([...store.getQuotations()]);
    setExpenses([...store.getExpenses()]);
    setKpis({ ...store.getFinancialKPIs() });
    setProfile(store.getProfile());
    setMovements([...store.getStockMovements()]);
  };

  useEffect(() => {
    syncStoreData();
  }, []);

  // Secure Admin Login Handler
  const handleAdminLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const idClean = loginIdentifier.trim().toLowerCase();
    const secClean = loginSecret.trim();

    const matchedUser = adminUsers.find(
      (u) =>
        (u.phone === idClean || u.email.toLowerCase() === idClean) &&
        (u.pin === secClean || u.passwordHash === secClean)
    );

    if (matchedUser) {
      setActiveAdmin(matchedUser);
      setIsAdminAuthenticated(true);
      setAuthError('');
      setFeedback(`✅ स्वागत आहे, ${matchedUser.name}!`);
    } else {
      setAuthError('❌ चुकीचा मोबाईल नंबर किंवा पासवर्ड/पिन. फक्त अधिकृत २ व्यवस्थापक लॉगिन करू शकतात.');
    }
  };

  // --- 1-CLICK BACKUP & EXPORT FUNCTIONS ---
  const downloadCSV = (content: string, filename: string) => {
    const blob = new Blob(['\uFEFF' + content], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', filename);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    setFeedback(`📥 बॅकअप फाईल "${filename}" डाऊनलोड झाली!`);
  };

  const exportKhataBackupCSV = () => {
    const header = 'शेतकरी नाव,मोबाईल नंबर,गाव,पिके,एकूण थकबाकी उधारी (₹)\n';
    const rows = customers
      .map(
        (c) =>
          `"${c.name}","${c.phone}","${c.village}","${c.cropTypes?.join('; ') || 'कांदा'}","${c.outstandingBalance}"`
      )
      .join('\n');
    downloadCSV(header + rows, `ShriKrishna_Khata_Udhari_Backup_${new Date().toISOString().slice(0, 10)}.csv`);
  };

  const exportInventoryBackupCSV = () => {
    const header = 'उत्पादन नाव (मराठी),English Name,कंपनी,पॅकिंग,चालू विक्री दर (₹),खरेदी दर (₹),शिल्लक साठा,एकूण साठा मूल्य (₹)\n';
    const rows = products
      .map(
        (p) =>
          `"${p.nameMr}","${p.nameEn}","${p.brandName}","${p.packSize}","${p.sellingPrice}","${p.purchasePrice}","${p.totalStock} ${p.unit}","${p.totalStock * p.purchasePrice}"`
      )
      .join('\n');
    downloadCSV(header + rows, `ShriKrishna_Inventory_Stock_Backup_${new Date().toISOString().slice(0, 10)}.csv`);
  };

  const exportSalesBackupCSV = () => {
    const header = 'बिल नंबर,तारीख,शेतकरी ग्राहक,मोबाईल,एकूण बिल (₹),जमा रक्कम (₹),उधारी शिल्लक (₹),पेमेंट मार्ग\n';
    const rows = sales
      .map(
        (s) =>
          `"${s.invoiceNumber}","${new Date(s.createdAt).toLocaleDateString('mr-IN')}","${s.customerName}","${s.customerPhone || ''}","${s.grandTotal}","${s.paidAmount}","${s.balanceAmount}","${s.paymentMethod}"`
      )
      .join('\n');
    downloadCSV(header + rows, `ShriKrishna_Sales_Invoices_Backup_${new Date().toISOString().slice(0, 10)}.csv`);
  };

  const exportFullJSONBackup = () => {
    const data = {
      backupTimestamp: new Date().toISOString(),
      business: profile,
      financialKPIs: kpis,
      customers,
      products,
      sales,
      purchases,
      expenses,
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `ShriKrishna_Full_Enterprise_Backup_${new Date().toISOString().slice(0, 10)}.json`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    setFeedback('📥 संपूर्ण व्यवसाय डेटाबेस सुरक्षित बॅकअप फाईल डाऊनलोड झाली!');
  };

  const sendBackupSummaryWhatsApp = () => {
    const totalReceivable = customers.reduce((sum, c) => sum + c.outstandingBalance, 0);
    const debtorList = customers
      .filter((c) => c.outstandingBalance > 0)
      .map((c) => `• ${c.name} (${c.village}): ₹${c.outstandingBalance}`)
      .join('\n');

    const msg = `📊 *श्री कृष्ण ॲग्रो सर्व्हिसेस — मासिक सुरक्षित बॅकअप व उधारी अहवाल*\n\n📅 तारीख: ${new Date().toLocaleDateString('mr-IN')}\n💰 एकूण विक्री: ₹${kpis.totalRevenue}\n💵 निव्वळ नफा: ₹${kpis.netProfit}\n⚠️ एकूण शेतकरी उधारी येणे: ₹${totalReceivable}\n\n*प्रमुख उधारी खाती:*\n${debtorList}\n\nसर्व साठा व व्यवहार सुरक्षित नोंदवले गेले आहेत.`;
    
    window.open(`https://wa.me/919373873065?text=${encodeURIComponent(msg)}`, '_blank');
  };

  // POS Calculations
  const posSubtotal = posItems.reduce((acc, i) => acc + i.quantity * i.unitPrice, 0);
  const posTax = posItems.reduce((acc, i) => acc + (i.quantity * i.unitPrice * i.gstRate) / 100, 0);
  const posGrandTotal = Math.round(posSubtotal + posTax - posDiscount);
  const posBalanceToKhata = Math.max(0, posGrandTotal - posPaidAmount);

  // Handle POS Sale Creation
  const handleCreateSale = () => {
    if (posItems.length === 0) {
      setFeedback('⚠️ कृपया बिलामध्ये किमान एक उत्पादन जोडा.');
      return;
    }

    const res = store.createSale({
      customerId: posCustomer,
      customerName: posCustomerName || 'शेतकरी ग्राहक',
      customerPhone: posCustomerPhone || '9800000000',
      items: posItems,
      discountAmount: Number(posDiscount) || 0,
      paymentMethod: posPaymentMethod,
      paidAmount: Number(posPaidAmount) || 0,
      createdByName: activeAdmin?.name || 'Shri Krishna Admin',
    });

    if (res.success && res.sale) {
      syncStoreData();
      setFeedback(`✅ बिल #${res.sale.invoiceNumber} यशस्वीपणे तयार झाले! एकूण: ₹${res.sale.grandTotal}, जमा: ₹${res.sale.paidAmount}, उधारी शिल्लक: ₹${res.sale.balanceAmount}`);
      setPosItems([]);
      setPosDiscount(0);
      setPosPaidAmount(0);
    } else {
      setFeedback(`❌ त्रुटी: ${res.error}`);
    }
  };

  // Handle Adding / Updating Product in Store
  const handleSaveProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (!pNameMr || !pSellingPrice) {
      setFeedback('⚠️ कृपया मराठी नाव व विक्री दर भरा.');
      return;
    }

    if (editingProductId) {
      const existing = store.getProductById(editingProductId);
      if (existing) {
        existing.nameMr = pNameMr;
        existing.nameEn = pNameEn || pNameMr;
        existing.sellingPrice = Number(pSellingPrice);
        existing.purchasePrice = Number(pPurchasePrice);
        existing.totalStock = Number(pInitialStock);
        existing.minStockLevel = Number(pMinStock);
        existing.packSize = pPackSize;
        existing.technicalName = pTechnicalName;
        existing.targetCrops = pTargetCrops;
        existing.dosageGuide = pDosageGuide;
        setFeedback(`✅ उत्पादन "${pNameMr}" यशस्वीपणे अपडेट झाले!`);
      }
    } else {
      const cat = store.getCategories().find((c) => c.id === pCategoryId);
      const newProd: Product = {
        id: `prod-${Date.now()}`,
        nameEn: pNameEn || pNameMr,
        nameMr: pNameMr,
        brandId: 'br-1',
        brandName: pBrandName,
        categoryId: pCategoryId,
        categoryNameEn: cat?.nameEn || 'General',
        categoryNameMr: cat?.nameMr || 'कृषी निविष्ठा',
        sku: `SKU-${Date.now().toString().slice(-4)}`,
        hsnCode: '38089000',
        unit: pUnit,
        packSize: pPackSize,
        mrp: Number(pSellingPrice),
        sellingPrice: Number(pSellingPrice),
        purchasePrice: Number(pPurchasePrice),
        gstRate: Number(pGstRate),
        totalStock: Number(pInitialStock),
        minStockLevel: Number(pMinStock),
        isAvailable: true,
        technicalName: pTechnicalName,
        targetCrops: pTargetCrops,
        dosageGuide: pDosageGuide,
        batches: [
          {
            id: `batch-${Date.now()}`,
            productId: `prod-${Date.now()}`,
            batchNumber: pBatchNo || 'BATCH-01',
            mfgDate: new Date().toISOString().slice(0, 10),
            expiryDate: pExpiryDate || '2027-12-31',
            purchaseCost: Number(pPurchasePrice),
            currentStock: Number(pInitialStock),
            isDemo: false,
          },
        ],
        isDemo: false,
        createdAt: new Date().toISOString(),
      };

      store.addProduct(newProd);
      setFeedback(`✅ नवीन उत्पादन "${pNameMr}" यशस्वीपणे जोडले! साठा: ${pInitialStock} ${pUnit}`);
    }

    syncStoreData();
    setProductModalOpen(false);
    setEditingProductId(null);
  };

  // Handle Recording Khata Payment from Farmer
  const handleRecordKhataPayment = () => {
    if (!selectedKhataCustomer || collectAmount <= 0) {
      setFeedback('⚠️ कृपया योग्य रक्कम प्रविष्ट करा.');
      return;
    }

    const res = store.recordCustomerPayment(
      selectedKhataCustomer.id,
      Number(collectAmount),
      collectNotes || 'काऊंटर रोख भरणा'
    );

    if (res.success) {
      syncStoreData();
      setFeedback(`✅ शेतकरी ${selectedKhataCustomer.name} यांच्या खात्यावर ₹${collectAmount} यशस्वीपणे जमा झाले!`);
      setPaymentModalOpen(false);
      setSelectedKhataCustomer(null);
      setCollectAmount(0);
    } else {
      setFeedback(`❌ त्रुटी: ${res.error}`);
    }
  };

  // Handle Purchase Inward
  const handleRecordPurchase = () => {
    if (purItems.length === 0) {
      setFeedback('⚠️ खरेदी मालाची यादी रिक्त आहे.');
      return;
    }

    const sup = store.getSuppliers().find((s) => s.id === purSupplier) || store.getSuppliers()[0];
    const res = store.recordPurchase({
      supplierId: sup.id,
      supplierName: sup.name,
      supplierInvoiceNumber: purInvoice || `INV-${Date.now()}`,
      items: purItems,
      freightCharges: Number(purFreight) || 0,
      paidAmount: Number(purPaidAmount) || 0,
    });

    if (res.success && res.purchase) {
      syncStoreData();
      setFeedback(`✅ खरेदी नोंद यशस्वी! बिल #${res.purchase.supplierInvoiceNumber}, एकूण: ₹${res.purchase.grandTotal}`);
    } else {
      setFeedback(`❌ त्रुटी: ${res.error}`);
    }
  };

  // Handle Expense Entry
  const handleRecordExpense = () => {
    if (expAmount <= 0) {
      setFeedback('⚠️ कृपया खर्चाची रक्कम भरा.');
      return;
    }

    const exp = store.recordExpense({
      category: expCategory,
      amount: Number(expAmount),
      paymentMethod: expMethod,
      vendor: expVendor || 'इतर खर्च',
      notes: expNotes,
      recordedByName: activeAdmin?.name || 'Shri Krishna Admin',
    });

    syncStoreData();
    setFeedback(`✅ खर्च नोंदवला: ₹${exp.amount} (${exp.category}) - ${exp.vendor}`);
    setExpAmount(0);
    setExpNotes('');
  };

  // Handle AI Query
  const handleRunAi = async () => {
    setAiLoading(true);
    try {
      setTimeout(() => {
        setAiResponse({
          analysis: `📊 श्री कृष्ण ॲग्रो व्यवसाय विश्लेषण:\n\n• एकूण विक्री उत्पन्न: ₹${kpis?.totalRevenue?.toLocaleString('en-IN')}\n• निव्वळ नफा (Net Profit): ₹${kpis?.netProfit?.toLocaleString('en-IN')}\n• कांदा पिकासाठी महाधन १९:१९:१९ व ०:५२:३४ ची सर्वाधिक मागणी आहे.\n• करपा रोगासाठी नॅटिव्हो व ॲमिस्टार टॉप चा साठा पुरेसा आहे.`,
          recommendation: 'सध्या कांदा लागवडीचा हंगाम असल्याने १९:१९:१९ व सूक्ष्म अन्नद्रव्यांचा ५० बॅग अतिरिक्त साठा ठेवण्याची शिफारस आहे.',
        });
        setAiLoading(false);
      }, 400);
    } catch {
      setAiLoading(false);
    }
  };

  // Handle WhatsApp Simulator
  const handleSendSimMessage = () => {
    if (!simMessage.trim()) return;
    const userMsg = { role: 'user', text: simMessage, timestamp: 'आत्ता' };
    setSimHistory((prev) => [...prev, userMsg]);
    setSimLoading(true);

    setTimeout(() => {
      const p = store.getProducts().find((pr) => pr.nameMr.includes('१९:१९:१९') || pr.nameMr.includes('नॅटिव्हो')) || store.getProducts()[0];
      const botReply = {
        role: 'assistant',
        text: `नमस्कार ${simName}! श्री कृष्ण ॲग्रो सर्व्हिसेस कडून:\n• ${p.nameMr} चा चालू दर ₹${p.sellingPrice} (${p.packSize}) आहे.\n• उपलब्ध साठा: ${p.totalStock} ${p.unit}\n• शिफारस: ${p.dosageGuide}\n\nआपण आजच दुकानात येऊन किंवा व्हॉट्सॲपवर ऑर्डर देऊ शकता. अधिक माहितीसाठी B.Sc Agri तज्ञ शुभम गमाणे (८६०५६२०८४३) यांच्याशी संपर्क करा.`,
        timestamp: 'आत्ता',
      };
      setSimHistory((prev) => [...prev, botReply]);
      setSimLoading(false);
      setSimMessage('');
    }, 400);
  };

  // =============================================================
  // SECURE OWNER / ADMIN LOGIN SCREEN
  // =============================================================
  if (!isAdminAuthenticated) {
    return (
      <div className="min-h-[85vh] flex items-center justify-center px-4 py-12 bg-slate-50">
        <div className="bg-white rounded-3xl border border-slate-200 shadow-2xl p-6 sm:p-8 max-w-md w-full space-y-6">
          <div className="text-center space-y-2">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-agro-800 to-agro-950 text-emerald-300 flex items-center justify-center mx-auto shadow-lg">
              <Lock className="w-8 h-8" />
            </div>
            <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900">
              श्री कृष्ण ॲग्रो सर्व्हिसेस
            </h2>
            <p className="text-xs font-bold text-emerald-800 uppercase tracking-wider">
              अधिकृत व्यवस्थापक व मालक लॉगिन (Owner Portal)
            </p>
            <p className="text-xs text-slate-500">
              सुरक्षित ERP, इन्व्हेंटरी, बिलिंग व नफा-तोटा डॅशबोर्ड
            </p>
          </div>

          {/* Max 2 Admins Registered Notice */}
          <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-3 text-xs text-emerald-900 space-y-1">
            <div className="flex items-center gap-1.5 font-bold text-emerald-950">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>कमाल २ अधिकृत व्यवस्थापक नोंदणीकृत आहेत:</span>
            </div>
            <p className="text-[11px] text-emerald-800 pl-5">
              १. आकाश खताळे (9373873065)<br />
              २. शुभम गमाणे (8605620843)
            </p>
          </div>

          {authError && (
            <div className="bg-rose-50 border border-rose-200 text-rose-700 text-xs font-semibold p-3 rounded-xl">
              {authError}
            </div>
          )}

          <form onSubmit={handleAdminLogin} className="space-y-4 text-xs">
            <div>
              <label className="block font-bold text-slate-700 mb-1">
                नोंदणीकृत मोबाईल नंबर किंवा ईमेल
              </label>
              <input
                type="text"
                required
                value={loginIdentifier}
                onChange={(e) => setLoginIdentifier(e.target.value)}
                placeholder="उदा. 9373873065"
                className="w-full border border-slate-300 rounded-xl p-3 text-sm font-semibold focus:ring-2 focus:ring-agro-600 shadow-sm"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">
                पासवर्ड किंवा सुरक्षा पिन (PIN)
              </label>
              <input
                type="password"
                required
                value={loginSecret}
                onChange={(e) => setLoginSecret(e.target.value)}
                placeholder="पासवर्ड किंवा ४-अंकी पिन"
                className="w-full border border-slate-300 rounded-xl p-3 text-sm font-semibold focus:ring-2 focus:ring-agro-600 shadow-sm"
              />
            </div>

            <button
              type="submit"
              className="w-full bg-agro-800 hover:bg-agro-900 text-white font-extrabold py-3.5 rounded-xl transition shadow-md text-sm flex items-center justify-center gap-2"
            >
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>सुरक्षित लॉगिन करा (Log In)</span>
            </button>
          </form>

          <div className="text-center pt-2 border-t border-slate-100 text-[11px] text-slate-400">
            🔒 नवीन युझर नोंदणी बंद आहे (फक्त २ अधिकृत भागीदारांना प्रवेश).
          </div>
        </div>
      </div>
    );
  }

  // =============================================================
  // AUTHENTICATED ADMIN ERP DASHBOARD
  // =============================================================
  return (
    <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-6">
      {/* Top Header */}
      <div className="bg-gradient-to-r from-agro-950 via-agro-900 to-agro-800 text-white rounded-3xl p-5 sm:p-7 shadow-agro-lg flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <div className="inline-flex items-center gap-2 bg-emerald-800/80 text-emerald-300 text-xs font-bold px-3 py-1 rounded-full border border-emerald-600/40 mb-2">
            <UserCheck className="w-3.5 h-3.5" />
            <span>लॉगिन युझर: {activeAdmin?.name}</span>
          </div>
          <h1 className="text-xl sm:text-3xl font-extrabold tracking-tight">
            श्री कृष्ण ॲग्रो — डिजिटल बिझनेस ऑपरेटिंग सिस्टम
          </h1>
          <p className="text-xs sm:text-sm text-emerald-100/90 mt-1">
            सिन्नर, जि. नाशिक • प्रोप्रा. आकाश खताळे • कृषी सल्लागार: शुभम गमाणे व जगदीश बोडके
          </p>
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <button
            onClick={() => setIsAdminAuthenticated(false)}
            className="bg-white/10 hover:bg-white/20 text-white text-xs font-bold px-3.5 py-2.5 rounded-xl border border-white/20 transition flex items-center justify-center gap-1.5"
            title="लॉगआउट करा"
          >
            <Lock className="w-3.5 h-3.5 text-rose-300" />
            <span>लॉगआउट</span>
          </button>

          <button
            onClick={() => {
              setEditingProductId(null);
              setPNameMr('');
              setPNameEn('');
              setPSellingPrice(200);
              setPPurchasePrice(160);
              setPInitialStock(50);
              setPTechnicalName('');
              setProductModalOpen(true);
            }}
            className="flex-1 sm:flex-initial bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-extrabold px-4 py-2.5 rounded-xl transition shadow-md flex items-center justify-center gap-1.5"
          >
            <Plus className="w-4 h-4" />
            <span>नवीन उत्पादन जोडा</span>
          </button>
        </div>
      </div>

      {/* Live Feedback Toast */}
      {feedback && (
        <div className="bg-emerald-950 border border-emerald-500 text-emerald-100 text-xs sm:text-sm font-semibold p-4 rounded-2xl flex items-center justify-between shadow-md">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>{feedback}</span>
          </div>
          <button onClick={() => setFeedback('')} className="text-emerald-400 font-bold hover:text-white ml-2">
            ✕
          </button>
        </div>
      )}

      {/* Navigation Tabs Bar */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none text-xs font-bold">
        {[
          { id: 'dashboard', label: 'डॅशबोर्ड व आढावा', icon: TrendingUp },
          { id: 'pos', label: 'काऊंटर बिलिंग (POS)', icon: ShoppingCart },
          { id: 'inventory', label: `इन्व्हेंटरी व साठा (${products.length})`, icon: Package },
          { id: 'customers', label: `शेतकरी उधारी खाती (${customers.length})`, icon: Users },
          { id: 'purchases', label: 'खरेदी माल नोंद (Inward)', icon: Truck },
          { id: 'expenses', label: 'दुकान खर्च', icon: DollarSign },
          { id: 'financials', label: 'नफा-तोटा व ताळेबंद', icon: FileText },
          { id: 'backup', label: '१-क्लिक डेटा बॅकअप व सुरक्षा', icon: Database },
          { id: 'whatsapp', label: 'WhatsApp बॉट टेस्ट', icon: MessageCircle },
          { id: 'owner_ai', label: 'AI व्यवसाय सल्लागार', icon: Bot },
        ].map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-4 py-2.5 rounded-xl whitespace-nowrap transition flex items-center gap-1.5 shadow-sm ${
                activeTab === tab.id
                  ? 'bg-agro-800 text-white shadow'
                  : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-50'
              }`}
            >
              <Icon className="w-3.5 h-3.5 text-agro-700 group-hover:text-white" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* ------------------------------------------------------------- */}
      {/* 1. DASHBOARD OVERVIEW TAB */}
      {/* ------------------------------------------------------------- */}
      {activeTab === 'dashboard' && (
        <div className="space-y-6">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200 shadow-sm space-y-1">
              <div className="flex justify-between items-center text-slate-500 text-xs font-bold">
                <span>एकूण विक्री उत्पन्न</span>
                <TrendingUp className="w-4 h-4 text-emerald-600" />
              </div>
              <p className="text-xl sm:text-2xl font-extrabold text-slate-900">
                ₹{kpis?.totalRevenue?.toLocaleString('en-IN') || '०'}
              </p>
              <p className="text-[11px] text-emerald-700 font-semibold">
                {sales.length} बिले पूर्ण
              </p>
            </div>

            <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200 shadow-sm space-y-1">
              <div className="flex justify-between items-center text-slate-500 text-xs font-bold">
                <span>निव्वळ नफा (Net Profit)</span>
                <DollarSign className="w-4 h-4 text-agro-700" />
              </div>
              <p className="text-xl sm:text-2xl font-extrabold text-emerald-800">
                ₹{kpis?.netProfit?.toLocaleString('en-IN') || '०'}
              </p>
              <p className="text-[11px] text-slate-500">
                विक्री - मालखर्च - दुकानखर्च
              </p>
            </div>

            <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200 shadow-sm space-y-1">
              <div className="flex justify-between items-center text-slate-500 text-xs font-bold">
                <span>शेतकरी उधारी येणे (Khata)</span>
                <Users className="w-4 h-4 text-amber-600" />
              </div>
              <p className="text-xl sm:text-2xl font-extrabold text-amber-800">
                ₹{kpis?.totalReceivables?.toLocaleString('en-IN') || '०'}
              </p>
              <p className="text-[11px] text-amber-700 font-semibold">
                {customers.filter((c) => c.outstandingBalance > 0).length} शेतकऱ्यांकडे उधारी शिल्लक
              </p>
            </div>

            <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200 shadow-sm space-y-1">
              <div className="flex justify-between items-center text-slate-500 text-xs font-bold">
                <span>साठा संपत आलेली उत्पादने</span>
                <AlertTriangle className="w-4 h-4 text-rose-600" />
              </div>
              <p className="text-xl sm:text-2xl font-extrabold text-rose-800">
                {kpis?.lowStockItems?.length || 0}
              </p>
              <p className="text-[11px] text-rose-700 font-semibold">
                पुनर्नोंद आवश्यक
              </p>
            </div>
          </div>
        </div>
      )}

      {/* ------------------------------------------------------------- */}
      {/* 2. POS COUNTER BILLING WITH SPLIT PAYMENT */}
      {/* ------------------------------------------------------------- */}
      {activeTab === 'pos' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-7 bg-white rounded-2xl p-5 border border-slate-200 shadow-sm space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="font-extrabold text-slate-900 text-sm sm:text-base flex items-center gap-2">
                <ShoppingCart className="w-4 h-4 text-agro-700" />
                <span>काऊंटर बिलिंग (POS Billing)</span>
              </h3>
              <span className="text-xs font-bold text-slate-500">उपलब्ध माल: {products.length}</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-96 overflow-y-auto pr-1">
              {products.map((p) => (
                <div
                  key={p.id}
                  onClick={() => {
                    const existing = posItems.find((i) => i.productId === p.id);
                    if (existing) {
                      setPosItems(
                        posItems.map((i) =>
                          i.productId === p.id ? { ...i, quantity: i.quantity + 1 } : i
                        )
                      );
                    } else {
                      setPosItems([
                        ...posItems,
                        { productId: p.id, quantity: 1, unitPrice: p.sellingPrice, gstRate: p.gstRate },
                      ]);
                    }
                  }}
                  className="p-3 rounded-xl border border-slate-200 hover:border-agro-600 bg-slate-50/50 hover:bg-emerald-50/30 cursor-pointer transition flex flex-col justify-between space-y-2"
                >
                  <div>
                    <div className="flex justify-between text-[10px] font-bold">
                      <span className="text-slate-500">{p.brandName}</span>
                      <span className={p.totalStock > 0 ? 'text-emerald-700' : 'text-rose-700'}>
                        साठा: {p.totalStock} {p.unit}
                      </span>
                    </div>
                    <p className="font-bold text-slate-900 text-xs mt-1">{p.nameMr}</p>
                    <p className="text-[11px] text-slate-500">{p.packSize}</p>
                  </div>
                  <div className="flex justify-between items-center pt-1 border-t border-slate-200/60">
                    <span className="font-extrabold text-agro-950 text-sm">₹{p.sellingPrice}</span>
                    <button className="bg-agro-700 hover:bg-agro-800 text-white text-[10px] font-bold px-2 py-1 rounded">
                      + बिलात जोडा
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="lg:col-span-5 bg-white rounded-2xl p-5 border border-slate-200 shadow-sm space-y-4">
            <h3 className="font-extrabold text-slate-900 text-sm pb-2 border-b border-slate-100">
              ग्राहक व बिलाचा तपशील
            </h3>

            <div className="space-y-2 text-xs">
              <label className="block font-bold text-slate-700">शेतकरी ग्राहक निवडा</label>
              <select
                value={posCustomer}
                onChange={(e) => {
                  setPosCustomer(e.target.value);
                  const cust = customers.find((c) => c.id === e.target.value);
                  if (cust) {
                    setPosCustomerName(cust.name);
                    setPosCustomerPhone(cust.phone);
                    setPosCustomerVillage(cust.village);
                  }
                }}
                className="w-full border border-slate-300 rounded-lg p-2 bg-white font-semibold"
              >
                {customers.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name} ({c.village}) — उधारी: ₹{c.outstandingBalance}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
              {posItems.map((item, idx) => {
                const prod = products.find((p) => p.id === item.productId);
                return (
                  <div key={idx} className="flex justify-between items-center p-2 rounded-lg bg-slate-50 text-xs">
                    <div>
                      <p className="font-bold text-slate-900">{prod?.nameMr || 'उत्पादन'}</p>
                      <p className="text-[11px] text-slate-500">
                        ₹{item.unitPrice} × {item.quantity} {prod?.unit || ''}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-slate-900">₹{item.quantity * item.unitPrice}</span>
                      <button
                        onClick={() => setPosItems(posItems.filter((_, i) => i !== idx))}
                        className="text-rose-600 font-bold px-1 hover:bg-rose-50 rounded"
                      >
                        ✕
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="bg-slate-900 text-white p-4 rounded-2xl space-y-3">
              <div className="flex justify-between text-xs text-slate-300">
                <span>उप-एकूण (Subtotal):</span>
                <span>₹{posSubtotal}</span>
              </div>
              <div className="flex justify-between text-xs text-slate-300">
                <span>GST कर:</span>
                <span>₹{Math.round(posTax)}</span>
              </div>
              <div className="flex justify-between text-xs text-slate-300 items-center">
                <span>सवलत (Discount ₹):</span>
                <input
                  type="number"
                  value={posDiscount}
                  onChange={(e) => setPosDiscount(Number(e.target.value))}
                  className="w-20 bg-slate-800 border border-slate-700 rounded px-2 py-0.5 text-right text-xs text-white"
                />
              </div>

              <div className="pt-2 border-t border-slate-800 grid grid-cols-3 gap-2 text-center">
                <div className="bg-slate-800/90 p-2 rounded-xl">
                  <p className="text-[10px] text-slate-400">एकूण बिल</p>
                  <p className="text-sm font-extrabold text-white">₹{posGrandTotal}</p>
                </div>

                <div className="bg-emerald-950 border border-emerald-600/50 p-2 rounded-xl">
                  <p className="text-[10px] text-emerald-300">आता जमा (Paid)</p>
                  <input
                    type="number"
                    value={posPaidAmount}
                    onChange={(e) => setPosPaidAmount(Number(e.target.value))}
                    className="w-full bg-transparent text-center text-sm font-extrabold text-emerald-300 focus:outline-none"
                  />
                </div>

                <div className="bg-amber-950 border border-amber-600/50 p-2 rounded-xl">
                  <p className="text-[10px] text-amber-300">उधारी (Khata)</p>
                  <p className="text-sm font-extrabold text-amber-300">₹{posBalanceToKhata}</p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-2 text-xs font-bold">
              {(['CASH', 'UPI', 'CREDIT'] as const).map((m) => (
                <button
                  key={m}
                  onClick={() => setPosPaymentMethod(m)}
                  className={`py-2 rounded-lg border text-center ${
                    posPaymentMethod === m
                      ? 'bg-agro-800 text-white border-agro-800'
                      : 'bg-white text-slate-700 border-slate-200'
                  }`}
                >
                  {m === 'CASH' ? 'रोख (Cash)' : m === 'UPI' ? 'UPI / GPay' : 'उधारी (Credit)'}
                </button>
              ))}
            </div>

            <button
              onClick={handleCreateSale}
              className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold py-3 rounded-xl transition shadow-md flex items-center justify-center gap-2 text-sm"
            >
              <Printer className="w-4 h-4" />
              <span>बिल प्रिंट करा व साठा अपडेट करा</span>
            </button>
          </div>
        </div>
      )}

      {/* ------------------------------------------------------------- */}
      {/* 3. INVENTORY & STOCK MANAGEMENT TAB */}
      {/* ------------------------------------------------------------- */}
      {activeTab === 'inventory' && (
        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm space-y-4">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
            <div>
              <h3 className="font-extrabold text-slate-900 text-base">
                कृषी माल साठा व इन्व्हेंटरी (Stock Management)
              </h3>
              <p className="text-xs text-slate-500">
                प्रत्येक औषध व खताचा शिल्लक साठा, बॅच क्रमांक व चालू विक्री दर.
              </p>
            </div>

            <button
              onClick={() => {
                setEditingProductId(null);
                setPNameMr('');
                setPNameEn('');
                setPSellingPrice(200);
                setPPurchasePrice(160);
                setPInitialStock(50);
                setPTechnicalName('');
                setProductModalOpen(true);
              }}
              className="bg-agro-700 hover:bg-agro-800 text-white text-xs font-bold px-3.5 py-2 rounded-xl transition flex items-center gap-1"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>नवीन औषध/खत जोडा</span>
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-600 font-bold border-b border-slate-200">
                <tr>
                  <th className="p-3">उत्पादन नाव (मराठी)</th>
                  <th className="p-3">कंपनी</th>
                  <th className="p-3">पॅकिंग</th>
                  <th className="p-3">चालू विक्री दर</th>
                  <th className="p-3">शिल्लक साठा (Stock)</th>
                  <th className="p-3">बॅच व एक्सपायरी</th>
                  <th className="p-3 text-right">कृती</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {products.map((p) => (
                  <tr key={p.id} className="hover:bg-slate-50/80">
                    <td className="p-3">
                      <p className="font-extrabold text-slate-900">{p.nameMr}</p>
                      <p className="text-[11px] text-slate-500">{p.nameEn}</p>
                      {p.technicalName && (
                        <span className="text-[10px] text-emerald-800 bg-emerald-50 px-1.5 py-0.5 rounded mt-0.5 inline-block">
                          घटक: {p.technicalName}
                        </span>
                      )}
                    </td>
                    <td className="p-3 font-semibold text-slate-700">{p.brandName}</td>
                    <td className="p-3">{p.packSize}</td>
                    <td className="p-3 font-extrabold text-agro-950 text-sm">₹{p.sellingPrice}</td>
                    <td className="p-3">
                      <span
                        className={`font-extrabold px-2 py-1 rounded text-xs ${
                          p.totalStock <= p.minStockLevel
                            ? 'bg-rose-100 text-rose-900'
                            : 'bg-emerald-100 text-emerald-900'
                        }`}
                      >
                        {p.totalStock} {p.unit}
                      </span>
                    </td>
                    <td className="p-3 text-[11px]">
                      <p className="font-bold text-slate-800">{p.batches?.[0]?.batchNumber || 'BAT-2026'}</p>
                      <p className="text-slate-500">Exp: {p.batches?.[0]?.expiryDate || '2027-12-31'}</p>
                    </td>
                    <td className="p-3 text-right">
                      <button
                        onClick={() => {
                          setEditingProductId(p.id);
                          setPNameMr(p.nameMr);
                          setPNameEn(p.nameEn);
                          setPCategoryId(p.categoryId);
                          setPBrandName(p.brandName);
                          setPPackSize(p.packSize);
                          setPUnit(p.unit);
                          setPSellingPrice(p.sellingPrice);
                          setPPurchasePrice(p.purchasePrice);
                          setPGstRate(p.gstRate);
                          setPInitialStock(p.totalStock);
                          setPMinStock(p.minStockLevel);
                          setPTechnicalName(p.technicalName || '');
                          setPTargetCrops(p.targetCrops || '');
                          setPDosageGuide(p.dosageGuide || '');
                          setProductModalOpen(true);
                        }}
                        className="text-agro-700 hover:text-agro-900 font-bold bg-slate-100 hover:bg-slate-200 px-2.5 py-1.5 rounded-lg transition"
                      >
                        एडिट / साठा बदला
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ------------------------------------------------------------- */}
      {/* 4. CUSTOMER KHATA CRM TAB */}
      {/* ------------------------------------------------------------- */}
      {activeTab === 'customers' && (
        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm space-y-4">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="font-extrabold text-slate-900 text-base">
                शेतकरी खातेवही व उधारी CRM (Farmer Khata Ledger)
              </h3>
              <p className="text-xs text-slate-500">
                प्रत्येक शेतकऱ्याची थकबाकी, फोन नंबर, गाव व WhatsApp पेमेंट रिमायंडर.
              </p>
            </div>
            <div className="bg-amber-100 text-amber-900 font-extrabold text-xs px-3 py-1.5 rounded-xl">
              एकूण येणे उधारी: ₹{kpis?.totalReceivables?.toLocaleString('en-IN') || '०'}
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-600 font-bold border-b border-slate-200">
                <tr>
                  <th className="p-3">शेतकरी नाव</th>
                  <th className="p-3">गाव</th>
                  <th className="p-3">मोबाईल</th>
                  <th className="p-3">पिके</th>
                  <th className="p-3">उधारी शिल्लक (Balance)</th>
                  <th className="p-3 text-right">कृती</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {customers.map((c) => (
                  <tr key={c.id} className="hover:bg-slate-50/80">
                    <td className="p-3 font-extrabold text-slate-900">{c.name}</td>
                    <td className="p-3 font-semibold text-slate-700">{c.village}</td>
                    <td className="p-3 font-mono">{c.phone}</td>
                    <td className="p-3 text-slate-600">{c.cropTypes?.join(', ') || 'कांदा, भाजीपाला'}</td>
                    <td className="p-3">
                      <span
                        className={`font-extrabold px-2.5 py-1 rounded text-xs ${
                          c.outstandingBalance > 0
                            ? 'bg-amber-100 text-amber-950 border border-amber-300'
                            : 'bg-emerald-100 text-emerald-950'
                        }`}
                      >
                        ₹{c.outstandingBalance}
                      </span>
                    </td>
                    <td className="p-3 text-right space-x-2">
                      <button
                        onClick={() => {
                          setSelectedKhataCustomer(c);
                          setCollectAmount(c.outstandingBalance);
                          setPaymentModalOpen(true);
                        }}
                        className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-2.5 py-1.5 rounded-lg transition"
                      >
                        पेमेंट जमा करा
                      </button>

                      {c.outstandingBalance > 0 && (
                        <a
                          href={`https://wa.me/91${c.phone}?text=${encodeURIComponent(
                            `नमस्कार ${c.name}, श्री कृष्ण ॲग्रो सर्व्हिसेस सिन्नर कडून नम्र स्मरण: आपल्या खात्यावर ₹${c.outstandingBalance} उधारी शिल्लक आहे. कृपया सोयीनुसार जमा करावी.`
                          )}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold px-2.5 py-1.5 rounded-lg transition inline-flex items-center gap-1"
                        >
                          <MessageCircle className="w-3.5 h-3.5 text-emerald-600" />
                          <span>WhatsApp आठवण</span>
                        </a>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ------------------------------------------------------------- */}
      {/* 5. 1-CLICK COMPLETE BUSINESS BACKUP & SECURITY TAB */}
      {/* ------------------------------------------------------------- */}
      {activeTab === 'backup' && (
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-6">
          <div>
            <h3 className="font-extrabold text-slate-900 text-lg flex items-center gap-2">
              <Database className="w-5 h-5 text-agro-700" />
              <span>१-क्लिक व्यवसाय डेटा बॅकअप व सुरक्षा (Cloud & WhatsApp Export)</span>
            </h3>
            <p className="text-xs text-slate-500 mt-1">
              शेतकरी उधारी, जमा रक्कम, साठा व बिलिंग डेटा अत्यंत महत्त्वाचा असल्याने एका क्लिकवर सर्व एक्सेल (CSV) फाईल्स व सुरक्षित JSON बॅकअप डाऊनलोड करा.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Khata Backup */}
            <div className="p-4 rounded-2xl bg-amber-50/70 border border-amber-200 space-y-3 flex flex-col justify-between">
              <div>
                <div className="flex justify-between items-center text-amber-900 font-bold text-xs">
                  <span>शेतकरी खातेवही</span>
                  <Users className="w-4 h-4 text-amber-700" />
                </div>
                <p className="text-sm font-extrabold text-amber-950 mt-1">
                  उधारी व जमा बॅकअप
                </p>
                <p className="text-[11px] text-amber-800 mt-0.5">
                  सर्व {customers.length} शेतकऱ्यांची शिल्लक थकबाकी, संपर्क व गावांची यादी.
                </p>
              </div>
              <button
                onClick={exportKhataBackupCSV}
                className="w-full bg-amber-700 hover:bg-amber-800 text-white font-bold py-2 rounded-xl text-xs flex items-center justify-center gap-1.5 shadow-sm"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Excel (CSV) डाऊनलोड</span>
              </button>
            </div>

            {/* Inventory Backup */}
            <div className="p-4 rounded-2xl bg-emerald-50/70 border border-emerald-200 space-y-3 flex flex-col justify-between">
              <div>
                <div className="flex justify-between items-center text-emerald-900 font-bold text-xs">
                  <span>इन्व्हेंटरी साठा</span>
                  <Package className="w-4 h-4 text-emerald-700" />
                </div>
                <p className="text-sm font-extrabold text-emerald-950 mt-1">
                  माल साठा व किंमत बॅकअप
                </p>
                <p className="text-[11px] text-emerald-800 mt-0.5">
                  सर्व {products.length} औषधे, खते, चालू दर, खरेदी किंमत व एकूण साठा मूल्य.
                </p>
              </div>
              <button
                onClick={exportInventoryBackupCSV}
                className="w-full bg-emerald-700 hover:bg-emerald-800 text-white font-bold py-2 rounded-xl text-xs flex items-center justify-center gap-1.5 shadow-sm"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Excel (CSV) डाऊनलोड</span>
              </button>
            </div>

            {/* Sales Invoices Backup */}
            <div className="p-4 rounded-2xl bg-blue-50/70 border border-blue-200 space-y-3 flex flex-col justify-between">
              <div>
                <div className="flex justify-between items-center text-blue-900 font-bold text-xs">
                  <span>काऊंटर बिलिंग</span>
                  <ShoppingCart className="w-4 h-4 text-blue-700" />
                </div>
                <p className="text-sm font-extrabold text-blue-950 mt-1">
                  विक्री व पावत्या बॅकअप
                </p>
                <p className="text-[11px] text-blue-800 mt-0.5">
                  सर्व {sales.length} पावत्या, जमा/उधारी विभाजन व एकूण उत्पन्न नोंद.
                </p>
              </div>
              <button
                onClick={exportSalesBackupCSV}
                className="w-full bg-blue-700 hover:bg-blue-800 text-white font-bold py-2 rounded-xl text-xs flex items-center justify-center gap-1.5 shadow-sm"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Excel (CSV) डाऊनलोड</span>
              </button>
            </div>

            {/* Full JSON Database Snapshot */}
            <div className="p-4 rounded-2xl bg-purple-50/70 border border-purple-200 space-y-3 flex flex-col justify-between">
              <div>
                <div className="flex justify-between items-center text-purple-900 font-bold text-xs">
                  <span>संपूर्ण डेटाबेस</span>
                  <Database className="w-4 h-4 text-purple-700" />
                </div>
                <p className="text-sm font-extrabold text-purple-950 mt-1">
                  Cloud JSON स्नॅपशॉट
                </p>
                <p className="text-[11px] text-purple-800 mt-0.5">
                  Google Drive / Cloud वर थेट अपलोड करण्यासाठी मास्टर डेटाबेस.
                </p>
              </div>
              <button
                onClick={exportFullJSONBackup}
                className="w-full bg-purple-700 hover:bg-purple-800 text-white font-bold py-2 rounded-xl text-xs flex items-center justify-center gap-1.5 shadow-sm"
              >
                <Download className="w-3.5 h-3.5" />
                <span>JSON बॅकअप डाऊनलोड</span>
              </button>
            </div>
          </div>

          {/* Automatic WhatsApp & Google Drive Export Actions */}
          <div className="p-5 bg-gradient-to-r from-agro-950 to-agro-900 text-white rounded-2xl flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2 text-emerald-300 font-bold text-sm">
                <MessageCircle className="w-4 h-4" />
                <span>मासिक उधारी व नफा अहवाल थेट मालकाच्या WhatsApp वर पाठवा</span>
              </div>
              <p className="text-xs text-slate-300">
                आकाश खताळे (9373873065) यांच्या व्हॉट्सॲपवर सर्व थकबाकीदार शेतकऱ्यांची यादी व नफा सारांश पाठवला जातो.
              </p>
            </div>

            <button
              onClick={sendBackupSummaryWhatsApp}
              className="bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-extrabold px-5 py-3 rounded-xl transition text-xs flex items-center gap-2 shadow-lg shrink-0"
            >
              <Send className="w-4 h-4" />
              <span>WhatsApp वर बॅकअप पाठवा</span>
            </button>
          </div>
        </div>
      )}

      {/* ------------------------------------------------------------- */}
      {/* 6. FINANCIALS TAB */}
      {/* ------------------------------------------------------------- */}
      {activeTab === 'financials' && (
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-6">
          <div>
            <h3 className="font-extrabold text-slate-900 text-lg">
              नफा-तोटा व व्यवसाय आर्थिक पत्रक (Financial Statements)
            </h3>
            <p className="text-xs text-slate-500">
              श्री कृष्ण ॲग्रो सर्व्हिसेस, सिन्नर — अचूक संगणकीय नफा व ताळेबंद.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            <div className="bg-emerald-50 border border-emerald-200 p-5 rounded-2xl space-y-2">
              <span className="text-xs font-bold text-emerald-800 uppercase">१. एकूण विक्री उत्पन्न</span>
              <p className="text-2xl font-extrabold text-emerald-950">
                ₹{kpis?.totalRevenue?.toLocaleString('en-IN') || '०'}
              </p>
              <p className="text-xs text-emerald-700">काऊंटर व थेट विक्रीतून जमा झालेली रक्कम</p>
            </div>

            <div className="bg-slate-50 border border-slate-200 p-5 rounded-2xl space-y-2">
              <span className="text-xs font-bold text-slate-600 uppercase">२. विकलेल्या मालाचा खरेदी खर्च (COGS)</span>
              <p className="text-2xl font-extrabold text-slate-900">
                ₹{kpis?.totalCogs?.toLocaleString('en-IN') || '०'}
              </p>
              <p className="text-xs text-slate-500">कंपनी व सप्लायर खरेदी मूल्य</p>
            </div>

            <div className="bg-amber-50 border border-amber-200 p-5 rounded-2xl space-y-2">
              <span className="text-xs font-bold text-amber-800 uppercase">३. दुकान खर्च (Expenses)</span>
              <p className="text-2xl font-extrabold text-amber-950">
                ₹{kpis?.totalExpenses?.toLocaleString('en-IN') || '०'}
              </p>
              <p className="text-xs text-amber-700">भाडे, पगार, वीज व इतर खर्च</p>
            </div>
          </div>

          <div className="p-6 bg-gradient-to-r from-agro-950 to-agro-900 text-white rounded-2xl flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <p className="text-xs uppercase font-bold text-emerald-300">शुद्ध निव्वळ नफा (Net Profit Formula)</p>
              <p className="text-xs text-slate-300 mt-0.5">विक्री उत्पन्न (Revenue) - खरेदी खर्च (COGS) - दुकान खर्च (Expenses)</p>
            </div>
            <p className="text-3xl sm:text-4xl font-extrabold text-emerald-400">
              ₹{kpis?.netProfit?.toLocaleString('en-IN') || '०'}
            </p>
          </div>
        </div>
      )}

      {/* ------------------------------------------------------------- */}
      {/* 7. PURCHASES & INWARD STOCK TAB */}
      {/* ------------------------------------------------------------- */}
      {activeTab === 'purchases' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-5 bg-white rounded-2xl p-5 border border-slate-200 shadow-sm space-y-4">
            <h3 className="font-extrabold text-slate-900 text-sm sm:text-base flex items-center gap-2">
              <Truck className="w-4 h-4 text-agro-700" />
              <span>नवीन माल खरेदी नोंद (Inward Stock)</span>
            </h3>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">सप्लायर / कंपनी</label>
                <select
                  value={purSupplier}
                  onChange={(e) => setPurSupplier(e.target.value)}
                  className="w-full border border-slate-300 rounded-lg p-2 bg-white font-semibold"
                >
                  {suppliers.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.name} ({s.city})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">सप्लायर बिल नंबर</label>
                <input
                  type="text"
                  value={purInvoice}
                  onChange={(e) => setPurInvoice(e.target.value)}
                  placeholder="उदा. INV-DEEPAK-9921"
                  className="w-full border border-slate-300 rounded-lg p-2"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">वाहतूक खर्च (Freight ₹)</label>
                <input
                  type="number"
                  value={purFreight}
                  onChange={(e) => setPurFreight(Number(e.target.value))}
                  className="w-full border border-slate-300 rounded-lg p-2"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">सप्लायरला भरलेली रक्कम (₹)</label>
                <input
                  type="number"
                  value={purPaidAmount}
                  onChange={(e) => setPurPaidAmount(Number(e.target.value))}
                  className="w-full border border-slate-300 rounded-lg p-2"
                />
              </div>

              <button
                onClick={handleRecordPurchase}
                className="w-full bg-agro-800 hover:bg-agro-900 text-white font-extrabold py-3 rounded-xl transition shadow flex items-center justify-center gap-2 mt-2"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>खरेदी माल साठ्यात जोडा (Stock Inward)</span>
              </button>
            </div>
          </div>

          <div className="lg:col-span-7 bg-white rounded-2xl p-5 border border-slate-200 shadow-sm space-y-4">
            <h3 className="font-extrabold text-slate-900 text-sm">खरेदी इतिहास (Past Inward Bills)</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 text-slate-600 font-bold border-b border-slate-200">
                  <tr>
                    <th className="p-2.5">बिल #</th>
                    <th className="p-2.5">सप्लायर</th>
                    <th className="p-2.5">एकूण खरेदी</th>
                    <th className="p-2.5">भरणा</th>
                    <th className="p-2.5">तारीख</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {purchases.map((p) => (
                    <tr key={p.id} className="hover:bg-slate-50/80">
                      <td className="p-2.5 font-bold text-slate-900">{p.supplierInvoiceNumber}</td>
                      <td className="p-2.5 font-semibold">{p.supplierName}</td>
                      <td className="p-2.5 font-extrabold">₹{p.grandTotal}</td>
                      <td className="p-2.5 text-emerald-800 font-bold">₹{p.paidAmount}</td>
                      <td className="p-2.5 text-slate-500">{new Date(p.createdAt).toLocaleDateString('mr-IN')}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ------------------------------------------------------------- */}
      {/* 8. EXPENSES TAB */}
      {/* ------------------------------------------------------------- */}
      {activeTab === 'expenses' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-5 bg-white rounded-2xl p-5 border border-slate-200 shadow-sm space-y-4">
            <h3 className="font-extrabold text-slate-900 text-sm sm:text-base flex items-center gap-2">
              <DollarSign className="w-4 h-4 text-agro-700" />
              <span>दुकान खर्च नोंदवा (Record Expense)</span>
            </h3>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">खर्च प्रकार (Category)</label>
                <select
                  value={expCategory}
                  onChange={(e) => setExpCategory(e.target.value)}
                  className="w-full border border-slate-300 rounded-lg p-2 bg-white font-semibold"
                >
                  <option value="RENT">दुकान भाडे (Shop Rent)</option>
                  <option value="SALARY">कर्मचारी पगार (Staff Salary)</option>
                  <option value="ELECTRICITY">वीज बिल (Electricity)</option>
                  <option value="TRANSPORT">वाहतूक व हमाली (Transport & Hamali)</option>
                  <option value="MARKETING">जाहिरात व प्रचार (Marketing)</option>
                  <option value="TEA_SNACKS">चहा-पाणी व इतर (Tea & Snacks)</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">रक्कम (₹ Amount)</label>
                <input
                  type="number"
                  value={expAmount}
                  onChange={(e) => setExpAmount(Number(e.target.value))}
                  className="w-full border border-slate-300 rounded-lg p-2"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">कोणाला दिले (Vendor / Recipient)</label>
                <input
                  type="text"
                  value={expVendor}
                  onChange={(e) => setExpVendor(e.target.value)}
                  className="w-full border border-slate-300 rounded-lg p-2"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">टीप / तपशील (Notes)</label>
                <input
                  type="text"
                  value={expNotes}
                  onChange={(e) => setExpNotes(e.target.value)}
                  className="w-full border border-slate-300 rounded-lg p-2"
                />
              </div>

              <button
                onClick={handleRecordExpense}
                className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold py-3 rounded-xl transition shadow flex items-center justify-center gap-2 mt-2"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>खर्च नोंद सेव्ह करा</span>
              </button>
            </div>
          </div>

          <div className="lg:col-span-7 bg-white rounded-2xl p-5 border border-slate-200 shadow-sm space-y-4">
            <h3 className="font-extrabold text-slate-900 text-sm">झालेले खर्च (Expense Records)</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 text-slate-600 font-bold border-b border-slate-200">
                  <tr>
                    <th className="p-2.5">प्रकार</th>
                    <th className="p-2.5">रक्कम</th>
                    <th className="p-2.5">तपशील</th>
                    <th className="p-2.5">पेमेंट मार्ग</th>
                    <th className="p-2.5">तारीख</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {expenses.map((e) => (
                    <tr key={e.id} className="hover:bg-slate-50/80">
                      <td className="p-2.5 font-bold text-slate-900">{e.category}</td>
                      <td className="p-2.5 font-extrabold text-rose-700">₹{e.amount}</td>
                      <td className="p-2.5 text-slate-600">{e.vendor}</td>
                      <td className="p-2.5 text-slate-500">{e.paymentMethod}</td>
                      <td className="p-2.5 text-slate-400">{new Date(e.createdAt).toLocaleDateString('mr-IN')}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ------------------------------------------------------------- */}
      {/* 9. WHATSAPP AI BOT TEST TAB */}
      {/* ------------------------------------------------------------- */}
      {activeTab === 'whatsapp' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-5 bg-white rounded-2xl p-5 border border-slate-200 shadow-sm space-y-4">
            <h3 className="font-extrabold text-slate-900 text-sm sm:text-base flex items-center gap-2">
              <MessageCircle className="w-4 h-4 text-emerald-600" />
              <span>WhatsApp शेतकरी बॉट टेस्ट</span>
            </h3>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">शेतकरी नाव</label>
                <input
                  type="text"
                  value={simName}
                  onChange={(e) => setSimName(e.target.value)}
                  className="w-full border border-slate-300 rounded-lg p-2"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">मेसेज टाईप करा</label>
                <textarea
                  rows={3}
                  value={simMessage}
                  onChange={(e) => setSimMessage(e.target.value)}
                  placeholder="उदा. कांदा करप्यासाठी कोणते औषध मारू?"
                  className="w-full border border-slate-300 rounded-lg p-2 text-xs"
                />
              </div>

              <button
                onClick={handleSendSimMessage}
                disabled={simLoading}
                className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold py-2.5 rounded-xl transition shadow flex items-center justify-center gap-2"
              >
                <Send className="w-4 h-4" />
                <span>व्हॉट्सॲप मेसेज पाठवा</span>
              </button>
            </div>
          </div>

          <div className="lg:col-span-7 bg-[#0b141a] rounded-2xl p-4 shadow-xl border border-slate-800 flex flex-col justify-between h-[450px]">
            <div className="bg-[#202c33] p-3 rounded-xl flex items-center gap-3 text-white text-xs font-bold">
              <div className="w-8 h-8 rounded-full bg-emerald-600 flex items-center justify-center">
                <Sprout className="w-4 h-4 text-white" />
              </div>
              <div>
                <p>श्री कृष्ण ॲग्रो सर्व्हिसेस (अधिकृत AI असिस्टंट)</p>
                <p className="text-[10px] text-emerald-400">ऑनलाइन • २४/७ तत्पर</p>
              </div>
            </div>

            <div className="space-y-3 overflow-y-auto p-2">
              {simHistory.map((msg, i) => (
                <div
                  key={i}
                  className={`flex flex-col ${msg.role === 'user' ? 'items-end' : 'items-start'}`}
                >
                  <div
                    className={`max-w-[85%] p-3 rounded-2xl text-xs leading-relaxed ${
                      msg.role === 'user'
                        ? 'bg-[#005c4b] text-white rounded-tr-none'
                        : 'bg-[#202c33] text-slate-100 rounded-tl-none whitespace-pre-line'
                    }`}
                  >
                    {msg.text}
                  </div>
                  <span className="text-[10px] text-slate-500 mt-0.5 px-1">{msg.timestamp}</span>
                </div>
              ))}
              {simLoading && (
                <div className="text-xs text-slate-400 animate-pulse">बॉट टाईप करत आहे...</div>
              )}
            </div>

            <div className="pt-2 text-center text-[10px] text-slate-500">
              💡 हा सिम्युलेटर प्रत्यक्ष शेतकरी व्हॉट्सॲपवर कसा संवाद साधतो ते दाखवतो.
            </div>
          </div>
        </div>
      )}

      {/* ------------------------------------------------------------- */}
      {/* 10. OWNER AI ADVISORY TAB */}
      {/* ------------------------------------------------------------- */}
      {activeTab === 'owner_ai' && (
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-5">
          <div className="flex items-center gap-2 font-extrabold text-slate-900 text-lg">
            <Bot className="w-5 h-5 text-agro-700" />
            <span>दुकान मालक AI व्यवसाय सल्लागार (Owner Copilot)</span>
          </div>

          <div className="flex gap-2">
            <input
              type="text"
              value={aiQuery}
              onChange={(e) => setAiQuery(e.target.value)}
              placeholder="उदा. सर्वाधिक नफा देणारी औषधे कोणती?"
              className="flex-1 border border-slate-300 rounded-xl px-4 py-2.5 text-xs sm:text-sm focus:ring-1 focus:ring-agro-600"
            />
            <button
              onClick={handleRunAi}
              disabled={aiLoading}
              className="bg-agro-800 hover:bg-agro-900 text-white font-bold px-5 py-2.5 rounded-xl text-xs transition flex items-center gap-1.5"
            >
              <Sparkles className="w-4 h-4 text-emerald-300" />
              <span>{aiLoading ? 'विश्लेषण सुरू आहे...' : 'विश्लेषण करा'}</span>
            </button>
          </div>

          {aiResponse && (
            <div className="bg-emerald-50 border border-emerald-200 p-5 rounded-2xl space-y-3">
              <h4 className="font-extrabold text-emerald-950 text-sm">AI विश्लेषण निष्कर्ष:</h4>
              <p className="text-xs sm:text-sm text-emerald-900 whitespace-pre-line leading-relaxed">
                {aiResponse.analysis}
              </p>
              <div className="pt-3 border-t border-emerald-200 text-xs font-bold text-emerald-950">
                🎯 कृती शिफारस: {aiResponse.recommendation}
              </div>
            </div>
          )}
        </div>
      )}

      {/* ============================================================= */}
      {/* MODAL: ADD / EDIT PRODUCT */}
      {/* ============================================================= */}
      {productModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto space-y-5 shadow-2xl">
            <div className="flex justify-between items-center pb-3 border-b border-slate-100">
              <h3 className="font-extrabold text-slate-900 text-base">
                {editingProductId ? 'उत्पादन एडिट करा' : 'नवीन कृषी औषध / खत जोडा'}
              </h3>
              <button
                onClick={() => setProductModalOpen(false)}
                className="text-slate-400 hover:text-slate-700 text-lg font-bold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveProduct} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">मराठी नाव (Name in Marathi)*</label>
                  <input
                    type="text"
                    required
                    value={pNameMr}
                    onChange={(e) => setPNameMr(e.target.value)}
                    placeholder="उदा. बायर नॅटिव्हो बुरशीनाशक"
                    className="w-full border border-slate-300 rounded-lg p-2 font-semibold"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">इंग्रजी नाव (English Name)</label>
                  <input
                    type="text"
                    value={pNameEn}
                    onChange={(e) => setPNameEn(e.target.value)}
                    placeholder="उदा. Bayer Nativo 100g"
                    className="w-full border border-slate-300 rounded-lg p-2"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">वर्गवारी (Category)</label>
                  <select
                    value={pCategoryId}
                    onChange={(e) => setPCategoryId(e.target.value)}
                    className="w-full border border-slate-300 rounded-lg p-2 bg-white font-semibold"
                  >
                    {INITIAL_CATEGORIES.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.nameMr} ({c.nameEn})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">कंपनी / ब्रँड (Brand)</label>
                  <input
                    type="text"
                    value={pBrandName}
                    onChange={(e) => setPBrandName(e.target.value)}
                    placeholder="उदा. Bayer, Syngenta, Mahadhan"
                    className="w-full border border-slate-300 rounded-lg p-2 font-semibold"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">पॅकिंग साईज (Pack Size)</label>
                  <input
                    type="text"
                    value={pPackSize}
                    onChange={(e) => setPPackSize(e.target.value)}
                    placeholder="उदा. १ किलो बॅग, ५०० मिली बॉटल"
                    className="w-full border border-slate-300 rounded-lg p-2"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">चालू विक्री दर (Selling Price ₹)*</label>
                  <input
                    type="number"
                    required
                    value={pSellingPrice}
                    onChange={(e) => setPSellingPrice(Number(e.target.value))}
                    className="w-full border border-slate-300 rounded-lg p-2 font-extrabold text-emerald-800"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">कंपनी खरेदी दर (Purchase Cost ₹)</label>
                  <input
                    type="number"
                    value={pPurchasePrice}
                    onChange={(e) => setPPurchasePrice(Number(e.target.value))}
                    className="w-full border border-slate-300 rounded-lg p-2"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">साठा संख्या (Current Stock Quantity)*</label>
                  <input
                    type="number"
                    required
                    value={pInitialStock}
                    onChange={(e) => setPInitialStock(Number(e.target.value))}
                    className="w-full border border-slate-300 rounded-lg p-2 font-bold"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">तांत्रिक घटक (Technical Name)</label>
                  <input
                    type="text"
                    value={pTechnicalName}
                    onChange={(e) => setPTechnicalName(e.target.value)}
                    placeholder="उदा. Tebuconazole 50% + Trifloxystrobin 25%"
                    className="w-full border border-slate-300 rounded-lg p-2"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">फवारणी प्रमाण (Dosage Guide)</label>
                  <input
                    type="text"
                    value={pDosageGuide}
                    onChange={(e) => setPDosageGuide(e.target.value)}
                    placeholder="उदा. ०.५ ग्रॅम प्रति लिटर पाणी"
                    className="w-full border border-slate-300 rounded-lg p-2"
                  />
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setProductModalOpen(false)}
                  className="px-4 py-2 text-slate-600 font-bold hover:bg-slate-100 rounded-xl"
                >
                  रद्द करा
                </button>
                <button
                  type="submit"
                  className="bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold px-6 py-2 rounded-xl transition shadow"
                >
                  सेव्ह करा (Save Product)
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ============================================================= */}
      {/* MODAL: COLLECT KHATA PAYMENT */}
      {/* ============================================================= */}
      {paymentModalOpen && selectedKhataCustomer && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 max-w-md w-full space-y-4 shadow-2xl">
            <div className="flex justify-between items-center pb-2 border-b border-slate-100">
              <h3 className="font-extrabold text-slate-900 text-base">शेतकरी उधारी जमा करा</h3>
              <button onClick={() => setPaymentModalOpen(false)} className="text-slate-400 font-bold">
                ✕
              </button>
            </div>

            <div className="bg-amber-50 border border-amber-200 p-3 rounded-xl text-xs">
              <p className="font-bold text-amber-950">{selectedKhataCustomer.name}</p>
              <p className="text-amber-800">गाव: {selectedKhataCustomer.village} • फोन: {selectedKhataCustomer.phone}</p>
              <p className="font-extrabold text-amber-950 mt-1">
                सध्याची उधारी शिल्लक: ₹{selectedKhataCustomer.outstandingBalance}
              </p>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">आता जमा रक्कम (₹ Amount)</label>
                <input
                  type="number"
                  value={collectAmount}
                  onChange={(e) => setCollectAmount(Number(e.target.value))}
                  className="w-full border border-slate-300 rounded-lg p-2.5 font-extrabold text-emerald-800 text-base"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">पावती टीप (Receipt Notes)</label>
                <input
                  type="text"
                  value={collectNotes}
                  onChange={(e) => setCollectNotes(e.target.value)}
                  placeholder="उदा. कांदा विक्री झाल्यावर रोख भरणा"
                  className="w-full border border-slate-300 rounded-lg p-2"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  onClick={() => setPaymentModalOpen(false)}
                  className="px-4 py-2 text-slate-600 font-bold hover:bg-slate-100 rounded-xl"
                >
                  रद्द करा
                </button>
                <button
                  onClick={handleRecordKhataPayment}
                  className="bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold px-5 py-2 rounded-xl transition shadow"
                >
                  खात्यावर जमा करा
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
