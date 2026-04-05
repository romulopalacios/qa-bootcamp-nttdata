const express = require('express');
const cors = require('cors');
const axios = require('axios');
const fs = require('fs');
const jwt = require('jsonwebtoken'); // Para decodificar identidad del emisor
const app = express();

// Cargar configuración
let config = {};
try {
    config = JSON.parse(fs.readFileSync('./config.json', 'utf8'));
} catch (e) {
    console.error("No se pudo cargar config.json", e);
    process.exit(1);
}

app.use(express.json());
app.use(cors());

const WALLET_SERVICE_URL = config.wallet_service_url;

// Endpoint principal para transferencias
app.post('/v1/transfer', async (req, res) => {
    const authHeader = req.headers['authorization'];
    const { recipientId, amount, description } = req.body;

    if (!authHeader) {
        return res.status(401).json({ error: "Token no proporcionado" });
    }

    const token = authHeader.split(' ')[1];
    let senderId = null;
    let senderName = "Desconocido";

    try {
        // Verificar token para saber QUIEN envía el dinero
        const decoded = jwt.verify(token, config.jwt_secret);
        senderId = decoded.userId;
        senderName = decoded.name;
    } catch (err) {
        return res.status(403).json({ error: "Token inválido" });
    }

    if (senderId === recipientId) {
        return res.status(400).json({ error: "No puedes transferirte a ti mismo" });
    }

    console.log(`[TRANSACTION] Transferencia de ${senderId} -> ${recipientId} ($${amount}) | Nota: ${description}`);

    try {
        // 1. Verificar Saldo del EMISOR (senderId extraído del token)
        const balanceResponse = await axios.get(`${WALLET_SERVICE_URL}/v1/balance`, {
            headers: { 'Authorization': authHeader }
        });

        const currentBalance = balanceResponse.data.balance;

        if (currentBalance < amount) {
            console.error(`[TRANSACTION] Fallo: Saldo insuficiente (${currentBalance} < ${amount})`);
            return res.status(400).json({ error: "Fondos insuficientes" });
        }

        // 2. Ejecutar Transacción
        
        // A. Debitar al Emisor
        await axios.post(`${WALLET_SERVICE_URL}/internal/update-balance`, {
            userId: senderId, 
            amount: amount,
            type: 'DEBIT',
            description: `Para: ${recipientId}. Nota: ${description || ''}`
        });

        // B. Acreditar al Receptor
        await axios.post(`${WALLET_SERVICE_URL}/internal/update-balance`, {
            userId: recipientId,
            amount: amount,
            type: 'CREDIT',
            description: `De: ${senderName}. Nota: ${description || ''}`
        });

        console.log(`[TRANSACTION] Transferencia completada exitosamente`);
        
        res.json({
            transactionId: `tx_${Date.now()}`,
            status: 'COMPLETED',
            message: 'Transferencia realizada con éxito'
        });

    } catch (error) {
        console.error(`[TRANSACTION] Error procesando pago:`, error.message);
        if (error.response) {
            return res.status(error.response.status).json(error.response.data);
        }
        res.status(500).json({ error: "Error interno del servidor de transacciones" });
    }
});

const PORT = config.app_port || 3000;
app.listen(PORT, () => console.log(`Transaction Service running on port ${PORT}`));