"""Plotter de Funções Matemáticas com Matplotlib.

Projetado com boas práticas de engenharia e confiabilidade:
1. Backend 'Agg' (Headless) seguro para rodar em containers e servidores sem display X11
2. Fechamento explícito e determinístico de buffers (plt.close) para evitar Memory Leaks
3. Prevenção de Path Traversal no salvamento de arquivos PNG
4. Validação prévia de AST da função matemática
"""

from pathlib import Path
from typing import Union
import matplotlib
# Configura backend headless antes de importar pyplot
matplotlib.use("Agg")
import matplotlib.pyplot as plt
import numpy as np
import sympy as sp

from app.config import EXPORTS_DIR
from app.core.security import sanitize_file_path
from app.core.algebra_engine import parse_expressao_segura


def gerar_grafico_funcao(
    expr_str: str,
    x_min: float = -10.0,
    x_max: float = 10.0,
    pontos: int = 500,
    nome_arquivo: str = "grafico_funcao.png",
) -> Path:
    """Gera e salva em disco o gráfico da função matemática informada.

    Garante o fechamento do buffer do Matplotlib através de bloco try...finally.

    Raises:
        ValueError: Se os limites x_min/x_max forem inconsistentes.
        SecurityValidationError: Caso haja violação de segurança ou Path Traversal.
    """
    if x_min >= x_max:
        raise ValueError("O limite inferior x_min deve ser estritamente menor que x_max.")

    if pontos < 10 or pontos > 5000:
        raise ValueError("A quantidade de pontos deve estar entre 10 e 5000.")

    # 1. Sanitização do caminho de saída
    caminho_saida = sanitize_file_path(nome_arquivo, EXPORTS_DIR)

    # 2. Parse seguro da expressão
    expr = parse_expressao_segura(expr_str)
    x_sym = sp.Symbol("x")

    # 3. Conversão para função numpy vetorizada de alta performance
    funcao_numpy = sp.lambdify(x_sym, expr, modules=["numpy", "math"])

    # 4. Geração dos pontos da malha
    x_valores = np.linspace(x_min, x_max, pontos)

    try:
        y_valores = funcao_numpy(x_valores)
        # Garante array 1D mesmo se a função for constante (ex: f(x) = 5)
        if np.isscalar(y_valores):
            y_valores = np.full_like(x_valores, float(y_valores))
    except Exception as e:
        raise ValueError(f"Erro ao avaliar a função no intervalo numérico: {str(e)}") from e

    # 5. Renderização controlada do Matplotlib com liberação explícita de memória
    fig, ax = plt.subplots(figsize=(8, 5), dpi=120)
    try:
        # Estilo escuro elegante
        fig.patch.set_facecolor("#0b0f19")
        ax.set_facecolor("#111827")

        # Traçado da curva
        ax.plot(x_valores, y_valores, label=f"f(x) = {expr_str}", color="#10b981", linewidth=2.0)

        # Linhas de eixos cartesianos x=0 e y=0
        ax.axhline(0, color="#4b5563", linestyle="--", linewidth=0.8, alpha=0.7)
        ax.axvline(0, color="#4b5563", linestyle="--", linewidth=0.8, alpha=0.7)

        # Configurações de grid e rótulos
        ax.grid(True, linestyle=":", alpha=0.4, color="#6b7280")
        ax.set_title(f"Gráfico da Função: f(x) = {expr_str}", color="#f3f4f6", fontsize=13, fontweight="bold", pad=12)
        ax.set_xlabel("Eixo X", color="#9ca3af", fontsize=10)
        ax.set_ylabel("f(x)", color="#9ca3af", fontsize=10)
        ax.tick_params(colors="#9ca3af")
        ax.legend(facecolor="#1f2937", edgecolor="#374151", labelcolor="#f3f4f6")

        fig.tight_layout()
        fig.savefig(caminho_saida, format="png", facecolor=fig.get_facecolor(), edgecolor="none")
        return caminho_saida
    finally:
        # FECHAMENTO EXPLÍCITO DO BUFFER PARA EVITAR MEMORY LEAK
        plt.close(fig)

