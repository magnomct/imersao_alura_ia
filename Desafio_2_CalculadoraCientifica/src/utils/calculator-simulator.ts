/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface CalculatorState {
  numero1?: number;
  operacao?: string;
  numero2?: number;
  resultado?: number;
  errorMessage?: string;
}

export interface ExecutionStep {
  stepNumber: number;
  lineNumber: number;
  codeLine: string;
  explanation: string;
  variables: CalculatorState;
  terminalOutput: string[];
  actionType: 'start' | 'input' | 'condition-check' | 'calc' | 'print' | 'error' | 'end';
}

export interface CalculatorResult {
  success: boolean;
  resultado?: number;
  errorMessage?: string;
  outputLines: string[];
  variables: CalculatorState;
}

export const PYTHON_SOURCE_CODE = `# Mensagem de boas-vindas da calculadora
print("=== Calculadora Simples em Python ===")

# Solicita o primeiro número ao usuário e converte o texto para decimal (float)
numero1 = float(input("Digite o primeiro número: "))

# Solicita a operação matemática desejada (+, -, *, /) como texto
operacao = input("Digite a operação (+, -, *, /): ")

# Solicita o segundo número ao usuário e converte para decimal (float)
numero2 = float(input("Digite o segundo número: "))

# Verifica se a operação escolhida pelo usuário é soma (+)
if operacao == "+":
    # Realiza a adição entre os dois números
    resultado = numero1 + numero2
    # Exibe na tela o cálculo e o resultado final
    print("Resultado:", numero1, "+", numero2, "=", resultado)

# Verifica se a operação escolhida pelo usuário é subtração (-)
elif operacao == "-":
    # Realiza a subtração entre os dois números
    resultado = numero1 - numero2
    # Exibe na tela o cálculo e o resultado final
    print("Resultado:", numero1, "-", numero2, "=", resultado)

# Verifica se a operação escolhida pelo usuário é multiplicação (*)
elif operacao == "*":
    # Realiza a multiplicação entre os dois números
    resultado = numero1 * numero2
    # Exibe na tela o cálculo e o resultado final
    print("Resultado:", numero1, "*", numero2, "=", resultado)

# Verifica se a operação escolhida pelo usuário é divisão (/)
elif operacao == "/":
    # Verifica se o segundo número é zero para prevenir erro matemático
    if numero2 == 0:
        # Alerta o usuário que divisão por zero não é permitida
        print("Erro: Não é possível dividir um número por zero!")
    # Caso o segundo número seja válido (diferente de zero)
    else:
        # Realiza a divisão entre os dois números
        resultado = numero1 / numero2
        # Exibe na tela o cálculo e o resultado final
        print("Resultado:", numero1, "/", numero2, "=", resultado)

# Caso o usuário digite um símbolo diferente das quatro operações
else:
    # Exibe uma mensagem informando que a operação digitada não é válida
    print("Erro: Operação inválida! Use apenas +, -, * ou /.")

# Mensagem final indicando o término da execução do programa
print("=== Fim do Programa ===")`;

