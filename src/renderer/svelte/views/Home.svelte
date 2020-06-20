<script>
  import {
    format,
    startOfMonth,
    endOfMonth,
    eachMonthOfInterval,
    startOfYear,
    endOfYear
  } from "date-fns";
  import frLocale from "date-fns/locale/fr";
  import { removeDuplicates } from "../helper";
  import {
    startDate,
    endDate,
    transactions,
    getOldestDate,
    getLatestDate
  } from "../store";
  import TransactionList from "../components/TransactionList.svelte";
  import AmountListTypes from "../components/AmountListTypes.svelte";
  import AmountListCategories from "../components/AmountListCategories.svelte";

  let allAvailableMonths = [];
  let availableYears = [];
  let selectedPeriod = "month";

  function handlePeriodRangeChange(event) {
    const { value } = event.target;
    selectedPeriod = value;
    if (value === "year") {
      udpatePeriod(new Date(availableYears[0], 0));
    } else if (value === "month") {
      udpatePeriod(new Date(allAvailableMonths[0].value));
    }
  }

  function handlePeriodChange(event) {
    const { value } = event.target;
    udpatePeriod(value);
  }

  function udpatePeriod(date) {
    if (selectedPeriod === "month") {
      $startDate = startOfMonth(new Date(date));
      $endDate = endOfMonth(new Date(date));
    } else if (selectedPeriod === "year") {
      $startDate = startOfYear(new Date(date));
      $endDate = endOfYear(new Date(date));
    }
  }

  $: {
    allAvailableMonths =
      $getOldestDate && $getLatestDate
        ? eachMonthOfInterval({
            start: $getOldestDate,
            end: $getLatestDate
          })
            .map(date => ({
              label: format(date, "MMMM yyyy", { locale: frLocale }),
              value: new Date(date)
            }))
            .sort((a, b) => b.value - a.value)
        : [];
    availableYears = removeDuplicates(
      allAvailableMonths.map(({ value }) => value.getFullYear())
    );
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

  .periods label {
    display: inline-block;
  }

  .periods label:not(:last-child) {
    margin-right: 5px;
  }

  .periods select {
    cursor: pointer;
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
    <h2>Vue d'ensemble</h2>
    <div class="periods">
      <label for="select-period-range">
        <select
          name="period-range-select"
          id="select-period-range"
          on:change={handlePeriodRangeChange}>
          <option value="month">Mois</option>
          <option value="year">Année</option>
        </select>
      </label>
      <label for="select-period">
        <select
          name="period-select"
          id="select-period"
          on:change={handlePeriodChange}>
          {#if selectedPeriod === 'month'}
            {#each allAvailableMonths as { label, value }}
              <option {value}>{label}</option>
            {/each}
          {:else if selectedPeriod === 'year'}
            {#each availableYears as value}
              <option {value}>{value}</option>
            {/each}
          {/if}
        </select>
      </label>
    </div>
  </div>
</div>

<section id="details">
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
