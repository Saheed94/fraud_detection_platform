import React, { useEffect, useState } from "react";
import { fetchTransactions } from "./api";
import { LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid } from "recharts";

function Dashboard() {
  const [transactions, setTransactions] = useState([]);

  useEffect(() => {
    // Fetch data when the component mounts
    fetchTransactions().then(data => setTransactions(data));
  }, []);

  // Transform data for charting
  const chartData = transactions.map(tx => ({
    id: tx.transaction_id,
    amount: tx.amount,
    fraud: tx.is_fraud ? 1 : 0
  }));

  return (
    <div style={{ padding: "2rem" }}>
      <h1>Fraud Dashboard</h1>
      <LineChart width={800} height={400} data={chartData}>
        <CartesianGrid stroke="#ccc" />
        <XAxis dataKey="id" />
        <YAxis />
        <Tooltip />
        <Line type="monotone" dataKey="amount" stroke="#8884d8" />
        <Line type="monotone" dataKey="fraud" stroke="#ff0000" />
      </LineChart>
      <div>
        {transactions.map(tx => (
          <div key={tx.transaction_id}>
            {tx.transaction_id}: {tx.amount} - {tx.is_fraud ? "Fraud" : "OK"}
          </div>
        ))}
      </div>
    </div>
  );
}

export default Dashboard;
