import { z } from "zod";

const TransactionSchema = z.object({
  id: z.string(),
  amount: z.number(),
  type: z.enum(["INCOME", "EXPENSE"]),
  category: z.string(),
  date: z.string(),
});

export type Transaction = z.infer<typeof TransactionSchema>;
