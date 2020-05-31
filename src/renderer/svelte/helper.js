import { format } from 'date-fns';
import { transactionTypes } from './config';

export const parseTransactions = (transactions) => {
  return transactions.map(({ date, amount, type, ...transaction }) => {
    const getTypeLabel = transactionTypes.find(({ id }) => id === type).label;
    return {
      ...transaction,
      type,
      typeLabel: getTypeLabel,
      date: format(new Date(date), 'dd/MM/YYY'),
      amount: parseFloat(amount).toFixed(2),
    };
  });
};

export const removeDuplicates = (list) => {
  return list.reduce(
    (unique, item) => (unique.includes(item) ? unique : [...unique, item]),
    [],
  );
};

export const formatCurrencyAmount = (value, decimals) => {
  return new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency: 'EUR',
    minimumFractionDigits: decimals,
    // maximumSignificantDigits: 3,
  }).format(value);
};
