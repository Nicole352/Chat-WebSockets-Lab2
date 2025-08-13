// client/src/components/student/StudentDashboard.jsx
import React, { useState, useEffect } from 'react';
import socketService from '../../services/socketService';
import { API_BASE_URL } from '../../utils/constants';

const StudentDashboard = ({ displayName }) => {
  const [studentName, setStudentName] = useState(displayName || '');
  const [selectedEquipment, setSelectedEquipment] = useState('');
  const [equipment, setEquipment] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchEquipment();
  }, []);

  const fetchEquipment = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/equipment`);
      const data = await response.json();
      setEquipment(data);
    } catch (error) {
      console.error('Error al cargar equipos:', error);
    }
  };

  const handleRegister = async () => {
    const nameToUse = (studentName || displayName || '').trim();
    if (!nameToUse || !selectedEquipment) {
      alert('Por favor completa todos los campos');
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/equipment/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          equipmentId: selectedEquipment,
          studentName: nameToUse,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        // Enviar evento socket global
        socketService.emitEquipmentRegistered({
          nombreEstudiante: nameToUse,
          equipo: selectedEquipment,
        });

        await fetchEquipment();
        setStudentName(displayName || '');
        setSelectedEquipment('');
        alert('¡Equipo registrado exitosamente!');
      } else {
        alert(data.error || 'Error al registrar equipo');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Error al conectar con el servidor');
    } finally {
      setLoading(false);
    }
  };

  const availableEquipment = equipment.filter(eq => eq.status === 'available');

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <h2>🎓 Panel del Estudiante</h2>
      </div>

      <div className="register-form">
        <div className="form-group">
          <label>Nombre del Estudiante:</label>
          <input
            type="text"
            value={studentName}
            onChange={(e) => setStudentName(e.target.value)}
            placeholder="Ingresa tu nombre completo"
            className="form-input"
          />
        </div>

        <div className="form-group">
          <label>Seleccionar Equipo:</label>
          <select
            value={selectedEquipment}
            onChange={(e) => setSelectedEquipment(e.target.value)}
            className="form-select"
          >
            <option value="">-- Selecciona un equipo --</option>
            {availableEquipment.map(eq => (
              <option key={eq.id} value={eq.id}>
                {eq.id}
              </option>
            ))}
          </select>
        </div>

        <button onClick={handleRegister} disabled={loading} className="register-button">
          {loading ? 'Registrando...' : '📝 Registrar Equipo'}
        </button>
      </div>

      <div className="equipment-status">
        <h3>Estado de Equipos</h3>
        <div className="equipment-grid">
          {equipment.map(eq => (
            <div key={eq.id} className={`equipment-card ${eq.status}`}>
              <div className="equipment-id">{eq.id}</div>
              <div className="equipment-status-badge">
                {eq.status === 'available' ? '✅ Disponible' : '❌ Ocupado'}
              </div>
              {eq.student && (
                <div className="equipment-student">👤 {eq.student}</div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default StudentDashboard;
