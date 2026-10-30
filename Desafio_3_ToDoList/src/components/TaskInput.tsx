/**
 * @license
 * SPDX-License-Identifier: MIT
 * Copyright (c) 2026 Carlos Magno
 *
 * Componente de Formulário para Entrada e Criação de Novas Tarefas.
 */

import React, { useState } from 'react';
import { Plus, AlertCircle, Tag } from 'lucide-react';
import { TaskPriority } from '../types/todo';

interface TaskInputProps {
  onAddTask: (titulo: string, prioridade: TaskPriority) => void;
}

export const TaskInput: React.FC<TaskInputProps> = ({ onAddTask }) => {
  const [titulo, setTitulo] = useState<string>('');
  const [prioridade, setPrioridade] = useState<TaskPriority>('media');
  const [erro, setErro] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!titulo.trim()) {
      setErro('Por favor, digite o nome de uma tarefa antes de adicionar!');
      return;
    }

    try {
      onAddTask(titulo, prioridade);
      setTitulo('');
      setErro(null);
    } catch (err: any) {
      setErro(err.message || 'Erro ao adicionar tarefa.');
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-slate-900 border border-slate-800 rounded-3xl p-5 shadow-xl space-y-3"
    >
      <div className="flex flex-col sm:flex-row gap-3">
        {/* Campo de Entrada de Texto */}
        <div className="flex-1 relative">
          <input
            type="text"
            value={titulo}
            onChange={(e) => {
              setTitulo(e.target.value);
              if (erro) setErro(null);
            }}
            placeholder="O que você precisa fazer hoje? (Ex.: Estudar lógica e estado no React)"
            className="w-full bg-slate-950 border border-slate-700/80 rounded-2xl px-4 py-3 text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/80 focus:border-emerald-500 transition-all font-sans"
          />
        </div>

        {/* Seletor de Prioridade */}
        <div className="flex items-center gap-2">
          <div className="relative">
            <select
              value={prioridade}
              onChange={(e) => setPrioridade(e.target.value as TaskPriority)}
              className="bg-slate-950 border border-slate-700/80 rounded-2xl px-3 py-3 text-xs text-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500/80 cursor-pointer"
            >
              <option value="baixa">Prioridade: Baixa</option>
              <option value="media">Prioridade: Média</option>
              <option value="alta">Prioridade: Alta</option>
            </select>
          </div>

          {/* Botão Adicionar Tarefa */}
          <button
            type="submit"
            className="flex items-center justify-center gap-2 px-5 py-3 rounded-2xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-sm transition-all shadow-lg shadow-emerald-500/20 hover:scale-[1.02] active:scale-[0.98] cursor-pointer whitespace-nowrap"
          >
            <Plus className="w-4 h-4 stroke-[3]" />
            <span>Adicionar</span>
          </button>
        </div>
      </div>

      {/* Alerta Didático de Validação de Entrada Vazia */}
      {erro && (
        <div
          role="alert"
          className="p-3 rounded-xl bg-rose-950/70 border border-rose-500/50 text-rose-300 text-xs flex items-center gap-2 animate-in fade-in"
        >
          <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
          <span>{erro}</span>
        </div>
      )}
    </form>
  );
};

