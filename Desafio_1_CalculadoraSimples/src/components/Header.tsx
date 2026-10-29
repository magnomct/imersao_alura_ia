/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import {
  Calculator as CalculatorIcon,
  Terminal,
  BookOpen,
  HelpCircle,
  Copy,
  Check,
  Download,
  Sparkles,
  ChevronDown,
  Eye,
  EyeOff,
} from 'lucide-react';

export type AppTab = 'calculator' | 'simulator' | 'concepts' | 'quiz';

interface HeaderProps {
  activeTab: AppTab;
  setActiveTab: (tab: AppTab) => void;
  showAllMenus: boolean;
  setShowAllMenus: (show: boolean) => void;
  onCopyCode: () => void;
  copied: boolean;
  onDownloadCode: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  showAllMenus,
  setShowAllMenus,
  onCopyCode,
  copied,
  onDownloadCode,
}) => {
  return (
    <header className="border-b border-slate-700/80 bg-slate-900/95 sticky top-0 z-40 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          
          {/* Logo & Identity */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => setActiveTab('calculator')}
              className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-400 via-yellow-500 to-emerald-500 flex items-center justify-center shadow-lg shadow-yellow-500/10 ring-1 ring-yellow-400/30 cursor-pointer hover:scale-105 transition-transform"
              title="Ir para a Calculadora"
              aria-label="Ir para a Calculadora"
            >
              <span className="text-xl font-black text-slate-950 font-mono">Py</span>
            </button>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-lg font-bold text-white tracking-tight">
                  Calculadora Python
                </h1>
                <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center gap-1">
                  <Sparkles className="w-3 h-3" /> Nível Iniciante
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Operações matemáticas básicas e lógica de programação em Python
              </p>
            </div>
          </div>

          {/* Navigation Tabs */}
          <nav
            className="flex flex-wrap items-center gap-1.5 bg-slate-800/90 p-1 rounded-xl border border-slate-700/60 shadow-inner"
            aria-label="Navegação principal"
          >
            {/* Botão Inicial: Somente Calculadora */}
            <button
              onClick={() => setActiveTab('calculator')}
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer ${
                activeTab === 'calculator'
                  ? 'bg-emerald-500 text-slate-950 font-bold shadow-md shadow-emerald-500/20 ring-1 ring-emerald-300'
                  : 'text-slate-200 hover:text-white hover:bg-slate-750'
              }`}
              aria-current={activeTab === 'calculator' ? 'page' : undefined}
            >
              <CalculatorIcon className="w-3.5 h-3.5" />
              <span>Somente Calculadora</span>
            </button>

            {/* Outros menus: aparecem depois / quando ativados */}
            {showAllMenus ? (
              <>
                <button
                  onClick={() => setActiveTab('simulator')}
                  className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer ${
                    activeTab === 'simulator'
                      ? 'bg-emerald-500 text-slate-950 font-semibold shadow-md shadow-emerald-500/20'
                      : 'text-slate-300 hover:text-white hover:bg-slate-700/50'
                  }`}
                  aria-current={activeTab === 'simulator' ? 'page' : undefined}
                >
                  <Terminal className="w-3.5 h-3.5" />
                  <span>Código & Simulador</span>
                </button>

                <button
                  onClick={() => setActiveTab('concepts')}
                  className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer ${
                    activeTab === 'concepts'
                      ? 'bg-emerald-500 text-slate-950 font-semibold shadow-md shadow-emerald-500/20'
                      : 'text-slate-300 hover:text-white hover:bg-slate-700/50'
                  }`}
                  aria-current={activeTab === 'concepts' ? 'page' : undefined}
                >
                  <BookOpen className="w-3.5 h-3.5" />
                  <span>Guia de Conceitos</span>
                </button>

                <button
                  onClick={() => setActiveTab('quiz')}
                  className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer ${
                    activeTab === 'quiz'
                      ? 'bg-emerald-500 text-slate-950 font-semibold shadow-md shadow-emerald-500/20'
                      : 'text-slate-300 hover:text-white hover:bg-slate-700/50'
                  }`}
                  aria-current={activeTab === 'quiz' ? 'page' : undefined}
                >
                  <HelpCircle className="w-3.5 h-3.5" />
                  <span>Quiz & Desafios</span>
                </button>

                <button
                  onClick={() => setShowAllMenus(false)}
                  className="flex items-center gap-1 px-2 py-1.5 rounded-lg text-[11px] text-slate-400 hover:text-slate-200 hover:bg-slate-700/50 transition-colors ml-1 cursor-pointer"
                  title="Ocultar outros menus e focar na calculadora"
                >
                  <EyeOff className="w-3 h-3" />
                  <span>Ocultar</span>
                </button>
              </>
            ) : (
              <button
                onClick={() => {
                  setShowAllMenus(true);
                  if (activeTab === 'calculator') {
                    setActiveTab('simulator');
                  }
                }}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-purple-500/20 text-purple-300 hover:bg-purple-500/30 border border-purple-500/30 transition-all cursor-pointer"
                title="Mostrar menus do código Python, conceitos e quiz"
              >
                <Sparkles className="w-3.5 h-3.5 text-purple-400" />
                <span>Mostrar Outros Menus</span>
                <ChevronDown className="w-3 h-3 text-purple-400 -mr-0.5" />
              </button>
            )}
          </nav>

          {/* Quick Actions */}
          <div className="flex items-center gap-2">
            <button
              onClick={onCopyCode}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-slate-800 text-slate-200 border border-slate-700 hover:bg-slate-750 hover:text-white transition-colors cursor-pointer"
              title="Copiar código Python completo"
              aria-label="Copiar código Python"
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                  <span className="text-emerald-400 font-semibold">Copiado!</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5 text-slate-400" />
                  <span>Copiar Código</span>
                </>
              )}
            </button>

            <button
              onClick={onDownloadCode}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-amber-500/10 text-amber-300 border border-amber-500/30 hover:bg-amber-500/20 transition-colors cursor-pointer"
              title="Baixar arquivo calculadora.py"
              aria-label="Baixar arquivo calculadora.py"
            >
              <Download className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Baixar</span> .py
            </button>
          </div>

        </div>
      </div>
    </header>
  );
};