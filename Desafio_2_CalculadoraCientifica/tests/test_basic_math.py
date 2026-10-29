"""Testes de Regressão: Operações Aritméticas Básicas (Zero Regressão do Desafio 1)."""

import pytest
from app.core import basic_math


class TestBasicMathZeroRegression:
    """Valida que todas as 4 operações originais comportam-se de forma 100% fiel."""

    def test_adicao_positivos_e_negativos(self):
        assert basic_math.somar(10, 5) == 15.0
        assert basic_math.somar(-7, 3) == -4.0
        assert basic_math.somar(0.1, 0.2) == pytest.approx(0.3)

    def test_subtracao(self):
        assert basic_math.subtrair(50, 18) == 32.0
        assert basic_math.subtrair(5, 10) == -5.0
        assert basic_math.subtrair(0, 0) == 0.0

    def test_multiplicacao(self):
        assert basic_math.multiplicar(7, 6) == 42.0
        assert basic_math.multiplicar(-4, 5) == -20.0
        assert basic_math.multiplicar(10, 0) == 0.0

    def test_divisao_valida(self):
        assert basic_math.dividir(20, 4) == 5.0
        assert basic_math.dividir(10, 3) == pytest.approx(3.3333333333333335)
        assert basic_math.dividir(-15, 3) == -5.0

    def test_divisao_por_zero_lanca_excecao(self):
        with pytest.raises(ZeroDivisionError) as exc_info:
            basic_math.dividir(15, 0)
        assert "dividir um número por zero" in str(exc_info.value)

    def test_executar_operacao_basica_despacho(self):
        assert basic_math.executar_operacao_basica(10, "+", 5) == 15.0
        assert basic_math.executar_operacao_basica(50, "-", 18) == 32.0
        assert basic_math.executar_operacao_basica(7, "*", 6) == 42.0
        assert basic_math.executar_operacao_basica(100, "/", 4) == 25.0

    def test_executar_operacao_basica_simbolo_invalido(self):
        with pytest.raises(ValueError) as exc_info:
            basic_math.executar_operacao_basica(10, "%", 2)
        assert "Operação inválida" in str(exc_info.value)

