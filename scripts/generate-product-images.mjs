import fs from 'fs';
import path from 'path';

const outDir = './public/products';
if (!fs.existsSync(outDir)) {
  fs.mkdirSync(outDir, { recursive: true });
}

const products = [
  { id: 'prod-1', name: 'Mahadhan 19:19:19', tag: 'WSF NPK 19:19:19', brand: 'Mahadhan', pack: '1 Kg Bag', type: 'bag', bg1: '#064e3b', bg2: '#022c22', accent: '#34d399', color: '#10b981' },
  { id: 'prod-2', name: 'Mahadhan 0:52:34', tag: 'MKP 00:52:34', brand: 'Mahadhan', pack: '1 Kg Bag', type: 'bag', bg1: '#831843', bg2: '#500724', accent: '#f472b6', color: '#ec4899' },
  { id: 'prod-3', name: 'Mahadhan 12:61:00', tag: 'MAP 12:61:00', brand: 'Mahadhan', pack: '1 Kg Bag', type: 'bag', bg1: '#1e3a8a', bg2: '#172554', accent: '#60a5fa', color: '#3b82f6' },
  { id: 'prod-4', name: 'Mahadhan 0:0:50', tag: 'SOP 0:0:50 + S', brand: 'Mahadhan', pack: '1 Kg Bag', type: 'bag', bg1: '#78350f', bg2: '#451a03', accent: '#fbbf24', color: '#f59e0b' },
  { id: 'prod-5', name: 'YaraLiva Nitrabor', tag: 'Calcium + Boron', brand: 'Yara India', pack: '25 Kg Bag', type: 'bigbag', bg1: '#0c4a6e', bg2: '#082f49', accent: '#38bdf8', color: '#0284c7' },
  { id: 'prod-6', name: 'IFFCO DAP 18:46:0', tag: 'Di-Ammonium Phos', brand: 'IFFCO', pack: '50 Kg Bag', type: 'bigbag', bg1: '#14532d', bg2: '#052e16', accent: '#86efac', color: '#22c55e' },
  { id: 'prod-7', name: 'IFFCO Neem Urea', tag: '46% Nitrogen', brand: 'IFFCO', pack: '45 Kg Bag', type: 'bigbag', bg1: '#166534', bg2: '#14532d', accent: '#4ade80', color: '#16a34a' },
  { id: 'prod-8', name: 'Mahadhan 10:26:26', tag: 'Mahapower NPK', brand: 'Mahadhan', pack: '50 Kg Bag', type: 'bigbag', bg1: '#701a75', bg2: '#4a044e', accent: '#e879f9', color: '#c026d3' },
  { id: 'prod-9', name: 'Bayer Nativo', tag: 'Tebuconazole + Trifloxy', brand: 'Bayer CropScience', pack: '100 g Pack', type: 'box', bg1: '#1e293b', bg2: '#0f172a', accent: '#38bdf8', color: '#0ea5e9' },
  { id: 'prod-10', name: 'Syngenta Amistar Top', tag: 'Azoxystrobin + Difen', brand: 'Syngenta India', pack: '200 ml Bottle', type: 'bottle', bg1: '#064e3b', bg2: '#022c22', accent: '#a7f3d0', color: '#10b981' },
  { id: 'prod-11', name: 'Syngenta Ridomil Gold', tag: 'Metalaxyl-M + Mancozeb', brand: 'Syngenta India', pack: '500 g Pack', type: 'box', bg1: '#713f12', bg2: '#422006', accent: '#fde047', color: '#eab308' },
  { id: 'prod-12', name: 'UPL Saaf Fungicide', tag: 'Carbendazim + Mancozeb', brand: 'UPL Limited', pack: '500 g Pack', type: 'box', bg1: '#1e3a8a', bg2: '#1e1b4b', accent: '#93c5fd', color: '#3b82f6' },
  { id: 'prod-13', name: 'FMC Coragen', tag: 'Chlorantraniliprole 18.5%', brand: 'FMC India', pack: '60 ml Bottle', type: 'bottle', bg1: '#7f1d1d', bg2: '#450a0a', accent: '#fca5a5', color: '#ef4444' },
  { id: 'prod-14', name: 'Corteva Delegate', tag: 'Spinetoram 11.7% SC', brand: 'Corteva Agriscience', pack: '100 ml Bottle', type: 'bottle', bg1: '#1e3a8a', bg2: '#0f172a', accent: '#67e8f9', color: '#06b6d4' },
  { id: 'prod-15', name: 'Syngenta Alika', tag: 'Thiamethoxam + Lambda', brand: 'Syngenta India', pack: '100 ml Bottle', type: 'bottle', bg1: '#14532d', bg2: '#052e16', accent: '#86efac', color: '#22c55e' },
  { id: 'prod-16', name: 'Bayer Confidor', tag: 'Imidacloprid 17.8% SL', brand: 'Bayer CropScience', pack: '100 ml Bottle', type: 'bottle', bg1: '#0c4a6e', bg2: '#082f49', accent: '#7dd3fc', color: '#0284c7' },
  { id: 'prod-17', name: 'Bayer Jump', tag: 'Fipronil 80% WG', brand: 'Bayer CropScience', pack: '40 g Pack', type: 'box', bg1: '#312e81', bg2: '#1e1b4b', accent: '#c7d2fe', color: '#6366f1' },
  { id: 'prod-18', name: 'Syngenta Isabion', tag: 'Amino Acids + Peptides', brand: 'Syngenta India', pack: '500 ml Bottle', type: 'bottle', bg1: '#047857', bg2: '#064e3b', accent: '#6ee7b7', color: '#059669' },
  { id: 'prod-19', name: 'Godrej Double PGR', tag: 'Homobrassinolide 0.04%', brand: 'Godrej Agrovet', pack: '250 ml Bottle', type: 'bottle', bg1: '#854d0e', bg2: '#713f12', accent: '#fef08a', color: '#ca8a04' },
  { id: 'prod-20', name: 'Chelated Zinc EDTA', tag: 'Zn-EDTA 12%', brand: 'Multiplex', pack: '500 g Pack', type: 'box', bg1: '#1f2937', bg2: '#111827', accent: '#e5e7eb', color: '#9ca3af' },
  { id: 'prod-21', name: 'Multiplex Boron 20%', tag: 'Disodium Octaborate', brand: 'Multiplex', pack: '500 g Pack', type: 'box', bg1: '#155e75', bg2: '#164e63', accent: '#a5f3fc', color: '#0891b2' },
  { id: 'prod-22', name: 'Super Silicon Spreader', tag: 'Silicone 80% Actives', brand: 'Sumitomo', pack: '250 ml Bottle', type: 'bottle', bg1: '#374151', bg2: '#1f2937', accent: '#9ca3af', color: '#6b7280' },
  { id: 'prod-23', name: 'Advanta Prashant Onion', tag: 'High Yield Red Bulb', brand: 'Advanta Seeds', pack: '1 Kg Bag', type: 'seed', bg1: '#881337', bg2: '#4c0519', accent: '#fda4af', color: '#e11d48' },
  { id: 'prod-24', name: 'Panchganga Red Onion', tag: 'Export Grade Selection', brand: 'Panchganga Seeds', pack: '1 Kg Bag', type: 'seed', bg1: '#9f1239', bg2: '#881337', accent: '#fecdd3', color: '#be123c' },
  { id: 'prod-25', name: 'Pioneer P3396 Maize', tag: 'High Yield Hybrid Corn', brand: 'Pioneer Seeds', pack: '4 Kg Bag', type: 'seed', bg1: '#854d0e', bg2: '#422006', accent: '#fde047', color: '#d97706' },
  { id: 'prod-26', name: 'Syngenta Abhinav Tomato', tag: 'TLCV Resistant F1', brand: 'Syngenta India', pack: '10 g Pack', type: 'seed', bg1: '#991b1b', bg2: '#7f1d1d', accent: '#f87171', color: '#dc2626' },
  { id: 'prod-27', name: 'Dhanuka Targa Super', tag: 'Quizalofop Ethyl 5% EC', brand: 'Dhanuka Agritech', pack: '250 ml Bottle', type: 'bottle', bg1: '#115e59', bg2: '#134e4a', accent: '#5eead4', color: '#0d9488' },
  { id: 'prod-28', name: 'UPL Iris Herbicide', tag: 'Sodium Acifluorfen 16.5%', brand: 'UPL Limited', pack: '250 ml Bottle', type: 'bottle', bg1: '#4c1d95', bg2: '#2e1065', accent: '#d8b4fe', color: '#7c3aed' },
];

