export type TransactionType = "expense" | "income";

export type Transaction = {
  id: string;
  type: TransactionType;
  amount: number;
  category: string;
  memo?: string;
  spentAt: string;
  createdAt: string;
};
