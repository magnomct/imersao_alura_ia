# 🔬 Desafio 2: Calculadora Científica & Modular em Python
### *Well-Architected, Resilient & Enterprise-Grade Architecture*

[![Python](https://img.shields.io/badge/Python-3.12+-3776AB?style=flat&logo=python&logoColor=white)](https://www.python.org/)
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
5. [Escopo Completo de Funcionalidades](#-escopo-completo-de-funcionalidades)
6. [Como Executar a Aplicação](#-como-executar-a-aplicação)
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

## 🎯 Escopo Completo de Funcionalidades

### 1. Operações Básicas (Zero Regressão)
- Adição (`+`), Subtração (`-`), Multiplicação (`*`) e Divisão (`/`) com prevenção de divisão por zero.

### 2. Matemática Científica
- **Porcentagem:** Cálculo de $x\%$ de um valor.
- **Exponenciação:** Potenciação $a^b$ com proteção anti-estouro.
- **Raízes:** Raiz quadrada ($\sqrt{x}$), cúbica ($\sqrt[3]{x}$, com suporte a números negativos) e n-ésima ($\sqrt[n]{x}$).
- **Trigonometria:** Seno, cosseno e tangente com suporte tanto a **Graus** quanto a **Radianos** e detecção de indeterminações (ex.: $\tan(90^\circ)$).
- **Logaritmos:** Logaritmo natural ($\ln$), base 10 ($\log_{10}$) e base arbitrária ($\log_b(x)$).
- **Fatorial:** Cálculo preciso de $n!$ com salvaguarda Anti-DoS.
- **Conversão de Bases:** Conversão bidirecional entre bases binária (2), octal (8), decimal (10) e hexadecimal (16).

### 3. Álgebra & Resolução Simbólica (SymPy)
- **Equações de 2º Grau (Bhaskara):** Resolução analítica de $ax^2 + bx + c = 0$, identificando raízes reais duplas, reais distintas ou complexas conjugadas ($a \pm bi$).
- **Expressões Simbólicas:** Simplificação de expressões e avaliação numérica via substituição de incógnitas (`subs`).
- **Resolução de Equações:** Cálculo das soluções analíticas para $f(x) = 0$.

### 4. Visualização Gráfica (Matplotlib)
- Renderização de curvas de funções matemáticas em formato PNG com tema escuro, eixos cartesianos, grids e fechamento automático de buffers.

### 5. Conversores e Integrações Externas
- **Distância:** Conversão métrica e imperial (`km`, `m`, `cm`, `mm`, `mi`, `yd`, `ft`, `in`).
- **Temperatura:** Conversão entre Celsius, Fahrenheit e Kelvin respeitando o **Zero Absoluto** ($0\text{ K} = -273.15^\circ\text{C}$).
- **Câmbio HTTP:** Consulta de taxas de moedas (USD, BRL, EUR, GBP, JPY, CAD, etc.) com SSL obrigatório, timeout de 3s a 5s, cache local de 1 hora e fallback seguro para contingência offline.

### 6. Persistência de Histórico (JSON)
- Armazenamento em `data/history.json` com data/hora em UTC, categoria, expressão e resultado, com recurso de exportação segura e limpeza.

---

## 🚀 Como Executar a Aplicação

### Opção 1: Ambiente Local com Virtualenv (Recomendado)

1. Entre no diretório do projeto:
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

4. Execute a aplicação:
   ```bash
   python3 main.py
   ```

---

## 🧪 Plano de Verificação e Testes (QA & Security Testing)

### 1. Execução da Suíte Completa de Testes com Pytest
Execute todos os 62 testes automatizados no terminal:
```bash
.venv/bin/pytest -v
```

Para verificar o tempo de execução e sumário detalhado:
```bash
.venv/bin/pytest -v --durations=5
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
