<script>
  import DashboardContainer from "./DashboardContainer.svelte";
  import { transactions } from "../stores";
  import { getTotalAmountBy, formatCurrencyAmount } from "../helper";

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
  let typesData = getTypesData();

  function getTypesData() {
    return types.map(({ id, label }) => {
      const totalAmount = getTotalAmountBy("type", id, $transactions);
      return {
        id,
        label,
        values: [formatCurrencyAmount(totalAmount, 0)]
      };
    });
  }

  // Force to add $transactions to have data refreshing
  $: typesData = $transactions && getTypesData();
</script>

<style>
  .dashboard-container {
    grid-area: 2 / 1 / 2 / 1;
  }
</style>

<div class="dashboard-container">
  <DashboardContainer title="Répartition par type" list={typesData} />
</div>
