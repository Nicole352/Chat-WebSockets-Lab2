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

// import express from "express";
// import http from "http";
// import { Server } from "socket.io";

// const app = express();
// const server = http.createServer(app);
// const io = new Server(server, {
//   cors: { origin: "*" },
// });

// io.on("connection", (socket) => {
//   console.log("Un usuario conectado");

//   // Ejemplos de emisión manual
//   socket.emit("userJoined", "Nicole");
//   socket.emit("pcOccupied", 5);

//   socket.on("disconnect", () => {
//     console.log("Un usuario desconectado");
//     io.emit("userLeft", "Nicole");
//   });
// });

// server.listen(3000, () => {
//   console.log("Servidor corriendo en http://localhost:3000");
// });

