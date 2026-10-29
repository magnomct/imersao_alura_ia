/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import {
  History,
  Download,
  Trash2,
  Calendar,
  CheckCircle2,
  Clock,
} from 'lucide-react';
import { CalculationHistoryItem } from '../utils/scientific-engine';

interface HistoryViewProps {
  history: CalculationHistoryItem[];
  onClearHistory: () => void;
}

export const HistoryView: React.FC<HistoryViewProps> = ({ history, onClearHistory }) => {
  const handleExportJson = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(history, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', 'history.json');
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header do Histórico */}
      <div className="bg-slate-900 border border-slate-700/80 rounded-2xl p-5 shadow-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <History className="w-5 h-5 text-emerald-400" />
            <h2 className="text-lg font-bold text-white">
              Histórico Persistente de Cálculos
            </h2>
          </div>
          <p className="text-xs text-slate-400">
            Registros gravados com data, hora, categoria e resultado para auditoria.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {history.length > 0 && (
            <>
              <button
                onClick={handleExportJson}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 hover:bg-emerald-500/30 transition-all cursor-pointer"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Exportar JSON</span>
              </button>

              <button
                onClick={onClearHistory}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-rose-500/20 text-rose-300 border border-rose-500/40 hover:bg-rose-500/30 transition-all cursor-pointer"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Limpar</span>
              </button>
            </>
          )}
        </div>
      </div>

      {/* Lista de Itens */}
      {history.length === 0 ? (
        <div className="bg-slate-900/60 border border-slate-800 rounded-3xl p-12 text-center space-y-3">
          <Clock className="w-8 h-8 text-slate-600 mx-auto" />
          <h3 className="text-sm font-semibold text-slate-300">Nenhum cálculo registrado ainda</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            Use a calculadora, resolva equações ou faça conversões para que os dados apareçam aqui e sejam salvos.
          </p>
        </div>
      ) : (
        <div className="bg-slate-900 border border-slate-700/80 rounded-3xl p-4 shadow-xl divide-y divide-slate-800 font-mono text-xs">
          {history.map((item, idx) => (
            <div key={item.id || idx} className="py-3 px-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2 hover:bg-slate-800/40 rounded-xl transition-colors">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                    item.categoria === 'Básica'
                      ? 'bg-blue-900/60 text-blue-300'
                      : item.categoria === 'Científica'
                      ? 'bg-purple-900/60 text-purple-300'
                      : item.categoria === 'Álgebra'
                      ? 'bg-emerald-900/60 text-emerald-300'
                      : 'bg-amber-900/60 text-amber-300'
                  }`}>
                    {item.categoria}
                  </span>
                  <span className="text-[10px] text-slate-500 flex items-center gap-1 font-sans">
                    <Calendar className="w-3 h-3" />
                    {item.timestamp}
                  </span>
                </div>
                <div className="text-slate-200 text-sm font-medium">
                  {item.expressao}
                </div>
              </div>

              <div className="text-right sm:text-right">
                <div className="text-emerald-400 font-bold text-base">
                  = {item.resultado}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

