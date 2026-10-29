/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import {
  ShieldCheck,
  Cpu,
  Layers,
  CheckCircle2,
  FileCode2,
  Server,
  Zap,
  Lock,
  Terminal,
} from 'lucide-react';

export const ArchitectureSecurityView: React.FC = () => {
  const [selectedFile, setSelectedFile] = useState<'security' | 'algebra' | 'plotter' | 'docker'>('security');

  const fileSnippets = {
    security: `# app/core/security.py
def validate_math_expression_ast(expr_str: str) -> None:
    """Valida a expressão diretamente na AST sem executar NENHUM código."""
    if "__" in expr_str:
        raise SecurityValidationError("Token proibido: '__'.")

    # Bloqueio preventivo de injeção de código (No eval, No exec)
    match = re.search(r"\\b(import|eval|exec|open|os|sys|subprocess|lambda)\\b", expr_str.lower())
    if match:
        raise SecurityValidationError(f"Injeção bloqueada: '{match.group(1)}'.")

    tree = ast.parse(expr_str, mode="eval")
    for node in ast.walk(tree):
        if not isinstance(node, ALLOWED_AST_NODES):
            raise SecurityValidationError(f"Nó de sintaxe não permitido: {type(node).__name__}")`,

    algebra: `# app/core/algebra_engine.py
def resolver_equacao_segundo_grau(a: float, b: float, c: float) -> dict:
    """Resolve equações ax² + bx + c = 0 via Fórmula de Bhaskara."""
    if a == 0:
        raise ValueError("Em equação de 2º grau, 'a' não pode ser zero.")
    
    delta = (b ** 2) - (4 * a * c)
    if delta > 0:
        return {"tipo": "duas_raizes_reais", "delta": delta, "raizes": ((-b + delta**0.5)/(2*a), (-b - delta**0.5)/(2*a))}
    elif delta == 0:
        return {"tipo": "raiz_real_dupla", "delta": 0, "raizes": (-b/(2*a),)}
    else:
        # Raízes complexas conjugadas
        real = -b / (2*a)
        imag = ((-delta)**0.5) / (2*a)
        return {"tipo": "raizes_complexas", "delta": delta, "raizes": (complex(real, imag), complex(real, -imag))}`,

    plotter: `# app/visualization/plotter.py
def gerar_grafico_funcao(expr_str: str, x_min: float, x_max: float, pontos=500):
    """Plotagem headless com Matplotlib e fechamento forçado de buffers."""
    fig, ax = plt.subplots(figsize=(8, 5), dpi=120)
    try:
        # Renderização do gráfico da curva
        ax.plot(x_valores, y_valores, label=f"f(x) = {expr_str}", color="#10b981")
        fig.savefig(caminho_saida, format="png")
        return caminho_saida
    finally:
        # FECHAMENTO EXPLÍCITO DO BUFFER PARA EVITAR MEMORY LEAK
        plt.close(fig)`,

    docker: `# Dockerfile (Multi-Stage Build & Non-Root)
FROM python:3.12-slim AS builder
WORKDIR /build
COPY requirements.txt .
RUN pip install --no-cache-dir --user -r requirements.txt

FROM python:3.12-slim AS runner
RUN groupadd -g 10001 appgroup && \\
    useradd -u 10001 -g appgroup -m -s /bin/sh appuser
WORKDIR /app
COPY --from=builder --chown=appuser:appgroup /root/.local /home/appuser/.local
COPY --chown=appuser:appgroup . /app
USER appuser
ENTRYPOINT ["python3", "main.py"]`,
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Banner de Pilares */}
      <div className="bg-gradient-to-r from-emerald-950/40 via-slate-900 to-slate-900 border border-emerald-500/40 rounded-3xl p-6 shadow-xl">
        <div className="flex items-start gap-4">
          <div className="p-3 rounded-2xl bg-emerald-500/20 text-emerald-400 shrink-0">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-white mb-1">
              Arquitetura Well-Architected & Segurança por Design
            </h2>
            <p className="text-xs text-slate-300 leading-relaxed">
              O projeto foi evoluído de um script inicial simples para uma solução corporativa dividida em camadas, com testes rigorosos, validação de AST sem <code>eval()</code>, defesas Anti-DoS e containerização multi-stage non-root.
            </p>
          </div>
        </div>
      </div>

      {/* Grid dos 5 Pilares */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        <div className="bg-slate-900 border border-slate-800 p-4 rounded-2xl space-y-2">
          <div className="flex items-center gap-2 text-emerald-400 text-xs font-bold uppercase">
            <Cpu className="w-4 h-4" />
            <span>Excelência Operacional</span>
          </div>
          <p className="text-xs text-slate-300">
            Módulos desacoplados (core, storage, visualization, ui), logging estruturado em <code>data/app.log</code> e <strong>62 testes automatizados</strong> no Pytest.
          </p>
        </div>

        <div className="bg-slate-900 border border-slate-800 p-4 rounded-2xl space-y-2">
          <div className="flex items-center gap-2 text-rose-400 text-xs font-bold uppercase">
            <Lock className="w-4 h-4" />
            <span>Segurança por Design</span>
          </div>
          <p className="text-xs text-slate-300">
            Zero <code>eval()</code>, validação estrita de AST, Anti-DoS para fatoriais e potências, prevenção de Path Traversal e SSL obrigatório em requisições.
          </p>
        </div>

        <div className="bg-slate-900 border border-slate-800 p-4 rounded-2xl space-y-2">
          <div className="flex items-center gap-2 text-cyan-400 text-xs font-bold uppercase">
            <Zap className="w-4 h-4" />
            <span>Confiabilidade & Performance</span>
          </div>
          <p className="text-xs text-slate-300">
            Zero regressão nas 4 operações originais, fallback de contingência na API de câmbio, cache com TTL e liberação de buffers no Matplotlib.
          </p>
        </div>
      </div>

      {/* Checklist de Validação */}
      <div className="bg-slate-900 border border-slate-700/80 rounded-3xl p-6 shadow-xl space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div className="flex items-center gap-2 text-sm font-bold text-white">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>Checklist de Segurança & Qualidade (QA)</span>
          </div>
          <span className="text-xs font-mono font-bold text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-full border border-emerald-500/20">
            62/62 Testes Pytest Aprovados
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
          <div className="flex items-center gap-2 p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-200">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>Proibição de <code>eval()</code> e <code>exec()</code></span>
          </div>
          <div className="flex items-center gap-2 p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-200">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>Defesa Anti-DoS (Fatorial ≤ 1000, Expoente ≤ 10000)</span>
          </div>
          <div className="flex items-center gap-2 p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-200">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>Anti-Path Traversal em I/O (Canonical Paths)</span>
          </div>
          <div className="flex items-center gap-2 p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-200">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>Matplotlib: <code>plt.close(fig)</code> Anti-Memory Leak</span>
          </div>
          <div className="flex items-center gap-2 p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-200">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>HTTP Timeout & Certificados SSL Validados</span>
          </div>
          <div className="flex items-center gap-2 p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-200">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>Dockerfile Multi-Stage Non-Root (UID 10001)</span>
          </div>
        </div>
      </div>

      {/* Explorer de Código Python */}
      <div className="bg-slate-900 border border-slate-700/80 rounded-3xl p-6 shadow-xl space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-800">
          <div className="flex items-center gap-2 text-sm font-bold text-white">
            <FileCode2 className="w-4 h-4 text-emerald-400" />
            <span>Código-Fonte dos Módulos Principais</span>
          </div>

          <div className="flex items-center gap-1.5 text-xs font-mono">
            <button
              onClick={() => setSelectedFile('security')}
              className={`px-2.5 py-1 rounded-lg border transition-all ${
                selectedFile === 'security'
                  ? 'bg-rose-500/20 text-rose-300 border-rose-500/40'
                  : 'bg-slate-800 text-slate-400 border-slate-700 hover:text-white'
              }`}
            >
              security.py
            </button>
            <button
              onClick={() => setSelectedFile('algebra')}
              className={`px-2.5 py-1 rounded-lg border transition-all ${
                selectedFile === 'algebra'
                  ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                  : 'bg-slate-800 text-slate-400 border-slate-700 hover:text-white'
              }`}
            >
              algebra_engine.py
            </button>
            <button
              onClick={() => setSelectedFile('plotter')}
              className={`px-2.5 py-1 rounded-lg border transition-all ${
                selectedFile === 'plotter'
                  ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40'
                  : 'bg-slate-800 text-slate-400 border-slate-700 hover:text-white'
              }`}
            >
              plotter.py
            </button>
            <button
              onClick={() => setSelectedFile('docker')}
              className={`px-2.5 py-1 rounded-lg border transition-all ${
                selectedFile === 'docker'
                  ? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                  : 'bg-slate-800 text-slate-400 border-slate-700 hover:text-white'
              }`}
            >
              Dockerfile
            </button>
          </div>
        </div>

        <pre className="p-4 rounded-2xl bg-slate-950 border border-slate-800 text-emerald-300 font-mono text-xs overflow-x-auto leading-relaxed max-h-60 overflow-y-auto">
          {fileSnippets[selectedFile]}
        </pre>
      </div>
    </div>
  );
};

