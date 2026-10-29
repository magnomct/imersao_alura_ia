"""Serviço de Cotações de Moedas com Resiliência, Cache Local e Fallback Seguro.

Implementa os pilares de Confiabilidade (Reliability) e Segurança do Well-Architected Framework:
1. Validação estrita de SSL/TLS (verify=True)
2. Timeouts estritos para prevenir bloqueio indefinido da aplicação
3. Cache local em memória com TTL (Time-To-Live) para performance e economia de recursos
4. Degradação Graciosa: Fallback seguro com taxas de contingência caso a API externa falhe
"""

import time
import logging
from typing import Dict, Any, Union, Tuple
import requests
from requests.exceptions import RequestException, Timeout, ConnectionError

from app.config import (
    CURRENCY_API_URL,
    CURRENCY_TIMEOUT_SECONDS,
    CURRENCY_CACHE_TTL_SECONDS,
)

logger = logging.getLogger("CalculadoraCientifica.CurrencyService")

# Taxas de contingência offline caso não haja conexão com a internet
FALLBACK_RATES: Dict[str, float] = {
    "USD": 1.0,
    "BRL": 5.50,
    "EUR": 0.92,
    "GBP": 0.79,
    "JPY": 152.0,
    "CAD": 1.38,
    "AUD": 1.52,
    "CHF": 0.88,
    "CNY": 7.25,
    "BTC": 0.000015,
}


class CurrencyService:
    """Cliente HTTP resiliente para consulta de taxas de câmbio."""

    def __init__(
        self,
        api_url: str = CURRENCY_API_URL,
        timeout: tuple = CURRENCY_TIMEOUT_SECONDS,
        cache_ttl: int = CURRENCY_CACHE_TTL_SECONDS,
    ):
        self.api_url = api_url
        self.timeout = timeout
        self.cache_ttl = cache_ttl
        self._cached_rates: Dict[str, float] = {}
        self._last_fetch_time: float = 0.0

    def obter_taxas(self) -> Tuple[Dict[str, float], bool]:
        """Obtém as taxas de câmbio em relação ao USD (base).

        Retorna:
            Tupla (taxas, is_fallback), onde is_fallback indica se as taxas são de contingência.
        """
        tempo_atual = time.time()

        # 1. Verifica se o cache em memória ainda é válido (TTL)
        if self._cached_rates and (tempo_atual - self._last_fetch_time < self.cache_ttl):
            logger.debug("Taxas de câmbio recuperadas do cache local (TTL ativo).")
            return self._cached_rates, False

        # 2. Tentativa de requisição HTTP segura
        try:
            logger.info("Consultando API externa de cotações em %s...", self.api_url)
            resposta = requests.get(
                self.api_url,
                timeout=self.timeout,
                verify=True,  # Exige validação de certificado SSL/TLS
                headers={"User-Agent": "CalculadoraCientifica/2.0"},
            )
            resposta.raise_for_status()
            dados = resposta.json()

            taxas_recebidas = dados.get("rates", {})
            if isinstance(taxas_recebidas, dict) and "USD" in taxas_recebidas:
                self._cached_rates = {k.upper(): float(v) for k, v in taxas_recebidas.items()}
                self._last_fetch_time = tempo_atual
                logger.info("Taxas de câmbio atualizadas via API com sucesso.")
                return self._cached_rates, False
            else:
                logger.warning("Formato inesperado no payload da API de câmbio.")
        except Timeout:
            logger.warning("Timeout ao conectar com a API de moedas (%s s). Ativando fallback.", self.timeout)
        except ConnectionError:
            logger.warning("Erro de conexão de rede com a API de moedas. Ativando fallback.")
        except RequestException as e:
            logger.warning("Erro na requisição da API de moedas (%s). Ativando fallback.", str(e))
        except Exception as e:
            logger.error("Erro inesperado ao processar cotações: %s. Ativando fallback.", str(e))

        # 3. Degradação Graciosa: Usa cache antigo ou fallback offline
        if self._cached_rates:
            logger.info("Utilizando taxas em cache anterior como contingência.")
            return self._cached_rates, True

        logger.info("Utilizando taxas estáticas de contingência (fallback offline).")
        return FALLBACK_RATES.copy(), True

    def converter(self, valor: Union[int, float], de: str, para: str) -> Dict[str, Any]:
        """Converte um valor monetário de uma moeda para outra.

        Raises:
            ValueError: Se o valor for negativo ou a moeda for desconhecida.
        """
        if valor < 0:
            raise ValueError("O valor monetário para conversão não pode ser negativo.")

        moeda_de = de.upper().strip()
        moeda_para = para.upper().strip()

        taxas, is_fallback = self.obter_taxas()

        if moeda_de not in taxas:
            raise ValueError(f"Moeda de origem '{de}' não suportada. Ex: USD, BRL, EUR, GBP.")
        if moeda_para not in taxas:
            raise ValueError(f"Moeda de destino '{para}' não suportada. Ex: USD, BRL, EUR, GBP.")

        # Conversão via USD como pivot
        taxa_de_usd = taxas[moeda_de]
        taxa_para_usd = taxas[moeda_para]

        # valor_em_usd = valor / taxa_de_usd
        # valor_final = valor_em_usd * taxa_para_usd
        valor_convertido = (valor / taxa_de_usd) * taxa_para_usd
        taxa_efetiva = taxa_para_usd / taxa_de_usd

        return {
            "valor_original": float(valor),
            "moeda_origem": moeda_de,
            "moeda_destino": moeda_para,
            "valor_convertido": round(valor_convertido, 4),
            "taxa_cambio": round(taxa_efetiva, 6),
            "is_fallback": is_fallback,
            "aviso": "Cotação estimada offline (fallback ativo)." if is_fallback else "Cotação oficial em tempo real.",
        }


# Instância singleton do serviço de câmbio
currency_service = CurrencyService()
