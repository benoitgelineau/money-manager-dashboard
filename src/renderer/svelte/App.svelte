<script>
  import { onMount } from 'svelte';
  import { isAfter } from 'date-fns';
  import { isLoading } from './store';
  import {
    fetchTransactions,
    openChildWindow,
    loadSettings,
  } from './store/actions';
  import registerIpcRenderer from './registerIpcRenderer';
  import HomeView from './views/Home.svelte';
  import EvolutionsView from './views/Evolutions.svelte';
  import AccountSettings from './views/AccountSettings.svelte';

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
  #app-info {
    margin-bottom: 50px;
  }
  #app-info h1 {
    font-size: 1.25rem;
  }
  #app-version {
    font-size: small;
    color: var(--font-color-blur);
  }

  main {
    position: relative;
    height: 100%;
    display: flex;
    align-items: flex-start;
    justify-content: flex-start;
    color: white;
  }

  #sidebar {
    flex: 0 0 200px;
    max-width: 200px;
    align-self: stretch;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    padding: 15px 0 15px 15px;
    margin-right: 20px;
    background: var(--bg-color-light);
    border-radius: 6px;
    overflow: hidden;
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

  button {
    width: 100%;
    text-align: left;
    background: transparent;
    cursor: pointer;
  }

  button.to-view {
    color: var(--font-color-blur);
  }

  [data-active='true'] button {
    color: white !important;
    border-right: solid 3px var(--color-action);
  }

  #bottom {
    margin-bottom: 25px;
  }

  #page-content {
    height: 100%;
    width: 100%;
    padding-right: 5px;
    overflow-x: hidden;
    overflow-y: auto;
  }
</style>

<main>
  <div id="sidebar">
    <div id="top">
      <div id="app-info">
        <h1>Money Manager</h1>
        <div id="app-version" />
      </div>
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
      <!-- <hr style="width: 100%;" />
      <button on:click={openAddTransactionWindow}>
        + Ajouter une transaction
      </button> -->
    </div>

    <div id="bottom">
      <div data-active={currentView === 'account-settings'}>
        <button
          class="to-view"
          on:click={() => showView('account-settings')}>
          Paramètres
        </button>
      </div>
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
