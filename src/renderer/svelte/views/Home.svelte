<script>
  import TransactionList from "../components/TransactionList.svelte";
  import AmountListTypes from "../components/AmountListTypes.svelte";
  import AmountListCategories from "../components/AmountListCategories.svelte";
  import AmountListAccounts from "../components/AmountListAccounts.svelte";

  const periods = [
    {
      id: "last-month",
      label: "Dernier mois"
    },
    {
      id: "custom",
      label: "Période personnalisée"
    }
  ];
  let selectedPeriod = "last-month";

  function selectPeriod(id) {
    selectedPeriod = id;
  }
</script>

<style>
  #header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding-right: 25px;
  }

  .periods button {
    color: grey;
    cursor: pointer;
  }

  .periods button:not(:last-child) {
    margin-right: 5px;
  }

  .periods button[data-active="true"] {
    color: black;
  }

  section#details {
    display: grid;
    grid-template-columns: 1fr 2fr;
    grid-template-rows: repeat(2, auto);
    grid-gap: 20px;
    margin-bottom: 30px;
  }

  .dashboard-container {
    display: block;
  }

  .dashboard-container .header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 15px;
  }
</style>

<div id="header">
  <h2>Vue globale</h2>
  <div class="periods">
    {#each periods as { id, label }}
      <button
        data-active={id === selectedPeriod}
        on:click={() => selectPeriod(id)}>
        {label}
      </button>
    {/each}
  </div>
</div>

<section id="details">
  <AmountListAccounts />
  <AmountListTypes />
  <AmountListCategories />
</section>

<section id="transaction-list">
  <div class="dashboard-container">
    <div class="header">
      <h4>Transactions</h4>
      <!-- TODO - Search bar, with field filter (:field) -->
      <input
        type="text"
        name="filterTransaction"
        placeholder="Chercher une transaction..." />
    </div>
    <TransactionList />
  </div>
</section>
