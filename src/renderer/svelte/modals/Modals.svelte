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

</style>

<button on:click={sendTransaction}>Ajouter</button>
<button on:click={closeFormModal}>Fermer</button>
