import { UserRole } from './auth';

export interface Category {
  id: string;
  nameEn: string;
  nameMr: string;
  slug: string;
  icon: string;
  descriptionEn: string;
  descriptionMr: string;
  isDemo: boolean;
}

export interface Brand {
  id: string;
  name: string;
  manufacturer: string;
  logoUrl?: string;
  isDemo: boolean;
}

export interface ProductBatch {
  id: string;
  productId: string;
  batchNumber: string;
  mfgDate: string;
  expiryDate: string;
  purchaseCost: number;
  currentStock: number;
  isDemo: boolean;
}

export interface Product {
  id: string;
  nameEn: string;
  nameMr: string;
  brandId: string;
  brandName: string;
  categoryId: string;
  categoryNameEn: string;
  categoryNameMr: string;
  sku: string;
  hsnCode: string;
  unit: string;
  packSize: string;
  mrp: number;
  sellingPrice: number;
  purchasePrice: number;
  gstRate: number;
  totalStock: number;
  minStockLevel: number;
  isAvailable: boolean;
  imageUrl?: string;
  technicalName?: string;
  targetCrops?: string;
  dosageGuide?: string;
  descriptionEn?: string;
  descriptionMr?: string;
  batches: ProductBatch[];
  isDemo: boolean;
  createdAt: string;
}

export interface CustomerCrop {
  id: string;
  cropName: string;
  acreage: number;
  season: string;
}

export interface Customer {
  id: string;
  name: string;
  phone: string;
  village: string;
  taluka: string;
  district: string;
  totalLandAcres: number;
  outstandingBalance: number;
  creditLimit: number;
  crops: CustomerCrop[];
  isDemo: boolean;
  createdAt: string;
}

export interface Supplier {
  id: string;
  name: string;
  contactPerson: string;
  phone: string;
  email: string;
  gstin: string;
  address: string;
  city: string;
  outstandingPayable: number;
  isDemo: boolean;
  createdAt: string;
}

export type StockMovementType =
  | 'OPENING_STOCK'
  | 'PURCHASE'
  | 'SALE'
  | 'SALES_RETURN'
  | 'PURCHASE_RETURN'
  | 'DAMAGE'
  | 'EXPIRED'
  | 'ADJUSTMENT';

export interface StockMovement {
  id: string;
  productId: string;
  productName: string;
  batchId?: string;
  batchNumber?: string;
  movementType: StockMovementType;
  quantity: number;
  unitCost: number;
  referenceType?: string;
  referenceId?: string;
  notes?: string;
  performedBy: string;
  isDemo: boolean;
  createdAt: string;
}

export interface SaleItem {
  id: string;
  productId: string;
  productName: string;
  batchId?: string;
  batchNumber?: string;
  quantity: number;
  unitPrice: number;
  gstRate: number;
  taxAmount: number;
  totalPrice: number;
}

export interface Sale {
  id: string;
  invoiceNumber: string;
  customerId?: string;
  customerName: string;
  customerPhone?: string;
  customerVillage?: string;
  subtotal: number;
  taxAmount: number;
  discountAmount: number;
  grandTotal: number;
  paidAmount: number;
  balanceAmount: number;
  paymentStatus: 'PAID' | 'PARTIAL' | 'UNPAID';
  paymentMethod: 'CASH' | 'UPI' | 'BANK_TRANSFER' | 'CREDIT';
  items: SaleItem[];
  notes?: string;
  createdByName: string;
  isDemo: boolean;
  createdAt: string;
}

export interface PurchaseItem {
  id: string;
  productId: string;
  productName: string;
  batchNumber: string;
  mfgDate: string;
  expiryDate: string;
  quantity: number;
  unitCost: number;
  gstRate: number;
  totalCost: number;
}

export interface Purchase {
  id: string;
  invoiceNumber: string;
  supplierId: string;
  supplierName: string;
  subtotal: number;
  taxAmount: number;
  freightCost: number;
  otherCosts: number;
  grandTotal: number;
  paidAmount: number;
  balanceAmount: number;
  paymentStatus: 'PAID' | 'PARTIAL' | 'UNPAID';
  paymentMethod: 'CASH' | 'UPI' | 'BANK_TRANSFER' | 'CREDIT';
  items: PurchaseItem[];
  notes?: string;
  createdByName: string;
  isDemo: boolean;
  createdAt: string;
}

export interface QuotationItem {
  id: string;
  productId: string;
  productName: string;
  packSize: string;
  quantity: number;
  unitPrice: number;
  discountPercent: number;
  gstRate: number;
  taxAmount: number;
  totalPrice: number;
}

export interface Quotation {
  id: string;
  quotationNumber: string;
  customerId?: string;
  customerName: string;
  customerPhone: string;
  customerVillage?: string;
  subtotal: number;
  discountAmount: number;
  taxAmount: number;
  deliveryCharges: number;
  grandTotal: number;
  validUntil: string;
  status: 'DRAFT' | 'SENT' | 'ACCEPTED' | 'REJECTED' | 'EXPIRED' | 'CONVERTED';
  notes?: string;
  terms?: string;
  items: QuotationItem[];
  createdByName: string;
  isDemo: boolean;
  createdAt: string;
}

export interface Expense {
  id: string;
  category: 'RENT' | 'ELECTRICITY' | 'SALARY' | 'TRANSPORT' | 'MARKETING' | 'MAINTENANCE' | 'OFFICE' | 'INTERNET' | 'OTHER';
  amount: number;
  paymentMethod: 'CASH' | 'UPI' | 'BANK_TRANSFER';
  vendor: string;
  receiptUrl?: string;
  notes?: string;
  expenseDate: string;
  recordedByName: string;
  isDemo: boolean;
  createdAt: string;
}

export interface WhatsAppMessageRecord {
  id: string;
  phone: string;
  senderName: string;
  direction: 'INBOUND' | 'OUTBOUND';
  content: string;
  intent?: string;
  toolCalled?: string;
  isDemo: boolean;
  createdAt: string;
}

export interface BusinessProfile {
  legalName: string;
  displayName: string;
  taglineMr: string;
  taglineEn: string;
  address: string;
  village: string;
  taluka: string;
  district: string;
  state: string;
  pincode: string;
  phonePrimary: string;
  phoneSecondary: string;
  whatsappNumber: string;
  email: string;
  businessTimings: string;
  gstin: string;
  fertilizerLicense: string;
  seedLicense: string;
  pesticideLicense: string;
  shopActLicense: string;
  upiId: string;
  merchantName: string;
  bankName: string;
  bankAccountNo: string;
  bankIfsc: string;
  bankBranch: string;
  isDemo: boolean;
}

export interface StaffMember {
  id: string;
  name: string;
  phone: string;
  email?: string;
  role: UserRole;
  qualification?: string;
  isActive: boolean;
  isDemo: boolean;
  createdAt: string;
}

