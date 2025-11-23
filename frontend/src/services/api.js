export async function fetchTransactions() {
  try {
    const response = await fetch("/api/transactions"); 
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    return data.transactions;
  } catch (error) {
    console.error("Failed to fetch transactions:", error);
    return [];
  }
}

