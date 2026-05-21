import React, { useState } from 'react';
import './UserManagementPage.css';

const ROLE_CONFIG = {
  'Yönetici': { label: 'Yönetici', color: 'var(--accent-blue)', bg: 'rgba(37,99,235,0.12)', icon: '👑' },
  'Denetçi':  { label: 'Denetçi',  color: 'var(--accent-green)', bg: 'rgba(16,185,129,0.12)', icon: '🔍' },
};

const STANDARD_LABELS = {
  tisax: 'TISAX VDA ISA',
  iso:   'ISO/SAE 21434',
};

function Avatar({ name }) {
  const initials = name.split(' ').map(w => w[0]).slice(0, 2).join('').toUpperCase();
  const colors = [
    ['#2563eb','#1e3a8a'], ['#7c3aed','#4c1d95'], ['#0891b2','#164e63'],
    ['#059669','#064e3b'], ['#d97706','#78350f'], ['#dc2626','#7f1d1d'],
  ];
  const [bg, dark] = colors[name.charCodeAt(0) % colors.length];
  return (
    <div className="um-avatar" style={{ background: `linear-gradient(135deg, ${bg}, ${dark})` }}>
      {initials}
    </div>
  );
}

function StatCard({ icon, label, value, accent }) {
  return (
    <div className="um-stat-card">
      <div className="um-stat-icon" style={{ background: `${accent}18`, color: accent }}>{icon}</div>
      <div className="um-stat-body">
        <div className="um-stat-value">{value}</div>
        <div className="um-stat-label">{label}</div>
      </div>
    </div>
  );
}