export function runCalculator(n1: number, op: string, n2: number): CalculatorResult {
  const outputLines: string[] = [];
  outputLines.push("=== Calculadora Simples em Python ===");
  outputLines.push(`Digite o primeiro número: ${n1}`);
  outputLines.push(`Digite a operação (+, -, *, /): ${op}`);
  outputLines.push(`Digite o segundo número: ${n2}`);

  const variables: CalculatorState = {
    numero1: n1,
    operacao: op,
    numero2: n2,
  };

  if (op === "+") {
    const res = n1 + n2;
    variables.resultado = res;
    outputLines.push(`Resultado: ${n1} + ${n2} = ${res}`);
    outputLines.push("=== Fim do Programa ===");
    return { success: true, resultado: res, outputLines, variables };
  } else if (op === "-") {
    const res = n1 - n2;
    variables.resultado = res;
    outputLines.push(`Resultado: ${n1} - ${n2} = ${res}`);
    outputLines.push("=== Fim do Programa ===");
    return { success: true, resultado: res, outputLines, variables };
  } else if (op === "*") {
    const res = n1 * n2;
    variables.resultado = res;
    outputLines.push(`Resultado: ${n1} * ${n2} = ${res}`);
    outputLines.push("=== Fim do Programa ===");
    return { success: true, resultado: res, outputLines, variables };
  } else if (op === "/") {
    if (n2 === 0) {
      const errMsg = "Erro: Não é possível dividir um número por zero!";
      variables.errorMessage = errMsg;
      outputLines.push(errMsg);
      outputLines.push("=== Fim do Programa ===");
      return { success: false, errorMessage: errMsg, outputLines, variables };
    } else {
      const res = n1 / n2;
      variables.resultado = res;
      outputLines.push(`Resultado: ${n1} / ${n2} = ${res}`);
      outputLines.push("=== Fim do Programa ===");
      return { success: true, resultado: res, outputLines, variables };
    }
  } else {
    const errMsg = "Erro: Operação inválida! Use apenas +, -, * ou /.";
    variables.errorMessage = errMsg;
    outputLines.push(errMsg);
    outputLines.push("=== Fim do Programa ===");
    return { success: false, errorMessage: errMsg, outputLines, variables };
  }
}

/**
 * Builds an array of discrete execution steps to visualize the Python code step-by-step
 */
