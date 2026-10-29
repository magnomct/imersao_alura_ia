"""Conversor de Unidades de Medida (Distância e Temperatura).

Implementa conversões físicas com precisão matemática e validação de limites físicos:
- Distância: km, m, cm, mm, milha (mi), jarda (yd), pé (ft), polegada (in)
- Temperatura: Celsius (C), Fahrenheit (F), Kelvin (K) - com respeito ao Zero Absoluto!
"""

from typing import Union

Number = Union[int, float]

# Fatores de conversão de distância tendo o METRO como base padrão
FATORES_METRO = {
    "m": 1.0,
    "km": 1000.0,
    "cm": 0.01,
    "mm": 0.001,
    "mi": 1609.344,     # Milha terrestre
    "yd": 0.9144,       # Jarda
    "ft": 0.3048,       # Pé
    "in": 0.0254,       # Polegada
}


def converter_distancia(valor: Number, de: str, para: str) -> float:
    """Converte valores de distância entre diferentes unidades.

    Unidades aceitas: 'km', 'm', 'cm', 'mm', 'mi', 'yd', 'ft', 'in'.

    Raises:
        ValueError: Para unidades desconhecidas ou distâncias negativas.
    """
    if valor < 0:
        raise ValueError("Erro: Distância física não pode ser negativa.")

    u_de = de.lower().strip()
    u_para = para.lower().strip()

    if u_de not in FATORES_METRO:
        raise ValueError(f"Unidade de origem '{de}' desconhecida. Use: {', '.join(FATORES_METRO.keys())}")
    if u_para not in FATORES_METRO:
        raise ValueError(f"Unidade de destino '{para}' desconhecida. Use: {', '.join(FATORES_METRO.keys())}")

    # Converte para metros e depois para a unidade de destino
    valor_em_metros = valor * FATORES_METRO[u_de]
    valor_final = valor_em_metros / FATORES_METRO[u_para]
    return round(float(valor_final), 6)


# -------------------------------------------------------------
# Temperatura
# -------------------------------------------------------------

# Limite físico do Zero Absoluto em Kelvin
ZERO_ABSOLUTO_KELVIN = 0.0
ZERO_ABSOLUTO_CELSIUS = -273.15
ZERO_ABSOLUTO_FAHRENHEIT = -459.67


def converter_temperatura(valor: Number, de: str, para: str) -> float:
    """Converte valores de temperatura entre Celsius (C), Fahrenheit (F) e Kelvin (K).

    Valida o limite físico do Zero Absoluto (0 Kelvin).

    Raises:
        ValueError: Para unidades inválidas ou temperaturas abaixo do Zero Absoluto.
    """
    u_de = de.upper().strip()
    u_para = para.upper().strip()

    unidades_validas = {"C", "F", "K", "CELSIUS", "FAHRENHEIT", "KELVIN"}
    if u_de not in unidades_validas:
        raise ValueError(f"Unidade de origem '{de}' inválida. Use C, F ou K.")
    if u_para not in unidades_validas:
        raise ValueError(f"Unidade de destino '{para}' inválida. Use C, F ou K.")

    # Normaliza para C, F, K
    cod_de = "C" if "C" in u_de else ("F" if "F" in u_de else "K")
    cod_para = "C" if "C" in u_para else ("F" if "F" in u_para else "K")

    # 1. Converte qualquer temperatura de entrada para Kelvin (escala absoluta)
    if cod_de == "K":
        kelvin = float(valor)
    elif cod_de == "C":
        kelvin = valor + 273.15
    elif cod_de == "F":
        kelvin = (valor - 32.0) * (5.0 / 9.0) + 273.15
    else:
        raise ValueError("Unidade inválida.")

    # Validação do Zero Absoluto
    if kelvin < -1e-6:
        raise ValueError(
            f"Erro Físico: O valor {valor}°{cod_de} está abaixo do Zero Absoluto (0 Kelvin / -273.15°C)!"
        )

    # 2. Converte de Kelvin para a unidade de destino
    if cod_para == "K":
        return round(kelvin, 4)
    elif cod_para == "C":
        return round(kelvin - 273.15, 4)
    elif cod_para == "F":
        return round((kelvin - 273.15) * (9.0 / 5.0) + 32.0, 4)
    else:
        raise ValueError("Unidade inválida.")

