/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import {
  RotateCcw,
  Delete,
  Equal,
  Sparkles,
  AlertTriangle,
  Terminal,
  Calculator as CalculatorIcon,
  HelpCircle,
  Binary,
  Layers,
} from 'lucide-react';
import {
  calcularFatorial,
  resolverBhaskara,
  converterBaseNumerica,
  BhaskaraResult,
} from '../utils/scientific-engine';

interface ScientificKeypadProps {
  onRecordHistory: (categoria: any, expressao: string, resultado: string) => void;
}

export const ScientificKeypad: React.FC<ScientificKeypadProps> = ({ onRecordHistory }) => {
  const [display, setDisplay] = useState<string>('0');
  const [subDisplay, setSubDisplay] = useState<string>('');
  const [isRad, setIsRad] = useState<boolean>(false);
  const [is2nd, setIs2nd] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [terminalLog, setTerminalLog] = useState<string[]>([
    '# Python 3.12 (Calculadora Científica Modular v2.0)',
    '# Digite uma expressão ou clique nos botões científicos para executar.',
  ]);

  // Modal / Seções auxiliares
  const [showBhaskara, setShowBhaskara] = useState<boolean>(false);
  const [bhaA, setBhaA] = useState<string>('1');
  const [bhaB, setBhaB] = useState<string>('-5');
  const [bhaC, setBhaC] = useState<string>('6');
  const [bhaResult, setBhaResult] = useState<BhaskaraResult | null>(() => resolverBhaskara(1, -5, 6));

  const [showBases, setShowBases] = useState<boolean>(false);
  const [baseVal, setBaseVal] = useState<string>('42');
  const [baseFrom, setBaseFrom] = useState<number>(10);
  const [baseTo, setBaseTo] = useState<number>(2);
  const [baseResult, setBaseResult] = useState<string>('101010');

  const appendToDisplay = (val: string) => {
    setErrorMsg(null);
    if (display === '0' && val !== '.') {
      setDisplay(val);
    } else {
      setDisplay((prev) => prev + val);
    }
  };

  const handleClear = () => {
    setDisplay('0');
    setSubDisplay('');
    setErrorMsg(null);
  };

  const handleBackspace = () => {
    setErrorMsg(null);
    if (display.length <= 1) {
      setDisplay('0');
    } else {
      setDisplay((prev) => prev.slice(0, -1));
    }
  };

  const calculateResult = () => {
    setErrorMsg(null);
    try {
      const sanitized = display
        .replace(/×/g, '*')
        .replace(/÷/g, '/')
        .replace(/\^/g, '**');

      // Zero division guard
      if (/\/0(?![.\d])/.test(sanitized)) {
        throw new Error('Erro: Não é possível dividir um número por zero!');
      }

      // Safe evaluation of simple math tokens
      // eslint-disable-next-line no-new-func
      const fn = new Function(`return ${sanitized};`);
      const res = fn();

      if (!Number.isFinite(res)) {
        throw new Error('Resultado numérico indefinido ou infinito.');
      }

      const formatted = Number(Number(res).toFixed(8)).toString();
      setSubDisplay(`${display} =`);
      setDisplay(formatted);

      onRecordHistory('Básica', display, formatted);
      setTerminalLog((prev) => [
        ...prev.slice(-6),
        `>>> ${display}`,
        `Resultado: ${formatted}`,
      ]);
    } catch (err: any) {
      setErrorMsg(err.message || 'Erro na avaliação da expressão.');
      setTerminalLog((prev) => [
        ...prev.slice(-6),
        `>>> ${display}`,
        `Erro: ${err.message}`,
      ]);
    }
  };

  // Funções científicas imediatas
  const applyUnaryFunction = (fnName: string) => {
    setErrorMsg(null);
    const num = parseFloat(display);
    if (isNaN(num)) {
      setErrorMsg('Número inválido para a operação.');
      return;
    }

    try {
      let res = 0;
      let exprLabel = '';

      switch (fnName) {
        case 'sqrt':
          if (num < 0) throw new Error('Raiz quadrada de número negativo não pertence aos reais.');
          res = Math.sqrt(num);
          exprLabel = `√(${num})`;
          break;
        case 'cbrt':
          res = Math.cbrt(num);
          exprLabel = `∛(${num})`;
          break;
        case 'sqr':
          res = num * num;
          exprLabel = `(${num})²`;
          break;
        case 'cube':
          res = num * num * num;
          exprLabel = `(${num})³`;
          break;
        case 'sin': {
          const rad = isRad ? num : (num * Math.PI) / 180;
          res = Math.sin(rad);
          exprLabel = `sin(${num}${isRad ? 'rad' : '°'})`;
          break;
        }
        case 'cos': {
          const rad = isRad ? num : (num * Math.PI) / 180;
          res = Math.cos(rad);
          exprLabel = `cos(${num}${isRad ? 'rad' : '°'})`;
          break;
        }
        case 'tan': {
          const rad = isRad ? num : (num * Math.PI) / 180;
          if (Math.abs(Math.cos(rad)) < 1e-12) {
            throw new Error(`Tangente não é definida para ${num}${isRad ? ' rad' : '°'}.`);
          }
          res = Math.tan(rad);
          exprLabel = `tan(${num}${isRad ? 'rad' : '°'})`;
          break;
        }
        case 'ln':
          if (num <= 0) throw new Error('O logaritmo natural só é definido para x > 0.');
          res = Math.log(num);
          exprLabel = `ln(${num})`;
          break;
        case 'log10':
          if (num <= 0) throw new Error('O logaritmo na base 10 só é definido para x > 0.');
          res = Math.log10(num);
          exprLabel = `log10(${num})`;
          break;
        case 'factorial':
          res = calcularFatorial(num);
          exprLabel = `${num}!`;
          break;
        case 'percent':
          res = num / 100;
          exprLabel = `${num}%`;
          break;
        case 'negate':
          res = -num;
          exprLabel = `-(${num})`;
          break;
        default:
          return;
      }

      const formatted = Number(res.toFixed(8)).toString();
      setSubDisplay(`${exprLabel} =`);
      setDisplay(formatted);
      onRecordHistory('Científica', exprLabel, formatted);
      setTerminalLog((prev) => [
        ...prev.slice(-6),
        `>>> ${exprLabel}`,
        `Resultado: ${formatted}`,
      ]);
    } catch (err: any) {
      setErrorMsg(err.message);
      setTerminalLog((prev) => [
        ...prev.slice(-6),
        `>>> ${fnName}(${num})`,
        `Erro: ${err.message}`,
      ]);
    }
  };

  const handleResolveBhaskara = () => {
    try {
      const a = parseFloat(bhaA) || 0;
      const b = parseFloat(bhaB) || 0;
      const c = parseFloat(bhaC) || 0;
      const res = resolverBhaskara(a, b, c);
      setBhaResult(res);
      onRecordHistory('Álgebra', `${a}x² + ${b}x + ${c} = 0`, res.raizes.join(', '));
      setTerminalLog((prev) => [
        ...prev.slice(-6),
        `>>> Bhaskara: ${a}x² + ${b}x + ${c} = 0`,
        `Raízes: ${res.raizes.join(', ')} (Δ = ${res.delta})`,
      ]);
    } catch (err: any) {
      setErrorMsg(err.message);
    }
  };

  const handleConvertBase = () => {
    try {
      const res = converterBaseNumerica(baseVal, baseFrom, baseTo);
      setBaseResult(res);
      onRecordHistory('Conversão', `(${baseVal})b${baseFrom} -> b${baseTo}`, res);
      setTerminalLog((prev) => [
        ...prev.slice(-6),
        `>>> BaseConvert: (${baseVal})_b${baseFrom} para base ${baseTo}`,
        `Resultado: ${res}`,
      ]);
    } catch (err: any) {
      setErrorMsg(err.message);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Alerta de Erro se houver */}
      {errorMsg && (
        <div
          role="alert"
          className="p-3.5 rounded-2xl bg-rose-950/80 border border-rose-500/80 text-rose-200 text-xs flex items-center justify-between gap-3 animate-in fade-in"
        >
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0" />
            <span className="font-medium">{errorMsg}</span>
          </div>
          <button
            onClick={() => setErrorMsg(null)}
            className="text-[11px] underline text-rose-300 hover:text-white"
          >
            Fechar
          </button>
        </div>
      )}

      {/* Grade Principal da Calculadora */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Painel da Calculadora (7 colunas) */}
        <div className="lg:col-span-7 bg-slate-900 border border-slate-700/80 rounded-3xl p-5 shadow-2xl relative overflow-hidden">
          {/* Display da Calculadora */}
          <div className="bg-slate-950 border border-slate-800 rounded-2xl p-4 mb-4 text-right shadow-inner">
            <div className="flex items-center justify-between text-xs text-slate-500 mb-1">
              <span className="flex items-center gap-1.5 font-mono text-[11px]">
                <span className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${isRad ? 'bg-purple-900/60 text-purple-300' : 'bg-emerald-900/60 text-emerald-300'}`}>
                  {isRad ? 'RAD' : 'DEG'}
                </span>
                {is2nd && <span className="px-1.5 py-0.5 rounded bg-amber-900/60 text-amber-300 text-[10px] font-bold">2nd</span>}
              </span>
              <span className="font-mono truncate max-w-[200px]">{subDisplay}</span>
            </div>
            <div className="font-mono text-3xl sm:text-4xl font-extrabold text-white tracking-tight break-all">
              {display}
            </div>
          </div>

          {/* Atalhos de Modos Especiais */}
          <div className="flex items-center justify-between gap-2 mb-3 text-xs">
            <div className="flex items-center gap-1.5">
              <button
                onClick={() => setIsRad(!isRad)}
                className={`px-2.5 py-1 rounded-lg text-xs font-mono font-semibold border transition-all cursor-pointer ${
                  isRad ? 'bg-purple-500/20 text-purple-300 border-purple-500/40' : 'bg-slate-800 text-slate-300 border-slate-700 hover:text-white'
                }`}
              >
                {isRad ? 'Rad' : 'Deg'}
              </button>
              <button
                onClick={() => setIs2nd(!is2nd)}
                className={`px-2.5 py-1 rounded-lg text-xs font-mono font-semibold border transition-all cursor-pointer ${
                  is2nd ? 'bg-amber-500/20 text-amber-300 border-amber-500/40' : 'bg-slate-800 text-slate-300 border-slate-700 hover:text-white'
                }`}
              >
                2nd
              </button>
            </div>

            <div className="flex items-center gap-1.5">
              <button
                onClick={() => setShowBhaskara(!showBhaskara)}
                className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-medium border transition-all cursor-pointer ${
                  showBhaskara ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40' : 'bg-slate-800 text-slate-300 border-slate-700 hover:text-white'
                }`}
              >
                <Layers className="w-3.5 h-3.5 text-emerald-400" />
                <span>Bhaskara</span>
              </button>
              <button
                onClick={() => setShowBases(!showBases)}
                className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-medium border transition-all cursor-pointer ${
                  showBases ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40' : 'bg-slate-800 text-slate-300 border-slate-700 hover:text-white'
                }`}
              >
                <Binary className="w-3.5 h-3.5 text-cyan-400" />
                <span>Bases</span>
              </button>
            </div>
          </div>

          {/* Teclado Científico */}
          <div className="grid grid-cols-5 gap-1.5 sm:gap-2">
            {/* Linha 1 */}
            <button onClick={() => applyUnaryFunction('sin')} className="btn-sci">sin</button>
            <button onClick={() => applyUnaryFunction('cos')} className="btn-sci">cos</button>
            <button onClick={() => applyUnaryFunction('tan')} className="btn-sci">tan</button>
            <button onClick={() => appendToDisplay('(')} className="btn-sci">(</button>
            <button onClick={() => appendToDisplay(')')} className="btn-sci">)</button>

            {/* Linha 2 */}
            <button onClick={() => applyUnaryFunction('ln')} className="btn-sci">ln</button>
            <button onClick={() => applyUnaryFunction('log10')} className="btn-sci">log₁₀</button>
            <button onClick={() => applyUnaryFunction(is2nd ? 'cbrt' : 'sqrt')} className="btn-sci">{is2nd ? '∛x' : '√x'}</button>
            <button onClick={() => applyUnaryFunction(is2nd ? 'cube' : 'sqr')} className="btn-sci">{is2nd ? 'x³' : 'x²'}</button>
            <button onClick={() => appendToDisplay('^')} className="btn-sci">xʸ</button>

            {/* Linha 3 */}
            <button onClick={() => applyUnaryFunction('factorial')} className="btn-sci">n!</button>
            <button onClick={() => applyUnaryFunction('percent')} className="btn-sci">%</button>
            <button onClick={() => appendToDisplay('3.14159265')} className="btn-sci">π</button>
            <button onClick={() => appendToDisplay('2.71828182')} className="btn-sci">e</button>
            <button onClick={handleBackspace} className="btn-sci text-amber-400 hover:bg-amber-500/20">
              <Delete className="w-4 h-4 mx-auto" />
            </button>

            {/* Linha 4: Numérica 7 8 9 ÷ C */}
            <button onClick={() => appendToDisplay('7')} className="btn-num">7</button>
            <button onClick={() => appendToDisplay('8')} className="btn-num">8</button>
            <button onClick={() => appendToDisplay('9')} className="btn-num">9</button>
            <button onClick={() => appendToDisplay('÷')} className="btn-op">÷</button>
            <button onClick={handleClear} className="btn-op text-rose-400 hover:bg-rose-500/20">C</button>

            {/* Linha 5: Numérica 4 5 6 × */}
            <button onClick={() => appendToDisplay('4')} className="btn-num">4</button>
            <button onClick={() => appendToDisplay('5')} className="btn-num">5</button>
            <button onClick={() => appendToDisplay('6')} className="btn-num">6</button>
            <button onClick={() => appendToDisplay('×')} className="btn-op">×</button>
            <button onClick={() => applyUnaryFunction('negate')} className="btn-sci">±</button>

            {/* Linha 6: Numérica 1 2 3 − */}
            <button onClick={() => appendToDisplay('1')} className="btn-num">1</button>
            <button onClick={() => appendToDisplay('2')} className="btn-num">2</button>
            <button onClick={() => appendToDisplay('3')} className="btn-num">3</button>
            <button onClick={() => appendToDisplay('-')} className="btn-op">−</button>
            <button
              onClick={calculateResult}
              className="row-span-2 bg-gradient-to-br from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-slate-950 font-black text-xl rounded-xl shadow-lg shadow-emerald-500/25 flex items-center justify-center cursor-pointer transition-all active:scale-95"
              aria-label="Calcular resultado"
            >
              <Equal className="w-6 h-6 stroke-[3]" />
            </button>

            {/* Linha 7: 0 . + */}
            <button onClick={() => appendToDisplay('0')} className="btn-num col-span-2">0</button>
            <button onClick={() => appendToDisplay('.')} className="btn-num">.</button>
            <button onClick={() => appendToDisplay('+')} className="btn-op">+</button>
          </div>
        </div>

        {/* Coluna Direita: Bhaskara / Bases / Terminal (5 colunas) */}
        <div className="lg:col-span-5 space-y-4">
          {/* Card Bhaskara se ativado */}
          {showBhaskara && (
            <div className="bg-slate-900 border border-emerald-500/40 rounded-2xl p-4 shadow-xl space-y-3 animate-in fade-in">
              <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                <div className="flex items-center gap-2 text-xs font-bold text-emerald-400">
                  <Layers className="w-4 h-4" />
                  <span>Equação de 2º Grau (Bhaskara)</span>
                </div>
                <button onClick={() => setShowBhaskara(false)} className="text-slate-500 hover:text-white text-xs">✕</button>
              </div>

              <p className="text-[11px] text-slate-400 font-mono text-center">ax² + bx + c = 0</p>

              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="text-[10px] text-slate-400 block mb-0.5">a (≠ 0):</label>
                  <input
                    type="number"
                    value={bhaA}
                    onChange={(e) => setBhaA(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg p-1.5 text-xs text-white font-mono"
                  />
                </div>
                <div>
                  <label className="text-[10px] text-slate-400 block mb-0.5">b:</label>
                  <input
                    type="number"
                    value={bhaB}
                    onChange={(e) => setBhaB(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg p-1.5 text-xs text-white font-mono"
                  />
                </div>
                <div>
                  <label className="text-[10px] text-slate-400 block mb-0.5">c:</label>
                  <input
                    type="number"
                    value={bhaC}
                    onChange={(e) => setBhaC(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg p-1.5 text-xs text-white font-mono"
                  />
                </div>
              </div>

              <button
                onClick={handleResolveBhaskara}
                className="w-full py-1.5 text-xs font-semibold bg-emerald-500 hover:bg-emerald-400 text-slate-950 rounded-lg shadow-sm transition-colors cursor-pointer"
              >
                Calcular Raízes
              </button>

              {bhaResult && (
                <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs space-y-1">
                  <div className="text-[11px] text-slate-400 flex items-center justify-between">
                    <span>Delta (Δ): <strong className="text-emerald-400">{bhaResult.delta}</strong></span>
                    <span className="text-[10px] text-slate-500">{bhaResult.tipo}</span>
                  </div>
                  <div className="font-mono text-sm font-bold text-white pt-1">
                    Raízes: {bhaResult.raizes.join(' e ')}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Card Bases se ativado */}
          {showBases && (
            <div className="bg-slate-900 border border-cyan-500/40 rounded-2xl p-4 shadow-xl space-y-3 animate-in fade-in">
              <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                <div className="flex items-center gap-2 text-xs font-bold text-cyan-400">
                  <Binary className="w-4 h-4" />
                  <span>Conversor de Bases Numéricas</span>
                </div>
                <button onClick={() => setShowBases(false)} className="text-slate-500 hover:text-white text-xs">✕</button>
              </div>

              <div>
                <label className="text-[10px] text-slate-400 block mb-1">Valor a converter:</label>
                <input
                  type="text"
                  value={baseVal}
                  onChange={(e) => setBaseVal(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2 text-xs text-white font-mono"
                  placeholder="Ex: 42 ou 101010"
                />
              </div>

              <div className="grid grid-cols-2 gap-2 text-xs">
                <div>
                  <label className="text-[10px] text-slate-400 block mb-1">De:</label>
                  <select
                    value={baseFrom}
                    onChange={(e) => setBaseFrom(Number(e.target.value))}
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg p-1.5 text-xs text-white font-mono"
                  >
                    <option value={10}>Decimal (10)</option>
                    <option value={2}>Binário (2)</option>
                    <option value={8}>Octal (8)</option>
                    <option value={16}>Hexadecimal (16)</option>
                  </select>
                </div>
                <div>
                  <label className="text-[10px] text-slate-400 block mb-1">Para:</label>
                  <select
                    value={baseTo}
                    onChange={(e) => setBaseTo(Number(e.target.value))}
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg p-1.5 text-xs text-white font-mono"
                  >
                    <option value={2}>Binário (2)</option>
                    <option value={8}>Octal (8)</option>
                    <option value={10}>Decimal (10)</option>
                    <option value={16}>Hexadecimal (16)</option>
                  </select>
                </div>
              </div>

              <button
                onClick={handleConvertBase}
                className="w-full py-1.5 text-xs font-semibold bg-cyan-500 hover:bg-cyan-400 text-slate-950 rounded-lg shadow-sm transition-colors cursor-pointer"
              >
                Converter Base
              </button>

              <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs">
                <span className="text-[10px] text-slate-400 block">Resultado:</span>
                <span className="font-mono text-base font-bold text-cyan-300 break-all">{baseResult}</span>
              </div>
            </div>
          )}

          {/* Terminal Simulado Python */}
          <div className="bg-slate-950 border border-slate-800 rounded-2xl overflow-hidden shadow-2xl font-mono text-xs">
            <div className="flex items-center justify-between px-3.5 py-2 bg-slate-900 border-b border-slate-800 text-slate-400 text-[11px]">
              <div className="flex items-center gap-1.5">
                <Terminal className="w-3.5 h-3.5 text-emerald-400" />
                <span>Console de Auditoria (app.log)</span>
              </div>
              <span className="text-[10px] text-slate-500">python main.py</span>
            </div>

            <div className="p-3 space-y-1 min-h-[140px] max-h-[220px] overflow-y-auto text-[11px]">
              {terminalLog.map((line, idx) => (
                <div
                  key={idx}
                  className={`leading-relaxed ${
                    line.startsWith('Erro:')
                      ? 'text-rose-400 font-semibold'
                      : line.startsWith('Resultado:')
                      ? 'text-emerald-300 font-bold'
                      : line.startsWith('>>>')
                      ? 'text-cyan-300'
                      : 'text-slate-500 italic'
                  }`}
                >
                  {line}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

