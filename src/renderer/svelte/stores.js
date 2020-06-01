import { writable } from 'svelte/store';
import channels from 'common/channels';
import { fields, transactionTypes, defaultCategories } from './config';
import { parseTransactions, removeDuplicates } from './helper';

const { ipcRenderer } = window.electron;

// Store transactions
function createTransactions() {
  return writable([]);
}
export const transactions = createTransactions();

// Store accounts
function createAccounts() {
  return writable([]);
}
export const accounts = createAccounts();

// Store categories
function createCategories() {
  return writable([]);
}
export const categories = createCategories();

// Fetch transactions
export const fetchData = async () => {
  // TODO - Use Promise.all to wait for all functions to resolve
  const data = await ipcRenderer.invoke(
    channels.FETCH_TRANSACTIONS,
    'should add date range',
  );
  const result = parseTransactions(data);
  transactions.set(result);
  // TODO - Set elsewhere, not in App mounted as we don't need it yet
  setAccounts(data);
  setCategories(data);
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
