// client/src/components/teacher/TeacherDashboard.jsx
import React, { useState, useEffect } from 'react';
import socketService from '../../services/socketService';
import Notification from '../common/Notification';
import { API_BASE_URL } from '../../utils/constants';

const TeacherDashboard = () => {
  const [notifications, setNotifications] = useState([]);
  const [equipment, setEquipment] = useState([]);

  useEffect(() => {
    fetchEquipment();

    const onOccupied = (data) => {
      const message = `🔴 ${data.nombreEstudiante} ha ocupado el equipo ${data.equipo}`;
      addNotification(message, 'warning');
      fetchEquipment();
    };
    const onReleased = (data) => {
      const message = `🟢 El equipo ${data.equipo} ha sido liberado`;
      addNotification(message, 'success');
      fetchEquipment();
    };

    socketService.onEquipmentOccupied(onOccupied);
    socketService.onEquipmentReleased(onReleased);

    return () => {
      socketService.off('notificacion:equipoOcupado', onOccupied);
      socketService.off('notificacion:equipoLiberado', onReleased);
      // ❌ NO hacer disconnect aquí
    };
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

  const addNotification = (message, type) => {
    const notification = {
      id: Date.now(),
      message,
      type,
      timestamp: new Date(),
    };
    setNotifications(prev => [...prev, notification]);
    setTimeout(() => removeNotification(notification.id), 5000);
  };

  const removeNotification = (id) => {
    setNotifications(prev => prev.filter(notif => notif.id !== id));
  };

  const releaseEquipment = async (equipmentId) => {
    try {
      const response = await fetch(`${API_BASE_URL}/equipment/release`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ equipmentId }),
      });

      if (response.ok) {
        socketService.emitEquipmentReleased({ equipo: equipmentId });
        fetchEquipment();
      }
    } catch (error) {
      console.error('Error al liberar equipo:', error);
    }
  };

  const occupiedEquipment = equipment.filter(eq => eq.status === 'occupied');

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <h2>👨‍🏫 Panel del Docente</h2>
        <div className="stats">
          <span className="stat">📊 Total: {equipment.length}</span>
          <span className="stat">✅ Disponibles: {equipment.filter(eq => eq.status === 'available').length}</span>
          <span className="stat">❌ Ocupados: {occupiedEquipment.length}</span>
        </div>
      </div>

      <div className="notifications-container">
        {notifications.map(notification => (
          <Notification
            key={notification.id}
            message={notification.message}
            type={notification.type}
            onClose={() => removeNotification(notification.id)}
          />
        ))}
      </div>

      <div className="occupied-equipment">
        <h3>🖥️ Equipos en Uso</h3>
        {occupiedEquipment.length === 0 ? (
          <p className="no-equipment">No hay equipos ocupados actualmente</p>
        ) : (
          <div className="equipment-list">
            {occupiedEquipment.map(eq => (
              <div key={eq.id} className="equipment-item occupied">
                <div className="equipment-info">
                  <h4>{eq.id}</h4>
                  <p>👤 Usuario: {eq.student}</p>
                </div>
                <button onClick={() => releaseEquipment(eq.id)} className="release-button">
                  🔓 Liberar
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="equipment-overview">
        <h3>📋 Vista General</h3>
        <div className="equipment-grid">
          {equipment.map(eq => (
            <div key={eq.id} className={`equipment-card ${eq.status}`}>
              <div className="equipment-id">{eq.id}</div>
              <div className="equipment-status-badge">
                {eq.status === 'available' ? '✅ Disponible' : '❌ Ocupado'}
              </div>
              {eq.student && <div className="equipment-student">👤 {eq.student}</div>}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TeacherDashboard;
