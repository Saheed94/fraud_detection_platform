FROM python:3.11-alpine

WORKDIR /app

# Install required packages including netcat
RUN apk add --no-cache bash curl netcat-openbsd

# Copy worker code
COPY . .

# Install Python dependencies
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

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
