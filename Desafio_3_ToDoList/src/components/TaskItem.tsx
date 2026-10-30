/**
 * @license
 * SPDX-License-Identifier: MIT
 * Copyright (c) 2026 Carlos Magno
 *
 * Componente TaskItem: Renderiza uma única tarefa com a MELHORIA VISUAL OBRIGATÓRIA
 * que diferencia com total clareza tarefas Concluídas de Pendentes.
 */

import React from 'react';
import { Task } from '../types/todo';
import { Check, Trash2, Clock, CheckCircle2 } from 'lucide-react';

interface TaskItemProps {
  task: Task;
  onToggle: (id: string) => void;
  onRemove: (id: string) => void;
}

export const TaskItem: React.FC<TaskItemProps> = ({ task, onToggle, onRemove }) => {
  // Configuração das cores de prioridade
  const priorityConfig = {
    baixa: { label: 'Baixa', bg: 'bg-blue-950/50 text-blue-300 border-blue-800/60' },
    media: { label: 'Média', bg: 'bg-amber-950/50 text-amber-300 border-amber-800/60' },
    alta: { label: 'Alta', bg: 'bg-rose-950/50 text-rose-300 border-rose-800/60' },
  };

  /**
   * =========================================================================
   * 🌟 MELHORIA VISUAL OBRIGATÓRIA (ESTILIZAÇÃO BASEADA EM ESTADO)
   * =========================================================================
   * 1. Container:
   *    - Concluída: 'opacity-70 bg-slate-900/40 border-slate-800/60' (opacidade reduzida e fundo sutil)
   *    - Pendente:  'opacity-100 bg-slate-900 border-slate-700/80 shadow-md' (destaque e contraste total)
   *
   * 2. Texto do Título:
   *    - Concluída: 'line-through text-slate-400 decoration-emerald-500/70 decoration-2' (tachado/riscado)
   *    - Pendente:  'text-slate-100 font-medium' (branco nítido e legível)
   *
   * 3. Checkbox:
   *    - Concluída: 'bg-emerald-500 border-emerald-500 text-slate-950' com ícone Check
   *    - Pendente:  'border-slate-600 hover:border-emerald-400 bg-slate-950 text-transparent'
   * =========================================================================
   */

  return (
    <div
      className={`group flex items-center justify-between gap-3 p-4 rounded-2xl border transition-all duration-200 select-none ${
        task.concluida
          ? 'opacity-70 bg-slate-900/40 border-slate-800/60 shadow-none'
          : 'opacity-100 bg-slate-900 border-slate-700/80 hover:border-slate-600 shadow-md hover:shadow-lg'
      }`}
    >
      {/* Lado Esquerdo: Checkbox + Título + Metadados */}
      <div className="flex items-start gap-3.5 flex-1 min-w-0">
        {/* Botão de Checkbox Interativo */}
        <button
          type="button"
          onClick={() => onToggle(task.id)}
          aria-label={task.concluida ? 'Marcar como pendente' : 'Marcar como concluída'}
          className={`w-6 h-6 rounded-lg border flex items-center justify-center shrink-0 mt-0.5 transition-all cursor-pointer ${
            task.concluida
              ? 'bg-emerald-500 border-emerald-400 text-slate-950 shadow-sm shadow-emerald-500/30'
              : 'border-slate-600 hover:border-emerald-400 bg-slate-950 hover:bg-slate-900 text-transparent'
          }`}
        >
          <Check className={`w-4 h-4 stroke-[3] ${task.concluida ? 'block' : 'opacity-0'}`} />
        </button>

        {/* Informações da Tarefa */}
        <div className="flex-1 min-w-0 space-y-1">
          {/* Título com Texto Riscado quando concluída */}
          <p
            onClick={() => onToggle(task.id)}
            className={`text-sm break-words transition-colors cursor-pointer ${
              task.concluida
                ? 'line-through text-slate-400 decoration-emerald-500/70 decoration-2'
                : 'text-slate-100 font-medium hover:text-white'
            }`}
          >
            {task.titulo}
          </p>

          {/* Badges e Horários */}
          <div className="flex flex-wrap items-center gap-2 text-[11px]">
            {/* Badge de Prioridade */}
            <span
              className={`px-2 py-0.5 rounded-md border font-medium ${
                priorityConfig[task.prioridade].bg
              }`}
            >
              {priorityConfig[task.prioridade].label}
            </span>

            {/* Badge de Status / Horário */}
            {task.concluida ? (
              <span className="flex items-center gap-1 text-emerald-400 bg-emerald-950/40 border border-emerald-800/50 px-2 py-0.5 rounded-md font-mono">
                <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                <span>Concluída às {task.concluidaEm || task.criadaEm}</span>
              </span>
            ) : (
              <span className="flex items-center gap-1 text-slate-400 font-mono">
                <Clock className="w-3 h-3 text-slate-500" />
                <span>Criada às {task.criadaEm}</span>
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Lado Direito: Botão Remover Tarefa */}
      <button
        type="button"
        onClick={() => onRemove(task.id)}
        aria-label="Excluir tarefa"
        title="Excluir tarefa"
        className="p-2 rounded-xl text-slate-500 hover:text-rose-400 hover:bg-rose-950/40 border border-transparent hover:border-rose-900/60 transition-all cursor-pointer shrink-0 opacity-80 group-hover:opacity-100"
      >
        <Trash2 className="w-4 h-4" />
      </button>
    </div>
  );
};