export default function UserManagementPage({ onAddUser, initialUsers = [] }) {
  const [users, setUsers]       = useState(initialUsers);
  const [newUser, setNewUser]   = useState({ name: '', username: '', password: '', role: 'auditor' });
  const [assignment, setAssignment] = useState({ auditorId: '', standard: 'tisax' });
  const [error, setError]       = useState('');
  const [success, setSuccess]   = useState('');

  const handleAddUser = (e) => {
    e.preventDefault();
    if (!newUser.name || !newUser.username || !newUser.password) return;

    const userObj = {
      id: Date.now(),
      name: newUser.name,
      username: newUser.username,
      password: newUser.password,
      role: newUser.role === 'admin' ? 'Yönetici' : 'Denetçi',
      task: '-',
      progress: 0,
      firstLogin: false,
    };

    const result = onAddUser(userObj);
    if (result.success) {
      setUsers(prev => [...prev, userObj]);
      setNewUser({ name: '', username: '', password: '', role: 'auditor' });
      setError('');
      setSuccess(`${userObj.name} sisteme eklendi.`);
      setTimeout(() => setSuccess(''), 3000);
    } else {
      setError(result.message);
    }
  };

  const handleAssignTask = (e) => {
    e.preventDefault();
    if (!assignment.auditorId) return;
    const label = STANDARD_LABELS[assignment.standard];
    setUsers(prev =>
      prev.map(u =>
        u.id === Number(assignment.auditorId)
          ? { ...u, task: label, progress: 0 }
          : u
      )
    );
    setAssignment({ auditorId: '', standard: 'tisax' });
    setSuccess('Görev başarıyla atandı.');
    setTimeout(() => setSuccess(''), 3000);
  };

  const auditors = users.filter(u => u.role === 'Denetçi');
  const activeTasks = users.filter(u => u.task && u.task !== '-').length;

  return (
    <div className="um-page">

      {/* ── Page Header ── */}
      <div className="um-page-header">
        <div>
          <h2 className="um-page-title">Kullanıcı &amp; Rol Yönetimi</h2>
          <p className="um-page-sub">Sisteme kullanıcı ekleyin, rolleri yönetin ve denetim görevlerini takip edin.</p>
        </div>
      </div>

      {/* ── Stat Cards ── */}
      <div className="um-stats-row">
        <StatCard icon="👥" label="Toplam Kullanıcı"   value={users.length}   accent="var(--accent-blue)"  />
        <StatCard icon="🔍" label="Aktif Denetçi"      value={auditors.length} accent="var(--accent-green)" />
        <StatCard icon="📋" label="Atanan Görev"        value={activeTasks}     accent="var(--accent-yellow)"/>
      </div>

      {/* ── Toast ── */}
      {success && <div className="um-toast um-toast-success">✔ {success}</div>}
      {error   && <div className="um-toast um-toast-error">⚠ {error}</div>}

      {/* ── Two-column forms ── */}
      <div className="um-forms-grid">

        {/* Add User */}
        <div className="um-card">
          <div className="um-card-stripe um-stripe-blue" />
          <div className="um-card-inner">
            <div className="um-card-header">
              <div className="um-card-icon" style={{ background: 'rgba(37,99,235,0.12)', color: 'var(--accent-blue)' }}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/>
                  <circle cx="9" cy="7" r="4"/>
                  <line x1="19" y1="8" x2="19" y2="14"/>
                  <line x1="22" y1="11" x2="16" y2="11"/>
                </svg>
              </div>
              <div>
                <h3 className="um-card-title">Yeni Kullanıcı Ekle</h3>
                <p className="um-card-desc">Sisteme yeni bir personel hesabı oluşturun</p>
              </div>
            </div>

            <form className="um-form" onSubmit={handleAddUser}>
              <div className="um-field">
                <label>İsim Soyisim</label>
                <input type="text" placeholder="Örn: Ayşe Yılmaz"
                  value={newUser.name}
                  onChange={e => setNewUser({...newUser, name: e.target.value})} required />
              </div>
              <div className="um-field">
                <label>Kullanıcı Adı</label>
                <input type="text" placeholder="Giriş için kullanılacak ad"
                  value={newUser.username}
                  onChange={e => setNewUser({...newUser, username: e.target.value})} required />
              </div>
              <div className="um-field">
                <label>Parola</label>
                <input type="password" placeholder="En az 8 karakter"
                  value={newUser.password}
                  onChange={e => setNewUser({...newUser, password: e.target.value})} required />
              </div>
              <div className="um-field">
                <label>Rol</label>
                <div className="um-role-toggle">
                  <button type="button"
                    className={`um-role-btn ${newUser.role === 'auditor' ? 'active-green' : ''}`}
                    onClick={() => setNewUser({...newUser, role: 'auditor'})}>
                    🔍 Denetçi
                  </button>
                  <button type="button"
                    className={`um-role-btn ${newUser.role === 'admin' ? 'active-blue' : ''}`}
                    onClick={() => setNewUser({...newUser, role: 'admin'})}>
                    👑 Yönetici
                  </button>
                </div>
              </div>
              <button type="submit" className="um-btn-primary">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 5v14M5 12h14"/>
                </svg>
                Kullanıcıyı Kaydet
              </button>
            </form>
          </div>
        </div>

        {/* Assign Task */}
        <div className="um-card">
          <div className="um-card-stripe um-stripe-green" />
          <div className="um-card-inner">
            <div className="um-card-header">
              <div className="um-card-icon" style={{ background: 'rgba(16,185,129,0.12)', color: 'var(--accent-green)' }}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 22h6a2 2 0 0 0 2-2V7l-5-5H6a2 2 0 0 0-2 2v10"/>
                  <path d="M14 2v4a2 2 0 0 0 2 2h4"/>
                  <path d="M10.4 12.6a2 2 1 0 1 3 3L8 21l-4 1 1-4Z"/>
                </svg>
              </div>
              <div>
                <h3 className="um-card-title">Denetçi Görev Atama</h3>
                <p className="um-card-desc">Denetçiye bir denetim standardı atayın</p>
              </div>
            </div>

            <form className="um-form" onSubmit={handleAssignTask}>
              <div className="um-field">
                <label>Denetçi Seç</label>
                <select value={assignment.auditorId}
                  onChange={e => setAssignment({...assignment, auditorId: e.target.value})} required>
                  <option value="">— Listeden Denetçi Seçin —</option>
                  {auditors.map(a => <option key={a.id} value={a.id}>{a.name}</option>)}
                </select>
              </div>
              <div className="um-field">
                <label>Denetim Standardı</label>
                <div className="um-standard-toggle">
                  {Object.entries(STANDARD_LABELS).map(([key, val]) => (
                    <button key={key} type="button"
                      className={`um-std-btn ${assignment.standard === key ? 'active' : ''}`}
                      onClick={() => setAssignment({...assignment, standard: key})}>
                      {val}
                    </button>
                  ))}
                </div>
              </div>

              {/* Preview */}
              {assignment.auditorId && (
                <div className="um-assign-preview">
                  <span>📌</span>
                  <span>
                    <strong>{auditors.find(a => a.id === Number(assignment.auditorId))?.name}</strong>
                    {' '}→ {STANDARD_LABELS[assignment.standard]}
                  </span>
                </div>
              )}

              <button type="submit" className="um-btn-primary um-btn-green">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="20 6 9 17 4 12"/>
                </svg>
                Görevi Tanımla
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* ── User Table ── */}
      <div className="um-card um-table-card">
        <div className="um-card-stripe um-stripe-purple" />
        <div className="um-card-inner">
          <div className="um-card-header">
            <div className="um-card-icon" style={{ background: 'rgba(124,58,237,0.12)', color: '#7c3aed' }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/>
              </svg>
            </div>
            <div>
              <h3 className="um-card-title">Aktif Denetim Takibi</h3>
              <p className="um-card-desc">{users.length} kullanıcı kayıtlı · {activeTasks} görev atanmış</p>
            </div>
          </div>

          <div className="um-table-wrapper">
            <table className="um-table">
              <thead>
                <tr>
                  <th>Personel</th>
                  <th>Rol</th>
                  <th>Atanan Görev</th>
                  <th>İlerleme</th>
                </tr>
              </thead>
              <tbody>
                {users.length === 0 && (
                  <tr><td colSpan="4" className="um-empty-row">Henüz kullanıcı eklenmedi.</td></tr>
                )}
                {users.map(user => {
                  const cfg = ROLE_CONFIG[user.role] || ROLE_CONFIG['Denetçi'];
                  const hasTask = user.task && user.task !== '-';
                  return (
                    <tr key={user.id} className="um-table-row">
                      <td>
                        <div className="um-user-cell">
                          <Avatar name={user.name} />
                          <div>
                            <div className="um-user-name">{user.name}</div>
                            {user.username && <div className="um-user-sub">@{user.username}</div>}
                          </div>
                        </div>
                      </td>
                      <td>
                        <span className="um-badge" style={{ background: cfg.bg, color: cfg.color, border: `1px solid ${cfg.color}30` }}>
                          {cfg.icon} {cfg.label}
                        </span>
                      </td>
                      <td>
                        {hasTask
                          ? <span className="um-task-chip">{user.task}</span>
                          : <span className="um-no-task">—</span>}
                      </td>
                      <td>
                        {user.role === 'Denetçi' && hasTask ? (
                          <div className="um-progress-wrap">
                            <div className="um-progress-track">
                              <div className="um-progress-fill"
                                style={{ width: `${user.progress}%`, background: user.progress >= 70 ? 'var(--accent-green)' : user.progress >= 40 ? 'var(--accent-yellow)' : 'var(--accent-blue)' }} />
                            </div>
                            <span className="um-progress-pct">%{user.progress}</span>
                          </div>
                        ) : (
                          <span className="um-no-task">—</span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>

    </div>
  );
}
