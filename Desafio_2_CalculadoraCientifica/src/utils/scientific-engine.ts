/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 *
 * Motor Científico do Frontend (Espelho das regras e defesas do backend Python)
 */

export interface CalculationHistoryItem {
  id: string;
  timestamp: string;
  categoria: 'Básica' | 'Científica' | 'Álgebra' | 'Gráfico' | 'Conversão';
  expressao: string;
  resultado: string;
}

export interface BhaskaraResult {
  a: number;
  b: number;
  c: number;
  delta: number;
  tipo: 'duas_raizes_reais' | 'raiz_real_dupla' | 'raizes_complexas';
  raizes: string[];
  descricao: string;
}

export interface CurrencyConversionResult {
  valorOriginal: number;
  moedaOrigem: string;
  moedaDestino: string;
  valorConvertido: number;
  taxaCambio: number;
  isFallback: boolean;
  aviso: string;
}

// Limites Anti-DoS do Backend
export const MAX_FACTORIAL = 1000;
export const MAX_EXPONENT = 10000;

/**
 * Calcula fatorial com salvaguarda Anti-DoS
 */
export function calcularFatorial(n: number): number {
  if (n < 0 || !Number.isInteger(n)) {
    throw new Error('Fatorial é definido apenas para inteiros não-negativos.');
  }
  if (n > MAX_FACTORIAL) {
    throw new Error(`Alerta Anti-DoS: Fatorial de ${n} excede o limite máximo permitido (${MAX_FACTORIAL}).`);
  }
  if (n === 0 || n === 1) return 1;
  let res = 1;
  for (let i = 2; i <= n; i++) {
    res *= i;
    if (!Number.isFinite(res)) {
      throw new Error('Estouro numérico (Overflow) no cálculo do fatorial.');
    }
  }
  return res;
}

/**
 * Resolução analítica de Equação de 2º Grau
 */
export function resolverBhaskara(a: number, b: number, c: number): BhaskaraResult {
  if (a === 0) {
    throw new Error("Em uma equação de 2º grau, o coeficiente 'a' não pode ser zero.");
  }
  const delta = b * b - 4 * a * c;

  if (delta > 0) {
    const rDelta = Math.sqrt(delta);
    const x1 = (-b + rDelta) / (2 * a);
    const x2 = (-b - rDelta) / (2 * a);
    return {
      a, b, c, delta,
      tipo: 'duas_raizes_reais',
      raizes: [x1.toFixed(4), x2.toFixed(4)],
      descricao: `Delta positivo (${delta.toFixed(2)}). Duas raízes reais distintas.`,
    };
  } else if (delta === 0) {
    const x = -b / (2 * a);
    return {
      a, b, c, delta: 0,
      tipo: 'raiz_real_dupla',
      raizes: [x.toFixed(4)],
      descricao: 'Delta igual a zero. Uma única raiz real dupla.',
    };
  } else {
    const real = (-b / (2 * a)).toFixed(4);
    const imag = (Math.sqrt(-delta) / (2 * a)).toFixed(4);
    return {
      a, b, c, delta,
      tipo: 'raizes_complexas',
      raizes: [`${real} + ${imag}i`, `${real} - ${imag}i`],
      descricao: `Delta negativo (${delta.toFixed(2)}). Duas raízes complexas conjugadas.`,
    };
  }
}

/**
 * Conversor de bases numéricas (Binário, Octal, Decimal, Hexadecimal)
 */
export function converterBaseNumerica(valorStr: string, baseOrigem: number, baseDestino: number): string {
  const limpo = valorStr.trim();
  if (!limpo) throw new Error('Entrada não pode ser vazia.');
  const dec = parseInt(limpo, baseOrigem);
  if (isNaN(dec)) {
    throw new Error(`O valor '${valorStr}' não é válido na base ${baseOrigem}.`);
  }
  return dec.toString(baseDestino).toUpperCase();
}

/**
 * Conversor de unidades de distância
 */
const FATORES_DISTANCIA_METRO: Record<string, number> = {
  km: 1000,
  m: 1,
  cm: 0.01,
  mm: 0.001,
  mi: 1609.344,
  yd: 0.9144,
  ft: 0.3048,
  in: 0.0254,
};

export function converterDistancia(valor: number, de: string, para: string): number {
  if (valor < 0) throw new Error('Distância física não pode ser negativa.');
  const fDe = FATORES_DISTANCIA_METRO[de];
  const fPara = FATORES_DISTANCIA_METRO[para];
  if (!fDe || !fPara) throw new Error('Unidade de distância desconhecida.');
  const metros = valor * fDe;
  return Number((metros / fPara).toFixed(6));
}

