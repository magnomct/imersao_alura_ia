/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo } from 'react';
import {
  LineChart,
  Download,
  RotateCcw,
  Sparkles,
  AlertTriangle,
  CheckCircle2,
} from 'lucide-react';
import { avaliarFuncaoSegura } from '../utils/scientific-engine';

export const FunctionPlotterView: React.FC = () => {
  const [expr, setExpr] = useState<string>('sin(x) * cos(x)');
  const [xMin, setXMin] = useState<number>(-10);
  const [xMax, setXMax] = useState<number>(10);
  const [pointsCount, setPointsCount] = useState<number>(250);
  const [plotError, setPlotError] = useState<string | null>(null);

  // Calcula a malha de pontos
  const plotData = useMemo(() => {
    setPlotError(null);
    if (xMin >= xMax) {
      setPlotError('X Mínimo deve ser estritamente menor que X Máximo.');
      return null;
    }

    const step = (xMax - xMin) / pointsCount;
    const points: { x: number; y: number }[] = [];
    let minY = Infinity;
    let maxY = -Infinity;

    try {
      for (let i = 0; i <= pointsCount; i++) {
        const xVal = xMin + i * step;
        const yVal = avaliarFuncaoSegura(expr, xVal);

        if (Number.isFinite(yVal)) {
          points.push({ x: xVal, y: yVal });
          if (yVal < minY) minY = yVal;
          if (yVal > maxY) maxY = yVal;
        }
      }

      if (points.length < 5) {
        setPlotError('Poucos pontos válidos no domínio da função.');
        return null;
      }

      // Adiciona margem vertical
      const yMargin = (maxY - minY) * 0.1 || 1.0;
      return {
        points,
        minY: minY - yMargin,
        maxY: maxY + yMargin,
      };
    } catch (err: any) {
      setPlotError(err.message || 'Erro ao processar expressão.');
      return null;
    }
  }, [expr, xMin, xMax, pointsCount]);

  // SVG dimensions
  const svgWidth = 650;
  const svgHeight = 350;
  const padding = 45;

  const toSvgX = (x: number) => {
    return padding + ((x - xMin) / (xMax - xMin)) * (svgWidth - padding * 2);
  };

  const toSvgY = (y: number, minY: number, maxY: number) => {
    return svgHeight - padding - ((y - minY) / (maxY - minY)) * (svgHeight - padding * 2);
  };

  const svgPath = useMemo(() => {
    if (!plotData || plotData.points.length === 0) return '';
    const { points, minY, maxY } = plotData;

    let pathStr = '';
    points.forEach((p, idx) => {
      const sx = toSvgX(p.x);
      const sy = toSvgY(p.y, minY, maxY);
      if (idx === 0) pathStr += `M ${sx} ${sy}`;
      else pathStr += ` L ${sx} ${sy}`;
    });
    return pathStr;
  }, [plotData]);

  const applyPreset = (presetExpr: string, minX = -10, maxX = 10) => {
    setExpr(presetExpr);
    setXMin(minX);
    setXMax(maxX);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Cabeçalho */}
      <div className="bg-slate-900 border border-slate-700/80 rounded-2xl p-5 shadow-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <LineChart className="w-5 h-5 text-emerald-400" />
            <h2 className="text-lg font-bold text-white">
              Visualizador Gráfico de Funções (Matplotlib Web)
            </h2>
          </div>
          <p className="text-xs text-slate-400">
            Renderização contínua de equações com eixos cartesianos e backend seguro.
          </p>
        </div>

        {/* Presets rápidos */}
        <div className="flex flex-wrap items-center gap-1.5 text-xs">
          <span className="text-slate-500 text-[11px] mr-1">Exemplos:</span>
          <button
            onClick={() => applyPreset('sin(x) * cos(x)')}
            className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-750 text-slate-300 border border-slate-700 text-[11px]"
          >
            sin(x) * cos(x)
          </button>
          <button
            onClick={() => applyPreset('x^2 - 4*x + 4', -2, 6)}
            className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-750 text-slate-300 border border-slate-700 text-[11px]"
          >
            Parábola (x²-4x+4)
          </button>
          <button
            onClick={() => applyPreset('x^3 - 3*x', -3, 3)}
            className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-750 text-slate-300 border border-slate-700 text-[11px]"
          >
            Cúbica (x³-3x)
          </button>
        </div>
      </div>

      {/* Controles de Entrada */}
      <div className="bg-slate-900 border border-slate-700/80 rounded-2xl p-5 shadow-xl space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 items-center">
          <div className="sm:col-span-6">
            <label className="text-xs font-semibold text-slate-300 block mb-1">
              Função f(x):
            </label>
            <input
              type="text"
              value={expr}
              onChange={(e) => setExpr(e.target.value)}
              className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2 text-sm text-white font-mono focus:ring-2 focus:ring-emerald-500 focus:outline-none"
              placeholder="Ex: sin(x), x^2 - 4"
            />
          </div>

          <div className="sm:col-span-3">
            <label className="text-xs font-semibold text-slate-300 block mb-1">
              X Mínimo:
            </label>
            <input
              type="number"
              value={xMin}
              onChange={(e) => setXMin(Number(e.target.value))}
              className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white font-mono"
            />
          </div>

          <div className="sm:col-span-3">
            <label className="text-xs font-semibold text-slate-300 block mb-1">
              X Máximo:
            </label>
            <input
              type="number"
              value={xMax}
              onChange={(e) => setXMax(Number(e.target.value))}
              className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white font-mono"
            />
          </div>
        </div>

        {plotError && (
          <div className="p-3 rounded-xl bg-rose-950/60 border border-rose-500/40 text-rose-300 text-xs flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0" />
            <span>{plotError}</span>
          </div>
        )}

        {/* Área de Plotagem SVG */}
        <div className="bg-slate-950 border border-slate-800 rounded-2xl p-2 sm:p-4 overflow-x-auto shadow-inner flex justify-center">
          {plotData && (
            <svg
              viewBox={`0 0 ${svgWidth} ${svgHeight}`}
              className="w-full max-w-[650px] h-auto select-none font-mono text-[10px]"
            >
              {/* Background */}
              <rect width={svgWidth} height={svgHeight} fill="#0b0f19" rx="12" />

              {/* Grid Horizontal */}
              {[0, 0.25, 0.5, 0.75, 1].map((ratio) => {
                const yPos = padding + ratio * (svgHeight - padding * 2);
                const val = plotData.maxY - ratio * (plotData.maxY - plotData.minY);
                return (
                  <g key={`h-${ratio}`}>
                    <line
                      x1={padding}
                      y1={yPos}
                      x2={svgWidth - padding}
                      y2={yPos}
                      stroke="#1e293b"
                      strokeDasharray="3 3"
                    />
                    <text x={padding - 8} y={yPos + 3} fill="#64748b" textAnchor="end">
                      {val.toFixed(1)}
                    </text>
                  </g>
                );
              })}

              {/* Grid Vertical */}
              {[0, 0.25, 0.5, 0.75, 1].map((ratio) => {
                const xPos = padding + ratio * (svgWidth - padding * 2);
                const val = xMin + ratio * (xMax - xMin);
                return (
                  <g key={`v-${ratio}`}>
                    <line
                      x1={xPos}
                      y1={padding}
                      x2={xPos}
                      y2={svgHeight - padding}
                      stroke="#1e293b"
                      strokeDasharray="3 3"
                    />
                    <text x={xPos} y={svgHeight - padding + 16} fill="#64748b" textAnchor="middle">
                      {val.toFixed(1)}
                    </text>
                  </g>
                );
              })}

              {/* Eixo X = 0 se visível */}
              {plotData.minY < 0 && plotData.maxY > 0 && (
                <line
                  x1={padding}
                  y1={toSvgY(0, plotData.minY, plotData.maxY)}
                  x2={svgWidth - padding}
                  y2={toSvgY(0, plotData.minY, plotData.maxY)}
                  stroke="#475569"
                  strokeWidth="1.2"
                />
              )}

              {/* Eixo Y = 0 se visível */}
              {xMin < 0 && xMax > 0 && (
                <line
                  x1={toSvgX(0)}
                  y1={padding}
                  x2={toSvgX(0)}
                  y2={svgHeight - padding}
                  stroke="#475569"
                  strokeWidth="1.2"
                />
              )}

              {/* Traçado da Função */}
              <path
                d={svgPath}
                fill="none"
                stroke="#10b981"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />

              {/* Legenda */}
              <rect
                x={svgWidth - 170}
                y={15}
                width={150}
                height={26}
                fill="#1e293b"
                rx="6"
                opacity="0.9"
              />
              <line
                x1={svgWidth - 160}
                y1={28}
                x2={svgWidth - 140}
                y2={28}
                stroke="#10b981"
                strokeWidth="2.5"
              />
              <text x={svgWidth - 132} y={32} fill="#e2e8f0" fontSize="10">
                f(x) = {expr.slice(0, 14)}
              </text>
            </svg>
          )}
        </div>
      </div>
    </div>
  );
};

