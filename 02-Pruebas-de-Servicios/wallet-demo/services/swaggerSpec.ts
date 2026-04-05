import { ApiEndpoint } from '../types';

export const apiSpec: ApiEndpoint[] = [
  {
    method: 'GET',
    path: 'http://localhost:4001/v1/users',
    service: 'Auth',
    summary: 'Listar Usuarios',
    description: 'Retorna lista pública de usuarios registrados para facilitar búsqueda de destinatarios.',
    responses: {
        200: "[ { id: 'u1', name: 'Ana Admin', phone: '...' }, ... ]"
    }
  },
  {
    method: 'POST',
    path: 'http://localhost:4001/v1/register',
    service: 'Auth',
    summary: 'Registrar Usuario',
    description: 'Endpoint público. Registra usuario en base de datos. Retorna error si ya existe el teléfono.',
    body: {
      phone: "string (requerido)",
      fullName: "string (requerido)"
    },
    responses: {
      201: "Usuario creado exitosamente",
      409: "El usuario ya existe"
    }
  },
  {
    method: 'POST',
    path: 'http://localhost:4001/v1/login',
    service: 'Auth',
    summary: 'Iniciar Sesión (Obtener Token)',
    description: 'Autentica al usuario por celular. Retorna JWT necesario para otros endpoints.',
    body: {
      phone: "string (demo: '999888777')"
    },
    responses: {
      200: "Retorna { token: 'eyJ...', user: { ... } }",
      401: "Usuario no encontrado"
    }
  },
  {
    method: 'GET',
    path: 'http://localhost:4002/v1/balance',
    service: 'Wallet',
    summary: 'Consultar Saldo Propio',
    description: 'Obtiene el saldo del usuario autenticado. La identidad se extrae del Token JWT (Header Authorization).',
    parameters: [
      { name: "Authorization", in: "header", required: true, type: "Bearer <token>" }
    ],
    responses: {
      200: "{ balance: 1500.00, currency: 'USD' }",
      403: "Token inválido"
    }
  },
  {
    method: 'POST',
    path: 'http://localhost:4002/v1/deposit',
    service: 'Wallet',
    summary: 'Recarga de Saldo (Demo)',
    description: 'Añade saldo a la billetera del usuario actual. Simula un ingreso de dinero externo.',
    parameters: [
      { name: "Authorization", in: "header", required: true, type: "Bearer <token>" }
    ],
    body: {
      amount: "number"
    },
    responses: {
      200: "{ success: true, newBalance: 1600.00 }"
    }
  },
  {
    method: 'GET',
    path: 'http://localhost:4002/v1/transactions',
    service: 'Wallet',
    summary: 'Consultar Mis Movimientos',
    description: 'Obtiene historial de transacciones del usuario del Token.',
    parameters: [
      { name: "Authorization", in: "header", required: true, type: "Bearer <token>" }
    ],
    responses: {
      200: "[ { id: '...', amount: 100, type: 'INCOME', description: 'Nota...' }, ... ]"
    }
  },
  {
    method: 'POST',
    path: 'http://localhost:4003/v1/transfer',
    service: 'Transaction',
    summary: 'Realizar Transferencia',
    description: 'Envía dinero. El emisor es el usuario del Token. El receptor se especifica en el body.',
    parameters: [
      { name: "Authorization", in: "header", required: true, type: "Bearer <token>" }
    ],
    body: {
      recipientId: "string (ej: 'u2')",
      amount: "number",
      description: "string (opcional)"
    },
    responses: {
      200: "{ transactionId: 'tx_...', status: 'COMPLETED' }",
      400: "Fondos insuficientes o error de validación"
    }
  }
];

export const dockerComposeContent = `...contenido oculto...`;