/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import {
  Play,
  RotateCcw,
  SkipForward,
  FastForward,
  Cpu,
  Terminal as TerminalIcon,
  HelpCircle,
  AlertTriangle,
  Lightbulb,
} from 'lucide-react';
import {
  runCalculator,
  generateExecutionTrace,
  ExecutionStep,
  CalculatorState,
} from '../utils/calculator-simulator';

interface InteractiveSimulatorProps {
  onStepChange?: (lineNumber?: number) => void;
}

export const InteractiveSimulator: React.FC<InteractiveSimulatorProps> = ({
  onStepChange,
}) => {
  // Input states
  const [num1, setNum1] = useState<string>('10');
  const [operacao, setOperacao] = useState<string>('+');
  const [num2, setNum2] = useState<string>('5');

  // Execution states
  const [steps, setSteps] = useState<ExecutionStep[]>([]);
  const [currentStepIndex, setCurrentStepIndex] = useState<number>(-1);
  const [isPlayingAuto, setIsPlayingAuto] = useState<boolean>(false);
  const [autoSpeed, setAutoSpeed] = useState<number>(1200);

  // Terminal & Variable states
  const [terminalLines, setTerminalLines] = useState<string[]>([
    '# Terminal Python (Simulação)',
    '# Digite os valores acima e clique em "Executar" ou "Passo a Passo"',
  ]);
  const [liveVars, setLiveVars] = useState<CalculatorState>({});
  const [currentExplanation, setCurrentExplanation] = useState<string>(
    'Pronto para iniciar! Configure os números e a operação para ver o Python executando linha a linha.'
  );

  // Sync step change with parent for CodeViewer highlighting
  useEffect(() => {
    if (currentStepIndex >= 0 && currentStepIndex < steps.length) {
      const step = steps[currentStepIndex];
      onStepChange?.(step.lineNumber);
      setTerminalLines(step.terminalOutput);
      setLiveVars(step.variables);
      setCurrentExplanation(step.explanation);
    } else if (currentStepIndex === -1) {
      onStepChange?.(undefined);
    }
  }, [currentStepIndex, steps, onStepChange]);

  // Auto-play timer
  useEffect(() => {
    let timer: NodeJS.Timeout | null = null;
    if (isPlayingAuto && currentStepIndex < steps.length - 1) {
      timer = setTimeout(() => {
        setCurrentStepIndex((prev) => prev + 1);
      }, autoSpeed);
    } else if (isPlayingAuto && currentStepIndex >= steps.length - 1) {
      setIsPlayingAuto(false);
    }
    return () => {
      if (timer) clearTimeout(timer);
    };
  }, [isPlayingAuto, currentStepIndex, steps.length, autoSpeed]);

  const handleStartStepByStep = () => {
    const n1 = parseFloat(num1) || 0;
    const n2 = parseFloat(num2) || 0;
    const generatedSteps = generateExecutionTrace(n1, operacao, n2);
    setSteps(generatedSteps);
    setCurrentStepIndex(0);
    setIsPlayingAuto(false);
  };

  const handleNextStep = () => {
    if (steps.length === 0) {
      handleStartStepByStep();
      return;
    }
    if (currentStepIndex < steps.length - 1) {
      setCurrentStepIndex((prev) => prev + 1);
    }
  };

  const handleRunFull = () => {
    const n1 = parseFloat(num1) || 0;
    const n2 = parseFloat(num2) || 0;
    const result = runCalculator(n1, operacao, n2);
    setTerminalLines(result.outputLines);
    setLiveVars(result.variables);
    setCurrentStepIndex(-1);
    setIsPlayingAuto(false);
    onStepChange?.(undefined);

    if (result.success) {
      setCurrentExplanation(
        `Execução concluída com sucesso! O cálculo gerou o resultado ${result.resultado}.`
      );
    } else {
      setCurrentExplanation(
        `O programa exibiu uma mensagem de alerta: "${result.errorMessage}".`
      );
    }
  };

  const handleReset = () => {
    setCurrentStepIndex(-1);
    setIsPlayingAuto(false);
    setSteps([]);
    setLiveVars({});
    onStepChange?.(undefined);
    setTerminalLines([
      '# Terminal Python (Simulação)',
      '# Digite os valores acima e clique em "Executar" ou "Passo a Passo"',
    ]);
    setCurrentExplanation('Simulador reiniciado. Escolha os valores e teste novamente!');
  };

  const applyPreset = (n1: string, op: string, n2: string) => {
    setNum1(n1);
    setOperacao(op);
    setNum2(n2);
    handleReset();
  };

  const isStepMode = currentStepIndex >= 0;

  return (
    <div className="flex flex-col gap-3">
      {/* 1. Control Panel & Inputs */}
      <div className="bg-slate-900 border border-slate-700/80 rounded-2xl p-3.5 shadow-xl">
        <div className="flex items-center justify-between pb-2.5 border-b border-slate-800 mb-2.5">
          <div className="flex items-center gap-2">
            <Cpu className="w-4 h-4 text-emerald-400" />
            <h2 className="text-xs font-semibold text-white">
              Painel de Execução & Entrada de Dados (input)
            </h2>
          </div>
          <span className="text-[11px] text-slate-400 font-mono">
            {isStepMode
              ? `Passo ${currentStepIndex + 1} de ${steps.length}`
              : 'Modo Espera'}
          </span>
        </div>

        {/* Form Inputs simulating input() */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 mb-2.5">
          {/* Número 1 */}
          <div>
            <label
              htmlFor="num1-input"
              className="block text-xs font-medium text-slate-300 mb-1"
            >
              1º Número <span className="text-emerald-400 font-mono">(numero1)</span>:
            </label>
            <input
              id="num1-input"
              type="number"
              step="any"
              value={num1}
              onChange={(e) => setNum1(e.target.value)}
              className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 font-mono"
              placeholder="Ex: 10"
            />
          </div>

          {/* Operação */}
          <div>
            <label
              htmlFor="operacao-select"
              className="block text-xs font-medium text-slate-300 mb-1"
            >
              Operação <span className="text-purple-400 font-mono">(operacao)</span>:
            </label>
            <div className="grid grid-cols-4 gap-1">
              {['+', '-', '*', '/'].map((op) => (
                <button
                  key={op}
                  type="button"
                  onClick={() => setOperacao(op)}
                  className={`py-2 text-sm font-bold font-mono rounded-lg border transition-all ${
                    operacao === op
                      ? 'bg-purple-500/20 text-purple-300 border-purple-400 shadow-sm'
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
          <div>
            <label
              htmlFor="num2-input"
              className="block text-xs font-medium text-slate-300 mb-1"
            >
              2º Número <span className="text-emerald-400 font-mono">(numero2)</span>:
            </label>
            <input
              id="num2-input"
              type="number"
              step="any"
              value={num2}
              onChange={(e) => setNum2(e.target.value)}
              className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 font-mono"
              placeholder="Ex: 5"
            />
          </div>
        </div>

        {/* Quick Presets for beginners */}
        <div className="flex flex-wrap items-center gap-1.5 mb-4 text-xs">
          <span className="text-slate-400 font-medium mr-1">Exemplos Prontos:</span>
          <button
            onClick={() => applyPreset('10', '+', '5')}
            className="px-2 py-1 rounded bg-slate-800 text-slate-300 hover:bg-slate-700 hover:text-white border border-slate-700 transition-colors"
          >
            10 + 5 (Soma)
          </button>
          <button
            onClick={() => applyPreset('50', '-', '18')}
            className="px-2 py-1 rounded bg-slate-800 text-slate-300 hover:bg-slate-700 hover:text-white border border-slate-700 transition-colors"
          >
            50 - 18 (Subtração)
          </button>
          <button
            onClick={() => applyPreset('7', '*', '6')}
            className="px-2 py-1 rounded bg-slate-800 text-slate-300 hover:bg-slate-700 hover:text-white border border-slate-700 transition-colors"
          >
            7 * 6 (Multiplicação)
          </button>
          <button
            onClick={() => applyPreset('100', '/', '4')}
            className="px-2 py-1 rounded bg-slate-800 text-slate-300 hover:bg-slate-700 hover:text-white border border-slate-700 transition-colors"
          >
            100 / 4 (Divisão)
          </button>
          <button
            onClick={() => applyPreset('15', '/', '0')}
            className="px-2 py-1 rounded bg-rose-950/60 text-rose-300 hover:bg-rose-900/80 border border-rose-800/80 transition-colors flex items-center gap-1"
          >
            <AlertTriangle className="w-3 h-3 text-rose-400" />
            15 / 0 (Testar Divisão por Zero)
          </button>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-slate-800">
          <button
            onClick={handleRunFull}
            className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold bg-emerald-500 hover:bg-emerald-400 text-slate-950 shadow-md shadow-emerald-500/20 transition-all cursor-pointer"
            aria-label="Executar código completo"
          >
            <Play className="w-3.5 h-3.5 fill-current" />
            <span>Executar Tudo</span>
          </button>

          {!isStepMode ? (
            <button
              onClick={handleStartStepByStep}
              className="flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold bg-yellow-500/20 text-yellow-300 hover:bg-yellow-500/30 border border-yellow-500/40 transition-all cursor-pointer"
              aria-label="Iniciar modo passo a passo"
            >
              <SkipForward className="w-3.5 h-3.5" />
              <span>Iniciar Passo a Passo</span>
            </button>
          ) : (
            <>
              <button
                onClick={handleNextStep}
                disabled={currentStepIndex >= steps.length - 1}
                className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold bg-yellow-500 text-slate-950 hover:bg-yellow-400 disabled:opacity-40 disabled:cursor-not-allowed shadow-md transition-all cursor-pointer"
                aria-label="Avançar para o próximo passo"
              >
                <SkipForward className="w-3.5 h-3.5" />
                <span>Próximo Passo</span>
              </button>

              <button
                onClick={() => setIsPlayingAuto(!isPlayingAuto)}
                className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-medium border transition-colors ${
                  isPlayingAuto
                    ? 'bg-amber-500/20 text-amber-300 border-amber-400'
                    : 'bg-slate-800 text-slate-300 border-slate-700 hover:bg-slate-700'
                }`}
                aria-label={isPlayingAuto ? 'Pausar animação automática' : 'Auto Play dos passos'}
              >
                <FastForward className="w-3.5 h-3.5" />
                <span>{isPlayingAuto ? 'Pausar' : 'Auto-Play'}</span>
              </button>
            </>
          )}

          <button
            onClick={handleReset}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-medium bg-slate-800 text-slate-300 hover:text-white hover:bg-slate-750 border border-slate-700 transition-colors ml-auto cursor-pointer"
            aria-label="Reiniciar simulador"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reiniciar</span>
          </button>
        </div>
      </div>

      {/* 2. Visual RAM Inspector (Variáveis na Memória) */}
      <div className="bg-slate-900 border border-slate-700/80 rounded-2xl p-3 shadow-xl">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-1.5">
            <Cpu className="w-3.5 h-3.5 text-cyan-400" />
            <h3 className="text-[11px] font-semibold uppercase tracking-wider text-slate-300">
              Memória RAM: Inspeção de Variáveis
            </h3>
          </div>
          <span className="text-[10px] text-slate-500">
            Valores salvos na memória durante a execução
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          {/* numero1 */}
          <div
            className={`p-2.5 rounded-xl border transition-all ${
              liveVars.numero1 !== undefined
                ? 'bg-emerald-950/30 border-emerald-500/50 text-emerald-200'
                : 'bg-slate-950/60 border-slate-800 text-slate-500'
            }`}
          >
            <div className="flex items-center justify-between text-[10px] mb-0.5">
              <span className="font-mono font-bold text-white">numero1</span>
              <span className="text-[9px] px-1.5 py-0.2 rounded bg-slate-800 text-emerald-400 font-mono">
                float
              </span>
            </div>
            <div className="font-mono text-sm font-semibold truncate">
              {liveVars.numero1 !== undefined ? liveVars.numero1 : '—'}
            </div>
            <p className="text-[9px] text-slate-400 mt-0.5">1º número</p>
          </div>

          {/* operacao */}
          <div
            className={`p-2.5 rounded-xl border transition-all ${
              liveVars.operacao !== undefined
                ? 'bg-purple-950/30 border-purple-500/50 text-purple-200'
                : 'bg-slate-950/60 border-slate-800 text-slate-500'
            }`}
          >
            <div className="flex items-center justify-between text-[10px] mb-0.5">
              <span className="font-mono font-bold text-white">operacao</span>
              <span className="text-[9px] px-1.5 py-0.2 rounded bg-slate-800 text-purple-400 font-mono">
                str
              </span>
            </div>
            <div className="font-mono text-sm font-semibold truncate">
              {liveVars.operacao !== undefined ? `"${liveVars.operacao}"` : '—'}
            </div>
            <p className="text-[9px] text-slate-400 mt-0.5">Símbolo (+,-,*,/)</p>
          </div>

          {/* numero2 */}
          <div
            className={`p-2.5 rounded-xl border transition-all ${
              liveVars.numero2 !== undefined
                ? 'bg-emerald-950/30 border-emerald-500/50 text-emerald-200'
                : 'bg-slate-950/60 border-slate-800 text-slate-500'
            }`}
          >
            <div className="flex items-center justify-between text-[10px] mb-0.5">
              <span className="font-mono font-bold text-white">numero2</span>
              <span className="text-[9px] px-1.5 py-0.2 rounded bg-slate-800 text-emerald-400 font-mono">
                float
              </span>
            </div>
            <div className="font-mono text-sm font-semibold truncate">
              {liveVars.numero2 !== undefined ? liveVars.numero2 : '—'}
            </div>
            <p className="text-[9px] text-slate-400 mt-0.5">2º número</p>
          </div>

          {/* resultado */}
          <div
            className={`p-2.5 rounded-xl border transition-all ${
              liveVars.resultado !== undefined
                ? 'bg-amber-950/30 border-amber-500/50 text-amber-200 ring-1 ring-amber-400/30'
                : 'bg-slate-950/60 border-slate-800 text-slate-500'
            }`}
          >
            <div className="flex items-center justify-between text-[10px] mb-0.5">
              <span className="font-mono font-bold text-white">resultado</span>
              <span className="text-[9px] px-1.5 py-0.2 rounded bg-slate-800 text-amber-400 font-mono">
                {liveVars.resultado !== undefined ? 'float' : 'indefinido'}
              </span>
            </div>
            <div className="font-mono text-sm font-semibold truncate">
              {liveVars.resultado !== undefined ? liveVars.resultado : '—'}
            </div>
            <p className="text-[9px] text-slate-400 mt-0.5">Resultado</p>
          </div>
        </div>
      </div>

      {/* 3. Tutor Explainer Card */}
      <div className="bg-gradient-to-r from-amber-950/30 via-slate-900 to-slate-900 border border-amber-500/30 rounded-2xl p-3 shadow-xl">
        <div className="flex items-start gap-2.5">
          <div className="p-1.5 rounded-lg bg-amber-500/20 text-amber-400 shrink-0">
            <Lightbulb className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-2 mb-0.5">
              <h4 className="text-[11px] font-bold text-amber-300 uppercase tracking-wider">
                Dica do Tutor no Passo Atual
              </h4>
              {isStepMode && (
                <span className="text-[10px] bg-amber-500/20 text-amber-300 px-2 py-0.2 rounded-full font-mono">
                  Linha {steps[currentStepIndex]?.lineNumber}
                </span>
              )}
            </div>
            <p className="text-xs text-slate-200 leading-relaxed font-sans">
              {currentExplanation}
            </p>
          </div>
        </div>
      </div>

      {/* 4. Terminal Output (Console) */}
      <div className="bg-slate-950 border border-slate-800 rounded-2xl overflow-hidden shadow-2xl font-mono">
        <div className="flex items-center justify-between px-3.5 py-2 bg-slate-900/90 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <TerminalIcon className="w-3.5 h-3.5 text-emerald-400" />
            <span className="text-xs text-slate-300 font-medium font-sans">
              Terminal / Saída Padrão (print)
            </span>
          </div>
          <span className="text-[10px] text-slate-500 font-sans">
            python calculadora.py
          </span>
        </div>

        <div className="p-3 text-xs space-y-1 min-h-[110px] max-h-[170px] overflow-y-auto">
          {terminalLines.map((line, idx) => {
            const isError = line.startsWith('Erro:');
            const isHeader = line.startsWith('===');
            const isComment = line.startsWith('#');
            const isPrompt = line.startsWith('Digite');

            return (
              <div
                key={idx}
                className={`leading-relaxed ${
                  isError
                    ? 'text-rose-400 font-semibold'
                    : isHeader
                    ? 'text-amber-400 font-semibold'
                    : isComment
                    ? 'text-slate-500 italic'
                    : isPrompt
                    ? 'text-cyan-300'
                    : 'text-emerald-300 font-medium'
                }`}
              >
                {line}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
