import React, { useState } from 'react';
import './LoginPage.css';

export default function LoginPage({ users, onLogin, onAddUser }) {
  // 'login' or 'signup' modes
  const [mode, setMode] = useState('signup'); 
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    surname: '',
    email: '',
    username: '', // Required for Login
    password: '',
    terms: false
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    if (mode === 'signup') {
      if (!formData.terms) {
        setError('Lütfen kullanım koşullarını kabul edin.');
        return;
      }
      
      const newUser = {
        username: formData.email, // Email acts as username
        password: formData.password,
        name: `${formData.name} ${formData.surname}`,
        role: 'Denetçi',
        companyName: 'Yeni Katılımcı',
        firstLogin: false
      };

      const result = onAddUser(newUser);
      if (result.success) {
        onLogin(newUser);
      } else {
        setError(result.message);
      }
    } else {
      // Login Mode
      const matchedUser = users.find(
        u => u.username === formData.username && u.password === formData.password
      );

      if (matchedUser) {
        onLogin(matchedUser);
      } else {
        setError('Hatalı kullanıcı adı veya şifre.');
      }
    }
  };

  return (
    <div className="auth-master-wrapper">
      {/* 1. Upper Menu Bar (Header) */}
      <header className="auth-header">
        <div className="auth-logo">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#2563eb" strokeWidth="2">
            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
          </svg>
          <span>BUSİBER OSG</span>
        </div>
        <nav className="auth-nav">
          <button 
            className={`nav-btn ${mode === 'login' ? 'active' : ''}`} 
            onClick={() => setMode('login')}
          >
            Giriş Yap
          </button>
          <button 
            className={`nav-btn signup-nav ${mode === 'signup' ? 'active' : ''}`} 
            onClick={() => setMode('signup')}
          >
            Kayıt Ol
          </button>
        </nav>
      </header>

      <div className="auth-split-container">
        {/* 2. LEFT SECTION: Futuristic Image */}
        <div className="auth-image-side">
          <div className="image-overlay"></div>
          <div className="image-text-content">
            <h2>Geleceğin Güvenlik Standartları</h2>
            <p>Otomotiv ekosisteminde uçtan uca siber güvenlik yönetimi ve TISAX uyum süreçleri.</p>
          </div>
        </div>

        {/* 3. RIGHT SECTION: Form Area */}
        <div className="auth-form-side">
          <div className="form-container">
            <div className="form-welcome">
              <h2>{mode === 'signup' ? 'Yeni Kullanıcı Oluştur' : 'Sisteme Erişim Sağla'}</h2>
              <p>{mode === 'signup' ? 'Platformun tüm avantajlarından yararlanmak için kaydolun.' : 'Lütfen kimlik bilgilerinizi girerek devam edin.'}</p>
            </div>

            <form onSubmit={handleSubmit} className="auth-main-form">
              {mode === 'signup' ? (
                <>
                  <div className="form-row">
                    <div className="input-group">
                      <label>İsim</label>
                      <input type="text" placeholder="İsim" required value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} />
                    </div>
                    <div className="input-group">
                      <label>Soyisim</label>
                      <input type="text" placeholder="Soyisim" required value={formData.surname} onChange={e => setFormData({...formData, surname: e.target.value})} />
                    </div>
                  </div>
                  <div className="input-group">
                    <label>E-posta Adresi</label>
                    <input type="email" placeholder="ornek@sirket.com" required value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} />
                  </div>
                </>
              ) : (
                <div className="input-group">
                  <label>Kullanıcı Adı veya E-posta</label>
                  <input type="text" placeholder="Kullanıcı adınız" required value={formData.username} onChange={e => setFormData({...formData, username: e.target.value})} />
                </div>
              )}

              <div className="input-group">
                <label>{mode === 'signup' ? 'Şifre Oluştur' : 'Şifre'}</label>
                <input type="password" placeholder="••••••••" required value={formData.password} onChange={e => setFormData({...formData, password: e.target.value})} />
              </div>

              {mode === 'signup' && (
                <div className="terms-checkbox">
                  <input type="checkbox" id="terms" checked={formData.terms} onChange={e => setFormData({...formData, terms: e.target.checked})} />
                  <label htmlFor="terms">BUSİBER OSG Kullanım Koşulları'nı kabul ediyorum.</label>
                </div>
              )}

              {error && <div className="auth-error-panel">{error}</div>}

              <button type="submit" className="auth-primary-submit">
                {mode === 'signup' ? 'Hesabı Oluştur ve Giriş Yap' : 'Sisteme Giriş Yap'}
              </button>
            </form>

            <div className="form-switch-link">
              {mode === 'signup' ? (
                <p>Zaten bir hesabınız var mı? <button onClick={() => setMode('login')}>Giriş Yapın</button></p>
              ) : (
                <p>Hesabınız yok mu? <button onClick={() => setMode('signup')}>Kayıt Olun</button></p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
