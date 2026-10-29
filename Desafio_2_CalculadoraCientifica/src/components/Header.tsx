/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import {
  Calculator as CalculatorIcon,
  LineChart,
  ArrowLeftRight,
  History,
  ShieldCheck,
  Download,
  Copy,
  Check,
  Sparkles,
} from 'lucide-react';

export type ScientificTab = 'calculator' | 'plotter' | 'converters' | 'history' | 'architecture';

interface HeaderProps {
  activeTab: ScientificTab;
  setActiveTab: (tab: ScientificTab) => void;
  onCopyCode: () => void;
  copied: boolean;
  onDownloadCode: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  onCopyCode,
  copied,
  onDownloadCode,
}) => {
  return (
    <header className="border-b border-slate-700/80 bg-slate-900/95 sticky top-0 z-40 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          
          {/* Logo & Identidade Científica */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => setActiveTab('calculator')}
              className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-400 via-teal-500 to-cyan-500 flex items-center justify-center shadow-lg shadow-emerald-500/15 ring-1 ring-emerald-400/30 cursor-pointer hover:scale-105 transition-transform"
              title="Calculadora Científica"
            >
              <span className="text-xl font-black text-slate-950 font-mono">f(x)</span>
            </button>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-lg font-bold text-white tracking-tight">
                  Calculadora Científica Modular
                </h1>
                <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 flex items-center gap-1">
                  <ShieldCheck className="w-3 h-3" /> v2.0 Enterprise
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Well-Architected Framework • SymPy • Matplotlib • AppSec Hardening
              </p>
            </div>
          </div>

          {/* Abas de Navegação */}
          <nav
            className="flex flex-wrap items-center gap-1.5 bg-slate-800/90 p-1 rounded-xl border border-slate-700/60 shadow-inner text-xs"
            aria-label="Navegação da calculadora"
          >
            <button
              onClick={() => setActiveTab('calculator')}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-lg font-medium transition-all cursor-pointer ${
                activeTab === 'calculator'
                  ? 'bg-emerald-500 text-slate-950 font-bold shadow-md shadow-emerald-500/20 ring-1 ring-emerald-300'
                  : 'text-slate-300 hover:text-white hover:bg-slate-750'
              }`}
            >
              <CalculatorIcon className="w-3.5 h-3.5" />
              <span>Calculadora</span>
            </button>

            <button
              onClick={() => setActiveTab('plotter')}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-lg font-medium transition-all cursor-pointer ${
                activeTab === 'plotter'
                  ? 'bg-emerald-500 text-slate-950 font-bold shadow-md shadow-emerald-500/20 ring-1 ring-emerald-300'
                  : 'text-slate-300 hover:text-white hover:bg-slate-750'
              }`}
            >
              <LineChart className="w-3.5 h-3.5" />
              <span>Gráficos f(x)</span>
            </button>

            <button
              onClick={() => setActiveTab('converters')}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-lg font-medium transition-all cursor-pointer ${
                activeTab === 'converters'
                  ? 'bg-emerald-500 text-slate-950 font-bold shadow-md shadow-emerald-500/20 ring-1 ring-emerald-300'
                  : 'text-slate-300 hover:text-white hover:bg-slate-750'
              }`}
            >
              <ArrowLeftRight className="w-3.5 h-3.5" />
              <span>Conversores</span>
            </button>

            <button
              onClick={() => setActiveTab('history')}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-lg font-medium transition-all cursor-pointer ${
                activeTab === 'history'
                  ? 'bg-emerald-500 text-slate-950 font-bold shadow-md shadow-emerald-500/20 ring-1 ring-emerald-300'
                  : 'text-slate-300 hover:text-white hover:bg-slate-750'
              }`}
            >
              <History className="w-3.5 h-3.5" />
              <span>Histórico</span>
            </button>

            <button
              onClick={() => setActiveTab('architecture')}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-lg font-medium transition-all cursor-pointer ${
                activeTab === 'architecture'
                  ? 'bg-emerald-500 text-slate-950 font-bold shadow-md shadow-emerald-500/20 ring-1 ring-emerald-300'
                  : 'text-slate-300 hover:text-white hover:bg-slate-750'
              }`}
            >
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Arquitetura & QA</span>
            </button>
          </nav>

          {/* Ações Rápidas */}
          <div className="flex items-center gap-2">
            <button
              onClick={onCopyCode}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-slate-800 text-slate-200 border border-slate-700 hover:bg-slate-750 hover:text-white transition-colors cursor-pointer"
              title="Copiar código Python completo"
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                  <span className="text-emerald-400 font-semibold">Copiado!</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5 text-slate-400" />
                  <span>Copiar Python</span>
                </>
              )}
            </button>

            <button
              onClick={onDownloadCode}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-emerald-500/10 text-emerald-300 border border-emerald-500/30 hover:bg-emerald-500/20 transition-colors cursor-pointer"
              title="Baixar arquivo main.py"
            >
              <Download className="w-3.5 h-3.5" />
              <span>main.py</span>
            </button>
          </div>

        </div>
      </div>
    </header>
  );
};
