import React, { useState } from 'react';
import { FileCode, Database } from 'lucide-react';

const nodeCode = `// --- MICROSERVICIO DE AUTENTICACIÓN (Auth-Service) ---
const express = require('express');
const jwt = require('jsonwebtoken');
const app = express();
app.use(express.json());

const USERS = []; // Base de datos

app.post('/v1/register', (req, res) => {
  const { phone, documentId, fullName } = req.body;
  if (USERS.find(u => u.phone === phone)) {
    return res.status(409).json({ error: "Usuario ya existe" });
  }
  USERS.push({ phone, documentId, fullName, id: Date.now() });
  res.status(201).json({ message: "Usuario creado exitosamente" });
});

app.post('/v1/login', (req, res) => {
  const { phone } = req.body;
  // En producción, esto validaría una firma biométrica o token de dispositivo
  const user = USERS.find(u => u.phone === phone);
  
  if (!user) {
    return res.status(401).json({ error: "Dispositivo no reconocido" });
  }

  const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, { expiresIn: '1h' });
  res.json({ token, expiresIn: 3600 });
});

// Externamente mapeado a puerto 4001 en Docker Compose
app.listen(3000, () => console.log('Auth Service running on internal 3000'));

// --- MICROSERVICIO DE BILLETERA (Wallet-Service) ---
const appWallet = express();
appWallet.use(express.json());

// Middleware para verificar JWT
const verifyToken = (req, res, next) => {
  const bearerHeader = req.headers['authorization'];
  if (typeof bearerHeader !== 'undefined') {
    next();
  } else {
    res.sendStatus(403);
  }
};

appWallet.get('/v1/balance', verifyToken, (req, res) => {
    // Consultar saldo en base de datos contable
    res.json({ balance: 1500.00, currency: 'USD' });
});

// Externamente mapeado a puerto 4002 en Docker Compose
appWallet.listen(3000, () => console.log('Wallet Service running on internal 3000'));
`;

const pythonCode = `# --- MICROSERVICIO DE TRANSACCIONES (Transaction-Service) ---
# REESCRITO A NODE.JS EN LA VERSIÓN ACTUAL PARA SIMPLIFICAR EL STACK
# Ver archivo services/transaction-service/index.js

const express = require('express');
const app = express();

const WALLET_SERVICE_URL = process.env.WALLET_SERVICE_URL || 'http://localhost:3002';

app.post('/v1/transfer', async (req, res) => {
    // 1. Validar Token
    // 2. Llamar a Wallet Service para verificar saldo
    // 3. Debitar emisor y Acreditar receptor (Pattern Saga o 2PC)
    // 4. Retornar éxito
});

// Externamente mapeado a puerto 4003 en Docker Compose
app.listen(3000);
`;

export const BackendView: React.FC = () => {
  const [lang, setLang] = useState<'NODE' | 'PYTHON'>('NODE');

  return (
    <div className="p-8 h-full overflow-y-auto bg-slate-50">
      <div className="max-w-5xl mx-auto">
        <div className="mb-6">
            <h1 className="text-3xl font-bold text-slate-800 mb-2">Código Fuente Backend</h1>
            <p className="text-slate-600">Implementación de referencia para los servicios centrales.</p>
        </div>

        <div className="flex gap-4 mb-6">
            <button 
                onClick={() => setLang('NODE')}
                className={`flex items-center gap-2 px-6 py-3 rounded-lg font-bold transition ${lang === 'NODE' ? 'bg-green-600 text-white shadow-lg' : 'bg-white text-slate-600 border hover:bg-slate-50'}`}
            >
                <FileCode size={20} /> Node.js (Auth & Wallet)
            </button>
            <button 
                onClick={() => setLang('PYTHON')}
                className={`flex items-center gap-2 px-6 py-3 rounded-lg font-bold transition ${lang === 'PYTHON' ? 'bg-blue-600 text-white shadow-lg' : 'bg-white text-slate-600 border hover:bg-slate-50'}`}
            >
                <Database size={20} /> Transaction Service
            </button>
        </div>

        <div className="bg-slate-900 rounded-xl overflow-hidden shadow-2xl border border-slate-700">
            <div className="flex items-center justify-between px-6 py-4 bg-slate-800 border-b border-slate-700">
                <span className="text-slate-300 font-mono text-sm">
                    {lang === 'NODE' ? 'services/auth-wallet.js' : 'services/transaction_service.js'}
                </span>
                <div className="flex gap-2">
                    <span className="w-3 h-3 rounded-full bg-red-500"></span>
                    <span className="w-3 h-3 rounded-full bg-yellow-500"></span>
                    <span className="w-3 h-3 rounded-full bg-green-500"></span>
                </div>
            </div>
            <div className="p-6 overflow-x-auto">
                <pre className="font-mono text-sm leading-relaxed">
                    {lang === 'NODE' ? (
                        <code className="text-green-300">{nodeCode}</code>
                    ) : (
                        <code className="text-blue-300">{pythonCode}</code>
                    )}
                </pre>
            </div>
        </div>
      </div>
    </div>
  );
};