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

export const convertAmountToFloat = (amount) =>
  parseFloat(amount.replace(/\s/g, '').split(',').join('.'));

export const formatInputAmount = (amount) => {
  let parsedAmount = amount;
  const nonDigit = /[^0-9,]/g;
  // Remove non-digit characters
  parsedAmount = parsedAmount.replace(nonDigit, '');

  const splittedParsedAmount = parsedAmount.split(',');
  let numberOfDecimals = 0;
  let shouldAddTrailingComma = false;

  if (splittedParsedAmount.length > 1) {
    const { length } = splittedParsedAmount[1];
    if (length > 2) {
      // Prevent adding more than 2 decimals
      parsedAmount = parsedAmount.slice(0, -1);
    }
    numberOfDecimals = Math.min(length, 2);
    shouldAddTrailingComma = length === 0;
  }
  // Format number with locale
  parsedAmount = convertAmountToFloat(parsedAmount).toLocaleString('fr-FR', {
    minimumFractionDigits: numberOfDecimals,
  });

  if (shouldAddTrailingComma) {
    parsedAmount = `${parsedAmount},`;
  }

  return parsedAmount;
};
