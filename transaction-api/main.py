import os
from fastapi import FastAPI
from pydantic import BaseModel
from kafka import KafkaProducer
from dotenv import load_dotenv
from databases import Database
from datetime import datetime
import json
import uuid
import time

# -----------------------------
# Load environment variables
# -----------------------------
load_dotenv()

REDPANDA_BOOTSTRAP = os.getenv("REDPANDA_BOOTSTRAP", "redpanda:9092")

DB_USER = os.getenv("DB_USER")
DB_PASSWORD = os.getenv("DB_PASSWORD")
DB_NAME = os.getenv("DB_NAME")
POSTGRES_HOST = os.getenv("POSTGRES_HOST", "fraud-platform-postgres")
POSTGRES_PORT = os.getenv("POSTGRES_PORT", 5432)

DATABASE_URL = f"postgresql://{DB_USER}:{DB_PASSWORD}@{POSTGRES_HOST}:{POSTGRES_PORT}/{DB_NAME}"
database = Database(DATABASE_URL)

# -----------------------------
# Kafka producer
# -----------------------------
producer = KafkaProducer(
    bootstrap_servers=[REDPANDA_BOOTSTRAP],
    value_serializer=lambda v: json.dumps(v).encode("utf-8"),
    api_version=(2, 0, 0)
)

# -----------------------------
# FastAPI app
# -----------------------------
app = FastAPI(title="Transaction API")

# -----------------------------
# Transaction schema
# -----------------------------
class Transaction(BaseModel):
    user_id: str
    amount: float
    currency: str = "NGN"
    ip: str | None = None
    device_id: str | None = None
    metadata: dict | None = {}

# -----------------------------
# Startup / Shutdown events
# -----------------------------
@app.on_event("startup")
async def startup():
    await database.connect()

@app.on_event("shutdown")
async def shutdown():
    await database.disconnect()

# -----------------------------
# POST endpoint to create transaction
# -----------------------------
@app.post("/transactions")
async def create_transaction(tx: Transaction):
    tx_dict = tx.dict()
    tx_dict["tx_id"] = str(uuid.uuid4())
    tx_dict["timestamp"] = int(time.time() * 1000)

    try:
        producer.send("transactions", tx_dict)
        producer.flush()
    except Exception as e:
        return {"status": "error", "detail": str(e)}

    return {"status": "accepted", "tx_id": tx_dict["tx_id"]}

# -----------------------------
# GET endpoint to fetch transactions from Postgres
# -----------------------------
@app.get("/transactions")
async def get_transactions():
    query = """
        SELECT transaction_id AS id, amount, is_fraud, created_at
        FROM fraud_results
        ORDER BY created_at DESC
    """
    results = await database.fetch_all(query)

    transactions = []
    for row in results:
        transactions.append({
            "id": row["id"],
            "amount": row["amount"],
            "fraud": "Yes" if row["is_fraud"] else "No",
            "created_at": row["created_at"].strftime("%d/%m/%Y, %H:%M:%S")
        })

    return {"transactions": transactions}
