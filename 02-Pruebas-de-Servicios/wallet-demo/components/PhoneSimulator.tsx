import React, { useState, useEffect, useCallback } from 'react';
import { User, Transaction, ServiceLog } from '../types';
import { AuthService, WalletService, TransactionService, ContactService } from '../services/mockBackend';
import { 
  RefreshCcw, 
  Search, 
  Send, 
  ArrowUpRight, 
  ArrowDownLeft, 
  LogOut, 
  User as UserIcon,
  ShieldCheck,
  Smartphone,
  Fingerprint,
  ChevronLeft,
  History,
  Home,
  PlusCircle
} from 'lucide-react';

interface Props {
  addLog: (log: ServiceLog) => void;
}

export const PhoneSimulator: React.FC<Props> = ({ addLog }) => {
  const [screen, setScreen] = useState<'LOGIN' | 'HOME' | 'TRANSFER' | 'HISTORY' | 'SUCCESS'>('LOGIN');
  const [user, setUser] = useState<User | null>(null);
  const [history, setHistory] = useState<Transaction[]>([]);
  
  // Login State
  const [loginPhone, setLoginPhone] = useState('999888777');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false); 

  // Transfer State
  const [searchQuery, setSearchQuery] = useState('');
  const [recipient, setRecipient] = useState<User | null>(null);
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');
  const [allContacts, setAllContacts] = useState<User[]>([]);

  // Deposit State
  const [showDepositModal, setShowDepositModal] = useState(false);
  const [depositAmount, setDepositAmount] = useState('');

  // Function to fetch latest data from backend
  const fetchUserData = useCallback(async (userId: string) => {
    setRefreshing(true);
    try {
      const freshBalance = await WalletService.getBalance(userId, addLog);
      const freshHistory = await WalletService.getHistory(userId, addLog);
      
      setUser(prev => prev ? ({ ...prev, balance: freshBalance }) : null);
      setHistory(freshHistory);
    } catch (e) {
      console.error("Error refreshing data", e);
    } finally {
      setRefreshing(false);
    }
  }, [addLog]);

  // Effect: Refresh data when entering HOME screen
  useEffect(() => {
    if (screen === 'HOME' && user) {
      fetchUserData(user.id);
    }
  }, [screen, user?.id, fetchUserData]);

  // Load real contacts for testing
  useEffect(() => {
    ContactService.getAll(addLog).then(setAllContacts);
  }, [addLog]);

  const handleLogin = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await AuthService.login(loginPhone, addLog);
      if (res) {
        setUser(res.user);
        // Cargar contactos reales al inicio para tenerlos listos
        ContactService.getAll(addLog).then(setAllContacts);
        
        const txs = await WalletService.getHistory(res.user.id, addLog);
        setHistory(txs);
        setScreen('HOME');
      }
    } catch (e: any) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDeposit = async () => {
    if (!depositAmount || parseFloat(depositAmount) <= 0) return;
    setLoading(true);
    try {
        await WalletService.deposit(parseFloat(depositAmount), addLog);
        setDepositAmount('');
        setShowDepositModal(false);
        if (user) fetchUserData(user.id);
    } catch (e) {
        alert("Error en depósito");
    } finally {
        setLoading(false);
    }
  };

  const handleSearchContact = async (queryOverride?: string) => {
    const q = queryOverride || searchQuery;
    setLoading(true);
    setRecipient(null);
    try {
      const contact = await ContactService.search(q, addLog);
      if (contact) {
        if (contact.id === user?.id) {
           setError('No puedes enviarte dinero a ti mismo');
        } else {
           setRecipient(contact);
           setError('');
        }
      } else {
        setError('Usuario no encontrado. Asegúrate que exista en Auth Service.');
      }
    } catch (e) {
      setError('Búsqueda fallida');
    } finally {
      setLoading(false);
    }
  };

  const handleTransfer = async () => {
    if (!user || !recipient) return;
    
    if (parseFloat(amount) <= 0) {
        setError("El monto debe ser mayor a 0");
        return;
    }

    setLoading(true);
    setError('');
    try {
      await TransactionService.transfer(user.id, recipient.id, parseFloat(amount), description, addLog);
      setScreen('SUCCESS');
    } catch (e: any) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  const ScreenLogin = () => (
    <div className="flex flex-col h-full p-8 justify-center bg-brand-600 text-white">
      <div className="mb-8 text-center">
        <div className="bg-white/20 p-4 rounded-full inline-block mb-4">
          <Smartphone size={48} />
        </div>
        <h1 className="text-3xl font-bold">Wallet App</h1>
        <p className="opacity-80">Banca Digital</p>
      </div>
      
      <div className="space-y-4">
        <div>
          <label className="text-xs uppercase tracking-wider opacity-70">Número de Celular</label>
          <input 
            type="tel" 
            value={loginPhone}
            onChange={e => setLoginPhone(e.target.value)}
            className="w-full bg-white/10 border border-white/30 rounded p-3 text-lg focus:outline-none focus:bg-white/20 transition"
          />
        </div>
        
        {error && <p className="text-red-300 text-sm font-semibold">{error}</p>}
        
        <button 
          onClick={handleLogin}
          disabled={loading}
          className="w-full bg-white text-brand-600 font-bold py-4 rounded-lg mt-4 hover:bg-brand-50 transition flex justify-center items-center gap-2"
        >
          {loading ? <RefreshCcw className="animate-spin" /> : (
            <>
              <Fingerprint size={20} />
              <span>Ingresar con Biometría</span>
            </>
          )}
        </button>
      </div>
      <div className="mt-8 text-center text-xs opacity-60">
        <p>Usuarios de prueba disponibles:</p>
        <p>999888777 (Ana) | 666555444 (Beto)</p>
      </div>
    </div>
  );

  const ScreenHome = () => (
    <div className="flex flex-col h-full bg-gray-50 relative">
      {showDepositModal && (
        <div className="absolute inset-0 bg-black/80 z-50 flex items-center justify-center p-6 animate-in fade-in">
            <div className="bg-white w-full rounded-2xl p-6">
                <h3 className="font-bold text-lg mb-4 text-slate-800">Recargar Saldo</h3>
                <input 
                    type="number" 
                    placeholder="Monto"
                    className="w-full border p-3 rounded mb-4 text-xl"
                    value={depositAmount}
                    onChange={e => setDepositAmount(e.target.value)}
                />
                <div className="flex gap-2">
                    <button onClick={() => setShowDepositModal(false)} className="flex-1 py-3 bg-gray-200 rounded font-bold">Cancelar</button>
                    <button onClick={handleDeposit} className="flex-1 py-3 bg-brand-600 text-white rounded font-bold">Recargar</button>
                </div>
            </div>
        </div>
      )}

      <div className="bg-brand-600 p-6 text-white pb-12 rounded-b-[2rem] shadow-lg relative">
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-2">
            <div className="bg-white/20 p-2 rounded-full">
              <UserIcon size={20} />
            </div>
            <span className="font-medium">Hola, {user?.name.split(' ')[0]}</span>
          </div>
          <button onClick={() => setScreen('LOGIN')} title="Cerrar Sesión"><LogOut size={20} className="opacity-70 hover:opacity-100" /></button>
        </div>
        
        <div className="text-center">
          <p className="opacity-80 text-sm flex justify-center items-center gap-1">
            Saldo Disponible
          </p>
          <div className="flex items-center justify-center gap-2 mt-1">
            <h2 className="text-4xl font-bold">${user?.balance.toFixed(2)}</h2>
            <button 
                onClick={() => user && fetchUserData(user.id)}
                disabled={refreshing}
                className="p-1.5 bg-white/10 rounded-full hover:bg-white/20 transition active:scale-95"
                title="Actualizar Saldo"
            >
                <RefreshCcw size={16} className={refreshing ? 'animate-spin' : ''} />
            </button>
            <button 
                onClick={() => setShowDepositModal(true)}
                className="p-1.5 bg-green-500/80 rounded-full hover:bg-green-500 transition active:scale-95 ml-2"
                title="Depositar Dinero (Debug)"
            >
                <PlusCircle size={16} />
            </button>
          </div>
        </div>
        
        {/* Quick Action Floating */}
        <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 flex gap-4">
            <button 
              onClick={() => {
                setRecipient(null);
                setSearchQuery('');
                setAmount('');
                setDescription('');
                setError('');
                setScreen('TRANSFER');
              }}
              className="bg-brand-900 text-white p-4 px-6 rounded-xl shadow-lg hover:scale-105 transition flex flex-col items-center gap-1 min-w-[140px]"
            >
              <Send size={24} />
              <span className="text-xs font-semibold">Enviar Dinero</span>
            </button>
        </div>
      </div>

      <div className="mt-16 px-6 flex-1 overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h3 className="font-bold text-gray-700">Movimientos</h3>
          <button 
            onClick={() => setScreen('HISTORY')}
            className="text-brand-600 text-xs font-bold hover:underline"
          >
            VER TODO
          </button>
        </div>
        
        <div className="space-y-3 pb-6">
          {history.length === 0 ? (
            <div className="text-center text-gray-400 py-10">Sin movimientos recientes</div>
          ) : (
            history.slice(0, 3).map(tx => (
              <div key={tx.id} className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex justify-between items-center">
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-lg ${tx.type === 'INCOME' ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'}`}>
                    {tx.type === 'INCOME' ? <ArrowDownLeft size={20} /> : <ArrowUpRight size={20} />}
                  </div>
                  <div className="overflow-hidden">
                    <p className="font-bold text-gray-800 text-sm truncate w-32">{tx.counterparty}</p>
                    <p className="text-[10px] text-gray-400">{tx.description}</p>
                  </div>
                </div>
                <span className={`font-bold ${tx.type === 'INCOME' ? 'text-green-600' : 'text-gray-800'}`}>
                  {tx.type === 'INCOME' ? '+' : '-'}${tx.amount.toFixed(2)}
                </span>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );

  const ScreenHistory = () => (
    <div className="flex flex-col h-full bg-white">
      <div className="p-4 border-b flex items-center justify-between bg-gray-50">
        <div className="flex items-center gap-3">
            <button onClick={() => setScreen('HOME')} className="p-2 hover:bg-gray-200 rounded-full transition">
            <ChevronLeft size={24} className="text-slate-700"/>
            </button>
            <h2 className="font-bold text-lg text-slate-800">Historial</h2>
        </div>
        <button onClick={() => setScreen('HOME')} className="p-2 hover:bg-gray-200 rounded-full transition" title="Ir al Inicio">
             <Home size={20} className="text-brand-600" />
        </button>
      </div>
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {history.map(tx => (
            <div key={tx.id} className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex justify-between items-center">
            <div className="flex items-center gap-3">
                <div className={`p-2 rounded-lg ${tx.type === 'INCOME' ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'}`}>
                {tx.type === 'INCOME' ? <ArrowDownLeft size={20} /> : <ArrowUpRight size={20} />}
                </div>
                <div>
                <p className="font-bold text-gray-800 text-sm">{tx.counterparty}</p>
                <p className="text-[10px] text-gray-400">
                    {new Date(tx.date).toLocaleDateString()} {new Date(tx.date).toLocaleTimeString()}
                </p>
                <p className="text-[10px] text-gray-500 italic max-w-[150px] truncate">{tx.description}</p>
                </div>
            </div>
            <span className={`font-bold ${tx.type === 'INCOME' ? 'text-green-600' : 'text-gray-800'}`}>
                {tx.type === 'INCOME' ? '+' : '-'}${tx.amount.toFixed(2)}
            </span>
            </div>
        ))}
      </div>
    </div>
  );

  const ScreenTransfer = () => (
    <div className="flex flex-col h-full bg-white">
      <div className="p-4 border-b flex items-center justify-between bg-gray-50">
        <div className="flex items-center gap-3">
            <button onClick={() => setScreen('HOME')} className="p-2 hover:bg-gray-200 rounded-full transition">
            <ChevronLeft size={24} className="text-slate-700"/>
            </button>
            <h2 className="font-bold text-lg text-slate-800">Enviar Dinero</h2>
        </div>
        <button onClick={() => setScreen('HOME')} className="p-2 hover:bg-gray-200 rounded-full transition" title="Ir al Inicio">
             <Home size={20} className="text-brand-600" />
        </button>
      </div>

      <div className="p-6 flex-1 overflow-y-auto">
        {/* Step 1: Find User */}
        {!recipient ? (
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Buscar Destinatario</label>
              <div className="flex gap-2">
                <input 
                  type="text" 
                  placeholder="Celular o nombre" 
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  className="flex-1 border p-3 rounded-lg focus:ring-2 focus:ring-brand-500 outline-none"
                />
                <button 
                  onClick={() => handleSearchContact()}
                  disabled={loading}
                  className="bg-brand-600 text-white p-3 rounded-lg"
                >
                  {loading ? <RefreshCcw className="animate-spin" /> : <Search />}
                </button>
              </div>
              {error && <p className="text-red-500 text-sm mt-2 font-medium">{error}</p>}
            </div>
            
            <div>
               <div className="flex justify-between items-center mb-3">
                   <h4 className="text-xs font-bold text-gray-400 uppercase">Contactos Disponibles</h4>
                   <button onClick={() => ContactService.getAll(addLog).then(setAllContacts)} className="text-xs text-brand-600 font-bold">ACTUALIZAR</button>
               </div>
               <div className="space-y-2">
                 {allContacts
                    .filter(c => c.phone !== user?.phone) // Hide self
                    .map((c, idx) => (
                   <button 
                      key={idx}
                      onClick={() => { setSearchQuery(c.name); handleSearchContact(c.phone); }} 
                      className="flex items-center gap-3 p-3 hover:bg-gray-50 w-full rounded-xl border border-transparent hover:border-gray-200 transition group"
                   >
                      <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-600 font-bold group-hover:bg-brand-100 group-hover:text-brand-600 transition">
                        {c.name[0]}
                      </div>
                      <div className="text-left">
                        <p className="text-sm font-bold text-slate-700">{c.name}</p>
                        <p className="text-xs text-gray-400">{c.phone}</p>
                      </div>
                      <div className="ml-auto opacity-0 group-hover:opacity-100 transition">
                          <ChevronLeft className="rotate-180 text-gray-300" size={16} />
                      </div>
                   </button>
                 ))}
               </div>
            </div>
          </div>
        ) : (
          /* Step 2: Amount & Confirm */
          <div className="space-y-6 animate-in slide-in-from-right duration-300">
            <div className="bg-gray-50 p-4 rounded-lg flex items-center justify-between border border-gray-100">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-brand-100 flex items-center justify-center text-brand-700 font-bold text-lg">
                  {recipient.name[0]}
                </div>
                <div>
                  <p className="font-bold text-gray-800">{recipient.name}</p>
                  <p className="text-xs text-gray-500">{recipient.phone}</p>
                </div>
              </div>
              <button onClick={() => setRecipient(null)} className="text-xs text-brand-600 font-bold hover:underline">CAMBIAR</button>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Monto a Enviar</label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 text-xl font-bold">$</span>
                <input 
                  type="number" 
                  value={amount}
                  onChange={e => setAmount(e.target.value)}
                  className="w-full border p-4 pl-10 text-2xl font-bold rounded-lg focus:ring-2 focus:ring-brand-500 outline-none"
                  placeholder="0.00"
                />
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Nota (Opcional)</label>
              <input 
                type="text" 
                value={description}
                onChange={e => setDescription(e.target.value)}
                className="w-full border p-3 text-sm rounded-lg focus:ring-2 focus:ring-brand-500 outline-none"
                placeholder="Ej: Pago almuerzo, Regalo..."
              />
            </div>

            <div className="flex justify-between mt-2">
                <p className="text-xs text-gray-500">Saldo actual: ${user?.balance.toFixed(2)}</p>
                {amount && user && (user.balance - parseFloat(amount)) < 0 && (
                    <p className="text-xs text-red-500 font-bold">Saldo insuficiente</p>
                )}
            </div>

            {error && <p className="text-red-500 text-sm font-medium bg-red-50 p-3 rounded">{error}</p>}

            <button 
              onClick={handleTransfer}
              disabled={loading || !amount || parseFloat(amount) <= 0 || (user && user.balance < parseFloat(amount)) || false}
              className="w-full bg-brand-600 text-white font-bold py-4 rounded-lg shadow-lg hover:bg-brand-700 disabled:opacity-50 disabled:cursor-not-allowed flex justify-center items-center gap-2 mt-4"
            >
              {loading ? <RefreshCcw className="animate-spin" /> : (
                <>
                  <span>CONFIRMAR ENVÍO</span>
                </>
              )}
            </button>
          </div>
        )}
      </div>
    </div>
  );

  const ScreenSuccess = () => (
    <div className="flex flex-col h-full bg-green-500 text-white items-center justify-center p-8">
      <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center text-green-500 mb-6 shadow-xl animate-bounce">
        <ShieldCheck size={48} />
      </div>
      <h2 className="text-3xl font-bold mb-2">¡Enviado!</h2>
      <p className="opacity-90 mb-8 text-center">Transferencia de ${parseFloat(amount).toFixed(2)} realizada.</p>
      
      <div className="bg-white/20 p-4 rounded-lg w-full mb-8 backdrop-blur-sm">
        <div className="flex justify-between text-sm mb-2">
          <span className="opacity-80">ID Operación</span>
          <span className="font-mono">TX-{Date.now().toString().slice(-6)}</span>
        </div>
        <div className="flex justify-between text-sm mb-2">
          <span className="opacity-80">Destinatario</span>
          <span className="font-bold">{recipient?.name}</span>
        </div>
        {description && (
            <div className="flex justify-between text-sm">
            <span className="opacity-80">Nota</span>
            <span className="font-medium italic">{description}</span>
            </div>
        )}
      </div>

      <button 
        onClick={() => { setScreen('HOME'); setAmount(''); setDescription(''); setSearchQuery(''); setRecipient(null); }}
        className="bg-white text-green-600 font-bold py-3 px-8 rounded-full shadow-lg hover:bg-gray-50 w-full transition transform hover:scale-105"
      >
        Volver al Inicio
      </button>
    </div>
  );

  return (
    <div className="w-full h-full bg-gray-900 flex items-center justify-center p-4">
      <div className="w-full max-w-[360px] h-[720px] bg-white rounded-[3rem] border-8 border-gray-800 shadow-2xl overflow-hidden relative">
        {/* Notch */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-6 bg-gray-800 rounded-b-xl z-20"></div>
        
        {/* Screen Content */}
        <div className="h-full w-full relative z-10">
          {screen === 'LOGIN' && <ScreenLogin />}
          {screen === 'HOME' && <ScreenHome />}
          {screen === 'HISTORY' && <ScreenHistory />}
          {screen === 'TRANSFER' && <ScreenTransfer />}
          {screen === 'SUCCESS' && <ScreenSuccess />}
        </div>
      </div>
    </div>
  );
};