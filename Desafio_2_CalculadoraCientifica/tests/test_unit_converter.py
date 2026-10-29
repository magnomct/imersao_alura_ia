"""Testes do Conversor de Unidades (Distância e Temperatura)."""

import pytest
from app.integrations import unit_converter


class TestUnitConverter:
    """Verificação de conversões físicas de distância e temperatura."""

    def test_conversao_distancia_padroes(self):
        # 1 km = 1000 m
        assert unit_converter.converter_distancia(1, "km", "m") == 1000.0
        # 100 cm = 1 m
        assert unit_converter.converter_distancia(100, "cm", "m") == 1.0
        # 1 milha = ~1.609344 km
        assert unit_converter.converter_distancia(1, "mi", "km") == pytest.approx(1.609344)
        # 1 pé = 12 polegadas = 0.3048 m
        assert unit_converter.converter_distancia(1, "ft", "in") == pytest.approx(12.0)

    def test_distancia_negativa_lanca_erro(self):
        with pytest.raises(ValueError) as exc:
            unit_converter.converter_distancia(-10, "km", "m")
        assert "não pode ser negativa" in str(exc.value)

    def test_unidade_distancia_invalida(self):
        with pytest.raises(ValueError):
            unit_converter.converter_distancia(10, "anos_luz", "m")

    def test_conversao_temperatura(self):
        # 0°C = 32°F = 273.15 K
        assert unit_converter.converter_temperatura(0, "C", "F") == 32.0
        assert unit_converter.converter_temperatura(0, "C", "K") == 273.15
        # 100°C = 212°F
        assert unit_converter.converter_temperatura(100, "C", "F") == 212.0
        # 300 K para C
        assert unit_converter.converter_temperatura(300, "K", "C") == pytest.approx(26.85)

    def test_temperatura_abaixo_zero_absoluto_lanca_erro(self):
        # -300°C é menor que -273.15°C
        with pytest.raises(ValueError) as exc:
            unit_converter.converter_temperatura(-300, "C", "K")
        assert "Zero Absoluto" in str(exc.value)

        # -5 Kelvin é impossível
        with pytest.raises(ValueError) as exc:
            unit_converter.converter_temperatura(-5, "K", "C")
        assert "Zero Absoluto" in str(exc.value)

