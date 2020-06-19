import { writable, derived } from 'svelte/store';
import { startOfMonth, parse } from 'date-fns';
import channels from 'common/channels';
import { fields, transactionTypes, defaultCategories } from './config';
import {
  filterTransactions,
  formatCurrencyAmount,
  formatTransactions,
  parseTransactions,
  removeDuplicates,
} from './helper';

const { ipcRenderer } = window.electron;

/**
 * MODAL
 */
export const openModal = () => {
  ipcRenderer.send(channels.OPEN_MODAL);
};

export const closeModal = () => {
  ipcRenderer.send(channels.CLOSE_MODAL);
};

export const addTransaction = (data) => {
  ipcRenderer.send(channels.ADD_TRANSACTION, data);
};

// Handle new transaction fields
function createTransaction() {
  //   const defaultTransaction = fields.reduce((insertedFields, field) => {
  //     const defaultValues = {
  //       type: transactionTypes[0],
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
  //       update((transaction) =>
  //         Object.keys(transaction).reduce(
  //           (a, b) => ({
  //             ...a,
  //             [b]: b === 'type' ? transaction[b] : '', // Do not reset type
  //           }),
  //           {},
  //         ),
  //       );
  //     },
  //   };
}

export const newTransaction = createTransaction();

/**
 * APP
 */
// Temp initial amounts
const getInitialAmount = (account) => {
  const initialAmount = {
    'La Banque Postale - CCP': 876.55,
    'La Banque Postale - Livret A': 8.67,
    'La Banque Postale - LDDS': 4209.98,
    'Crédit Coopératif - CCP': 300,
    'Crédit Coopératif - LDDS': 10,
    'Assurance-vie - LINXEA Avenir': 3000,
    'BforBank - PEA': 1305.19,
  };
  return Object.keys(initialAmount).includes(account)
    ? initialAmount[account]
    : 0;
};

// Store transactions
export const transactions = writable([]);

// Store start date as Date object
export const startDate = writable(null);

// Store end date as Date object
export const endDate = writable(null);

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
  // $transactions.length > 0 ? new Date([...$transactions].pop().date) : null,
  $transactions.length > 0
    ? new Date($transactions[$transactions.length - 1].date)
    : null,
);

export const getLatestDate = derived(transactions, ($transactions) =>
  $transactions.length > 0 ? new Date($transactions[0].date) : null,
);

// Store accounts
export const accounts = writable([]);

// Store categories
export const categories = writable([]);

export const setTransactions = (data) => {
  const result = parseTransactions(data);
  transactions.set(result);
  return result;
};

// Fetch transactions
export const fetchData = async (periodRange) => {
  // TODO - Use Promise.all to wait for all functions to resolve
  const data = await ipcRenderer.invoke(
    channels.FETCH_TRANSACTIONS,
    periodRange,
  );
  const result = setTransactions(data);
  // TODO - Set elsewhere, not in App mounted as we don't need it yet
  setAccounts(data);
  setCategories(data);
  const latest = new Date(result[0].date);
  startDate.set(startOfMonth(latest));
  // const oldest = new Date(result[result.length - 1].date);
  // startDate.set(startOfMonth(oldest));
  endDate.set(latest);
  return result;
};

// Get accounts total amount with label
export const accountsData = derived(
  [accounts, transactions],
  ([$accounts, $transactions]) => {
    return $accounts.sort().map((account) => {
      const totalAmount = $transactions.reduce((amount, transaction) => {
        const shouldIncreaseAmount =
          transaction.beneficiary === account &&
          (transaction.type === 'income' || transaction.type === 'transfer');
        const shouldDecreaseAmount =
          transaction.source === account &&
          (transaction.type === 'expense' || transaction.type === 'transfer');
        if (shouldIncreaseAmount) {
          return amount + parseFloat(transaction.amount);
        } else if (shouldDecreaseAmount) {
          return amount - parseFloat(transaction.amount);
        }
        return amount;
      }, 0);
      return {
        label: account,
        amount: totalAmount + getInitialAmount(account),
      };
    });
  },
);

// Get total accounts amount
export const wealthAmount = derived(accountsData, ($accountsData) => {
  return $accountsData.reduce((totalAmount, account) => {
    return totalAmount + parseFloat(account.amount);
  }, 0);
});

function setAccounts(transactions) {
  const result = transactions.flatMap(({ type, source, beneficiary }) => {
    switch (type) {
      case 'transfer':
        return [source, beneficiary];
      case 'income':
        return beneficiary;
      case 'expense':
        return source;
    }
  });
  accounts.set(removeDuplicates(result));
}

function setCategories(transactions) {
  const getCategoriesByType = (id) =>
    removeDuplicates(
      transactions
        .map(({ type, category }) => type === id && category)
        .filter((item) => !!item),
    );
  const result = defaultCategories.map(({ id, values }) => ({
    id,
    values: removeDuplicates([...values, ...getCategoriesByType(id)]),
  }));
  categories.set(result);
}