// -------------------------------------------------------------
// Realistic Sinnar / Nashik Demo Data
// -------------------------------------------------------------
export const INITIAL_BUSINESS_PROFILE: BusinessProfile = {
  legalName: "Shri Krishna Agro Services",
  displayName: "श्री कृष्ण ॲग्रो सर्व्हिसेस (Shri Krishna Agro Services)",
  taglineMr: "विश्वासू कृषी निविष्ठा व आधुनिक पीक सल्ला केंद्र",
  taglineEn: "Trusted Agricultural Inputs & Modern Crop Advisory Center",
  address: "मुख्य बाजारपेठ, सिन्नर (Main Market, Sinnar)",
  village: "सिन्नर (Sinnar)",
  taluka: "सिन्नर (Sinnar)",
  district: "नाशिक (Nashik)",
  state: "महाराष्ट्र (Maharashtra)",
  pincode: "422103",
  phonePrimary: "+91 8605620843", // Shubham Gamane
  phoneSecondary: "+91 8888474456", // Jagdish Bodke
  whatsappNumber: "+91 8605620843",
  email: "contact@shrikrishnaagro.in",
  businessTimings: "सकाळी ८:०० ते रात्री ८:३० (दररोज सुरू)",
  gstin: "27AAAFS5678K1Z5",
  fertilizerLicense: "FL/NSK/SINNAR/2024/089",
  seedLicense: "SL/NSK/SINNAR/2024/112",
  pesticideLicense: "PL/NSK/SINNAR/2024/045",
  shopActLicense: "SA/SINNAR/2024/4512",
  upiId: "shrikrishnaagro@okhdfcbank",
  merchantName: "Shri Krishna Agro Services",
  bankName: "HDFC Bank",
  bankAccountNo: "50200084917597",
  bankIfsc: "HDFC0000849",
  bankBranch: "Sinnar Main Branch",
  isDemo: true,
};

export const INITIAL_CATEGORIES: Category[] = [
  {
    id: "cat-1",
    nameEn: "Water Soluble Fertilizers",
    nameMr: "विद्राव्य खते (19:19:19, 0:52:34)",
    slug: "water-soluble-fertilizers",
    icon: "Droplets",
    descriptionEn: "High-grade 100% drip & foliar water soluble nutrients",
    descriptionMr: "ठिबक व फवारणीसाठी १००% विद्राव्य उच्च दर्जाची खते",
    isDemo: true,
  },
  {
    id: "cat-2",
    nameEn: "Chemical & Organic Fertilizers",
    nameMr: "रासायनिक व सेंद्रिय खते",
    slug: "fertilizers",
    icon: "Layers",
    descriptionEn: "Soil application fertilizers, DAP, MOP, 10:26:26, Potash",
    descriptionMr: "जमिनीतून देण्याची रासायनिक व सेंद्रिय खते (डीएपी, १०:२६:२६)",
    isDemo: true,
  },
  {
    id: "cat-3",
    nameEn: "Fungicides",
    nameMr: "बुरशीनाशके",
    slug: "fungicides",
    icon: "ShieldAlert",
    descriptionEn: "Systemic & contact fungicides for blight, powdery mildew & rot",
    descriptionMr: "कांदा करपा, द्राक्ष डावणी, भुरी व डाळिंब तेल्या नियंत्रक औषधे",
    isDemo: true,
  },
  {
    id: "cat-4",
    nameEn: "Insecticides",
    nameMr: "कीटकनाशके",
    slug: "insecticides",
    icon: "Bug",
    descriptionEn: "Broad spectrum protection against thrips, borers, aphids & mites",
    descriptionMr: "कांदा थ्रिप्स, अळी, तुडतुडे व खोडकिडीवर प्रभावी कीटकनाशके",
    isDemo: true,
  },
  {
    id: "cat-5",
    nameEn: "Seeds & Hybrids",
    nameMr: "प्रमाणित बियाणे",
    slug: "seeds",
    icon: "Sprout",
    descriptionEn: "High-yielding onion, vegetable, maize & fodder hybrid seeds",
    descriptionMr: "सिन्नर हवामानासाठी उपयुक्त दर्जेदार कांदा, भाजीपाला व मका बियाणे",
    isDemo: true,
  },
  {
    id: "cat-6",
    nameEn: "Micronutrients & Secondary Nutrients",
    nameMr: "सूक्ष्म अन्नद्रव्ये व सल्फर",
    slug: "micronutrients",
    icon: "Sparkles",
    descriptionEn: "Chelated Zinc, Boron, Ferrous, Magnesium, Calcium Nitrate",
    descriptionMr: "चिलेटेड झिंक, बोरॉन, मॅग्नेशियम सल्फेट व कॅल्शियम नायट्रेट",
    isDemo: true,
  },
  {
    id: "cat-7",
    nameEn: "Plant Growth Regulators & Tonics",
    nameMr: "टॉनिक व पीजीआर (PGR)",
    slug: "tonics-pgr",
    icon: "Zap",
    descriptionEn: "Flowering boosters, fruit development tonics, seaweed extracts",
    descriptionMr: "फुलधारणा वाढवणारे, फळ फुगवण व चमकदार रंगासाठीचे टॉनिक",
    isDemo: true,
  },
  {
    id: "cat-8",
    nameEn: "Herbicides & Weedicides",
    nameMr: "तणनाशके",
    slug: "herbicides",
    icon: "Scissors",
    descriptionEn: "Pre-emergence & post-emergence weed killers for crops",
    descriptionMr: "कांदा व इतर पिकांमधील अरुंद व रुंद पानांचे तण नियंत्रक",
    isDemo: true,
  },
];

export const INITIAL_BRANDS: Brand[] = [
  { id: "br-1", name: "Mahadhan", manufacturer: "Deepak Fertilisers", isDemo: true },
  { id: "br-2", name: "Yara India", manufacturer: "Yara International", isDemo: true },
  { id: "br-3", name: "Bayer CropScience", manufacturer: "Bayer AG", isDemo: true },
  { id: "br-4", name: "Syngenta India", manufacturer: "Syngenta Group", isDemo: true },
  { id: "br-5", name: "UPL Limited", manufacturer: "UPL Ltd", isDemo: true },
  { id: "br-6", name: "Dhanuka Agritech", manufacturer: "Dhanuka", isDemo: true },
  { id: "br-7", name: "Sumitomo Chemical", manufacturer: "Sumitomo", isDemo: true },
  { id: "br-8", name: "Advanta Seeds", manufacturer: "Advanta Enterprise", isDemo: true },
  { id: "br-9", name: "Multiplex", manufacturer: "Multiplex Group", isDemo: true },
];

