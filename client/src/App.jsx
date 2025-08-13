// client/src/App.jsx
import React, { useState, useEffect } from 'react';
import StudentDashboard from './components/student/StudentDashboard';
import TeacherDashboard from './components/teacher/TeacherDashboard';
import NotificationPanel from './components/NotificationPanel';
import socketService from './services/socketService';
import './styles/global.css';

function App() {
  const [currentRole, setCurrentRole] = useState(null); // 'student' | 'teacher' | null
  const [displayName, setDisplayName] = useState('');
  const [nameInput, setNameInput] = useState('');
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    socketService.connect();

    const onNotif = (n) => {
      setNotifications(prev => {
        const next = [...prev, n];
        return next.length > 100 ? next.slice(1) : next;
      });
    };

    socketService.onNotif(onNotif);

    return () => {
      socketService.off('notif', onNotif);
      socketService.disconnect();
    };
  }, []);

  useEffect(() => {
    if (currentRole && displayName) {
      const roleName = currentRole === 'student' ? 'estudiante' : 'docente';
      socketService.joinRole(roleName);
      socketService.emitUserJoin({ name: displayName, role: roleName });
    }
  }, [currentRole, displayName]);

  const selectRole = (role) => setCurrentRole(role);
  const resetRole = () => {
    setCurrentRole(null);
    setDisplayName('');
    setNameInput('');
  };
  const handleEnter = () => {
    if (!nameInput.trim()) {
      alert('Por favor ingresa tu nombre');
      return;
    }
    setDisplayName(nameInput.trim());
  };
  const clearNotifications = () => setNotifications([]);

  if (!currentRole || !displayName) {
    return (
      <div className="role-selector">
        <div className="role-container">
          <h1>🏫 Sistema de Laboratorio</h1>
          <p>Ingresa tu nombre y selecciona tu rol:</p>

          <input
            className="form-input"
            placeholder="Tu nombre"
            value={nameInput}
            onChange={(e) => setNameInput(e.target.value)}
            style={{ marginTop: '1rem' }}
          />

          <div className="role-buttons">
            <button onClick={() => selectRole('student')} className="role-button student">
              🎓 Estudiante
            </button>
            <button onClick={() => selectRole('teacher')} className="role-button teacher">
              👨‍🏫 Docente
            </button>
          </div>

          <button className="register-button" onClick={handleEnter} style={{ marginTop: '1rem' }}>
            Entrar
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="app">
      <header className="app-header">
        <h1>🏫 Sistema de Laboratorio</h1>
        <button onClick={resetRole} className="change-role-button">🔄 Cambiar Rol</button>
      </header>

      <main className="app-main">
        {currentRole === 'student'
          ? <StudentDashboard displayName={displayName} />
          : <TeacherDashboard displayName={displayName} />}
      </main>

      <NotificationPanel notifications={notifications} onClear={clearNotifications} />
    </div>
  );
}

export default App;
