import { writable, derived } from 'svelte/store';
import { startOfMonth } from 'date-fns';
import channels from 'common/channels';
import { fields, transactionTypes, defaultCategories } from './config';
import {
  parseTransactions,
  formatTransactions,
  filterTransactions,
  removeDuplicates,
} from './helper';

const { ipcRenderer } = window.electron;

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
  $transactions.length > 0 ? new Date([...$transactions].pop().date) : null,
);

export const getLatestDate = derived(transactions, ($transactions) =>
  $transactions.length > 0 ? new Date($transactions[0].date) : null,
);

// Store accounts
export const accounts = writable([]);

// Store categories
export const categories = writable([]);

// Fetch transactions
export const fetchData = async (periodRange) => {
  // TODO - Use Promise.all to wait for all functions to resolve
  const data = await ipcRenderer.invoke(
    channels.FETCH_TRANSACTIONS,
    periodRange,
  );
  const result = parseTransactions(data);
  transactions.set(result);
  // TODO - Set elsewhere, not in App mounted as we don't need it yet
  setAccounts(data);
  setCategories(data);
  const latestDate = new Date(result[0].date);
  startDate.set(startOfMonth(latestDate));
  endDate.set(latestDate);
  return result;
};

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
