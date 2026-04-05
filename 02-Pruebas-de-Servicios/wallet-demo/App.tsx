import React, { useState, useCallback, useEffect } from 'react';
import { PhoneSimulator } from './components/PhoneSimulator';
import { ApiDocs } from './components/ApiDocs';
import { ServiceLog } from './types';
import { Smartphone, BookOpen, Terminal, AlertTriangle, ChevronRight, ChevronDown } from 'lucide-react';

// Error Boundary Simple
class ErrorBoundary extends React.Component<{children: React.ReactNode}, {hasError: boolean, error: any}> {
  constructor(props: any) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: any) {
    return { hasError: true, error };
  }

  componentDidCatch(error: any, errorInfo: any) {
    console.error("Uncaught error:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="p-10 text-center">
          <h1 className="text-2xl font-bold text-red-600 flex items-center justify-center gap-2">
            <AlertTriangle /> Algo salió mal.
          </h1>
          <p className="mt-4 text-slate-600">Revisa la consola del navegador para más detalles.</p>
          <pre className="mt-4 bg-gray-100 p-4 rounded text-left text-xs overflow-auto">
            {this.state.error?.toString()}
          </pre>
        </div>
      );
    }
    return this.props.children;
  }
}

export default function App() {
  const [activeTab, setActiveTab] = useState<'APP' | 'DOCS'>('APP');
  const [logs, setLogs] = useState<ServiceLog[]>([]);

  useEffect(() => {
    console.log('[App] Componente principal montado correctamente.');
  }, []);

  const addLog = useCallback((log: ServiceLog) => {
    setLogs(prev => [log, ...prev].slice(0, 50)); 
  }, []);

  return (
    <ErrorBoundary>
      <div className="flex flex-col h-screen overflow-hidden">
        {/* Header / Nav */}
        <header className="bg-white border-b border-slate-200 px-6 py-3 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="bg-brand-600 text-white p-2 rounded-lg">
              <Smartphone size={20} />
            </div>
            <h1 className="font-bold text-xl text-slate-800">Billetera Digital</h1>
          </div>
          
          <nav className="flex bg-slate-100 p-1 rounded-lg">
            <button 
              onClick={() => setActiveTab('APP')}
              className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-bold transition ${activeTab === 'APP' ? 'bg-white shadow text-brand-600' : 'text-slate-500 hover:text-slate-700'}`}
            >
              <Smartphone size={16} /> App
            </button>
            <button 
              onClick={() => setActiveTab('DOCS')}
              className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-bold transition ${activeTab === 'DOCS' ? 'bg-white shadow text-brand-600' : 'text-slate-500 hover:text-slate-700'}`}
            >
              <BookOpen size={16} /> API Docs
            </button>
          </nav>
        </header>

        {/* Main Content Area */}
        <div className="flex flex-1 overflow-hidden">
          {/* Left/Center: The Active View */}
          <main className="flex-1 relative bg-slate-100">
            {activeTab === 'APP' && <PhoneSimulator addLog={addLog} />}
            {activeTab === 'DOCS' && <ApiDocs />}
          </main>

          {/* Right Panel: Live Server Logs */}
          <aside className="w-[450px] bg-slate-900 text-slate-300 flex flex-col border-l border-slate-800 shrink-0 hidden xl:flex shadow-2xl z-20">
            <div className="p-4 border-b border-slate-700 flex items-center gap-2 bg-slate-950">
              <Terminal size={18} className="text-green-400" />
              <h2 className="font-mono text-sm font-bold text-white">Live Logs (Real-time)</h2>
              <button 
                onClick={() => setLogs([])}
                className="ml-auto text-xs text-slate-500 hover:text-white border border-slate-700 px-2 py-1 rounded"
              >
                LIMPIAR
              </button>
            </div>
            <div className="flex-1 overflow-y-auto p-4 space-y-4 font-mono text-xs">
              {logs.length === 0 && (
                <div className="text-center mt-20 opacity-50">
                    <p className="mb-2">Esperando tráfico...</p>
                    <p className="text-[10px]">Realiza acciones en la App para ver los requests HTTP reales.</p>
                </div>
              )}
              {logs.map((log, i) => (
                <div key={i} className="animate-in fade-in slide-in-from-right-4 duration-300 border-b border-slate-800 pb-4">
                  <div className="flex justify-between text-slate-500 mb-1">
                    <span>{log.timestamp.split('T')[1].split('.')[0]}</span>
                    <span className={`font-bold ${
                      log.status === 'ERROR' ? 'text-red-400' : 
                      log.status === 'SUCCESS' ? 'text-green-400' : 'text-blue-400'
                    }`}>{log.status}</span>
                  </div>
                  
                  <div className="bg-slate-800/50 p-2 rounded border-l-2 border-slate-700 mb-2">
                    <span className="text-yellow-500 font-bold mr-2">[{log.service}]</span>
                    <span className="text-slate-200">{log.action}</span>
                    {log.details && <p className="mt-1 text-slate-500 pl-2 border-l border-slate-700 ml-1">{log.details}</p>}
                  </div>

                  {/* Detalle Desplegable Request */}
                  {log.requestDetails && (
                    <details className="group">
                        <summary className="cursor-pointer text-slate-500 hover:text-blue-300 flex items-center gap-1 mt-1">
                            <ChevronRight size={12} className="group-open:rotate-90 transition" />
                            <span>Ver Request (Payload)</span>
                        </summary>
                        <div className="bg-black/30 p-2 rounded mt-1 overflow-x-auto">
                            <div className="mb-1"><span className="text-purple-400">METHOD:</span> {log.requestDetails.method}</div>
                            <div className="mb-1"><span className="text-purple-400">URL:</span> {log.requestDetails.url}</div>
                            {log.requestDetails.body && (
                                <pre className="text-slate-400 mt-1">{JSON.stringify(log.requestDetails.body, null, 2)}</pre>
                            )}
                        </div>
                    </details>
                  )}

                  {/* Detalle Desplegable Response */}
                  {log.responseDetails && (
                    <details className="group">
                        <summary className="cursor-pointer text-slate-500 hover:text-green-300 flex items-center gap-1 mt-1">
                            <ChevronRight size={12} className="group-open:rotate-90 transition" />
                            <span>Ver Response</span>
                        </summary>
                        <div className="bg-black/30 p-2 rounded mt-1 overflow-x-auto">
                            <div className="mb-1"><span className="text-purple-400">STATUS:</span> {log.responseDetails.status}</div>
                            {log.responseDetails.body && (
                                <pre className="text-green-400/80 mt-1">{JSON.stringify(log.responseDetails.body, null, 2)}</pre>
                            )}
                        </div>
                    </details>
                  )}
                </div>
              ))}
            </div>
          </aside>
        </div>
      </div>
    </ErrorBoundary>
  );
}