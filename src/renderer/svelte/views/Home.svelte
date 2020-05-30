<script>
  import TransactionList from "../TransactionList.svelte";

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

  .container {
    background: lightgoldenrodyellow;
    border-radius: 4px;
    padding: 25px;
  }

  .container h4 {
    margin: 0;
  }

  .container ul {
    padding-left: 10px;
  }

  .container ul li {
    position: relative;
    display: flex;
    align-items: center;
    justify-content: space-between;
  }

  .container li .label {
    max-width: 300px;
    margin-right: 20px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .container li .absolute-value {
    font-weight: bold;
  }

  .container.expenses li {
    display: grid;
    grid-template-columns: 1fr auto 8px 50px;
  }

  .container.expenses li .separator {
    text-align: center;
  }

  section#details {
    display: flex;
    align-items: flex-start;
    justify-content: flex-start;
    margin-bottom: 30px;
  }

  section#details .container:not(:last-child) {
    margin-right: 25px;
  }

  section#details .container ul {
    margin: 5px 0;
  }

  section#transaction-list .header {
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
  <div class="container types">
    <h4>Répartition par type</h4>
    <ul>
      <li>
        <div class="label">Revenus</div>
        <div class="absolute-value">1950.00€</div>
      </li>
      <li>
        <div class="label">Dépenses</div>
        <div class="absolute-value">1200.00€</div>
      </li>
      <li>
        <div class="label">Epargne</div>
        <div class="absolute-value">200.00€</div>
      </li>
      <li>
        <div class="label">Investissement</div>
        <div class="absolute-value">300.00€</div>
      </li>
    </ul>
  </div>
  <div class="container expenses">
    <h4>Répartition des dépenses par catégorie</h4>
    <ul>
      <li>
        <div class="label">Logement - Loyer</div>
        <div class="absolute-value">450€</div>
        <div class="separator">|</div>
        <div class="relative-value">27%</div>
      </li>
      <li>
        <div class="label">Alimentation</div>
        <div class="absolute-value">300€</div>
        <div class="separator">|</div>
        <div class="relative-value">22%</div>
      </li>
      <li>
        <div class="label">Garage - Loyer</div>
        <div class="absolute-value">65€</div>
        <div class="separator">|</div>
        <div class="relative-value">13%</div>
      </li>
      <li>
        <div class="label">Internet</div>
        <div class="absolute-value">30€</div>
        <div class="separator">|</div>
        <div class="relative-value">6%</div>
      </li>
    </ul>
  </div>
</section>

<section id="transaction-list">
  <div class="container">
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
