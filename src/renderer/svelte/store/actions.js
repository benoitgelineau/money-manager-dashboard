import { startOfMonth } from 'date-fns';
import channels from 'common/channels';
import {
  setTransactions,
  setStartDate,
  setEndDate,
  setIsLoading,
} from './index';
import { parseTransactions } from '../helper';

const { ipcRenderer } = window.electron;

/**
 * TRANSACTIONS
 */
export const fetchTransactions = async (periodRange) => {
  setIsLoading(true);
  const data = await ipcRenderer.invoke(
    channels.FETCH_TRANSACTIONS,
    periodRange,
  );
  const result = parseTransactions(data);
  setTransactions(result);
  const latest = new Date(result[0].date);
  // Set period to last existing month
  setStartDate(startOfMonth(latest));
  setEndDate(latest);
  setIsLoading(false);
};

export const addTransaction = (data) => {
  ipcRenderer.send(channels.ADD_TRANSACTION, data);
};

/**
 * WINDOWS
 */
export const openChildWindow = () => {
  ipcRenderer.send(channels.OPEN_CHILD_WINDOW);
};

export const closeChildWindow = () => {
  ipcRenderer.send(channels.CLOSE_CHILD_WINDOW);
};
