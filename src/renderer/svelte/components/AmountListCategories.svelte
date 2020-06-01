<script>
  import DashboardContainer from "./DashboardContainer.svelte";
  import { transactions, categories } from "../stores";
  import { getTotalAmountBy, formatCurrencyAmount } from "../helper";

  let categoriesData = getExpenseCategoriesData();

  function getExpenseCategoriesData() {
    const categories = $categories.find(({ id }) => id === "expense");
    if (!categories) {
      return [];
    }
    return categories.values
      .map(category => {
        const absoluteAmount = getTotalAmountBy(
          "category",
          category,
          $transactions
        );
        const totalExpenses = getTotalAmountBy(
          "type",
          "expense",
          $transactions
        );
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

  $: categoriesData = $categories && getExpenseCategoriesData();
</script>

<style>
  .dashboard-container {
    grid-area: 1 / 2 / span 2 / 2;
  }
</style>

<div class="dashboard-container">
  <DashboardContainer
    title="Répartition des dépenses par catégorie"
    list={categoriesData} />
</div>
