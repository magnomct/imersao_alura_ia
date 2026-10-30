/**
 * @license
 * SPDX-License-Identifier: MIT
 * Copyright (c) 2026 Carlos Magno
 *
 * Definições de Tipos para o Desafio 3: Lista de Tarefas (To-Do List)
 */

export type TaskPriority = 'baixa' | 'media' | 'alta';
export type TaskFilter = 'todas' | 'pendentes' | 'concluidas';

export interface Task {
  id: string;
  titulo: string;
  concluida: boolean;
  criadaEm: string;
  concluidaEm?: string;
  prioridade: TaskPriority;
}

export interface TaskStats {
  total: number;
  pendentes: number;
  concluidas: number;
  percentualConcluido: number;
}

