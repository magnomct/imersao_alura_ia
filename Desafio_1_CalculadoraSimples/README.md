# 🧮 Desafio 1: Calculadora Simples em Python & Simulador Interativo
### *Python Beginner Calculator & Interactive Visual Simulator*

[![Python](https://img.shields.io/badge/Python-3.8+-3776AB?style=flat&logo=python&logoColor=white)](https://www.python.org/)
[![React](https://img.shields.io/badge/React-19-61DAFB?style=flat&logo=react&logoColor=black)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5+-3178C6?style=flat&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-8+-646CFF?style=flat&logo=vite&logoColor=white)](https://vitejs.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4-38B2AC?style=flat&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![Tests](https://img.shields.io/badge/Tests-15%20Passing-success?style=flat)](./src/utils/calculator-simulator.test.ts)
[![Imersão IA](https://img.shields.io/badge/Imers%C3%A3o_IA-Alura-blueviolet)](https://www.alura.com.br/)

---

### 🌐 Selecione o Idioma / Select Language

- [🇧🇷 **Versão em Português (PT-BR)**](#-versão-em-português-pt-br)
- [🇺🇸 **English Version (EN-US)**](#-english-version-en-us)

---

# 🇧🇷 Versão em Português (PT-BR)

## 📌 Sumário
1. [Sobre o Desafio e Metodologia](#-sobre-o-desafio-e-metodologia)
2. [Código Python Completo (`calculadora.py`)](#-código-python-completo-calculadorapy)
3. [Explicação Didática dos Componentes](#-explicação-didática-dos-componentes)
4. [Guia de Uso da Interface Gráfica (Web Simulator)](#-guia-de-uso-da-interface-gráfica-web-simulator)
5. [Como Executar o Projeto](#-como-executar-o-projeto)
6. [Testes Automatizados](#-testes-automatizados)
7. [Segurança e Configuração do Git (.gitignore)](#-segurança-e-configuração-do-git-gitignore)
8. [Próximos Passos de Aprendizado](#-próximos-passos-de-aprendizado)

---

## 🎯 Sobre o Desafio e Metodologia

Este projeto foi construído a partir de um prompt estruturado para tutoria de programação iniciante:

* **Objetivo (Goal):** Atuar como um tutor didático e implementar uma calculadora simples em Python com as quatro operações fundamentais: soma (`+`), subtração (`-`), multiplicação (`*`) e divisão (`/`).
* **Contexto (Context):** Estudante iniciando na programação cujo foco é compreender o fluxo de instruções, o uso de variáveis na memória e as decisões condicionais.
* **Restrições (Constraints):**
  - Código estritamente sequencial e linear.
  - Sem funções customizadas complexas (`def`).
  - Sem laços de repetição (`while`/`for`) e sem bibliotecas externas.
  - Comentários curtos e explicativos em cada linha de instrução.
* **Entregáveis (Data):** Código em bloco copiável, explicações teóricas e simulador interativo complementar.

---

## 💻 Código Python Completo (`calculadora.py`)

```python
# Mensagem de boas-vindas da calculadora
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
print("=== Fim do Programa ===")
```

---

## 🔍 Explicação Didática dos Componentes

### 1. Fluxo de Execução Sequencial
O interpretador Python processa o script linha a linha, de cima para baixo. Cada instrução deve ocorrer na ordem lógica necessária: primeiro saudamos o usuário, depois coletamos as entradas, em seguida avaliamos as condições e, por fim, emitimos a resposta.

### 2. Entrada de Dados (`input`) e Conversão de Tipos (`float`)
- O comando `input()` interrompe a execução e espera que o usuário digite algo. O Python sempre recebe esses dados no formato texto (`str`).
- Como não é possível efetuar cálculos aritméticos com texto puro, aplicamos `float()` para transformar a cadeia de caracteres em um número com casas decimais.
- A variável `operacao` não necessita de conversão, pois representa o caractere da operação em si (`str`).

### 3. Variáveis e Gerenciamento de Memória
As variáveis (`numero1`, `operacao`, `numero2`, `resultado`) funcionam como compartimentos nomeados na memória RAM do computador que armazenam dados temporariamente para reutilização durante o ciclo de execução.

### 4. Tomada de Decisão com Condicionais (`if`, `elif`, `else`)
- `if operacao == "+":` testa a primeira condição de correspondência.
- `elif` (*else if*) analisa condições subsequentes de forma mutuamente exclusiva: se uma for verdadeira, as seguintes são ignoradas.
- `else:` atua como cláusula de salvaguarda, disparada quando o usuário digita qualquer caractere diferente dos quatro operadores aceitos.

### 5. Prevenção Defensiva contra Divisão por Zero
Divisões por zero resultam em um erro fatal no interpretador (`ZeroDivisionError`). A estrutura aninhada:
```python
if numero2 == 0:
    print("Erro: Não é possível dividir um número por zero!")
```
intercepta o divisor nulo antes do cálculo, preservando a integridade da aplicação e instruindo o usuário.

---

## 🖥️ Guia de Uso da Interface Gráfica (Web Simulator)

A interface interativa foi projetada para tornar visível o que normalmente ocorre nos bastidores do computador.

### 1. Barra de Navegação Superior (Header)
- **Abas de Navegação:**
  - `>_ Código & Simulador`: Ambiente principal de execução e visualização.
  - `📖 Guia de Conceitos`: Teoria detalhada em formato acordeão sobre instruções, variáveis, operadores e indentação.
  - `❓ Quiz & Desafios`: 4 perguntas interativas para testar conhecimentos e propostas de novos desafios práticos.
- **Botões Rápidos:**
  - `Copiar Código`: Copia o script Python para a área de transferência com notificação visual.
  - `Baixar .py`: Faz o download direto do arquivo `calculadora.py`.

### 2. Painel de Código-Fonte (Lado Esquerdo)
- Exibe o código Python real com numeração de linhas e destaque sintático colorido:
  - 🟢 **Verde itálico:** Comentários explicativos (`#`).
  - 🟣 **Roxo:** Palavras reservadas e condicionais (`if`, `elif`, `else`).
  - 🔵 **Ciano:** Funções nativas da linguagem (`print`, `input`, `float`).
  - 🟡 **Amarelo:** Strings e textos (`"..."`).
  - 🔴 **Rosa:** Operadores matemáticos e de comparação (`+`, `-`, `*`, `/`, `==`, `=`).
- Durante o modo passo a passo, a linha em execução é destacada com uma barra amarela e cursor indicador `▶`, acompanhando o scroll automaticamente.

### 3. Painel de Controle e Entrada de Dados (Lado Direito Superior)
- **Entrada Manual:** Digite valores nos campos `1º Número` e `2º Número`, e clique no botão da operação desejada (`+`, `-`, `*` ou `/`).
- **Exemplos Prontos (Presets Rápidos):** Clique em qualquer botão para carregar cenários pré-configurados:
  - `10 + 5 (Soma)`
  - `50 - 18 (Subtração)`
  - `7 * 6 (Multiplicação)`
  - `100 / 4 (Divisão)`
  - `⚠️ 15 / 0 (Testar Divisão por Zero)`
- **Modos de Execução:**
  - **`▶ Executar Tudo`:** Realiza o cálculo imediatamente e exibe a saída completa no terminal.
  - **`⏭ Iniciar Passo a Passo`:** Inicia a depuração visual. A cada clique em **`Próximo Passo`**, o simulador avança uma instrução no código.
  - **`⏩ Auto-Play`:** Reproduz automaticamente o avanço das instruções a cada 1,2 segundos.
  - **`↺ Reiniciar`:** Limpa os registradores de memória e restaura o estado inicial.

### 4. Inspetor Visual de Memória RAM
Monitore em tempo real as 4 variáveis do programa:
- `numero1` (tipo `float`)
- `operacao` (tipo `str`)
- `numero2` (tipo `float`)
- `resultado` (tipo `float` ou `indefinido`)
Conforme cada instrução `input` ou atribuição é executada, o cartão correspondente muda de cor e revela o valor armazenado na memória.

### 5. Card de Dica do Tutor & Terminal Simulado
- **Dica do Tutor:** Explica em linguagem humana o que o interpretador Python acabou de fazer na linha ativa.
- **Terminal / Saída Padrão:** Reproduz com fidelidade o console do terminal, destacando mensagens de erro em vermelho, cabeçalhos em amarelo e saídas normais em verde.

---

## 🚀 Como Executar o Projeto

### Pré-requisitos
- **Python 3.8+** ([python.org](https://www.python.org/downloads/))
- **Node.js 18+** e **npm** ([nodejs.org](https://nodejs.org/)) *(para o simulador web)*

### 1. Executando o Script Python pelo Terminal
```bash
cd Desafio_1_CalculadoraSimples
python3 calculadora.py
```

### 2. Executando pelo Visual Studio Code (VS Code)
1. Abra a pasta `Desafio_1_CalculadoraSimples` no VS Code.
2. Abra o arquivo `calculadora.py`.
3. Pressione `F5` ou clique no botão **Play** no canto superior direito para executar no terminal integrado.

### 3. Executando a Interface Gráfica Web
```bash
cd Desafio_1_CalculadoraSimples
npm install
npm run dev
```
Abra o navegador no endereço exibido (geralmente `http://localhost:3000`).

---

## 🧪 Testes Automatizados

O projeto inclui uma suíte completa de **15 testes automatizados** cobrindo todas as operações, limites matemáticos, prevenção de divisão por zero e integridade do código:

```bash
# Executar a suíte de testes
npm test

# Verificar tipagem TypeScript
npm run lint

# Gerar build de produção
npm run build
```

---

## 🔒 Segurança e Configuração do Git (.gitignore)

O arquivo `.gitignore` protege segredos e evita o versionamento de arquivos temporários:
- ❌ `.env` e `.env*.local` (Chaves de API e credenciais confidenciais)
- ❌ `.venv/`, `venv/`, `env/` (Ambientes virtuais Python)
- ❌ `__pycache__/` e `*.py[cod]` (Bytecode compilado do Python)
- ❌ `node_modules/` e `dist/` (Módulos e builds do React/Vite)
- ❌ `.vscode/` e `.idea/` (Configurações de ambiente de desenvolvedores)
- ✅ `!.env.example` (Modelo de configuração seguro mantido no repositório)

---

## 💡 Próximos Passos de Aprendizado

1. **Modularização (`def`):** Encapsular cada cálculo dentro de uma função própria (`somar(a, b)`, `dividir(a, b)`).
2. **Repetição Contínua (`while`):** Manter o programa aberto para múltiplas operações sucessivas até que o usuário digite "sair".
3. **Tratamento de Exceções (`try / except`):** Capturar quando um usuário digita letras nos campos numéricos para prevenir `ValueError`.

---
---

# 🇺🇸 English Version (EN-US)

## 📌 Table of Contents
1. [About the Challenge & Methodology](#-about-the-challenge--methodology)
2. [Complete Python Source Code (`calculadora.py`)](#-complete-python-source-code-calculadorapy)
3. [Pedagogical Concept Breakdown](#-pedagogical-concept-breakdown)
4. [Interactive Graphical Interface User Guide (Web Simulator)](#-interactive-graphical-interface-user-guide-web-simulator)
5. [How to Run the Project](#-how-to-run-the-project)
6. [Automated Testing](#-automated-testing)
7. [Security & Git Configuration (.gitignore)](#-security--git-configuration-gitignore)
8. [Next Learning Milestones](#-next-learning-milestones)

---

## 🎯 About the Challenge & Methodology

This project was built following a structured beginner programming tutor prompt:

* **Goal:** Act as a programming tutor and build a simple Python calculator covering the four core arithmetic operations: addition (`+`), subtraction (`-`), multiplication (`*`), and division (`/`).
* **Context:** A student taking their initial steps in coding, aiming to understand instruction execution flow, memory variable usage, and conditional branching.
* **Constraints:**
  - Strictly sequential, line-by-line code structure.
  - No complex custom functions (`def`).
  - No loops (`while`/`for`) and zero third-party dependencies.
  - Short, explanatory comments on every single instruction line.
* **Deliverables (Data):** Copyable Python code snippet, in-depth architectural explanations, and an interactive web simulator.

---

## 💻 Complete Python Source Code (`calculadora.py`)

```python
# Mensagem de boas-vindas da calculadora
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
print("=== Fim do Programa ===")
```

---

## 🔍 Pedagogical Concept Breakdown

### 1. Sequential Execution Flow
Python reads instructions linearly from top to bottom. Order is critical: user prompts and inputs must precede calculations, and condition evaluation must happen before displaying the final output.

### 2. User Input (`input`) & Type Casting (`float`)
- `input()` halts execution and waits for user keystrokes. Python stores input strictly as text strings (`str`).
- Because arithmetic cannot be performed on plain strings, `float()` converts the character representation into real floating-point numbers.
- The `operacao` variable remains a string (`str`), preserving the math symbol.

### 3. Memory Variables
Variables (`numero1`, `operacao`, `numero2`, `resultado`) serve as named storage slots in RAM, holding user values and computed states for downstream operations.

### 4. Conditional Branching (`if`, `elif`, `else`)
- `if operacao == "+":` checks the first branch condition.
- `elif` (*else if*) provides mutually exclusive alternatives: once a match is found, Python executes its body and skips the rest.
- `else:` serves as a fallback shield, catching invalid operator entries.

### 5. Defensive Guard Against Division by Zero
Dividing by zero raises an unhandled `ZeroDivisionError` in Python. The nested check:
```python
if numero2 == 0:
    print("Erro: Não é possível dividir um número por zero!")
```
prevents application crashes, displaying a clean error message to the learner.

---

## 🖥️ Interactive Graphical Interface User Guide (Web Simulator)

The web simulator visualizes internal Python operations step-by-step.

### 1. Top Navigation Bar (Header)
- **Navigation Tabs:**
  - `>_ Código & Simulador`: Main workspace for visual execution and memory inspection.
  - `📖 Guia de Conceitos`: Accordion-based deep dive into instructions, variables, operators, and indentation.
  - `❓ Quiz & Desafios`: 4 interactive questions with instant answer explanations and follow-up challenges.
- **Header Actions:**
  - `Copiar Código`: Copies the full Python script to clipboard with toast confirmation.
  - `Baixar .py`: Direct file download of `calculadora.py`.

### 2. Source Code Viewer (Left Column)
- Displays the complete Python code with line numbering and syntax highlighting:
  - 🟢 **Italic Green:** Instructional comments (`#`).
  - 🟣 **Purple:** Keywords and conditionals (`if`, `elif`, `else`).
  - 🔵 **Cyan:** Built-in functions (`print`, `input`, `float`).
  - 🟡 **Yellow:** String literals (`"..."`).
  - 🔴 **Pink:** Operators and assignments (`+`, `-`, `*`, `/`, `==`, `=`).
- In step-by-step mode, the currently executing line highlights with a yellow bar, indicator arrow `▶`, and smooth auto-scrolling.

### 3. Execution Control & Data Input Panel (Top Right)
- **Manual Input:** Fill in `1º Número` (Number 1), `2º Número` (Number 2), and toggle the operator buttons (`+`, `-`, `*`, or `/`).
- **Quick Example Presets:** Click any preset button to test common scenarios:
  - `10 + 5 (Soma)` - Addition
  - `50 - 18 (Subtração)` - Subtraction
  - `7 * 6 (Multiplicação)` - Multiplication
  - `100 / 4 (Divisão)` - Division
  - `⚠️ 15 / 0 (Testar Divisão por Zero)` - Zero-division edge case
- **Execution Controls:**
  - **`▶ Executar Tudo` (Run All):** Instant execution with complete console output.
  - **`⏭ Iniciar Passo a Passo` (Step-by-Step):** Starts interactive debugging. Each click on **`Próximo Passo`** advances one line.
  - **`⏩ Auto-Play`:** Automatically steps through the code every 1.2 seconds.
  - **`↺ Reiniciar` (Reset):** Clears simulated memory and resets the console.

### 4. RAM Memory Inspector
Track real-time variables as values are stored in memory:
- `numero1` (`float`)
- `operacao` (`str`)
- `numero2` (`float`)
- `resultado` (`float` or `undefined`)
Each memory card highlights dynamically when assigned a value.

### 5. Tutor Context Tips & Simulated Terminal
- **Tutor Tip Card:** Explains in plain language what the Python engine evaluated on the active line.
- **Simulated Terminal:** Color-coded console emulator (Red for errors, Yellow for headers, Green for outputs).

---

## 🚀 How to Run the Project

### Prerequisites
- **Python 3.8+** ([python.org](https://www.python.org/downloads/))
- **Node.js 18+** & **npm** ([nodejs.org](https://nodejs.org/)) *(for the web simulator)*

### 1. Running the Python Script via CLI
```bash
cd Desafio_1_CalculadoraSimples
python3 calculadora.py
```

### 2. Running via Visual Studio Code (VS Code)
1. Open the folder `Desafio_1_CalculadoraSimples` in VS Code.
2. Open `calculadora.py`.
3. Press `F5` or click the **Play** button at the top-right corner to run interactively in the integrated terminal.

### 3. Running the Web Simulator
```bash
cd Desafio_1_CalculadoraSimples
npm install
npm run dev
```
Navigate to the local URL (typically `http://localhost:3000`).

---

## 🧪 Automated Testing

The project includes **15 automated tests** validating all operations, edge cases, zero-division guards, and code parity:

```bash
# Run unit and trace tests
npm test

# Run TypeScript linting
npm run lint

# Production build verification
npm run build
```

---

## 🔒 Security & Git Configuration (.gitignore)

The project includes an exhaustive `.gitignore` file preventing unwanted files from reaching GitHub:
- ❌ `.env` and `.env*.local` (Private API keys and credentials)
- ❌ `.venv/`, `venv/`, `env/` (Python virtual environments)
- ❌ `__pycache__/` and `*.py[cod]` (Compiled Python bytecode)
- ❌ `node_modules/` and `dist/` (Node dependencies and production builds)
- ❌ `.vscode/` and `.idea/` (Local IDE configurations)
- ✅ `!.env.example` (Safe environment template tracked in Git)

---

## 💡 Next Learning Milestones

1. **Functions (`def`):** Group calculations into reusable functions (`add(a, b)`, `divide(a, b)`).
2. **Looping (`while`):** Keep the calculator running for multiple operations until the user decides to exit.
3. **Exception Handling (`try / except`):** Gracefully handle non-numeric user inputs to prevent unexpected `ValueError` crashes.
