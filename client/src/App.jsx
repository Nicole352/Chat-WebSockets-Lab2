import React, { useState } from 'react';
import StudentDashboard from './components/student/StudentDashboard';
import TeacherDashboard from './components/teacher/TeacherDashboard';
import './styles/global.css';

function App() {
  const [currentRole, setCurrentRole] = useState(null);

  const selectRole = (role) => {
    setCurrentRole(role);
  };

  const resetRole = () => {
    setCurrentRole(null);
  };

  if (!currentRole) {
    return (
      <div className="role-selector">
        <div className="role-container">
          <h1>🏫 Sistema de Laboratorio</h1>
          <p>Selecciona tu rol para continuar:</p>
          
          <div className="role-buttons">
            <button
              onClick={() => selectRole('student')}
              className="role-button student"
            >
              🎓 Estudiante
            </button>
            <button
              onClick={() => selectRole('teacher')}
              className="role-button teacher"
            >
              👨‍🏫 Docente
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="app">
      <header className="app-header">
        <h1>🏫 Sistema de Laboratorio</h1>
        <button onClick={resetRole} className="change-role-button">
          🔄 Cambiar Rol
        </button>
      </header>

      <main className="app-main">
        {currentRole === 'student' ? <StudentDashboard /> : <TeacherDashboard />}
      </main>
    </div>
  );
}

export default App;