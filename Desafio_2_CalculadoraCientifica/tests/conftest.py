"""Configuração global de fixtures para o pytest."""

import sys
import tempfile
from pathlib import Path
import pytest

# Garante que a raiz do Desafio 2 esteja no PYTHONPATH
BASE_DIR = Path(__file__).resolve().parent.parent
if str(BASE_DIR) not in sys.path:
    sys.path.insert(0, str(BASE_DIR))

from app.storage.history_manager import HistoryManager


@pytest.fixture
def temp_history_file(tmp_path):
    """Fixture que fornece um arquivo de histórico isolado em diretório temporário."""
    history_file = tmp_path / "test_history.json"
    manager = HistoryManager(file_path=history_file)
    return manager