export const INITIAL_PRODUCTS: Product[] = [
  {
    id: "prod-1",
    nameEn: "Mahadhan 19:19:19 (Starter Grade)",
    nameMr: "महाधन १९:१९:१९ (विद्राव्य खत)",
    brandId: "br-1",
    brandName: "Mahadhan",
    categoryId: "cat-1",
    categoryNameEn: "Water Soluble Fertilizers",
    categoryNameMr: "विद्राव्य खते",
    sku: "MDH-191919-1KG",
    hsnCode: "31052000",
    unit: "Kg",
    packSize: "1 Kg Bag",
    mrp: 220,
    sellingPrice: 190,
    purchasePrice: 155,
    gstRate: 5,
    totalStock: 85,
    minStockLevel: 20,
    isAvailable: true,
    technicalName: "NPK 19:19:19 100% Water Soluble",
    targetCrops: "कांदा, द्राक्ष, डाळिंब, टोमॅटो, भाजीपाला",
    dosageGuide: "५ ग्रॅम प्रति लिटर पाणी फवारणी किंवा ३-५ किलो प्रति एकर ठिबकद्वारे",
    descriptionEn: "Balanced NPK for vegetative growth and root establishment.",
    descriptionMr: "पिकांच्या सुरुवातीच्या शाकीय वाढीसाठी व मुळांच्या विकासासाठी परिपूर्ण संतुलित खत.",
    batches: [
      {
        id: "batch-1a",
        productId: "prod-1",
        batchNumber: "MDH-24-B101",
        mfgDate: "2024-05-10",
        expiryDate: "2027-05-09",
        purchaseCost: 155,
        currentStock: 85,
        isDemo: true,
      },
    ],
    isDemo: true,
    createdAt: new Date().toISOString(),
  },
  {
    id: "prod-2",
    nameEn: "Mahadhan 0:52:34 (Monopotassium Phosphate)",
    nameMr: "महाधन ०:५२:३४ (मोनो पोटॅशियम फॉस्फेट)",
    brandId: "br-1",
    brandName: "Mahadhan",
    categoryId: "cat-1",
    categoryNameEn: "Water Soluble Fertilizers",
    categoryNameMr: "विद्राव्य खते",
    sku: "MDH-05234-1KG",
    hsnCode: "31052000",
    unit: "Kg",
    packSize: "1 Kg Bag",
    mrp: 280,
    sellingPrice: 245,
    purchasePrice: 195,
    gstRate: 5,
    totalStock: 60,
    minStockLevel: 15,
    isAvailable: true,
    technicalName: "Monopotassium Phosphate (00:52:34)",
    targetCrops: "कांदा (गाठ फुगवण), द्राक्ष, डाळिंब, टोमॅटो",
    dosageGuide: "५-७ ग्रॅम प्रति लिटर पाणी फवारणी किंवा ४-५ किलो प्रति एकर",
    descriptionEn: "High phosphorus and potash for heavy flowering and bulb formation.",
    descriptionMr: "कांदा गाठ फुगवणीसाठी आणि फळांच्या व कळ्यांच्या योग्य विकासासाठी उत्कृष्ट.",
    batches: [
      {
        id: "batch-2a",
        productId: "prod-2",
        batchNumber: "MDH-24-B109",
        mfgDate: "2024-06-01",
        expiryDate: "2027-05-31",
        purchaseCost: 195,
        currentStock: 60,
        isDemo: true,
      },
    ],
    isDemo: true,
    createdAt: new Date().toISOString(),
  },
  {
    id: "prod-3",
    nameEn: "YaraLiva Nitrabor (Calcium Nitrate + Boron)",
    nameMr: "यारालिवा नायट्राबोर (कॅल्शियम नायट्रेट + बोरॉन)",
    brandId: "br-2",
    brandName: "Yara India",
    categoryId: "cat-6",
    categoryNameEn: "Micronutrients & Secondary Nutrients",
    categoryNameMr: "सूक्ष्म अन्नद्रव्ये",
    sku: "YARA-NITRA-25KG",
    hsnCode: "31026000",
    unit: "Bag",
    packSize: "25 Kg Bag",
    mrp: 2150,
    sellingPrice: 1950,
    purchasePrice: 1680,
    gstRate: 5,
    totalStock: 28,
    minStockLevel: 10,
    isAvailable: true,
    technicalName: "Calcium Nitrate with 0.3% Boron",
    targetCrops: "द्राक्ष, डाळिंब (फळ तडकणे रोखण्यासाठी), टोमॅटो, कांदा",
    dosageGuide: "१०-१५ किलो प्रति एकर ठिबकद्वारे किंवा जमिनीतून",
    descriptionEn: "Premium soluble calcium and boron to prevent fruit cracking and improve storage life.",
    descriptionMr: "फळे तडकणे थांबवण्यासाठी, चमक आणण्यासाठी व कांद्याची टिकवण क्षमता वाढवण्यासाठी.",
    batches: [
      {
        id: "batch-3a",
        productId: "prod-3",
        batchNumber: "YAR-24-992",
        mfgDate: "2024-03-15",
        expiryDate: "2027-03-14",
        purchaseCost: 1680,
        currentStock: 28,
        isDemo: true,
      },
    ],
    isDemo: true,
    createdAt: new Date().toISOString(),
  },
  {
    id: "prod-4",
    nameEn: "Bayer Nativo (Tebuconazole + Trifloxystrobin)",
    nameMr: "बायर नॅटिव्हो (बुरशीनाशक)",
    brandId: "br-3",
    brandName: "Bayer CropScience",
    categoryId: "cat-3",
    categoryNameEn: "Fungicides",
    categoryNameMr: "बुरशीनाशके",
    sku: "BAY-NAT-100G",
    hsnCode: "38089290",
    unit: "Bottle",
    packSize: "100 Gm",
    mrp: 850,
    sellingPrice: 760,
    purchasePrice: 620,
    gstRate: 18,
    totalStock: 45,
    minStockLevel: 10,
    isAvailable: true,
    technicalName: "Tebuconazole 50% + Trifloxystrobin 25% WG",
    targetCrops: "द्राक्ष (भुरी/डावणी), कांदा (जांभळा करपा), टोमॅटो",
    dosageGuide: "०.५ ग्रॅम प्रति लिटर पाणी (१०० ग्रॅम प्रति २०० लिटर पाणी)",
    descriptionEn: "Broad spectrum dual systemic fungicide providing long-lasting protective and curative action.",
    descriptionMr: "कांदा जांभळा करपा आणि द्राक्ष बागेतील भुरी व रोगांवर अत्यंत प्रभावी दुहेरी आंतरप्रवाही बुरशीनाशक.",
    batches: [
      {
        id: "batch-4a",
        productId: "prod-4",
        batchNumber: "BY-NAT-771",
        mfgDate: "2024-04-10",
        expiryDate: "2026-09-20", // Expiring within ~35 days from simulated baseline
        purchaseCost: 620,
        currentStock: 45,
        isDemo: true,
      },
    ],
    isDemo: true,
    createdAt: new Date().toISOString(),
  },
  {
    id: "prod-5",
    nameEn: "Syngenta Amistar Top",
    nameMr: "सिंजेन्टा ॲमिस्टार टॉप (बुरशीनाशक)",
    brandId: "br-4",
    brandName: "Syngenta India",
    categoryId: "cat-3",
    categoryNameEn: "Fungicides",
    categoryNameMr: "बुरशीनाशके",
    sku: "SYN-AMIS-200ML",
    hsnCode: "38089290",
    unit: "Bottle",
    packSize: "200 ml",
    mrp: 1450,
    sellingPrice: 1280,
    purchasePrice: 1050,
    gstRate: 18,
    totalStock: 32,
    minStockLevel: 8,
    isAvailable: true,
    technicalName: "Azoxystrobin 18.2% + Difenoconazole 11.4% SC",
    targetCrops: "कांदा, डाळिंब (अँथ्रॅकनोज), द्राक्ष, टोमॅटो",
    dosageGuide: "१ मिली प्रति लिटर पाणी फवारणी",
    descriptionEn: "Superior preventive and curative fungicide that enhances plant vigor and disease resistance.",
    descriptionMr: "कांदा पीक हिरवेगार ठेवून करपा व बुरशीजन्य रोगांपासून संपूर्ण संरक्षण देणारे औषध.",
    batches: [
      {
        id: "batch-5a",
        productId: "prod-5",
        batchNumber: "SYN-AMT-441",
        mfgDate: "2024-02-18",
        expiryDate: "2026-09-10", // Alert expiry
        purchaseCost: 1050,
        currentStock: 32,
        isDemo: true,
      },
    ],
    isDemo: true,
    createdAt: new Date().toISOString(),
  },
  {
    id: "prod-6",
    nameEn: "FMC Coragen (Chlorantraniliprole 18.5% SC)",
    nameMr: "कोराजन (अळी व कीटक नियंत्रक)",
    brandId: "br-4",
    brandName: "Syngenta India",
    categoryId: "cat-4",
    categoryNameEn: "Insecticides",
    categoryNameMr: "कीटकनाशके",
    sku: "COR-60ML",
    hsnCode: "38089190",
    unit: "Bottle",
    packSize: "60 ml",
    mrp: 1050,
    sellingPrice: 940,
    purchasePrice: 780,
    gstRate: 18,
    totalStock: 3, // LOW STOCK TRIGGER (< minStockLevel of 10)
    minStockLevel: 10,
    isAvailable: true,
    technicalName: "Chlorantraniliprole 18.5% SC (Rynaxypyr)",
    targetCrops: "टोमॅटो फळपोखरणाऱ्या अळ्या, मका लष्करी अळी, कांदा",
    dosageGuide: "०.३ मिली प्रति लिटर पाणी (६० मिली प्रति एकर)",
    descriptionEn: "Long lasting systemic control against lepidopteran pests and borers.",
    descriptionMr: "अळी व खोडकिडीवर दीर्घकाळ नियंत्रण ठेवणारे जागतिक दर्जाचे कीटकनाशक.",
    batches: [
      {
        id: "batch-6a",
        productId: "prod-6",
        batchNumber: "CRG-24-09",
        mfgDate: "2024-01-11",
        expiryDate: "2027-01-10",
        purchaseCost: 780,
        currentStock: 3,
        isDemo: true,
      },
    ],
    isDemo: true,
    createdAt: new Date().toISOString(),
  },
  {
    id: "prod-7",
    nameEn: "Advanta Prashant Onion Seeds (Garwa)",
    nameMr: "अडव्हांटा प्रशांत कांदा बियाणे (गरवा कांदा)",
    brandId: "br-8",
    brandName: "Advanta Seeds",
    categoryId: "cat-5",
    categoryNameEn: "Seeds & Hybrids",
    categoryNameMr: "प्रमाणित बियाणे",
    sku: "ADV-ONION-500G",
    hsnCode: "12099190",
    unit: "Packet",
    packSize: "500 Gm Packet",
    mrp: 1600,
    sellingPrice: 1450,
    purchasePrice: 1180,
    gstRate: 0,
    totalStock: 50,
    minStockLevel: 15,
    isAvailable: true,
    technicalName: "Garwa Red Onion High Storage Seed",
    targetCrops: "रांगडा व उन्हाळी कांदा",
    dosageGuide: "२.५ ते ३ किलो बियाणे प्रति एकर रोपवाटिकेसाठी",
    descriptionEn: "High yield, dark red color, uniform bulb size and 6-7 months excellent storage life.",
    descriptionMr: "सिन्नर परिसरासाठी सर्वाधिक पसंतीचे ६-७ महिने उत्कृष्ट टिकवण क्षमता असणारे कांदा बियाणे.",
    batches: [
      {
        id: "batch-7a",
        productId: "prod-7",
        batchNumber: "ADV-24-S01",
        mfgDate: "2024-05-20",
        expiryDate: "2025-05-19",
        purchaseCost: 1180,
        currentStock: 50,
        isDemo: true,
      },
    ],
    isDemo: true,
    createdAt: new Date().toISOString(),
  },
  {
    id: "prod-8",
    nameEn: "Multiplex Chelated Zinc 12% (EDTA)",
    nameMr: "मल्टिप्लेक्स चिलेटेड झिंक १२% (EDTA)",
    brandId: "br-9",
    brandName: "Multiplex",
    categoryId: "cat-6",
    categoryNameEn: "Micronutrients & Secondary Nutrients",
    categoryNameMr: "सूक्ष्म अन्नद्रव्ये",
    sku: "MPX-ZN12-500G",
    hsnCode: "38089340",
    unit: "Packet",
    packSize: "500 Gm",
    mrp: 450,
    sellingPrice: 380,
    purchasePrice: 290,
    gstRate: 12,
    totalStock: 35,
    minStockLevel: 10,
    isAvailable: true,
    technicalName: "Chelated Zinc (Zn-EDTA 12%)",
    targetCrops: "कांदा, मका, द्राक्ष, टोमॅटो",
    dosageGuide: "१ ग्रॅम प्रति लिटर पाणी फवारणीसाठी",
    descriptionEn: "100% water soluble chelated zinc for rapid chlorophyll formation and curing yellowing.",
    descriptionMr: "पानांमधील पिवळेपणा दूर करून हरितद्रव्य वाढवणारे १००% विद्राव्य चिलेटेड झिंक.",
    batches: [
      {
        id: "batch-8a",
        productId: "prod-8",
        batchNumber: "MPX-ZN-11",
        mfgDate: "2024-04-01",
        expiryDate: "2027-03-31",
        purchaseCost: 290,
        currentStock: 35,
        isDemo: true,
      },
    ],
    isDemo: true,
    createdAt: new Date().toISOString(),
  },
];

