/**
 * @license
 * SPDX-License-Identifier: MIT
 * Copyright (c) 2026 Carlos Magno
 *
 * Componente Didático: Explica a arquitetura de componentes, o gerenciamento de estado
 * e o mecanismo exato da melhoria visual das tarefas concluídas.
 */

import React from 'react';
import { Layers, Eye, Cpu, Database, Check, ShieldCheck } from 'lucide-react';

export const DidacticExplanation: React.FC = () => {
  return (
    <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-2xl space-y-6 animate-in fade-in">
      <div className="flex items-center gap-2.5 pb-4 border-b border-slate-800">
        <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
          <Layers className="w-5 h-5" />
        </div>
        <div>
          <h2 className="text-base font-bold text-white">
            Guia Didático da Arquitetura & Melhoria Visual
          </h2>
          <p className="text-xs text-slate-400">
            Compreenda como o estado reativo interage com os componentes e o CSS
          </p>
        </div>
      </div>

      {/* Grid de 3 Pilares Didáticos */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Pilar 1: Fluxo de Estado */}
        <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800/80 space-y-2">
          <div className="flex items-center gap-2 text-xs font-bold text-emerald-400">
            <Cpu className="w-4 h-4" />
            <span>1. Fluxo Unidirecional de Estado</span>
          </div>
          <p className="text-xs text-slate-400 leading-relaxed">
            O React mantém uma única fonte da verdade (<code className="text-emerald-300 font-mono">tasks</code> via hook <code className="text-emerald-300 font-mono">useState</code>). Quando o usuário clica em concluir, disparase uma função pura que cria um novo array imutável, disparando a re-renderização.
          </p>
        </div>

        {/* Pilar 2: Melhoria Visual */}
        <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800/80 space-y-2">
          <div className="flex items-center gap-2 text-xs font-bold text-teal-400">
            <Eye className="w-4 h-4" />
            <span>2. Renderização Condicional</span>
          </div>
          <p className="text-xs text-slate-400 leading-relaxed">
            O componente <code className="text-teal-300 font-mono">TaskItem</code> lê a propriedade booleana <code className="text-teal-300 font-mono">task.concluida</code> e aplica dinamicamente classes CSS (riscado, cor suave e checkmark).
          </p>
        </div>

        {/* Pilar 3: Persistência Local */}
        <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800/80 space-y-2">
          <div className="flex items-center gap-2 text-xs font-bold text-cyan-400">
            <Database className="w-4 h-4" />
            <span>3. Persistência Resiliente</span>
          </div>
          <p className="text-xs text-slate-400 leading-relaxed">
            Um hook <code className="text-cyan-300 font-mono">useEffect</code> sincroniza automaticamente o array com o <code className="text-cyan-300 font-mono">localStorage</code> do navegador. Se você recarregar a página, suas tarefas e estados permanecem salvos!
          </p>
        </div>
      </div>

      {/* Tabela de Classes da Melhoria Visual */}
      <div className="space-y-3">
        <h3 className="text-xs font-bold text-slate-200 uppercase tracking-wider">
          Mapeamento Exato da Melhoria Visual (TaskItem.tsx)
        </h3>

        <div className="overflow-x-auto rounded-2xl border border-slate-800 bg-slate-950">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-900/80 border-b border-slate-800 text-slate-400 font-semibold">
              <tr>
                <th className="p-3">Elemento Visual</th>
                <th className="p-3">Estado: Pendente</th>
                <th className="p-3 text-emerald-400">Estado: Concluída (Melhoria)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 font-mono text-[11px] text-slate-300">
              <tr>
                <td className="p-3 font-sans font-medium text-slate-200">Texto do Título</td>
                <td className="p-3 text-slate-300">text-slate-100 font-medium</td>
                <td className="p-3 text-emerald-300 font-bold">line-through text-slate-400 decoration-emerald-500</td>
              </tr>
              <tr>
                <td className="p-3 font-sans font-medium text-slate-200">Container da Tarefa</td>
                <td className="p-3 text-slate-300">opacity-100 bg-slate-900</td>
                <td className="p-3 text-emerald-300 font-bold">opacity-70 bg-slate-900/40</td>
              </tr>
              <tr>
                <td className="p-3 font-sans font-medium text-slate-200">Ícone Checkbox</td>
                <td className="p-3 text-slate-300">border-slate-600 (vazio)</td>
                <td className="p-3 text-emerald-300 font-bold">bg-emerald-500 + &lt;Check /&gt;</td>
              </tr>
              <tr>
                <td className="p-3 font-sans font-medium text-slate-200">Badge de Horário</td>
                <td className="p-3 text-amber-300">Criada às [HH:MM]</td>
                <td className="p-3 text-emerald-300 font-bold">Concluída às [HH:MM]</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

