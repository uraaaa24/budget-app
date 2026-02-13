export type Expense = {
  id: string;
  amount: number;
  category: string;
  memo?: string;
  spentAt: string;
  createdAt: string;
};

export type ExpenseFormValues = {
  amount: string;
  category: string;
  memo: string;
};

export type CreateExpenseInput = {
  amount: number;
  category: string;
  memo?: string;
  spentAt: string;
};
