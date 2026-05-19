import { useState } from "react";
import "./Layout.css";

export default function Layout({ children, activeTab, onTabChange, activeRole, onRoleChange, currentUser, onLogout }) {
  // Common SVG properties
  const svgProps = {
    xmlns: "http://www.w3.org/2000/svg",
    width: "20",
    height: "20",
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: "2",
    strokeLinecap: "round",
    strokeLinejoin: "round"
  };

  const menuItems = [
    {
      id: "dashboard",
      label: "Ana Sayfa / Pano",
      icon: (
        <svg {...svgProps}>
          <rect x="3" y="3" width="7" height="7"></rect>
          <rect x="14" y="3" width="7" height="7"></rect>
          <rect x="14" y="14" width="7" height="7"></rect>
          <rect x="3" y="14" width="7" height="7"></rect>
        </svg>
      )
    },
    {
      id: "hizli-test",
      label: "Hızlı Siber Olgunluk Testi",
      icon: (
        <svg {...svgProps}>
          <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
        </svg>
      )
    },
    {
      id: "tisax",
      label: "TISAX Denetimi",
      icon: (
        <svg {...svgProps}>
          <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
          <path d="M9 12l2 2 4-4" />
        </svg>
      )
    },
    {
      id: "iso",
      label: "ISO/SAE 21434 Denetimi",
      icon: (
        <svg {...svgProps}>
          <circle cx="12" cy="12" r="10" />
          <path d="M12 8v4l3 3" />
        </svg>
      )
    },
    {
      id: "varlik",
      label: "Varlık Yönetimi",
      icon: (
        <svg {...svgProps}>
          <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
          <polyline points="3.27 6.96 12 12.01 20.73 6.96" />
          <line x1="12" y1="22.08" x2="12" y2="12" />
        </svg>
      )
    },
    {
      id: "risk",
      label: "Risk Yönetimi",
      icon: (
        <svg {...svgProps}>
          <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
          <line x1="12" y1="9" x2="12" y2="13" />
          <line x1="12" y1="17" x2="12.01" y2="17" />
        </svg>
      )
    },
    {
      id: "tehdit",
      label: "Tehdit Modellemesi",
      icon: (
        <svg {...svgProps}>
          <path d="M12 2L2 7l10 5 10-5-10-5z" />
          <path d="M2 17l10 5 10-5" />
          <path d="M2 12l10 5 10-5" />
        </svg>
      )
    },
    {
      id: "zafiyet",
      label: "Zafiyet ve Sızma Testi Yönetimi",
      icon: (
        <svg {...svgProps}>
          <circle cx="12" cy="12" r="10" />
          <line x1="22" y1="12" x2="18" y2="12" />
          <line x1="6" y1="12" x2="2" y2="12" />
          <line x1="12" y1="6" x2="12" y2="2" />
          <line x1="12" y1="22" x2="12" y2="18" />
        </svg>
      )
    }
  ];

  return (
    <div className="app-container">
      <header className="top-header">
        <div className="header-brand">
          <h1>BUSİBER Otomotiv Siber Güvenliği Platformu</h1>
        </div>

        {/* SAĞ ÜST: Profil Rozeti */}
        <div className="header-profile">
          <div className="profile-badge">
            <div className="profile-info">
              <span className="profile-name">{currentUser?.name || currentUser?.username}</span>
              <span className="profile-role">{currentUser?.role}</span>
            </div>
            <div className="profile-avatar">
              {(currentUser?.name || currentUser?.username || 'U').charAt(0).toUpperCase()}
            </div>
          </div>
        </div>
      </header>
      
      <div className="dashboard-layout">
        <aside className="sidebar">
          <div className="sidebar-header-wrapper">
            <div className="sidebar-header">
              <h2 className="brand-title">BUSİBER OSG</h2>
            </div>
            
            <div className="role-selector-container">
              <label>Aktif Rol</label>
              <select value={activeRole} onChange={(e) => onRoleChange(e.target.value)}>
                <option value="admin">Yönetici</option>
                <option value="auditor">Denetçi</option>
              </select>
            </div>
          </div>

          <nav className="sidebar-nav">
            <ul>
              {menuItems.map((item) => (
                <li key={item.id}>
                  <button 
                    className={`nav-item ${activeTab === item.id ? "active" : ""}`}
                    onClick={() => onTabChange(item.id)}
                  >
                    <span className="icon">{item.icon}</span>
                    <span className="label">{item.label}</span>
                  </button>
                </li>
              ))}

              {activeRole === "admin" && (
                <li>
                  <button 
                    className={`nav-item ${activeTab === "kullanici-yonetimi" ? "active" : ""}`}
                    onClick={() => onTabChange("kullanici-yonetimi")}
                  >
                    <span className="icon">
                      <svg {...svgProps}>
                        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                        <circle cx="9" cy="7" r="4" />
                        <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
                        <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                      </svg>
                    </span>
                    <span className="label">Kullanıcı Yönetimi</span>
                  </button>
                </li>
              )}

              <li>
                <button 
                  className={`nav-item ${activeTab === "raporlama" ? "active" : ""}`}
                  onClick={() => onTabChange("raporlama")}
                >
                  <span className="icon">
                    <svg {...svgProps}>
                      <path d="M21.21 15.89A10 10 0 1 1 8 2.83" />
                      <path d="M22 12A10 10 0 0 0 12 2v10z" />
                    </svg>
                  </span>
                  <span className="label">Raporlama ve Analiz</span>
                </button>
              </li>
            </ul>
          </nav>

          {/* SOL ALT: Logout Butonu */}
          <div className="sidebar-footer">
            <button className="logout-action-btn" onClick={onLogout}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4M16 17l5-5-5-5M21 12H9"/>
              </svg>
              <span>Güvenli Çıkış</span>
            </button>
          </div>
        </aside>

        <main className="main-content-wrapper">
          <div className="main-content">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
