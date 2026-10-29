"""Interface de Linha de Comando (CLI) Interativa e Segura.

Oferece navegação estruturada por menus para todas as funcionalidades da calculadora,
com logging de auditoria, tratamento robusto de exceções e experiência interativa fluida.
"""

import sys
import logging
from typing import Optional

from app.config import setup_logging
from app.core import basic_math
from app.core import scientific_math
from app.core import algebra_engine
from app.core.security import SecurityValidationError
from app.storage.history_manager import HistoryManager
from app.visualization import plotter
from app.integrations import unit_converter
from app.integrations.currency_service import currency_service

logger = setup_logging()
history_manager = HistoryManager()


def ler_float(mensagem: str) -> float:
    """Lê um número decimal do usuário de forma segura."""
    while True:
        entrada = input(mensagem).strip()
        try:
            return float(entrada)
        except ValueError:
            print("⚠️ Entrada inválida! Digite um número válido (ex: 10 ou 3.14).")


def ler_int(mensagem: str) -> int:
    """Lê um número inteiro do usuário de forma segura."""
    while True:
        entrada = input(mensagem).strip()
        try:
            return int(entrada)
        except ValueError:
            print("⚠️ Entrada inválida! Digite um número inteiro (ex: 5).")


def menu_operacoes_basicas() -> None:
    """Executa as operações básicas garantindo 100% de paridade com o Desafio 1."""
    print("\n--- [1] Operações Básicas (+, -, *, /) ---")
    n1 = ler_float("Digite o primeiro número: ")
    op = input("Digite a operação (+, -, *, /): ").strip()
    n2 = ler_float("Digite o segundo número: ")

    try:
        resultado = basic_math.executar_operacao_basica(n1, op, n2)
        print(f"\n✅ Resultado: {n1} {op} {n2} = {resultado}")
        history_manager.registrar("Básica", f"{n1} {op} {n2}", resultado)
        logger.info("Operação básica realizada: %s %s %s = %s", n1, op, n2, resultado)
    except ZeroDivisionError as e:
        print(f"\n❌ {e}")
        logger.warning("Divisão por zero evitada: %s / %s", n1, n2)
    except ValueError as e:
        print(f"\n❌ {e}")
        logger.warning("Operação básica inválida: '%s'", op)


