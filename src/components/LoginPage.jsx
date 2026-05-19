import React, { useState } from 'react';
import './LoginPage.css';

export default function LoginPage({ users, onLogin }) {
  const [formData, setFormData] = useState({ username: '', password: '' });
  const [error, setError] = useState('');

  const handleLogin = (e) => {
    e.preventDefault();
    const user = users.find(u => u.username === formData.username && u.password === formData.password);
    
    if (user) {
      onLogin(user);
    } else {
      setError('Geçersiz kullanıcı adı veya parola. Lütfen bilgilerinizi kontrol edin.');
    }
  };

  return (
    <div className="auth-wrapper">
      <div className="auth-container">
        {/* SOL BÖLÜM: Fütüristik Görsel */}
        <div className="auth-side-image">
          <div className="overlay"></div>
          <div className="image-content">
            <div className="security-shield-icon">
              <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.5">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
              </svg>
            </div>
            <h2>Yeni Nesil Otomotiv Güvenliği</h2>
            <p>ISO/SAE 21434 ve TISAX uyum süreçlerinizi dijitalleştirin.</p>
          </div>
        </div>

        {/* SAĞ BÖLÜM: Giriş Formu */}
        <div className="auth-side-form">
          <div className="form-header">
            <h1>BUSİBER OSG</h1>
            <p>Otomotiv Siber Güvenliği Yönetim Platformu</p>
          </div>

          <form onSubmit={handleLogin} className="login-box">
            <div className="input-group">
              <label>Kullanıcı Adı</label>
              <input 
                type="text" 
                placeholder="Kullanıcı adınız" 
                value={formData.username}
                onChange={(e) => setFormData({...formData, username: e.target.value})}
                required 
              />
            </div>
            <div className="input-group">
              <label>Şifre</label>
              <input 
                type="password" 
                placeholder="••••••••" 
                value={formData.password}
                onChange={(e) => setFormData({...formData, password: e.target.value})}
                required 
              />
            </div>
            
            {error && <div className="error-message">{error}</div>}

            <button type="submit" className="login-submit-btn">Sisteme Giriş Yap</button>
          </form>

          <div className="form-footer">
            <small>© 2026 BUSİBER Laboratory · Tüm hakları saklıdır.</small>
          </div>
        </div>
      </div>
    </div>
  );
}
