<script>
  import { onMount } from "svelte";
  import { addTransaction, closeModal } from "../store/actions";
  import registerIpcRenderer from "../registerIpcRenderer";

  function sendTransaction() {
    const mockTransferTx = {
      date: "2020-06-01",
      type: "transfer",
      description: "",
      category: "",
      source: "VSCode",
      beneficiary: "Me",
      amount: 100
    };
    addTransaction(mockTransferTx);
  }

  function closeFormModal() {
    closeModal();
  }

  onMount(() => {
    registerIpcRenderer();
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
</style>

<div id="window-bar">
  <p>Ajouter une transaction</p>
  <button on:click={closeFormModal}>X</button>
</div>

<main>
  <button on:click={sendTransaction}>Ajouter</button>
</main>
