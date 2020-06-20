<script>
  import DashboardContainer from "./DashboardContainer.svelte";
  import { filteredTransactions } from "../store";
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

  function getTypesData(transactions) {
    return types.map(({ id, label }) => {
      const totalAmount = getTotalAmountBy("type", id, transactions);
      return {
        id,
        label,
        values: [formatCurrencyAmount(totalAmount, 0)]
      };
    });
  }

  $: typesData = getTypesData($filteredTransactions);
</script>

<style>
  .dashboard-container {
    grid-area: 1 / 1 / 1 / 1;
  }
</style>

<div class="dashboard-container">
  <DashboardContainer title="Répartition par type" list={typesData} />
</div>
