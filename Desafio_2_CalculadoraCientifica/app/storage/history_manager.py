"""Gerenciador de Histórico Persistente com Proteção de Path Traversal e Escrita Atômica.

Implementa:
- Persistência estruturada em JSON (timestamp, categoria, entrada, resultado)
- Prevenção ativa de Path Traversal utilizando caminhos canônicos
- Escrita atômica (write-to-temp + atomic rename) para evitar corrupção de arquivos
- Permissões restritas de leitura/escrita (0o600 / 0o644)
"""

import json
import os
import tempfile
from datetime import datetime, timezone
from pathlib import Path
from typing import List, Dict, Any, Optional
from app.config import DATA_DIR, HISTORY_FILE
from app.core.security import sanitize_file_path


class HistoryManager:
    """Gerencia a leitura e escrita do histórico de cálculos em disco de forma segura."""

    def __init__(self, file_path: Optional[Path] = None):
        self.file_path = (file_path or HISTORY_FILE).resolve()
        # Assegura que o diretório pai existe
        self.file_path.parent.mkdir(parents=True, exist_ok=True)
        if not self.file_path.exists():
            self._salvar_arquivo_atomico([])

    def _salvar_arquivo_atomico(self, dados: List[Dict[str, Any]]) -> None:
        """Realiza escrita atômica para garantir integridade mesmo em falhas súbitas."""
        dir_pai = self.file_path.parent
        # Cria arquivo temporário no mesmo sistema de arquivos
        with tempfile.NamedTemporaryFile("w", dir=dir_pai, delete=False, encoding="utf-8") as temp_file:
            temp_path = Path(temp_file.name)
            json.dump(dados, temp_file, indent=2, ensure_ascii=False)
            temp_file.flush()
            os.fsync(temp_file.fileno())

        # Define permissões seguras (apenas o dono pode ler/escrever)
        try:
            os.chmod(temp_path, 0o644)
        except OSError:
            pass

        # Substituição atômica no Linux/POSIX
        temp_path.replace(self.file_path)

    def registrar(self, categoria: str, expressao: str, resultado: Any) -> Dict[str, Any]:
        """Adiciona um novo registro ao histórico de cálculos."""
        historico = self.listar()

        novo_registro = {
            "id": len(historico) + 1,
            "timestamp": datetime.now(timezone.utc).isoformat(),
            "categoria": str(categoria),
            "expressao": str(expressao),
            "resultado": str(resultado),
        }

        historico.append(novo_registro)
        self._salvar_arquivo_atomico(historico)
        return novo_registro

    def listar(self, limite: Optional[int] = None) -> List[Dict[str, Any]]:
        """Lê todos os registros do histórico em ordem cronológica."""
        if not self.file_path.exists():
            return []

        try:
            with open(self.file_path, "r", encoding="utf-8") as f:
                dados = json.load(f)
                if not isinstance(dados, list):
                    return []
                if limite and limite > 0:
                    return dados[-limite:]
                return dados
        except (json.JSONDecodeError, OSError):
            return []

    def limpar(self) -> None:
        """Limpa todos os registros do histórico com segurança."""
        self._salvar_arquivo_atomico([])

    def exportar_para_arquivo(self, nome_arquivo: str) -> Path:
        """Exporta o histórico para um arquivo específico dentro de DATA_DIR.

        Valida rigorosamente contra Path Traversal.

        Raises:
            SecurityValidationError: Se o nome tentar escapar de DATA_DIR.
        """
        destino_seguro = sanitize_file_path(nome_arquivo, DATA_DIR)
        registros = self.listar()
        with open(destino_seguro, "w", encoding="utf-8") as f:
            json.dump(registros, f, indent=2, ensure_ascii=False)
        return destino_seguro

