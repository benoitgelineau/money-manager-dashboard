<script>
  import { closeModal } from "../stores";

  function closeFormModal() {
    closeModal();
  }
</script>

<style>

</style>

<button on:click={closeFormModal}>Fermer</button>
