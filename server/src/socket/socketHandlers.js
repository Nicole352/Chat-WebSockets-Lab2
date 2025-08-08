const socketHandlers = (io) => {
    io.on('connection', (socket) => {
      console.log('👤 Usuario conectado:', socket.id);
  
      // Unirse a una sala específica (estudiante o docente)
      socket.on('join-role', (role) => {
        socket.join(role);
        console.log(`📋 Usuario ${socket.id} se unió como ${role}`);
      });
  
      // Manejar registro de equipo
      socket.on('equipo:registrado', (data) => {
        console.log('🖥️ Equipo registrado:', data);
        
        // Enviar notificación solo a los docentes
        socket.to('docente').emit('notificacion:equipoOcupado', {
          id: Date.now(),
          ...data,
          timestamp: new Date().toISOString()
        });
      });
  
      // Manejar liberación de equipo
      socket.on('equipo:liberado', (data) => {
        console.log('✅ Equipo liberado:', data);
        
        socket.to('docente').emit('notificacion:equipoLiberado', {
          id: Date.now(),
          ...data,
          timestamp: new Date().toISOString()
        });
      });
  
      socket.on('disconnect', () => {
        console.log('👋 Usuario desconectado:', socket.id);
      });
    });
  };
  
  module.exports = socketHandlers;