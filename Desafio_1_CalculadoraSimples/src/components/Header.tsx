/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Terminal, BookOpen, HelpCircle, Copy, Check, Download, Sparkles } from 'lucide-react';

interface HeaderProps {
  activeTab: 'simulator' | 'concepts' | 'quiz';
  setActiveTab: (tab: 'simulator' | 'concepts' | 'quiz') => void;
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
          
          {/* Logo & Tutor Identity */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-400 via-yellow-500 to-emerald-500 flex items-center justify-center shadow-lg shadow-yellow-500/10 ring-1 ring-yellow-400/30">
              <span className="text-xl font-black text-slate-950 font-mono">Py</span>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-lg font-bold text-white tracking-tight">
                  Tutor Python: Calculadora Básica
                </h1>
                <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center gap-1">
                  <Sparkles className="w-3 h-3" /> Nível Iniciante
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Aprenda instruções sequenciais, variáveis e condições de forma prática
              </p>
            </div>
          </div>

          {/* Navigation Tabs */}
          <nav className="flex items-center gap-1.5 bg-slate-800/90 p-1 rounded-xl border border-slate-700/60 shadow-inner" aria-label="Navegação principal">
            <button
              onClick={() => setActiveTab('simulator')}
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-medium transition-all ${
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
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-medium transition-all ${
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
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-medium transition-all ${
                activeTab === 'quiz'
                  ? 'bg-emerald-500 text-slate-950 font-semibold shadow-md shadow-emerald-500/20'
                  : 'text-slate-300 hover:text-white hover:bg-slate-700/50'
              }`}
              aria-current={activeTab === 'quiz' ? 'page' : undefined}
            >
              <HelpCircle className="w-3.5 h-3.5" />
              <span>Quiz & Desafios</span>
            </button>
          </nav>

          {/* Quick Actions */}
          <div className="flex items-center gap-2">
            <button
              onClick={onCopyCode}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-slate-800 text-slate-200 border border-slate-700 hover:bg-slate-750 hover:text-white transition-colors"
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
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-amber-500/10 text-amber-300 border border-amber-500/30 hover:bg-amber-500/20 transition-colors"
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
