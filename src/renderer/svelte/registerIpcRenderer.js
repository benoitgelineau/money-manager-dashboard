import channels from 'common/channels';
import { setTransactions, setAccounts } from './store';
import { parseTransactions } from './helper';

const { ipcRenderer } = window.electron;

export default () => {
  ipcRenderer.on(channels.SET_TRANSACTIONS, (data) => {
    const result = parseTransactions(data);
    setTransactions(result);
    setAccounts(result);
  });
};
