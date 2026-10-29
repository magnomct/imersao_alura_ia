"""Testes do Serviço de Moedas (Integração HTTP, Cache e Fallback Gracioso)."""

import pytest
from unittest.mock import patch, MagicMock
from requests.exceptions import Timeout, ConnectionError
from app.integrations.currency_service import CurrencyService, FALLBACK_RATES


class TestCurrencyService:
    """Verifica a resiliência e o comportamento de contingência do cliente de cotações."""

    def test_conversao_com_fallback_imediato(self):
        """Simula falha completa de rede e garante que o fallback opera normalmente."""
        service = CurrencyService(api_url="https://api-inexistente-123456.local/rates")

        resultado = service.converter(100, "USD", "BRL")
        assert resultado["valor_original"] == 100.0
        assert resultado["moeda_origem"] == "USD"
        assert resultado["moeda_destino"] == "BRL"
        assert resultado["is_fallback"] is True
        assert resultado["valor_convertido"] == 100 * FALLBACK_RATES["BRL"]

    @patch("requests.get")
    def test_sucesso_com_api_mockada(self, mock_get):
        """Simula resposta 200 OK da API e verifica o cálculo correto."""
        mock_response = MagicMock()
        mock_response.status_code = 200
        mock_response.json.return_value = {
            "rates": {"USD": 1.0, "BRL": 6.0, "EUR": 0.8}
        }
        mock_get.return_value = mock_response

        service = CurrencyService(cache_ttl=60)
        resultado = service.converter(50, "USD", "BRL")

        assert resultado["is_fallback"] is False
        assert resultado["valor_convertido"] == 300.0  # 50 * 6.0
        assert mock_get.call_count == 1

        # Segunda chamada imediata deve vir do cache local
        resultado_cache = service.converter(10, "USD", "EUR")
        assert resultado_cache["valor_convertido"] == 8.0  # 10 * 0.8
        assert mock_get.call_count == 1  # NÃO chamou a API novamente!

    @patch("requests.get")
    def test_degradacao_graciosa_em_timeout(self, mock_get):
        """Garante que a calculadora não trave quando a API sofre timeout."""
        mock_get.side_effect = Timeout("Gateway timeout")

        service = CurrencyService()
        resultado = service.converter(100, "USD", "EUR")

        assert resultado["is_fallback"] is True
        assert resultado["valor_convertido"] == 100 * FALLBACK_RATES["EUR"]

    def test_moeda_invalida_lanca_erro(self):
        service = CurrencyService()
        with pytest.raises(ValueError) as exc:
            service.converter(100, "MOEDA_FALSA", "USD")
        assert "não suportada" in str(exc.value)

    def test_valor_negativo_lanca_erro(self):
        service = CurrencyService()
        with pytest.raises(ValueError) as exc:
            service.converter(-50, "USD", "BRL")
        assert "não pode ser negativo" in str(exc.value)

