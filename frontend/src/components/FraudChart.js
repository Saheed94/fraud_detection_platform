import React, { useEffect, useState } from "react";
import NewTransactionForm from "./NewTransactionForm";
import { fetchTransactions } from "../services/api";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend,
} from "recharts";

export default function FraudChart() {
  const [transactions, setTransactions] = useState([]);

  const loadTransactions = async () => {
    const data = await fetchTransactions();
    setTransactions(data || []);
  };

  useEffect(() => {
    loadTransactions();
  }, []);

  const fraudCounts = [
    { type: "Fraudulent", count: transactions.filter((tx) => tx.fraud === "Yes").length },
    { type: "Legit", count: transactions.filter((tx) => tx.fraud === "No").length },
  ];

  return (
    <div className="main-content">

      {/* ----------------- NAVBAR ----------------- */}
      <header className="navbar">
        <h1>🚨 Fraud Detection Dashboard By Saheed Ipaye</h1>
      </header>

      <div className="content">

        Add Transaction Card
        <div className="card fade-in">
          {/* <h2>Add New Transaction</h2> */}
          <NewTransactionForm onTransactionAdded={loadTransactions} />
        </div>

        {/* Summary */}
        <div className="card fade-in">
          <h2>Summary</h2>
          <div className="summary-grid">
            <div className="summary-box glow">
              <div className="summary-number">{fraudCounts[0].count}</div>
              <div className="summary-label">Fraudulent</div>
            </div>
            <div className="summary-box glow">
              <div className="summary-number">{fraudCounts[1].count}</div>
              <div className="summary-label">Legit</div>
            </div>
          </div>
        </div>

        {/* Chart */}
        <div className="card fade-in">
          <h2>Fraud Analytics</h2>
          <BarChart width={600} height={300} data={fraudCounts}>
            <defs>
              <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#4dffac" stopOpacity={1} />
                <stop offset="100%" stopColor="#4dffac" stopOpacity={0.2} />
              </linearGradient>
            </defs>
            <CartesianGrid stroke="#334155" />
            <XAxis dataKey="type" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="count" fill="url(#barGradient)" />
          </BarChart>
        </div>

        {/* Transactions Table */}
        <div className="card fade-in">
          <h2>Transaction Records</h2>
          <table className="styled-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Amount</th>
                <th>Fraud</th>
                <th>Created At</th>
              </tr>
            </thead>
            <tbody>
              {transactions.map((tx) => (
                <tr key={tx.id} className={tx.fraud === "Yes" ? "fraud-row" : ""}>
                  <td>{tx.id}</td>
                  <td>${tx.amount}</td>
                  <td>{tx.fraud}</td>
                  <td>{new Date(tx.created_at).toLocaleString("en-US", { hour12: true })}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

      </div>
    </div>
  );
}











// import React, { useEffect, useState } from "react";
// import NewTransactionForm from "./NewTransactionForm";
// import { fetchTransactions } from "../services/api";
// import {
//   BarChart,
//   Bar,
//   XAxis,
//   YAxis,
//   Tooltip,
//   CartesianGrid,
//   Legend,
// } from "recharts";

// export default function FraudChart() {
//   const [transactions, setTransactions] = useState([]);

//   const loadTransactions = async () => {
//     const data = await fetchTransactions();
//     setTransactions(data || []);
//   };

//   useEffect(() => {
//     loadTransactions();
//   }, []);

//   const fraudCounts = [
//     {
//       type: "Fraudulent",
//       count: transactions.filter((tx) => tx.fraud === "Yes").length,
//     },
//     {
//       type: "Legit",
//       count: transactions.filter((tx) => tx.fraud === "No").length,
//     },
//   ];

//   return (
//     <div className="main-content">

//       {/* NAVBAR */}
//       <header className="navbar">
//         <h1>🚨 Fraud Detection Dashboard</h1>
//         <button className="dark-toggle">🌙</button>
//       </header>

//       {/* CONTENT */}
//       <div className="content">

//         {/* Add Transaction Card */}
//         <div className="card fade-in">
//           <h2>Add New Transaction</h2>
//           <NewTransactionForm onTransactionAdded={loadTransactions} />
//         </div>

//         {/* Summary */}
//         <div className="card fade-in">
//           <h2>Summary</h2>

//           <div className="summary-grid">
//             <div className="summary-box glow">
//               <div className="summary-number">{fraudCounts[0].count}</div>
//               <div className="summary-label">Fraudulent</div>
//             </div>

//             <div className="summary-box glow">
//               <div className="summary-number">{fraudCounts[1].count}</div>
//               <div className="summary-label">Legit</div>
//             </div>
//           </div>
//         </div>

//         {/* Chart */}
//         <div className="card fade-in">
//           <h2>Fraud Analytics</h2>

//           <BarChart width={600} height={300} data={fraudCounts}>
//             <defs>
//               <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
//                 <stop offset="0%" stopColor="#4dffac" stopOpacity={1} />
//                 <stop offset="100%" stopColor="#4dffac" stopOpacity={0.2} />
//               </linearGradient>
//             </defs>

//             <CartesianGrid stroke="#cbd5e1" />
//             <XAxis dataKey="type" />
//             <YAxis />
//             <Tooltip />
//             <Legend />
//             <Bar dataKey="count" fill="url(#barGradient)" />
//           </BarChart>
//         </div>

//         {/* Table */}
//         <div className="card fade-in">
//           <h2>Transaction Records</h2>

//           <table className="styled-table">
//             <thead>
//               <tr>
//                 <th>ID</th>
//                 <th>Amount</th>
//                 <th>Fraud</th>
//                 <th>Created At</th>
//               </tr>
//             </thead>

//             <tbody>
//               {transactions.map((tx) => (
//                 <tr
//                   key={tx.id}
//                   className={tx.fraud === "Yes" ? "fraud-row" : ""}
//                 >
//                   <td>{tx.id}</td>
//                   <td>${tx.amount}</td>
//                   <td>{tx.fraud}</td>
//                   <td>
//                     {new Date(tx.created_at).toLocaleString("en-US", {
//                       hour12: true,
//                     })}
//                   </td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         </div>

//       </div>
//     </div>
//   );
// }












// import React, { useEffect, useState } from "react";
// import NewTransactionForm from "./NewTransactionForm";
// import { fetchTransactions } from "../services/api";
// import { BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, Legend } from "recharts";

// export default function FraudChart() {
//   const [transactions, setTransactions] = useState([]);

//   const loadTransactions = async () => {
//     const data = await fetchTransactions();
//     setTransactions(data || []);
//   };

//   useEffect(() => {
//     loadTransactions();
//   }, []);

//   const fraudCounts = [
//     { type: "Fraudulent", count: transactions.filter(tx => tx.fraud === "Yes").length },
//     { type: "Legit", count: transactions.filter(tx => tx.fraud === "No").length },
//   ];

//   return (
//     <div className="container">

//       <div className="card">
//         <h1>Fraud Detection Dashboard</h1>
//         <p style={{ color: "#6a6a6a" }}>Monitor real-time fraudulent activities</p>
//       </div>

//       <div className="card">
//         <NewTransactionForm onTransactionAdded={loadTransactions} />
//       </div>

//       <div className="card">
//         <h2>Summary</h2>

//         <div className="summary-box">
//           <div className="summary-number">{fraudCounts[0].count}</div>
//           <div className="summary-label">Fraudulent Transactions</div>
//         </div>

//         <div className="summary-box">
//           <div className="summary-number">{fraudCounts[1].count}</div>
//           <div className="summary-label">Legit Transactions</div>
//         </div>
//       </div>

//       <div className="card">
//         <h2>Fraud Chart</h2>
//         <BarChart width={600} height={300} data={fraudCounts}>
//           <CartesianGrid stroke="#eee" />
//           <XAxis dataKey="type" />
//           <YAxis />
//           <Tooltip />
//           <Legend />
//           <Bar dataKey="count" fill="#4c7cf3" />
//         </BarChart>
//       </div>

//       <div className="card">
//         <h2>Transactions List</h2>
//         <table>
//           <thead>
//             <tr>
//               <th>ID</th>
//               <th>Amount</th>
//               <th>Fraud</th>
//               <th>Created At</th>
//             </tr>
//           </thead>
//           <tbody>
//             {transactions.map(tx => (
//               <tr key={tx.id} className={tx.fraud === "Yes" ? "fraud-row" : ""}>
//                 <td>{tx.id}</td>
//                 <td>{tx.amount}</td>
//                 <td>{tx.fraud}</td>
//                 <td>{new Date(tx.created_at).toLocaleString()}</td>
//               </tr>
//             ))}
//           </tbody>
//         </table>
//       </div>

//     </div>
//   );
// }












// import React, { useEffect, useState } from "react";
// import NewTransactionForm from "./NewTransactionForm"; 
// import { fetchTransactions } from "../services/api";
// import { BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, Legend } from "recharts";

// export default function FraudChart() {
//   const [transactions, setTransactions] = useState([]);

//   const loadTransactions = async () => {
//     const data = await fetchTransactions();
//     setTransactions(data || []);
//   };

//   useEffect(() => {
//     loadTransactions();
//   }, []);

//   const fraudCounts = [
//     { type: "Fraudulent", count: transactions.filter(tx => tx.fraud === "Yes").length },
//     { type: "Legit", count: transactions.filter(tx => tx.fraud === "No").length },
//   ];

//   return (
//     <div style={{ padding: "2rem" }}>
//       <h1>Fraud Dashboard</h1>

//       {/* FORM */}
//       <NewTransactionForm onTransactionAdded={loadTransactions} />

//       {/* SUMMARY */}
//       <h2>Fraud Summary</h2>
//       <p>Fraudulent Transactions: {fraudCounts[0].count}</p>
//       <p>Legit Transactions: {fraudCounts[1].count}</p>

//       {/* CHART */}
//       <h2>Fraud Counts Chart</h2>
//       <BarChart width={600} height={300} data={fraudCounts} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
//         <CartesianGrid stroke="#ccc" />
//         <XAxis dataKey="type" />
//         <YAxis />
//         <Tooltip />
//         <Legend />
//         <Bar dataKey="count" fill="#4dffacff" />
//       </BarChart>

//       {/* TABLE — added back */}
//       <h2>Transactions List</h2>
//       <table style={{ width: "100%", borderCollapse: "collapse", marginTop: "20px" }}>
//         <thead>
//           <tr>
//             <th style={{ border: "1px solid #ddd", padding: "8px" }}>ID</th>
//             <th style={{ border: "1px solid #ddd", padding: "8px" }}>Amount</th>
//             <th style={{ border: "1px solid rgba(31, 229, 41, 1)", padding: "8px" }}>Fraud</th>
//             <th style={{ border: "1px solid #ddd", padding: "8px" }}>Created At</th>
//           </tr>
//         </thead>
//         <tbody>
//           {transactions.map(tx => (
//             <tr key={tx.id} style={{ backgroundColor: tx.fraud === "Yes" ? '#f8d7da' : 'white' }}>
//               <td style={{ border: "1px solid #ddd", padding: "8px" }}>{tx.id}</td>
//               <td style={{ border: "1px solid #ddd", padding: "8px" }}>{tx.amount}</td>
//               <td style={{ border: "1px solid #ddd", padding: "8px" }}>{tx.fraud}</td>
//               <td style={{ border: "1px solid #ddd", padding: "8px" }}>
//                 {new Date(tx.created_at).toLocaleString()}
//               </td>
//             </tr>
//           ))}
//         </tbody>
//       </table>

//     </div>
//   );
// }










// import React, { useEffect, useState } from "react";
// import NewTransactionForm from "./NewTransactionForm"; // adjust path if needed
// import { fetchTransactions } from "../services/api";
// import { BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, Legend } from "recharts";

// export default function FraudChart() {
//   const [transactions, setTransactions] = useState([]);

//   // Function to load transactions from backend
//   const loadTransactions = async () => {
//     const data = await fetchTransactions();
//     setTransactions(data || []);
//   };

//   // Load transactions on component mount
//   useEffect(() => {
//     loadTransactions();
//   }, []);

//   // Count fraudulent and legit transactions
//   const fraudCounts = [
//     { type: "Fraudulent", count: transactions.filter(tx => tx.fraud === "Yes").length },
//     { type: "Legit", count: transactions.filter(tx => tx.fraud === "No").length },
//   ];

//   return (
//     <div style={{ padding: "2rem" }}>
//       <h1>Fraud Dashboard</h1>

//       {/* New Transaction Form */}
//       <NewTransactionForm onTransactionAdded={loadTransactions} />

//       <h2>Fraud Summary</h2>
//       <p>Fraudulent Transactions: {fraudCounts[0].count}</p>
//       <p>Legit Transactions: {fraudCounts[1].count}</p>

//       <h2>Fraud Counts Chart</h2>
//       <BarChart width={600} height={300} data={fraudCounts} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
//         <CartesianGrid stroke="#ccc" />
//         <XAxis dataKey="type" />
//         <YAxis />
//         <Tooltip />
//         <Legend />
//         <Bar dataKey="count" fill="#4dffacff" />
//       </BarChart>
//     </div>
//   );
// }











// import React, { useEffect, useState } from "react";
// import { fetchTransactions } from "../services/api";
// import { BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, Legend } from "recharts";

// export default function Dashboard() {
//   const [transactions, setTransactions] = useState([]);


//     useEffect(() => {
//   fetchTransactions().then(data => setTransactions(data || []));
// }, []);

//   // Count fraudulent and legit transactions
//   const fraudCounts = [
//     { type: "Fraudulent", count: transactions.filter(tx => tx.fraud === "Yes").length },
//     { type: "Legit", count: transactions.filter(tx => tx.fraud === "No").length },
//   ];

//   return (
//     <div style={{ padding: "2rem" }}>
//       <h1>Fraud Dashboard</h1>

//       <h2>Fraud Summary</h2>
//       <p>Fraudulent Transactions: {fraudCounts[0].count}</p>
//       <p>Legit Transactions: {fraudCounts[1].count}</p>

//       <h2>Fraud Counts Chart</h2>
//       <BarChart width={600} height={300} data={fraudCounts} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
//         <CartesianGrid stroke="#ccc" />
//         <XAxis dataKey="type" />
//         <YAxis />
//         <Tooltip />
//         <Legend />
//         <Bar dataKey="count" fill="#4dffacff" />
//       </BarChart>
  


//       {/* <h2>Transactions List</h2>
//       <table style={{ width: "100%", borderCollapse: "collapse", marginTop: "20px" }}>
//         <thead>
//           <tr>
//             <th style={{ border: "1px solid #ddd", padding: "8px" }}>ID</th>
//             <th style={{ border: "1px solid #ddd", padding: "8px" }}>Amount</th>
//             <th style={{ border: "1px solid rgba(31, 229, 41, 1)", padding: "8px" }}>Fraud</th>
//             <th style={{ border: "1px solid #ddd", padding: "8px" }}>Created At</th>
//           </tr>
//         </thead>
//         <tbody>
//           {transactions.map(tx => (
//             <tr key={tx.id} style={{ backgroundColor: tx.fraud === "Yes" ? '#f8d7da' : 'white' }}>
//               <td style={{ border: "1px solid #ddd", padding: "8px" }}>{tx.id}</td>
//               <td style={{ border: "1px solid #ddd", padding: "8px" }}>{tx.amount}</td>
//               <td style={{ border: "1px solid #ddd", padding: "8px" }}>{tx.fraud}</td>
//               <td style={{ border: "1px solid #ddd", padding: "8px" }}>{new Date(tx.created_at).toLocaleString()}</td>
//             </tr>
//           ))}
//         </tbody>
//       </table> */}
//     </div>
//   );
// }