for (const p of products) {
  let illustration = '';
  if (p.type === 'bottle') {
    illustration = `
      <!-- Bottle Body -->
      <path d="M165,130 L235,130 L235,160 L260,200 L260,330 C260,345 250,355 235,355 L165,355 C150,355 140,345 140,330 L140,200 L165,160 Z" fill="url(#botGrad)" filter="drop-shadow(0 15px 25px rgba(0,0,0,0.4))" />
      <!-- Bottle Cap -->
      <rect x="175" y="95" width="50" height="35" rx="6" fill="${p.accent}" stroke="#ffffff" stroke-width="2" />
      <!-- Label -->
      <rect x="150" y="210" width="100" height="110" rx="8" fill="#ffffff" />
      <rect x="155" y="215" width="90" height="25" rx="4" fill="${p.color}" />
      <text x="200" y="232" font-family="system-ui, sans-serif" font-size="10" font-weight="900" fill="#ffffff" text-anchor="middle">${p.brand.toUpperCase()}</text>
      <text x="200" y="260" font-family="system-ui, sans-serif" font-size="11" font-weight="800" fill="#0f172a" text-anchor="middle">${p.name.split(' ')[1] || p.name}</text>
      <text x="200" y="280" font-family="system-ui, sans-serif" font-size="8" font-weight="700" fill="#64748b" text-anchor="middle">${p.tag}</text>
      <rect x="160" y="298" width="80" height="16" rx="4" fill="#f1f5f9" />
      <text x="200" y="310" font-family="system-ui, sans-serif" font-size="9" font-weight="800" fill="${p.color}" text-anchor="middle">${p.pack}</text>
    `;
  } else if (p.type === 'bag' || p.type === 'bigbag') {
    illustration = `
      <!-- Pouch / Sack Bag -->
      <path d="M140,110 L260,110 L275,340 C275,355 260,365 240,365 L160,365 C140,365 125,355 125,340 Z" fill="url(#botGrad)" filter="drop-shadow(0 15px 25px rgba(0,0,0,0.4))" />
      <!-- Stitch Top -->
      <rect x="135" y="105" width="130" height="12" rx="3" fill="${p.accent}" stroke="#ffffff" stroke-width="1.5" stroke-dasharray="4,2" />
      <!-- Center Shield Badge -->
      <rect x="145" y="145" width="110" height="175" rx="12" fill="#ffffff" />
      <rect x="150" y="150" width="100" height="32" rx="6" fill="${p.color}" />
      <text x="200" y="170" font-family="system-ui, sans-serif" font-size="11" font-weight="900" fill="#ffffff" text-anchor="middle">${p.brand.toUpperCase()}</text>
      <text x="200" y="205" font-family="system-ui, sans-serif" font-size="13" font-weight="900" fill="#0f172a" text-anchor="middle">${p.name.split(' ')[1] || p.name}</text>
      <text x="200" y="225" font-family="system-ui, sans-serif" font-size="9" font-weight="700" fill="#64748b" text-anchor="middle">${p.tag}</text>
      
      <!-- Leaf Icon Circle -->
      <circle cx="200" cy="260" r="18" fill="${p.color}" opacity="0.15" />
      <path d="M194,264 C194,256 200,250 206,252 C206,260 200,266 194,264 Z" fill="${p.color}" />
      
      <rect x="155" y="290" width="90" height="22" rx="6" fill="${p.color}" />
      <text x="200" y="305" font-family="system-ui, sans-serif" font-size="11" font-weight="900" fill="#ffffff" text-anchor="middle">${p.pack}</text>
    `;
  } else if (p.type === 'seed') {
    illustration = `
      <!-- Seed Foil Pouch -->
      <path d="M135,100 L265,100 L275,350 C275,360 265,365 245,365 L155,365 C135,365 125,360 125,350 Z" fill="url(#botGrad)" filter="drop-shadow(0 15px 25px rgba(0,0,0,0.4))" />
      <!-- Foil Top Seal -->
      <polygon points="135,100 265,100 265,115 135,115" fill="${p.accent}" stroke="#ffffff" stroke-width="1.5" />
      
      <!-- Front Product Art Area -->
      <rect x="142" y="130" width="116" height="200" rx="10" fill="#ffffff" />
      <rect x="146" y="135" width="108" height="30" rx="5" fill="${p.color}" />
      <text x="200" y="154" font-family="system-ui, sans-serif" font-size="10" font-weight="900" fill="#ffffff" text-anchor="middle">${p.brand.toUpperCase()}</text>
      
      <circle cx="200" cy="205" r="30" fill="${p.color}" opacity="0.2" />
      <!-- Sprout Graphic -->
      <path d="M190,215 C190,195 205,190 210,190 C210,210 195,215 190,215 Z" fill="${p.color}" />
      <path d="M210,215 C210,195 195,190 190,190 C190,210 205,215 210,215 Z" fill="${p.accent}" opacity="0.8" />
      
      <text x="200" y="255" font-family="system-ui, sans-serif" font-size="11" font-weight="900" fill="#0f172a" text-anchor="middle">${p.name.split(' ').slice(1).join(' ')}</text>
      <text x="200" y="272" font-family="system-ui, sans-serif" font-size="8" font-weight="700" fill="#64748b" text-anchor="middle">${p.tag}</text>
      
      <rect x="152" y="295" width="96" height="24" rx="6" fill="${p.color}" />
      <text x="200" y="311" font-family="system-ui, sans-serif" font-size="11" font-weight="900" fill="#ffffff" text-anchor="middle">CERTIFIED SEED</text>
    `;
  } else {
    // Box / Carton Pack
    illustration = `
      <!-- 3D Box Body -->
      <polygon points="150,130 250,130 280,165 280,345 180,345 150,310" fill="url(#botGrad)" filter="drop-shadow(0 15px 25px rgba(0,0,0,0.4))" />
      <polygon points="150,130 180,165 180,345 150,310" fill="#000000" opacity="0.2" />
      <polygon points="150,130 250,130 280,165 180,165" fill="${p.accent}" opacity="0.9" />
      <!-- Box Front Panel -->
      <rect x="175" y="165" width="105" height="175" fill="#ffffff" />
      <rect x="180" y="170" width="95" height="28" rx="4" fill="${p.color}" />
      <text x="227" y="188" font-family="system-ui, sans-serif" font-size="10" font-weight="900" fill="#ffffff" text-anchor="middle">${p.brand.toUpperCase()}</text>
      <text x="227" y="220" font-family="system-ui, sans-serif" font-size="12" font-weight="900" fill="#0f172a" text-anchor="middle">${p.name.split(' ')[1] || p.name}</text>
      <text x="227" y="240" font-family="system-ui, sans-serif" font-size="8" font-weight="700" fill="#64748b" text-anchor="middle">${p.tag}</text>
      <rect x="185" y="295" width="85" height="22" rx="4" fill="${p.color}" />
      <text x="227" y="310" font-family="system-ui, sans-serif" font-size="10" font-weight="900" fill="#ffffff" text-anchor="middle">${p.pack}</text>
    `;
  }

  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 400" width="100%" height="100%">
  <defs>
    <linearGradient id="bgGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="${p.bg1}" />
      <stop offset="100%" stop-color="${p.bg2}" />
    </linearGradient>
    <linearGradient id="botGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#ffffff" />
      <stop offset="100%" stop-color="#e2e8f0" />
    </linearGradient>
    <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
      <feGaussianBlur stdDeviation="30" result="blur" />
      <feComposite in="SourceGraphic" in2="blur" operator="over" />
    </filter>
  </defs>

  <!-- Background Canvas -->
  <rect width="400" height="400" rx="32" fill="url(#bgGrad)" />

  <!-- Ambient Lighting Orbs -->
  <circle cx="200" cy="200" r="140" fill="${p.accent}" opacity="0.18" filter="url(#glow)" />
  <circle cx="80" cy="80" r="80" fill="${p.color}" opacity="0.12" />
  
  <!-- Subtle Grid Pattern -->
  <g opacity="0.05" stroke="#ffffff" stroke-width="1">
    <line x1="0" y1="100" x2="400" y2="100" />
    <line x1="0" y1="200" x2="400" y2="200" />
    <line x1="0" y1="300" x2="400" y2="300" />
    <line x1="100" y1="0" x2="100" y2="400" />
    <line x1="200" y1="0" x2="200" y2="400" />
    <line x1="300" y1="0" x2="300" y2="400" />
  </g>

  <!-- Top Floating Brand Pill -->
  <g filter="drop-shadow(0 4px 8px rgba(0,0,0,0.3))">
    <rect x="30" y="25" width="140" height="30" rx="15" fill="#0f172a" opacity="0.9" stroke="${p.accent}" stroke-width="1.5" />
    <circle cx="45" cy="40" r="5" fill="${p.accent}" />
    <text x="58" y="44" font-family="system-ui, sans-serif" font-size="11" font-weight="900" fill="#ffffff">${p.brand}</text>
  </g>

  <!-- Top Right 100% Genuine Seal -->
  <g filter="drop-shadow(0 4px 8px rgba(0,0,0,0.3))">
    <rect x="250" y="25" width="120" height="30" rx="15" fill="${p.color}" />
    <text x="310" y="44" font-family="system-ui, sans-serif" font-size="10" font-weight="900" fill="#ffffff" text-anchor="middle">१००% अस्सल निविष्ठा</text>
  </g>

  <!-- Main Illustration -->
  ${illustration}

  <!-- Bottom Brand Footer Ribbon -->
  <rect x="0" y="360" width="400" height="40" fill="#020617" opacity="0.85" />
  <text x="20" y="384" font-family="system-ui, sans-serif" font-size="11" font-weight="900" fill="#ffffff">श्री कृष्ण ॲग्रो सर्व्हिसेस, सिन्नर</text>
  <text x="380" y="384" font-family="system-ui, sans-serif" font-size="11" font-weight="800" fill="${p.accent}" text-anchor="end">${p.pack}</text>
</svg>`;

  fs.writeFileSync(path.join(outDir, `${p.id}.svg`), svg.trim());
}

console.log('✅ Successfully generated 28 crisp SVG product images in public/products/');