def menu_cientifico() -> None:
    """Menu para operações matemáticas científicas."""
    print("\n--- [2] Matemática Científica ---")
    print("1. Porcentagem (x% de y)")
    print("2. Exponenciação (base ^ expoente)")
    print("3. Raiz Quadrada (√x)")
    print("4. Raiz Cúbica (∛x)")
    print("5. Raiz N-ésima")
    print("6. Trigonometria (Seno, Cosseno, Tangente)")
    print("7. Logaritmos (Natural ln, Base 10, Base N)")
    print("8. Fatorial (n!)")
    print("9. Conversão de Bases Numéricas (Bin, Oct, Dec, Hex)")
    print("0. Voltar ao Menu Principal")

    opcao = input("\nEscolha uma opção científica [0-9]: ").strip()

    try:
        if opcao == "1":
            base = ler_float("Digite o valor base: ")
            pct = ler_float("Digite a porcentagem (%): ")
            res = scientific_math.porcentagem(base, pct)
            print(f"\n✅ {pct}% de {base} = {res}")
            history_manager.registrar("Porcentagem", f"{pct}% de {base}", res)

        elif opcao == "2":
            b = ler_float("Digite a base: ")
            e = ler_float("Digite o expoente: ")
            res = scientific_math.potencia(b, e)
            print(f"\n✅ {b} ^ {e} = {res}")
            history_manager.registrar("Potência", f"{b}^{e}", res)

        elif opcao == "3":
            x = ler_float("Digite o número para raiz quadrada: ")
            res = scientific_math.raiz_quadrada(x)
            print(f"\n✅ √{x} = {res}")
            history_manager.registrar("Raiz Quadrada", f"√{x}", res)

        elif opcao == "4":
            x = ler_float("Digite o número para raiz cúbica: ")
            res = scientific_math.raiz_cubica(x)
            print(f"\n✅ ∛{x} = {res}")
            history_manager.registrar("Raiz Cúbica", f"∛{x}", res)

        elif opcao == "5":
            x = ler_float("Digite o radicando (x): ")
            n = ler_int("Digite o índice da raiz (n inteiro): ")
            res = scientific_math.raiz_n_esima(x, n)
            print(f"\n✅ {n}√{x} = {res}")
            history_manager.registrar("Raiz N-ésima", f"{n}√{x}", res)

        elif opcao == "6":
            ang = ler_float("Digite o ângulo: ")
            unidade = input("O ângulo está em graus? (s/n, padrão=s): ").strip().lower()
            em_graus = unidade != "n"
            s = scientific_math.seno(ang, em_graus)
            c = scientific_math.cosseno(ang, em_graus)
            try:
                t = scientific_math.tangente(ang, em_graus)
                t_str = str(t)
            except ValueError as ex:
                t_str = f"Indefinida ({ex})"

            unid_str = "°" if em_graus else " rad"
            print(f"\n✅ Ângulo: {ang}{unid_str}")
            print(f"   Seno: {s}")
            print(f"   Cosseno: {c}")
            print(f"   Tangente: {t_str}")
            history_manager.registrar("Trigonometria", f"trig({ang}{unid_str})", f"sen={s}, cos={c}, tan={t_str}")

        elif opcao == "7":
            print("a) Logaritmo Natural (ln)")
            print("b) Logaritmo Base 10 (log10)")
            print("c) Logaritmo em Base Arbitrária")
            sub = input("Escolha [a/b/c]: ").strip().lower()
            x = ler_float("Digite o valor x (> 0): ")
            if sub == "a":
                res = scientific_math.logaritmo_natural(x)
                print(f"\n✅ ln({x}) = {res}")
                history_manager.registrar("Logaritmo", f"ln({x})", res)
            elif sub == "b":
                res = scientific_math.logaritmo_base_10(x)
                print(f"\n✅ log10({x}) = {res}")
                history_manager.registrar("Logaritmo", f"log10({x})", res)
            elif sub == "c":
                b = ler_float("Digite a base do logaritmo (> 0 e != 1): ")
                res = scientific_math.logaritmo_base_qualquer(x, b)
                print(f"\n✅ log_{b}({x}) = {res}")
                history_manager.registrar("Logaritmo", f"log_{b}({x})", res)
            else:
                print("Opção inválida.")

        elif opcao == "8":
            n = ler_int("Digite um número inteiro não-negativo: ")
            res = scientific_math.fatorial(n)
            print(f"\n✅ {n}! = {res}")
            history_manager.registrar("Fatorial", f"{n}!", res)

        elif opcao == "9":
            num_str = input("Digite o número a converter: ").strip()
            origem = ler_int("Base de origem (2, 8, 10, 16): ")
            dest = ler_int("Base de destino (2, 8, 10, 16): ")
            res = scientific_math.converter_base(num_str, origem, dest)
            print(f"\n✅ ({num_str})_base{origem} = ({res})_base{dest}")
            history_manager.registrar("Conversão de Base", f"{num_str}[b{origem}] -> b{dest}", res)

        elif opcao == "0":
            return
        else:
            print("Opção não reconhecida.")

    except (ValueError, ZeroDivisionError, OverflowError, SecurityValidationError) as e:
        print(f"\n❌ Erro: {e}")
        logger.warning("Falha em operação científica: %s", str(e))


