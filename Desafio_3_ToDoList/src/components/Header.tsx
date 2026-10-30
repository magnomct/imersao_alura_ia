/**
 * @license
 * SPDX-License-Identifier: MIT
 * Copyright (c) 2026 Carlos Magno
 *
 * Componente de Cabeçalho com métricas em tempo real e barra de progresso.
 */

import React from 'react';
import { CheckCircle2, ListTodo, Sparkles, BookOpen, Clock } from 'lucide-react';
import { TaskStats } from '../types/todo';

interface HeaderProps {
  stats: TaskStats;
  showGuide: boolean;
  onToggleGuide: () => void;
}

export const Header: React.FC<HeaderProps> = ({ stats, showGuide, onToggleGuide }) => {
  return (
    <header className="border-b border-slate-800 bg-slate-900/90 backdrop-blur-md sticky top-0 z-30">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-4 space-y-4">
        {/* Linha Superior: Logo, Título e Botão do Guia */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-400 via-teal-500 to-cyan-500 flex items-center justify-center shadow-lg shadow-emerald-500/20 ring-1 ring-emerald-400/40">
              <ListTodo className="w-5 h-5 text-slate-950 stroke-[2.5]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-lg sm:text-xl font-bold text-white tracking-tight">
                  Gerenciador de Tarefas
                </h1>
                <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-300 border border-emerald-500/30 flex items-center gap-1">
                  <Sparkles className="w-3 h-3" /> Desafio 3
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Imersão IA Alura • Interação Visual, Estado & Didática
              </p>
            </div>
          </div>

          {/* Botão de Toggle do Guia Didático */}
          <button
            onClick={onToggleGuide}
            className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer border ${
              showGuide
                ? 'bg-emerald-500 text-slate-950 border-emerald-400 shadow-md shadow-emerald-500/20'
                : 'bg-slate-800 text-slate-300 hover:text-white hover:bg-slate-750 border-slate-700'
            }`}
          >
            <BookOpen className="w-4 h-4" />
            <span>{showGuide ? 'Ocultar Guia da Arquitetura' : 'Ver Guia da Arquitetura'}</span>
          </button>
        </div>

        {/* Linha Inferior: Contadores Rápidos e Barra de Progresso */}
        <div className="p-3.5 rounded-2xl bg-slate-950/70 border border-slate-800/80 flex flex-col sm:flex-row items-center justify-between gap-3">
          {/* Contadores */}
          <div className="flex items-center gap-4 text-xs font-medium w-full sm:w-auto justify-between sm:justify-start">
            <div className="flex items-center gap-1.5 text-slate-400">
              <span>Total:</span>
              <strong className="text-white font-mono">{stats.total}</strong>
            </div>
            <div className="flex items-center gap-1.5 text-amber-400">
              <Clock className="w-3.5 h-3.5" />
              <span>Pendentes:</span>
              <strong className="text-amber-300 font-mono">{stats.pendentes}</strong>
            </div>
            <div className="flex items-center gap-1.5 text-emerald-400">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Concluídas:</span>
              <strong className="text-emerald-300 font-mono">{stats.concluidas}</strong>
            </div>
          </div>

          {/* Barra de Progresso */}
          <div className="w-full sm:w-48 flex items-center gap-2">
            <div className="flex-1 bg-slate-800 h-2 rounded-full overflow-hidden">
              <div
                className="bg-gradient-to-r from-emerald-500 to-teal-400 h-full transition-all duration-300 rounded-full"
                style={{ width: `${stats.percentualConcluido}%` }}
              />
            </div>
            <span className="text-xs font-mono font-bold text-emerald-400 min-w-8 text-right">
              {stats.percentualConcluido}%
            </span>
          </div>
        </div>
      </div>
    </header>
  );
};

