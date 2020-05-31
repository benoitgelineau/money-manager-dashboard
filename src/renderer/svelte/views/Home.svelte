<script>
  import TransactionList from "../components/TransactionList.svelte";
  import DashboardContainer from "../components/DashboardContainer.svelte";
  import { transactions, categories } from "../stores";
  import { formatCurrencyAmount } from "../helper";

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
  // TODO - Be able to tag an account (as Investment to display total amount in here)
  const types = [
    {
      id: "income",
      label: "Revenus"
    },
    {
      id: "expense",
      label: "Dépenses"
    }
  ];
  let selectedPeriod = "last-month";
  let typesData = getTypesData();
  let categoriesData = getExpenseCategoriesData();

  function selectPeriod(id) {
    selectedPeriod = id;
  }

  function getTypesData() {
    return types.map(({ id, label }) => {
      const totalAmount = getTotalAmountBy("type", id);
      return {
        id,
        label,
        values: [formatCurrencyAmount(totalAmount, 0)]
      };
    });
  }

  function getExpenseCategoriesData() {
    const categories = $categories.find(({ id }) => id === "expense");
    if (!categories) {
      return [];
    }
    return categories.values
      .map(category => {
        const absoluteAmount = getTotalAmountBy("category", category);
        const totalExpenses = getTotalAmountBy("type", "expense");
        const getRelativeAmount = () => {
          const value = (parseFloat(absoluteAmount) / totalExpenses) * 100;
          return `${value.toFixed(2)}%`;
        };
        return {
          label: category,
          values: [formatCurrencyAmount(absoluteAmount, 2), getRelativeAmount()]
        };
      })
      .sort((a, b) => parseFloat(b.values[0]) - parseFloat(a.values[0]));
  }

  function getTotalAmountBy(field, filterValue) {
    return $transactions.reduce((amount, transaction) => {
      return transaction[field] === filterValue
        ? amount + parseFloat(transaction.amount)
        : amount;
    }, 0);
  }

  // Force to add $transactions to have data refreshing
  $: typesData = $transactions && getTypesData();
  $: categoriesData = $categories && getExpenseCategoriesData();
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

  section#details {
    display: flex;
    align-items: flex-start;
    justify-content: flex-start;
    margin-bottom: 30px;
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
  <DashboardContainer title="Répartition par type" list={typesData} />
  <DashboardContainer
    title="Répartition des dépenses par catégorie"
    list={categoriesData} />
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
