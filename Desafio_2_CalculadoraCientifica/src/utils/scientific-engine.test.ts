/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import test from 'node:test';
import assert from 'node:assert/strict';
import {
  calcularFatorial,
  resolverBhaskara,
  converterBaseNumerica,
  converterDistancia,
  converterTemperatura,
  converterMoeda,
  avaliarFuncaoSegura,
} from './scientific-engine';

test('calcularFatorial com limites Anti-DoS', () => {
  assert.equal(calcularFatorial(0), 1);
  assert.equal(calcularFatorial(5), 120);
  assert.throws(() => calcularFatorial(-1), /não-negativos/);
  assert.throws(() => calcularFatorial(1001), /Anti-DoS/);
});

test('resolverBhaskara raízes reais e complexas', () => {
  // x² - 5x + 6 = 0 -> 2 e 3
  const resReais = resolverBhaskara(1, -5, 6);
  assert.equal(resReais.tipo, 'duas_raizes_reais');
  assert.deepEqual(resReais.raizes.sort(), ['2.0000', '3.0000']);

  // x² + 1 = 0 -> raízes complexas
  const resComplex = resolverBhaskara(1, 0, 1);
  assert.equal(resComplex.tipo, 'raizes_complexas');
  assert.ok(resComplex.raizes[0].includes('i'));
});

test('converterBaseNumerica bases 2, 8, 10, 16', () => {
  assert.equal(converterBaseNumerica('42', 10, 2), '101010');
  assert.equal(converterBaseNumerica('101010', 2, 10), '42');
  assert.equal(converterBaseNumerica('42', 10, 16), '2A');
  assert.equal(converterBaseNumerica('2A', 16, 10), '42');
});

test('converterDistancia', () => {
  assert.equal(converterDistancia(1, 'km', 'm'), 1000);
  assert.equal(converterDistancia(100, 'cm', 'm'), 1);
  assert.throws(() => converterDistancia(-5, 'km', 'm'), /não pode ser negativa/);
});

test('converterTemperatura com trava de Zero Absoluto', () => {
  assert.equal(converterTemperatura(0, 'C', 'F'), 32);
  assert.equal(converterTemperatura(0, 'C', 'K'), 273.15);
  assert.throws(() => converterTemperatura(-300, 'C', 'K'), /Zero Absoluto/);
  assert.throws(() => converterTemperatura(-10, 'K', 'C'), /Zero Absoluto/);
});

test('converterMoeda fallback contingência', () => {
  const res = converterMoeda(100, 'USD', 'BRL');
  assert.equal(res.valorConvertido, 550);
  assert.equal(res.isFallback, true);
});

test('avaliarFuncaoSegura com bloqueio de injeção e suporte a cos', () => {
  assert.equal(avaliarFuncaoSegura('x^2 + 1', 2), 5);
  assert.equal(avaliarFuncaoSegura('sin(pi / 2)', 0), 1);
  assert.equal(avaliarFuncaoSegura('sin(x) * cos(x)', 0), 0);
  assert.equal(avaliarFuncaoSegura('cos(0)', 0), 1);
  assert.throws(() => avaliarFuncaoSegura('window.alert(1)', 0), /segurança/);
  assert.throws(() => avaliarFuncaoSegura('os.system("ls")', 0), /segurança/);
});

