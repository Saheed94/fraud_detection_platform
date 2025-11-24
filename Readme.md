# Fraud Detection Platform

A real-time fraud detection system built with microservices architecture, leveraging stream processing and machine learning to detect and prevent fraudulent transactions.

## 📋 Table of Contents

- [Overview](#overview)
- [Architecture](#architecture)
- [Features](#features)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Configuration](#configuration)
- [Usage](#usage)
- [API Documentation](#api-documentation)
- [Project Structure](#project-structure)
- [Development](#development)
- [Monitoring](#monitoring)
- [Troubleshooting](#troubleshooting)
- [Contributing](#contributing)
- [License](#license)

## 🔍 Overview

This fraud detection platform provides real-time analysis of financial transactions to identify and flag potentially fraudulent activities. The system processes transactions through a streaming pipeline, applies machine learning models, and provides instant feedback through a web interface.

### Key Components

- **Transaction API**: RESTful API for submitting and managing transactions
- **Fraud Worker**: Background service that processes transactions and applies fraud detection logic
- **Frontend Dashboard**: Web interface for monitoring transactions and reviewing alerts
- **Message Broker**: RedPanda (Kafka-compatible) for real-time event streaming
- **Database**: PostgreSQL for persistent storage
- **Cache**: Redis for high-performance data caching

## 🏗️ Architecture

```
┌─────────────┐
│   Frontend  │ (Port 8082)
└──────┬──────┘
       │
       ▼
┌─────────────────┐
│ Transaction API │ (Port 8000)
└────┬────────┬───┘
     │        │
     ▼        ▼
┌─────────┐ ┌──────────┐
│PostgreSQL│ │ RedPanda │ (Port 9092)
└─────────┘ └────┬─────┘
     ▲           │
     │           ▼
     │    ┌──────────────┐
     └────┤ Fraud Worker │
          └──────────────┘
                 │
                 ▼
            ┌────────┐
            │ Redis  │ (Port 6379)
            └────────┘
```

### Data Flow

1. Transactions submitted via Frontend or API
2. Transaction API validates and stores in PostgreSQL
3. Event published to RedPanda topic
4. Fraud Worker consumes events and processes them
5. Results stored back to PostgreSQL and cached in Redis
6. Frontend displays real-time updates

## ✨ Features

- **Real-time Processing**: Instant transaction analysis using stream processing
- **ML-based Detection**: Machine learning models for fraud pattern recognition
- **Web Dashboard**: User-friendly interface for monitoring and management
- **Event Streaming**: Scalable message broker for handling high transaction volumes
- **Persistent Storage**: Reliable data storage with PostgreSQL
- **High-performance Caching**: Redis for fast data retrieval
- **Container-based Deployment**: Easy deployment with Docker Compose
- **Admin Console**: RedPanda Console for monitoring message streams

## 🛠️ Prerequisites

Before you begin, ensure you have the following installed:

- Docker (v20.10 or higher)
- Docker Compose (v2.0 or higher)
- Git
- At least 4GB of available RAM
- Ports 5432, 6379, 8000, 8080, 8082, 9092, and 9644 available

## 📦 Installation

### 1. Clone the Repository

```bash
git clone <repository-url>
cd fraud-detection-platform
```

### 2. Set Up Environment Variables

Create a `.env` file in the root directory:

```bash
# Database Configuration
DB_USER=frauduser
DB_PASSWORD=your_secure_password
DB_NAME=frauddb

# RedPanda Configuration
REDPANDA_BOOTSTRAP=redpanda:9092
```

### 3. Build and Start Services

```bash
# Build all services
docker-compose build

# Start all services
docker-compose up -d

# View logs
docker-compose logs -f
```

### 4. Verify Installation

Check that all services are running:

```bash
docker-compose ps
```

All services should show status as "Up" or "healthy".

## ⚙️ Configuration

### Service Ports

| Service | Port | Description |
|---------|------|-------------|
| Transaction API | 8000 | REST API endpoints |
| Frontend | 8082 | Web dashboard |
| RedPanda Console | 8080 | Stream monitoring |
| PostgreSQL | 5432 | Database |
| Redis | 6379 | Cache |
| RedPanda Broker | 9092 | Kafka-compatible broker |
| RedPanda Admin | 9644 | Admin API |

## 🚀 Usage

### Accessing the Services

- **Frontend Dashboard**: http://localhost:8082
- **Transaction API**: http://localhost:8000
- **RedPanda Console**: http://localhost:8080
- **API Documentation**: http://localhost:8000/docs (if using FastAPI)

### Submitting a Transaction

Using curl:

```bash
curl -X POST http://localhost:8000/api/transactions \
  -H "Content-Type: application/json" \
  -d '{
    "amount": 1000.00,
    "merchant_id": "merchant_123",
    "customer_id": "customer_456",
    "timestamp": "2025-11-24T10:00:00Z"
  }'
```

### Monitoring Transactions

1. Open the frontend at http://localhost:8082
2. View real-time transaction feed
3. Check fraud alerts and risk scores
4. Review flagged transactions

### Managing the Platform

```bash
# Stop all services
docker-compose down

# Stop and remove volumes (WARNING: deletes all data)
docker-compose down -v

# Restart a specific service
docker-compose restart transaction-api

# View logs for a specific service
docker-compose logs -f fraud-worker

# Scale a service
docker-compose up -d --scale fraud-worker=3
```

## 📚 API Documentation

### Transaction Endpoints

#### POST /api/transactions
Submit a new transaction for processing

**Request Body:**
```json
{
  "transaction_id": "string",
  "amount": "float",
  "merchant_id": "string",
  "customer_id": "string",
  "timestamp": "datetime"
}
```

**Response:**
```json
{
  "transaction_id": "string",
  "status": "pending|approved|rejected",
  "fraud_score": "float"
}
```

#### GET /api/transactions/{transaction_id}
Retrieve transaction details

#### GET /api/transactions
List all transactions with optional filtering

For complete API documentation, visit http://localhost:8000/docs when the service is running.

## 📁 Project Structure

```
fraud-detection-platform/
├── docker-compose.yml       # Service orchestration
├── .env                     # Environment variables
├── README.md               # This file
│
├── transaction-api/        # Transaction API service
│   ├── Dockerfile
│   ├── requirements.txt
│   └── src/
│
├── fraud-worker/          # Fraud detection worker
│   ├── Dockerfile
│   ├── requirements.txt
│   └── src/
│
└── frontend/              # Web dashboard
    ├── Dockerfile
    └── src/
```

## 👨‍💻 Development

### Local Development Setup

```bash
# Install dependencies for a specific service
cd transaction-api
pip install -r requirements.txt

# Run tests
pytest

# Code formatting
black .
flake8 .
```

### Adding New Features

1. Create a feature branch
2. Implement changes in the appropriate service
3. Update tests
4. Rebuild the affected service: `docker-compose build <service-name>`
5. Test locally
6. Submit a pull request

### Database Migrations

```bash
# Access PostgreSQL
docker-compose exec postgres psql -U frauduser -d frauddb

# Run migrations (if using Alembic)
docker-compose exec transaction-api alembic upgrade head
```

## 📊 Monitoring

### RedPanda Console

Access the RedPanda Console at http://localhost:8080 to:
- Monitor message throughput
- View topic configurations
- Inspect message contents
- Track consumer lag

### Database Monitoring

```bash
# Check database connections
docker-compose exec postgres psql -U frauduser -d frauddb -c "SELECT * FROM pg_stat_activity;"

# View table sizes
docker-compose exec postgres psql -U frauduser -d frauddb -c "\dt+"
```

### Service Health Checks

```bash
# Check service status
docker-compose ps

# View resource usage
docker stats
```

## 🔧 Troubleshooting

### Common Issues

**Services won't start**
- Check if required ports are available: `netstat -an | grep <port>`
- Verify Docker has enough resources allocated
- Check logs: `docker-compose logs <service-name>`

**PostgreSQL connection errors**
- Wait for health check to pass: `docker-compose ps postgres`
- Verify environment variables in `.env`
- Check network connectivity: `docker-compose exec transaction-api ping postgres`

**RedPanda broker unavailable**
- Ensure RedPanda is fully started before dependent services
- Check broker logs: `docker-compose logs redpanda`
- Verify topic creation: http://localhost:8080

**Frontend not loading**
- Check if transaction-api is accessible
- Verify CORS settings in API
- Check browser console for errors

### Logs and Debugging

```bash
# View all logs
docker-compose logs -f

# View specific service logs
docker-compose logs -f fraud-worker

# Follow logs with timestamps
docker-compose logs -f --timestamps

# View last 100 lines
docker-compose logs --tail=100
```

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch: `git checkout -b feature-name`
3. Commit your changes: `git commit -am 'Add new feature'`
4. Push to the branch: `git push origin feature-name`
5. Submit a pull request

