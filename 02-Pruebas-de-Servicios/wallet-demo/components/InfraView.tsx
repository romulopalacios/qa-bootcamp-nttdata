import React from 'react';
import { dockerComposeContent } from '../services/swaggerSpec';
import { Server, Database, Network } from 'lucide-react';

export const InfraView: React.FC = () => {
  return (
    <div className="p-8 h-full overflow-y-auto bg-slate-50">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-3xl font-bold text-slate-800 mb-6">Arquitectura e Infraestructura</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center text-blue-600 mb-4">
                    <Network />
                </div>
                <h3 className="font-bold text-lg mb-2">API Gateway (Nginx)</h3>
                <p className="text-sm text-slate-500">Punto de entrada para tráfico móvil. Enruta peticiones a microservicios internos (Auth, Wallet, Transaction) y maneja SSL.</p>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center text-purple-600 mb-4">
                    <Server />
                </div>
                <h3 className="font-bold text-lg mb-2">Microservicios</h3>
                <p className="text-sm text-slate-500">Contenedores ejecutándose independientemente. El servicio de Transacciones depende del servicio de Billetera (Síncrono REST o Asíncrono Kafka).</p>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center text-green-600 mb-4">
                    <Database />
                </div>
                <h3 className="font-bold text-lg mb-2">Persistencia</h3>
                <p className="text-sm text-slate-500">Instancias PostgreSQL aisladas para datos de Auth y Wallet para asegurar contextos delimitados y soberanía de datos.</p>
            </div>
        </div>

        <div className="bg-slate-900 rounded-xl overflow-hidden shadow-lg">
            <div className="flex items-center justify-between px-6 py-4 bg-slate-800 border-b border-slate-700">
                <span className="text-slate-300 font-mono text-sm">docker-compose.yml</span>
                <button 
                  onClick={() => navigator.clipboard.writeText(dockerComposeContent)}
                  className="text-xs bg-slate-700 text-white px-3 py-1 rounded hover:bg-slate-600 transition"
                >
                    COPIAR
                </button>
            </div>
            <div className="p-6 overflow-x-auto">
                <pre className="font-mono text-sm text-blue-300 leading-relaxed">
                    {dockerComposeContent}
                </pre>
            </div>
        </div>
      </div>
    </div>
  );
};