"""Camada de Segurança de Aplicação (AppSec) e Hardening.

Implementa defesas ativas alinhadas ao pilar de Segurança do Well-Architected Framework:
1. Proibição de eval() e exec()
2. Validação estrita de AST para expressões matemáticas (Whitelisting)
3. Proteção contra Denial of Service (Anti-DoS Matemático)
4. Prevenção de Path Traversal para operações de I/O em disco
"""

import ast
from pathlib import Path
from typing import Union
from app.config import (
    MAX_FACTORIAL_INPUT,
    MAX_EXPONENT_POWER,
    MAX_EXPRESSION_LENGTH,
)

# Nomes de identificadores permitidos em expressões matemáticas
ALLOWED_NAMES = {
    "x", "y", "z", "pi", "e", "E", "I",
    "sin", "cos", "tan", "asin", "acos", "atan",
    "sqrt", "cbrt", "log", "ln", "exp", "abs"
}

# Nós permitidos da Árvore Sintática Abstrata (AST)
ALLOWED_AST_NODES = (
    ast.Expression,
    ast.BinOp,
    ast.UnaryOp,
    ast.Constant,  # Para Python >= 3.8 (substitui ast.Num)
    ast.Name,
    ast.Load,
    ast.Add,
    ast.Sub,
    ast.Mult,
    ast.Div,
    ast.Pow,
    ast.USub,
    ast.UAdd,
    ast.Call,
)


class SecurityValidationError(ValueError):
    """Exceção levantada quando uma validação de segurança falha."""
    pass


def validate_math_expression_ast(expr_str: str) -> None:
    """Valida uma expressão matemática através da AST sem executar nenhum código.

    Proíbe incondicionalmente comandos maliciosos, injeção de código, acesso
    a atributos (__class__, __subclasses__), chamadas de sistema, etc.

    Raises:
        SecurityValidationError: Caso a expressão contenha sintaxe ou elementos proibidos.
    """
    if not isinstance(expr_str, str):
        raise SecurityValidationError("A expressão matemática deve ser uma string de texto.")

    expr = expr_str.strip()
    if not expr:
        raise SecurityValidationError("A expressão não pode estar vazia.")

    if len(expr) > MAX_EXPRESSION_LENGTH:
        raise SecurityValidationError(
            f"Expressão muito longa ({len(expr)} caracteres). Máximo permitido: {MAX_EXPRESSION_LENGTH}."
        )

    # Bloqueio antecipado de palavras e símbolos suspeitos
    if "__" in expr:
        raise SecurityValidationError("Token de segurança proibido detectado: '__'.")

    import re
    suspicious_match = re.search(r"\b(import|eval|exec|open|os|sys|subprocess|lambda)\b", expr.lower())
    if suspicious_match:
        raise SecurityValidationError(f"Token de segurança proibido detectado: '{suspicious_match.group(1)}'.")

    try:
        tree = ast.parse(expr, mode="eval")
    except SyntaxError as e:
        raise SecurityValidationError(f"Sintaxe matemática inválida: {e.msg}") from e

    # Percorre toda a árvore sintática para verificar cada nó
    for node in ast.walk(tree):
        if not isinstance(node, ALLOWED_AST_NODES):
            raise SecurityValidationError(
                f"Elemento de sintaxe não permitido na expressão: {type(node).__name__}"
            )

        # Se for uma chamada de função (ex: sin(x), sqrt(x))
        if isinstance(node, ast.Call):
            if not isinstance(node.func, ast.Name):
                raise SecurityValidationError("Apenas chamadas a funções matemáticas nomeadas são permitidas.")
            if node.func.id not in ALLOWED_NAMES:
                raise SecurityValidationError(f"Função matemática não permitida: '{node.func.id}'.")

        # Se for uma variável ou constante simbólica (ex: x, pi, e)
        if isinstance(node, ast.Name):
            if node.id not in ALLOWED_NAMES:
                raise SecurityValidationError(f"Variável ou símbolo não reconhecido: '{node.id}'.")


def validate_factorial_input(n: Union[int, float]) -> int:
    """Valida o operando do fatorial para evitar Denial of Service (Anti-DoS).

    Raises:
        ValueError: Se n for negativo ou não for inteiro.
        SecurityValidationError: Se n exceder o limite de segurança.
    """
    if not isinstance(n, int):
        if isinstance(n, float) and n.is_integer():
            n = int(n)
        else:
            raise ValueError("O fatorial só é definido para números inteiros não negativos.")

    if n < 0:
        raise ValueError("Não é possível calcular o fatorial de um número negativo.")

    if n > MAX_FACTORIAL_INPUT:
        raise SecurityValidationError(
            f"Alerta Anti-DoS: Fatorial de {n} excede o limite máximo permitido de {MAX_FACTORIAL_INPUT}."
        )

    return n


def validate_exponent_input(base: Union[int, float], exp: Union[int, float]) -> None:
    """Valida potenciação para prevenir sobrecarga de CPU e estouro de memória (Anti-DoS).

    Raises:
        SecurityValidationError: Se o expoente ultrapassar o limiar seguro.
    """
    if abs(exp) > MAX_EXPONENT_POWER:
        raise SecurityValidationError(
            f"Alerta Anti-DoS: Expoente {exp} excede a magnitude máxima segura de {MAX_EXPONENT_POWER}."
        )


def sanitize_file_path(target_filename: str, base_directory: Path) -> Path:
    """Garante que o caminho de arquivo esteja estritamente contido no diretório autorizado.

    Previne vulnerabilidades de Path Traversal (ex.: '../../etc/passwd').

    Raises:
        SecurityValidationError: Se houver tentativa de escape do diretório base.
    """
    if not isinstance(target_filename, str) or not target_filename.strip():
        raise SecurityValidationError("Nome de arquivo inválido ou vazio.")

    # Rejeição imediata de separadores de diretório e sequências de navegação relativa
    if ".." in target_filename or "/" in target_filename or "\\" in target_filename:
        raise SecurityValidationError(
            f"Tentativa de Path Traversal detectada: '{target_filename}' contém caracteres de navegação proibidos."
        )

    base_canonical = base_directory.resolve()
    clean_name = Path(target_filename.strip()).name
    if not clean_name:
        raise SecurityValidationError("Nome de arquivo inválido.")

    target_path = (base_canonical / clean_name).resolve()

    try:
        # Verifica se o caminho canônico é estritamente filho do diretório base
        target_path.relative_to(base_canonical)
    except ValueError as e:
        raise SecurityValidationError(
            f"Tentativa de escape de diretório detectada: '{target_filename}'."
        ) from e

    return target_path
