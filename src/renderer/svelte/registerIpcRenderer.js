import channels from 'common/channels';
import { setTransactions } from './store';
import { parseTransactions } from './helper';

const { ipcRenderer } = window.electron;

export default () => {
  ipcRenderer.on(channels.SET_TRANSACTIONS, (data) => {
    setTransactions(parseTransactions(data));
  });
};
