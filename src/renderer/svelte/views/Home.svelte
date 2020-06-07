<script>
  import { format, startOfMonth } from "date-fns";
  import {
    startDate,
    endDate,
    transactions,
    getOldestDate,
    getLatestDate
  } from "../stores.js";
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
  let minStartDate;
  let maxStartDate;
  let minEndDate;
  let maxEndDate = formatDate(Date.now());

  function selectPeriod(id) {
    selectedPeriod = id;
    if (id === "last-month") {
      $startDate = startOfMonth($getLatestDate);
      $endDate = $getLatestDate;
    }
  }

  function handleDateChange(event) {
    const { name, value } = event.target;
    switch (name) {
      case "start-date":
        $startDate = new Date(value);
        break;
      case "end-date":
        $endDate = new Date(value);
        break;
    }
  }

  function formatDate(date) {
    return format(date, "yyyy-MM-dd");
  }

  $: {
    minStartDate = $getOldestDate && formatDate($getOldestDate);
    maxStartDate = $endDate && formatDate($endDate);
    minEndDate = $startDate && formatDate($startDate);
  }
</script>

<style>
  #header {
    display: flex;
    flex-direction: column;
    padding-right: 25px;
  }

  #header #title {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  #header form {
    display: flex;
    align-items: center;
    justify-content: flex-end;
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
  <div id="title">
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
  {#if selectedPeriod === 'custom'}
    <form>
      <label for="start-date">
        Début :
        <input
          type="date"
          name="start-date"
          value={formatDate($startDate)}
          min={minStartDate}
          max={maxStartDate}
          on:change={handleDateChange} />
      </label>
      <label for="end-date">
        Fin :
        <input
          type="date"
          name="end-date"
          value={formatDate($endDate)}
          min={minEndDate}
          max={maxEndDate}
          on:change={handleDateChange} />
      </label>
    </form>
  {/if}
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
