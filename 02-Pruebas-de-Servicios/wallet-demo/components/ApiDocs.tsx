import React from 'react';
import { apiSpec } from '../services/swaggerSpec';
import { FileJson, Lock } from 'lucide-react';

export const ApiDocs: React.FC = () => {
  return (
    <div className="p-8 h-full overflow-y-auto bg-slate-50">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-800 mb-2">Documentación API</h1>
          <p className="text-slate-600">Especificación OpenAPI 3.0 para la Plataforma de Pagos.</p>
          <div className="mt-4 inline-flex items-center gap-2 bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
            <span className="w-2 h-2 rounded-full bg-blue-500"></span>
            v1.0.0
          </div>
        </div>

        <div className="space-y-6">
          {apiSpec.map((endpoint, idx) => (
            <div key={idx} className="border border-slate-200 rounded-lg bg-white overflow-hidden shadow-sm">
              {/* Header */}
              <div className="flex items-center gap-4 p-4 border-b border-slate-100 cursor-pointer hover:bg-slate-50 transition">
                <span className={`px-3 py-1 rounded text-sm font-bold w-20 text-center
                  ${endpoint.method === 'GET' ? 'bg-blue-100 text-blue-700' : ''}
                  ${endpoint.method === 'POST' ? 'bg-green-100 text-green-700' : ''}
                  ${endpoint.method === 'PUT' ? 'bg-orange-100 text-orange-700' : ''}
                  ${endpoint.method === 'DELETE' ? 'bg-red-100 text-red-700' : ''}
                `}>
                  {endpoint.method}
                </span>
                <span className="font-mono text-slate-700 font-medium">{endpoint.path}</span>
                <span className="text-xs text-slate-500 ml-auto border px-2 py-0.5 rounded uppercase">{endpoint.service} Service</span>
              </div>

              {/* Details */}
              <div className="p-6 bg-slate-50/50">
                <p className="text-slate-700 mb-4">{endpoint.description}</p>
                
                {/* Parameters */}
                {(endpoint.parameters || endpoint.body) && (
                  <div className="mb-6">
                    <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">Parámetros & Body</h4>
                    <div className="bg-slate-900 rounded-lg p-4 overflow-x-auto">
                        <code className="text-sm text-green-400 font-mono">
                          {endpoint.parameters && (
                            <div>
                                <span className="text-slate-500">// Headers / Query</span>
                                {endpoint.parameters.map(p => (
                                    <div key={p.name} className="pl-2">
                                        {p.name} <span className="text-orange-300">{p.required ? '*' : ''}</span>: <span className="text-blue-300">{p.type}</span>
                                    </div>
                                ))}
                            </div>
                          )}
                          {endpoint.body && (
                            <div className="mt-2">
                                <span className="text-slate-500">// Request Body (JSON)</span><br/>
                                {"{"}<br/>
                                {Object.entries(endpoint.body).map(([k, v]) => (
                                    <div key={k} className="pl-4">
                                        "{k}": <span className="text-yellow-300">"{v}"</span>,
                                    </div>
                                ))}
                                {"}"}
                            </div>
                          )}
                        </code>
                    </div>
                  </div>
                )}

                {/* Responses */}
                <div>
                  <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">Respuestas</h4>
                  <div className="space-y-2">
                    {Object.entries(endpoint.responses).map(([code, desc]) => (
                        <div key={code} className="flex gap-4 text-sm">
                            <span className={`font-mono font-bold w-12 text-right ${code.startsWith('2') ? 'text-green-600' : 'text-red-500'}`}>{code}</span>
                            <span className="text-slate-600">{desc}</span>
                        </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};