FROM python:3.11-slim

WORKDIR /app
ENV DEBIAN_FRONTEND=noninteractive

# Update and install required packages safely
RUN apt-get update \
    && apt-get install -y --no-install-recommends \
       curl \
       netcat-openbsd \
       apt-utils \
       gnupg \
       ca-certificates \
    && rm -rf /var/lib/apt/lists/*

# Copy dependencies and install Python packages
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy worker code
COPY . .

EXPOSE 8000
CMD ["python", "worker.py"]








# # ------------------------------
# # Stage 1: Builder
# # ------------------------------
# FROM python:3.11-slim AS builder

# WORKDIR /app

# # Copy requirements
# COPY requirements.txt .

# # Upgrade pip and install dependencies to /install
# RUN pip install --upgrade pip && \
#     pip install --no-cache-dir --prefix=/install -r requirements.txt

# # Copy worker code
# COPY worker.py .

# # ------------------------------
# # Stage 2: Production
# # ------------------------------
# FROM python:3.11-slim

# WORKDIR /app

# # Copy installed packages from builder
# COPY --from=builder /install /usr/local

# # Copy worker code
# COPY --from=builder /app/worker.py .

# # Run the worker
# CMD ["python", "worker.py"]