export const INITIAL_CUSTOMERS: Customer[] = [
  {
    id: "cust-1",
    name: "Babasaheb Deshmukh",
    phone: "9822114477",
    village: "मुसळगाव (Musalgaon)",
    taluka: "Sinnar",
    district: "Nashik",
    totalLandAcres: 12,
    outstandingBalance: 14500,
    creditLimit: 75000,
    crops: [
      { id: "c1", cropName: "कांदा (Onion)", acreage: 6, season: "Kharif & Late Kharif" },
      { id: "c2", cropName: "द्राक्ष (Grapes)", acreage: 6, season: "Annual" },
    ],
    isDemo: true,
    createdAt: "2026-06-01T10:00:00Z",
  },
  {
    id: "cust-2",
    name: "Dnyaneshwar Avhad",
    phone: "9421558833",
    village: "डुबेरे (Dubere)",
    taluka: "Sinnar",
    district: "Nashik",
    totalLandAcres: 8,
    outstandingBalance: 6200,
    creditLimit: 50000,
    crops: [
      { id: "c3", cropName: "टोमॅटो (Tomato)", acreage: 4, season: "Kharif" },
      { id: "c4", cropName: "डाळिंब (Pomegranate)", acreage: 4, season: "Mrug Bahar" },
    ],
    isDemo: true,
    createdAt: "2026-06-15T11:30:00Z",
  },
  {
    id: "cust-3",
    name: "Rameshwar Shinde",
    phone: "9970123456",
    village: "वावी (Wavi)",
    taluka: "Sinnar",
    district: "Nashik",
    totalLandAcres: 5,
    outstandingBalance: 0,
    creditLimit: 40000,
    crops: [
      { id: "c5", cropName: "कांदा (Onion)", acreage: 3, season: "Rabi" },
      { id: "c6", cropName: "सोयाबीन (Soybean)", acreage: 2, season: "Kharif" },
    ],
    isDemo: true,
    createdAt: "2026-07-02T14:15:00Z",
  },
  {
    id: "cust-4",
    name: "Sanjay Gite",
    phone: "9890456789",
    village: "पांगरी (Pangri)",
    taluka: "Sinnar",
    district: "Nashik",
    totalLandAcres: 15,
    outstandingBalance: 28000,
    creditLimit: 100000,
    crops: [
      { id: "c7", cropName: "द्राक्ष (Grapes)", acreage: 10, season: "Export Quality" },
      { id: "c8", cropName: "कांदा (Onion)", acreage: 5, season: "Late Kharif" },
    ],
    isDemo: true,
    createdAt: "2026-07-10T09:45:00Z",
  },
  {
    id: "cust-5",
    name: "Eknath Sangale",
    phone: "9637889900",
    village: "दोडी (Dodi)",
    taluka: "Sinnar",
    district: "Nashik",
    totalLandAcres: 10,
    outstandingBalance: 4800,
    creditLimit: 50000,
    crops: [
      { id: "c9", cropName: "ऊस (Sugarcane)", acreage: 6, season: "Suru" },
      { id: "c10", cropName: "कांदा (Onion)", acreage: 4, season: "Kharif" },
    ],
    isDemo: true,
    createdAt: "2026-07-20T16:00:00Z",
  },
];

