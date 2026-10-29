"""Testes de Segurança e Testes de Penetração Automatizados (AppSec & Anti-DoS)."""

import pytest
from pathlib import Path
from app.core import security
from app.core import scientific_math
from app.core import algebra_engine


class TestSecurityHardening:
    """Verifica as defesas ativas contra injeção de código, DoS e Path Traversal."""

    @pytest.mark.parametrize("payload", [
        "__import__('os').system('whoami')",
        "eval('2 + 2')",
        "exec('import sys')",
        "open('/etc/passwd').read()",
        "().__class__.__base__.__subclasses__()",
        "subprocess.Popen('ls')",
        "lambda x: x",
        "os.system('id')",
    ])
    def test_rejeicao_absoluta_code_injection(self, payload):
        """Assegura que qualquer tentativa de injeção de código seja bloqueada na AST."""
        with pytest.raises(security.SecurityValidationError):
            security.validate_math_expression_ast(payload)

        with pytest.raises((security.SecurityValidationError, ValueError)):
            algebra_engine.parse_expressao_segura(payload)

    def test_bloqueio_expressao_excessivamente_longa(self):
        expr_gigante = "1 + " * 300 + "1"
        with pytest.raises(security.SecurityValidationError) as exc:
            security.validate_math_expression_ast(expr_gigante)
        assert "muito longa" in str(exc.value)

    def test_anti_dos_fatorial_gigante(self):
        # 1001 excede o limite de 1000
        with pytest.raises(security.SecurityValidationError) as exc:
            scientific_math.fatorial(1001)
        assert "Anti-DoS" in str(exc.value)

        # 1000 é aceito e calculado rapidamente
        assert scientific_math.fatorial(1000) > 0

    def test_anti_dos_expoente_extremo(self):
        with pytest.raises(security.SecurityValidationError) as exc:
            scientific_math.potencia(2, 50000)
        assert "Anti-DoS" in str(exc.value)

    @pytest.mark.parametrize("caminho_malicioso", [
        "../../etc/passwd",
        "../../../root/.bashrc",
        "..\\..\\windows\\system32",
    ])
    def test_prevencao_path_traversal(self, tmp_path, caminho_malicioso):
        """Assegura que nomes de arquivos não possam escapar do diretório autorizado."""
        with pytest.raises(security.SecurityValidationError) as exc:
            # O sanitize_file_path extrai o basename e verifica containment
            caminho_sanitizado = security.sanitize_file_path(caminho_malicioso, tmp_path)
            # Garante que o caminho canônico resultante permanece filho de tmp_path
            assert caminho_sanitizado.resolve().is_relative_to(tmp_path.resolve())
            assert ".." not in caminho_sanitizado.name

