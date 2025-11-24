import React, { useEffect, useState } from "react";
import { fetchTransactions } from "./api";
import { BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, Legend } from "recharts";

export default function Dashboard() {
  const [transactions, setTransactions] = useState([]);

  useEffect(() => {
    fetchTransactions().then(data => setTransactions(data.transactions || []));
  }, []);

  // Count fraudulent and legit transactions
  const fraudCounts = [
    { type: "Fraudulent", count: transactions.filter(tx => tx.fraud === "Yes").length },
    { type: "Legit", count: transactions.filter(tx => tx.fraud === "No").length },
  ];

  return (
    <div style={{ padding: "2rem" }}>
      <h1>Fraud Dashboard</h1>

      <h2>Fraud Summary</h2>
      <p>Fraudulent Transactions: {fraudCounts[0].count}</p>
      <p>Legit Transactions: {fraudCounts[1].count}</p>

      <h2>Fraud Counts Chart</h2>
      <BarChart width={600} height={300} data={fraudCounts} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
        <CartesianGrid stroke="#ccc" />
        <XAxis dataKey="type" />
        <YAxis />
        <Tooltip />
        <Legend />
        <Bar dataKey="count" fill="#4dffacff" />
      </BarChart>

      <h2>Transactions List</h2>
      <table style={{ width: "100%", borderCollapse: "collapse", marginTop: "20px" }}>
        <thead>
          <tr>
            <th style={{ border: "1px solid #ddd", padding: "8px" }}>ID</th>
            <th style={{ border: "1px solid #ddd", padding: "8px" }}>Amount</th>
            <th style={{ border: "1px solid rgba(31, 229, 41, 1)", padding: "8px" }}>Fraud</th>
            <th style={{ border: "1px solid #ddd", padding: "8px" }}>Created At</th>
          </tr>
        </thead>
        <tbody>
          {transactions.map(tx => (
            <tr key={tx.id} style={{ backgroundColor: tx.fraud === "Yes" ? '#f8d7da' : 'white' }}>
              <td style={{ border: "1px solid #ddd", padding: "8px" }}>{tx.id}</td>
              <td style={{ border: "1px solid #ddd", padding: "8px" }}>{tx.amount}</td>
              <td style={{ border: "1px solid #ddd", padding: "8px" }}>{tx.fraud}</td>
              <td style={{ border: "1px solid #ddd", padding: "8px" }}>{new Date(tx.created_at).toLocaleString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
