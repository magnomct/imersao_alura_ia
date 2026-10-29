"""Motor Matemático Científico.

Implementa funções científicas com precisão matemática, validações defensivas
e proteção contra estouro de limites:
- Porcentagem
- Exponenciação
- Raízes (quadrada, cúbica, n-ésima)
- Trigonometria (seno, cosseno, tangente em graus ou radianos)
- Logaritmos (natural, base 10 e base arbitrária)
- Fatoriais
- Conversão de bases numéricas (binário, octal, decimal, hexadecimal)
"""

import math
from typing import Union, Tuple
from app.core.security import validate_factorial_input, validate_exponent_input

Number = Union[int, float]


# -------------------------------------------------------------
# 1. Porcentagem e Exponenciação
# -------------------------------------------------------------

def porcentagem(valor: Number, porcento: Number) -> float:
    """Calcula 'porcento'% de 'valor'. Ex: 15% de 200 = 30.0."""
    return float((valor * porcento) / 100.0)


def potencia(base: Number, expoente: Number) -> float:
    """Calcula base elevada ao expoente (base ** expoente).

    Raises:
        ValueError: Para base 0 elevada a expoente negativo.
        SecurityValidationError: Se o expoente violar os limites Anti-DoS.
        OverflowError: Se o resultado exceder os limites numéricos do Python.
    """
    validate_exponent_input(base, expoente)

    if base == 0 and expoente < 0:
        raise ZeroDivisionError("Erro: Zero elevado a expoente negativo resulta em divisão por zero.")

    try:
        resultado = math.pow(base, expoente)
    except OverflowError as e:
        raise OverflowError(f"Erro: O cálculo de {base} ** {expoente} resultou em estouro numérico (Overflow).") from e

    return float(resultado)


# -------------------------------------------------------------
# 2. Raízes (Quadrada, Cúbica e N-ésima)
# -------------------------------------------------------------

def raiz_quadrada(x: Number) -> float:
    """Calcula a raiz quadrada de x.

    Raises:
        ValueError: Se x for negativo.
    """
    if x < 0:
        raise ValueError("Erro: Raiz quadrada de número negativo não pertence aos números reais.")
    return float(math.sqrt(x))


def raiz_cubica(x: Number) -> float:
    """Calcula a raiz cúbica de x, suportando números reais positivos e negativos."""
    if x < 0:
        return float(-math.pow(-x, 1.0 / 3.0))
    return float(math.pow(x, 1.0 / 3.0))


def raiz_n_esima(x: Number, n: int) -> float:
    """Calcula a raiz n-ésima de x.

    Raises:
        ValueError: Se n == 0 ou se x for negativo e n for par.
    """
    if n == 0:
        raise ValueError("Erro: O índice da raiz não pode ser zero.")

    if x < 0:
        if n % 2 == 0:
            raise ValueError(f"Erro: Raiz de índice par ({n}) de número negativo não é um número real.")
        return float(-math.pow(-x, 1.0 / n))

    return float(math.pow(x, 1.0 / n))


# -------------------------------------------------------------
# 3. Trigonometria (Graus ou Radianos)
# -------------------------------------------------------------

def seno(angulo: Number, em_graus: bool = True) -> float:
    """Calcula o seno do ângulo informado (padrão: em graus)."""
    rad = math.radians(angulo) if em_graus else float(angulo)
    res = math.sin(rad)
    return 0.0 if abs(res) < 1e-15 else round(res, 12)


def cosseno(angulo: Number, em_graus: bool = True) -> float:
    """Calcula o cosseno do ângulo informado (padrão: em graus)."""
    rad = math.radians(angulo) if em_graus else float(angulo)
    res = math.cos(rad)
    return 0.0 if abs(res) < 1e-15 else round(res, 12)


