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
      amount: formatCurrencyAmount(amount, 2),
    };
  });
};

export const removeDuplicates = (list) => {
  return list.reduce(
    (unique, item) => (unique.includes(item) ? unique : [...unique, item]),
    [],
  );
};

export const getTotalAmountBy = (field, filterValue, transactions) => {
  return transactions.reduce((amount, transaction) => {
    return transaction[field] === filterValue
      ? amount + parseFloat(transaction.amount)
      : amount;
  }, 0);
};

export const formatCurrencyAmount = (value, decimals) => {
  return new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency: 'EUR',
    minimumFractionDigits: decimals,
    // maximumSignificantDigits: 3,
  }).format(value);
};
