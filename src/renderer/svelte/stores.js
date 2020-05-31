import { writable } from 'svelte/store';
import channels from 'common/channels';
import { fields, transactionTypes, categories } from './config';
import { parseTransactions } from './helper';

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

// Fetch transactions
export const fetchTransactions = async () => {
  const data = await ipcRenderer.invoke(
  const result = await ipcRenderer.invoke(
    channels.FETCH_TRANSACTIONS,
    'should add date range',
  );
  const result = parseTransactions(data);
  transactions.set(result);
  return result;
};

// Store transactions
function createTransactions() {
  return writable([]);
}

export const transactions = createTransactions();

// Handle new transaction fields
function createTransaction() {
  const defaultTransaction = fields.reduce((insertedFields, field) => {
    const defaultValues = {
      type: transactionTypes[0],
      // category: categories[0],
    };
    return {
      ...insertedFields,
      [field.id]: defaultValues[field.id] || '',
    };
  }, {});
  const { subscribe, set, update } = writable(defaultTransaction);

  return {
    subscribe,
    update,
    set,
    reset: () => {
      update((transaction) =>
        Object.keys(transaction).reduce(
          (a, b) => ({
            ...a,
            [b]: b === 'type' ? transaction[b] : '', // Do not reset type
          }),
          {},
        ),
      );
    },
  };
}

export const newTransaction = createTransaction();
