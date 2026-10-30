#!/usr/bin/env python3
"""
Desafio 3: Lista de Tarefas (To-Do List) em Python
Autor: Carlos Magno
Licença: MIT

Script interativo didático com gerenciamento de estado em memória e melhoria visual no terminal.
"""

from dataclasses import dataclass
from datetime import datetime
from typing import List, Optional

# Códigos de escape ANSI para formatação de texto e cores no terminal
RESET = "\033[0m"
BOLD = "\033[1m"
GREEN = "\033[92m"
YELLOW = "\033[93m"
GRAY = "\033[90m"
RED = "\033[91m"
STRIKETHROUGH = "\033[9m"  # Efeito de texto riscado / tachado no terminal


@dataclass
class Tarefa:
    id: int
    titulo: str
    concluida: bool = False
    criada_em: str = ""
    concluida_em: Optional[str] = None


class GerenciadorTarefas:
    def __init__(self):
        self.tarefas: List[Tarefa] = [
            Tarefa(1, "Estudar lógica de programação (Desafio 1)", True, "09:00", "09:45"),
            Tarefa(2, "Analisar arquitetura da Calculadora Científica (Desafio 2)", True, "10:00", "11:15"),
            Tarefa(3, "Construir a Lista de Tarefas com interação de estado (Desafio 3)", False, "14:00"),
        ]
        self._proximo_id = 4

    def adicionar(self, titulo: str) -> bool:
        titulo_limpo = titulo.strip()
        if not titulo_limpo:
            print(f"{RED}⚠️ Erro: O título da tarefa não pode estar vazio!{RESET}")
            return False

        horario = datetime.now().strftime("%H:%M")
        nova = Tarefa(self._proximo_id, titulo_limpo, False, horario)
        self.tarefas.append(nova)
        self._proximo_id += 1
        print(f"{GREEN}✓ Tarefa '{titulo_limpo}' adicionada com sucesso!{RESET}")
        return True

    def alternar(self, id_tarefa: int) -> bool:
        for t in self.tarefas:
            if t.id == id_tarefa:
                t.concluida = not t.concluida
                if t.concluida:
                    t.concluida_em = datetime.now().strftime("%H:%M")
                    print(f"{GREEN}✓ Parabéns! Tarefa {id_tarefa} marcada como concluída!{RESET}")
                else:
                    t.concluida_em = None
                    print(f"{YELLOW}↺ Tarefa {id_tarefa} retornou para pendente.{RESET}")
                return True

        print(f"{RED}⚠️ Tarefa com ID {id_tarefa} não encontrada.{RESET}")
        return False

    def remover(self, id_tarefa: int) -> bool:
        for i, t in enumerate(self.tarefas):
            if t.id == id_tarefa:
                removida = self.tarefas.pop(i)
                print(f"{GREEN}✓ Tarefa '{removida.titulo}' removida com sucesso.{RESET}")
                return True

        print(f"{RED}⚠️ Tarefa com ID {id_tarefa} não encontrada.{RESET}")
        return False

    def exibir(self):
        print("\n" + "=" * 55)
        print(f"{BOLD}📝 GERENCIADOR DE TAREFAS (TO-DO LIST){RESET}")
        print("=" * 55)

        if not self.tarefas:
            print(f"{GRAY}Sua lista está vazia! Digite 1 para adicionar uma tarefa.{RESET}")
            print("-" * 55)
            return

        total = len(self.tarefas)
        concluidas = sum(1 for t in self.tarefas if t.concluida)
        progresso = int((concluidas / total) * 100) if total > 0 else 0

        print(f"Progresso: [{concluidas}/{total}] {progresso}% concluído")
        print("-" * 55)

        for t in self.tarefas:
            # Melhoria Visual Obrigatória:
            # - Concluída: [✓] Texto riscado (strikethrough) e cor cinza suave
            # - Pendente:  [ ] Texto nítido em negrito/branco
            if t.concluida:
                status_icon = f"{GREEN}[✓]{RESET}"
                titulo_formatado = f"{STRIKETHROUGH}{GRAY}{t.titulo}{RESET}"
                tempo_info = f"{GREEN}(Concluída às {t.concluida_em}){RESET}"
            else:
                status_icon = f"{YELLOW}[ ]{RESET}"
                titulo_formatado = f"{BOLD}{t.titulo}{RESET}"
                tempo_info = f"{GRAY}(Criada às {t.criada_em}){RESET}"

            print(f"{status_icon} #{t.id} - {titulo_formatado} {tempo_info}")

        print("=" * 55)


def menu():
    gerenciador = GerenciadorTarefas()

    while True:
        gerenciador.exibir()
        print("\nEscolha uma opção:")
        print("1. Adicionar nova tarefa")
        print("2. Alternar status (Concluir / Desmarcar)")
        print("3. Remover tarefa")
        print("0. Sair")

        opcao = input("\nDigite a opção desejada: ").strip()

        if opcao == "1":
            titulo = input("Digite o título da tarefa: ")
            gerenciador.adicionar(titulo)
        elif opcao == "2":
            try:
                id_num = int(input("Digite o ID da tarefa para alternar: "))
                gerenciador.alternar(id_num)
            except ValueError:
                print(f"{RED}⚠️ Digite um número de ID válido!{RESET}")
        elif opcao == "3":
            try:
                id_num = int(input("Digite o ID da tarefa para remover: "))
                gerenciador.remover(id_num)
            except ValueError:
                print(f"{RED}⚠️ Digite um número de ID válido!{RESET}")
        elif opcao == "0":
            print("\nAté logo! Continue focado nos seus estudos. 🚀\n")
            break
        else:
            print(f"{RED}⚠️ Opção inválida. Escolha entre 0 e 3.{RESET}")


if __name__ == "__main__":
    menu()

