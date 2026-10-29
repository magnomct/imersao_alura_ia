/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Header, AppTab } from './components/Header';
import { SimpleCalculator } from './components/SimpleCalculator';
import { CodeViewer } from './components/CodeViewer';
import { InteractiveSimulator } from './components/InteractiveSimulator';
import { ConceptExplainer } from './components/ConceptExplainer';
import { QuizAndChallenges } from './components/QuizAndChallenges';
import { PYTHON_SOURCE_CODE } from './utils/calculator-simulator';
import { Check, Sparkles, Calculator as CalculatorIcon, ArrowRight } from 'lucide-react';

export default function App() {
  // Starts with 'calculator' as requested (initial view showing only the calculator)
  const [activeTab, setActiveTab] = useState<AppTab>('calculator');
  const [showAllMenus, setShowAllMenus] = useState<boolean>(false);
  const [activeLine, setActiveLine] = useState<number | undefined>(undefined);
  const [copied, setCopied] = useState<boolean>(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Check query parameters (e.g. ?autostart=1 or ?tab=concepts)
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const tabParam = params.get('tab');
    if (tabParam === 'concepts' || tabParam === 'quiz' || tabParam === 'simulator') {
      setActiveTab(tabParam);
      setShowAllMenus(true);
    } else if (tabParam === 'calculator') {
      setActiveTab('calculator');
    }
  }, []);

  const handleCopyCode = async () => {
    try {
      await navigator.clipboard.writeText(PYTHON_SOURCE_CODE);
      setCopied(true);
      showToast('Código Python copiado para a área de transferência!');
      setTimeout(() => setCopied(false), 2500);
    } catch {
      // Fallback
      const textArea = document.createElement('textarea');
      textArea.value = PYTHON_SOURCE_CODE;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
      setCopied(true);
      showToast('Código Python copiado para a área de transferência!');
      setTimeout(() => setCopied(false), 2500);
    }
  };

  const handleDownloadCode = () => {
    const blob = new Blob([PYTHON_SOURCE_CODE], { type: 'text/x-python;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'calculadora.py';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    showToast('Download do arquivo calculadora.py iniciado!');
  };

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3000);
  };

  const handleOpenTutorMode = () => {
    setShowAllMenus(true);
    setActiveTab('simulator');
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

      {/* Main App Header */}
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        showAllMenus={showAllMenus}
        setShowAllMenus={setShowAllMenus}
        onCopyCode={handleCopyCode}
        copied={copied}
        onDownloadCode={handleDownloadCode}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Banner with learning goal / view mode indicator */}
        <div className="mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 rounded-2xl bg-slate-900/60 border border-slate-800">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 shrink-0">
              {activeTab === 'calculator' ? (
                <CalculatorIcon className="w-4 h-4" />
              ) : (
                <Sparkles className="w-4 h-4" />
              )}
            </div>
            <div>
              {activeTab === 'calculator' ? (
                <p className="text-xs text-slate-300">
                  <strong className="text-white">Modo Calculadora Direta:</strong> Faça cálculos imediatos com as quatro operações. Para visualizar o código Python correspondente, ative o Modo Tutor.
                </p>
              ) : (
                <p className="text-xs text-slate-300">
                  <strong className="text-white">Modo Tutor Ativo:</strong> Compreenda na prática como instruções sequenciais, variáveis e condições (<code className="text-purple-300 font-mono">if/elif/else</code>) trabalham juntas.
                </p>
              )}
            </div>
          </div>

          <div className="flex items-center gap-2 text-xs text-slate-400 shrink-0">
            {activeTab === 'calculator' ? (
              <button
                onClick={handleOpenTutorMode}
                className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition-colors cursor-pointer"
              >
                <span>Ver Código e Menus</span>
                <ArrowRight className="w-3 h-3" />
              </button>
            ) : (
              <>
                <span className="inline-block w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                Código com comentários em cada linha
              </>
            )}
          </div>
        </div>

        {/* Tab 0: Initial View - Simple Calculator Only */}
        {activeTab === 'calculator' && (
          <div className="py-2">
            <SimpleCalculator onOpenTutorMode={handleOpenTutorMode} />
          </div>
        )}

        {/* Tab 1: Code & Interactive Simulator */}
        {activeTab === 'simulator' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            {/* Left Column: Python Source Code (5 cols on desktop) */}
            <div className="lg:col-span-5 h-[620px] lg:h-[720px] sticky top-20">
              <CodeViewer
                activeLine={activeLine}
                onCopy={handleCopyCode}
                copied={copied}
              />
            </div>

            {/* Right Column: Interactive Simulator & Terminal (7 cols on desktop) */}
            <div className="lg:col-span-7">
              <InteractiveSimulator onStepChange={setActiveLine} />
            </div>
          </div>
        )}

        {/* Tab 2: Concepts & Deep Dive Breakdown */}
        {activeTab === 'concepts' && (
          <div className="py-2">
            <ConceptExplainer />
          </div>
        )}

        {/* Tab 3: Quiz & Student Challenges */}
        {activeTab === 'quiz' && (
          <div className="py-2">
            <QuizAndChallenges />
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-800/80 bg-slate-950 py-4 mt-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-slate-500">
          <div>
            Tutor Python • Calculadora Simples & Guia Didático de Programação
          </div>
          <div className="flex items-center gap-4">
            <button
              onClick={() => setActiveTab('calculator')}
              className="hover:text-slate-300 transition-colors cursor-pointer"
            >
              Calculadora
            </button>
            <button
              onClick={() => {
                setShowAllMenus(true);
                setActiveTab('simulator');
              }}
              className="hover:text-slate-300 transition-colors cursor-pointer"
            >
              Código & Simulador
            </button>
            <button
              onClick={() => {
                setShowAllMenus(true);
                setActiveTab('concepts');
              }}
              className="hover:text-slate-300 transition-colors cursor-pointer"
            >
              Guia de Conceitos
            </button>
            <button
              onClick={() => {
                setShowAllMenus(true);
                setActiveTab('quiz');
              }}
              className="hover:text-slate-300 transition-colors cursor-pointer"
            >
              Quiz de Fixação
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
}