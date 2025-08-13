// client/src/services/socketService.js
import { io } from 'socket.io-client';
const SOCKET_URL = 'http://localhost:3000';

class SocketService {
  constructor() {
    this.socket = null;
    this.isConnected = false;
  }

  connect() {
    if (!this.socket) {
      this.socket = io(SOCKET_URL);

      this.socket.on('connect', () => {
        console.log('🔗 Conectado al servidor:', this.socket.id);
        this.isConnected = true;
      });

      this.socket.on('disconnect', () => {
        console.log('❌ Desconectado del servidor');
        this.isConnected = false;
      });
    }
    return this.socket;
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
      this.isConnected = false;
    }
  }

  joinRole(role) {
    if (this.socket) this.socket.emit('join-role', role);
  }

  // 👉 NUEVO: anunciar entrada
  emitUserJoin({ name, role }) {
    if (this.socket) this.socket.emit('user:join', { name, role });
  }

  emitEquipmentRegistered(data) {
    if (this.socket) this.socket.emit('equipo:registrado', data);
  }

  emitEquipmentReleased(data) {
    if (this.socket) this.socket.emit('equipo:liberado', data);
  }

  onEquipmentOccupied(callback) {
    if (this.socket) this.socket.on('notificacion:equipoOcupado', callback);
  }

  onEquipmentReleased(callback) {
    if (this.socket) this.socket.on('notificacion:equipoLiberado', callback);
  }

  removeListener(event) {
    if (this.socket) this.socket.off(event);
  }

  // 👉 NUEVO: listener unificado para el panel
  onNotif(callback) {
    if (this.socket) this.socket.on('notif', callback);
  }
}

export default new SocketService();
