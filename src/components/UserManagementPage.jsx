import React, { useState } from 'react';
import './UserManagementPage.css';

// Mock Data
const INITIAL_USERS = [
  { id: 1, name: "Ahmet Yılmaz", role: "Denetçi", task: "TISAX Süreci", progress: 65 },
  { id: 2, name: "Elif Kaya", role: "Denetçi", task: "ISO 21434", progress: 20 },
  { id: 3, name: "Mehmet Demir", role: "Yönetici", task: "-", progress: 0 },
];

export default function UserManagementPage({ onAddUser, initialUsers = [] }) {
  const [users, setUsers] = useState(initialUsers);
  const [newUser, setNewUser] = useState({ name: '', username: '', password: '', role: 'auditor' });
  const [assignment, setAssignment] = useState({ auditorId: '', standard: 'tisax' });
  const [error, setError] = useState("");

  const handleAddUser = (e) => {
    e.preventDefault();
    if (!newUser.name || !newUser.username || !newUser.password) return;

    const userObj = {
      id: Date.now(),
      name: newUser.name,
      username: newUser.username,
      password: newUser.password, // Formdan gelen şifre
      role: newUser.role === 'admin' ? 'Yönetici' : 'Denetçi',
      task: "-",
      progress: 0,
      firstLogin: false
    };

    const result = onAddUser(userObj);
    if (result.success) {
      setUsers([...users, userObj]);
      setNewUser({ name: '', username: '', password: '', role: 'auditor' });
      setError("");
    } else {
      setError(result.message);
    }
  };

  const handleAssignTask = (e) => {
    e.preventDefault();
    if (!assignment.auditorId) return;
    setUsers(users.map(u => 
      u.id === Number(assignment.auditorId) 
        ? { ...u, task: assignment.standard === 'tisax' ? 'TISAX Süreci' : 'ISO 21434', progress: 0 } 
        : u
    ));
    setAssignment({ auditorId: '', standard: 'tisax' });
  };

  const auditors = users.filter(u => u.role === 'Denetçi');

  return (
    <div className="um-container">
      <div className="um-header">
        <h2>Kullanıcı ve Rol Yönetimi</h2>
        <p>Sisteme yeni kullanıcılar ekleyin ve denetim görevlerini organize edin.</p>
      </div>

      <div className="um-top-grid">
        {/* Card A: Add User */}
        <div className="um-card">
          <div className="um-card-header">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><line x1="19" y1="8" x2="19" y2="14"/><line x1="22" y1="11" x2="16" y2="11"/></svg>
            <h3>Yeni Kullanıcı Ekle</h3>
          </div>
          <form className="um-form" onSubmit={handleAddUser}>
            <div className="um-field">
              <label>İsim Soyisim</label>
              <input type="text" placeholder="Örn: Ayşe Yılmaz" value={newUser.name} onChange={e => setNewUser({...newUser, name: e.target.value})} required />
            </div>
            <div className="um-field">
              <label>Kullanıcı Adı</label>
              <input type="text" placeholder="Giriş için kullanılacak ad" value={newUser.username} onChange={e => setNewUser({...newUser, username: e.target.value})} required />
            </div>
            <div className="um-field">
              <label>Parola</label>
              <input type="password" placeholder="En az 8 karakter" value={newUser.password} onChange={e => setNewUser({...newUser, password: e.target.value})} required />
            </div>
            <div className="um-field">
              <label>Rol Ata</label>
              <select value={newUser.role} onChange={e => setNewUser({...newUser, role: e.target.value})}>
                <option value="auditor">Denetçi</option>
                <option value="admin">Yönetici</option>
              </select>
            </div>
            {error && <p className="um-error">{error}</p>}
            <button type="submit" className="um-btn-primary">Kullanıcıyı Kaydet</button>
          </form>
        </div>

        {/* Card B: Assign Task */}
        <div className="um-card">
          <div className="um-card-header">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22h6a2 2 0 0 0 2-2V7l-5-5H6a2 2 0 0 0-2 2v10"/><path d="M14 2v4a2 2 0 0 0 2 2h4"/><path d="M10.4 12.6a2 2 0 1 1 3 3L8 21l-4 1 1-4Z"/></svg>
            <h3>Denetçi Görev Atama</h3>
          </div>
          <form className="um-form" onSubmit={handleAssignTask}>
            <div className="um-field">
              <label>Denetçi Seç</label>
              <select value={assignment.auditorId} onChange={e => setAssignment({...assignment, auditorId: e.target.value})} required>
                <option value="">-- Listeden Denetçi Seçin --</option>
                {auditors.map(a => <option key={a.id} value={a.id}>{a.name}</option>)}
              </select>
            </div>
            <div className="um-field">
              <label>Denetim Standardı</label>
              <select value={assignment.standard} onChange={e => setAssignment({...assignment, standard: e.target.value})}>
                <option value="tisax">TISAX VDA ISA</option>
                <option value="iso">ISO/SAE 21434</option>
              </select>
            </div>
            <button type="submit" className="um-btn-primary" style={{marginTop: 'auto'}}>Görevi Tanımla</button>
          </form>
        </div>
      </div>

      {/* Card C: Progress Table */}
      <div className="um-card um-table-card">
        <div className="um-card-header">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>
          <h3>Aktif Denetim Takibi</h3>
        </div>
        <div className="um-table-wrapper">
          <table className="um-table">
            <thead>
              <tr>
                <th>Personel Adı</th>
                <th>Sistem Rolü</th>
                <th>Atanan Görev</th>
                <th>İlerleme Durumu</th>
              </tr>
            </thead>
            <tbody>
              {users.map(user => (
                <tr key={user.id}>
                  <td><strong>{user.name}</strong></td>
                  <td><span className={`um-badge ${user.role === 'Yönetici' ? 'badge-admin' : 'badge-auditor'}`}>{user.role}</span></td>
                  <td>{user.task}</td>
                  <td>
                    {user.role === 'Denetçi' && user.task !== "-" ? (
                      <div className="um-progress-container">
                        <div className="um-progress-bar">
                          <div className="um-progress-fill" style={{ width: `${user.progress}%` }}></div>
                        </div>
                        <span className="um-progress-text">%{user.progress}</span>
                      </div>
                    ) : (
                      <span className="um-no-task">-</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
