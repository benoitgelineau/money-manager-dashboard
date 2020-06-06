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
    return (
      categories.values
        // Get amounts
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
          const getRelativeAmount = () =>
            (parseFloat(absoluteAmount) / totalExpenses) * 100;
          return {
            label: category,
            values: [absoluteAmount, getRelativeAmount()]
          };
        })
        // Sort from higher to lower value
        .sort((a, b) => parseFloat(b.values[0]) - parseFloat(a.values[0]))
        // Format values
        .map(({ label, values }) => {
          const [absoluteValue, relativeValue] = values;
          return {
            label,
            values: [
              formatCurrencyAmount(absoluteValue, 2),
              `${relativeValue.toFixed(2)}%`
            ]
          };
        })
    );
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
