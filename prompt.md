# 📝 BUSİBER OSG - Prompt & Talimat Geçmişi

Bu dosya, projenin gelişim sürecinde verilen ana direktifleri kronolojik olarak içerir.

## 🟢 Bölüm 1: Dashboard ve Menü Yapılandırması
1. **Dashboard Refaktörü:** Dashboard layout yapısını ve görünüm geçişlerini kodla. Harici CSS kullanma, monokromatik B2B tasarımı (koyu maviler, griler) uygula.
2. **Menü Hiyerarşisi:** Hızlı Siber Olgunluk Testi, TISAX, ISO 21434, Varlık, Risk, Tehdit, Zafiyet ve Kullanıcı Yönetimi menülerini oluştur. Saf SVG ikonlar kullan.
3. **Kullanıcı Yönetimi:** Tıklanabilir akordeon yapısında 'Yeni Kullanıcı Ekle' ve 'Görev Ata' alt menülerini ekle.

## 🔵 Bölüm 2: Görselleştirme ve Analiz Modülleri
4. **Radar Chart Entegrasyonu:** Saf SVG tabanlı, trigonometrik hesaplamalı dinamik Radar Grafiği bileşeni oluştur. 7 boyutu (Governance, IAM, vb.) desteklesin.
5. **Raporlama Ekranı:** Geçmiş 3 testi temsil eden radar grafiklerini listele, altına tarih ve saat bilgisi ekle.
6. **Varlık Yönetimi:** Varlık Kimliği, Adı, Tipi, Lokasyon ve Sahibi bilgilerini içeren dinamik tablo ve varlık ekleme formu oluştur.
7. **CIA Entegrasyonu:** Varlık yönetimine Gizlilik (C), Bütünlük (I) ve Erişilebilirlik (A) (1-3 arası) seçimlerini ve micro-badge gösterimlerini ekle.
8. **Risk Yönetimi (TARA):** CIA değerlerinden beslenen (Impact = Max CIA), olasılık x etki formüllü dinamik risk tablosu ve ısı matrisi özet widget'larını ekle.

## 🟡 Bölüm 3: Endüstri Standartları ve Güvenlik
9. **Tehdit Modellemesi (STRIDE):** Varlık bazlı S-T-R-I-D-E analizi paneli oluştur. Tehdit ekleme ve "Açık/Giderildi" durum takibi ekle.
10. **ISO/SAE 21434 Denetimi:** 3 sekmeli yapı: CSMS Uyumu, TARA/CAL Seviyeleri ve Yaşam Döngüsü Stepper'ı oluştur.
11. **TISAX Denetimi (VDA ISA 6.0):** ISA kontrol listesi, dinamik Bar Chart olgunluk analizi ve sertifikasyon etiketlerini ekle.
12. **Zafiyet Takibi:** CVE listesi, Pentest rapor yönetimi ve İyileştirme Planı (Progress bar) modülünü ekle.

## 🔴 Bölüm 4: Auth, Kalıcılık ve Final Temalandırma
13. **Giriş Sistemi (Auth):** Kapalı sistem mimarisi. `bilginx` / `1qazwsX` ve `bilgin` / `1qaz2wsx` yetkili girişlerini tanımla.
14. **Birleşik Auth Paneli:** 50/50 bölünmüş ekran tasarımı. Sol tarafta `hero-image.png` görseli ve overlay, sağ tarafta kurumsal form yerleşimi sağla.
15. **Merkezi Dashboard (Pano):** Tüm modüllerin özetlerini (Radar, Risk, Zafiyet, ISO) içeren "Dark Console" vizyonunda ana sayfa panosu oluştur.
16. **Global Tema Yayılımı:** Dashboard'daki koyu lacivert/siber yeşil Dark Console tasarımını tüm alt sayfalara ve tablolara uyarla.
17. **LocalStorage Kalıcılığı:** Tüm modül verilerini (Assets, Threats, Vulns, Users) tarayıcı hafızasıyla senkronize ederek sayfayı yenileseniz bile verilerin korunmasını sağla.
18. **Türkçe Karakter Hassasiyeti:** Ana başlığı "BUSİBER OTOMOTİV SİBER GÜVENLİĞİ PLATFORMU" olarak Türkçe karakterlere dikkat ederek güncelle.

## 🟣 Bölüm 5: Optimizasyon, Modülerlik ve Light Mode
19. **Kod Modülerleştirme:** `App.jsx` üzerindeki yükü azaltmak için `storage.js`, `initialData.js`, `OnboardingFlow.jsx` ve `AssessmentFlow.jsx` bileşenlerini oluştur ve mantığı buraya taşı.
20. **Merkezi İkon Kütüphanesi:** Tüm SVG ikonlarını `Icons.jsx` bileşeni altında topla ve `Layout.jsx` üzerinden yönet.
21. **Light Mode (Gündüz Modu):** Koyu tema yerine modern bir ışık modu alternatifi ekle (#F8F9FA arka plan, #FFFFFF sidebar). Pill-shaped tema değiştirme anahtarı (Switch) oluştur.
22. **Dinamik Renk Sistemi:** Progress bar renklerini başarı oranına göre (Yeşil >= 75%, Turuncu %50-74, Kırmızı < 50%) dinamik hale getir.
23. **Kurumsal Kimlik Uyumu:** Light Mode'da aktif öğeler için Royal Blue (#1A73E8) ve logout butonu için özel pastel kırmızı tasarımını uygula.

---
*Bu günlük projenin evrimini ve mimari kararlarını izlemek için oluşturulmuştur.*
