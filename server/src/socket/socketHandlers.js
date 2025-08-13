// server/src/socket/socketHandlers.js
const users = new Map(); // socketId -> { name, role }

const socketHandlers = (io) => {
  io.on('connection', (socket) => {
    console.log('👤 Usuario conectado:', socket.id);

    // Unirse a sala por rol (compatibilidad con tu lógica actual)
    socket.on('join-role', (role) => {
      socket.join(role);
      console.log(`📋 Usuario ${socket.id} se unió como ${role}`);
    });

    // 👉 Nombre/rol opcional para mejorar notificaciones de entrada/salida
    socket.on('user:join', ({ name, role }) => {
      users.set(socket.id, { name: name || 'Usuario', role: role || 'desconocido' });
      io.emit('notif', {
        id: Date.now(),
        type: 'user:join',
        message: `🟢 ${name || 'Usuario'} (${role}) se ha conectado`,
        timestamp: new Date().toISOString()
      });
    });

    // Registrar uso de equipo (ya lo tienes en el front)
    socket.on('equipo:registrado', (data) => {
      console.log('🖥️ Equipo registrado:', data);

      // Mantengo tus eventos específicos para compatibilidad del TeacherDashboard:
      io.to('docente').emit('notificacion:equipoOcupado', {
        id: Date.now(),
        ...data,
        timestamp: new Date().toISOString()
      });

      // 👉 Nuevo: evento GLOBAL unificado para el panel de notificaciones
      io.emit('notif', {
        id: Date.now(),
        type: 'equipo:registrado',
        message: `🔴 ${data.nombreEstudiante || 'Estudiante'} ocupó ${data.equipo}`,
        payload: data,
        timestamp: new Date().toISOString()
      });
    });

    // Liberación de equipo
    socket.on('equipo:liberado', (data) => {
      console.log('✅ Equipo liberado:', data);

      io.to('docente').emit('notificacion:equipoLiberado', {
        id: Date.now(),
        ...data,
        timestamp: new Date().toISOString()
      });

      // 👉 Nuevo: evento GLOBAL unificado
      io.emit('notif', {
        id: Date.now(),
        type: 'equipo:liberado',
        message: `🟢 ${data.equipo} fue liberado`,
        payload: data,
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
        // Desconexión sin user:join previo (igual informamos)
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
