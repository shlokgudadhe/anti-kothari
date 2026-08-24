export type Split = { user_id: string; amount: number };
export type ExpenseBalanceInput = { paid_by: string; amount: number; expense_splits: Split[] | null };
export type SettlementBalanceInput = { paid_by: string; paid_to: string; amount: number };
export type Transfer = { from: string; to: string; amount: number };

export function calculateBalances(userIds: string[], expenses: ExpenseBalanceInput[], settlements: SettlementBalanceInput[]) {
  const balances = new Map(userIds.map(id => [id, 0]));
  const add = (id: string, amount: number) => balances.set(id, (balances.get(id) || 0) + amount);
  expenses.forEach(expense => { add(expense.paid_by, Number(expense.amount)); (expense.expense_splits || []).forEach(split => add(split.user_id, -Number(split.amount))); });
  settlements.forEach(settlement => { add(settlement.paid_by, Number(settlement.amount)); add(settlement.paid_to, -Number(settlement.amount)); });
  return balances;
}

export function simplifyBalances(balances: Map<string, number>): Transfer[] {
  const creditors = [...balances].filter(([, amount]) => amount > 0.01).map(([id, amount]) => ({ id, amount }));
  const debtors = [...balances].filter(([, amount]) => amount < -0.01).map(([id, amount]) => ({ id, amount: -amount }));
  const transfers: Transfer[] = [];
  let credit = 0, debt = 0;
  while (credit < creditors.length && debt < debtors.length) {
    const amount = Math.min(creditors[credit].amount, debtors[debt].amount);
    transfers.push({ from: debtors[debt].id, to: creditors[credit].id, amount: Math.round(amount * 100) / 100 });
    creditors[credit].amount -= amount; debtors[debt].amount -= amount;
    if (creditors[credit].amount < 0.01) credit++;
    if (debtors[debt].amount < 0.01) debt++;
  }
  return transfers;
}
