// server/src/socket/socketHandlers.js
const users = new Map(); // socketId -> { name, role }

const socketHandlers = (io) => {
  io.on('connection', (socket) => {
    console.log('👤 Usuario conectado:', socket.id);

    socket.on('join-role', (role) => {
      socket.join(role);
      console.log(`📋 Usuario ${socket.id} se unió como ${role}`);
    });

    socket.on('user:join', ({ name, role }) => {
      users.set(socket.id, { name: name || 'Usuario', role: role || 'desconocido' });
      io.emit('notif', {
        id: Date.now(),
        type: 'user:join',
        message: `🟢 ${name || 'Usuario'} (${role}) se ha conectado`,
        timestamp: new Date().toISOString()
      });
    });

    socket.on('equipo:registrado', (data) => {
      console.log('🖥️ Equipo registrado:', data);

      // Para el panel (todos)
      io.emit('notif', {
        id: Date.now(),
        type: 'equipo:registrado',
        message: `🔴 ${data.nombreEstudiante || 'Estudiante'} ocupó ${data.equipo}`,
        payload: data,
        timestamp: new Date().toISOString()
      });

      // Compatibilidad con tu TeacherDashboard
      io.to('docente').emit('notificacion:equipoOcupado', {
        id: Date.now(),
        ...data,
        timestamp: new Date().toISOString()
      });
    });

    socket.on('equipo:liberado', (data) => {
      console.log('✅ Equipo liberado:', data);

      // Para el panel (todos)
      io.emit('notif', {
        id: Date.now(),
        type: 'equipo:liberado',
        message: `🟢 ${data.equipo} fue liberado`,
        payload: data,
        timestamp: new Date().toISOString()
      });

      // Compatibilidad con tu TeacherDashboard
      io.to('docente').emit('notificacion:equipoLiberado', {
        id: Date.now(),
        ...data,
        timestamp: new Date().toISOString()
      });
    });

    socket.on('disconnect', () => {
      const info = users.get(socket.id);
      if (info) {
        io.emit('notif', {
          id: Date.now(),
          type: 'user:leave',
          message: `🔻 ${info.name} (${info.role}) se ha desconectado`,
          timestamp: new Date().toISOString()
        });
        users.delete(socket.id);
      } else {
        io.emit('notif', {
          id: Date.now(),
          type: 'user:leave',
          message: `🔻 Un usuario se ha desconectado`,
          timestamp: new Date().toISOString()
        });
      }
      console.log('👋 Usuario desconectado:', socket.id);
    });
  });
};

module.exports = socketHandlers;
