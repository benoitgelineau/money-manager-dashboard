<script>
  import {
    format,
    startOfMonth,
    endOfMonth,
    eachMonthOfInterval,
    startOfYear,
    endOfYear,
  } from 'date-fns';
  import frLocale from 'date-fns/locale/fr';
  import { removeDuplicates, formatCurrencyAmount } from '../helper';
  import {
    startDate,
    endDate,
    transactions,
    getOldestDate,
    getLatestDate,
    wealthAmount,
  } from '../store';
  import AmountListAccounts from '../components/AmountListAccounts.svelte';
  import AmountListCategories from '../components/AmountListCategories.svelte';
  import AmountListTypes from '../components/AmountListTypes.svelte';
  import TransactionList from '../components/TransactionList.svelte';

  let selectedPeriod = 'month';

  function handlePeriodRangeChange(event) {
    const { value } = event.target;
    selectedPeriod = value;
    if (value === 'year') {
      udpatePeriod(new Date(availableYears[0], 0));
    } else if (value === 'month') {
      udpatePeriod(new Date(allAvailableMonths[0].value));
    }
  }

  function handlePeriodChange(event) {
    const { value } = event.target;
    udpatePeriod(value);
  }

  function udpatePeriod(date) {
    if (selectedPeriod === 'month') {
      $startDate = startOfMonth(new Date(date));
      $endDate = endOfMonth(new Date(date));
    } else if (selectedPeriod === 'year') {
      $startDate = startOfYear(new Date(date));
      $endDate = endOfYear(new Date(date));
    }
  }

  function getAllAvailableMonths(oldestDate, latestDate) {
    if (!oldestDate || !latestDate) {
      return [];
    }
    return eachMonthOfInterval({
      start: oldestDate,
      end: latestDate,
    })
      .map(date => ({
        label: format(date, 'MMMM yyyy', { locale: frLocale }),
        value: new Date(date),
      }))
      .sort((a, b) => b.value - a.value);
  }

  $: allAvailableMonths = getAllAvailableMonths(
    $getOldestDate,
    $getLatestDate,
  );
  $: availableYears = removeDuplicates(
    allAvailableMonths.map(({ value }) => value.getFullYear()),
  );
</script>

<style>
  #header #title {
    display: flex;
    align-items: center;
  }

  #main-info {
    display: flex;
    justify-content: space-between;
  }

  #account-list-container {
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    overflow: hidden;
  }

  #account-list-container #header {
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    margin-bottom: 10px;
  }

  .periods-filter {
    display: flex;
    align-items: center;
    background: goldenrod;
  }

  .periods-filter label {
    display: inline-block;
  }

  .periods-filter > *:not(:last-child) {
    margin-right: 5px;
  }

  .periods-filter select {
    cursor: pointer;
  }

  #main-info,
  #period-details {
    display: grid;
    grid-gap: 20px;
  }

  #main-info {
    grid-template-columns: 2fr 1fr;
    margin-bottom: 10px;
  }

  #period-details {
    grid-template-columns: 1fr 2fr;
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

  .switch {
    position: relative;
    height: 26px;
    width: 120px;
    margin: 20px auto;
    background: rgba(0, 0, 0, 0.25);
    border-radius: 3px;
    box-shadow: inset 0 1px 3px rgba(0, 0, 0, 0.3),
      0 1px rgba(255, 255, 255, 0.1);
  }
  .switch-label {
    position: relative;
    z-index: 2;
    float: left;
    width: 58px;
    line-height: 26px;
    font-size: 11px;
    color: rgba(255, 255, 255, 0.35);
    text-align: center;
    text-shadow: 0 1px 1px rgba(0, 0, 0, 0.45);
    cursor: pointer;
  }
  .switch-label:active {
    font-weight: bold;
  }

  .switch-label-off {
    padding-left: 2px;
  }

  .switch-label-on {
    padding-right: 2px;
  }

  .switch-input {
    display: none;
  }
  .switch-input:checked + .switch-label {
    font-weight: bold;
    color: rgba(0, 0, 0, 0.65);
    text-shadow: 0 1px rgba(255, 255, 255, 0.25);
    transition: 0.15s ease-out;
    transition-property: color, text-shadow;
  }
  .switch-input:checked + .switch-label-on ~ .switch-selection {
    left: 60px;
    /* Note: left: 50%; doesn't transition in WebKit */
  }
  .switch-selection {
    position: absolute;
    z-index: 1;
    top: 2px;
    left: 2px;
    display: block;
    width: 58px;
    height: 22px;
    border-radius: 3px;
    background-color: #65bd63;
    background-image: linear-gradient(top, #9dd993, #65bd63);
    box-shadow: inset 0 1px rgba(255, 255, 255, 0.5),
      0 0 2px rgba(0, 0, 0, 0.2);
    transition: left 0.15s ease-out;
  }

  #select-period-container {
    min-width: 150px;
    text-align: right;
  }
</style>

<div id="header">
  <div id="title">
    <h2>Vue d'ensemble</h2>
  </div>
</div>

<section id="main-info">
  <div id="account-list-container" class="dashboard-container">
    <div id="header">
      <p>
        <u>Comptes</u>
      </p>
    </div>
    <AmountListAccounts />
  </div>
  <div id="balance-amount" class="dashboard-container">
    <p>
      Patrimoine :
      <span>{formatCurrencyAmount($wealthAmount, 2)}</span>
      <!-- TODO - {arrow icon} with evolution from month-1 in % -->
    </p>
  </div>
</section>

<section id="period-info">
  <div class="periods-filter">
    <div class="switch">
      <input
        type="radio"
        class="switch-input"
        name="view"
        value="month"
        id="month"
        checked
        on:change={handlePeriodRangeChange} />
      <label for="month" class="switch-label switch-label-off">
        Mois
      </label>
      <input
        type="radio"
        class="switch-input"
        name="view"
        value="year"
        id="year"
        on:change={handlePeriodRangeChange} />
      <label for="year" class="switch-label switch-label-on">
        Année
      </label>
      <span class="switch-selection" />
    </div>
    <label id="select-period-container" for="select-period">
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
  <div id="period-details">
    <AmountListTypes />
    <AmountListCategories />
  </div>
</section>

<section id="transaction-list">
  <div class="dashboard-container">
    <div class="header">
      <h4>Transactions</h4>
      <!-- TODO - Search bar, with field filter (:field) -->
      <!-- <input
        type="text"
        name="filterTransaction"
        placeholder="Chercher une transaction..." /> -->
    </div>
    <TransactionList />
  </div>
</section>
