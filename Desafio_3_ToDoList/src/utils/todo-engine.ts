/**
 * @license
 * SPDX-License-Identifier: MIT
 * Copyright (c) 2026 Carlos Magno
 *
 * Motor Lógico de Gerenciamento de Estado de Tarefas (To-Do List Engine)
 * Funções puras, imutáveis e didaticamente documentadas para manipulação da lista.
 */

import { Task, TaskFilter, TaskPriority, TaskStats } from '../types/todo';

/**
 * Adiciona uma nova tarefa à lista garantindo sanitização e validação.
 *
 * @param tarefas Lista atual de tarefas (imutável)
 * @param titulo Texto da tarefa inserido pelo usuário
 * @param prioridade Nível de prioridade ('baixa' | 'media' | 'alta')
 * @returns Nova lista com a tarefa adicionada no topo
 * @throws Error se o título estiver vazio ou contiver apenas espaços
 */
export function adicionarTarefa(
  tarefas: Task[],
  titulo: string,
  prioridade: TaskPriority = 'media'
): Task[] {
  const tituloLimpo = titulo.trim();

  if (!tituloLimpo) {
    throw new Error('O título da tarefa não pode estar vazio.');
  }

  const novaTarefa: Task = {
    id: Date.now().toString() + '-' + Math.random().toString(36).substring(2, 7),
    titulo: tituloLimpo,
    concluida: false,
    criadaEm: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    prioridade,
  };

  // Retorna uma nova matriz (imutabilidade) com o novo item no início
  return [novaTarefa, ...tarefas];
}

/**
 * Alterna o estado de conclusão de uma tarefa (Pendente <-> Concluída).
 * Ao concluir, anota o horário exato da conclusão.
 *
 * @param tarefas Lista atual de tarefas
 * @param id Identificador único da tarefa a ser alternada
 * @returns Nova lista com o status da tarefa invertido
 */
export function alternarStatusTarefa(tarefas: Task[], id: string): Task[] {
  return tarefas.map((tarefa) => {
    if (tarefa.id !== id) {
      return tarefa;
    }

    const novoStatus = !tarefa.concluida;
    return {
      ...tarefa,
      concluida: novoStatus,
      concluidaEm: novoStatus
        ? new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        : undefined,
    };
  });
}

/**
 * Remove uma tarefa específica da lista pelo seu ID.
 *
 * @param tarefas Lista atual de tarefas
 * @param id Identificador da tarefa a ser removida
 * @returns Nova lista sem a tarefa especificada
 */
export function removerTarefa(tarefas: Task[], id: string): Task[] {
  return tarefas.filter((tarefa) => tarefa.id !== id);
}

/**
 * Filtra a lista de tarefas com base no critério selecionado.
 *
 * @param tarefas Lista completa de tarefas
 * @param filtro Critério ('todas' | 'pendentes' | 'concluidas')
 * @returns Lista filtrada correspondente
 */
export function filtrarTarefas(tarefas: Task[], filtro: TaskFilter): Task[] {
  switch (filtro) {
    case 'pendentes':
      return tarefas.filter((t) => !t.concluida);
    case 'concluidas':
      return tarefas.filter((t) => t.concluida);
    case 'todas':
    default:
      return tarefas;
  }
}

/**
 * Calcula estatísticas gerais de progresso da lista de tarefas.
 *
 * @param tarefas Lista de tarefas
 * @returns Objeto com contadores e porcentagem de progresso
 */
export function calcularEstatisticas(tarefas: Task[]): TaskStats {
  const total = tarefas.length;
  const concluidas = tarefas.filter((t) => t.concluida).length;
  const pendentes = total - concluidas;
  const percentualConcluido = total === 0 ? 0 : Math.round((concluidas / total) * 100);

  return {
    total,
    pendentes,
    concluidas,
    percentualConcluido,
  };
}

/**
 * Remove em lote todas as tarefas marcadas como concluídas,
 * mantendo somente as pendentes.
 *
 * @param tarefas Lista de tarefas
 * @returns Nova lista contendo apenas tarefas pendentes
 */
export function limparConcluidas(tarefas: Task[]): Task[] {
  return tarefas.filter((t) => !t.concluida);
}

