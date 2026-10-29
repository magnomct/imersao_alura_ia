# 🔬 Desafio 2: Calculadora Científica & Modular em Python
### *Well-Architected, Resilient & Enterprise-Grade Architecture*

[![Python](https://img.shields.io/badge/Python-3.12+-3776AB?style=flat&logo=python&logoColor=white)](https://www.python.org/)
[![React](https://img.shields.io/badge/React-19-61DAFB?style=flat&logo=react&logoColor=black)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5+-3178C6?style=flat&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-8+-646CFF?style=flat&logo=vite&logoColor=white)](https://vitejs.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4-38B2AC?style=flat&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![SymPy](https://img.shields.io/badge/SymPy-Algebra-4C8CBF?style=flat)](https://www.sympy.org/)
[![Matplotlib](https://img.shields.io/badge/Matplotlib-Plotting-11557C?style=flat)](https://matplotlib.org/)
[![Pytest](https://img.shields.io/badge/Pytest-62%20Passing-success?style=flat&logo=pytest&logoColor=white)](https://docs.pytest.org/)
[![Docker](https://img.shields.io/badge/Docker-Multi--stage%20%7C%20Non--Root-2496ED?style=flat&logo=docker&logoColor=white)](https://www.docker.com/)
[![AppSec](https://img.shields.io/badge/Security-By_Design%20(No_Eval)-red?style=flat)](./app/core/security.py)
[![Well-Architected](https://img.shields.io/badge/Framework-Well--Architected-orange?style=flat)](https://aws.amazon.com/architecture/well-architected/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](./LICENSE)

Evolução arquitetural da Calculadora do Desafio 1 para uma **aplicação modular completa, resiliente e segura**, projetada sob os pilares do **Well-Architected Framework** com **Segurança por Design (Security by Design)**, observabilidade integrada, testes automatizados e containerização enxuta.

---

## 📌 Sumário
1. [Diagnóstico da Estrutura Anterior vs. Nova Arquitetura](#-diagnóstico-da-estrutura-anterior-vs-nova-arquitetura)
2. [Alinhamento aos Pilares do Well-Architected Framework](#-alinhamento-aos-pilares-do-well-architected-framework)
3. [Árvore de Diretórios Modular](#-árvore-de-diretórios-modular)
4. [Mecanismos de Segurança (Hardening & AppSec)](#-mecanismos-de-segurança-hardening--appsec)
5. [Escopo de Funcionalidades & Interface Gráfica Web](#-escopo-de-funcionalidades--interface-gráfica-web)
6. [Como Executar a Aplicação (Interface Web & Terminal CLI)](#-como-executar-a-aplicação-interface-web--terminal-cli)
7. [Plano de Verificação e Testes (QA & Security Testing)](#-plano-de-verificação-e-testes-qa--security-testing)
8. [Execução em Contêiner Docker Seguro](#-execução-em-contêiner-docker-seguro)
9. [Autor & Licença](#-autor--licença)

---

## 🔍 Diagnóstico da Estrutura Anterior vs. Nova Arquitetura

| Dimensão | Estado Anterior (Desafio 1) | Nova Arquitetura (Desafio 2) |
| :--- | :--- | :--- |
| **Organização** | Script único monolítico e sequencial | Arquitetura modular em camadas desacopladas (`core`, `storage`, `visualization`, `integrations`, `ui`) |
| **Escopo Matemático** | Apenas as 4 operações básicas (`+`, `-`, `*`, `/`) | Científica completa (trig, logs, raízes, potências, fatorial, bases, equações de 2º grau e álgebra SymPy) |
| **Segurança (AppSec)**| Apenas validação de `numero2 == 0` | Validação de AST sem `eval`/`exec`, limites Anti-DoS, anti-Path Traversal e SSL obrigatório |
| **Persistência** | Sem persistência de histórico | Histórico em JSON com escrita atômica contra corrupção e prevenção de path traversal |
| **Observabilidade** | Saída única via `print()` no console | Logging estruturado multinível (`INFO`, `WARNING`, `ERROR`) com auditoria e rotação em arquivo |
| **Resiliência Externa**| Nenhuma integração de rede | Cliente HTTP com timeouts estritos, validação de certificados, cache com TTL e fallback offline gracioso |
| **Testes (QA)** | Testes simples do simulador | Suíte automatizada com **62 testes pytest** cobrindo bordas, segurança, regressão e integrações |
| **Deploy** | Execução local isolada | Dockerfile multi-stage com usuário não-privilegiado (non-root) e healthcheck integrado |

---

## 🏛️ Alinhamento aos Pilares do Well-Architected Framework

### 1. Excelência Operacional (Operational Excellence)
- **Separação de Responsabilidades (SoC):** Cada módulo possui um domínio estrito (`basic_math`, `scientific_math`, `algebra_engine`, `history_manager`, `plotter`, `currency_service`, `unit_converter`).
- **Observabilidade & Auditoria:** Utilização da biblioteca nativa `logging` gravando em `data/app.log` e no terminal, registrando timestamps, módulos, níveis de severidade e rastreabilidade de exceções.
- **Testes Automatizados (CI/CD Ready):** 62 testes unitários e de integração parametrizados executáveis via `pytest`.

### 2. Segurança por Design (Security by Design)
- **Zero `eval()` / Zero `exec()`:** Proibição estrita de execução dinâmica de strings. As expressões são validadas através de árvore sintática abstrata (`ast.parse`) e avaliadas pelo SymPy com contexto isolado.
- **Defesa Anti-DoS:** Limites matemáticos para evitar consumo descontrolado de CPU/memória (fatorial $n \le 1000$ e expoente $|exp| \le 10000$).
- **Anti-Path Traversal:** Sanitização de nomes de arquivos com verificação estrita de caminhos canônicos restritos aos diretórios `data/` e `exports/`.
- **Comunicação Segura:** Chamadas de rede com `verify=True` forçando validação de cadeia de certificados SSL/TLS.
- **Container Seguro:** Execução em usuário não-root (`UID 10001`, `appuser`) sem privilégios de superusuário.

### 3. Confiabilidade (Reliability)
- **Zero Regressão:** 100% de paridade garantida nas quatro operações originais do Desafio 1.
- **Degradação Graciosa (Graceful Degradation):** Se a API externa de cotações sofrer timeout ou falhar por ausência de internet, o serviço de câmbio ativa automaticamente taxas de contingência sem quebrar a calculadora.
- **Escrita Atômica (Atomic Write):** Gravação do histórico JSON via arquivo temporário com `replace` atômico no sistema de arquivos, prevenindo arquivos corrompidos em caso de término abrupto do processo.

### 4. Eficiência de Performance e Custos (Performance Efficiency)
- **Cache Local com TTL:** Cotações de moedas ficam salvas em memória por 3600 segundos (1 hora), reduzindo tráfego de rede e consumo de requisições de API.
- **Prevenção de Memory Leaks:** Fechamento explícito e garantido (`plt.close(fig)`) em bloco `finally` na geração de gráficos com Matplotlib.
- **Backend Headless:** Uso do backend `'Agg'` no Matplotlib, permitindo plotagem rápida sem necessidade de servidor gráfico X11/Wayland.

### 5. Sustentabilidade & Portabilidade (Sustainability)
- **Dockerfile Multi-Stage:** Reduz o tamanho final da imagem eliminando compiladores e artefatos de build intermediários.

---

## 📁 Árvore de Diretórios Modular

```text
Desafio_2_CalculadoraCientifica/
├── app/
│   ├── __init__.py
│   ├── config.py                 # Parâmetros globais, caminhos canônicos e Anti-DoS
│   ├── core/                     # Motores matemáticos e segurança
│   │   ├── __init__.py
│   │   ├── basic_math.py         # 4 operações básicas originais (Zero Regressão)
│   │   ├── scientific_math.py    # Potências, raízes, trig, logs, fatoriais, bases
│   │   ├── algebra_engine.py     # Equações de 2º grau e SymPy com AST seguro
│   │   └── security.py           # Sanitização AST, anti-injection, anti-DoS e path traversal
│   ├── storage/
│   │   ├── __init__.py
│   │   └── history_manager.py    # Persistência atômica em JSON
│   ├── visualization/
│   │   ├── __init__.py
│   │   └── plotter.py            # Geração de gráficos headless com liberação de buffers
│   ├── integrations/
│   │   ├── __init__.py
│   │   ├── unit_converter.py     # Conversor de distâncias e temperaturas
│   │   └── currency_service.py   # Cotações HTTP com SSL, timeout, cache e fallback
│   └── ui/
│       ├── __init__.py
│       └── cli.py                # Interface interativa rica com menus e logging
├── data/                         # Persistência de arquivos de dados (history.json, app.log)
├── exports/                      # Diretório seguro de exportação de gráficos (PNG)
├── tests/                        # Suíte de testes automatizados com pytest (62 testes)
│   ├── conftest.py
│   ├── test_basic_math.py
│   ├── test_scientific_math.py
│   ├── test_algebra_engine.py
│   ├── test_security.py
│   ├── test_storage.py
│   ├── test_unit_converter.py
│   ├── test_currency_service.py
│   └── test_plotter.py
├── main.py                       # Ponto de entrada executável da aplicação
├── requirements.txt              # Dependências pinadas do projeto
└── Dockerfile                    # Multi-stage build com usuário non-root
```

---

## 🛡️ Mecanismos de Segurança (Hardening & AppSec)

### 1. Validação Sintática Abstrata (AST) sem `eval()`
Qualquer expressão digitada pelo usuário passa por uma rigorosa análise na Árvore Sintática do Python antes de qualquer processamento:
```python
# app/core/security.py
# Rejeita tokens perigosos e nós sintáticos não-aritméticos
if "__" in expr:
    raise SecurityValidationError("Token proibido: '__'.")
suspicious_match = re.search(r"\b(import|eval|exec|open|os|sys|subprocess|lambda)\b", expr.lower())
if suspicious_match:
    raise SecurityValidationError("Tentativa de injeção bloqueada.")
```

### 2. Defesa contra Exaustão de Recursos (Anti-DoS)
```python
# Limites estritos configurados em app/config.py
MAX_FACTORIAL_INPUT = 1000  # Evita loop de CPU por fatoriais colossais
MAX_EXPONENT_POWER = 10_000 # Previne estouro de memória e float overflow
```

### 3. Prevenção de Path Traversal
```python
# Garante que qualquer gravação de arquivo fique estritamente restrita a data/ ou exports/
if ".." in target_filename or "/" in target_filename or "\\" in target_filename:
    raise SecurityValidationError("Tentativa de Path Traversal detectada.")
```

---

## 🎯 Escopo de Funcionalidades & Interface Gráfica Web

A aplicação conta com um ecossistema duplo: um **motor matemático modular robusto em Python** acompanhado de uma **Interface Gráfica Web Moderna (Single Page Application)** construída com React 19, TypeScript, Tailwind CSS e Vite.

---

### 1. Funcionalidades do Backend & CLI (Python 3.12)

#### Operações Básicas (Zero Regressão)
- Adição (`+`), Subtração (`-`), Multiplicação (`*`) e Divisão (`/`) com prevenção rigorosa de divisão por zero.

#### Matemática Científica
- **Porcentagem:** Cálculo de $x\%$ de um valor.
- **Exponenciação:** Potenciação $a^b$ com proteção anti-estouro ($|exp| \le 10000$).
- **Raízes:** Raiz quadrada ($\sqrt{x}$), cúbica ($\sqrt[3]{x}$, com suporte a números negativos) e n-ésima ($\sqrt[n]{x}$).
- **Trigonometria:** Seno, cosseno e tangente com suporte a **Graus (DEG)** e **Radianos (RAD)**, com tratamento de assíntotas (ex.: $\tan(90^\circ)$).
- **Logaritmos:** Logaritmo natural ($\ln$), base 10 ($\log_{10}$) e base arbitrária ($\log_b(x)$).
- **Fatorial:** Cálculo de $n!$ com salvaguarda Anti-DoS ($n \le 1000$).
- **Conversão de Bases:** Conversão bidirecional entre binário (2), octal (8), decimal (10) e hexadecimal (16).

#### Álgebra & Resolução Simbólica (SymPy)
- **Equações de 2º Grau (Bhaskara):** Resolução analítica de $ax^2 + bx + c = 0$, calculando $\Delta$ e discriminando raízes reais duplas, reais distintas ou complexas conjugadas ($a \pm bi$).
- **Expressões Simbólicas:** Análise por AST, simplificação de equações e avaliação com substituição (`subs`).

#### Visualização e Persistência
- **Gráficos Matplotlib:** Renderização de curvas em formato PNG headless (backend `'Agg'`) com liberação garantida de buffers de memória (`plt.close`).
- **Histórico JSON Atômico:** Gravação de auditoria em `data/history.json` com gravação atômica protegida contra corrupção e contra path traversal.

#### Integrações & Conversores
- **Distância:** Conversão de 8 grandezas métricas e imperiais (`km`, `m`, `cm`, `mm`, `mi`, `yd`, `ft`, `in`).
- **Temperatura:** Conversão entre Celsius, Fahrenheit e Kelvin com trava física de **Zero Absoluto** ($T \ge -273.15^\circ\text{C}$).
- **Câmbio HTTP Resiliente:** Consumo de API de cotação via `requests` com SSL obrigatório, timeout de 3s-5s, cache local com TTL de 1 hora e fallback gracioso offline.

---

### 2. Módulos da Interface Gráfica Interativa (Web UI SPA)

A interface gráfica foi concebida para oferecer alta produtividade visual, responsividade completa e feedback em tempo real:

1. **Calculadora Científica (`calculator`):**
   - Teclado científico completo com display multifunção, suporte a atalhos de teclado e histórico rápido.
   - Alternância dinâmica instantânea entre **DEG (Graus)** e **RAD (Radianos)**.
   - Painel interativo de **Bhaskara** para cálculo de raízes e discriminante $\Delta$.
   - **Conversor de Bases Simultâneo**: insira um valor decimal e visualize instantaneamente sua representação em Binário, Octal, Decimal e Hexadecimal.

2. **Visualizador Gráfico de Funções f(x) (`plotter`):**
   - Renderização gráfica contínua baseada em SVG cartesiano preciso.
   - Parser matemático seguro sem `eval()` / sem injeção de código.
   - Suporte a operadores, trigonométricas (`sin`, `cos`, `tan`), potenciação e funções compostas.
   - Presets imediatos: `sin(x) * cos(x)`, Parábola ($x^2 - 4x + 4$), Cúbica ($x^3 - 3x$).
   - Ajuste em tempo real de limites de domínio ($X_{\min}$ e $X_{\max}$) com autoescala vertical.

3. **Conversores & Moedas (`converters`):**
   - **Aba Distâncias:** Conversor numérico instantâneo de unidades de comprimento.
   - **Aba Temperatura:** Conversor térmico com salvaguarda física visual contra valores inferiores ao Zero Absoluto.
   - **Aba Moedas & Câmbio:** Conversão de moedas (USD, BRL, EUR, GBP, JPY, CAD) com aviso visual de contingência/resiliência.

4. **Histórico Persistente (`history`):**
   - Tabela organizada com timestamp de execução, selo de categoria por cores, expressão e resultado.
   - Copiar cálculo diretamente para a área de transferência com um clique.
   - Limpeza e gerenciamento do histórico com persistência em `localStorage`.

5. **Painel de Arquitetura & Governança Well-Architected (`architecture`):**
   - Visão didática interativa dos pilares de Excelência Operacional, Segurança, Confiabilidade, Performance e Custos.
   - Métricas de segurança (Anti-DoS, No-Eval, Sandbox, Non-Root Docker).
   - Guia de execução rápida e rastreabilidade técnica.

---

## 🚀 Como Executar a Aplicação (Interface Web & Terminal CLI)

Você pode interagir com o projeto através da **Interface Gráfica Web** ou via **Terminal CLI em Python**.

### 🌐 1. Como Subir a Interface Gráfica Web (React 19 + Vite)

#### Pré-requisitos:
- **Node.js 18+** e **npm** instalados ([nodejs.org](https://nodejs.org/)).

#### Passo a passo para execução:

1. Acesse o diretório da calculadora científica:
   ```bash
   cd Desafio_2_CalculadoraCientifica
   ```

2. Instale as dependências do projeto:
   ```bash
   npm install
   ```

3. Inicie o servidor de desenvolvimento do Vite:
   ```bash
   npm run dev
   ```

4. Acesse a aplicação no seu navegador:
   ```text
   http://localhost:3000
   ```
   *(ou a porta indicada no terminal, ex: `http://localhost:5173`)*

#### Comandos adicionais da interface web:
```bash
# Executar a suíte de testes unitários do motor científico frontend (22 testes)
npm test

# Verificar a conformidade e tipagem do TypeScript
npm run lint

# Gerar o build otimizado de produção
npm run build

# Pré-visualizar o build de produção localmente
npm run preview
```

---

### 💻 2. Como Executar o Backend / CLI em Python

#### Pré-requisitos:
- **Python 3.12+** instalado.

#### Passo a passo para execução:

1. Acesse o diretório da calculadora científica:
   ```bash
   cd Desafio_2_CalculadoraCientifica
   ```

2. Crie e ative o ambiente virtual:
   ```bash
   python3 -m venv .venv
   source .venv/bin/activate
   ```

3. Instale as dependências:
   ```bash
   pip install -r requirements.txt
   ```

4. Execute o terminal interativo:
   ```bash
   python3 main.py
   ```

---

## 🧪 Plano de Verificação e Testes (QA & Security Testing)

A aplicação conta com uma camada abrangente de qualidade e segurança em dois níveis (Backend e Frontend):

### 1. Suíte de Testes Automatizados no Backend (Python / Pytest - 62 Testes)
Cobre regressão zero, segurança AppSec (No-Eval, anti-injection, Anti-DoS, anti-traversal), Bhaskara, SymPy, Plotter e contingência de moedas:
```bash
# Executar todos os 62 testes automatizados
.venv/bin/pytest -v

# Verificar tempo de execução por teste e sumário
.venv/bin/pytest -v --durations=5
```

### 2. Suíte de Testes Automatizados no Frontend (TypeScript / Node - 22 Testes)
Valida a paridade do simulador básico, a precisão das funções científicas na interface gráfica e os controles sanitizadores:
```bash
# Executar os 22 testes unitários do motor científico web
npm test
```

---

## 📋 Roteiro de Testes Manuais & Casos de Borda (AppSec)

Para testar a aplicação manualmente pelo terminal (`python3 main.py`), execute os seguintes cenários:

### Teste Manual 1: Zero Regressão (Operações Básicas)
- No menu principal, escolha `1`.
- Digite `15`, operação `/`, segundo número `0`.
- **Resultado Esperado:** Mensagem clara `Erro: Não é possível dividir um número por zero!` sem encerramento da aplicação.

### Teste Manual 2: Defesa Anti-DoS em Fatorial
- No menu principal, escolha `2` (Matemática Científica) e em seguida `8` (Fatorial).
- Digite `1001` (acima do limite seguro).
- **Resultado Esperado:** Alerta imediato `Alerta Anti-DoS: Fatorial de 1001 excede o limite máximo permitido de 1000`.
- Digite `5` em seguida -> Retorna `120`.

### Teste Manual 3: Tentativa de Injeção de Código (Code Injection)
- No menu principal, escolha `3` (Álgebra) e opção `2` (Expressões).
- Digite: `__import__('os').system('ls')` ou `open('/etc/passwd')`.
- **Resultado Esperado:** Bloqueio imediato com `Erro de Segurança: Token de segurança proibido detectado`.

### Teste Manual 4: Geração de Gráficos e Memory Leak
- No menu principal, escolha `4` (Gráficos).
- Função: `sin(x) * cos(x)`, intervalo de `-10` a `10`, arquivo `onda.png`.
- **Resultado Esperado:** Arquivo gerado em `exports/onda.png` e buffer da figura fechado sem consumir memória em segundo plano.

### Teste Manual 5: Resiliência de Moedas e Fallback
- No menu principal, escolha `5` (Conversores) e opção `3` (Moedas).
- Valor `100`, de `USD` para `BRL`.
- **Resultado Esperado:** Se houver internet, exibe a cotação oficial em tempo real; caso offline, ativa instantaneamente a cotação estimada de contingência sem erro fatal.

---

## 🐳 Execução em Contêiner Docker Seguro

A imagem Docker utiliza multi-stage build e roda sob o usuário não-root `appuser` (UID 10001):

```bash
# Construir a imagem segura
docker build -t calculadora-cientifica:2.0 .

# Executar a aplicação de forma interativa
docker run -it --rm \
  -v $(pwd)/data:/app/data \
  -v $(pwd)/exports:/app/exports \
  calculadora-cientifica:2.0
```

---

## 👤 Autor & Licença

Desenvolvido por **Carlos Magno**  
GitHub: [@magnomct](https://github.com/magnomct) &middot; LinkedIn: [Carlos Magno](https://www.linkedin.com/in/carlosmagnogcs/) &middot; Repositório de Referência: [sre_rag_agent](https://github.com/magnomct/sre_rag_agent)

Distribuído sob a licença **MIT**. Consulte o arquivo [LICENSE](./LICENSE) para obter mais informações.
