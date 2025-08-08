const express = require('express');
const router = express.Router();

// Simulación de base de datos en memoria
let equipment = [
  { id: 'PC-01', status: 'available', student: null },
  { id: 'PC-02', status: 'available', student: null },
  { id: 'PC-03', status: 'available', student: null },
  { id: 'PC-04', status: 'available', student: null },
  { id: 'PC-05', status: 'available', student: null },
];

// Obtener todos los equipos
router.get('/', (req, res) => {
  res.json(equipment);
});

// Registrar uso de equipo
router.post('/register', (req, res) => {
  const { equipmentId, studentName } = req.body;
  
  const equipmentIndex = equipment.findIndex(eq => eq.id === equipmentId);
  
  if (equipmentIndex === -1) {
    return res.status(404).json({ error: 'Equipo no encontrado' });
  }
  
  if (equipment[equipmentIndex].status === 'occupied') {
    return res.status(400).json({ error: 'Equipo ya está ocupado' });
  }
  
  equipment[equipmentIndex].status = 'occupied';
  equipment[equipmentIndex].student = studentName;
  
  res.json({ 
    message: 'Equipo registrado exitosamente',
    equipment: equipment[equipmentIndex]
  });
});

// Liberar equipo
router.post('/release', (req, res) => {
  const { equipmentId } = req.body;
  
  const equipmentIndex = equipment.findIndex(eq => eq.id === equipmentId);
  
  if (equipmentIndex === -1) {
    return res.status(404).json({ error: 'Equipo no encontrado' });
  }
  
  equipment[equipmentIndex].status = 'available';
  equipment[equipmentIndex].student = null;
  
  res.json({ 
    message: 'Equipo liberado exitosamente',
    equipment: equipment[equipmentIndex]
  });
});

module.exports = router;