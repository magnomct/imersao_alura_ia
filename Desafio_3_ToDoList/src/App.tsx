/**
 * @license
 * SPDX-License-Identifier: MIT
 * Copyright (c) 2026 Carlos Magno
 *
 * Aplicação Principal: Gerenciador de Tarefas (Desafio 3 • Imersão IA Alura)
 */

import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { TaskInput } from './components/TaskInput';
import { TaskFilters } from './components/TaskFilters';
import { TaskList } from './components/TaskList';
import { DidacticExplanation } from './components/DidacticExplanation';
import { Footer } from './components/Footer';
import { Task, TaskFilter, TaskPriority } from './types/todo';
import {
  adicionarTarefa,
  alternarStatusTarefa,
  removerTarefa,
  filtrarTarefas,
  calcularEstatisticas,
  limparConcluidas,
} from './utils/todo-engine';
import { Check } from 'lucide-react';

const STORAGE_KEY = 'desafio3_todo_list_data';

// Tarefas iniciais didáticas para o usuário já visualizar os estados de imediato
const TAREFAS_INICIAIS: Task[] = [
  {
    id: '1',
    titulo: 'Estudar lógica sequencial e condições em Python (Desafio 1)',
    concluida: true,
    criadaEm: '09:00',
    concluidaEm: '09:45',
    prioridade: 'alta',
  },
  {
    id: '2',
    titulo: 'Construir a Calculadora Científica e Well-Architected Framework (Desafio 2)',
    concluida: true,
    criadaEm: '10:00',
    concluidaEm: '11:15',
    prioridade: 'alta',
  },
  {
    id: '3',
    titulo: 'Desenvolver a Lista de Tarefas com interação de estado visual (Desafio 3)',
    concluida: false,
    criadaEm: '14:00',
    prioridade: 'media',
  },
  {
    id: '4',
    titulo: 'Testar e comprovar a melhoria visual nas tarefas concluídas',
    concluida: false,
    criadaEm: '14:30',
    prioridade: 'alta',
  },
];

export default function App() {
  // Estado das tarefas persistido no localStorage
  const [tasks, setTasks] = useState<Task[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) return JSON.parse(saved);
    } catch {
      // Ignora falhas de leitura
    }
    return TAREFAS_INICIAIS;
  });

  const [currentFilter, setCurrentFilter] = useState<TaskFilter>('todas');
  const [showGuide, setShowGuide] = useState<boolean>(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Sincroniza tarefas no localStorage a cada alteração
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
    } catch {
      // Ignora quotas de storage
    }
  }, [tasks]);

  const showToast = (message: string) => {
    setToastMessage(message);
    setTimeout(() => {
      setToastMessage(null);
    }, 2800);
  };

  // 1. Adicionar Tarefa
  const handleAddTask = (titulo: string, prioridade: TaskPriority) => {
    const atualizadas = adicionarTarefa(tasks, titulo, prioridade);
    setTasks(atualizadas);
    showToast('Tarefa adicionada com sucesso!');
  };

  // 2. Alternar Conclusão (Pendente <-> Concluída)
  const handleToggleTask = (id: string) => {
    const tarefaAlvo = tasks.find((t) => t.id === id);
    const atualizadas = alternarStatusTarefa(tasks, id);
    setTasks(atualizadas);

    if (tarefaAlvo) {
      if (!tarefaAlvo.concluida) {
        showToast('Parabéns! Tarefa marcada como concluída! 🎉');
      } else {
        showToast('Tarefa retornada para pendente.');
      }
    }
  };

  // 3. Remover Tarefa
  const handleRemoveTask = (id: string) => {
    const atualizadas = removerTarefa(tasks, id);
    setTasks(atualizadas);
    showToast('Tarefa removida da lista.');
  };

  // 4. Limpar Concluídas
  const handleClearCompleted = () => {
    const atualizadas = limparConcluidas(tasks);
    setTasks(atualizadas);
    showToast('Todas as tarefas concluídas foram limpas!');
  };

  const stats = calcularEstatisticas(tasks);
  const filteredTasks = filtrarTarefas(tasks, currentFilter);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
      {/* Toast Notification Flutuante */}
      {toastMessage && (
        <div
          role="status"
          aria-live="polite"
          className="fixed bottom-6 right-6 z-50 flex items-center gap-2 bg-emerald-500 text-slate-950 px-4 py-2.5 rounded-xl font-bold text-xs shadow-2xl shadow-emerald-500/30 animate-in fade-in slide-in-from-bottom-2"
        >
          <Check className="w-4 h-4 stroke-[3]" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Header com Estatísticas */}
      <Header
        stats={stats}
        showGuide={showGuide}
        onToggleGuide={() => setShowGuide((prev) => !prev)}
      />

      {/* Conteúdo Principal */}
      <main className="flex-1 max-w-4xl w-full mx-auto px-4 sm:px-6 py-6 space-y-6">
        {/* Painel Didático (Alternável) */}
        {showGuide && <DidacticExplanation />}

        {/* Formulário de Nova Tarefa */}
        <section aria-label="Adicionar nova tarefa">
          <TaskInput onAddTask={handleAddTask} />
        </section>

        {/* Filtros e Ações em Lote */}
        <section aria-label="Filtros de tarefas">
          <TaskFilters
            currentFilter={currentFilter}
            onFilterChange={setCurrentFilter}
            stats={stats}
            onClearCompleted={handleClearCompleted}
          />
        </section>

        {/* Lista de Tarefas com Melhoria Visual */}
        <section aria-label="Lista de atividades">
          <TaskList
            tasks={filteredTasks}
            currentFilter={currentFilter}
            onToggle={handleToggleTask}
            onRemove={handleRemoveTask}
          />
        </section>
      </main>

      {/* Rodapé com Autoria e Licença MIT */}
      <Footer />
    </div>
  );
}

