"""Testes do Módulo de Plotagem de Gráficos (Matplotlib Headless e Memory Leak Prevention)."""

import pytest
import matplotlib.pyplot as plt
from pathlib import Path
from app.visualization import plotter
from app.core.security import SecurityValidationError


class TestPlotter:
    """Verifica a geração de gráficos, fechamento de buffers e integridade de memória."""

    def test_gerar_grafico_sucesso(self, tmp_path, monkeypatch):
        # Redireciona EXPORTS_DIR para tmp_path durante o teste
        monkeypatch.setattr("app.visualization.plotter.EXPORTS_DIR", tmp_path)

        caminho = plotter.gerar_grafico_funcao(
            expr_str="sin(x) * cos(x)",
            x_min=-5.0,
            x_max=5.0,
            pontos=100,
            nome_arquivo="grafico_teste.png",
        )

        assert caminho.exists()
        assert caminho.is_file()
        assert caminho.stat().st_size > 1000  # O PNG gerado possui dados reais de imagem

        # VERIFICAÇÃO CRÍTICA DE ANTI-MEMORY LEAK:
        # Garante que nenhum buffer de figura permaneceu aberto no Matplotlib
        assert len(plt.get_fignums()) == 0

    def test_gerar_grafico_funcao_polinomial(self, tmp_path, monkeypatch):
        monkeypatch.setattr("app.visualization.plotter.EXPORTS_DIR", tmp_path)

        caminho = plotter.gerar_grafico_funcao("x**2 - 4*x + 4", -2, 6, 50, "parabola.png")
        assert caminho.exists()
        assert len(plt.get_fignums()) == 0

    def test_intervalo_invalido_lanca_erro(self):
        with pytest.raises(ValueError) as exc:
            plotter.gerar_grafico_funcao("x**2", x_min=10, x_max=5)  # min > max
        assert "menor que x_max" in str(exc.value)

    def test_path_traversal_no_grafico_rejeitado(self):
        with pytest.raises(SecurityValidationError):
            plotter.gerar_grafico_funcao("x", nome_arquivo="../../malicioso.png")

