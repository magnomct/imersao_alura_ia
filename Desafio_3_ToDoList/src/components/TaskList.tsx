/**
 * @license
 * SPDX-License-Identifier: MIT
 * Copyright (c) 2026 Carlos Magno
 *
 * Componente TaskList: Gerencia a lista de itens e estados vazios (Empty States).
 */

import React from 'react';
import { Task, TaskFilter } from '../types/todo';
import { TaskItem } from './TaskItem';
import { ClipboardList, CheckCircle2, Clock } from 'lucide-react';

interface TaskListProps {
  tasks: Task[];
  currentFilter: TaskFilter;
  onToggle: (id: string) => void;
  onRemove: (id: string) => void;
}

export const TaskList: React.FC<TaskListProps> = ({
  tasks,
  currentFilter,
  onToggle,
  onRemove,
}) => {
  if (tasks.length === 0) {
    return (
      <div className="bg-slate-900/60 border border-slate-800 rounded-3xl p-10 text-center space-y-3">
        {currentFilter === 'concluidas' ? (
          <>
            <div className="w-12 h-12 rounded-2xl bg-slate-800/80 text-slate-500 mx-auto flex items-center justify-center">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-white">Nenhuma tarefa concluída ainda</h3>
            <p className="text-xs text-slate-400 max-w-sm mx-auto">
              Quando você finalizar uma tarefa pendente, clique no círculo para marcá-la como concluída!
            </p>
          </>
        ) : currentFilter === 'pendentes' ? (
          <>
            <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 mx-auto flex items-center justify-center">
              <CheckCircle2 className="w-6 h-6 stroke-[2.5]" />
            </div>
            <h3 className="text-base font-bold text-white">Tudo em dia! 🎉</h3>
            <p className="text-xs text-slate-400 max-w-sm mx-auto">
              Você não possui nenhuma atividade pendente no momento. Bom trabalho!
            </p>
          </>
        ) : (
          <>
            <div className="w-12 h-12 rounded-2xl bg-slate-800/80 text-slate-500 mx-auto flex items-center justify-center">
              <ClipboardList className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-white">Sua lista está vazia</h3>
            <p className="text-xs text-slate-400 max-w-sm mx-auto">
              Digite uma tarefa no campo acima e clique em <strong>Adicionar</strong> para começar a organizar seu dia.
            </p>
          </>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-2.5">
      {tasks.map((task) => (
        <TaskItem
          key={task.id}
          task={task}
          onToggle={onToggle}
          onRemove={onRemove}
        />
      ))}
    </div>
  );
};

