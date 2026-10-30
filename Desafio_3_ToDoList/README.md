# 📝 Desafio 3: Lista de Tarefas (To-Do List) Visual & Interativa
### *Interactive State-Driven To-Do List & Visual Progression UI*

[![React](https://img.shields.io/badge/React-19-61DAFB?style=flat&logo=react&logoColor=black)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5+-3178C6?style=flat&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-8+-646CFF?style=flat&logo=vite&logoColor=white)](https://vitejs.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4-38B2AC?style=flat&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![Tests](https://img.shields.io/badge/Tests-9%20Passing-success?style=flat)](./src/utils/todo-engine.test.ts)
[![Python](https://img.shields.io/badge/Python-3.8+-3776AB?style=flat&logo=python&logoColor=white)](https://www.python.org/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](./LICENSE)
[![Imersão IA](https://img.shields.io/badge/Imers%C3%A3o_IA-Alura-blueviolet)](https://www.alura.com.br/)

Aplicação completa de **Lista de Tarefas (To-Do List)** construída do zero para explorar e dominar a interação entre **interface visual, gerenciamento de estado e fluxo de dados reativo**, com destaque para a **Melhoria Visual Obrigatória** em tarefas concluídas.

---

### 🌐 Selecione o Idioma / Select Language

- [🇧🇷 **Versão em Português (PT-BR)**](#-versão-em-português-pt-br)
- [🇺🇸 **English Version (EN-US)**](#-english-version-en-us)

---

# 🇧🇷 Versão em Português (PT-BR)

## 📌 Sumário
1. [Sobre o Desafio & Objetivos Didáticos](#-sobre-o-desafio--objetivos-didáticos)
2. [Arquitetura de Componentes & Fluxo de Dados](#-arquitetura-de-componentes--fluxo-de-dados)
3. [Implementação da Melhoria Visual Obrigatória](#-implementação-da-melhoria-visual-obrigatória)
4. [Como Executar a Aplicação](#-como-executar-a-aplicação)
5. [Plano de Verificação e Testes Automatizados](#-plano-de-verificação-e-testes-automatizados)
6. [Roteiro de Testes Manuais Passo a Passo](#-roteiro-de-testes-manuais-passo-a-passo)
7. [Segurança e Versionamento (.gitignore)](#-segurança-e-versionamento-gitignore)
8. [Autor & Licença](#-autor--licença)

---

## 🎯 Sobre o Desafio & Objetivos Didáticos

No terceiro desafio da jornada de desenvolvimento de software, avançamos para a criação de um software completo do zero, compreendendo:
- **Fluxo Unidirecional do React:** como eventos do usuário (`onClick`, `onSubmit`) acionam funções que atualizam o estado (`useState`) de forma imutável, provocando a re-renderização precisa da UI.
- **Renderização Condicional Dinâmica:** como o valor booleano `concluida` altera em tempo real as classes de estilo e elementos visuais da tela.
- **Persistência de Dados Resiliente:** sincronização contínua com o `localStorage` do navegador para que os dados não se percam após recarregar a página.

---

## 🏗️ Arquitetura de Componentes & Fluxo de Dados

A aplicação foi estruturada de forma modular, separando o motor de regras de negócio dos componentes visuais:

```text
Desafio_3_ToDoList/
├── index.html                   # Entry-point HTML com viewport e metadados
├── package.json                 # Dependências (React 19, TypeScript, Vite, Tailwind CSS)
├── tsconfig.json                # Configuração do compilador TypeScript
├── vite.config.ts               # Configuração do Vite com plugin Tailwind e React
├── todo.py                      # Versão CLI didática e interativa em Python
├── src/
│   ├── main.tsx                 # Ponto de inicialização do React DOM
│   ├── App.tsx                  # Componente Raiz: orquestra o estado e localStorage
│   ├── index.css                # Importação do Tailwind CSS v4
│   ├── types/
│   │   └── todo.ts              # Interfaces e tipos TypeScript (Task, TaskFilter, etc.)
│   ├── utils/
│   │   ├── todo-engine.ts       # Funções puras de regras de negócio (adicionar, alternar, etc.)
│   │   └── todo-engine.test.ts  # Suíte de testes unitários automatizados (9 testes)
│   └── components/
│       ├── Header.tsx           # Cabeçalho com métricas (total, pendentes, % progresso)
│       ├── TaskInput.tsx        # Formulário com validação contra entradas vazias
│       ├── TaskFilters.tsx      # Filtros (Todas, Pendentes, Concluídas) e Limpeza em lote
│       ├── TaskList.tsx         # Renderizador de lista e telas de empty-state
│       ├── TaskItem.tsx         # Componente central da MELHORIA VISUAL
│       ├── DidacticExplanation.tsx # Painel explicativo do fluxo de estado e classes CSS
│       └── Footer.tsx           # Rodapé oficial com autoria e licença MIT
```

### Como os componentes conversam entre si:
1. `App.tsx` mantém o estado global de tarefas (`tasks`) e o filtro selecionado (`currentFilter`).
2. O usuário digita uma atividade em `TaskInput.tsx` e dispara `onAddTask`.
3. `App.tsx` chama a função pura `adicionarTarefa` de `todo-engine.ts`, obtém um novo array imutável e atualiza o estado com `setTasks`.
4. O React detecta a alteração de estado e aciona a re-renderização de `Header.tsx` (atualizando os contadores), `TaskFilters.tsx` e `TaskList.tsx`.
5. Cada `TaskItem.tsx` recebe sua respectiva tarefa e computa instantaneamente sua apresentação visual baseada em `task.concluida`.

---

## 🌟 Implementação da Melhoria Visual Obrigatória

A melhoria visual obrigatória foi desenvolvida em [`src/components/TaskItem.tsx`](./src/components/TaskItem.tsx) para proporcionar um contraste imediato, intuitivo e agradável entre tarefas pendentes e finalizadas:

| Elemento Visual | Tarefa Pendente | Tarefa Concluída (Melhoria Visual) |
| :--- | :--- | :--- |
| **Texto do Título** | `text-slate-100 font-medium` (branco nítido) | **`line-through text-slate-400 decoration-emerald-500/70` (riscado suave)** |
| **Opacidade e Fundo**| `opacity-100 bg-slate-900 border-slate-700/80` | **`opacity-70 bg-slate-900/40 border-slate-800/60` (fundo atenuado)** |
| **Checkbox Interativo**| `border-slate-600 bg-slate-950` (círculo vazio) | **`bg-emerald-500 border-emerald-400 text-slate-950` (preenchido com check)** |
| **Metadados de Horário**| `Criada às [HH:MM]` em cinza | **`Concluída às [HH:MM]` em verde com ícone `CheckCircle2`** |

### Trecho de Código Responsável:
```tsx
// Trecho extraído de src/components/TaskItem.tsx:
<div
  className={`group flex items-center justify-between gap-3 p-4 rounded-2xl border transition-all duration-200 ${
    task.concluida
      ? 'opacity-70 bg-slate-900/40 border-slate-800/60 shadow-none'
      : 'opacity-100 bg-slate-900 border-slate-700/80 shadow-md'
  }`}
>
  {/* Checkbox com transição dinâmica */}
  <button
    onClick={() => onToggle(task.id)}
    className={`w-6 h-6 rounded-lg border flex items-center justify-center transition-all ${
      task.concluida
        ? 'bg-emerald-500 border-emerald-400 text-slate-950'
        : 'border-slate-600 bg-slate-950 text-transparent'
    }`}
  >
    <Check className={`w-4 h-4 stroke-[3] ${task.concluida ? 'block' : 'opacity-0'}`} />
  </button>

  {/* Título Riscado e Cor Suave */}
  <p
    onClick={() => onToggle(task.id)}
    className={`text-sm break-words transition-colors ${
      task.concluida
        ? 'line-through text-slate-400 decoration-emerald-500/70 decoration-2'
        : 'text-slate-100 font-medium'
    }`}
  >
    {task.titulo}
  </p>
</div>
```

---

## 🚀 Como Executar a Aplicação

### 🌐 Opção 1: Interface Gráfica Web (Recomendado)

1. Entre no diretório do Desafio 3:
   ```bash
   cd Desafio_3_ToDoList
   ```

2. Instale as dependências:
   ```bash
   npm install
   ```

3. Inicie o servidor de desenvolvimento:
   ```bash
   npm run dev
   ```

4. Abra seu navegador em:
   ```text
   http://localhost:3000
   ```

---

### 💻 Opção 2: Terminal CLI em Python (`todo.py`)

Se desejar executar a versão de linha de comando no terminal:
```bash
cd Desafio_3_ToDoList
python3 todo.py
```

---

## 🧪 Plano de Verificação e Testes Automatizados

A aplicação conta com testes unitários cobrindo todas as operações essenciais do motor lógico:

```bash
# Executar a suíte de testes unitários (9 testes)
npm test

# Verificar conformidade de tipos com TypeScript
npm run lint

# Gerar o bundle otimizado de produção
npm run build
```

---

## 📋 Roteiro de Testes Manuais Passo a Passo

Siga o checklist abaixo no navegador para comprovar o funcionamento de 100% dos requisitos:

1. **Teste de Adição Válida:**
   - Digite `"Aprender React e TypeScript"` no campo de texto e clique em **Adicionar** (ou pressione `Enter`).
   - *Resultado Esperado:* A tarefa surge imediatamente no topo com status de pendente, contador total sobe e toast de confirmação é exibido.

2. **Teste de Validação de Entrada Vazia:**
   - Deixe o campo vazio (ou digite apenas espaços) e clique em **Adicionar**.
   - *Resultado Esperado:* Alerta visual vermelho informativo é exibido; nenhuma tarefa em branco é inserida.

3. **Teste da Melhoria Visual (Concluir Tarefa):**
   - Clique no checkbox da tarefa adicionada.
   - *Resultado Esperado:* O checkbox preenche-se em verde esmeralda com ícone de check, o texto fica riscado (`strikethrough`), a cor atenua-se para cinza suave e a opacidade reduz-se para 70%. A barra de progresso no topo avança automaticamente.

4. **Teste de Desmarcar Tarefa:**
   - Clique novamente no checkbox da tarefa concluída.
   - *Resultado Esperado:* O checkbox retorna ao estado vazio, o texto volta a ser branco nítido sem risco e a porcentagem de conclusão é recalculada.

5. **Teste de Filtros:**
   - Clique na aba **Pendentes**: apenas itens pendentes devem ser exibidos.
   - Clique na aba **Concluídas**: apenas itens concluídos devem ser exibidos.
   - Clique na aba **Todas**: todos os itens voltam a ser exibidos.

6. **Teste de Remoção:**
   - Clique no ícone de lixeira (`Trash2`) ao lado de qualquer tarefa.
   - *Resultado Esperado:* A tarefa é excluída imediatamente da lista e os contadores são atualizados.

7. **Teste de Persistência no LocalStorage:**
   - Adicione uma tarefa, marque-a como concluída e pressione `F5` (Recarregar).
   - *Resultado Esperado:* A lista permanece idêntica à que você deixou salva.

---

## 🔒 Segurança e Versionamento (.gitignore)

O arquivo [`.gitignore`](./.gitignore) deste módulo garante que arquivos de ambiente local não sejam versionados:
- `node_modules/` e `dist/`
- Arquivos de log e cache temporário
- Arquivos `.env`

---

## 👤 Autor & Licença

Desenvolvido por **Carlos Magno**  
GitHub: [@magnomct](https://github.com/magnomct) &middot; LinkedIn: [Carlos Magno](https://www.linkedin.com/in/carlosmagnogcs/) &middot; Repositório de Referência: [sre_rag_agent](https://github.com/magnomct/sre_rag_agent)

Distribuído sob a licença **MIT**. Consulte o arquivo [LICENSE](./LICENSE) para obter mais informações.

---
---

# 🇺🇸 English Version (EN-US)

## 📌 Table of Contents
1. [About the Challenge & Learning Goals](#-about-the-challenge--learning-goals)
2. [Component Architecture & Data Flow](#-component-architecture--data-flow)
3. [Visual Enhancement Implementation](#-visual-enhancement-implementation)
4. [How to Run the Project](#-how-to-run-the-project)
5. [Automated Verification & Unit Testing](#-automated-verification--unit-testing)
6. [Step-by-Step Manual Verification Checklist](#-step-by-step-manual-verification-checklist)
7. [Security & Git Configuration (.gitignore)](#-security--git-configuration-gitignore)
8. [Author & License](#-author--license)

---

## 🎯 About the Challenge & Learning Goals

In this third challenge, we build an interactive To-Do List application from scratch to master:
- **Unidirectional Data Flow:** How user input events dispatch actions that update state immutably (`useState`), triggering targeted re-renders.
- **Conditional Styling:** How a boolean state (`task.concluida`) dictates CSS classes dynamically.
- **Data Persistence:** Automatic synchronization with the browser's `localStorage`.

---

## 🏗️ Component Architecture & Data Flow

- `src/App.tsx`: Central coordinator managing tasks state, filters, and localStorage persistence.
- `src/types/todo.ts`: TypeScript contracts for tasks, priorities, and statistics.
- `src/utils/todo-engine.ts`: Pure functional business logic (adding, toggling, deleting, filtering).
- `src/utils/todo-engine.test.ts`: Automated test suite (9 tests passing).
- `src/components/TaskItem.tsx`: Visual component featuring the mandatory visual differentiation.
- `src/components/TaskInput.tsx`: Input field with whitespace validation.
- `src/components/TaskFilters.tsx`: Category filtering tabs and batch completion purge.
- `todo.py`: Didactic interactive Python terminal alternative.

---

## 🌟 Visual Enhancement Implementation

Located in [`src/components/TaskItem.tsx`](./src/components/TaskItem.tsx), completed tasks feature:
1. **Strikethrough text:** `line-through decoration-emerald-500/70`
2. **Subtle color shift:** softened `text-slate-400`
3. **Animated Checkbox:** emerald fill `bg-emerald-500` with `Check` icon
4. **Reduced opacity:** `opacity-70 bg-slate-900/40`
5. **Completion badge:** timestamp pill indicating exact completion time

---

## 🚀 How to Run the Project

### 🌐 1. Web Graphical Interface
```bash
cd Desafio_3_ToDoList
npm install
npm run dev
```
Open `http://localhost:3000` in your web browser.

### 💻 2. Python Terminal CLI
```bash
cd Desafio_3_ToDoList
python3 todo.py
```

---

## 🧪 Automated Verification & Unit Testing

```bash
# Run 9 unit tests
npm test

# TypeScript type check
npm run lint

# Production build
npm run build
```

---

## 📋 Step-by-Step Manual Verification Checklist

1. **Add Task:** Enter `"Complete Challenge 3"` and press **Adicionar** (or hit Enter).
2. **Empty Input Guard:** Submit an empty field to verify the red validation message.
3. **Toggle Completion:** Click the checkbox to see the strikethrough, emerald check icon, and 70% opacity.
4. **Uncheck Task:** Click again to revert to crisp white pending status.
5. **Filter Navigation:** Toggle between *Todas*, *Pendentes*, and *Concluídas*.
6. **Deletion:** Click the trash icon to remove the task.
7. **Persistence:** Reload the browser page (`F5`) to verify tasks remain intact.

---

## 🔒 Security & Git Configuration (.gitignore)

The [`.gitignore`](./.gitignore) file ensures node dependencies, builds, and local environment files remain untracked.

---

## 👤 Author & License

Developed by **Carlos Magno**  
GitHub: [@magnomct](https://github.com/magnomct) &middot; LinkedIn: [Carlos Magno](https://www.linkedin.com/in/carlosmagnogcs/) &middot; Reference Repository: [sre_rag_agent](https://github.com/magnomct/sre_rag_agent)

Distributed under the **MIT License**. See the [LICENSE](./LICENSE) file for more information.

