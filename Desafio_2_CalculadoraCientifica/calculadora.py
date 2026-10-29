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
