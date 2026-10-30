/**
 * @license
 * SPDX-License-Identifier: MIT
 * Copyright (c) 2026 Carlos Magno
 *
 * Suíte de Testes Unitários para o Motor Lógico da Lista de Tarefas (todo-engine)
 * Executado via Node Test Runner com TypeScript (tsx --test).
 */

import test from 'node:test';
import assert from 'node:assert/strict';
import {
  adicionarTarefa,
  alternarStatusTarefa,
  removerTarefa,
  filtrarTarefas,
  calcularEstatisticas,
  limparConcluidas,
} from './todo-engine.ts';
import { Task } from '../types/todo.ts';

test('adicionarTarefa deve inserir uma nova tarefa pendente no topo da lista', () => {
  const tarefasIniciais: Task[] = [];
  const resultado = adicionarTarefa(tarefasIniciais, 'Estudar lógica de programação', 'alta');

  assert.equal(resultado.length, 1);
  assert.equal(resultado[0].titulo, 'Estudar lógica de programação');
  assert.equal(resultado[0].concluida, false);
  assert.equal(resultado[0].prioridade, 'alta');
  assert.ok(resultado[0].id.length > 0);
  assert.ok(resultado[0].criadaEm.length > 0);
  assert.equal(resultado[0].concluidaEm, undefined);
});

test('adicionarTarefa deve limpar espaços em branco nas extremidades do título', () => {
  const resultado = adicionarTarefa([], '   Comprar café   ');
  assert.equal(resultado[0].titulo, 'Comprar café');
});

test('adicionarTarefa deve rejeitar títulos vazios ou compostos apenas por espaços', () => {
  assert.throws(() => {
    adicionarTarefa([], '');
  }, /O título da tarefa não pode estar vazio/);

  assert.throws(() => {
    adicionarTarefa([], '    ');
  }, /O título da tarefa não pode estar vazio/);
});

test('alternarStatusTarefa deve alternar de pendente para concluída com timestamp', () => {
  const tarefas: Task[] = [
    {
      id: 'task-1',
      titulo: 'Criar componente React',
      concluida: false,
      criadaEm: '10:00',
      prioridade: 'media',
    },
  ];

  const atualizado = alternarStatusTarefa(tarefas, 'task-1');
  assert.equal(atualizado[0].concluida, true);
  assert.ok(typeof atualizado[0].concluidaEm === 'string');
});

test('alternarStatusTarefa deve desmarcar tarefa concluída retornando para pendente', () => {
  const tarefas: Task[] = [
    {
      id: 'task-1',
      titulo: 'Revisar pull request',
      concluida: true,
      criadaEm: '09:00',
      concluidaEm: '09:30',
      prioridade: 'alta',
    },
  ];

  const atualizado = alternarStatusTarefa(tarefas, 'task-1');
  assert.equal(atualizado[0].concluida, false);
  assert.equal(atualizado[0].concluidaEm, undefined);
});

test('removerTarefa deve excluir a tarefa correspondente pelo ID', () => {
  const tarefas: Task[] = [
    { id: '1', titulo: 'Tarefa 1', concluida: false, criadaEm: '10:00', prioridade: 'baixa' },
    { id: '2', titulo: 'Tarefa 2', concluida: true, criadaEm: '10:05', prioridade: 'media' },
  ];

  const resultado = removerTarefa(tarefas, '1');
  assert.equal(resultado.length, 1);
  assert.equal(resultado[0].id, '2');
});

test('filtrarTarefas deve segregar tarefas por status (todas, pendentes, concluidas)', () => {
  const tarefas: Task[] = [
    { id: '1', titulo: 'T1', concluida: false, criadaEm: '10:00', prioridade: 'baixa' },
    { id: '2', titulo: 'T2', concluida: true, criadaEm: '10:05', prioridade: 'media' },
    { id: '3', titulo: 'T3', concluida: false, criadaEm: '10:10', prioridade: 'alta' },
  ];

  const todas = filtrarTarefas(tarefas, 'todas');
  const pendentes = filtrarTarefas(tarefas, 'pendentes');
  const concluidas = filtrarTarefas(tarefas, 'concluidas');

  assert.equal(todas.length, 3);
  assert.equal(pendentes.length, 2);
  assert.equal(concluidas.length, 1);
  assert.equal(concluidas[0].id, '2');
});

test('calcularEstatisticas deve retornar contagens exatas e percentual de progresso', () => {
  const tarefas: Task[] = [
    { id: '1', titulo: 'A', concluida: true, criadaEm: '10:00', prioridade: 'baixa' },
    { id: '2', titulo: 'B', concluida: true, criadaEm: '10:00', prioridade: 'media' },
    { id: '3', titulo: 'C', concluida: false, criadaEm: '10:00', prioridade: 'alta' },
    { id: '4', titulo: 'D', concluida: false, criadaEm: '10:00', prioridade: 'alta' },
  ];

  const stats = calcularEstatisticas(tarefas);
  assert.equal(stats.total, 4);
  assert.equal(stats.concluidas, 2);
  assert.equal(stats.pendentes, 2);
  assert.equal(stats.percentualConcluido, 50);

  // Lista vazia
  const statsVazio = calcularEstatisticas([]);
  assert.equal(statsVazio.total, 0);
  assert.equal(statsVazio.percentualConcluido, 0);
});

test('limparConcluidas deve reter unicamente tarefas pendentes', () => {
  const tarefas: Task[] = [
    { id: '1', titulo: 'Pendente 1', concluida: false, criadaEm: '10:00', prioridade: 'baixa' },
    { id: '2', titulo: 'Concluída 1', concluida: true, criadaEm: '10:00', prioridade: 'media' },
    { id: '3', titulo: 'Pendente 2', concluida: false, criadaEm: '10:00', prioridade: 'alta' },
  ];

  const resultado = limparConcluidas(tarefas);
  assert.equal(resultado.length, 2);
  assert.ok(resultado.every((t) => !t.concluida));
});

