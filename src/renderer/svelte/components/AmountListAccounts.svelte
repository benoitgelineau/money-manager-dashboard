<script>
  import { transactions, accounts } from "../stores";
  import { formatCurrencyAmount } from "../helper";

  const getInitialAmount = account => {
    const initialAmount = {
      "La Banque Postale - CCP": 876.55,
      "La Banque Postale - Livret A": 8.67,
      "La Banque Postale - LDDS": 4209.98,
      "Crédit Coopératif - CCP": 300,
      "Crédit Coopératif - LDDS": 10,
      "Assurance-vie - LINXEA Avenir": 3000,
      "BforBank - PEA": 1305.19
    };
    return Object.keys(initialAmount).includes(account)
      ? initialAmount[account]
      : 0;
  };
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
        values: [
          formatCurrencyAmount(totalAmount + getInitialAmount(account), 2)
        ]
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
