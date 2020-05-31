import { format } from 'date-fns';
import { transactionTypes } from './config';

export const parseTransactions = (transactions) => {
  return transactions.map(({ date, amount, type, ...transaction }) => {
    const parseType = transactionTypes.find(({ id }) => id === type).label;
    return {
      ...transaction,
      type: parseType,
      date: format(new Date(date), 'dd/MM/YYY'),
      amount: parseFloat(amount).toFixed(2),
    };
  });
};
