export const defaultLanguage = "en";

export const translations = {
  en: {
    language: { en: "EN", tr: "TR", switcherLabel: "Language" },
    common: {
      signOut: "Sign Out",
      back: "Back",
      step: "Step",
      saveAndContinue: "Save and Continue",
      continueToStage2: "Continue to Stage 2",
      requiredField: "This field is required.",
      profileNotSet: "Profile not set",
      scoreNotSet: "Score unavailable",
    },
    feedback: {
      authFillAll: "Please fill all fields and use at least 8 characters for password.",
      passwordMismatch: "Passwords do not match.",
      usernameExists: "Username already exists.",
      accountCreated: "Account created. Sign in to continue.",
      invalidCredentials: "Invalid username or password.",
      stage1Saved: "Stage 1 progress saved.",
      stage1Complete: "Stage 1 completed. Continue with Stage 2 cybersecurity readiness assessment.",
      stage2Saved: "Stage 2 progress saved.",
      stage2Incomplete: "Please answer all questions in this section.",
      stage2Complete: "Stage 2 assessment completed.",
      stage2Reset: "Stage 2 reset. You can run the assessment again.",
      signedOut: "Signed out.",
      editProfile: "You can update Stage 1 profile details and continue again.",
    },
    auth: {
      introKicker: "AI-Based TISAX Platform",
      introTitle: "Cybersecurity Assessment Onboarding",
      introDesc:
        "Start with trusted authentication. On first login, complete Stage 1 profiling and then Stage 2 readiness assessment to identify priority gaps.",
      introPoints: [
        "Structured TISAX and cybersecurity intake",
        "Maturity-based controls assessment",
        "Clear score output and action-oriented recommendations",
      ],
      signInTab: "Sign In",
      signUpTab: "Sign Up",
      secureAccess: "Secure Access",
      signInDesc: "Sign in with your organization account to start Stage 1 profiling.",
      createAccount: "Create Account",
      signUpDesc: "Create your workspace admin account for TISAX readiness assessment.",
      username: "Username",
      password: "Password",
      continue: "Continue",
      sampleUser: "Sample first-login user: `new_admin` / `Welcome123!`",
      companyName: "Company Name",
      confirmPassword: "Confirm Password",
      minPassword: "Use at least 8 characters.",
      createAccountBtn: "Create Account",
    },
    journey: {
      stage1: "Stage 1: Organization Profile",
      stage2: "Stage 2: Readiness Assessment",
      results: "Results Summary",
      sharedProfile: "Shared Profile Context",
      editProfile: "Edit Organization Profile",
    },
    stage1: {
      sections: [
        {
          key: "context",
          indicatorTitle: "Organization Context",
          title: "Company Profile",
          description: "Tell us who you are and where you operate.",
        },
        {
          key: "tech",
          indicatorTitle: "Technology and Dependencies",
          title: "IT Environment and Critical Assets",
          description: "Map technical landscape and external dependencies.",
        },
        {
          key: "governance",
          indicatorTitle: "Security Governance and Compliance",
          title: "Security Governance and Compliance",
          description: "Understand policy coverage and compliance status.",
        },
        {
          key: "risk",
          indicatorTitle: "Maturity and Priority Risks",
          title: "Maturity and Priority Risks",
          description: "Capture current cybersecurity maturity and top concerns.",
        },
      ],
      fields: {
        companyName: { label: "Company Name", helper: "Legal or commonly used business name." },
        companySize: { label: "Company Size", helper: "Choose a size band for benchmarking." },
        industrySector: { label: "Industry Sector", helper: "Used for sector-specific threat patterns." },
        numberOfEmployees: { label: "Number of Employees", helper: "Approximate total workforce." },
        countryRegion: { label: "Country / Region", helper: "Primary operating geography." },
        officeLocations: { label: "Number of Office Locations", helper: "Include headquarters and branch offices." },
        itEnvironment: { label: "IT Environment", helper: "Primary hosting model." },
        thirdPartyProviders: { label: "Third-Party Providers", helper: "Vendors with access to systems or data." },
        criticalAssets: {
          label: "Critical Assets / Sensitive Data",
          helper: "Examples: customer PII, source code, production systems, finance records.",
        },
        securityPolicies: {
          label: "Security Policies",
          helper: "Documented information security policies in place?",
        },
        certificationStatus: {
          label: "ISO 27001 or Similar Certification",
          helper: "Current certification posture.",
        },
        regulatoryRequirements: {
          label: "Regulatory Requirements",
          helper: "Examples: GDPR, NIS2, automotive sector obligations.",
        },
        maturityLevel: {
          label: "Current Cybersecurity Maturity Level",
          helper: "Choose the closest maturity stage.",
        },
        mainConcerns: {
          label: "Main Cybersecurity Concerns",
          helper: "Example: ransomware risk, IAM gaps, supplier risk, incident readiness.",
        },
      },
      options: {
        companySize: ["Micro (1-10)", "Small (11-50)", "Medium (51-250)", "Large (251-1000)", "Enterprise (1000+)"],
        industry: ["Automotive", "Manufacturing", "Finance", "Healthcare", "Technology", "Logistics", "Energy", "Public Sector", "Other"],
        itEnvironment: ["Cloud", "On-premise", "Hybrid"],
        yesNoPartial: ["Yes", "No", "Partially"],
        certification: ["ISO 27001 Certified", "ISO 27001 In Progress", "TISAX Label Achieved", "SOC 2", "None"],
        maturity: ["Initial", "Developing", "Defined", "Managed", "Optimized"],
      },
    },
    stage2: {
      maturityOptions: {
        not_implemented: "Not Implemented",
        partially_implemented: "Partially Implemented",
        defined: "Defined",
        managed: "Managed",
        optimized: "Optimized",
      },
      sections: {
        governance: {
          title: "Governance and Security Policies",
          helper: "Evaluate ownership, policy quality, and oversight discipline.",
          questions: {
            gov_policy_framework: {
              text: "Do you maintain a documented and approved cybersecurity policy framework?",
              helper: "Include policy ownership, periodic review, and management sign-off.",
            },
            gov_risk_governance: {
              text: "Is cybersecurity risk reviewed by leadership using a formal governance cadence?",
              helper: "Examples: monthly steering meetings, defined risk acceptance process.",
            },
            gov_role_responsibility: {
              text: "Are security roles and responsibilities clearly defined across business and IT teams?",
            },
          },
        },
        asset_protection: {
          title: "Asset and Information Protection",
          helper: "Measure data classification, protection controls, and lifecycle handling.",
          questions: {
            asset_inventory: { text: "Is there a complete and updated inventory of critical assets and data repositories?" },
            asset_data_classification: {
              text: "Do you classify sensitive data and enforce handling rules by classification level?",
            },
            asset_protection_controls: {
              text: "Are encryption, backup, and endpoint protection controls consistently applied to critical systems?",
            },
          },
        },
        iam: {
          title: "Identity and Access Management",
          helper: "Assess identity controls, least privilege, and access lifecycle maturity.",
          questions: {
            iam_mfa: { text: "Is multi-factor authentication enforced for privileged and remote access?" },
            iam_joiner_mover_leaver: {
              text: "Are joiner-mover-leaver processes automated and timely for access provisioning and deprovisioning?",
            },
            iam_privileged_access: {
              text: "Do you regularly review privileged accounts and apply least-privilege principles?",
            },
          },
        },
        third_party: {
          title: "Third-Party / Supplier Security",
          helper: "Understand external risk management maturity.",
          questions: {
            tp_due_diligence: { text: "Do you perform cybersecurity due diligence before onboarding suppliers?" },
            tp_contractual_controls: {
              text: "Are security requirements and incident notification obligations included in supplier contracts?",
            },
            tp_monitoring: { text: "Do you periodically reassess supplier risk and monitor high-risk vendors?" },
          },
        },
        incident_response: {
          title: "Incident Detection and Response",
          helper: "Gauge readiness to detect, contain, and recover from incidents.",
          questions: {
            ir_monitoring: { text: "Do you have centralized logging and monitoring for suspicious security events?" },
            ir_playbooks: { text: "Are documented incident response playbooks tested through exercises?" },
            ir_post_incident: { text: "Do you conduct post-incident reviews and track corrective actions?" },
          },
        },
        business_continuity: {
          title: "Business Continuity and Recovery",
          helper: "Evaluate resilience planning and operational recovery strength.",
          questions: {
            bcp_documented: {
              text: "Is there a documented business continuity and disaster recovery plan for critical services?",
            },
            bcp_tested: { text: "Are recovery objectives (RTO/RPO) defined and validated through testing?" },
            bcp_dependencies: { text: "Do continuity plans account for third-party and infrastructure dependencies?" },
          },
        },
        awareness: {
          title: "Security Awareness and Training",
          helper: "Assess workforce awareness and secure behavior reinforcement.",
          questions: {
            awareness_program: { text: "Is there a structured and recurring security awareness program for employees?" },
            awareness_phishing: {
              text: "Do you run phishing simulations or practical training to reinforce behavior?",
            },
            awareness_role_based: {
              text: "Is role-based security training delivered for high-risk functions (IT, finance, executives)?",
            },
          },
        },
      },
    },
    results: {
      stage2Results: "Stage 2 Results",
      readinessScore: "Cybersecurity Readiness Score",
      executiveSummaryTitle: "Executive Summary",
      sectionScores: "Section Scores",
      answered: "answered",
      topRiskAreas: "Top High-Risk Areas",
      priorityRecommendations: "Priority Recommendations",
      retake: "Retake Stage 2",
    },
    executive: {
      high: {
        readiness: "The organization demonstrates a strong overall cybersecurity readiness posture",
        priority: "The immediate priority is to optimize consistency and reporting discipline in",
      },
      medium: {
        readiness: "The organization shows a developing cybersecurity readiness level with meaningful foundational controls in place",
        priority: "The immediate priority is to strengthen control maturity in",
      },
      low: {
        readiness: "The organization is currently at an early cybersecurity readiness level and faces elevated operational risk",
        priority: "The immediate priority is to establish baseline controls and governance in",
      },
      weakAreasPrefix: "the main weak areas are",
    },
    recommendations: {
      catalog: {
        governance: "Establish a formal governance cadence with policy ownership, leadership review, and measurable risk decisions.",
        asset_protection: "Create a complete asset inventory and enforce classification-based controls for sensitive data protection.",
        iam: "Implement stronger IAM hygiene with MFA coverage, privilege reviews, and automated access lifecycle controls.",
        third_party: "Strengthen supplier security by introducing risk-tiered due diligence and contractual cyber control requirements.",
        incident_response: "Improve incident readiness with tested playbooks, centralized detection, and post-incident corrective action tracking.",
        business_continuity: "Define and test continuity objectives, including dependency-aware disaster recovery for critical operations.",
        awareness: "Expand awareness programs with role-based training and recurring practical simulations such as phishing exercises.",
      },
      baseline: [
        "Define a 90-day remediation roadmap with accountable owners and monthly progress checkpoints.",
        "Track improvement KPIs per domain to demonstrate measurable maturity gains over time.",
      ],
    },
  },
  tr: {
    language: { en: "EN", tr: "TR", switcherLabel: "Dil" },
    common: {
      signOut: "Cikis Yap",
      back: "Geri",
      step: "Adim",
      saveAndContinue: "Kaydet ve Devam Et",
      continueToStage2: "Asama 2'ye Gec",
      requiredField: "Bu alan zorunludur.",
      profileNotSet: "Profil ayarlanmadi",
      scoreNotSet: "Skor mevcut degil",
    },
    feedback: {
      authFillAll: "Lutfen tum alanlari doldurun ve en az 8 karakterlik sifre kullanin.",
      passwordMismatch: "Sifreler eslesmiyor.",
      usernameExists: "Kullanici adi zaten var.",
      accountCreated: "Hesap olusturuldu. Devam etmek icin giris yapin.",
      invalidCredentials: "Kullanici adi veya sifre hatali.",
      stage1Saved: "Asama 1 ilerlemesi kaydedildi.",
      stage1Complete: "Asama 1 tamamlandi. Simdi Asama 2 siber hazirlik degerlendirmesine gecin.",
      stage2Saved: "Asama 2 ilerlemesi kaydedildi.",
      stage2Incomplete: "Lutfen bu bolumdeki tum sorulari yanitlayin.",
      stage2Complete: "Asama 2 degerlendirmesi tamamlandi.",
      stage2Reset: "Asama 2 sifirlandi. Degerlendirmeyi tekrar yapabilirsiniz.",
      signedOut: "Cikis yapildi.",
      editProfile: "Asama 1 profil bilgilerini guncelleyip tekrar devam edebilirsiniz.",
    },
    auth: {
      introKicker: "YZ Tabanli TISAX Platformu",
      introTitle: "Siber Guvenlik Degerlendirme Baslangici",
      introDesc:
        "Guvenli kimlik dogrulama ile baslayin. Ilk giriste Asama 1 kurumsal profili, ardindan oncelikli bosluklari belirlemek icin Asama 2 hazirlik degerlendirmesini tamamlayin.",
      introPoints: [
        "Yapilandirilmis TISAX ve siber guvenlik veri toplama",
        "Olgunluk seviyesine dayali kontrol degerlendirmesi",
        "Aksiyon odakli onerilerle net skor ciktisi",
      ],
      signInTab: "Giris Yap",
      signUpTab: "Kayit Ol",
      secureAccess: "Guvenli Erisim",
      signInDesc: "Asama 1 profilini baslatmak icin kurum hesabinla giris yap.",
      createAccount: "Hesap Olustur",
      signUpDesc: "TISAX hazirlik degerlendirmesi icin yonetici hesabi olusturun.",
      username: "Kullanici Adi",
      password: "Sifre",
      continue: "Devam Et",
      sampleUser: "Ornek ilk giris kullanicisi: `new_admin` / `Welcome123!`",
      companyName: "Sirket Adi",
      confirmPassword: "Sifre Tekrari",
      minPassword: "En az 8 karakter kullanin.",
      createAccountBtn: "Hesap Olustur",
    },
    journey: {
      stage1: "Asama 1: Kurum Profili",
      stage2: "Asama 2: Hazirlik Degerlendirmesi",
      results: "Sonuc Ozeti",
      sharedProfile: "Paylasilan Profil Baglami",
      editProfile: "Kurum Profilini Duzenle",
    },
    stage1: {
      sections: [
        { key: "context", indicatorTitle: "Kurum Baglami", title: "Sirket Profili", description: "Kim oldugunuzu ve nerede faaliyet gosterdiginizi belirtin." },
        { key: "tech", indicatorTitle: "Teknoloji ve Bagimliliklar", title: "BT Ortami ve Kritik Varliklar", description: "Teknik yapinizi ve dis bagimliliklari haritalayin." },
        { key: "governance", indicatorTitle: "Guvenlik Yonetisimi ve Uyum", title: "Guvenlik Yonetisimi ve Uyum", description: "Politika kapsamini ve uyum durumunu belirleyin." },
        { key: "risk", indicatorTitle: "Olgunluk ve Oncelikli Riskler", title: "Olgunluk ve Oncelikli Riskler", description: "Mevcut siber guvenlik olgunlugunu ve temel endiseleri kaydedin." },
      ],
      fields: {
        companyName: { label: "Sirket Adi", helper: "Yasal veya yaygin kullanilan isletme adi." },
        companySize: { label: "Sirket Buyuklugu", helper: "Karsilastirma icin boyut araligi secin." },
        industrySector: { label: "Sektor", helper: "Sektore ozgu tehdit modelleri icin kullanilir." },
        numberOfEmployees: { label: "Calisan Sayisi", helper: "Yaklasik toplam is gucu." },
        countryRegion: { label: "Ulke / Bolge", helper: "Birincil faaliyet cografyasi." },
        officeLocations: { label: "Ofis Lokasyonu Sayisi", helper: "Merkez ve subeleri dahil edin." },
        itEnvironment: { label: "BT Ortami", helper: "Birincil barindirma modeli." },
        thirdPartyProviders: { label: "Ucuncu Taraf Saglayicilar", helper: "Sistemlere veya verilere erisimi olan tedarikciler." },
        criticalAssets: { label: "Kritik Varliklar / Hassas Veriler", helper: "Ornek: musteri KVK verileri, kaynak kodu, uretim sistemleri, finans kayitlari." },
        securityPolicies: { label: "Guvenlik Politikalari", helper: "Dokumante bilgi guvenligi politikalari mevcut mu?" },
        certificationStatus: { label: "ISO 27001 veya Benzeri Sertifikasyon", helper: "Guncel sertifikasyon durumu." },
        regulatoryRequirements: { label: "Regulasyon Gereksinimleri", helper: "Ornek: GDPR, NIS2, otomotiv sektoru yukumlulukleri." },
        maturityLevel: { label: "Mevcut Siber Guvenlik Olgunluk Seviyesi", helper: "En yakin olgunluk seviyesini secin." },
        mainConcerns: { label: "Ana Siber Guvenlik Endiseleri", helper: "Ornek: ransomware riski, IAM aciklari, tedarikci riski, olay hazirligi." },
      },
      options: {
        companySize: ["Mikro (1-10)", "Kucuk (11-50)", "Orta (51-250)", "Buyuk (251-1000)", "Kurumsal (1000+)"] ,
        industry: ["Otomotiv", "Uretim", "Finans", "Saglik", "Teknoloji", "Lojistik", "Enerji", "Kamu", "Diger"],
        itEnvironment: ["Bulut", "On-premise", "Hibrit"],
        yesNoPartial: ["Evet", "Hayir", "Kismen"],
        certification: ["ISO 27001 Sertifikali", "ISO 27001 Surecinde", "TISAX Etiketi Alindi", "SOC 2", "Yok"],
        maturity: ["Baslangic", "Gelisen", "Tanimli", "Yonetilen", "Optimize"],
      },
    },
    stage2: {
      maturityOptions: {
        not_implemented: "Uygulanmadi",
        partially_implemented: "Kismen Uygulandi",
        defined: "Tanimli",
        managed: "Yonetilen",
        optimized: "Optimize",
      },
      sections: {
        governance: {
          title: "Yonetisim ve Guvenlik Politikalari",
          helper: "Sahiplik, politika kalitesi ve denetim disiplinini degerlendirin.",
          questions: {
            gov_policy_framework: {
              text: "Dokumante edilmis ve onaylanmis bir siber guvenlik politika cerceveniz var mi?",
              helper: "Politika sahipligi, periyodik gozden gecirme ve yonetim onayini dahil edin.",
            },
            gov_risk_governance: {
              text: "Siber guvenlik riski, resmi bir yonetisim takvimiyle liderlik tarafindan degerlendiriliyor mu?",
              helper: "Ornek: aylik yonlendirme toplantilari, tanimli risk kabulu sureci.",
            },
            gov_role_responsibility: {
              text: "Guvenlik rol ve sorumluluklari is birimleri ve BT ekipleri genelinde net tanimlandi mi?",
            },
          },
        },
        asset_protection: {
          title: "Varlik ve Bilgi Koruma",
          helper: "Veri siniflandirmasi, koruma kontrolleri ve yasam dongusu yonetimini olcun.",
          questions: {
            asset_inventory: { text: "Kritik varliklar ve veri depolari icin guncel bir envanteriniz var mi?" },
            asset_data_classification: { text: "Hassas verileri siniflandirip sinifa gore isleme kurallari uyguluyor musunuz?" },
            asset_protection_controls: { text: "Sifreleme, yedekleme ve endpoint koruma kontrolleri kritik sistemlerde tutarli uygulanıyor mu?" },
          },
        },
        iam: {
          title: "Kimlik ve Erisim Yonetimi",
          helper: "Kimlik kontrolleri, en az ayricalik ve erisim yasam dongusu olgunlugunu degerlendirin.",
          questions: {
            iam_mfa: { text: "Yetkili ve uzaktan erisim icin cok faktorlu kimlik dogrulama zorunlu mu?" },
            iam_joiner_mover_leaver: { text: "Ise giris-rol degisimi-ayrilis surecleri erisim yonetimi icin zamaninda ve otomatik mi?" },
            iam_privileged_access: { text: "Yetkili hesaplar duzenli gozden geciriliyor ve en az ayricalik ilkesi uygulanıyor mu?" },
          },
        },
        third_party: {
          title: "Ucuncu Taraf / Tedarikci Guvenligi",
          helper: "Dis kaynakli risk yonetimi olgunlugunu anlayin.",
          questions: {
            tp_due_diligence: { text: "Tedarikciyi dahil etmeden once siber guvenlik due diligence yapiliyor mu?" },
            tp_contractual_controls: { text: "Sozlesmelerde guvenlik gereksinimleri ve olay bildirim yukumlulukleri yer aliyor mu?" },
            tp_monitoring: { text: "Tedarikci riski periyodik olarak yeniden degerlendirilip yuksek riskli tedarikciler izleniyor mu?" },
          },
        },
        incident_response: {
          title: "Olay Tespiti ve Mudahale",
          helper: "Olay tespiti, sinirlama ve toparlanma hazirligini olcun.",
          questions: {
            ir_monitoring: { text: "Supheli guvenlik olaylari icin merkezi loglama ve izleme var mi?" },
            ir_playbooks: { text: "Dokumante olay mudahale playbook'lari tatbikatlarla test ediliyor mu?" },
            ir_post_incident: { text: "Olay sonrasi inceleme yapilip duzeltici aksiyonlar takip ediliyor mu?" },
          },
        },
        business_continuity: {
          title: "Is Surekliligi ve Kurtarma",
          helper: "Dayaniklilik planlama ve operasyonel toparlanma gucunu degerlendirin.",
          questions: {
            bcp_documented: { text: "Kritik servisler icin dokumante edilmis is surekliligi ve felaket kurtarma plani var mi?" },
            bcp_tested: { text: "Kurtarma hedefleri (RTO/RPO) tanimli mi ve testlerle dogrulaniyor mu?" },
            bcp_dependencies: { text: "Sureklilik planlari ucuncu taraf ve altyapi bagimliliklarini kapsiyor mu?" },
          },
        },
        awareness: {
          title: "Guvenlik Farkindaligi ve Egitim",
          helper: "Calisan farkindaligi ve guvenli davranis pekistirmesini degerlendirin.",
          questions: {
            awareness_program: { text: "Calisanlar icin yapilandirilmis ve duzenli bir guvenlik farkindalik programi var mi?" },
            awareness_phishing: { text: "Davranisi guclendirmek icin phishing simulasyonlari veya uygulamali egitimler yapiyor musunuz?" },
            awareness_role_based: { text: "Yuksek riskli roller icin rol bazli guvenlik egitimi veriliyor mu (BT, finans, yonetim)?" },
          },
        },
      },
    },
    results: {
      stage2Results: "Asama 2 Sonuclari",
      readinessScore: "Siber Guvenlik Hazirlik Skoru",
      executiveSummaryTitle: "Yonetici Ozeti",
      sectionScores: "Bolum Skorlari",
      answered: "yanitlandi",
      topRiskAreas: "Yuksek Riskli Alanlar",
      priorityRecommendations: "Oncelikli Iyilestirme Onerileri",
      retake: "Asama 2'yi Tekrarla",
    },
    executive: {
      high: {
        readiness: "Kurum, genel olarak guclu bir siber guvenlik hazirlik seviyesine sahiptir",
        priority: "En acil oncelik, asagidaki alanlarda tutarlilik ve raporlama disiplinini gelistirmektir",
      },
      medium: {
        readiness: "Kurum, temel kontrollerin anlamli bicimde bulundugu gelisen bir siber guvenlik hazirlik seviyesindedir",
        priority: "En acil oncelik, asagidaki alanlarda kontrol olgunlugunu guclendirmektir",
      },
      low: {
        readiness: "Kurum, siber guvenlik hazirliginda erken asamadadir ve operasyonel risk seviyesi yuksektir",
        priority: "En acil oncelik, asagidaki alanlarda temel kontrol ve yonetisim yapisini olusturmaktir",
      },
      weakAreasPrefix: "ana zayif alanlar",
    },
    recommendations: {
      catalog: {
        governance: "Politika sahipligi, yonetim gozden gecirmesi ve olculebilir risk kararlarini iceren resmi bir yonetisim dongusu kurun.",
        asset_protection: "Kapsamli bir varlik envanteri olusturun ve hassas veri korumasi icin siniflandirma tabanli kontroller uygulayin.",
        iam: "MFA kapsami, yetki gozden gecirmeleri ve otomatik erisim yasam dongusu ile IAM hijyenini guclendirin.",
        third_party: "Risk seviyesine gore due diligence ve sozlesmesel guvenlik kontrolleriyle tedarikci guvenligini guclendirin.",
        incident_response: "Test edilmis playbook'lar, merkezi tespit ve olay sonrasi aksiyon takibiyle olay hazirligini iyilestirin.",
        business_continuity: "Kritik operasyonlar icin bagimliliklari kapsayan kurtarma hedeflerini tanimlayip duzenli test edin.",
        awareness: "Rol bazli egitimler ve phishing simulasyonlari gibi uygulamalarla farkindalik programlarini genisletin.",
      },
      baseline: [
        "90 gunluk bir iyilestirme yol haritasi belirleyin; sorumlulari atayin ve aylik takip noktalari olusturun.",
        "Alan bazli KPI'lar ile olgunluk gelisimini olculebilir hale getirin.",
      ],
    },
  },
};

export function getText(language) {
  return translations[language] || translations[defaultLanguage];
}