def menu_algebra() -> None:
    """Menu para álgebra e expressões com SymPy."""
    print("\n--- [3] Álgebra & Expressões (SymPy Seguro) ---")
    print("1. Equação do 2º Grau (Fórmula de Bhaskara)")
    print("2. Simplificar / Avaliar Expressão Algébrica")
    print("3. Resolver Equação Simbólica f(x) = 0")
    print("0. Voltar ao Menu Principal")

    opcao = input("\nEscolha [0-3]: ").strip()

    try:
        if opcao == "1":
            print("\nEquação da forma: ax² + bx + c = 0")
            a = ler_float("Digite o coeficiente a (a != 0): ")
            b = ler_float("Digite o coeficiente b: ")
            c = ler_float("Digite o coeficiente c: ")
            sol = algebra_engine.resolver_equacao_segundo_grau(a, b, c)

            print(f"\n✅ {sol['descricao']}")
            print(f"   Delta (Δ) = {sol['delta']}")
            print(f"   Raízes: {sol['raizes']}")
            history_manager.registrar("Equação 2º Grau", f"{a}x² + {b}x + {c} = 0", sol['raizes'])

        elif opcao == "2":
            expr_str = input("\nDigite a expressão matemática (ex: x**2 + 2*x + 1 ou sin(x) + cos(x)): ").strip()
            avaliar = input("Deseja substituir um valor numérico para x? (s/n): ").strip().lower() == "s"
            val_x = ler_float("Valor de x: ") if avaliar else None

            res = algebra_engine.resolver_expressao_algebrica(expr_str, val_x)
            print(f"\n✅ Expressão Simplificada: {res['expressao_simplificada']}")
            if val_x is not None:
                print(f"   Resultado Numérico para x={val_x}: {res['resultado_numerico']}")
            history_manager.registrar("Álgebra", expr_str, res.get("resultado_numerico", res['expressao_simplificada']))

        elif opcao == "3":
            expr_str = input("\nDigite f(x) para resolver f(x) = 0 (ex: x**2 - 9 ou 2*x - 10): ").strip()
            solucoes = algebra_engine.resolver_equacao_simbolica(expr_str)
            print(f"\n✅ Soluções encontradas para {expr_str} = 0:")
            for s in solucoes:
                print(f"   x = {s}")
            history_manager.registrar("Equação Simbólica", f"{expr_str} = 0", solucoes)

        elif opcao == "0":
            return
        else:
            print("Opção inválida.")

    except (ValueError, SecurityValidationError) as e:
        print(f"\n❌ Erro: {e}")
        logger.warning("Falha no módulo de álgebra: %s", str(e))


def menu_graficos() -> None:
    """Menu para geração de gráficos com Matplotlib."""
    print("\n--- [4] Visualização: Gráficos de Funções (Matplotlib) ---")
    expr_str = input("Digite a função em termos de x (ex: sin(x), x**2 - 4, cos(x)*x): ").strip()
    x_min = ler_float("Limite inferior do eixo X (padrão -10): ")
    x_max = ler_float("Limite superior do eixo X (padrão 10): ")
    nome_arq = input("Nome do arquivo de saída (padrão: grafico_funcao.png): ").strip() or "grafico_funcao.png"

    try:
        caminho_gerado = plotter.gerar_grafico_funcao(expr_str, x_min, x_max, nome_arquivo=nome_arq)
        print(f"\n✅ Gráfico gerado com sucesso!")
        print(f"   Arquivo salvo em: {caminho_gerado}")
        history_manager.registrar("Gráfico", f"plot({expr_str})", str(caminho_gerado.name))
        logger.info("Gráfico gerado para '%s' em %s", expr_str, caminho_gerado)
    except (ValueError, SecurityValidationError) as e:
        print(f"\n❌ Erro na geração do gráfico: {e}")
        logger.warning("Falha ao gerar gráfico para '%s': %s", expr_str, str(e))


def menu_conversores() -> None:
    """Menu para conversores de unidades e moedas."""
    print("\n--- [5] Conversores & Integrações ---")
    print("1. Conversor de Distância (km, m, cm, mm, mi, yd, ft, in)")
    print("2. Conversor de Temperatura (Celsius, Fahrenheit, Kelvin)")
    print("3. Conversor de Moedas (Cotação via API HTTP com Fallback Seguro)")
    print("0. Voltar ao Menu Principal")

    opcao = input("\nEscolha [0-3]: ").strip()

    try:
        if opcao == "1":
            val = ler_float("Digite o valor da distância: ")
            de = input("Unidade de origem (km, m, cm, mm, mi, yd, ft, in): ").strip()
            para = input("Unidade de destino: ").strip()
            res = unit_converter.converter_distancia(val, de, para)
            print(f"\n✅ {val} {de} = {res} {para}")
            history_manager.registrar("Unidades", f"{val} {de} -> {para}", res)

        elif opcao == "2":
            val = ler_float("Digite a temperatura: ")
            de = input("De (C, F ou K): ").strip()
            para = input("Para (C, F ou K): ").strip()
            res = unit_converter.converter_temperatura(val, de, para)
            print(f"\n✅ {val}°{de.upper()} = {res}°{para.upper()}")
            history_manager.registrar("Temperatura", f"{val}°{de} -> °{para}", res)

        elif opcao == "3":
            val = ler_float("Digite o valor monetário: ")
            de = input("Moeda de origem (ex: USD, BRL, EUR, GBP): ").strip()
            para = input("Moeda de destino (ex: USD, BRL, EUR, GBP): ").strip()
            info = currency_service.converter(val, de, para)
            print(f"\n✅ {info['valor_original']} {info['moeda_origem']} = {info['valor_convertido']} {info['moeda_destino']}")
            print(f"   Taxa Efetiva: 1 {info['moeda_origem']} = {info['taxa_cambio']} {info['moeda_destino']}")
            print(f"   Status: {info['aviso']}")
            history_manager.registrar("Moedas", f"{val} {de} -> {para}", f"{info['valor_convertido']} ({info['aviso']})")

        elif opcao == "0":
            return
        else:
            print("Opção inválida.")

    except ValueError as e:
        print(f"\n❌ Erro: {e}")
        logger.warning("Erro em conversor: %s", str(e))


