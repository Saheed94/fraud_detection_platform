import React, { useState } from "react";
import { fetchTransactions } from "../services/api";

export default function NewTransactionForm({ onTransactionAdded }) {
  const [amount, setAmount] = useState("");
  const [isFraud, setIsFraud] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await fetch("/api/transactions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          transaction_id: `tx-${Date.now()}`, // simple unique ID
          amount: Number(amount),
          is_fraud: isFraud,
          user_id: "simulated-user-001" // match your backend requirement
        }),
      });

      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }

      const data = await response.json();
      onTransactionAdded(); // callback to refresh dashboard
      setAmount("");
      setIsFraud(false);
    } catch (err) {
      console.error(err);
      setError("Failed to add transaction");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{ marginBottom: "2rem" }}>
      <h2>Add New Transaction</h2>
      <div>
        <label>Amount: </label>
        <input
          type="number"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          required
        />
      </div>
      <div>
        {/* <label>Fraudulent? </label> */}
        <input
        //   type="checkbox"
          checked={isFraud}
          onChange={(e) => setIsFraud(e.target.checked)}
        />
      </div>
      <button type="submit" disabled={loading}>
        {loading ? "Adding..." : "Add Transaction"}
      </button>
      {error && <p style={{ color: "red" }}>{error}</p>}
    </form>
  );
}
