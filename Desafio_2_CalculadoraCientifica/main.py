#!/usr/bin/env python3
"""Ponto de Entrada Principal da Calculadora Científica Modular.

Execução:
    python3 main.py
"""

import sys
from pathlib import Path

# Adiciona o diretório atual ao sys.path para garantir importações relativas e absolutas
BASE_DIR = Path(__file__).resolve().parent
if str(BASE_DIR) not in sys.path:
    sys.path.insert(0, str(BASE_DIR))

from app.ui.cli import loop_principal

if __name__ == "__main__":
    try:
        loop_principal()
    except KeyboardInterrupt:
        print("\n\nExecução interrompida pelo usuário (Ctrl+C). Encerrando.")
        sys.exit(0)