def menu_historico() -> None:
    """Menu para gerenciar e inspecionar o histórico persistente."""
    print("\n--- [6] Histórico de Operações (JSON Seguro) ---")
    print("1. Listar últimas operações")
    print("2. Exportar histórico para arquivo customizado")
    print("3. Limpar histórico")
    print("0. Voltar ao Menu Principal")

    opcao = input("\nEscolha [0-3]: ").strip()

    if opcao == "1":
        registros = history_manager.listar(limite=20)
        if not registros:
            print("\nℹ️ O histórico está vazio.")
            return

        print(f"\n📜 Últimos {len(registros)} cálculos:")
        for r in registros:
            print(f"   [{r['timestamp'][:19]}] ({r['categoria']}) {r['expressao']} = {r['resultado']}")

    elif opcao == "2":
        nome_arq = input("Digite o nome do arquivo para exportar (ex: backup.json): ").strip()
        try:
            caminho = history_manager.exportar_para_arquivo(nome_arq)
            print(f"\n✅ Histórico exportado com sucesso para: {caminho}")
        except SecurityValidationError as e:
            print(f"\n❌ Erro de Segurança: {e}")

    elif opcao == "3":
        confirmacao = input("Tem certeza que deseja apagar todo o histórico? (s/n): ").strip().lower()
        if confirmacao == "s":
            history_manager.limpar()
            print("\n✅ Histórico limpo com sucesso.")
        else:
            print("\nOperação cancelada.")


def loop_principal() -> None:
    """Loop principal de navegação da Calculadora Científica."""
    logger.info("Sessão da Calculadora Científica iniciada.")

    while True:
        print("\n" + "=" * 55)
        print("  🔬 CALCULADORA CIENTÍFICA & MODULAR PYTHON (v2.0)")
        print("     Alinhada ao Well-Architected Framework")
        print("=" * 55)
        print("  1. Operações Básicas (+, -, *, /) [Zero Regressão]")
        print("  2. Matemática Científica (Potências, Trig, Logs, etc.)")
        print("  3. Álgebra & Expressões (Bhaskara e SymPy Seguro)")
        print("  4. Gráficos de Funções (Matplotlib com Buffer Seguro)")
        print("  5. Conversores & Integrações (Unidades e Câmbio HTTP)")
        print("  6. Histórico de Operações (Persistência JSON)")
        print("  0. Sair")
        print("=" * 55)

        opcao = input("Selecione um módulo [0-6]: ").strip()

        if opcao == "1":
            menu_operacoes_basicas()
        elif opcao == "2":
            menu_cientifico()
        elif opcao == "3":
            menu_algebra()
        elif opcao == "4":
            menu_graficos()
        elif opcao == "5":
            menu_conversores()
        elif opcao == "6":
            menu_historico()
        elif opcao == "0":
            print("\n👋 Encerrando a Calculadora Científica. Até logo!\n")
            logger.info("Sessão da Calculadora Científica finalizada pelo usuário.")
            break
        else:
            print("⚠️ Opção inválida! Escolha entre 0 e 6.")

