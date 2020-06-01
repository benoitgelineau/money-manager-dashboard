<script>
  import DashboardContainer from "./DashboardContainer.svelte";
  import { transactions, accounts } from "../stores";
  import { formatCurrencyAmount } from "../helper";

  let accountsData = getAccountsData();

  function getAccountsData() {
    return $accounts.map(account => {
      const totalAmount = $transactions.reduce((amount, transaction) => {
        const shouldIncreaseAmount =
          transaction.beneficiary === account &&
          (transaction.type === "income" || transaction.type === "transfer");
        const shouldDecreaseAmount =
          transaction.source === account &&
          (transaction.type === "expense" || transaction.type === "transfer");
        if (shouldIncreaseAmount) {
          return amount + parseFloat(transaction.amount);
        } else if (shouldDecreaseAmount) {
          return amount - parseFloat(transaction.amount);
        }
        return amount;
      }, 0);
      return {
        label: account,
        values: [formatCurrencyAmount(totalAmount, 2)]
      };
    });
  }

  // Force to add $transactions to have data refreshing
  $: accountsData = $transactions && getAccountsData();
</script>

<style>
  .dashboard-container {
    grid-area: 1 / 1 / 1 / 1;
  }
</style>

<div class="dashboard-container">
  <DashboardContainer title="Répartition par comptes" list={accountsData} />
</div>
