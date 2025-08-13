// client/src/App.jsx
import React, { useState, useEffect } from 'react';
import StudentDashboard from './components/student/StudentDashboard';
import TeacherDashboard from './components/teacher/TeacherDashboard';
import NotificationPanel from './components/NotificationPanel';
import socketService from './services/socketService';
import './styles/global.css';

function App() {
  const [currentRole, setCurrentRole] = useState(null); // 'student' | 'teacher' | null
  const [displayName, setDisplayName] = useState(''); // nombre mostrado en notificaciones
  const [nameInput, setNameInput] = useState(''); // campo controlado
  const [notifications, setNotifications] = useState([]);

  // Conexión de socket
  useEffect(() => {
    socketService.connect();

    // Escuchar todas las notificaciones en tiempo real
    socketService.onNotif((n) => {
      setNotifications((prev) => {
        const next = [...prev, n];
        return next.length > 100 ? next.slice(1) : next; // mantener máximo 100
      });
    });

    return () => {
      socketService.disconnect();
    };
  }, []);

  // Cuando se selecciona rol y nombre, enviar entrada
  useEffect(() => {
    if (currentRole && displayName) {
      socketService.joinRole(currentRole === 'student' ? 'estudiante' : 'docente');
      socketService.emitUserJoin({
        name: displayName,
        role: currentRole === 'student' ? 'estudiante' : 'docente',
      });
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

  // Pantalla de selección de rol
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

  // Vista principal con panel de notificaciones
  return (
    <div className="app">
      <header className="app-header">
        <h1>🏫 Sistema de Laboratorio</h1>
        <button onClick={resetRole} className="change-role-button">
          🔄 Cambiar Rol
        </button>
      </header>

      <main className="app-main">
        {currentRole === 'student'
          ? <StudentDashboard displayName={displayName} />
          : <TeacherDashboard displayName={displayName} />}
      </main>

      {/* Panel fijo de notificaciones */}
      <NotificationPanel notifications={notifications} onClear={clearNotifications} />
    </div>
  );
}

export default App;
