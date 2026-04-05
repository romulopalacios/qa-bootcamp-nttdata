const express = require('express');
const cors = require('cors');
const fs = require('fs');
const jwt = require('jsonwebtoken'); // Necesario para verificar
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

// Datos en memoria coincidentes con Auth y Frontend
const BALANCES = {
    'u1': 1500.00, // Ana
    'u2': 50.00,   // Beto
    'u3': 300.00   // Carlos
};

const TRANSACTIONS = {
    'u1': [],
    'u2': [],
    'u3': []
};

// Middleware para validar token REAL y extraer usuario
const verifyToken = (req, res, next) => {
  const bearerHeader = req.headers['authorization'];
  
  if (typeof bearerHeader !== 'undefined') {
    const token = bearerHeader.split(' ')[1];
    
    jwt.verify(token, config.jwt_secret, (err, decoded) => {
        if (err) {
            return res.status(403).json({ error: "Token inválido o expirado" });
        }
        // Inyectamos el usuario decodificado en la request
        req.user = decoded; 
        next();
    });
  } else {
    res.status(401).json({ error: "No autorizado: Falta Header Authorization" });
  }
};

app.get('/v1/balance', verifyToken, (req, res) => {
    const userId = req.user.userId; 
    
    // Si es un usuario nuevo que no tiene saldo inicializado, lo iniciamos en 0
    if (BALANCES[userId] === undefined) BALANCES[userId] = 0;

    const balance = BALANCES[userId];
    console.log(`[WALLET] Consulta saldo autorizada para: ${userId} (${req.user.name}) -> $${balance}`);
    
    res.json({ balance, currency: 'USD' });
});

app.get('/v1/transactions', verifyToken, (req, res) => {
    const userId = req.user.userId;
    console.log(`[WALLET] Consulta movimientos para: ${userId}`);
    res.json(TRANSACTIONS[userId] || []);
});

// Endpoint interno para actualizar saldo (Uso interno entre microservicios)
app.post('/internal/update-balance', (req, res) => {
    const { userId, amount, type, description } = req.body;
    
    if (BALANCES[userId] === undefined) BALANCES[userId] = 0;
    
    if (type === 'CREDIT') {
        BALANCES[userId] += amount;
    } else if (type === 'DEBIT') {
        if (BALANCES[userId] < amount) {
            return res.status(400).json({ error: "Saldo insuficiente" });
        }
        BALANCES[userId] -= amount;
    }

    // Registrar en historial mock
    if (!TRANSACTIONS[userId]) TRANSACTIONS[userId] = [];
    
    // Determinar nombre de contraparte genérico si no se provee (mejora futura: pasar nombre de sender/receiver)
    let counterpartyLabel = 'Transferencia';
    if (description && description.includes('Recarga')) counterpartyLabel = 'Carga de Saldo';
    else counterpartyLabel = type === 'CREDIT' ? 'Dinero Recibido' : 'Dinero Enviado';

    TRANSACTIONS[userId].unshift({
        id: `tx-${Date.now()}-${Math.floor(Math.random()*1000)}`,
        type: type === 'CREDIT' ? 'INCOME' : 'EXPENSE',
        amount: amount,
        date: new Date().toISOString(),
        counterparty: counterpartyLabel,
        description: description || 'Sin nota'
    });
    
    console.log(`[WALLET] Saldo actualizado ${userId}: ${BALANCES[userId]} | Nota: ${description}`);
    res.json({ success: true, newBalance: BALANCES[userId] });
});

// Endpoint de prueba para recargar saldo (simula cajero/banco)
app.post('/v1/deposit', verifyToken, (req, res) => {
    const userId = req.user.userId;
    const { amount } = req.body;

    if (!amount || amount <= 0) return res.status(400).json({error: "Monto inválido"});

    if (BALANCES[userId] === undefined) BALANCES[userId] = 0;
    BALANCES[userId] += amount;

    if (!TRANSACTIONS[userId]) TRANSACTIONS[userId] = [];
    TRANSACTIONS[userId].unshift({
        id: `dep-${Date.now()}`,
        type: 'INCOME',
        amount: amount,
        date: new Date().toISOString(),
        counterparty: 'Recarga Bancaria',
        description: 'Carga de saldo manual'
    });

    console.log(`[WALLET] Depósito manual para ${userId}: +$${amount}`);
    res.json({ success: true, newBalance: BALANCES[userId] });
});

const PORT = config.app_port || 3000;
app.listen(PORT, () => console.log(`Wallet Service running on port ${PORT}`));