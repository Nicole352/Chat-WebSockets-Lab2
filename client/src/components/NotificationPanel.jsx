// client/src/components/NotificationPanel.jsx
import React, { useState, useEffect } from "react";
import { io } from "socket.io-client";
import "./common/Notification.css";

// Conectar con el backend
const socket = io("http://localhost:3000", {
  transports: ["websocket"], // optimiza la conexión
});

const NotificationPanel = () => {
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    // Función para agregar notificaciones al estado
    const addNotification = (message, type) => {
      const newNotification = {
        id: Date.now(),
        message,
        type,
      };

      setNotifications((prev) => {
        const updated = [newNotification, ...prev];
        return updated.slice(0, 10); // máximo 10 notificaciones
      });
    };

    // Escuchar eventos desde el backend
    socket.on("userJoined", (username) => {
      addNotification(`💚 ${username} ha ingresado al sistema`, "success");
    });

    socket.on("userLeft", (username) => {
      addNotification(`💔 ${username} ha salido del sistema`, "error");
    });

    socket.on("pcOccupied", (pc) => {
      addNotification(`💻 La PC ${pc} fue ocupada`, "info");
    });

    socket.on("pcReleased", (pc) => {
      addNotification(`🖥️ La PC ${pc} fue liberada`, "warning");
    });

    return () => {
      socket.off("userJoined");
      socket.off("userLeft");
      socket.off("pcOccupied");
      socket.off("pcReleased");
    };
  }, []);

  return (
    <div className="notification-panel">
      <h3>🔔 Notificaciones</h3>
      <ul>
        {notifications.map((n) => (
          <li key={n.id} className={`notification ${n.type}`}>
            {n.message}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default NotificationPanel;
