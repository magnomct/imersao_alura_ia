/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import {
  Calculator as CalculatorIcon,
  Equal,
  RotateCcw,
  AlertTriangle,
  ArrowRight,
  Terminal,
  Sparkles,
  CheckCircle2,
} from 'lucide-react';
import { runCalculator, CalculatorResult } from '../utils/calculator-simulator';

interface SimpleCalculatorProps {
  onOpenTutorMode: () => void;
}

export const SimpleCalculator: React.FC<SimpleCalculatorProps> = ({ onOpenTutorMode }) => {
  const [num1, setNum1] = useState<string>('10');
  const [operacao, setOperacao] = useState<string>('+');
  const [num2, setNum2] = useState<string>('5');
  const [result, setResult] = useState<CalculatorResult | null>(() => {
    return runCalculator(10, '+', 5);
  });

  const handleCalculate = () => {
    const n1 = parseFloat(num1) || 0;
    const n2 = parseFloat(num2) || 0;
    const res = runCalculator(n1, operacao, n2);
    setResult(res);
  };

  const handleReset = () => {
    setNum1('');
    setOperacao('+');
    setNum2('');
    setResult(null);
  };

  const applyPreset = (n1: string, op: string, n2: string) => {
    setNum1(n1);
    setOperacao(op);
    setNum2(n2);
    const res = runCalculator(parseFloat(n1) || 0, op, parseFloat(n2) || 0);
    setResult(res);
  };

  return (
    <div className="max-w-xl mx-auto space-y-6">
      {/* Introduction Card */}
      <div className="text-center space-y-2">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-medium">
          <CalculatorIcon className="w-3.5 h-3.5" />
          <span>Calculadora Direta • As 4 Operações Básicas</span>
        </div>
        <h2 className="text-2xl font-bold text-white tracking-tight">
          Calculadora Simples
        </h2>
        <p className="text-xs text-slate-400 max-w-md mx-auto">
          Digite os dois números, selecione a operação desejada e clique em calcular. Os outros menus de código e explicações podem ser abertos a qualquer momento.
        </p>
      </div>

      {/* Calculator Body */}
      <div className="bg-slate-900 border border-slate-700/80 rounded-3xl p-6 shadow-2xl relative overflow-hidden">
        {/* Subtle accent glow */}
        <div className="absolute top-0 right-0 -mr-16 -mt-16 w-40 h-40 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 -ml-16 -mb-16 w-40 h-40 bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />

        {/* Inputs & Operator */}
        <div className="space-y-4 relative z-10">
          <div className="grid grid-cols-1 sm:grid-cols-5 gap-3 items-center">
            {/* Número 1 */}
            <div className="sm:col-span-2">
              <label
                htmlFor="simple-num1"
                className="block text-xs font-semibold text-slate-300 mb-1.5"
              >
                1º Número:
              </label>
              <input
                id="simple-num1"
                type="number"
                step="any"
                value={num1}
                onChange={(e) => setNum1(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleCalculate()}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2.5 text-base text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 font-mono shadow-inner"
                placeholder="Ex: 10"
              />
            </div>

            {/* Operação */}
            <div className="sm:col-span-1 flex flex-col items-center">
              <span className="block text-xs font-semibold text-slate-300 mb-1.5">
                Op:
              </span>
              <div className="grid grid-cols-2 gap-1 w-full max-w-[80px]">
                {['+', '-', '*', '/'].map((op) => (
                  <button
                    key={op}
                    type="button"
                    onClick={() => setOperacao(op)}
                    className={`h-9 text-base font-bold font-mono rounded-lg border transition-all cursor-pointer ${
                      operacao === op
                        ? 'bg-purple-500 text-white border-purple-400 shadow-md shadow-purple-500/30 scale-105'
                        : 'bg-slate-950 text-slate-400 border-slate-800 hover:border-slate-700 hover:text-white'
                    }`}
                    aria-label={`Operação ${op}`}
                  >
                    {op}
                  </button>
                ))}
              </div>
            </div>

            {/* Número 2 */}
            <div className="sm:col-span-2">
              <label
                htmlFor="simple-num2"
                className="block text-xs font-semibold text-slate-300 mb-1.5"
              >
                2º Número:
              </label>
              <input
                id="simple-num2"
                type="number"
                step="any"
                value={num2}
                onChange={(e) => setNum2(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleCalculate()}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2.5 text-base text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 font-mono shadow-inner"
                placeholder="Ex: 5"
              />
            </div>
          </div>

          {/* Quick Preset Buttons */}
          <div className="flex flex-wrap items-center justify-center gap-1.5 pt-1 text-xs">
            <span className="text-slate-400 text-[11px] mr-1">Atalhos:</span>
            <button
              onClick={() => applyPreset('10', '+', '5')}
              className="px-2.5 py-1 rounded-lg bg-slate-800/80 hover:bg-slate-750 text-slate-300 border border-slate-700 text-[11px] transition-colors cursor-pointer"
            >
              10 + 5
            </button>
            <button
              onClick={() => applyPreset('50', '-', '18')}
              className="px-2.5 py-1 rounded-lg bg-slate-800/80 hover:bg-slate-750 text-slate-300 border border-slate-700 text-[11px] transition-colors cursor-pointer"
            >
              50 - 18
            </button>
            <button
              onClick={() => applyPreset('7', '*', '6')}
              className="px-2.5 py-1 rounded-lg bg-slate-800/80 hover:bg-slate-750 text-slate-300 border border-slate-700 text-[11px] transition-colors cursor-pointer"
            >
              7 * 6
            </button>
            <button
              onClick={() => applyPreset('100', '/', '4')}
              className="px-2.5 py-1 rounded-lg bg-slate-800/80 hover:bg-slate-750 text-slate-300 border border-slate-700 text-[11px] transition-colors cursor-pointer"
            >
              100 / 4
            </button>
            <button
              onClick={() => applyPreset('15', '/', '0')}
              className="px-2.5 py-1 rounded-lg bg-rose-950/50 hover:bg-rose-900/60 text-rose-300 border border-rose-800/60 text-[11px] transition-colors flex items-center gap-1 cursor-pointer"
            >
              <AlertTriangle className="w-3 h-3 text-rose-400" />
              15 / 0 (Divisão por Zero)
            </button>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-3 pt-2">
            <button
              onClick={handleCalculate}
              className="flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-xl font-semibold text-sm bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 shadow-lg shadow-emerald-500/20 transition-all cursor-pointer"
            >
              <Equal className="w-4 h-4 stroke-[2.5]" />
              <span>Calcular Resultado</span>
            </button>

            <button
              onClick={handleReset}
              className="flex items-center justify-center gap-1.5 py-3 px-4 rounded-xl font-medium text-xs bg-slate-800 hover:bg-slate-750 text-slate-300 border border-slate-700 transition-colors cursor-pointer"
              title="Limpar campos"
              aria-label="Limpar campos"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Limpar</span>
            </button>
          </div>

          {/* Display Result Box */}
          {result && (
            <div
              className={`mt-4 p-4 rounded-2xl border transition-all ${
                result.success
                  ? 'bg-emerald-950/30 border-emerald-500/40 text-emerald-100'
                  : 'bg-rose-950/30 border-rose-500/40 text-rose-100'
              }`}
            >
              <div className="flex items-center justify-between text-xs mb-1">
                <span className="text-slate-400 uppercase tracking-wider font-semibold text-[10px]">
                  {result.success ? 'Resultado Calculado' : 'Aviso do Sistema'}
                </span>
                <span className="font-mono text-[11px] px-2 py-0.5 rounded bg-slate-950/60 text-slate-300">
                  {num1 || '0'} {operacao} {num2 || '0'}
                </span>
              </div>

              {result.success ? (
                <div className="flex items-baseline gap-2 mt-1">
                  <span className="text-3xl font-extrabold font-mono text-white">
                    {result.resultado}
                  </span>
                  <span className="text-xs text-emerald-400 flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" /> Sucesso
                  </span>
                </div>
              ) : (
                <div className="mt-1 flex items-start gap-2 text-rose-300 text-sm font-medium">
                  <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                  <span>{result.errorMessage}</span>
                </div>
              )}
            </div>
          )}

          {/* Simulated Terminal Output */}
          {result && (
            <div className="bg-slate-950 border border-slate-800 rounded-2xl overflow-hidden font-mono text-xs">
              <div className="flex items-center justify-between px-3 py-1.5 bg-slate-900 border-b border-slate-800 text-slate-400 text-[11px]">
                <div className="flex items-center gap-1.5">
                  <Terminal className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Saída no Terminal Python (print)</span>
                </div>
                <span className="text-[10px] text-slate-500">python calculadora.py</span>
              </div>
              <div className="p-3 space-y-0.5 max-h-32 overflow-y-auto">
                {result.outputLines.map((line, idx) => (
                  <div
                    key={idx}
                    className={
                      line.startsWith('Erro:')
                        ? 'text-rose-400 font-semibold'
                        : line.startsWith('===')
                        ? 'text-amber-400'
                        : line.startsWith('Digite')
                        ? 'text-cyan-300'
                        : 'text-emerald-300 font-medium'
                    }
                  >
                    {line}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Callout Banner to unlock / view the other menus */}
      <div className="bg-gradient-to-r from-indigo-950/40 via-purple-950/30 to-slate-900 border border-purple-500/30 rounded-2xl p-5 shadow-xl flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-start gap-3">
          <div className="p-2.5 rounded-xl bg-purple-500/20 text-purple-300 shrink-0">
            <Sparkles className="w-5 h-5" />
          </div>
          <div className="space-y-0.5 text-center sm:text-left">
            <h3 className="text-sm font-bold text-white">
              Quer ver como essa calculadora funciona por dentro?
            </h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              Ative o <strong>Modo Tutor</strong> para visualizar o código Python linha a linha, o simulador de memória RAM, o guia de conceitos e o quiz.
            </p>
          </div>
        </div>

        <button
          onClick={onOpenTutorMode}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold bg-purple-500 hover:bg-purple-400 text-white shadow-lg shadow-purple-500/20 transition-all shrink-0 cursor-pointer"
        >
          <span>Abrir Outros Menus (Modo Tutor)</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
