import asyncio
import asyncpg
from aiokafka import AIOKafkaConsumer
import os
import json
from datetime import datetime, timedelta

# -----------------------------
# Environment variables / config
# -----------------------------
DB_USER = os.getenv("DB_USER")
DB_PASSWORD = os.getenv("DB_PASSWORD")
DB_NAME = os.getenv("DB_NAME")
POSTGRES_HOST = os.getenv("POSTGRES_HOST", "postgres")  # use env if available
POSTGRES_PORT = os.getenv("POSTGRES_PORT", 5432)
POSTGRES_DSN = f"postgres://{DB_USER}:{DB_PASSWORD}@{POSTGRES_HOST}:{POSTGRES_PORT}/{DB_NAME}"

REDPANDA_BOOTSTRAP = os.getenv("REDPANDA_BOOTSTRAP", "redpanda:9092")
TOPIC = "transactions"

# -----------------------------
# Fraud rules configuration
# -----------------------------
BLACKLISTED_USERS = {"user123", "fraudster01"}
HIGH_AMOUNT_THRESHOLD = 5_000_000
TIME_WINDOW_SECONDS = 60
MULTI_TX_THRESHOLD = 3
IP_HISTORY = {}

# -----------------------------
# Postgres helper
# -----------------------------
async def wait_for_postgres(max_attempts=20, delay=2):
    attempt = 1
    while attempt <= max_attempts:
        try:
            print(f"Attempt {attempt}/{max_attempts}: Connecting to Postgres...")
            conn = await asyncpg.connect(POSTGRES_DSN)
            await conn.close()
            print("Postgres is ready ✔️")
            return True
        except Exception as e:
            print(f"Postgres not ready yet: {e}")
            await asyncio.sleep(delay)
            attempt += 1
    print("❌ Could not connect to Postgres after several attempts.")
    return False

# -----------------------------
# Main worker
# -----------------------------
async def main():
    ready = await wait_for_postgres()
    if not ready:
        print("❌ Worker exiting because DB is not available.")
        return

    pool = await asyncpg.create_pool(dsn=POSTGRES_DSN)
    print("Connected to Postgres and pool created ✔️")

    consumer = AIOKafkaConsumer(
        TOPIC,
        bootstrap_servers=REDPANDA_BOOTSTRAP,
        group_id="fraud-worker-group",
        auto_offset_reset="earliest"
    )
    await consumer.start()
    print("Fraud worker started and listening for messages...")

    try:
        async for msg in consumer:
            data = json.loads(msg.value.decode())
            print("Received:", data)

            transaction_id = data.get("transaction_id") or data.get("tx_id")
            if not transaction_id:
                print("Skipping message without transaction ID:", data)
                continue

            user_id = data.get("user_id")
            amount = float(data.get("amount", 0))
            ip = data.get("ip")
            created_at = datetime.utcnow()

            # --------- Fraud detection logic ---------
            is_fraud = False

            # High amount
            if amount > HIGH_AMOUNT_THRESHOLD:
                is_fraud = True

            # Suspicious users (case-insensitive)
            if user_id and user_id.lower() in (u.lower() for u in BLACKLISTED_USERS):
                is_fraud = True

            # Multiple transactions from same IP
            if ip:
                now = datetime.utcnow()
                IP_HISTORY.setdefault(ip, [])
                # Keep only timestamps within the window
                IP_HISTORY[ip] = [t for t in IP_HISTORY[ip] if (now - t).total_seconds() <= TIME_WINDOW_SECONDS]
                IP_HISTORY[ip].append(now)
                if len(IP_HISTORY[ip]) > MULTI_TX_THRESHOLD:
                    is_fraud = True

            # --------- Save to Postgres ---------
            async with pool.acquire() as conn:
                await conn.execute("""
                    INSERT INTO fraud_results (transaction_id, amount, is_fraud, created_at)
                    VALUES ($1, $2, $3, $4)
                """, transaction_id, amount, is_fraud, created_at)

            print(f"Saved result → Transaction {transaction_id}, Amount: {amount}, Fraud: {'Yes' if is_fraud else 'No'}")

    finally:
        await consumer.stop()

if __name__ == "__main__":
    asyncio.run(main())
