"""Testes do Motor Matemático Científico."""

import pytest
import math
from app.core import scientific_math
from app.core.security import SecurityValidationError


class TestScientificMath:
    """Testes unitários para todas as funções matemáticas científicas."""

    def test_porcentagem(self):
        assert scientific_math.porcentagem(200, 15) == 30.0
        assert scientific_math.porcentagem(50, 100) == 50.0
        assert scientific_math.porcentagem(0, 50) == 0.0

    def test_potencia(self):
        assert scientific_math.potencia(2, 3) == 8.0
        assert scientific_math.potencia(5, 0) == 1.0
        assert scientific_math.potencia(4, 0.5) == 2.0
        assert scientific_math.potencia(2, -2) == 0.25

    def test_potencia_zero_elevado_negativo(self):
        with pytest.raises(ZeroDivisionError):
            scientific_math.potencia(0, -2)

    def test_raiz_quadrada(self):
        assert scientific_math.raiz_quadrada(144) == 12.0
        assert scientific_math.raiz_quadrada(0) == 0.0
        assert scientific_math.raiz_quadrada(2) == pytest.approx(1.41421356)

    def test_raiz_quadrada_negativo_lanca_erro(self):
        with pytest.raises(ValueError) as exc:
            scientific_math.raiz_quadrada(-9)
        assert "não pertence aos números reais" in str(exc.value)

    def test_raiz_cubica(self):
        assert scientific_math.raiz_cubica(27) == pytest.approx(3.0)
        assert scientific_math.raiz_cubica(-8) == pytest.approx(-2.0)
        assert scientific_math.raiz_cubica(0) == 0.0

    def test_raiz_n_esima(self):
        assert scientific_math.raiz_n_esima(16, 4) == pytest.approx(2.0)
        assert scientific_math.raiz_n_esima(-32, 5) == pytest.approx(-2.0)
        with pytest.raises(ValueError):
            scientific_math.raiz_n_esima(16, 0)  # índice 0
        with pytest.raises(ValueError):
            scientific_math.raiz_n_esima(-16, 2)  # raiz par de negativo

    def test_trigonometria_graus(self):
        assert scientific_math.seno(0, em_graus=True) == 0.0
        assert scientific_math.seno(90, em_graus=True) == 1.0
        assert scientific_math.cosseno(0, em_graus=True) == 1.0
        assert scientific_math.cosseno(90, em_graus=True) == 0.0
        assert scientific_math.tangente(45, em_graus=True) == pytest.approx(1.0)

    def test_trigonometria_radianos(self):
        assert scientific_math.seno(math.pi / 2, em_graus=False) == 1.0
        assert scientific_math.cosseno(math.pi, em_graus=False) == -1.0

    def test_tangente_indefinida(self):
        with pytest.raises(ValueError) as exc:
            scientific_math.tangente(90, em_graus=True)
        assert "tangente não é definida" in str(exc.value)

    def test_logaritmos(self):
        assert scientific_math.logaritmo_natural(math.e) == pytest.approx(1.0)
        assert scientific_math.logaritmo_base_10(1000) == pytest.approx(3.0)
        assert scientific_math.logaritmo_base_qualquer(16, 2) == pytest.approx(4.0)

    def test_logaritmo_invalidos(self):
        with pytest.raises(ValueError):
            scientific_math.logaritmo_natural(0)
        with pytest.raises(ValueError):
            scientific_math.logaritmo_base_10(-5)
        with pytest.raises(ValueError):
            scientific_math.logaritmo_base_qualquer(8, 1)  # base 1 inválida

    def test_fatorial(self):
        assert scientific_math.fatorial(0) == 1
        assert scientific_math.fatorial(5) == 120
        assert scientific_math.fatorial(10) == 3628800

    def test_fatorial_invalido_ou_negativo(self):
        with pytest.raises(ValueError):
            scientific_math.fatorial(-1)
        with pytest.raises(ValueError):
            scientific_math.fatorial(3.5)

    def test_conversor_bases(self):
        # 42 em binário, octal, decimal e hex
        assert scientific_math.converter_base("42", 10, 2) == "101010"
        assert scientific_math.converter_base("101010", 2, 10) == "42"
        assert scientific_math.converter_base("42", 10, 8) == "52"
        assert scientific_math.converter_base("52", 8, 10) == "42"
        assert scientific_math.converter_base("42", 10, 16) == "2A"
        assert scientific_math.converter_base("2A", 16, 10) == "42"
        assert scientific_math.converter_base("FF", 16, 2) == "11111111"

    def test_conversor_bases_invalidas(self):
        with pytest.raises(ValueError):
            scientific_math.converter_base("123", 3, 10)  # base 3 não suportada
        with pytest.raises(ValueError):
            scientific_math.converter_base("XYZ", 10, 2)  # dígito inválido

