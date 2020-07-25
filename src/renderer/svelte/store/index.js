import { writable, derived } from 'svelte/store';
import { format } from 'date-fns';
import { fields, transactionTypes, defaultCategories } from '../config';
import {
  filterTransactions,
  formatTransactions,
  removeDuplicates,
} from '../helper';

// Temp initial amounts
const getInitialAmount = (account) => {
  const initialAmount = {
    'La Banque Postale - CCP': 876.55,
    'La Banque Postale - Livret A': 8.67,
    'La Banque Postale - LDDS': 4209.98,
    'Crédit Coopératif - CCP': 300,
    'Crédit Coopératif - LDDS': 10,
    'LINXEA Avenir - Assurance-vie - Epargne': 3000,
    'BforBank - PEA': 1305.19,
  };
  return Object.keys(initialAmount).includes(account)
    ? initialAmount[account]
    : 0;
};
// Temp store main account (should be store with csv filepath in user settings)
export const MAIN_ACCOUNT = 'Crédit Coopératif - CCP';

/**
 * STATE
 */
export const isLoading = writable(false);

export const transactions = writable([]);
export const accounts = writable([]);
// export const newTransaction = createTransaction();

export const startDate = writable({});
export const endDate = writable({});

// Filter transactions list with period range
export const filteredTransactions = derived(
  [transactions, startDate, endDate],
  ([$transactions, $startDate, $endDate]) =>
    filterTransactions($transactions, {
      from: $startDate,
      to: $endDate,
    }),
);

// Format date and amount values
export const formattedTransactions = derived(
  filteredTransactions,
  ($filteredTransactions) => formatTransactions($filteredTransactions),
);

export const getOldestDate = derived(transactions, ($transactions) =>
  $transactions.length > 0 ? new Date($transactions[0].date) : null,
);

export const getLatestDate = derived(transactions, ($transactions) =>
  // $transactions.length > 0 ? new Date([...$transactions].pop().date) : null,
  $transactions.length > 0
    ? new Date($transactions[$transactions.length - 1].date)
    : null,
);

export const categories = derived(transactions, ($transactions) => {
  const getCategoriesByType = (id) =>
    removeDuplicates(
      $transactions
        .map(({ type, category }) => type === id && category)
        .filter((item) => !!item),
    );
  return defaultCategories.map(({ id, values }) => ({
    id,
    values: removeDuplicates([...values, ...getCategoriesByType(id)]),
  }));
});

export const selectedAccounts = derived(accounts, ($accounts) =>
  $accounts.filter((account) => !!account.selected),
);

export const totalAccountAmounts = derived(
  [accounts, transactions],
  ([$accounts, $transactions]) => {
    return $accounts
      .map(({ name }) => name)
      .sort()
      .map((accountName) => {
        const totalAmount = $transactions.reduce((amount, transaction) => {
          const shouldIncreaseAmount =
            transaction.beneficiary === accountName &&
            (transaction.type === 'income' || transaction.type === 'transfer');
          const shouldDecreaseAmount =
            transaction.source === accountName &&
            (transaction.type === 'expense' || transaction.type === 'transfer');
          if (shouldIncreaseAmount) {
            return amount + parseFloat(transaction.amount);
          } else if (shouldDecreaseAmount) {
            return amount - parseFloat(transaction.amount);
          }
          return amount;
        }, 0);
        return {
          label: accountName,
          amount: totalAmount + getInitialAmount(accountName),
        };
      });
  },
);

// Add all accounts amounts
export const wealthAmount = derived(
  totalAccountAmounts,
  ($totalAccountAmounts) => {
    return $totalAccountAmounts.reduce((totalAmount, account) => {
      return totalAmount + parseFloat(account.amount);
    }, 0);
  },
);

/**
 * MUTATIONS
 */
export const setIsLoading = (bool) => {
  isLoading.set(bool);
};
export const setTransactions = (data) => {
  transactions.set(data);
};
export const setAccounts = (transactions) => {
  const parsedAccounts = transactions.flatMap(
    ({ type, source, beneficiary }) => {
      switch (type) {
        case 'transfer':
          return [source, beneficiary];
        case 'income':
          return beneficiary;
        case 'expense':
          return source;
      }
    },
  );
  const result = removeDuplicates(parsedAccounts).map((account) => ({
    name: account,
    type: 'current',
    selected: true,
  }));
  accounts.set(result);
};
export const setAccountSelected = ({ name, selected }) => {
  accounts.update((storedAccounts) =>
    storedAccounts.map((account) =>
      account.name === name
        ? {
            ...account,
            selected,
          }
        : account,
    ),
  );
};
export const setAccountType = ({ name, type }) => {
  accounts.update((storedAccounts) =>
    storedAccounts.map((account) =>
      account.name === name
        ? {
            ...account,
            type,
          }
        : account,
    ),
  );
};
export const setStartDate = (date) => {
  startDate.set(date);
};
export const setEndDate = (date) => {
  endDate.set(date);
};

// Handle new transaction fields
// function createTransaction() {
//   const defaultTransaction = fields.reduce((insertedFields, field) => {
//     const defaultValues = {
//       type: transactionTypes[0],
//       date: format(Date.now(), 'yyyy-MM-dd'),
//       source: MAIN_ACCOUNT,
//       // category: categories[0],
//     };
//     return {
//       ...insertedFields,
//       [field.id]: defaultValues[field.id] || '',
//     };
//   }, {});
//   const { subscribe, set, update } = writable(defaultTransaction);
//   return {
//     subscribe,
//     update,
//     set,
//     reset: () => {
//       update((transaction) => {
//         const notToResetFields = ['type', 'date'];
//         return Object.keys(transaction).reduce(
//           (a, b) => ({
//             ...a,
//             [b]: notToResetFields.includes(b) ? transaction[b] : '',
//           }),
//           {},
//         );
//       });
//     },
//   };
// }
