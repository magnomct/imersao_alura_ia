/**
 * @license
 * SPDX-License-Identifier: MIT
 * Copyright (c) 2026 Carlos Magno
 *
 * Componente de Filtros de Visualização e Ações em Lote.
 */

import React from 'react';
import { TaskFilter, TaskStats } from '../types/todo';
import { CheckCheck, Trash2, Filter } from 'lucide-react';

interface TaskFiltersProps {
  currentFilter: TaskFilter;
  onFilterChange: (filtro: TaskFilter) => void;
  stats: TaskStats;
  onClearCompleted: () => void;
}

export const TaskFilters: React.FC<TaskFiltersProps> = ({
  currentFilter,
  onFilterChange,
  stats,
  onClearCompleted,
}) => {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2 pb-1">
      {/* Abas de Filtros */}
      <div className="flex items-center gap-1.5 p-1 bg-slate-900 border border-slate-800 rounded-2xl w-fit shadow-md">
        <button
          onClick={() => onFilterChange('todas')}
          className={`flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
            currentFilter === 'todas'
              ? 'bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/20'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <span>Todas</span>
          <span
            className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono ${
              currentFilter === 'todas'
                ? 'bg-slate-950/40 text-slate-950 font-bold'
                : 'bg-slate-800 text-slate-400'
            }`}
          >
            {stats.total}
          </span>
        </button>

        <button
          onClick={() => onFilterChange('pendentes')}
          className={`flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
            currentFilter === 'pendentes'
              ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <span>Pendentes</span>
          <span
            className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono ${
              currentFilter === 'pendentes'
                ? 'bg-slate-950/40 text-slate-950 font-bold'
                : 'bg-slate-800 text-slate-400'
            }`}
          >
            {stats.pendentes}
          </span>
        </button>

        <button
          onClick={() => onFilterChange('concluidas')}
          className={`flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
            currentFilter === 'concluidas'
              ? 'bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/20'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <span>Concluídas</span>
          <span
            className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono ${
              currentFilter === 'concluidas'
                ? 'bg-slate-950/40 text-slate-950 font-bold'
                : 'bg-slate-800 text-slate-400'
            }`}
          >
            {stats.concluidas}
          </span>
        </button>
      </div>

      {/* Ação em lote: Limpar Concluídas */}
      {stats.concluidas > 0 && (
        <button
          onClick={onClearCompleted}
          className="flex items-center gap-1.5 text-xs text-rose-400 hover:text-rose-300 hover:bg-rose-950/40 px-3 py-1.5 rounded-xl border border-rose-900/60 transition-all cursor-pointer w-fit self-end sm:self-auto"
          title="Excluir todas as tarefas que já foram concluídas"
        >
          <Trash2 className="w-3.5 h-3.5" />
          <span>Limpar {stats.concluidas} Concluída(s)</span>
        </button>
      )}
    </div>
  );
};

