<script>
  import { onMount } from 'svelte';
  import ApexCharts from 'apexcharts';
  import { ACCOUNT_TYPE } from 'common/staticKeys';
  import { filteredTransactions, accounts } from '../store';
  import { getTotalAmountBy, formatCurrencyAmount } from '../helper';

  const types = [
    {
      id: 'income',
      accountType: ACCOUNT_TYPE.CURRENT,
      label: 'Revenus',
      getTotalAmount: getTotalCurrentAmountById,
    },
    {
      id: 'expense',
      accountType: ACCOUNT_TYPE.CURRENT,
      label: 'Dépenses',
      getTotalAmount: getTotalCurrentAmountById,
    },
    {
      id: 'savings',
      accountType: ACCOUNT_TYPE.SAVINGS,
      label: 'Épargne',
      getTotalAmount: getTotalSavingsAmountByType,
    },
    {
      id: 'investment',
      accountType: ACCOUNT_TYPE.INVESTMENT,
      label: 'Investissement',
      getTotalAmount: getTotalSavingsAmountByType,
    },
  ];
  let chart, chartContainer;

  function getTotalCurrentAmountById({ id, transactions, accounts }) {
    if (!['income', 'expense'].includes(id)) {
      console.warn(
        "Wrong account type to get total amount, expected 'income' or 'expense'",
      );
      return;
    }
    const transactionSide =
      id === 'expense' ? 'source' : 'beneficiary';
    const currentAccounts = getAccountsNameByType(
      ACCOUNT_TYPE.CURRENT,
      accounts,
    );
    return transactions.reduce((amount, transaction) => {
      return transaction.type === id &&
        currentAccounts.includes(transaction[transactionSide])
        ? amount + parseFloat(transaction.amount)
        : amount;
    }, 0);
  }

  function getTotalSavingsAmountByType({
    accountType,
    transactions,
    accounts,
  }) {
    const savingsAccounts = getAccountsNameByType(
      accountType,
      accounts,
    );
    return transactions.reduce((amount, transaction) => {
      const shouldIncreaseAmount =
        transaction.type === 'transfer' &&
        savingsAccounts.includes(transaction.beneficiary);
      const shouldDecreaseAmount =
        transaction.type === 'transfer' &&
        savingsAccounts.includes(transaction.source);
      if (shouldIncreaseAmount) {
        return amount + parseFloat(transaction.amount);
      } else if (shouldDecreaseAmount) {
        return amount - parseFloat(transaction.amount);
      }
      return amount;
    }, 0);
  }

  function getSeriesData(transactions, accounts) {
    return types.map(({ id, accountType, label, getTotalAmount }) => {
      const totalAmount = getTotalAmount({
        id,
        accountType,
        transactions,
        accounts,
      });
      return {
        name: label,
        data: [totalAmount],
      };
    });
  }

  function getAccountsNameByType(accountType, accounts) {
    return accounts
      .filter(({ type }) => type === accountType)
      .map(({ name }) => name);
  }

  onMount(() => {
    chart = new ApexCharts(chartContainer, {
      chart: {
        type: 'bar',
        height: 350,
        foreColor: 'white',
        toolbar: {
          show: false,
        },
      },
      series: seriesData,
      xaxis: {
        categories: ['Montant'],
        position: 'top',
        axisBorder: {
          show: false,
        },
        axisTicks: {
          show: false,
        },
      },
      yaxis: {
        axisBorder: {
          show: false,
        },
        axisTicks: {
          show: false,
        },
        labels: {
          show: false,
          formatter: function(val) {
            return formatCurrencyAmount(val, 0);
          },
        },
      },
      plotOptions: {
        bar: {
          dataLabels: {
            position: 'top', // top, center, bottom
          },
        },
      },
      dataLabels: {
        enabled: true,
        formatter: function(val) {
          return formatCurrencyAmount(val, 0);
        },
        style: {
          fontSize: '11px',
          // colors: ["#304758"]
        },
      },
    });
    chart.render();
  });

  $: seriesData = getSeriesData($filteredTransactions, $accounts);
  $: {
    if (chart) {
      chart.updateSeries(seriesData);
    }
  }
</script>

<style>
  .dashboard-container {
    grid-area: 1 / 1 / span 2 / 1;
  }
</style>

<div class="dashboard-container">
  <h3 class="header">Mouvements</h3>
  <div bind:this={chartContainer} />
</div>
