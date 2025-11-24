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
      <tr key={tx.id} style={{ backgroundColor: tx.fraud === "Yes" ? '#f8d7da' : 'white' }}>
        <td>{tx.id}</td>
        <td>{tx.amount}</td>
        <td>{tx.fraud}</td>
        <td>{new Date(tx.created_at).toLocaleString()}</td>
      </tr>
    ))}
      </tbody>
    </table>
  );
}
