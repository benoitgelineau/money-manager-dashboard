import channels from 'common/channels';
import { setTransactions } from './stores';

const { ipcRenderer } = window.electron;

export default () => {
  ipcRenderer.on(channels.SET_TRANSACTIONS, (data) => {
    setTransactions(data);
  });
};
