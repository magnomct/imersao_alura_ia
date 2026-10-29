# ==============================================================
# Multi-Stage Dockerfile Seguro para Calculadora Científica
# Alinhado ao Well-Architected Framework (Segurança & Eficiência)
# ==============================================================

# --------------------------------------------------------------
# Estágio 1: Builder (Instalação e Compilação de Dependências)
# --------------------------------------------------------------
FROM python:3.12-slim AS builder

WORKDIR /build

# Instala dependências do sistema necessárias para compilação (se houver)
RUN apt-get update && apt-get install -y --no-install-recommends \
    gcc \
    && rm -rf /var/lib/apt/lists/*

COPY requirements.txt .

# Instala dependências no diretório local do usuário sem poluir o sistema global
RUN pip install --no-cache-dir --user -r requirements.txt


# --------------------------------------------------------------
# Estágio 2: Runner de Produção (Enxuto, Seguro e Non-Root)
# --------------------------------------------------------------
FROM python:3.12-slim AS runner

# Variáveis de ambiente para execução segura e eficiente do Python
ENV PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1 \
    PATH="/home/appuser/.local/bin:$PATH" \
    PYTHONPATH="/app"

# Criação de usuário e grupo não-privilegiados (Non-Root User)
RUN groupadd -g 10001 appgroup && \
    useradd -u 10001 -g appgroup -m -s /bin/sh appuser

WORKDIR /app

# Copia pacotes compilados do estágio builder
COPY --from=builder --chown=appuser:appgroup /root/.local /home/appuser/.local

# Copia o código-fonte da aplicação com permissões restritas
COPY --chown=appuser:appgroup . /app

# Garante a existência e permissões dos diretórios de dados e exportações
RUN mkdir -p /app/data /app/exports && \
    chown -R appuser:appgroup /app/data /app/exports && \
    chmod -R 750 /app/data /app/exports

# Ativação do usuário não-root (Segurança por Design)
USER appuser

# Healthcheck simples e confiável
HEALTHCHECK --interval=30s --timeout=5s --start-period=5s --retries=3 \
    CMD python3 -c "import app; print('OK')" || exit 1

ENTRYPOINT ["python3", "main.py"]

