<script>
  import { onMount } from "svelte";
  import registerIpcRenderer from "../registerIpcRenderer";
  import { closeChildWindow, fetchTransactions } from "../store/actions";
  import TransactionForm from "./TransactionForm.svelte";

  onMount(() => {
    registerIpcRenderer();
    // Temp fetchTransactions to sync store with main window one
    fetchTransactions();
  });
</script>

<style>
  #window-bar {
    -webkit-app-region: drag; /* Enable window drag */
    position: relative;
    width: 100%;
    height: 30px;
    display: flex;
    align-items: center;
    justify-content: center;
    text-align: center;
    background: darkslategray;
    color: white;
  }

  #window-bar button {
    position: absolute;
    top: 0;
    right: 0;
    height: 100%;
    width: 30px;
    color: white;
    border: none;
    background: darkred;
    cursor: pointer;
    transition: opacity 150ms;
  }

  #window-bar button:hover {
    opacity: 0.8;
  }

  main {
    width: 100%;
    height: calc(100% - 30px);
  }
</style>

<div id="window-bar">
  <p>Ajouter une transaction</p>
  <button on:click={closeChildWindow}>X</button>
</div>

<main>
  <TransactionForm />
</main>
