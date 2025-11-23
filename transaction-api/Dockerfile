# -----------------------------
# Stage 1: Builder
# -----------------------------
FROM python:3.11-slim AS builder

WORKDIR /app

# Install pip dependencies
COPY requirements.txt .
RUN pip install --prefix=/install --no-cache-dir -r requirements.txt

# Install curl
RUN apt-get update && apt-get install -y curl && rm -rf /var/lib/apt/lists/*


# Copy app code
COPY main.py .

# -----------------------------
# Stage 2: Production
# -----------------------------
FROM python:3.11-slim

WORKDIR /app

# Copy only installed packages from builder
COPY --from=builder /install /usr/local

# Copy app code
COPY --from=builder /app/main.py .

EXPOSE 8000

# Run the FastAPI app
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]
