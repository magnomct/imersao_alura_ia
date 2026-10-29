/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { HelpCircle, CheckCircle, XCircle, Award, Sparkles, Terminal, ChevronRight } from 'lucide-react';

interface Question {
  id: number;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

const QUIZ_QUESTIONS: Question[] = [
  {
    id: 1,
    question: 'Por que precisamos usar float(input(...)) ao invés de apenas input(...) para os números?',
    options: [
      'Porque o Python não aceita guardar variáveis sem float.',
      'Porque a função input() sempre lê dados como texto (str), e o float() converte para número permitindo contas matemáticas.',
      'Porque float() faz o programa rodar mais rápido.',
      'Porque o input() só aceita números inteiros por padrão.',
    ],
    correctIndex: 1,
    explanation: 'Correto! O input() sempre retorna uma string (texto). Sem converter com float(), tentar somar "5" + "3" resultaria no texto "53" (concatenação) em vez da soma matemática 8!',
  },
  {
    id: 2,
    question: 'No código da calculadora, qual a diferença entre o símbolo = e o símbolo ==?',
    options: [
      'Eles são sinônimos e podem ser trocados a qualquer momento.',
      'O = é para operações matemáticas e o == é para texto.',
      'O = atribui (guarda) um valor em uma variável, enquanto o == compara se dois valores são iguais.',
      'O == só pode ser usado dentro de loops (laços de repetição).',
    ],
    correctIndex: 2,
    explanation: 'Exatamente! numero1 = 10 está "guardando" 10 na variável. Já operacao == "+" está "perguntando" se o conteúdo da variável é igual ao texto "+".',
  },
  {
    id: 3,
    question: 'O que aconteceria no Python se não tivéssemos feito a verificação "if numero2 == 0:" na divisão?',
    options: [
      'O Python retornaria o número 0 como resultado automaticamente.',
      'O programa travaria gerando uma exceção de erro chamada ZeroDivisionError.',
      'O computador reiniciaria por falta de memória.',
      'A divisão funcionaria normalmente retornando infinito.',
    ],
    correctIndex: 1,
    explanation: 'Muito bem! Em matemática e na computação, dividir por zero é impossível. O Python lançaria um ZeroDivisionError e o programa seria interrompido na hora.',
  },
  {
    id: 4,
    question: 'Por que usamos a estrutura "if ... elif ... else" em vez de apenas vários "if" independentes?',
    options: [
      'Porque os comandos elif só são testados se as condições anteriores forem falsas, economizando processamento e garantindo exclusividade.',
      'Porque o Python proíbe escrever mais de um if no mesmo arquivo.',
      'Porque sem elif o programa não conseguiria imprimir textos.',
      'Porque o if só funciona para soma (+).',
    ],
    correctIndex: 0,
    explanation: 'Perfeito! Se a operação for "+", o Python executa a soma e pula imediatamente todos os elif restantes, tornando o fluxo de decisão limpo e eficiente!',
  },
];

export const QuizAndChallenges: React.FC = () => {
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, number>>({});
  const [showResults, setShowResults] = useState<Record<number, boolean>>({});

  const handleSelectOption = (questionId: number, optionIndex: number) => {
    setSelectedAnswers((prev) => ({ ...prev, [questionId]: optionIndex }));
    setShowResults((prev) => ({ ...prev, [questionId]: true }));
  };

  const resetQuiz = () => {
    setSelectedAnswers({});
    setShowResults({});
  };

  const answeredCount = Object.keys(selectedAnswers).length;
  const correctCount = Object.entries(selectedAnswers).filter(
    ([qId, ans]) => ans === QUIZ_QUESTIONS.find((q) => q.id === Number(qId))?.correctIndex
  ).length;

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Quiz Section Header */}
      <div className="bg-slate-900 border border-slate-700/80 rounded-2xl p-6 shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <HelpCircle className="w-5 h-5 text-emerald-400" />
            <h2 className="text-lg font-bold text-white">
              Quiz Rápido: Fixação de Conceitos
            </h2>
          </div>
          <p className="text-xs text-slate-400">
            Teste seu entendimento sobre variáveis, comandos de entrada/saída e condições em Python.
          </p>
        </div>

        {answeredCount > 0 && (
          <div className="flex items-center gap-3 bg-slate-950 px-4 py-2 rounded-xl border border-slate-800">
            <Award className="w-5 h-5 text-amber-400" />
            <div className="text-xs">
              <span className="text-slate-400">Pontuação: </span>
              <strong className="text-emerald-400 font-bold font-mono">
                {correctCount} / {QUIZ_QUESTIONS.length}
              </strong>
            </div>
            <button
              onClick={resetQuiz}
              className="text-[11px] text-slate-400 hover:text-white underline ml-2 cursor-pointer"
            >
              Recomeçar
            </button>
          </div>
        )}
      </div>

