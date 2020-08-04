<script>
  import { ACCOUNT_TYPE } from 'common/staticKeys';
  import DashboardContainer from "./DashboardContainer.svelte";
  import { filteredTransactions, accounts } from "../store";
  import { getTotalAmountBy, formatCurrencyAmount } from "../helper";

  const types = [
    {
      id: "income",
      accountType: ACCOUNT_TYPE.CURRENT,
      label: "Revenus",
      getTotalAmount: getTotalCurrentAmountById,
    },
    {
      id: "expense",
      accountType: ACCOUNT_TYPE.CURRENT,
      label: "Dépenses",
      getTotalAmount: getTotalCurrentAmountById,
    },
    {
      id: "savings",
      accountType: ACCOUNT_TYPE.SAVINGS,
      label: "Épargne",
      getTotalAmount: getTotalSavingsAmountByType,
    },
    {
      id: "investment",
      accountType: ACCOUNT_TYPE.INVESTMENT,
      label: "Investissement",
      getTotalAmount: getTotalSavingsAmountByType,
    }
  ];

  function getTotalCurrentAmountById({ id, transactions, accounts }) {
    if (!['income', 'expense'].includes(id)) {
      console.warn('Wrong account type to get total amount, expected \'income\' or \'expense\'');
      return;
    }
    const transactionSide = id === 'expense' ? 'source' : 'beneficiary';
    const currentAccounts = getAccountsNameByType(ACCOUNT_TYPE.CURRENT, accounts);
    return transactions.reduce((amount, transaction) => {
      return transaction.type === id && currentAccounts.includes(transaction[transactionSide])
        ? amount + parseFloat(transaction.amount)
        : amount;
    }, 0);
  }

  function getTotalSavingsAmountByType({ accountType,transactions, accounts }) {
    const savingsAccounts = getAccountsNameByType(accountType, accounts);
    return transactions.reduce((amount, transaction) => {
      const shouldIncreaseAmount = transaction.type === 'transfer' &&
        savingsAccounts.includes(transaction.beneficiary);
      const shouldDecreaseAmount = transaction.type === 'transfer' &&
        savingsAccounts.includes(transaction.source);
      if (shouldIncreaseAmount) {
        return amount + parseFloat(transaction.amount);
      } else if (shouldDecreaseAmount) {
        return amount - parseFloat(transaction.amount);
      }
      return amount;
    }, 0);
  }

  function getTypesData(transactions, accounts) {
    return types.map(({ id, accountType, label, getTotalAmount }) => {
      const totalAmount = getTotalAmount({ id, accountType, transactions, accounts });
      return {
        id,
        label,
        values: [formatCurrencyAmount(totalAmount, 0)]
      };
    });
  }

  function getAccountsNameByType(accountType, accounts) {
    return accounts.filter(({ type }) => type === accountType).map(({ name }) => name);
  }

  $: typesData = getTypesData($filteredTransactions, $accounts);
</script>

<style>
  .dashboard-container {
    grid-area: 1 / 1 / 1 / 1;
  }
</style>

<div class="dashboard-container">
  <DashboardContainer title="Répartition par type" list={typesData} />
</div>
