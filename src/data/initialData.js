export const seedUsers = [
  { username: "bilgin", password: "1qaz2wsx", role: "Yönetici", name: "Bilgin Yönetici", firstLogin: false },
  { username: "bilginx", password: "1qazwsX", companyName: "BUSİBER Admin", firstLogin: false },
  { username: "new_admin", password: "Welcome123!", companyName: "BlueForge Mobility", firstLogin: true },
];

export const initialAssets = [
  { id: "V-1001", name: "Sunucu", type: "Sunucu / Donanım", location: "Veri Merkezi - Sistem Odası", owner: "Bilgi İşlem", status: "Aktif", cia: { c: 3, i: 3, a: 3 } },
  { id: "V-1002", name: "Kullanıcı Bilgisayarı", type: "İş İstasyonu", location: "Mühendislik Departmanı", owner: "Melih Kaan", status: "Aktif", cia: { c: 2, i: 2, a: 2 } },
  { id: "V-1003", name: "Laptop", type: "Taşınabilir Cihaz", location: "Yönetim Ofisi", owner: "Banu Sencer", status: "Aktif", cia: { c: 3, i: 2, a: 2 } },
  { id: "V-1004", name: "Switch ve Ağ Cihazları", type: "Ağ Altyapısı", location: "Omurga Kabini - Kat 1", owner: "Ağ Yönetimi", status: "Aktif", cia: { c: 1, i: 2, a: 3 } }
];

export const initialVulnerabilities = [
  { id: 'CVE-2024-001', asset: 'Merkezi Sunucu', severity: 'Kritik', status: 'Açık', date: '18.05.2026' },
  { id: 'CVE-2024-012', asset: 'Ağ Switch (Kat 1)', severity: 'Yüksek', status: 'İşlemde', date: '17.05.2026' }
];

export const emptyProfile = {
  companyName: "",
  companySize: "",
  industrySector: "",
  numberOfEmployees: "",
  countryRegion: "",
  officeLocations: "",
  itEnvironment: "",
  thirdPartyProviders: "",
  securityPolicies: "",
  certificationStatus: "",
  regulatoryRequirements: "",
  criticalAssets: "",
  maturityLevel: "",
  mainConcerns: "",
  riskAppetite: "Orta",
  tisaxLevel: "Bilinmiyor",
};

export const stage1Config = [
  {
    requiredFields: ["companyName", "companySize", "industrySector", "numberOfEmployees", "countryRegion", "officeLocations", "riskAppetite", "tisaxLevel"],
  },
  {
    requiredFields: ["itEnvironment", "thirdPartyProviders", "criticalAssets"],
  },
  {
    requiredFields: ["securityPolicies", "certificationStatus", "regulatoryRequirements"],
  },
  {
    requiredFields: ["maturityLevel", "mainConcerns"],
  },
];
