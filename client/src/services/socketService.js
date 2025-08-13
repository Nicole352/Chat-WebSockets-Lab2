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

  // ❗️Nunca desconectes desde children, solo desde App si hiciera falta
  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
      this.isConnected = false;
    }
  }

  joinRole(role) {
    this.socket?.emit('join-role', role);
  }

  emitUserJoin({ name, role }) {
    this.socket?.emit('user:join', { name, role });
  }

  emitEquipmentRegistered(data) {
    this.socket?.emit('equipo:registrado', data);
  }

  emitEquipmentReleased(data) {
    this.socket?.emit('equipo:liberado', data);
  }

  onEquipmentOccupied(callback) {
    this.socket?.on('notificacion:equipoOcupado', callback);
  }

  onEquipmentReleased(callback) {
    this.socket?.on('notificacion:equipoLiberado', callback);
  }

  onNotif(callback) {
    this.socket?.on('notif', callback);
  }

  off(eventName, callback) {
    this.socket?.off(eventName, callback);
  }
}

export default new SocketService();
