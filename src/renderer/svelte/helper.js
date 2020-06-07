import { format, isEqual, isAfter, isBefore } from 'date-fns';
import { transactionTypes } from './config';

export const parseTransactions = (transactions) => {
  return transactions.map(({ type, ...transaction }) => {
    const getTypeLabel = transactionTypes.find(({ id }) => id === type).label;
    return {
      ...transaction,
      type,
      typeLabel: getTypeLabel,
    };
  });
};

export const formatTransactions = (transactions) => {
  return transactions.map(({ date, amount, ...transaction }) => {
    return {
      ...transaction,
      date: format(new Date(date), 'dd/MM/yyyy'),
      amount: formatCurrencyAmount(amount, 2),
    };
  });
};

export const filterTransactions = (transactions, { from, to }) => {
  return transactions.filter(({ date }) => {
    const currentDate = new Date(date);
    let isDateBefore = false;
    let isDateAfter = false;
    if (!!from) {
      isDateAfter = isEqual(currentDate, from) || isAfter(currentDate, from);
    }
    if (!!to) {
      isDateBefore = isEqual(currentDate, to) || isBefore(currentDate, to);
    }
    return isDateBefore && isDateAfter;
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
