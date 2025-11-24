// frontend/src/api.js
export async function fetchTransactions() {
  try {
    const response = await fetch("/api/transactions"); 
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();

    // Map the transactions to include a boolean fraud field
    return data.transactions.map(tx => ({
      ...tx,
      is_fraud: tx.fraud === "Yes",   // convert "Yes"/"No" to true/false
    }));
  } catch (error) {
    console.error("Failed to fetch transactions:", error);
    return [];
  }
}
