// client/src/components/common/NotificationPanel.jsx
import React, { useEffect, useRef } from 'react';

const NotificationPanel = ({ notifications, onClear }) => {
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [notifications]);

  return (
    <aside className="notif-panel">
      <div className="notif-header">
        <span>🔔 Notificaciones</span>
        <button className="notif-clear" onClick={onClear}>Limpiar</button>
      </div>
      <div className="notif-list">
        {notifications.map(n => (
          <div key={n.id} className={`notif-item ${n.type?.replace(':', '-') || ''}`}>
            <div className="notif-msg">{n.message}</div>
            <div className="notif-time">
              {new Date(n.timestamp || Date.now()).toLocaleTimeString()}
            </div>
          </div>
        ))}
        <div ref={bottomRef} />
      </div>
    </aside>
  );
};

export default NotificationPanel;