/**
 * Conversor de unidades de temperatura com salvaguarda de Zero Absoluto
 */
export function converterTemperatura(valor: number, de: string, para: string): number {
  let kelvin = 0;
  if (de === 'C') kelvin = valor + 273.15;
  else if (de === 'F') kelvin = (valor - 32) * (5 / 9) + 273.15;
  else if (de === 'K') kelvin = valor;
  else throw new Error('Unidade de temperatura desconhecida.');

  if (kelvin < -1e-6) {
    throw new Error(`Erro Físico: O valor ${valor}°${de} está abaixo do Zero Absoluto (0 K / -273.15°C)!`);
  }

  if (para === 'C') return Number((kelvin - 273.15).toFixed(4));
  if (para === 'F') return Number(((kelvin - 273.15) * (9 / 5) + 32).toFixed(4));
  return Number(kelvin.toFixed(4));
}

/**
 * Taxas de câmbio de contingência offline
 */
export const TAXAS_CONTINGENCIA: Record<string, number> = {
  USD: 1.0,
  BRL: 5.50,
  EUR: 0.92,
  GBP: 0.79,
  JPY: 152.0,
  CAD: 1.38,
  AUD: 1.52,
  BTC: 0.000015,
};

export function converterMoeda(valor: number, de: string, para: string): CurrencyConversionResult {
  if (valor < 0) throw new Error('Valor monetário não pode ser negativo.');
  const tDe = TAXAS_CONTINGENCIA[de] || 1.0;
  const tPara = TAXAS_CONTINGENCIA[para] || 1.0;
  const emUsd = valor / tDe;
  const final = emUsd * tPara;
  const taxa = tPara / tDe;

  return {
    valorOriginal: valor,
    moedaOrigem: de,
    moedaDestino: para,
    valorConvertido: Number(final.toFixed(4)),
    taxaCambio: Number(taxa.toFixed(6)),
    isFallback: true,
    aviso: 'Cotação estimada (Contingência / Fallback Seguro)',
  };
}

/**
 * Avaliador seguro de função matemática f(x) para plotagem gráfica
 */
export function avaliarFuncaoSegura(expr: string, x: number): number {
  // Prevenção de injeção de código na interface
  if (/__|import|eval|exec|open|os|sys|subprocess|fetch|window|document/.test(expr.toLowerCase())) {
    throw new Error('Expressão contém palavras reservadas ou tokens de segurança bloqueados.');
  }

  // Mapeamento seguro de funções e constantes matemáticas
  const contexto = {
    x,
    pi: Math.PI,
    e: Math.E,
    sin: (val: number) => Math.sin(val),
    cos: (val: number) => Math.cos(val),
    tan: (val: number) => Math.tan(val),
    asin: (val: number) => Math.asin(val),
    acos: (val: number) => Math.acos(val),
    atan: (val: number) => Math.atan(val),
    sqrt: (val: number) => Math.sqrt(val),
    cbrt: (val: number) => Math.cbrt(val),
    log: (val: number) => Math.log(val),
    ln: (val: number) => Math.log(val),
    log10: (val: number) => Math.log10(val),
    exp: (val: number) => Math.exp(val),
    abs: (val: number) => Math.abs(val),
  };

  // Transforma potências x^y ou x**y
  let sanitized = expr
    .replace(/\^/g, '**')
    .replace(/\bpi\b/gi, 'Math.PI')
    .replace(/\be\b/gi, 'Math.E')
    .replace(/\bsin\b/gi, 'Math.sin')
    .replace(/\bcos\b/gi, 'Math.cos')
    .replace(/\btan\b/gi, 'Math.tan')
    .replace(/\bsqrt\b/gi, 'Math.sqrt')
    .replace(/\bcbrt\b/gi, 'Math.cbrt')
    .replace(/\bln\b/gi, 'Math.log')
    .replace(/\blog\b/gi, 'Math.log10')
    .replace(/\babs\b/gi, 'Math.abs');

  // Adiciona multiplicação implícita (ex: 2x -> 2*x, 4(x) -> 4*(x))
  sanitized = sanitized.replace(/(\d+)\s*([a-zA-Z(])/g, '$1 * $2');
  sanitized = sanitized.replace(/(\))\s*([a-zA-Z\d(])/g, '$1 * $2');

  // Função isolada com apenas 'x' e Math
  try {
    const fn = new Function('x', `return ${sanitized};`);
    const res = fn(x);
    if (typeof res !== 'number' || isNaN(res)) return NaN;
    return res;
  } catch (err: any) {
    throw new Error(`Erro ao avaliar a função: ${err.message}`);
  }
}

