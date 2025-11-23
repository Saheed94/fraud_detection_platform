import requests

payload = {
    "user_id": "user123",
    "amount": 150000,
    "ip": "41.223.12.1",
    "device_id": "device-xyz"
}

try:
    print("Sending request...")
    res = requests.post("http://localhost:8000/transactions", json=payload)

    print("\nStatus Code:", res.status_code)
    print("Response Body:", res.text)

except Exception as e:
    print("\nERROR:", e)
