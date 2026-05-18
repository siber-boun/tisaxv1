import { useState } from "react";
import "./Layout.css";

export default function Layout({ children }) {
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  return (
    <div className="app-container">
      <header className="top-header">
        <h1>BUSİBER Otomotiv Siber Güvenliği Platformu</h1>
      </header>
      <div className="dashboard-layout">
        <aside className="sidebar">
          <div className="sidebar-header">
            <h2 className="brand-title">BUSİBER OSG</h2>
          </div>

        <nav className="sidebar-nav">
          <ul>
            <li>
              <button className="nav-item active">
                <span className="icon">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"></polygon></svg>
                </span>
                <span className="label">Hızlı Siber Olgunluk Testi</span>
              </button>
            </li>
            <li>
              <button className="nav-item">
                <span className="icon">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m12 22-8-4.615V8.154L12 2l8 4.615v9.231z"/><path d="m9 12 2 2 4-4"/></svg>
                </span>
                <span className="label">TISAX Denetimi</span>
              </button>
            </li>
            <li>
              <button className="nav-item">
                <span className="icon">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 17h2c.6 0 1-.4 1-1v-3c0-.9-.7-1.7-1.5-1.9C18.7 10.6 16 10 16 10s-1.3-1.4-2.2-2.3c-.5-.4-1.1-.7-1.8-.7H5c-.6 0-1.1.4-1.4.9l-1.4 2.9A3.7 3.7 0 0 0 2 12v4c0 .6.4 1 1 1h2"/><circle cx="7" cy="17" r="2"/><path d="M9 17h6"/><circle cx="17" cy="17" r="2"/></svg>
                </span>
                <span className="label">ISO/SAE 21434 Denetimi</span>
              </button>
            </li>
            <li>
              <button className="nav-item">
                <span className="icon">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m7.5 4.27 9 5.15"/><path d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z"/><path d="m3.3 7 8.7 5 8.7-5"/><path d="M12 22V12"/></svg>
                </span>
                <span className="label">Varlık Yönetimi</span>
              </button>
            </li>
            <li>
              <button className="nav-item">
                <span className="icon">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 3v18h18"/><path d="m19 9-5 5-4-4-3 3"/></svg>
                </span>
                <span className="label">Risk Yönetimi</span>
              </button>
            </li>
            <li>
              <button className="nav-item">
                <span className="icon">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="16" y="16" width="6" height="6" rx="1"/><rect x="2" y="16" width="6" height="6" rx="1"/><rect x="9" y="2" width="6" height="6" rx="1"/><path d="M5 16v-3a1 1 0 0 1 1-1h12a1 1 0 0 1 1 1v3"/><path d="M12 12V8"/></svg>
                </span>
                <span className="label">Tehdit Modellemesi</span>
              </button>
            </li>
            <li>
              <button className="nav-item">
                <span className="icon">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/></svg>
                </span>
                <span className="label">Zafiyet ve Sızma Testi</span>
              </button>
            </li>
            
            <li className={`accordion-item ${userMenuOpen ? "open" : ""}`}>
              <button 
                className="nav-item" 
                onClick={() => setUserMenuOpen(!userMenuOpen)}
              >
                <span className="icon">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
                </span>
                <span className="label">Kullanıcı Yönetimi</span>
                <span className="chevron">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ transform: userMenuOpen ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.2s' }}>
                    <path d="m6 9 6 6 6-6"/>
                  </svg>
                </span>
              </button>
              {userMenuOpen && (
                <ul className="sub-nav">
                  <li>
                    <button className="sub-nav-item">Yeni Kullanıcı Ekle</button>
                  </li>
                  <li>
                    <button className="sub-nav-item">Görev Ata</button>
                  </li>
                </ul>
              )}
            </li>

            <li>
              <button className="nav-item">
                <span className="icon">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 3v18h18"/><path d="M18 17V9"/><path d="M13 17V5"/><path d="M8 17v-3"/></svg>
                </span>
                <span className="label">Raporlama ve Analiz</span>
              </button>
            </li>
          </ul>
        </nav>
      </aside>

      <div className="main-content-wrapper">
        <div className="main-content">
          {children}
        </div>
      </div>
    </div>
    </div>
  );
}
