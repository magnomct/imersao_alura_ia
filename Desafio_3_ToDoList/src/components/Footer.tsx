/**
 * @license
 * SPDX-License-Identifier: MIT
 * Copyright (c) 2026 Carlos Magno
 *
 * Rodapé Padronizado da Aplicação com Autoria e Licença MIT.
 */

import React from 'react';

export const Footer: React.FC = () => {
  return (
    <footer className="border-t border-slate-800 bg-slate-950 py-6 mt-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 flex flex-col md:flex-row items-center justify-between gap-3 text-xs text-slate-500">
        <div className="flex flex-wrap items-center justify-center md:justify-start gap-2 text-center md:text-left">
          <span>Desafio 3: To-Do List • Imersão IA Alura</span>
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

        <div className="text-[11px] text-slate-500 font-mono">
          React 19 + TypeScript + Vite
        </div>
      </div>
    </footer>
  );
};