export const INITIAL_SUPPLIERS: Supplier[] = [
  {
    id: "sup-1",
    name: "Mahadhan Agritech Distributors",
    contactPerson: "Rajesh Kulkarni",
    phone: "9822001122",
    email: "mahadhan.nsk@distrib.in",
    gstin: "27AABCD1234E1Z1",
    address: "MIDC Ambad",
    city: "Nashik",
    outstandingPayable: 45000,
    isDemo: true,
    createdAt: "2026-05-01T08:00:00Z",
  },
  {
    id: "sup-2",
    name: "Yara Fertilisers India C&F",
    contactPerson: "Sunil Joshi",
    phone: "9822334455",
    email: "yara.west@yara.com",
    gstin: "27AACCY4455F1Z2",
    address: "Pune-Nashik Highway",
    city: "Nashik",
    outstandingPayable: 22000,
    isDemo: true,
    createdAt: "2026-05-10T08:00:00Z",
  },
  {
    id: "sup-3",
    name: "Bayer CropScience Hub Nashik",
    contactPerson: "Amol Patil",
    phone: "9860112233",
    email: "bayer.nashik@bayer.com",
    gstin: "27AABCB9988G1Z3",
    address: "Satpur MIDC",
    city: "Nashik",
    outstandingPayable: 34500,
    isDemo: true,
    createdAt: "2026-05-15T08:00:00Z",
  },
];

export const INITIAL_STAFF: StaffMember[] = [
  {
    id: "staff-owner",
    name: "Shri Krishna Agro Owner",
    phone: "9800000001",
    email: "owner@shrikrishnaagro.in",
    role: "OWNER",
    qualification: "Business Proprietor",
    isActive: true,
    isDemo: true,
    createdAt: "2026-01-01T00:00:00Z",
  },
  {
    id: "staff-shubham",
    name: "Shubham Gamane",
    phone: "8605620843",
    email: "shubham.gamane@shrikrishnaagro.in",
    role: "AGRONOMIST",
    qualification: "B.Sc Agri (MPKV Rahuri)",
    isActive: true,
    isDemo: true,
    createdAt: "2026-01-01T00:00:00Z",
  },
  {
    id: "staff-jagdish",
    name: "Jagdish Bodke",
    phone: "8888474456",
    email: "jagdish.bodke@shrikrishnaagro.in",
    role: "AGRONOMIST",
    qualification: "B.Sc Agri (MPKV Rahuri)",
    isActive: true,
    isDemo: true,
    createdAt: "2026-01-01T00:00:00Z",
  },
  {
    id: "staff-manager",
    name: "Kishor Gite",
    phone: "9800000002",
    email: "manager@shrikrishnaagro.in",
    role: "MANAGER",
    qualification: "Store Manager",
    isActive: true,
    isDemo: true,
    createdAt: "2026-02-01T00:00:00Z",
  },
  {
    id: "staff-cashier",
    name: "Prashant Shinde",
    phone: "9800000003",
    email: "billing@shrikrishnaagro.in",
    role: "CASHIER",
    qualification: "POS Billing Counter",
    isActive: true,
    isDemo: true,
    createdAt: "2026-03-01T00:00:00Z",
  },
  {
    id: "staff-accountant",
    name: "Suresh Pingle",
    phone: "9800000004",
    email: "accounts@shrikrishnaagro.in",
    role: "ACCOUNTANT",
    qualification: "B.Com / Accounts Head",
    isActive: true,
    isDemo: true,
    createdAt: "2026-03-15T00:00:00Z",
  },
];

export const INITIAL_QUOTATIONS: Quotation[] = [
  {
    id: "quote-1",
    quotationNumber: "QTN-2026-001",
    customerId: "cust-1",
    customerName: "Babasaheb Deshmukh",
    customerPhone: "9822114477",
    customerVillage: "मुसळगाव (Musalgaon)",
    subtotal: 5850,
    discountAmount: 150,
    taxAmount: 285,
    deliveryCharges: 0,
    grandTotal: 5985,
    validUntil: "2026-09-15T00:00:00Z",
    status: "SENT",
    notes: "कांदा लागवड व सुरुवातीच्या फवारणीसाठीचे खत व बुरशीनाशक कोटेशन",
    terms: "दर १५ दिवसांसाठी वैध आहेत. मालाची पोहोच सिन्नर गोडावूनमधून.",
    items: [
      {
        id: "qi-1",
        productId: "prod-1",
        productName: "Mahadhan 19:19:19 (Starter Grade)",
        packSize: "1 Kg Bag",
        quantity: 15,
        unitPrice: 190,
        discountPercent: 0,
        gstRate: 5,
        taxAmount: 142.5,
        totalPrice: 2850,
      },
      {
        id: "qi-2",
        productId: "prod-4",
        productName: "Bayer Nativo (Tebuconazole + Trifloxystrobin)",
        packSize: "100 Gm",
        quantity: 4,
        unitPrice: 750,
        discountPercent: 0,
        gstRate: 18,
        taxAmount: 540,
        totalPrice: 3000,
      },
    ],
    createdByName: "Shubham Gamane (B.Sc Agri)",
    isDemo: true,
    createdAt: "2026-08-16T10:30:00Z",
  },
  {
    id: "quote-2",
    quotationNumber: "QTN-2026-002",
    customerId: "cust-4",
    customerName: "Sanjay Gite",
    customerPhone: "9890456789",
    customerVillage: "पांगरी (Pangri)",
    subtotal: 9750,
    discountAmount: 250,
    taxAmount: 475,
    deliveryCharges: 0,
    grandTotal: 9975,
    validUntil: "2026-09-16T00:00:00Z",
    status: "ACCEPTED",
    notes: "द्राक्ष बागेसाठी नायट्राबोर व विद्राव्य खतांचे कोटेशन",
    terms: "थेट बँक किंवा UPI द्वारे पेमेंट स्वीकृती.",
    items: [
      {
        id: "qi-3",
        productId: "prod-3",
        productName: "YaraLiva Nitrabor (Calcium Nitrate + Boron)",
        packSize: "25 Kg Bag",
        quantity: 5,
        unitPrice: 1950,
        discountPercent: 0,
        gstRate: 5,
        taxAmount: 487.5,
        totalPrice: 9750,
      },
    ],
    createdByName: "Jagdish Bodke (B.Sc Agri)",
    isDemo: true,
    createdAt: "2026-08-16T14:20:00Z",
  },
];

