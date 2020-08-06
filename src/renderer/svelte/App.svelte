<script>
  import { onMount } from 'svelte';
  import { isAfter } from 'date-fns';
  import { isLoading, wealthAmount } from './store';
  import {
    fetchTransactions,
    openChildWindow,
    loadSettings,
  } from './store/actions';
  import registerIpcRenderer from './registerIpcRenderer';
  import { formatCurrencyAmount } from './helper';
  import HomeView from './views/Home.svelte';
  import EvolutionsView from './views/Evolutions.svelte';
  import AccountSettings from './views/AccountSettings.svelte';
  import AmountListAccounts from './components/AmountListAccounts.svelte';

  const pages = [
    {
      id: 'home',
      label: 'Dashboard',
    },
    {
      id: 'evolutions',
      label: 'Evolutions',
    },
    {
      id: 'investments',
      label: 'Investissements',
    },
  ];
  let currentView = 'home';

  function showView(id) {
    currentView = id;
  }

  function openAddTransactionWindow() {
    openChildWindow();
  }

  onMount(() => {
    registerIpcRenderer();
    fetchTransactions();
    loadSettings();
  });
</script>

<style>
  header {
    position: relative;
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: space-between;
  }

  #app-info h1 {
    font-size: 1.5rem;
    margin: 0;
  }

  main {
    position: relative;
    flex: 1 1 100%;
    min-height: 0;
    display: flex;
    align-items: flex-start;
    justify-content: flex-start;
    padding: 25px 25px 5px;
  }

  #sidebar {
    flex: 0 0 200px;
    max-width: 200px;
    height: 100%;
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    overflow: hidden;
    margin-right: 20px;
  }

  nav {
    width: 100%;
  }

  nav ul {
    list-style-type: none;
    padding: 0;
  }

  nav li:not(:last-child) {
    margin-bottom: 0.5rem;
  }

  nav button {
    width: 100%;
    text-align: left;
    cursor: pointer;
  }

  nav button.to-view {
    color: grey;
  }

  nav li[data-active='true'] button {
    color: black;
  }

  #account-list-container {
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    overflow: hidden;
  }

  #account-list-container #header {
    display: flex;
    flex: 0 0 auto;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 16px;
  }

  #account-settings {
    width: 40px;
    height: 40px;
    padding: 0;
    cursor: pointer;
  }

  #page-content {
    height: 100%;
    width: 100%;
    overflow-x: hidden;
    overflow-y: auto;
  }
</style>

<header>
  <div id="app-info">
    <h1>My Little Budget App</h1>
    <div id="app-version" />
    <!-- TODO - Toggle light/dark theme -->
  </div>
  <button on:click={openAddTransactionWindow}>
    + Ajouter une transaction
  </button>
</header>

<main>
  <div id="sidebar">
    <nav>
      <ul>
        {#each pages as { id, label }}
          <li data-active={id === currentView}>
            <button class="to-view" on:click={() => showView(id)}>
              {label}
            </button>
          </li>
        {/each}
      </ul>
    </nav>
    <hr style="width: 100%;" />
    <div id="balance-amount">
      <p>
        Patrimoine :
        <span>{formatCurrencyAmount($wealthAmount, 2)}</span>
        <!-- TODO - {arrow icon} with evolution from month-1 in % -->
      </p>
    </div>
    <div id="account-list-container">
      <div id="header">
        <p>
          <u>Comptes</u>
        </p>
        <button
          id="account-settings"
          on:click={() => showView('account-settings')}>
          Icon
        </button>
      </div>
      <AmountListAccounts />
    </div>
  </div>

  {#if $isLoading}
    <p>Chargement</p>
  {:else}
    <div id="page-content">
      {#if currentView === 'home'}
        <HomeView />
      {:else if currentView === 'evolutions'}
        <EvolutionsView />
      {:else if currentView === 'investments'}
        <p>TODO</p>
      {:else if currentView === 'account-settings'}
        <AccountSettings />
      {/if}
    </div>
  {/if}
</main>
