import type { Transaction } from "../types/Transaction";

export let transactions: Transaction[] = [
  {
    id: "12c18cfb-c130-4870-9bcd-5e386f90d1d4",
    amount: 1000,
    type: "INCOME",
    category: "Salary",
    date: "2023-10-01",
  },
  {
    id: "dff2d0b7-4439-44c0-bee6-b93d9a3bae04",
    amount: 200,
    type: "EXPENSE",
    category: "Groceries",
    date: "2023-10-02",
  },
];