export function generateExecutionTrace(n1: number, op: string, n2: number): ExecutionStep[] {
  const steps: ExecutionStep[] = [];
  const currentOutput: string[] = [];
  const currentVars: CalculatorState = {};

  // Step 1: Line 2 - print("=== Calculadora Simples em Python ===")
  currentOutput.push("=== Calculadora Simples em Python ===");
  steps.push({
    stepNumber: 1,
    lineNumber: 2,
    codeLine: 'print("=== Calculadora Simples em Python ===")',
    explanation: 'O comando print() escreve texto na tela para receber o usuário.',
    variables: { ...currentVars },
    terminalOutput: [...currentOutput],
    actionType: 'start'
  });

  // Step 2: Line 5 - numero1 = float(input("Digite o primeiro número: "))
  currentVars.numero1 = n1;
  currentOutput.push(`Digite o primeiro número: ${n1}`);
  steps.push({
    stepNumber: 2,
    lineNumber: 5,
    codeLine: 'numero1 = float(input("Digite o primeiro número: "))',
    explanation: `input() capturou o texto "${n1}" e float() converteu para o número decimal ${n1}. A variável numero1 guardou esse valor.`,
    variables: { ...currentVars },
    terminalOutput: [...currentOutput],
    actionType: 'input'
  });

  // Step 3: Line 8 - operacao = input("Digite a operação (+, -, *, /): ")
  currentVars.operacao = op;
  currentOutput.push(`Digite a operação (+, -, *, /): ${op}`);
  steps.push({
    stepNumber: 3,
    lineNumber: 8,
    codeLine: 'operacao = input("Digite a operação (+, -, *, /): ")',
    explanation: `input() capturou o símbolo "${op}" como texto (str). A variável operacao agora armazena essa escolha.`,
    variables: { ...currentVars },
    terminalOutput: [...currentOutput],
    actionType: 'input'
  });

  // Step 4: Line 11 - numero2 = float(input("Digite o segundo número: "))
  currentVars.numero2 = n2;
  currentOutput.push(`Digite o segundo número: ${n2}`);
  steps.push({
    stepNumber: 4,
    lineNumber: 11,
    codeLine: 'numero2 = float(input("Digite o segundo número: "))',
    explanation: `input() capturou o segundo valor digitado e float() converteu para ${n2}. Guardado na variável numero2.`,
    variables: { ...currentVars },
    terminalOutput: [...currentOutput],
    actionType: 'input'
  });

  // Condition evaluation
  // Step 5: Line 14 - if operacao == "+":
  const isPlus = op === "+";
  steps.push({
    stepNumber: steps.length + 1,
    lineNumber: 14,
    codeLine: 'if operacao == "+":',
    explanation: `O Python testa: a variável operacao ("${op}") é exatamente igual a "+"? Resultado: ${isPlus ? "VERDADEIRO (True). Entra no bloco!" : "FALSO (False). Pula para a próxima condição."}`,
    variables: { ...currentVars },
    terminalOutput: [...currentOutput],
    actionType: 'condition-check'
  });

  if (isPlus) {
    // Line 16: resultado = numero1 + numero2
    const res = n1 + n2;
    currentVars.resultado = res;
    steps.push({
      stepNumber: steps.length + 1,
      lineNumber: 16,
      codeLine: '    resultado = numero1 + numero2',
      explanation: `Calcula ${n1} + ${n2} = ${res} e atribui à variável resultado.`,
      variables: { ...currentVars },
      terminalOutput: [...currentOutput],
      actionType: 'calc'
    });

    // Line 18: print(...)
    const printMsg = `Resultado: ${n1} + ${n2} = ${res}`;
    currentOutput.push(printMsg);
    steps.push({
      stepNumber: steps.length + 1,
      lineNumber: 18,
      codeLine: '    print("Resultado:", numero1, "+", numero2, "=", resultado)',
      explanation: `Exibe na tela a mensagem final com o cálculo completo.`,
      variables: { ...currentVars },
      terminalOutput: [...currentOutput],
      actionType: 'print'
    });
  } else {
    // Line 21: elif operacao == "-":
    const isMinus = op === "-";
    steps.push({
      stepNumber: steps.length + 1,
      lineNumber: 21,
      codeLine: 'elif operacao == "-":',
      explanation: `O Python testa: a variável operacao ("${op}") é igual a "-"? Resultado: ${isMinus ? "VERDADEIRO (True). Entra no bloco!" : "FALSO (False). Continua testando."}`,
      variables: { ...currentVars },
      terminalOutput: [...currentOutput],
      actionType: 'condition-check'
    });

    if (isMinus) {
      // Line 23: resultado = numero1 - numero2
      const res = n1 - n2;
      currentVars.resultado = res;
      steps.push({
        stepNumber: steps.length + 1,
        lineNumber: 23,
        codeLine: '    resultado = numero1 - numero2',
        explanation: `Calcula ${n1} - ${n2} = ${res} e armazena na variável resultado.`,
        variables: { ...currentVars },
        terminalOutput: [...currentOutput],
        actionType: 'calc'
      });

      // Line 25: print(...)
      const printMsg = `Resultado: ${n1} - ${n2} = ${res}`;
      currentOutput.push(printMsg);
      steps.push({
        stepNumber: steps.length + 1,
        lineNumber: 25,
        codeLine: '    print("Resultado:", numero1, "-", numero2, "=", resultado)',
        explanation: `Exibe na tela o cálculo da subtração.`,
        variables: { ...currentVars },
        terminalOutput: [...currentOutput],
        actionType: 'print'
      });
    } else {
      // Line 28: elif operacao == "*":
      const isTimes = op === "*";
      steps.push({
        stepNumber: steps.length + 1,
        lineNumber: 28,
        codeLine: 'elif operacao == "*":',
        explanation: `O Python testa: a variável operacao ("${op}") é igual a "*"? Resultado: ${isTimes ? "VERDADEIRO (True). Entra no bloco!" : "FALSO (False). Continua testando."}`,
        variables: { ...currentVars },
        terminalOutput: [...currentOutput],
        actionType: 'condition-check'
      });

      if (isTimes) {
        // Line 30: resultado = numero1 * numero2
        const res = n1 * n2;
        currentVars.resultado = res;
        steps.push({
          stepNumber: steps.length + 1,
          lineNumber: 30,
          codeLine: '    resultado = numero1 * numero2',
          explanation: `Calcula ${n1} * ${n2} = ${res} e armazena na variável resultado.`,
          variables: { ...currentVars },
          terminalOutput: [...currentOutput],
          actionType: 'calc'
        });

        // Line 32: print(...)
        const printMsg = `Resultado: ${n1} * ${n2} = ${res}`;
        currentOutput.push(printMsg);
        steps.push({
          stepNumber: steps.length + 1,
          lineNumber: 32,
          codeLine: '    print("Resultado:", numero1, "*", numero2, "=", resultado)',
          explanation: `Exibe o resultado da multiplicação no console.`,
          variables: { ...currentVars },
          terminalOutput: [...currentOutput],
          actionType: 'print'
        });
      } else {
        // Line 35: elif operacao == "/":
        const isDiv = op === "/";
        steps.push({
          stepNumber: steps.length + 1,
          lineNumber: 35,
          codeLine: 'elif operacao == "/":',
          explanation: `O Python testa: a variável operacao ("${op}") é igual a "/"? Resultado: ${isDiv ? "VERDADEIRO (True). Entra no bloco de divisão!" : "FALSO (False). Vai para o else final."}`,
          variables: { ...currentVars },
          terminalOutput: [...currentOutput],
          actionType: 'condition-check'
        });

        if (isDiv) {
          // Line 37: if numero2 == 0:
          const isZero = n2 === 0;
          steps.push({
            stepNumber: steps.length + 1,
            lineNumber: 37,
            codeLine: '    if numero2 == 0:',
            explanation: `Prevenção de erro: o divisor numero2 é zero? Resultado: ${isZero ? "VERDADEIRO (True)! Divisão por zero identificada." : "FALSO (False). É seguro dividir."}`,
            variables: { ...currentVars },
            terminalOutput: [...currentOutput],
            actionType: 'condition-check'
          });

          if (isZero) {
            // Line 39: print(...)
            const errMsg = "Erro: Não é possível dividir um número por zero!";
            currentVars.errorMessage = errMsg;
            currentOutput.push(errMsg);
            steps.push({
              stepNumber: steps.length + 1,
              lineNumber: 39,
              codeLine: '        print("Erro: Não é possível dividir um número por zero!")',
              explanation: `Avisa o usuário do erro matemático sem quebrar o programa.`,
              variables: { ...currentVars },
              terminalOutput: [...currentOutput],
              actionType: 'error'
            });
          } else {
            // Line 41: else:
            // Line 43: resultado = numero1 / numero2
            const res = n1 / n2;
            currentVars.resultado = res;
            steps.push({
              stepNumber: steps.length + 1,
              lineNumber: 43,
              codeLine: '        resultado = numero1 / numero2',
              explanation: `Divisão segura: ${n1} / ${n2} = ${res}. Armazenado em resultado.`,
              variables: { ...currentVars },
              terminalOutput: [...currentOutput],
              actionType: 'calc'
            });

            // Line 45: print(...)
            const printMsg = `Resultado: ${n1} / ${n2} = ${res}`;
            currentOutput.push(printMsg);
            steps.push({
              stepNumber: steps.length + 1,
              lineNumber: 45,
              codeLine: '        print("Resultado:", numero1, "/", numero2, "=", resultado)',
              explanation: `Exibe na tela o cálculo da divisão.`,
              variables: { ...currentVars },
              terminalOutput: [...currentOutput],
              actionType: 'print'
            });
          }
        } else {
          // Line 48: else:
          // Line 50: print("Erro: Operação inválida...")
          const errMsg = "Erro: Operação inválida! Use apenas +, -, * ou /.";
          currentVars.errorMessage = errMsg;
          currentOutput.push(errMsg);
          steps.push({
            stepNumber: steps.length + 1,
            lineNumber: 50,
            codeLine: '    print("Erro: Operação inválida! Use apenas +, -, * ou /.")',
            explanation: `Como o símbolo "${op}" não é +, -, * nem /, o bloco else é acionado alertando o usuário.`,
            variables: { ...currentVars },
            terminalOutput: [...currentOutput],
            actionType: 'error'
          });
        }
      }
    }
  }

  // Final Step: Line 53 - print("=== Fim do Programa ===")
  currentOutput.push("=== Fim do Programa ===");
  steps.push({
    stepNumber: steps.length + 1,
    lineNumber: 53,
    codeLine: 'print("=== Fim do Programa ===")',
    explanation: 'O programa terminou sua execução sequencial com sucesso.',
    variables: { ...currentVars },
    terminalOutput: [...currentOutput],
    actionType: 'end'
  });

  return steps;
}
