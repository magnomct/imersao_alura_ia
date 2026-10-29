"""Módulo de Configuração Centralizada e Políticas de Segurança.

Define limites matemáticos estritos (Anti-DoS), caminhos de diretórios
canônicos (Anti-Path Traversal) e parâmetros de rede e logging.
"""

from pathlib import Path
import logging
import os

# Diretórios base e canônicos
BASE_DIR = Path(__file__).resolve().parent.parent
DATA_DIR = (BASE_DIR / "data").resolve()
EXPORTS_DIR = (BASE_DIR / "exports").resolve()

# Criação garantida dos diretórios de trabalho
DATA_DIR.mkdir(parents=True, exist_ok=True)
EXPORTS_DIR.mkdir(parents=True, exist_ok=True)

HISTORY_FILE = DATA_DIR / "history.json"
LOG_FILE = DATA_DIR / "app.log"

# Limites de Segurança Anti-DoS Matemático
MAX_FACTORIAL_INPUT = 1000  # Evita bloqueio da CPU por fatoriais absurdos
MAX_EXPONENT_POWER = 10_000  # Limita base ** expoente
MAX_EXPRESSION_LENGTH = 250  # Tamanho máximo de expressões matemáticas digitadas
MAX_DECIMAL_PRECISION = 10   # Precisão para arredondamentos

# Parâmetros de Integração HTTP e Resiliência
CURRENCY_API_URL = "https://api.exchangerate-api.com/v4/latest/USD"
CURRENCY_TIMEOUT_SECONDS = (3.0, 5.0)  # (connect_timeout, read_timeout)
CURRENCY_CACHE_TTL_SECONDS = 3600      # 1 hora de TTL para cache de cotações


def setup_logging(level: int = logging.INFO) -> logging.Logger:
    """Configura logging estruturado com handlers para arquivo e terminal."""
    logger = logging.getLogger("CalculadoraCientifica")
    logger.setLevel(level)

    # Evita duplicação de handlers se já configurado
    if not logger.handlers:
        formatter = logging.Formatter(
            fmt="%(asctime)s [%(levelname)s] [%(name)s:%(funcName)s]: %(message)s",
            datefmt="%Y-%m-%d %H:%M:%S",
        )

        # File Handler seguro
        file_handler = logging.FileHandler(LOG_FILE, encoding="utf-8")
        file_handler.setLevel(logging.DEBUG)
        file_handler.setFormatter(formatter)
        logger.addHandler(file_handler)

        # Console Handler limpo
        console_handler = logging.StreamHandler()
        console_handler.setLevel(logging.INFO)
        console_handler.setFormatter(formatter)
        logger.addHandler(console_handler)

    return logger

