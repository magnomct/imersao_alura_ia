"""Testes do Motor Algébrico (Bhaskara e SymPy Seguro)."""

import pytest
from app.core import algebra_engine


class TestAlgebraEngine:
    """Validação da resolução de equações e expressões simbólicas."""

    def test_bhaskara_duas_raizes_reais(self):
        # x² - 5x + 6 = 0 -> raízes 3 e 2
        sol = algebra_engine.resolver_equacao_segundo_grau(1, -5, 6)
        assert sol["tipo"] == "duas_raizes_reais"
        assert sol["delta"] == 1.0
        assert set(sol["raizes"]) == {3.0, 2.0}

    def test_bhaskara_raiz_dupla(self):
        # x² - 4x + 4 = 0 -> delta 0, raiz 2
        sol = algebra_engine.resolver_equacao_segundo_grau(1, -4, 4)
        assert sol["tipo"] == "raiz_real_dupla"
        assert sol["delta"] == 0.0
        assert sol["raizes"] == (2.0,)

    def test_bhaskara_raizes_complexas(self):
        # x² + 1 = 0 -> delta -4, raízes 0+1j e 0-1j
        sol = algebra_engine.resolver_equacao_segundo_grau(1, 0, 1)
        assert sol["tipo"] == "raizes_complexas"
        assert sol["delta"] == -4.0
        assert sol["raizes"][0].imag != 0

    def test_bhaskara_a_zero_lanca_erro(self):
        with pytest.raises(ValueError) as exc:
            algebra_engine.resolver_equacao_segundo_grau(0, 2, 4)
        assert "não pode ser zero" in str(exc.value)

    def test_simplificacao_expressao_simbolica(self):
        res = algebra_engine.resolver_expressao_algebrica("x**2 + 2*x + 1", valor_x=3)
        assert res["resultado_numerico"] == 16.0
        assert "x" in res["expressao_simplificada"]

    def test_resolver_equacao_simbolica(self):
        # x² - 9 = 0 -> -3, 3
        solucoes = algebra_engine.resolver_equacao_simbolica("x**2 - 9")
        assert "-3" in solucoes
        assert "3" in solucoes

