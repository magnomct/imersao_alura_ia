/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { runCalculator, generateExecutionTrace, PYTHON_SOURCE_CODE } from './calculator-simulator';

test('PYTHON_SOURCE_CODE matches disk file calculadora.py exactly', () => {
  const currentDir = import.meta.dirname;
  const filePath = path.resolve(currentDir, '../../calculadora.py');
  if (fs.existsSync(filePath)) {
    const diskContent = fs.readFileSync(filePath, 'utf-8').trim();
    assert.equal(PYTHON_SOURCE_CODE.trim(), diskContent);
  }
});

test('PYTHON_SOURCE_CODE has short comments on instructions and contains no def or loops', () => {
  assert.ok(PYTHON_SOURCE_CODE.includes('# '));
  assert.ok(!PYTHON_SOURCE_CODE.includes('def '));
  assert.ok(!PYTHON_SOURCE_CODE.includes('while '));
  assert.ok(!PYTHON_SOURCE_CODE.includes('for '));
  assert.ok(!PYTHON_SOURCE_CODE.includes('import '));
});

test('runCalculator correctly handles addition (+)', () => {
  const res = runCalculator(12, '+', 8);
  assert.equal(res.success, true);
  assert.equal(res.resultado, 20);
  assert.equal(res.variables.numero1, 12);
  assert.equal(res.variables.operacao, '+');
  assert.equal(res.variables.numero2, 8);
  assert.ok(res.outputLines.some(line => line.includes('Resultado: 12 + 8 = 20')));
});

test('runCalculator handles decimal numbers and negative values', () => {
  const resDec = runCalculator(10.5, '+', 2.5);
  assert.equal(resDec.success, true);
  assert.equal(resDec.resultado, 13);

  const resNeg = runCalculator(-5, '*', 4);
  assert.equal(resNeg.success, true);
  assert.equal(resNeg.resultado, -20);
});

test('runCalculator correctly handles subtraction (-)', () => {
  const res = runCalculator(50, '-', 15);
  assert.equal(res.success, true);
  assert.equal(res.resultado, 35);
  assert.ok(res.outputLines.some(line => line.includes('Resultado: 50 - 15 = 35')));
});

test('runCalculator correctly handles multiplication (*)', () => {
  const res = runCalculator(7, '*', 6);
  assert.equal(res.success, true);
  assert.equal(res.resultado, 42);
  assert.ok(res.outputLines.some(line => line.includes('Resultado: 7 * 6 = 42')));
});

test('runCalculator correctly handles division (/) with non-zero divisor', () => {
  const res = runCalculator(20, '/', 4);
  assert.equal(res.success, true);
  assert.equal(res.resultado, 5);
  assert.ok(res.outputLines.some(line => line.includes('Resultado: 20 / 4 = 5')));
});

test('runCalculator prevents division by zero with friendly Portuguese message', () => {
  const res = runCalculator(10, '/', 0);
  assert.equal(res.success, false);
  assert.equal(res.errorMessage, 'Erro: Não é possível dividir um número por zero!');
  assert.ok(res.outputLines.some(line => line.includes('Erro: Não é possível dividir um número por zero!')));
});

test('runCalculator catches invalid operation symbol', () => {
  const res = runCalculator(10, '%', 2);
  assert.equal(res.success, false);
  assert.ok(res.errorMessage?.includes('Operação inválida'));
});

test('generateExecutionTrace produces ordered steps with variable inspections for addition', () => {
  const steps = generateExecutionTrace(10, '+', 5);
  assert.ok(steps.length >= 6);
  assert.equal(steps[0].actionType, 'start');
  assert.equal(steps[0].lineNumber, 2);
  assert.equal(steps[steps.length - 1].actionType, 'end');
  assert.equal(steps[steps.length - 1].lineNumber, 53);

  const calcStep = steps.find(s => s.actionType === 'calc');
  assert.ok(calcStep);
  assert.equal(calcStep.variables.resultado, 15);
  assert.equal(calcStep.lineNumber, 16);
});

test('generateExecutionTrace correctly traces subtraction (-)', () => {
  const steps = generateExecutionTrace(50, '-', 18);
  const calcStep = steps.find(s => s.actionType === 'calc');
  assert.ok(calcStep);
  assert.equal(calcStep.variables.resultado, 32);
  assert.equal(calcStep.lineNumber, 23);
});

test('generateExecutionTrace correctly traces multiplication (*)', () => {
  const steps = generateExecutionTrace(7, '*', 6);
  const calcStep = steps.find(s => s.actionType === 'calc');
  assert.ok(calcStep);
  assert.equal(calcStep.variables.resultado, 42);
  assert.equal(calcStep.lineNumber, 30);
});

test('generateExecutionTrace correctly traces safe division (/)', () => {
  const steps = generateExecutionTrace(100, '/', 4);
  const calcStep = steps.find(s => s.actionType === 'calc');
  assert.ok(calcStep);
  assert.equal(calcStep.variables.resultado, 25);
  assert.equal(calcStep.lineNumber, 43);
});

test('generateExecutionTrace correctly traces division by zero prevention', () => {
  const steps = generateExecutionTrace(15, '/', 0);
  const errorStep = steps.find(s => s.actionType === 'error');
  assert.ok(errorStep);
  assert.equal(errorStep.lineNumber, 39);
  assert.ok(errorStep.variables.errorMessage?.includes('dividir um número por zero'));
  // Ensure no calc step occurred
  assert.equal(steps.find(s => s.actionType === 'calc'), undefined);
});

test('generateExecutionTrace correctly traces invalid operation', () => {
  const steps = generateExecutionTrace(10, '^', 3);
  const errorStep = steps.find(s => s.actionType === 'error');
  assert.ok(errorStep);
  assert.equal(errorStep.lineNumber, 50);
  assert.ok(errorStep.variables.errorMessage?.includes('Operação inválida'));
});
