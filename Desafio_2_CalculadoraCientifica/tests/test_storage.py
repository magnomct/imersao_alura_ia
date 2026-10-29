"""Testes do Gerenciador de Histórico Persistente (Storage Seguro)."""

import pytest
import json
from app.storage.history_manager import HistoryManager
from app.core.security import SecurityValidationError


class TestHistoryStorage:
    """Verifica a persistência de cálculos em formato JSON e integridade dos dados."""

    def test_registrar_e_listar(self, temp_history_file):
        manager = temp_history_file
        reg1 = manager.registrar("Básica", "10 + 5", 15.0)
        assert reg1["id"] == 1
        assert reg1["expressao"] == "10 + 5"
        assert reg1["resultado"] == "15.0"

        reg2 = manager.registrar("Científica", "2^3", 8.0)
        assert reg2["id"] == 2

        todos = manager.listar()
        assert len(todos) == 2
        assert todos[0]["expressao"] == "10 + 5"
        assert todos[1]["expressao"] == "2^3"

    def test_limite_de_listagem(self, temp_history_file):
        manager = temp_history_file
        for i in range(10):
            manager.registrar("Loop", f"x_{i}", i)

        ultimos_3 = manager.listar(limite=3)
        assert len(ultimos_3) == 3
        assert ultimos_3[-1]["expressao"] == "x_9"

    def test_limpar_historico(self, temp_history_file):
        manager = temp_history_file
        manager.registrar("Teste", "1+1", 2)
        assert len(manager.listar()) == 1

        manager.limpar()
        assert len(manager.listar()) == 0

    def test_exportar_para_arquivo_valido(self, temp_history_file):
        manager = temp_history_file
        manager.registrar("Básica", "5*5", 25)
        arquivo_exportado = manager.exportar_para_arquivo("backup_teste.json")
        assert arquivo_exportado.exists()

        with open(arquivo_exportado, "r", encoding="utf-8") as f:
            conteudo = json.load(f)
            assert len(conteudo) == 1
            assert conteudo[0]["resultado"] == "25"

    def test_exportar_com_path_traversal_rejeitado(self, temp_history_file):
        manager = temp_history_file
        with pytest.raises(SecurityValidationError):
            manager.exportar_para_arquivo("../../traversal.json")

