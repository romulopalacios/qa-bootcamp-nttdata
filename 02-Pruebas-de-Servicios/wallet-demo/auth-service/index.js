const express = require('express');
const jwt = require('jsonwebtoken');
const cors = require('cors');
const fs = require('fs');
const app = express();

// Cargar configuración
let config = {};
try {
    config = JSON.parse(fs.readFileSync('./config.json', 'utf8'));
} catch (e) {
    console.error("No se pudo cargar config.json", e);
}

app.use(express.json());
app.use(cors());

// Simulación de Base de Datos en Memoria con los usuarios que espera el Frontend
const USERS = [
    { id: 'u1', phone: '999888777', name: 'Ana Admin' },
    { id: 'u2', phone: '666555444', name: 'Beto Builder' },
    { id: 'u3', phone: '555444333', name: 'Carlos Client' }
];

app.post('/v1/register', (req, res) => {
  const { phone, fullName } = req.body;
  if (USERS.find(u => u.phone === phone)) {
    return res.status(409).json({ error: "Usuario ya existe" });
  }
  // Generamos un ID basado en timestamp para persistencia en sesión
  const newUser = { id: `u_${Date.now()}`, phone, name: fullName };
  USERS.push(newUser);
  console.log(`[AUTH] Usuario registrado: ${phone} (${newUser.id})`);
  res.status(201).json({ message: "Usuario creado exitosamente", user: newUser });
});

app.post('/v1/login', (req, res) => {
  const { phone } = req.body;
  console.log(`[AUTH] Intento de login: ${phone}`);
  
  const user = USERS.find(u => u.phone === phone);
  
  if (!user) {
    return res.status(401).json({ error: "Usuario no encontrado" });
  }

  const token = jwt.sign(
    { userId: user.id, name: user.name, phone: user.phone }, 
    config.jwt_secret, 
    { expiresIn: '1h' }
  );
  
  res.json({ token, expiresIn: 3600, user });
});

// NUEVO ENDPOINT: Recuperar lista de usuarios (Directorio de Contactos)
app.get('/v1/users', (req, res) => {
    // Retornamos solo información pública necesaria para transferencias
    const publicDirectory = USERS.map(u => ({
        id: u.id,
        name: u.name,
        phone: u.phone
    }));
    console.log(`[AUTH] Directorio de usuarios solicitado. Total: ${publicDirectory.length}`);
    res.json(publicDirectory);
});

const PORT = config.app_port || 3000;
app.listen(PORT, () => console.log(`Auth Service running on port ${PORT}`));