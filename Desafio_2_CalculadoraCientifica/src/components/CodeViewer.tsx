/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useRef, useEffect } from 'react';
import { Copy, Check, Info } from 'lucide-react';
import { PYTHON_SOURCE_CODE } from '../utils/calculator-simulator';

interface CodeViewerProps {
  activeLine?: number;
  onCopy: () => void;
  copied: boolean;
}

export const CodeViewer: React.FC<CodeViewerProps> = ({
  activeLine,
  onCopy,
  copied,
}) => {
  const codeLines = PYTHON_SOURCE_CODE.split('\n');
  const activeLineRef = useRef<HTMLDivElement | null>(null);

  // Auto-scroll active line into view smoothly if in step-by-step mode
  useEffect(() => {
    if (activeLineRef.current) {
      activeLineRef.current.scrollIntoView({
        behavior: 'smooth',
        block: 'nearest',
      });
    }
  }, [activeLine]);

  // Syntax highlighter for Python tokens
  const highlightPythonLine = (line: string) => {
    // If it's a comment
    if (line.trim().startsWith('#')) {
      return <span className="text-emerald-400/90 italic">{line}</span>;
    }

    // Check inline comment
    const commentIndex = line.indexOf('#');
    if (commentIndex !== -1) {
      const codePart = line.slice(0, commentIndex);
      const commentPart = line.slice(commentIndex);
      return (
        <>
          {renderCodeTokens(codePart)}
          <span className="text-emerald-400/90 italic">{commentPart}</span>
        </>
      );
    }

    return renderCodeTokens(line);
  };

  const renderCodeTokens = (code: string) => {
    // Simple, reliable syntax token rendering
    const parts = code.split(/(".*?"|'.*?'|\b(?:if|elif|else|print|input|float)\b|[+\-*/=]+)/g);
    
    return parts.map((part, idx) => {
      if (!part) return null;

      if ((part.startsWith('"') && part.endsWith('"')) || (part.startsWith("'") && part.endsWith("'"))) {
        return <span key={idx} className="text-amber-300">{part}</span>;
      }
      if (['if', 'elif', 'else'].includes(part)) {
        return <span key={idx} className="text-purple-400 font-semibold">{part}</span>;
      }
      if (['print', 'input', 'float'].includes(part)) {
        return <span key={idx} className="text-cyan-400 font-medium">{part}</span>;
      }
      if (['+', '-', '*', '/', '==', '='].includes(part)) {
        return <span key={idx} className="text-rose-400 font-bold">{part}</span>;
      }
      return <span key={idx} className="text-slate-200">{part}</span>;
    });
  };

  return (
    <div className="flex flex-col h-full bg-slate-900 border border-slate-700/80 rounded-2xl overflow-hidden shadow-xl">
      {/* Code Header Bar */}
      <div className="flex items-center justify-between px-4 py-3 bg-slate-800/90 border-b border-slate-700/80">
        <div className="flex items-center gap-2">
          <div className="flex gap-1.5">
            <div className="w-3 h-3 rounded-full bg-rose-500/80" />
            <div className="w-3 h-3 rounded-full bg-amber-500/80" />
            <div className="w-3 h-3 rounded-full bg-emerald-500/80" />
          </div>
          <span className="text-xs font-mono font-medium text-slate-300 ml-2">
            calculadora.py
          </span>
          <span className="text-[10px] bg-slate-700 text-slate-300 px-1.5 py-0.5 rounded font-mono">
            Python 3
          </span>
        </div>

        <button
          onClick={onCopy}
          className="flex items-center gap-1.5 text-xs px-2.5 py-1 rounded bg-slate-700 hover:bg-slate-600 text-slate-200 transition-colors font-sans"
          aria-label="Copiar código fonte Python"
        >
          {copied ? (
            <>
              <Check className="w-3.5 h-3.5 text-emerald-400" />
              <span className="text-emerald-400 font-medium">Copiado!</span>
            </>
          ) : (
            <>
              <Copy className="w-3.5 h-3.5 text-slate-400" />
              <span>Copiar</span>
            </>
          )}
        </button>
      </div>

      {/* Code Body with line numbers */}
      <div className="flex-1 overflow-auto p-4 font-mono text-[13px] leading-6 bg-slate-950/70 select-text">
        {codeLines.map((line, idx) => {
          const lineNumber = idx + 1;
          const isActive = activeLine === lineNumber;

          return (
            <div
              key={idx}
              ref={isActive ? activeLineRef : null}
              className={`flex items-start group px-2 rounded transition-colors ${
                isActive
                  ? 'bg-yellow-500/15 border-l-2 border-yellow-400 text-yellow-200'
                  : 'hover:bg-slate-800/40'
              }`}
            >
              {/* Line indicator and number */}
              <div className="flex items-center gap-1 w-12 shrink-0 select-none text-slate-500 group-hover:text-slate-400 text-right pr-3 font-sans text-xs">
                {isActive ? (
                  <span className="text-yellow-400 text-xs animate-pulse">▶</span>
                ) : (
                  <span className="w-2.5"></span>
                )}
                <span className="flex-1">{lineNumber}</span>
              </div>

              {/* Code text */}
              <div className="flex-1 whitespace-pre overflow-x-auto">
                {highlightPythonLine(line)}
              </div>
            </div>
          );
        })}
      </div>

      {/* Bottom hint bar */}
      <div className="px-4 py-2.5 bg-slate-850 border-t border-slate-800 text-[11px] text-slate-400 flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-1.5">
          <Info className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
          <span>
            Cada instrução possui um <strong className="text-emerald-300">comentário (#)</strong> explicando seu papel.
          </span>
        </div>
        <div className="flex items-center gap-3 text-[11px]">
          <span className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-purple-400"></span> Condições (if/elif/else)
          </span>
          <span className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-cyan-400"></span> Funções nativas
          </span>
          <span className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-amber-300"></span> Textos (str)
          </span>
        </div>
      </div>
    </div>
  );
};
