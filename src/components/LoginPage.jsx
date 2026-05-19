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
    <div className="auth-master-wrapper" style={{ display: 'flex', minHeight: '100vh', width: '100vw' }}>
      
      {/* SOL BÖLÜM (Hero Alanı) */}
      <div 
        className="auth-image-side"
        style={{
          flex: 1,
          position: 'relative',
          backgroundImage: `url('hero-image.png')`, 
          backgroundSize: 'cover', 
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'flex-end',
          padding: '4rem',
          color: 'white',
        }}
      >
        <div 
          className="image-overlay"
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            backgroundColor: 'rgba(15, 23, 42, 0.65)', 
            zIndex: 1
          }}
        ></div>

        <div className="image-text-content" style={{ position: 'relative', zIndex: 2 }}>
          <div style={{ position: 'absolute', top: '-18rem', left: '0' }}>
            <span style={{ fontSize: '1.5rem', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '10px' }}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
              </svg>
              BUSİBER OSG
            </span>
          </div>
          
          <h1 style={{ fontSize: '2.8rem', fontWeight: 'bold', marginBottom: '1rem', lineHeight: '1.2' }}>
            Geleceğin Güvenlik<br />Standartları
          </h1>
          <p style={{ fontSize: '1.2rem', opacity: 0.9, maxWidth: '500px', lineHeight: '1.6' }}>
            Otomotiv ekosisteminde uçtan uca siber güvenlik yönetimi ve TISAX uyum süreçleri.
          </p>
        </div>
      </div>

      {/* SAĞ BÖLÜM: Form Alanı */}
      <div className="auth-form-side" style={{ flex: 1, backgroundColor: 'white', display: 'flex', flexDirection: 'column' }}>
        <header className="auth-header" style={{ height: '80px', padding: '0 40px', display: 'flex', alignItems: 'center', justifyContent: 'flex-end', borderBottom: '1px solid #e2e8f0' }}>
          <nav className="auth-nav" style={{ display: 'flex', gap: '10px' }}>
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

        <div className="form-scroll-container" style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '40px' }}>
          <div className="form-container" style={{ width: '100%', maxWidth: '480px' }}>
            <div className="form-welcome">
              <h2 style={{ fontSize: '1.85rem', fontWeight: 800, color: '#0f172a', margin: '0 0 8px 0' }}>
                {mode === 'signup' ? 'Yeni Kullanıcı Oluştur' : 'Sisteme Erişim Sağla'}
              </h2>
              <p style={{ color: '#64748b', margin: '0 0 32px 0', fontSize: '0.95rem' }}>
                {mode === 'signup' ? 'Platformun tüm avantajlarından yararlanmak için kaydolun.' : 'Lütfen kimlik bilgilerinizi girerek devam edin.'}
              </p>
            </div>

            <form onSubmit={handleSubmit} className="auth-main-form" style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              {mode === 'signup' ? (
                <>
                  <div className="form-row" style={{ display: 'flex', gap: '15px' }}>
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

            <div className="form-switch-link" style={{ textAlign: 'center', marginTop: '32px', color: '#64748b', fontSize: '0.9rem' }}>
              {mode === 'signup' ? (
                <p>Zaten bir hesabınız var mı? <button onClick={() => setMode('login')} style={{ background: 'none', border: 'none', color: '#2563eb', fontWeight: 700, cursor: 'pointer' }}>Giriş Yapın</button></p>
              ) : (
                <p>Hesabınız yok mu? <button onClick={() => setMode('signup')} style={{ background: 'none', border: 'none', color: '#2563eb', fontWeight: 700, cursor: 'pointer' }}>Kayıt Olun</button></p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
