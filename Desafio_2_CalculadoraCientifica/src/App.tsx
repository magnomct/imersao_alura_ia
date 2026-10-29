/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Header, ScientificTab } from './components/Header';
import { ScientificKeypad } from './components/ScientificKeypad';
import { FunctionPlotterView } from './components/FunctionPlotterView';
import { ConvertersView } from './components/ConvertersView';
import { HistoryView } from './components/HistoryView';
import { ArchitectureSecurityView } from './components/ArchitectureSecurityView';
import { CalculationHistoryItem } from './utils/scientific-engine';
import {
  Check,
  ShieldCheck,
  Cpu,
  Lock,
  Layers,
  Terminal,
} from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState<ScientificTab>('calculator');
  const [copied, setCopied] = useState<boolean>(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Histórico persistente salvo no localStorage para a interface gráfica
  const [history, setHistory] = useState<CalculationHistoryItem[]>(() => {
    try {
      const saved = localStorage.getItem('calc_scientific_history');
      if (saved) return JSON.parse(saved);
    } catch {
      // Ignora falhas de leitura
    }
    return [
      {
        id: '1',
        timestamp: new Date().toLocaleTimeString(),
        categoria: 'Científica',
        expressao: 'sin(45°) + cos(45°)',
        resultado: '1.4142',
      },
      {
        id: '2',
        timestamp: new Date().toLocaleTimeString(),
        categoria: 'Álgebra',
        expressao: 'x² - 5x + 6 = 0',
        resultado: 'Raízes: 2.0, 3.0 (Δ = 1.0)',
      },
      {
        id: '3',
        timestamp: new Date().toLocaleTimeString(),
        categoria: 'Básica',
        expressao: '100 / 4',
        resultado: '25',
      },
    ];
  });

  useEffect(() => {
    try {
      localStorage.setItem('calc_scientific_history', JSON.stringify(history));
    } catch {
      // Ignore localStorage quotas
    }
  }, [history]);

  // Suporte a query params (ex: ?tab=plotter)
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const tabParam = params.get('tab') as ScientificTab;
    if (['calculator', 'plotter', 'converters', 'history', 'architecture'].includes(tabParam)) {
      setActiveTab(tabParam);
    }
  }, []);

  const handleRecordHistory = (
    categoria: CalculationHistoryItem['categoria'],
    expressao: string,
    resultado: string
  ) => {
    const newItem: CalculationHistoryItem = {
      id: Date.now().toString(),
      timestamp: new Date().toLocaleTimeString(),
      categoria,
      expressao,
      resultado,
    };
    setHistory((prev) => [newItem, ...prev].slice(0, 50));
  };

  const handleClearHistory = () => {
    setHistory([]);
    showToast('Histórico limpo com sucesso!');
  };

  const handleCopyCode = async () => {
    const pyCode = `# Calculadora Científica Modular v2.0
# Para executar via terminal:
# cd Desafio_2_CalculadoraCientifica
# python3 main.py
# pytest tests/ -v
`;
    try {
      await navigator.clipboard.writeText(pyCode);
      setCopied(true);
      showToast('Comandos e código copiados para a área de transferência!');
      setTimeout(() => setCopied(false), 2500);
    } catch {
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  const handleDownloadCode = () => {
    showToast('Acesse Desafio_2_CalculadoraCientifica/main.py para o script completo.');
  };

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3000);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-emerald-500/30 selection:text-emerald-200">
      {/* Toast Notification */}
      {toastMessage && (
        <div
          role="status"
          aria-live="polite"
          className="fixed bottom-6 right-6 z-50 flex items-center gap-2 bg-emerald-500 text-slate-950 px-4 py-2.5 rounded-xl font-medium text-xs shadow-2xl shadow-emerald-500/30 animate-in fade-in slide-in-from-bottom-2"
        >
          <Check className="w-4 h-4 stroke-[2.5]" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Header Científico */}
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onCopyCode={handleCopyCode}
        copied={copied}
        onDownloadCode={handleDownloadCode}
      />

      {/* Conteúdo Principal */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Banner de Status Well-Architected & AppSec */}
        <div className="mb-6 flex flex-col lg:flex-row lg:items-center justify-between gap-3 p-4 rounded-2xl bg-slate-900/60 border border-slate-800">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 shrink-0">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <div>
              <p className="text-xs text-slate-300">
                <strong className="text-white">Well-Architected Framework:</strong> Aplicação modular com <strong>62 testes Pytest</strong>, validação AST sem <code>eval()</code>, Anti-DoS e containerização multi-stage non-root.
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2 text-[11px] font-mono shrink-0">
            <span className="px-2.5 py-1 rounded-lg bg-emerald-950/60 text-emerald-300 border border-emerald-800/80 flex items-center gap-1">
              <Check className="w-3 h-3 text-emerald-400" /> 62 Pytest OK
            </span>
            <span className="px-2.5 py-1 rounded-lg bg-rose-950/60 text-rose-300 border border-rose-800/80 flex items-center gap-1">
              <Lock className="w-3 h-3 text-rose-400" /> No-Eval (AppSec)
            </span>
            <span className="px-2.5 py-1 rounded-lg bg-purple-950/60 text-purple-300 border border-purple-800/80 flex items-center gap-1">
              <Cpu className="w-3 h-3 text-purple-400" /> Anti-DoS Guard
            </span>
          </div>
        </div>

        {/* Tab 1: Calculadora Científica */}
        {activeTab === 'calculator' && (
          <div className="py-2">
            <ScientificKeypad onRecordHistory={handleRecordHistory} />
          </div>
        )}

        {/* Tab 2: Plotter Gráfico de Funções */}
        {activeTab === 'plotter' && (
          <div className="py-2">
            <FunctionPlotterView />
          </div>
        )}

        {/* Tab 3: Conversores & Moedas */}
        {activeTab === 'converters' && (
          <div className="py-2">
            <ConvertersView />
          </div>
        )}

        {/* Tab 4: Histórico Persistente */}
        {activeTab === 'history' && (
          <div className="py-2">
            <HistoryView history={history} onClearHistory={handleClearHistory} />
          </div>
        )}

        {/* Tab 5: Arquitetura & Segurança */}
        {activeTab === 'architecture' && (
          <div className="py-2">
            <ArchitectureSecurityView />
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-800/80 bg-slate-950 py-4 mt-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-3 text-xs text-slate-500">
          <div className="flex flex-wrap items-center gap-2">
            <span>Calculadora Científica Modular v2.0 • Alura Imersão IA</span>
            <span className="hidden sm:inline">•</span>
            <span>
              Desenvolvido por{' '}
              <strong className="text-slate-300">Carlos Magno</strong>
            </span>
            <span className="hidden sm:inline">•</span>
            <a
              href="https://github.com/magnomct"
              target="_blank"
              rel="noopener noreferrer"
              className="text-emerald-400 hover:text-emerald-300 transition-colors underline underline-offset-2"
            >
              GitHub
            </a>
            <span>•</span>
            <a
              href="https://www.linkedin.com/in/carlosmagnogcs/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-emerald-400 hover:text-emerald-300 transition-colors underline underline-offset-2"
            >
              LinkedIn
            </a>
            <span>•</span>
            <span className="text-slate-400">Licença MIT</span>
          </div>
          <div className="flex items-center gap-4">
            <button
              onClick={() => setActiveTab('calculator')}
              className="hover:text-slate-300 transition-colors cursor-pointer"
            >
              Calculadora
            </button>
            <button
              onClick={() => setActiveTab('plotter')}
              className="hover:text-slate-300 transition-colors cursor-pointer"
            >
              Gráficos f(x)
            </button>
            <button
              onClick={() => setActiveTab('converters')}
              className="hover:text-slate-300 transition-colors cursor-pointer"
            >
              Conversores
            </button>
            <button
              onClick={() => setActiveTab('history')}
              className="hover:text-slate-300 transition-colors cursor-pointer"
            >
              Histórico
            </button>
            <button
              onClick={() => setActiveTab('architecture')}
              className="hover:text-slate-300 transition-colors cursor-pointer"
            >
              Arquitetura & QA
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
}