export const INITIAL_EXPENSES: Expense[] = [
  {
    id: "exp-1",
    category: "RENT",
    amount: 15000,
    paymentMethod: "BANK_TRANSFER",
    vendor: "Shop Owner Sinnar Market",
    notes: "Monthly Shop Rent - August 2026",
    expenseDate: "2026-08-01T00:00:00Z",
    recordedByName: "Suresh Pingle (Accountant)",
    isDemo: true,
    createdAt: "2026-08-01T10:00:00Z",
  },
  {
    id: "exp-2",
    category: "ELECTRICITY",
    amount: 2450,
    paymentMethod: "UPI",
    vendor: "MSEDCL Sinnar",
    notes: "Shop electricity & godown lighting",
    expenseDate: "2026-08-05T00:00:00Z",
    recordedByName: "Suresh Pingle (Accountant)",
    isDemo: true,
    createdAt: "2026-08-05T12:00:00Z",
  },
  {
    id: "exp-3",
    category: "TRANSPORT",
    amount: 3200,
    paymentMethod: "CASH",
    vendor: "Nashik Sinnar Goods Carrier",
    notes: "Fertilizer unloading & transport from C&F",
    expenseDate: "2026-08-10T00:00:00Z",
    recordedByName: "Kishor Gite (Manager)",
    isDemo: true,
    createdAt: "2026-08-10T15:30:00Z",
  },
];

// -------------------------------------------------------------
// In-Memory Reactive Master State (Demo + Production Partition)
// -------------------------------------------------------------
class BusinessStore {
  private profile: BusinessProfile = { ...INITIAL_BUSINESS_PROFILE };
  private categories: Category[] = [...INITIAL_CATEGORIES];
  private brands: Brand[] = [...INITIAL_BRANDS];
  private products: Product[] = [...INITIAL_PRODUCTS];
  private customers: Customer[] = [...INITIAL_CUSTOMERS];
  private suppliers: Supplier[] = [...INITIAL_SUPPLIERS];
  private staff: StaffMember[] = [...INITIAL_STAFF];
  private quotations: Quotation[] = [...INITIAL_QUOTATIONS];
  private sales: Sale[] = [];
  private purchases: Purchase[] = [];
  private expenses: Expense[] = [...INITIAL_EXPENSES];
  private stockMovements: StockMovement[] = [];
  private isDemoModeActive: boolean = true;

  constructor() {
    this.seedInitialMovementsAndSales();
  }

  private seedInitialMovementsAndSales() {
    // Seed initial stock opening movements
    this.products.forEach((p) => {
      p.batches.forEach((b) => {
        this.stockMovements.push({
          id: `mov_init_${b.id}`,
          productId: p.id,
          productName: p.nameMr,
          batchId: b.id,
          batchNumber: b.batchNumber,
          movementType: 'OPENING_STOCK',
          quantity: b.currentStock,
          unitCost: b.purchaseCost,
          notes: 'Opening stock baseline',
          performedBy: 'System Baseline',
          isDemo: true,
          createdAt: '2026-08-01T08:00:00Z',
        });
      });
    });

    // Seed realistic baseline sales
    this.sales.push({
      id: 'sale-demo-1',
      invoiceNumber: 'INV-2026-0801',
      customerId: 'cust-1',
      customerName: 'Babasaheb Deshmukh',
      customerPhone: '9822114477',
      customerVillage: 'मुसळगाव (Musalgaon)',
      subtotal: 3800,
      taxAmount: 190,
      discountAmount: 0,
      grandTotal: 3990,
      paidAmount: 3990,
      balanceAmount: 0,
      paymentStatus: 'PAID',
      paymentMethod: 'UPI',
      items: [
        {
          id: 'si-1',
          productId: 'prod-1',
          productName: 'Mahadhan 19:19:19 (Starter Grade)',
          quantity: 20,
          unitPrice: 190,
          gstRate: 5,
          taxAmount: 190,
          totalPrice: 3800,
        },
      ],
      createdByName: 'Prashant Shinde (Cashier)',
      isDemo: true,
      createdAt: '2026-08-16T11:00:00Z',
    });

    this.sales.push({
      id: 'sale-demo-2',
      invoiceNumber: 'INV-2026-0802',
      customerId: 'cust-4',
      customerName: 'Sanjay Gite',
      customerPhone: '9890456789',
      customerVillage: 'पांगरी (Pangri)',
      subtotal: 7600,
      taxAmount: 1368,
      discountAmount: 200,
      grandTotal: 8768,
      paidAmount: 2000,
      balanceAmount: 6768,
      paymentStatus: 'PARTIAL',
      paymentMethod: 'CREDIT',
      items: [
        {
          id: 'si-2',
          productId: 'prod-4',
          productName: 'Bayer Nativo (Tebuconazole + Trifloxystrobin)',
          quantity: 10,
          unitPrice: 760,
          gstRate: 18,
          taxAmount: 1368,
          totalPrice: 7600,
        },
      ],
      createdByName: 'Prashant Shinde (Cashier)',
      isDemo: true,
      createdAt: '2026-08-17T09:30:00Z',
    });
  }

  // --- Profile & Business Settings ---
  public getProfile(): BusinessProfile {
    return { ...this.profile };
  }

  public updateProfile(updated: Partial<BusinessProfile>) {
    this.profile = { ...this.profile, ...updated };
    return this.profile;
  }

  // --- Categories & Products ---
  public getCategories(includeDemo = true): Category[] {
    return this.categories.filter((c) => includeDemo || !c.isDemo);
  }

  public getBrands(includeDemo = true): Brand[] {
    return this.brands.filter((b) => includeDemo || !b.isDemo);
  }

  public getProducts(includeDemo = true): Product[] {
    return this.products.filter((p) => includeDemo || !p.isDemo);
  }

  public getProductById(id: string): Product | undefined {
    return this.products.find((p) => p.id === id);
  }

  public addProduct(p: Omit<Product, 'id' | 'createdAt'>): Product {
    const id = `prod_${Date.now()}`;
    const newProd: Product = {
      ...p,
      id,
      createdAt: new Date().toISOString(),
    };
    this.products.unshift(newProd);
    return newProd;
  }

  // --- Customers & Khata ---
  public getCustomers(includeDemo = true): Customer[] {
    return this.customers.filter((c) => includeDemo || !c.isDemo);
  }

  public getCustomerById(id: string): Customer | undefined {
    return this.customers.find((c) => c.id === id);
  }

  public addCustomer(c: Omit<Customer, 'id' | 'createdAt'>): Customer {
    const id = `cust_${Date.now()}`;
    const newCust: Customer = {
      ...c,
      id,
      createdAt: new Date().toISOString(),
    };
    this.customers.unshift(newCust);
    return newCust;
  }

  public recordCustomerPayment(customerId: string, amount: number, paymentMethod: string, notes?: string) {
    const cust = this.customers.find((c) => c.id === customerId);
    if (cust) {
      cust.outstandingBalance = Math.max(0, cust.outstandingBalance - amount);
    }
    return cust;
  }

  // --- Suppliers ---
  public getSuppliers(includeDemo = true): Supplier[] {
    return this.suppliers.filter((s) => includeDemo || !s.isDemo);
  }

  // --- Staff & RBAC ---
  public getStaff(includeDemo = true): StaffMember[] {
    return this.staff.filter((s) => includeDemo || !s.isDemo);
  }

