<script>
  import AmountListAccounts from '../components/AmountListAccounts.svelte';
  import AmountListCategories from '../components/AmountListCategories.svelte';
  import AmountListTypes from '../components/AmountListTypes.svelte';
  import TransactionList from '../components/TransactionList.svelte';
  import PeriodFilterBar from '../components/PeriodFilterBar.svelte';
  import WealthContainer from '../components/WealthContainer.svelte';
</script>

<style>
  #header #title {
    display: flex;
    align-items: center;
    padding: 25px 0;
  }

  #account-list-container {
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    max-height: 175px;
    overflow: hidden;
  }

  #main-info,
  #period-details {
    display: grid;
    grid-gap: 20px;
  }

  #main-info {
    grid-template-columns: 60% 1fr;
    margin-bottom: 10px;
  }

  #period-details {
    grid-template-columns: 1fr 2fr;
    margin-bottom: 30px;
  }

  #transation-list .dashboard-container .header {
    display: flex;
    align-items: center;
    justify-content: space-between;
  }
</style>

<div id="header">
  <div id="title">
    <h2>Vue d'ensemble</h2>
  </div>
</div>

<section id="main-info">
  <div id="account-list-container" class="dashboard-container">
    <h3 class="header">Comptes</h3>
    <AmountListAccounts />
  </div>
  <WealthContainer />
</section>

<section id="period-info">
  <PeriodFilterBar />
  <div id="period-details">
    <AmountListTypes />
    <AmountListCategories />
  </div>
</section>

<section id="transaction-list">
  <div class="dashboard-container">
    <div class="header">
      <h3>Transactions</h3>
      <!-- TODO - Search bar, with field filter (:field) -->
      <!-- <input
        type="text"
        name="filterTransaction"
        placeholder="Chercher une transaction..." /> -->
    </div>
    <TransactionList />
  </div>
</section>