      {/* Questions List */}
      <div className="space-y-4">
        {QUIZ_QUESTIONS.map((q, qIndex) => {
          const userAns = selectedAnswers[q.id];
          const isAnswered = showResults[q.id];
          const isCorrect = userAns === q.correctIndex;

          return (
            <div
              key={q.id}
              className="bg-slate-900 border border-slate-700/80 rounded-2xl p-5 shadow-lg space-y-3"
            >
              <div className="flex items-start gap-3">
                <span className="w-6 h-6 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-mono text-xs font-bold shrink-0 mt-0.5">
                  {qIndex + 1}
                </span>
                <h3 className="text-sm font-semibold text-white leading-relaxed">
                  {q.question}
                </h3>
              </div>

              <div className="space-y-2 pt-1 pl-9">
                {q.options.map((opt, optIndex) => {
                  let optStyle =
                    'bg-slate-950/70 border-slate-800 text-slate-300 hover:bg-slate-800 hover:border-slate-700';

                  if (isAnswered) {
                    if (optIndex === q.correctIndex) {
                      optStyle =
                        'bg-emerald-950/40 border-emerald-500/60 text-emerald-200 font-medium';
                    } else if (userAns === optIndex) {
                      optStyle =
                        'bg-rose-950/40 border-rose-500/60 text-rose-200';
                    } else {
                      optStyle = 'bg-slate-950/40 border-slate-800/40 text-slate-500';
                    }
                  }

                  return (
                    <button
                      key={optIndex}
                      disabled={isAnswered}
                      onClick={() => handleSelectOption(q.id, optIndex)}
                      className={`w-full text-left p-3 rounded-xl border text-xs transition-all flex items-center justify-between gap-3 ${optStyle}`}
                      aria-label={`Opção: ${opt}`}
                    >
                      <span>{opt}</span>
                      {isAnswered && optIndex === q.correctIndex && (
                        <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
                      )}
                      {isAnswered && userAns === optIndex && optIndex !== q.correctIndex && (
                        <XCircle className="w-4 h-4 text-rose-400 shrink-0" />
                      )}
                    </button>
                  );
                })}
              </div>

              {isAnswered && (
                <div
                  className={`mt-3 p-3.5 rounded-xl text-xs border ml-9 ${
                    isCorrect
                      ? 'bg-emerald-950/30 border-emerald-500/30 text-emerald-300'
                      : 'bg-rose-950/20 border-rose-500/30 text-rose-300'
                  }`}
                >
                  <p className="leading-relaxed">{q.explanation}</p>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Next Steps: Practical Challenges for the Student */}
      <div className="bg-gradient-to-r from-purple-950/30 via-slate-900 to-slate-900 border border-purple-500/30 rounded-2xl p-6 shadow-xl space-y-4">
        <div className="flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-purple-400" />
          <h3 className="text-base font-bold text-white">
            Desafios Práticos do Tutor para Você Experimentar
          </h3>
        </div>
        <p className="text-xs text-slate-300">
          Agora que você entendeu o funcionamento básico, tente abrir o Python no seu computador ou no Google Colab e faça essas pequenas modificações no código:
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-1">
          {/* Desafio 1 */}
          <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2">
            <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-purple-500/20 text-purple-300">
              Desafio 1: Potência
            </span>
            <h4 className="text-xs font-semibold text-white">
              Adicionar exponenciação (**)
            </h4>
            <p className="text-[11px] text-slate-400">
              Crie um novo <code className="text-purple-300">elif operacao == "**":</code> para calcular potências (ex: 2 elevado a 3 = 8).
            </p>
          </div>

          {/* Desafio 2 */}
          <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2">
            <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-cyan-500/20 text-cyan-300">
              Desafio 2: Formatação
            </span>
            <h4 className="text-xs font-semibold text-white">
              Arredondar o resultado (round)
            </h4>
            <p className="text-[11px] text-slate-400">
              Na divisão de 10 por 3, o resultado é 3.3333333333333335. Use a função <code className="text-cyan-300">round(resultado, 2)</code> para limitar a 2 casas decimais!
            </p>
          </div>

          {/* Desafio 3 */}
          <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2">
            <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300">
              Desafio 3: Resto da Divisão
            </span>
            <h4 className="text-xs font-semibold text-white">
              Operador Módulo (%)
            </h4>
            <p className="text-[11px] text-slate-400">
              Adicione a operação <code className="text-emerald-300">%</code> para descobrir o resto de uma divisão inteira (ex: 10 % 3 = 1).
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
