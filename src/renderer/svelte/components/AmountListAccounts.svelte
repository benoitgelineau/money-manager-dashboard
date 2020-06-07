<script>
  import { transactions, accounts } from "../stores";
  import { formatCurrencyAmount } from "../helper";

  let accountsData = getAccountsData();

  function getAccountsData() {
    return $accounts.sort().map(account => {
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
  ul {
    padding: 0;
  }

  li {
    list-style: none;
    margin-bottom: 5px;
  }

  li > * {
    width: 100%;
  }

  .label {
    margin-right: 20px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .absolute-value {
    font-weight: bold;
    text-align: right;
  }
</style>

<ul>
  {#each accountsData as { label, values }}
    <li>
      <div class="label">{label}</div>
      <div class="absolute-value">{values[0]}</div>
    </li>
  {/each}
</ul>
