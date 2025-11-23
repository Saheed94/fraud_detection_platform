import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from 'recharts';

export default function FraudChart({ transactions }) {
  const data = [
    {
      type: 'Fraudulent',
      count: transactions.filter(tx => tx.is_fraud).length
    },
    {
      type: 'Normal',
      count: transactions.filter(tx => !tx.is_fraud).length
    }
  ];

  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={data}>
        <XAxis dataKey="type" />
        <YAxis />
        <Tooltip />
        <Legend />
        <Bar dataKey="count" fill="#8884d8" />
      </BarChart>
    </ResponsiveContainer>
  );
}