  public addStaffMember(member: Omit<StaffMember, 'id' | 'createdAt'>): StaffMember {
    const id = `staff_${Date.now()}`;
    const newMember: StaffMember = {
      ...member,
      id,
      createdAt: new Date().toISOString(),
    };
    this.staff.push(newMember);
    return newMember;
  }

  // --- Quotations ---
  public getQuotations(includeDemo = true): Quotation[] {
    return this.quotations.filter((q) => includeDemo || !q.isDemo);
  }

  public createQuotation(q: Omit<Quotation, 'id' | 'quotationNumber' | 'createdAt'>): Quotation {
    const quoteNum = `QTN-${new Date().getFullYear()}-${String(this.quotations.length + 1).padStart(3, '0')}`;
    const newQuote: Quotation = {
      ...q,
      id: `quote_${Date.now()}`,
      quotationNumber: quoteNum,
      createdAt: new Date().toISOString(),
    };
    this.quotations.unshift(newQuote);
    return newQuote;
  }

  // --- Sales (POS) & Atomic Stock Movement ---
  public getSales(includeDemo = true): Sale[] {
    return this.sales.filter((s) => includeDemo || !s.isDemo);
  }

  public createSale(saleData: {
    customerId?: string;
    customerName: string;
    customerPhone?: string;
    customerVillage?: string;
    items: Array<{
      productId: string;
      batchId?: string;
      quantity: number;
      unitPrice: number;
      gstRate: number;
    }>;
    discountAmount: number;
    paymentMethod: 'CASH' | 'UPI' | 'BANK_TRANSFER' | 'CREDIT';
    paidAmount: number;
    notes?: string;
    createdByName: string;
    isDemo?: boolean;
  }): { success: boolean; sale?: Sale; error?: string } {
    // 1. Concurrency & Stock Validation Check
    for (const item of saleData.items) {
      const prod = this.products.find((p) => p.id === item.productId);
      if (!prod) {
        return { success: false, error: `Product ID ${item.productId} not found.` };
      }
      if (prod.totalStock < item.quantity) {
        return {
          success: false,
          error: `Insufficient stock for ${prod.nameMr}. Available: ${prod.totalStock} ${prod.unit}, Requested: ${item.quantity} ${prod.unit}.`,
        };
      }
    }

    let subtotal = 0;
    let totalTax = 0;
    const saleItems: SaleItem[] = [];

    // 2. Execute Stock Deductions & Movement Logs
    for (const item of saleData.items) {
      const prod = this.products.find((p) => p.id === item.productId)!;
      const lineSubtotal = item.quantity * item.unitPrice;
      const lineTax = (lineSubtotal * item.gstRate) / 100;
      subtotal += lineSubtotal;
      totalTax += lineTax;

      // Decrement product total stock
      prod.totalStock -= item.quantity;

      // Decrement batch if specified
      let batchNumber = '';
      if (item.batchId && prod.batches) {
        const batch = prod.batches.find((b) => b.id === item.batchId);
        if (batch) {
          batch.currentStock = Math.max(0, batch.currentStock - item.quantity);
          batchNumber = batch.batchNumber;
        }
      }

      saleItems.push({
        id: `si_${Date.now()}_${Math.random().toString(36).substring(2, 5)}`,
        productId: prod.id,
        productName: prod.nameMr,
        batchId: item.batchId,
        batchNumber,
        quantity: item.quantity,
        unitPrice: item.unitPrice,
        gstRate: item.gstRate,
        taxAmount: lineTax,
        totalPrice: lineSubtotal + lineTax,
      });

      // Immutable stock movement entry
      this.stockMovements.unshift({
        id: `mov_${Date.now()}_${Math.random().toString(36).substring(2, 5)}`,
        productId: prod.id,
        productName: prod.nameMr,
        batchId: item.batchId,
        batchNumber,
        movementType: 'SALE',
        quantity: -item.quantity,
        unitCost: prod.purchasePrice,
        referenceType: 'INVOICE',
        performedBy: saleData.createdByName,
        isDemo: saleData.isDemo ?? this.isDemoModeActive,
        createdAt: new Date().toISOString(),
      });
    }

    const grandTotal = Math.round(subtotal + totalTax - saleData.discountAmount);
    const balanceAmount = Math.max(0, grandTotal - saleData.paidAmount);
    const paymentStatus =
      balanceAmount === 0 ? 'PAID' : saleData.paidAmount > 0 ? 'PARTIAL' : 'UNPAID';

    const invoiceNumber = `INV-${new Date().getFullYear()}-${String(this.sales.length + 1).padStart(4, '0')}`;

    const newSale: Sale = {
      id: `sale_${Date.now()}`,
      invoiceNumber,
      customerId: saleData.customerId,
      customerName: saleData.customerName,
      customerPhone: saleData.customerPhone,
      customerVillage: saleData.customerVillage,
      subtotal,
      taxAmount: totalTax,
      discountAmount: saleData.discountAmount,
      grandTotal,
      paidAmount: saleData.paidAmount,
      balanceAmount,
      paymentStatus,
      paymentMethod: saleData.paymentMethod,
      items: saleItems,
      notes: saleData.notes,
      createdByName: saleData.createdByName,
      isDemo: saleData.isDemo ?? this.isDemoModeActive,
      createdAt: new Date().toISOString(),
    };

    this.sales.unshift(newSale);

    // If Credit Sale with customer, update customer outstanding Khata balance
    if (saleData.customerId && balanceAmount > 0) {
      const cust = this.customers.find((c) => c.id === saleData.customerId);
      if (cust) {
        cust.outstandingBalance += balanceAmount;
      }
    }

    return { success: true, sale: newSale };
  }

  // --- Purchases & Landed Cost ---
  public getPurchases(includeDemo = true): Purchase[] {
    return this.purchases.filter((p) => includeDemo || !p.isDemo);
  }

