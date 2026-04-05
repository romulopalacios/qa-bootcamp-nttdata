import { User, Transaction, ServiceLog } from '../types';

// ==========================================
// CONFIGURACIÓN DE ENDPOINTS
// ==========================================
const API_URLS = {
  AUTH: 'http://localhost:4001',
  WALLET: 'http://localhost:4002',
  TRANSACTION: 'http://localhost:4003'
};

// Logger callback type
type LogFn = (log: ServiceLog) => void;

// Almacenamiento temporal del token en memoria del cliente
let SESSION_TOKEN: string | null = null;

// Helper para hacer requests y loguear automáticamente
async function apiClient(
    serviceName: string, 
    url: string, 
    options: RequestInit, 
    log: LogFn
): Promise<any> {
    const start = Date.now();
    const timestamp = new Date().toISOString();
    
    // Preparar Log de Request para visualización
    const safeHeaders = { ...options.headers } as any;
    if (safeHeaders['Authorization']) safeHeaders['Authorization'] = 'Bearer [HIDDEN]';
    
    const requestBody = options.body ? JSON.parse(options.body as string) : null;

    const reqLog: ServiceLog = {
        timestamp,
        service: serviceName,
        action: `${options.method} ${url.replace('http://localhost', '')}`,
        status: 'INFO',
        details: 'Enviando petición...',
        requestDetails: {
            method: options.method || 'GET',
            url: url,
            headers: safeHeaders,
            body: requestBody
        }
    };
    log(reqLog);

    try {
        const res = await fetch(url, options);
        let data;
        try {
             data = await res.json();
        } catch (jsonError) {
             data = { error: "Respuesta no es JSON válida" };
        }
        
        // Log de Response
        log({
            timestamp: new Date().toISOString(),
            service: serviceName,
            action: `Response ${res.status}`,
            status: res.ok ? 'SUCCESS' : 'ERROR',
            details: `Tiempo: ${Date.now() - start}ms`,
            responseDetails: {
                status: res.status,
                body: data
            }
        });

        if (!res.ok) {
            throw new Error(data.error || 'Error en el servidor');
        }

        return data;
    } catch (error: any) {
        log({
            timestamp: new Date().toISOString(),
            service: serviceName,
            action: 'Connection Error',
            status: 'ERROR',
            details: error.message
        });
        throw error;
    }
}

// ==========================================
// SERVICIOS REALES (Consumen APIs Docker)
// ==========================================

export const AuthService = {
  login: async (phone: string, log: LogFn): Promise<{ token: string; user: User }> => {
    const data = await apiClient('Auth-MS', `${API_URLS.AUTH}/v1/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone })
    }, log);

    SESSION_TOKEN = data.token;
    
    return {
        token: data.token,
        user: {
            id: data.user.id,
            name: data.user.name,
            phone: data.user.phone,
            balance: 0 
        }
    };
  }
};

export const WalletService = {
  getBalance: async (userId: string, log: LogFn): Promise<number> => {
    if (!SESSION_TOKEN) throw new Error("No hay sesión activa");
    
    const data = await apiClient('Wallet-MS', `${API_URLS.WALLET}/v1/balance`, {
        method: 'GET',
        headers: { 
            'Authorization': `Bearer ${SESSION_TOKEN}`,
            'Content-Type': 'application/json'
        }
    }, log);

    return data.balance;
  },
  
  getHistory: async (userId: string, log: LogFn): Promise<Transaction[]> => {
    if (!SESSION_TOKEN) throw new Error("No hay sesión activa");

    const data = await apiClient('Wallet-MS', `${API_URLS.WALLET}/v1/transactions`, {
        method: 'GET',
        headers: { 
            'Authorization': `Bearer ${SESSION_TOKEN}`,
            'Content-Type': 'application/json'
        }
    }, log);

    return data;
  },

  deposit: async (amount: number, log: LogFn): Promise<boolean> => {
    if (!SESSION_TOKEN) throw new Error("No hay sesión activa");

    await apiClient('Wallet-MS', `${API_URLS.WALLET}/v1/deposit`, {
        method: 'POST',
        headers: { 
            'Authorization': `Bearer ${SESSION_TOKEN}`,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ amount })
    }, log);

    return true;
  }
};

export const TransactionService = {
  transfer: async (senderId: string, recipientId: string, amount: number, description: string, log: LogFn): Promise<boolean> => {
    if (!SESSION_TOKEN) throw new Error("No hay sesión activa");

    await apiClient('Transaction-MS', `${API_URLS.TRANSACTION}/v1/transfer`, {
        method: 'POST',
        headers: { 
            'Authorization': `Bearer ${SESSION_TOKEN}`,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ recipientId, amount, description })
    }, log);

    return true;
  }
};

export const ContactService = {
  // Ahora consume el API real del Auth Service para obtener todos los usuarios registrados
  getAll: async (log: LogFn): Promise<User[]> => {
    try {
        const users = await apiClient('Auth-MS', `${API_URLS.AUTH}/v1/users`, {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' }
        }, log);
        return users;
    } catch (e) {
        console.error("Error fetching contacts", e);
        return [];
    }
  },

  search: async (query: string, log: LogFn): Promise<User | null> => {
    const users = await ContactService.getAll(log);
    const found = users.find(u => u.phone === query || u.name.toLowerCase().includes(query.toLowerCase()));
    if (found) return found;
    return null;
  }
};