def tangente(angulo: Number, em_graus: bool = True) -> float:
    """Calcula a tangente do ângulo informado.

    Raises:
        ValueError: Se o ângulo for um ponto onde a tangente não é definida (ex: 90°, 270°).
    """
    rad = math.radians(angulo) if em_graus else float(angulo)
    cos_val = math.cos(rad)

    if abs(cos_val) < 1e-12:
        unidade = "graus" if em_graus else "radianos"
        raise ValueError(f"Erro: A tangente não é definida para {angulo} {unidade} (cosseno nulo).")

    res = math.tan(rad)
    return 0.0 if abs(res) < 1e-15 else round(res, 12)


# -------------------------------------------------------------
# 4. Logaritmos
# -------------------------------------------------------------

def logaritmo_natural(x: Number) -> float:
    """Calcula o logaritmo natural ln(x) (base e).

    Raises:
        ValueError: Se x <= 0.
    """
    if x <= 0:
        raise ValueError("Erro: O logaritmo natural só é definido para números estritamente positivos (x > 0).")
    return float(math.log(x))


def logaritmo_base_10(x: Number) -> float:
    """Calcula o logaritmo na base 10 (log10(x)).

    Raises:
        ValueError: Se x <= 0.
    """
    if x <= 0:
        raise ValueError("Erro: O logaritmo na base 10 só é definido para x > 0.")
    return float(math.log10(x))


def logaritmo_base_qualquer(x: Number, base: Number) -> float:
    """Calcula o logaritmo de x em uma base arbitrária (log_base(x)).

    Raises:
        ValueError: Se x <= 0, base <= 0 ou base == 1.
    """
    if x <= 0:
        raise ValueError("Erro: O logaritmando deve ser estritamente positivo (x > 0).")
    if base <= 0 or base == 1:
        raise ValueError("Erro: A base do logaritmo deve ser estritamente positiva e diferente de 1.")
    return float(math.log(x, base))


# -------------------------------------------------------------
# 5. Fatorial
# -------------------------------------------------------------

def fatorial(n: Union[int, float]) -> int:
    """Calcula o fatorial n! com validação Anti-DoS.

    Raises:
        ValueError: Para n negativo ou fracionário.
        SecurityValidationError: Se n exceder o limite seguro Anti-DoS.
    """
    n_seguro = validate_factorial_input(n)
    return math.factorial(n_seguro)


# -------------------------------------------------------------
# 6. Conversor de Bases Numéricas
# -------------------------------------------------------------

BASES_VALIDAS = {
    2: "binário",
    8: "octal",
    10: "decimal",
    16: "hexadecimal",
}


def converter_base(numero_str: str, base_origem: int, base_destino: int) -> str:
    """Converte um número entre as bases 2, 8, 10 e 16.

    Raises:
        ValueError: Caso a base seja inválida ou o número não corresponda à base de origem.
    """
    if base_origem not in BASES_VALIDAS:
        raise ValueError(f"Base de origem {base_origem} inválida. Use 2, 8, 10 ou 16.")
    if base_destino not in BASES_VALIDAS:
        raise ValueError(f"Base de destino {base_destino} inválida. Use 2, 8, 10 ou 16.")

    num_limpo = numero_str.strip()
    if not num_limpo:
        raise ValueError("O número a ser convertido não pode ser vazio.")

    # Converte da base de origem para decimal (inteiro nativo)
    try:
        valor_decimal = int(num_limpo, base_origem)
    except ValueError as e:
        raise ValueError(
            f"Erro: O valor '{numero_str}' não é um número válido na base {base_origem} ({BASES_VALIDAS[base_origem]})."
        ) from e

    # Converte de decimal para a base de destino
    if base_destino == 10:
        return str(valor_decimal)
    elif base_destino == 2:
        return bin(valor_decimal)[2:]  # Remove o prefixo 0b
    elif base_destino == 8:
        return oct(valor_decimal)[2:]  # Remove o prefixo 0o
    elif base_destino == 16:
        return hex(valor_decimal)[2:].upper()  # Remove o prefixo 0x e coloca em maiúsculas
    else:
        raise ValueError("Base não suportada.")

