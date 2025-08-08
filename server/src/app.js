const express = require('express');
const cors = require('cors');
const equipmentRoutes = require('./routes/equipment');

const app = express();

// Middlewares
app.use(cors({
  origin: "http://localhost:5173",
  credentials: true
}));
app.use(express.json());

// Rutas
app.use('/api/equipment', equipmentRoutes);

// Ruta de prueba
app.get('/', (req, res) => {
  res.json({ message: '🎯 Servidor de Laboratorio funcionando correctamente' });
});

module.exports = app;