  public recordPurchase(purchaseData: {
    supplierId: string;
    invoiceNumber: string;
    items: Array<{
      productId: string;
      batchNumber: string;
      mfgDate: string;
      expiryDate: string;
      quantity: number;
      unitCost: number;
      gstRate: number;
    }>;
    freightCost: number;
    otherCosts: number;
    paymentMethod: 'CASH' | 'UPI' | 'BANK_TRANSFER' | 'CREDIT';
    paidAmount: number;
    notes?: string;
    createdByName: string;
  }): { success: boolean; purchase?: Purchase; error?: string } {
    const supplier = this.suppliers.find((s) => s.id === purchaseData.supplierId);
    if (!supplier) {
      return { success: false, error: 'Supplier not found.' };
    }

    let subtotal = 0;
    let totalTax = 0;
    const purchaseItems: PurchaseItem[] = [];

    for (const item of purchaseData.items) {
      const prod = this.products.find((p) => p.id === item.productId);
      if (!prod) continue;

      const lineTotal = item.quantity * item.unitCost;
      const lineTax = (lineTotal * item.gstRate) / 100;
      subtotal += lineTotal;
      totalTax += lineTax;

      // Increment product total stock
      prod.totalStock += item.quantity;
      prod.purchasePrice = item.unitCost;

      // Add or update batch
      const batchId = `batch_${Date.now()}_${Math.random().toString(36).substring(2, 5)}`;
      prod.batches.push({
        id: batchId,
        productId: prod.id,
        batchNumber: item.batchNumber,
        mfgDate: item.mfgDate,
        expiryDate: item.expiryDate,
        purchaseCost: item.unitCost,
        currentStock: item.quantity,
        isDemo: this.isDemoModeActive,
      });

      purchaseItems.push({
        id: `pi_${Date.now()}_${Math.random().toString(36).substring(2, 5)}`,
        productId: prod.id,
        productName: prod.nameMr,
        batchNumber: item.batchNumber,
        mfgDate: item.mfgDate,
        expiryDate: item.expiryDate,
        quantity: item.quantity,
        unitCost: item.unitCost,
        gstRate: item.gstRate,
        totalCost: lineTotal + lineTax,
      });

      // Immutable stock movement entry
      this.stockMovements.unshift({
        id: `mov_pur_${Date.now()}`,
        productId: prod.id,
        productName: prod.nameMr,
        batchId,
        batchNumber: item.batchNumber,
        movementType: 'PURCHASE',
        quantity: item.quantity,
        unitCost: item.unitCost,
        referenceType: 'PURCHASE_ORDER',
        performedBy: purchaseData.createdByName,
        isDemo: this.isDemoModeActive,
        createdAt: new Date().toISOString(),
      });
    }

    const grandTotal = Math.round(
      subtotal + totalTax + purchaseData.freightCost + purchaseData.otherCosts
    );
    const balanceAmount = Math.max(0, grandTotal - purchaseData.paidAmount);
    const paymentStatus =
      balanceAmount === 0 ? 'PAID' : purchaseData.paidAmount > 0 ? 'PARTIAL' : 'UNPAID';

    const newPurchase: Purchase = {
      id: `pur_${Date.now()}`,
      invoiceNumber: purchaseData.invoiceNumber,
      supplierId: supplier.id,
      supplierName: supplier.name,
      subtotal,
      taxAmount: totalTax,
      freightCost: purchaseData.freightCost,
      otherCosts: purchaseData.otherCosts,
      grandTotal,
      paidAmount: purchaseData.paidAmount,
      balanceAmount,
      paymentStatus,
      paymentMethod: purchaseData.paymentMethod,
      items: purchaseItems,
      notes: purchaseData.notes,
      createdByName: purchaseData.createdByName,
      isDemo: this.isDemoModeActive,
      createdAt: new Date().toISOString(),
    };

    this.purchases.unshift(newPurchase);

    if (balanceAmount > 0) {
      supplier.outstandingPayable += balanceAmount;
    }

    return { success: true, purchase: newPurchase };
  }

  // --- Expenses ---
  public getExpenses(includeDemo = true): Expense[] {
    return this.expenses.filter((e) => includeDemo || !e.isDemo);
  }

  public addExpense(exp: Omit<Expense, 'id' | 'createdAt'>): Expense {
    const newExp: Expense = {
      ...exp,
      id: `exp_${Date.now()}`,
      createdAt: new Date().toISOString(),
    };
    this.expenses.unshift(newExp);
    return newExp;
  }

  // --- Stock Movements & Audit ---
  public getStockMovements(limit = 100): StockMovement[] {
    return this.stockMovements.slice(0, limit);
  }

  // --- Financial Profit & KPI Engine ---
  public getFinancialKPIs() {
    const totalRevenue = this.sales.reduce((acc, s) => acc + s.grandTotal, 0);
    const cashRevenue = this.sales
      .filter((s) => s.paymentMethod === 'CASH')
      .reduce((acc, s) => acc + s.paidAmount, 0);
    const upiRevenue = this.sales
      .filter((s) => s.paymentMethod === 'UPI')
      .reduce((acc, s) => acc + s.paidAmount, 0);
    const creditOutstanding = this.customers.reduce((acc, c) => acc + c.outstandingBalance, 0);
    const supplierPayables = this.suppliers.reduce((acc, s) => acc + s.outstandingPayable, 0);

    // Compute Cost of Goods Sold (COGS)
    let totalCOGS = 0;
    this.sales.forEach((s) => {
      s.items.forEach((item) => {
        const prod = this.products.find((p) => p.id === item.productId);
        const unitCost = prod ? prod.purchasePrice : item.unitPrice * 0.8;
        totalCOGS += item.quantity * unitCost;
      });
    });

    const grossProfit = totalRevenue - totalCOGS;
    const totalExpenses = this.expenses.reduce((acc, e) => acc + e.amount, 0);
    const netProfit = grossProfit - totalExpenses;
    const netMarginPercent = totalRevenue > 0 ? (netProfit / totalRevenue) * 100 : 0;

    // Inventory status & alerts
    const totalInventoryValue = this.products.reduce(
      (acc, p) => acc + p.totalStock * p.purchasePrice,
      0
    );
    const lowStockCount = this.products.filter((p) => p.totalStock <= p.minStockLevel).length;

    const now = new Date().getTime();
    const thirtyDaysMs = 30 * 24 * 60 * 60 * 1000;
    const expiringBatchesCount = this.products.reduce((acc, p) => {
      const expiring = p.batches.filter((b) => {
        if (!b.expiryDate) return false;
        const expTime = new Date(b.expiryDate).getTime();
        return expTime - now <= thirtyDaysMs && b.currentStock > 0;
      });
      return acc + expiring.length;
    }, 0);

    return {
      totalRevenue,
      cashRevenue,
      upiRevenue,
      creditOutstanding,
      supplierPayables,
      totalCOGS,
      grossProfit,
      totalExpenses,
      netProfit,
      netMarginPercent: Number(netMarginPercent.toFixed(1)),
      totalInventoryValue,
      lowStockCount,
      expiringBatchesCount,
      totalSalesCount: this.sales.length,
      pendingQuotationsCount: this.quotations.filter((q) => q.status === 'SENT' || q.status === 'DRAFT').length,
    };
  }

  // --- Environment Reset & Demo Toggles ---
  public isDemoActive(): boolean {
    return this.isDemoModeActive;
  }

  public setDemoMode(active: boolean) {
    this.isDemoModeActive = active;
  }

  public cleanProductionDatabase() {
    this.categories = [];
    this.brands = [];
    this.products = [];
    this.customers = [];
    this.suppliers = [];
    this.quotations = [];
    this.sales = [];
    this.purchases = [];
    this.expenses = [];
    this.stockMovements = [];
    this.isDemoModeActive = false;
  }

  public resetDemoData() {
    this.profile = { ...INITIAL_BUSINESS_PROFILE };
    this.categories = [...INITIAL_CATEGORIES];
    this.brands = [...INITIAL_BRANDS];
    this.products = [...INITIAL_PRODUCTS];
    this.customers = [...INITIAL_CUSTOMERS];
    this.suppliers = [...INITIAL_SUPPLIERS];
    this.staff = [...INITIAL_STAFF];
    this.quotations = [...INITIAL_QUOTATIONS];
    this.sales = [];
    this.purchases = [];
    this.expenses = [...INITIAL_EXPENSES];
    this.stockMovements = [];
    this.isDemoModeActive = true;
    this.seedInitialMovementsAndSales();
  }
}

// Global Singleton Store Instance
const globalForStore = globalThis as unknown as {
  businessStore: BusinessStore | undefined;
};

export const store = globalForStore.businessStore ?? new BusinessStore();
if (process.env.NODE_ENV !== 'production') globalForStore.businessStore = store;

export default store;
