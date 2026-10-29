"""Motor Algébrico e Resolução Simbólica com SymPy.

Implementa:
- Resolução analítica de Equações de 2º Grau (Fórmula de Bhaskara)
- Avaliação e simplificação segura de expressões algébricas usando SymPy
  (com proibição total de eval/exec e validação prévia de AST).
"""

from typing import Dict, List, Tuple, Union, Any
import sympy as sp
from app.core.security import validate_math_expression_ast, SecurityValidationError

Number = Union[int, float]


def resolver_equacao_segundo_grau(a: Number, b: Number, c: Number) -> Dict[str, Any]:
    """Resolve uma equação do segundo grau ax² + bx + c = 0 usando Bhaskara.

    Retorna um dicionário estruturado com delta, tipo de raízes e os valores calculados.

    Raises:
        ValueError: Se a == 0 (não é equação de 2º grau).
    """
    if a == 0:
        raise ValueError("Em uma equação de 2º grau, o coeficiente 'a' não pode ser zero.")

    delta = (b ** 2) - (4 * a * c)

    if delta > 0:
        raiz_delta = delta ** 0.5
        x1 = (-b + raiz_delta) / (2 * a)
        x2 = (-b - raiz_delta) / (2 * a)
        return {
            "a": a,
            "b": b,
            "c": c,
            "delta": delta,
            "tipo": "duas_raizes_reais",
            "raizes": (round(float(x1), 8), round(float(x2), 8)),
            "descricao": f"Delta positivo ({delta}). Duas raízes reais distintas.",
        }
    elif delta == 0:
        x = -b / (2 * a)
        return {
            "a": a,
            "b": b,
            "c": c,
            "delta": 0.0,
            "tipo": "raiz_real_dupla",
            "raizes": (round(float(x), 8),),
            "descricao": "Delta igual a zero. Uma única raiz real dupla.",
        }
    else:
        # Raízes complexas conjugadas
        parte_real = -b / (2 * a)
        parte_imaginaria = ((-delta) ** 0.5) / (2 * a)
        x1_complex = complex(round(parte_real, 8), round(parte_imaginaria, 8))
        x2_complex = complex(round(parte_real, 8), -round(parte_imaginaria, 8))
        return {
            "a": a,
            "b": b,
            "c": c,
            "delta": delta,
            "tipo": "raizes_complexas",
            "raizes": (x1_complex, x2_complex),
            "descricao": f"Delta negativo ({delta}). Duas raízes complexas conjugadas.",
        }


def parse_expressao_segura(expr_str: str) -> sp.Expr:
    """Converte com segurança uma string em uma expressão SymPy.

    Aplica validação AST rigorosa prévia. NÃO utiliza eval() ou exec().
    Utiliza parse_expr com transformações estritas e sem acesso a builtins.

    Raises:
        SecurityValidationError: Se a expressão violar as regras de segurança.
        ValueError: Se a sintaxe for inválida para o SymPy.
    """
    # 1. Validação estrita de AST sem executar código
    validate_math_expression_ast(expr_str)

    # 2. Dicionário controlado e seguro de símbolos e funções
    x, y, z = sp.symbols("x y z")
    safe_locals = {
        "x": x, "y": y, "z": z,
        "pi": sp.pi, "e": sp.E, "E": sp.E, "I": sp.I,
        "sin": sp.sin, "cos": sp.cos, "tan": sp.tan,
        "asin": sp.asin, "acos": sp.acos, "atan": sp.atan,
        "sqrt": sp.sqrt, "cbrt": sp.cbrt, "log": sp.log, "ln": sp.log,
        "exp": sp.exp, "abs": sp.Abs,
    }

    try:
        from sympy.parsing.sympy_parser import (
            parse_expr,
            standard_transformations,
            implicit_multiplication_application,
        )
        transformations = standard_transformations + (implicit_multiplication_application,)
        expr = parse_expr(
            expr_str,
            local_dict=safe_locals,
            transformations=transformations,
            evaluate=True,
        )
        return expr
    except Exception as e:
        raise ValueError(f"Não foi possível interpretar a expressão matemática: {str(e)}") from e


def resolver_expressao_algebrica(expr_str: str, valor_x: Union[Number, None] = None) -> Dict[str, Any]:
    """Avalia e simplifica uma expressão algébrica simbólica.

    Se valor_x for fornecido, substitui x pelo valor e calcula o resultado numérico.
    """
    expr = parse_expressao_segura(expr_str)
    simplificada = sp.simplify(expr)

    resultado_dict: Dict[str, Any] = {
        "expressao_original": expr_str,
        "expressao_simbolica": str(expr),
        "expressao_simplificada": str(simplificada),
    }

    if valor_x is not None:
        x = sp.Symbol("x")
        valor_calculado = simplificada.subs(x, valor_x).evalf()
        resultado_dict["valor_x"] = valor_x
        resultado_dict["resultado_numerico"] = float(valor_calculado)

    return resultado_dict


def resolver_equacao_simbolica(expr_str: str, variavel: str = "x") -> List[str]:
    """Resolve analiticamente uma equação f(var) = 0 para a variável especificada."""
    expr = parse_expressao_segura(expr_str)
    var = sp.Symbol(variavel)
    solucoes = sp.solve(expr, var)
    return [str(s) for s in solucoes]

