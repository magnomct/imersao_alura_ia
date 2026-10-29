/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import {
  ArrowLeftRight,
  Ruler,
  Thermometer,
  Coins,
  ShieldCheck,
  AlertTriangle,
  RefreshCw,
} from 'lucide-react';
import {
  converterDistancia,
  converterTemperatura,
  converterMoeda,
} from '../utils/scientific-engine';

export const ConvertersView: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'distancia' | 'temperatura' | 'moeda'>('distancia');

  // Distância
  const [distVal, setDistVal] = useState<number>(10);
  const [distFrom, setDistFrom] = useState<string>('km');
  const [distTo, setDistTo] = useState<string>('mi');

  // Temperatura
  const [tempVal, setTempVal] = useState<number>(100);
  const [tempFrom, setTempFrom] = useState<string>('C');
  const [tempTo, setTempTo] = useState<string>('F');
  const [tempError, setTempError] = useState<string | null>(null);

  // Moeda
  const [curVal, setCurVal] = useState<number>(100);
  const [curFrom, setCurFrom] = useState<string>('USD');
  const [curTo, setCurTo] = useState<string>('BRL');

  const distResultado = (() => {
    try {
      return converterDistancia(distVal, distFrom, distTo);
    } catch {
      return 0;
    }
  })();

  const tempResultado = (() => {
    try {
      setTempError(null);
      return converterTemperatura(tempVal, tempFrom, tempTo);
    } catch (err: any) {
      setTempError(err.message);
      return null;
    }
  })();

  const moedaResultado = (() => {
    try {
      return converterMoeda(curVal, curFrom, curTo);
    } catch {
      return null;
    }
  })();

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Abas Superiores */}
      <div className="flex items-center justify-center gap-2 p-1 bg-slate-900 border border-slate-700/80 rounded-2xl w-fit mx-auto shadow-lg">
        <button
          onClick={() => setActiveTab('distancia')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
            activeTab === 'distancia'
              ? 'bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/20'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <Ruler className="w-4 h-4" />
          <span>Distância</span>
        </button>

        <button
          onClick={() => setActiveTab('temperatura')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
            activeTab === 'temperatura'
              ? 'bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/20'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <Thermometer className="w-4 h-4" />
          <span>Temperatura</span>
        </button>

        <button
          onClick={() => setActiveTab('moeda')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
            activeTab === 'moeda'
              ? 'bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/20'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <Coins className="w-4 h-4" />
          <span>Moedas & Câmbio</span>
        </button>
      </div>

      {/* Card 1: Distância */}
      {activeTab === 'distancia' && (
        <div className="bg-slate-900 border border-slate-700/80 rounded-3xl p-6 shadow-2xl space-y-5 animate-in fade-in">
          <div className="flex items-center gap-2 text-sm font-bold text-white pb-3 border-b border-slate-800">
            <Ruler className="w-4 h-4 text-emerald-400" />
            <span>Conversor de Unidades de Distância</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-5 gap-3 items-center">
            <div className="sm:col-span-2">
              <label className="text-xs text-slate-400 block mb-1">Valor:</label>
              <input
                type="number"
                min="0"
                value={distVal}
                onChange={(e) => setDistVal(Math.max(0, parseFloat(e.target.value) || 0))}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl p-3 text-base text-white font-mono"
              />
            </div>

            <div className="sm:col-span-1">
              <label className="text-xs text-slate-400 block mb-1">De:</label>
              <select
                value={distFrom}
                onChange={(e) => setDistFrom(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl p-3 text-xs text-white font-mono"
              >
                <option value="km">Quilômetros (km)</option>
                <option value="m">Metros (m)</option>
                <option value="cm">Centímetros (cm)</option>
                <option value="mm">Milímetros (mm)</option>
                <option value="mi">Milhas (mi)</option>
                <option value="yd">Jardas (yd)</option>
                <option value="ft">Pés (ft)</option>
                <option value="in">Polegadas (in)</option>
              </select>
            </div>

            <div className="sm:col-span-2">
              <label className="text-xs text-slate-400 block mb-1">Para:</label>
              <select
                value={distTo}
                onChange={(e) => setDistTo(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl p-3 text-xs text-white font-mono"
              >
                <option value="mi">Milhas (mi)</option>
                <option value="km">Quilômetros (km)</option>
                <option value="m">Metros (m)</option>
                <option value="cm">Centímetros (cm)</option>
                <option value="mm">Milímetros (mm)</option>
                <option value="yd">Jardas (yd)</option>
                <option value="ft">Pés (ft)</option>
                <option value="in">Polegadas (in)</option>
              </select>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 text-center">
            <span className="text-xs text-slate-400 block mb-1">Resultado da Conversão:</span>
            <div className="text-2xl sm:text-3xl font-extrabold text-emerald-400 font-mono">
              {distVal} {distFrom} = {distResultado} {distTo}
            </div>
          </div>
        </div>
      )}

      {/* Card 2: Temperatura */}
      {activeTab === 'temperatura' && (
        <div className="bg-slate-900 border border-slate-700/80 rounded-3xl p-6 shadow-2xl space-y-5 animate-in fade-in">
          <div className="flex items-center gap-2 text-sm font-bold text-white pb-3 border-b border-slate-800">
            <Thermometer className="w-4 h-4 text-emerald-400" />
            <span>Conversor de Temperatura (com Trava de Zero Absoluto)</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-5 gap-3 items-center">
            <div className="sm:col-span-2">
              <label className="text-xs text-slate-400 block mb-1">Graus:</label>
              <input
                type="number"
                step="any"
                value={tempVal}
                onChange={(e) => setTempVal(parseFloat(e.target.value) || 0)}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl p-3 text-base text-white font-mono"
              />
            </div>

            <div className="sm:col-span-1">
              <label className="text-xs text-slate-400 block mb-1">De:</label>
              <select
                value={tempFrom}
                onChange={(e) => setTempFrom(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl p-3 text-xs text-white font-mono"
              >
                <option value="C">Celsius (°C)</option>
                <option value="F">Fahrenheit (°F)</option>
                <option value="K">Kelvin (K)</option>
              </select>
            </div>

            <div className="sm:col-span-2">
              <label className="text-xs text-slate-400 block mb-1">Para:</label>
              <select
                value={tempTo}
                onChange={(e) => setTempTo(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl p-3 text-xs text-white font-mono"
              >
                <option value="F">Fahrenheit (°F)</option>
                <option value="C">Celsius (°C)</option>
                <option value="K">Kelvin (K)</option>
              </select>
            </div>
          </div>

          {tempError ? (
            <div className="p-4 rounded-2xl bg-rose-950/60 border border-rose-500/50 text-rose-300 text-xs flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0" />
              <span>{tempError}</span>
            </div>
          ) : (
            <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 text-center">
              <span className="text-xs text-slate-400 block mb-1">Resultado:</span>
              <div className="text-2xl sm:text-3xl font-extrabold text-emerald-400 font-mono">
                {tempVal}°{tempFrom} = {tempResultado}°{tempTo}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Card 3: Moedas */}
      {activeTab === 'moeda' && (
        <div className="bg-slate-900 border border-slate-700/80 rounded-3xl p-6 shadow-2xl space-y-5 animate-in fade-in">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <div className="flex items-center gap-2 text-sm font-bold text-white">
              <Coins className="w-4 h-4 text-emerald-400" />
              <span>Conversor de Moedas (API com Fallback Offline)</span>
            </div>
            <span className="text-[11px] px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 flex items-center gap-1 font-mono">
              <ShieldCheck className="w-3 h-3" /> Resiliente
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-5 gap-3 items-center">
            <div className="sm:col-span-2">
              <label className="text-xs text-slate-400 block mb-1">Quantia:</label>
              <input
                type="number"
                min="0"
                value={curVal}
                onChange={(e) => setCurVal(Math.max(0, parseFloat(e.target.value) || 0))}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl p-3 text-base text-white font-mono"
              />
            </div>

            <div className="sm:col-span-1">
              <label className="text-xs text-slate-400 block mb-1">De:</label>
              <select
                value={curFrom}
                onChange={(e) => setCurFrom(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl p-3 text-xs text-white font-mono"
              >
                <option value="USD">USD (Dólar)</option>
                <option value="BRL">BRL (Real)</option>
                <option value="EUR">EUR (Euro)</option>
                <option value="GBP">GBP (Libra)</option>
                <option value="JPY">JPY (Iene)</option>
                <option value="CAD">CAD (Dólar Can.)</option>
              </select>
            </div>

            <div className="sm:col-span-2">
              <label className="text-xs text-slate-400 block mb-1">Para:</label>
              <select
                value={curTo}
                onChange={(e) => setCurTo(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl p-3 text-xs text-white font-mono"
              >
                <option value="BRL">BRL (Real)</option>
                <option value="USD">USD (Dólar)</option>
                <option value="EUR">EUR (Euro)</option>
                <option value="GBP">GBP (Libra)</option>
                <option value="JPY">JPY (Iene)</option>
                <option value="CAD">CAD (Dólar Can.)</option>
              </select>
            </div>
          </div>

          {moedaResultado && (
            <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-1 text-center">
              <div className="text-2xl sm:text-3xl font-extrabold text-emerald-400 font-mono">
                {moedaResultado.valorOriginal} {moedaResultado.moedaOrigem} = {moedaResultado.valorConvertido} {moedaResultado.moedaDestino}
              </div>
              <div className="text-xs text-slate-400">
                Taxa de Câmbio: 1 {moedaResultado.moedaOrigem} = {moedaResultado.taxaCambio} {moedaResultado.moedaDestino}
              </div>
              <div className="text-[11px] text-amber-400 font-medium pt-1">
                {moedaResultado.aviso}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

