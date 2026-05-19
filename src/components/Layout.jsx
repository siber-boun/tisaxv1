import { useState } from "react";
import "./Layout.css";
import { Icons } from "./Icons";

export default function Layout({ children, activeTab, onTabChange, activeRole, onRoleChange, currentUser, onLogout }) {
  const menuItems = [
    {
      id: "dashboard",
      label: "Ana Sayfa / Pano",
      icon: <Icons.Dashboard />
    },
    {
      id: "hizli-test",
      label: "Hızlı Siber Olgunluk Testi",
      icon: <Icons.Lightning />
    },
    {
      id: "tisax",
      label: "TISAX Denetimi",
      icon: <Icons.Shield />
    },
    {
      id: "iso",
      label: "ISO/SAE 21434 Denetimi",
      icon: <Icons.Clock />
    },
    {
      id: "varlik",
      label: "Varlık Yönetimi",
      icon: <Icons.Box />
    },
    {
      id: "risk",
      label: "Risk Yönetimi",
      icon: <Icons.Alert />
    },
    {
      id: "tehdit",
      label: "Tehdit Modellemesi",
      icon: <Icons.Layers />
    },
    {
      id: "zafiyet",
      label: "Zafiyet ve Sızma Testi Yönetimi",
      icon: <Icons.Target />
    }
  ];

  return (
    <div className="app-container">
      <header className="top-header">
        <div className="header-brand">
          <h1>BUSİBER OTOMOTİV SİBER GÜVENLİĞİ PLATFORMU</h1>
        </div>

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
                    <span className="icon"><Icons.Users /></span>
                    <span className="label">Kullanıcı Yönetimi</span>
                  </button>
                </li>
              )}

              <li>
                <button 
                  className={`nav-item ${activeTab === "raporlama" ? "active" : ""}`}
                  onClick={() => onTabChange("raporlama")}
                >
                  <span className="icon"><Icons.PieChart /></span>
                  <span className="label">Raporlama ve Analiz</span>
                </button>
              </li>
            </ul>
          </nav>

          <div className="sidebar-footer">
            <button className="logout-action-btn" onClick={onLogout}>
              <Icons.Logout />
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
