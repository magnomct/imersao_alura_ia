/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import {
  Layers,
  Variable,
  GitBranch,
  ShieldAlert,
  ChevronDown,
  ChevronUp,
  CheckCircle2,
  Code2,
  ArrowDown,
} from 'lucide-react';

export const ConceptExplainer: React.FC = () => {
  const [openSection, setOpenSection] = useState<number | null>(1);

  const toggleSection = (id: number) => {
    setOpenSection(openSection === id ? null : id);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 text-slate-200">
      {/* Intro Banner */}
      <div className="bg-gradient-to-r from-emerald-950/40 via-slate-900 to-slate-900 border border-emerald-500/30 rounded-2xl p-6 shadow-xl">
        <div className="flex items-start gap-4">
          <div className="p-3 rounded-2xl bg-emerald-500/20 text-emerald-400 shrink-0">
            <Layers className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-white mb-2">
              Guia do Tutor: Os 4 Pilares da Calculadora em Python
            </h2>
            <p className="text-sm text-slate-300 leading-relaxed">
              Parabéns por dar os primeiros passos! Programar nada mais é do que dar uma
              sequência de ordens precisas para o computador. Para criar essa calculadora,
              utilizamos os quatro conceitos fundamentais de qualquer software:
              <strong className="text-emerald-400"> instruções sequenciais</strong>,
              <strong className="text-cyan-400"> variáveis</strong>,
              <strong className="text-purple-400"> estruturas condicionais</strong> e
              <strong className="text-rose-400"> prevenção de erros</strong>.
            </p>
          </div>
        </div>
      </div>

      {/* Accordion / Detailed Sections */}
      <div className="space-y-4">
        {/* Componente 1: Instruções e Sequência Lógica */}
        <div className="bg-slate-900 border border-slate-700/80 rounded-2xl overflow-hidden shadow-lg transition-all">
          <button
            onClick={() => toggleSection(1)}
            className="w-full px-6 py-4 flex items-center justify-between bg-slate-850 hover:bg-slate-800 transition-colors text-left"
            aria-expanded={openSection === 1}
          >
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold text-sm">
                1
              </div>
              <div>
                <h3 className="text-base font-semibold text-white">
                  Instruções e Fluxo Sequencial
                </h3>
                <p className="text-xs text-slate-400">
                  Como o computador lê e executa linha por linha de cima para baixo
                </p>
              </div>
            </div>
            {openSection === 1 ? (
              <ChevronUp className="w-5 h-5 text-slate-400" />
            ) : (
              <ChevronDown className="w-5 h-5 text-slate-400" />
            )}
          </button>

          {openSection === 1 && (
            <div className="p-6 border-t border-slate-800 space-y-4 text-sm leading-relaxed">
              <p>
                No Python, um programa é executado de forma <strong>sequencial</strong>:
                o interpretador lê a primeira linha, realiza a ação indicada, passa para a
                segunda linha, e assim por diante até o final do arquivo.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 my-2">
                <div className="bg-slate-950 p-4 rounded-xl border border-slate-800">
                  <h4 className="text-xs font-bold text-emerald-400 uppercase tracking-wide mb-2 flex items-center gap-1.5">
                    <Code2 className="w-4 h-4" /> Comentários (#)
                  </h4>
                  <p className="text-xs text-slate-300">
                    Qualquer linha que comece com <code className="text-emerald-400">#</code> é ignorada pelo Python.
                    Eles servem exclusivamente para que nós, seres humanos, expliquemos o que cada instrução faz.
                  </p>
                </div>

                <div className="bg-slate-950 p-4 rounded-xl border border-slate-800">
                  <h4 className="text-xs font-bold text-cyan-400 uppercase tracking-wide mb-2 flex items-center gap-1.5">
                    <Code2 className="w-4 h-4" /> A Função print(...)
                  </h4>
                  <p className="text-xs text-slate-300">
                    O comando <code className="text-cyan-400">print()</code> é a saída padrão do sistema.
                    Ele "imprime" o texto ou o resultado das contas no console para que o usuário possa ver.
                  </p>
                </div>
              </div>

              <div className="bg-slate-950/80 p-3 rounded-lg border-l-4 border-emerald-500 text-xs text-slate-300">
                <strong>Por que a ordem importa:</strong> Não podemos somar dois números antes de pedi-los ao usuário.
                Por isso, a captura dos dados acontece obrigatoriamente antes do teste da operação matemática.
              </div>
            </div>
          )}
        </div>

        {/* Componente 2: Variáveis e Conversão de Tipos */}
        <div className="bg-slate-900 border border-slate-700/80 rounded-2xl overflow-hidden shadow-lg transition-all">
          <button
            onClick={() => toggleSection(2)}
            className="w-full px-6 py-4 flex items-center justify-between bg-slate-850 hover:bg-slate-800 transition-colors text-left"
            aria-expanded={openSection === 2}
          >
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-cyan-500/20 text-cyan-400 flex items-center justify-center font-bold text-sm">
                2
              </div>
              <div>
                <h3 className="text-base font-semibold text-white">
                  Variáveis e Conversão de Tipos (input e float)
                </h3>
                <p className="text-xs text-slate-400">
                  Guardando valores na memória e transformando texto em números reais
                </p>
              </div>
            </div>
            {openSection === 2 ? (
              <ChevronUp className="w-5 h-5 text-slate-400" />
            ) : (
              <ChevronDown className="w-5 h-5 text-slate-400" />
            )}
          </button>

          {openSection === 2 && (
            <div className="p-6 border-t border-slate-800 space-y-4 text-sm leading-relaxed">
              <p>
                Uma <strong>variável</strong> funciona como uma caixinha com etiqueta na memória do computador,
                onde guardamos uma informação para consultar ou modificar mais tarde.
              </p>

              <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 font-mono text-xs text-slate-300 space-y-2">
                <div className="text-slate-400"># Exemplo do nosso código:</div>
                <div><span className="text-cyan-400 font-bold">numero1</span> = <span className="text-purple-400">float</span>(<span className="text-yellow-400">input</span>(<span className="text-amber-300">"Digite o primeiro número: "</span>))</div>
              </div>

              <div className="space-y-2.5">
                <h4 className="text-xs font-bold text-cyan-300 uppercase tracking-wider">
                  O que acontece nessa linha (de dentro para fora):
                </h4>
                <ul className="space-y-2 text-xs">
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
                    <span>
                      <strong>1. input(...)</strong>: Pausa a execução do programa e aguarda o usuário digitar algo no teclado.
                      Atenção: o <code className="text-yellow-400">input()</code> <em>sempre</em> devolve o dado como texto (<code className="text-amber-300">str</code>).
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
                    <span>
                      <strong>2. float(...)</strong>: Converte o texto digitado (ex: <code className="text-amber-300">"10.5"</code>)
                      em um número decimal real (<code className="text-emerald-400">10.5</code>).
                      Sem o <code className="text-purple-400">float()</code>, se somássemos "5" + "5", o Python juntaria os textos resultando em "55" em vez de 10!
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
                    <span>
                      <strong>3. O sinal =</strong>: É o operador de atribuição. Ele pega o valor final convertido à direita e armazena na variável à esquerda (<code className="text-cyan-400">numero1</code>).
                    </span>
                  </li>
                </ul>
              </div>
            </div>
          )}
        </div>

        {/* Componente 3: Estruturas Condicionais (if / elif / else) */}
        <div className="bg-slate-900 border border-slate-700/80 rounded-2xl overflow-hidden shadow-lg transition-all">
          <button
            onClick={() => toggleSection(3)}
            className="w-full px-6 py-4 flex items-center justify-between bg-slate-850 hover:bg-slate-800 transition-colors text-left"
            aria-expanded={openSection === 3}
          >
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-purple-500/20 text-purple-400 flex items-center justify-center font-bold text-sm">
                3
              </div>
              <div>
                <h3 className="text-base font-semibold text-white">
                  Estruturas Condicionais: Tomada de Decisão (if, elif, else)
                </h3>
                <p className="text-xs text-slate-400">
                  Como o computador decide qual cálculo realizar com base na escolha do usuário
                </p>
              </div>
            </div>
            {openSection === 3 ? (
              <ChevronUp className="w-5 h-5 text-slate-400" />
            ) : (
              <ChevronDown className="w-5 h-5 text-slate-400" />
            )}
          </button>

          {openSection === 3 && (
            <div className="p-6 border-t border-slate-800 space-y-4 text-sm leading-relaxed">
              <p>
                Nem sempre queremos rodar todas as linhas. Uma calculadora precisa decidir se vai somar, subtrair, multiplicar ou dividir.
                Para isso usamos o teste de condições:
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800">
                  <div className="text-purple-400 font-bold font-mono text-xs mb-1">if (Se...)</div>
                  <p className="text-xs text-slate-300">
                    Testa a primeira condição: <code className="text-amber-300">operacao == "+"</code>. Se for verdade, executa o bloco indentado.
                  </p>
                </div>
                <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800">
                  <div className="text-purple-400 font-bold font-mono text-xs mb-1">elif (Senão se...)</div>
                  <p className="text-xs text-slate-300">
                    Se a anterior foi falsa, testa a próxima (<code className="text-amber-300">"-"</code>, <code className="text-amber-300">"*"</code>, <code className="text-amber-300">"/"</code>).
                  </p>
                </div>
                <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800">
                  <div className="text-purple-400 font-bold font-mono text-xs mb-1">else (Senão...)</div>
                  <p className="text-xs text-slate-300">
                    Rede de segurança final: se nenhuma das opções válidas foi digitada, executa a mensagem de erro.
                  </p>
                </div>
              </div>

              {/* Crucial distinction: = vs == */}
              <div className="bg-amber-950/20 border border-amber-500/30 rounded-xl p-4 space-y-2">
                <h4 className="text-xs font-bold text-amber-300 uppercase tracking-wide flex items-center gap-1.5">
                  Atenção para Iniciantes: Diferença entre = e ==
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div className="bg-slate-950 p-2.5 rounded-lg border border-slate-800">
                    <span className="font-mono text-amber-400 font-bold">= (Atribuição)</span>
                    <p className="text-slate-300 mt-1">
                      Guarda um valor na variável. Ex: <code className="text-emerald-300">numero1 = 10</code> (coloque 10 dentro de numero1).
                    </p>
                  </div>
                  <div className="bg-slate-950 p-2.5 rounded-lg border border-slate-800">
                    <span className="font-mono text-amber-400 font-bold">== (Comparação)</span>
                    <p className="text-slate-300 mt-1">
                      Faz uma pergunta: "esses dois valores são iguais?". Ex: <code className="text-emerald-300">operacao == "+"</code>. Devolve True ou False.
                    </p>
                  </div>
                </div>
              </div>

              {/* Indentation explanation */}
              <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 text-xs space-y-2">
                <span className="font-bold text-slate-200">Por que o código dentro do if fica "empurrado" para a direita?</span>
                <p className="text-slate-300">
                  Isso se chama <strong>indentação</strong> (4 espaços). No Python, a indentação diz ao computador quais linhas pertencem àquele bloco de decisão. Se a condição for falsa, o Python pula tudo o que estiver indentado dentro dela!
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Componente 4: Tratamento de Exceção (Divisão por Zero) */}
        <div className="bg-slate-900 border border-slate-700/80 rounded-2xl overflow-hidden shadow-lg transition-all">
          <button
            onClick={() => toggleSection(4)}
            className="w-full px-6 py-4 flex items-center justify-between bg-slate-850 hover:bg-slate-800 transition-colors text-left"
            aria-expanded={openSection === 4}
          >
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-rose-500/20 text-rose-400 flex items-center justify-center font-bold text-sm">
                4
              </div>
              <div>
                <h3 className="text-base font-semibold text-white">
                  Prevenção de Erros: Divisão por Zero
                </h3>
                <p className="text-xs text-slate-400">
                  Evitando que o programa quebre com uma verificação defensiva
                </p>
              </div>
            </div>
            {openSection === 4 ? (
              <ChevronUp className="w-5 h-5 text-slate-400" />
            ) : (
              <ChevronDown className="w-5 h-5 text-slate-400" />
            )}
          </button>

          {openSection === 4 && (
            <div className="p-6 border-t border-slate-800 space-y-4 text-sm leading-relaxed">
              <p>
                Na matemática, a divisão de qualquer número por zero é uma <em>indeterminação</em>.
                Se dissermos ao Python para calcular <code className="text-rose-400">10 / 0</code> diretamente, ele interrompe o programa de forma abrupta com um erro chamado <strong>ZeroDivisionError</strong>.
              </p>

              <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 font-mono text-xs text-slate-300 space-y-2">
                <div className="text-slate-400"># Nossa solução defensiva e elegante:</div>
                <div><span className="text-purple-400">elif</span> operacao == <span className="text-amber-300">"/"</span>:</div>
                <div className="pl-4"><span className="text-purple-400">if</span> numero2 == <span className="text-emerald-400">0</span>:</div>
                <div className="pl-8"><span className="text-cyan-400">print</span>(<span className="text-rose-400">"Erro: Não é possível dividir um número por zero!"</span>)</div>
                <div className="pl-4"><span className="text-purple-400">else</span>:</div>
                <div className="pl-8">resultado = numero1 / numero2</div>
              </div>

              <div className="flex items-start gap-3 bg-rose-950/20 border border-rose-500/30 p-4 rounded-xl text-xs text-slate-300">
                <ShieldAlert className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
                <div>
                  <strong>Boas práticas de software:</strong> Verificar as entradas antes de processá-las é um dos hábitos mais importantes de um bom programador. O usuário recebe uma mensagem clara e amigável em vez de uma tela cheia de mensagens de erro misteriosas.
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
