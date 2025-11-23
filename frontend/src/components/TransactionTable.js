export default function TransactionTable({ transactions }) {
  return (
    <table style={{ width: '100%', marginTop: '20px', borderCollapse: 'collapse' }}>
      <thead>
        <tr>
          <th>ID</th>
          <th>Amount</th>
          <th>Fraud</th>
          <th>Created At</th>
        </tr>
      </thead>
      <tbody>
        {transactions.map(tx => (
          <tr key={tx.transaction_id} style={{ backgroundColor: tx.is_fraud ? '#f8d7da' : 'white' }}>
            <td>{tx.transaction_id}</td>
            <td>{tx.amount}</td>
            <td>{tx.is_fraud ? "Yes" : "No"}</td>
            <td>{new Date(tx.created_at).toLocaleString()}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
