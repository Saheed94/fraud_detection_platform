import { useState, useEffect } from 'react';
import { fetchTransactions } from './services/api';
import TransactionTable from './components/TransactionTable';
import FraudChart from './components/FraudChart';

function App() {
  const [transactions, setTransactions] = useState([]);

  useEffect(() => {
    fetchTransactions().then(setTransactions);
  }, []);

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
      <h1>Fraud Dashboard</h1>
      <FraudChart transactions={transactions} />
      <TransactionTable transactions={transactions} />
    </div>
  );
}

export default App;
