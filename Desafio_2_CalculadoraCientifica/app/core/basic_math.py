"""Operações Matemáticas Básicas (Zero Regressão do Desafio 1).

Garante a exata compatibilidade com as quatro operações aritméticas originais:
adição (+), subtração (-), multiplicação (*) e divisão (/), agora com tipagem
estrita e validação de divisão por zero.
"""

from typing import Union

Number = Union[int, float]


def somar(a: Number, b: Number) -> float:
    """Calcula a soma de dois números (a + b)."""
    return float(a + b)


def subtrair(a: Number, b: Number) -> float:
    """Calcula a subtração de dois números (a - b)."""
    return float(a - b)


def multiplicar(a: Number, b: Number) -> float:
    """Calcula a multiplicação de dois números (a * b)."""
    return float(a * b)


def dividir(a: Number, b: Number) -> float:
    """Calcula a divisão de a por b (a / b).

    Raises:
        ZeroDivisionError: Se b for igual a 0.
    """
    if b == 0:
        raise ZeroDivisionError("Erro: Não é possível dividir um número por zero!")
    return float(a / b)


def executar_operacao_basica(a: Number, operacao: str, b: Number) -> float:
    """Executa a operação matemática correspondente ao símbolo digitado.

    Mantém 100% de paridade com o comportamento do Desafio 1.

    Raises:
        ValueError: Caso o operador seja inválido.
        ZeroDivisionError: Caso haja tentativa de divisão por zero.
    """
    op = operacao.strip()
    if op == "+":
        return somar(a, b)
    elif op == "-":
        return subtrair(a, b)
    elif op == "*":
        return multiplicar(a, b)
    elif op == "/":
        return dividir(a, b)
    else:
        raise ValueError(f"Erro: Operação inválida '{operacao}'! Use apenas +, -, * ou /.")

