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
    <div className="auth-master-wrapper" style={{ display: 'flex', minHeight: '100vh', width: '100vw', backgroundColor: '#0f172a' }}>
      
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
          justifyContent: 'space-between', // Top logo, Bottom text
          padding: '3rem',
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
            backgroundColor: 'rgba(15, 23, 42, 0.55)', 
            zIndex: 1
          }}
        ></div>

        {/* LOGO ALANI */}
        <div style={{ position: 'relative', zIndex: 2 }}>
          <span style={{ fontSize: '1.75rem', fontWeight: '800', display: 'flex', alignItems: 'center', gap: '12px', letterSpacing: '-0.02em' }}>
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5">
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
            </svg>
            BUSİBER OSG
          </span>
        </div>
        
        {/* ALT METİN ALANI */}
        <div style={{ position: 'relative', zIndex: 2 }}>
          <h1 style={{ fontSize: '3rem', fontWeight: '900', marginBottom: '1.25rem', lineHeight: '1.1', letterSpacing: '-0.04em' }}>
            Geleceğin Güvenlik<br />Standartları
          </h1>
          <p style={{ fontSize: '1.15rem', opacity: 0.9, maxWidth: '450px', lineHeight: '1.6', fontWeight: '500' }}>
            Otomotiv ekosisteminde uçtan uca siber güvenlik yönetimi ve TISAX uyum süreçleri.
          </p>
        </div>
      </div>

      {/* SAĞ BÖLÜM: Form Alanı */}
      <div className="auth-form-side" style={{ flex: 1, backgroundColor: 'white', display: 'flex', flexDirection: 'column', borderTopLeftRadius: '2rem', borderBottomLeftRadius: '2rem', overflow: 'hidden' }}>
        <header className="auth-header" style={{ height: '80px', padding: '0 40px', display: 'flex', alignItems: 'center', justifyContent: 'flex-end', borderBottom: '1px solid #f1f5f9' }}>
          <nav className="auth-nav" style={{ display: 'flex', gap: '8px' }}>
            <button 
              className={`nav-btn ${mode === 'login' ? 'active' : ''}`} 
              onClick={() => setMode('login')}
              style={{ padding: '0.6rem 1.25rem', fontSize: '0.9rem', fontWeight: '600' }}
            >
              Giriş Yap
            </button>
            <button 
              className={`nav-btn signup-nav ${mode === 'signup' ? 'active' : ''}`} 
              onClick={() => setMode('signup')}
              style={{ padding: '0.6rem 1.25rem', fontSize: '0.9rem', fontWeight: '600' }}
            >
              Kayıt Ol
            </button>
          </nav>
        </header>

        <div className="form-scroll-container" style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '3rem' }}>
          <div className="form-container" style={{ width: '100%', maxWidth: '440px' }}>
            <div className="form-welcome" style={{ marginBottom: '2.5rem' }}>
              <h2 style={{ fontSize: '2rem', fontWeight: '800', color: '#0f172a', margin: '0 0 10px 0', letterSpacing: '-0.02em' }}>
                {mode === 'signup' ? 'Yeni Kullanıcı Oluştur' : 'Sisteme Erişim Sağla'}
              </h2>
              <p style={{ color: '#64748b', margin: 0, fontSize: '1rem', fontWeight: '500' }}>
                {mode === 'signup' ? 'Platformun tüm avantajlarından yararlanmak için kaydolun.' : 'Lütfen kimlik bilgilerinizi girerek devam edin.'}
              </p>
            </div>

            <form onSubmit={handleSubmit} className="auth-main-form" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              {mode === 'signup' ? (
                <>
                  <div className="form-row" style={{ display: 'flex', gap: '1rem' }}>
                    <div className="input-group" style={{ flex: 1 }}>
                      <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', fontWeight: '600', color: '#334155' }}>İsim</label>
                      <input 
                        type="text" 
                        placeholder="İsim" 
                        required 
                        value={formData.name} 
                        onChange={e => setFormData({...formData, name: e.target.value})}
                        style={{ width: '100%', padding: '0.75rem 1rem', border: '1px solid #e2e8f0', borderRadius: '0.75rem', background: '#f8fafc' }}
                      />
                    </div>
                    <div className="input-group" style={{ flex: 1 }}>
                      <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', fontWeight: '600', color: '#334155' }}>Soyisim</label>
                      <input 
                        type="text" 
                        placeholder="Soyisim" 
                        required 
                        value={formData.surname} 
                        onChange={e => setFormData({...formData, surname: e.target.value})}
                        style={{ width: '100%', padding: '0.75rem 1rem', border: '1px solid #e2e8f0', borderRadius: '0.75rem', background: '#f8fafc' }}
                      />
                    </div>
                  </div>
                  <div className="input-group">
                    <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', fontWeight: '600', color: '#334155' }}>E-posta Adresi</label>
                    <input 
                      type="email" 
                      placeholder="ornek@sirket.com" 
                      required 
                      value={formData.email} 
                      onChange={e => setFormData({...formData, email: e.target.value})}
                      style={{ width: '100%', padding: '0.75rem 1rem', border: '1px solid #e2e8f0', borderRadius: '0.75rem', background: '#f8fafc' }}
                    />
                  </div>
                </>
              ) : (
                <div className="input-group">
                  <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', fontWeight: '600', color: '#334155' }}>Kullanıcı Adı veya E-posta</label>
                  <input 
                    type="text" 
                    placeholder="Kullanıcı adınız" 
                    required 
                    value={formData.username} 
                    onChange={e => setFormData({...formData, username: e.target.value})}
                    style={{ width: '100%', padding: '0.75rem 1rem', border: '1px solid #e2e8f0', borderRadius: '0.75rem', background: '#f8fafc' }}
                  />
                </div>
              )}

              <div className="input-group">
                <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', fontWeight: '600', color: '#334155' }}>{mode === 'signup' ? 'Şifre Oluştur' : 'Şifre'}</label>
                <input 
                  type="password" 
                  placeholder="••••••••" 
                  required 
                  value={formData.password} 
                  onChange={e => setFormData({...formData, password: e.target.value})}
                  style={{ width: '100%', padding: '0.75rem 1rem', border: '1px solid #e2e8f0', borderRadius: '0.75rem', background: '#f8fafc' }}
                />
              </div>

              {mode === 'signup' && (
                <div className="terms-checkbox" style={{ display: 'flex', gap: '0.75rem', alignItems: 'flex-start' }}>
                  <input type="checkbox" id="terms" checked={formData.terms} onChange={e => setFormData({...formData, terms: e.target.checked})} style={{ marginTop: '0.25rem' }} />
                  <label htmlFor="terms" style={{ fontSize: '0.875rem', color: '#64748b', cursor: 'pointer', lineHeight: '1.4' }}>BUSİBER OSG Kullanım Koşulları'nı kabul ediyorum.</label>
                </div>
              )}

              {error && <div className="auth-error-panel" style={{ padding: '0.75rem 1rem', background: '#fef2f2', border: '1px solid #fee2e2', borderRadius: '0.75rem', color: '#dc2626', fontSize: '0.875rem', fontWeight: '600' }}>{error}</div>}

              <button 
                type="submit" 
                className="auth-primary-submit"
                style={{ padding: '1rem', background: '#2563eb', color: 'white', border: 'none', borderRadius: '0.75rem', fontSize: '1rem', fontWeight: '700', cursor: 'pointer', marginTop: '0.5rem' }}
              >
                {mode === 'signup' ? 'Hesabı Oluştur ve Giriş Yap' : 'Sisteme Giriş Yap'}
              </button>
            </form>

            <div className="form-switch-link" style={{ textAlign: 'center', marginTop: '2.5rem', color: '#64748b', fontSize: '0.925rem' }}>
              {mode === 'signup' ? (
                <p>Zaten bir hesabınız var mı? <button onClick={() => setMode('login')} style={{ background: 'none', border: 'none', color: '#2563eb', fontWeight: '700', cursor: 'pointer', marginLeft: '0.5rem' }}>Giriş Yapın</button></p>
              ) : (
                <p>Hesabınız yok mu? <button onClick={() => setMode('signup')} style={{ background: 'none', border: 'none', color: '#2563eb', fontWeight: '700', cursor: 'pointer', marginLeft: '0.5rem' }}>Kayıt Olun</button></p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
