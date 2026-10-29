/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { CodeViewer } from './components/CodeViewer';
import { InteractiveSimulator } from './components/InteractiveSimulator';
import { ConceptExplainer } from './components/ConceptExplainer';
import { QuizAndChallenges } from './components/QuizAndChallenges';
import { PYTHON_SOURCE_CODE } from './utils/calculator-simulator';
import { Check, Sparkles, BookOpen, Terminal, HelpCircle } from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState<'simulator' | 'concepts' | 'quiz'>('simulator');
  const [activeLine, setActiveLine] = useState<number | undefined>(undefined);
  const [copied, setCopied] = useState<boolean>(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Check query parameters (e.g. ?autostart=1 or ?tab=concepts)
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const tabParam = params.get('tab');
    if (tabParam === 'concepts' || tabParam === 'quiz' || tabParam === 'simulator') {
      setActiveTab(tabParam);
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
        onCopyCode={handleCopyCode}
        copied={copied}
        onDownloadCode={handleDownloadCode}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Banner with learning goal */}
        <div className="mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 rounded-2xl bg-slate-900/60 border border-slate-800">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 shrink-0">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <p className="text-xs text-slate-300">
                <strong className="text-white">Objetivo do Aprendizado:</strong> Compreender na prática como instruções
                sequenciais, variáveis e condições (<code className="text-purple-300 font-mono">if/elif/else</code>)
                trabalham juntas para resolver problemas.
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 text-xs text-slate-400 shrink-0">
            <span className="inline-block w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            Código com comentários em cada linha
          </div>
        </div>

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
            Tutor Python • Guia Didático de Programação para Iniciantes
          </div>
          <div className="flex items-center gap-4">
            <button
              onClick={() => setActiveTab('simulator')}
              className="hover:text-slate-300 transition-colors"
            >
              Simulador
            </button>
            <button
              onClick={() => setActiveTab('concepts')}
              className="hover:text-slate-300 transition-colors"
            >
              Explicação dos Componentes
            </button>
            <button
              onClick={() => setActiveTab('quiz')}
              className="hover:text-slate-300 transition-colors"
            >
              Quiz de Fixação
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
}
