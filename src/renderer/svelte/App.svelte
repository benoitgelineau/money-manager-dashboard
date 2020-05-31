<script>
  import { onMount } from "svelte";
  import { fetchData } from "./stores.js";
  import HomeView from "./views/Home.svelte";
  import EvolutionsView from "./views/Evolutions.svelte";
  import TransactionForm from "./components/TransactionForm.svelte";

  const pages = [
    {
      id: "home",
      label: "Dashboard"
    },
    {
      id: "evolutions",
      label: "Evolutions"
    },
    {
      id: "investments",
      label: "Investissements"
    }
  ];
  let currentView = "home";
  let isLoading = false;

  function showView(id) {
    currentView = id;
  }

  function openFormModal() {
    console.log("TODO open form modal");
  }

  onMount(async () => {
    isLoading = true;
    await fetchData();
    isLoading = false;
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

  nav {
    flex: 0 0 200px;
    margin-right: 20px;
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

  nav li[data-active="true"] button {
    color: black;
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
    <h1>My Little Budget</h1>
    <div id="app-version" />
    <!-- TODO - Toggle light/dark theme -->
  </div>
  <div id="balance-amount">
    <p>
      Patrimoine :
      <span>10 000€</span>
      <!-- TODO - {arrow icon} with evolution from month-1 in % -->
    </p>
  </div>
</header>

<main>
  <nav>
    <ul>
      {#each pages as { id, label }}
        <li data-active={id === currentView}>
          <button class="to-view" on:click={() => showView(id)}>{label}</button>
        </li>
      {/each}
      <hr />
      <li>
        <button on:click={openFormModal}>+ Ajouter une transaction</button>
      </li>
    </ul>
  </nav>

  <div id="page-content">
    {#if currentView === 'home'}
      <HomeView />
    {:else if currentView === 'evolutions'}
      <EvolutionsView />
    {:else if currentView === 'investments'}
      <p>TODO</p>
    {/if}
  </div>
</main>
