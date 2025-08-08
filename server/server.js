const app = require('./src/app');
const http = require('http');
const { Server } = require('socket.io');
const socketHandlers = require('./src/socket/socketHandlers');

const server = http.createServer(app);

// Configuración de Socket.io
const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST"]
  }
});

// Configurar manejadores de sockets
socketHandlers(io);

const PORT = process.env.PORT || 3000;

server.listen(PORT, () => {
  console.log(`🚀 Servidor corriendo en puerto ${PORT}`);
  console.log(`📡 Socket.io configurado y listo`);
});