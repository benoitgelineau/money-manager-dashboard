<script>
  import { onMount } from 'svelte';
  import ApexCharts from 'apexcharts';
  import { format, isSameMonth, isSameYear } from 'date-fns';
  import frLocale from 'date-fns/locale/fr';
  import { ACCOUNT_TYPE } from 'common/staticKeys';
  import {
    transactions,
    accounts,
    getMaxMonthlyRange,
  } from '../../store';
  import {
    getTotalAmountBy,
    formatCurrencyAmount,
  } from '../../helper';

  // TODO Refacto with AmountListTypes
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
    return $getMaxMonthlyRange.map(date => {
      return transactions.reduce((amount, transaction) => {
        return isSameYear(date, new Date(transaction.date)) &&
          isSameMonth(date, new Date(transaction.date)) &&
          transaction.type === id &&
          currentAccounts.includes(transaction[transactionSide])
          ? amount + parseFloat(transaction.amount)
          : amount;
      }, 0);
    });
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
    return $getMaxMonthlyRange.map(date => {
      return transactions.reduce((amount, transaction) => {
        const isWithinPeriodRange =
          isSameYear(date, new Date(transaction.date)) &&
          isSameMonth(date, new Date(transaction.date));
        const shouldIncreaseAmount =
          isWithinPeriodRange &&
          transaction.type === 'transfer' &&
          savingsAccounts.includes(transaction.beneficiary);
        const shouldDecreaseAmount =
          isWithinPeriodRange &&
          transaction.type === 'transfer' &&
          savingsAccounts.includes(transaction.source);
        if (shouldIncreaseAmount) {
          return amount + parseFloat(transaction.amount);
        } else if (shouldDecreaseAmount) {
          return amount - parseFloat(transaction.amount);
        }
        return amount;
      }, 0);
    });
  }

  function getSeriesData(transactions, accounts) {
    return types.map(({ id, accountType, label, getTotalAmount }) => {
      const monthlyAmounts = getTotalAmount({
        id,
        accountType,
        transactions,
        accounts,
      });
      return {
        name: label,
        data: monthlyAmounts,
      };
    });
  }

  function getAccountsNameByType(accountType, accounts) {
    return accounts
      .filter(({ type }) => type === accountType)
      .map(({ name }) => name);
  }

  const colors = ['#00E396', '#FF4560', '#f9ce1d', '#775DD0']; // Green, red, purple, gold
  onMount(() => {
    chart = new ApexCharts(chartContainer, {
      // Init series
      series: [],
      chart: {
        type: 'line',
        height: 350,
        zoom: {
          enabled: false,
        },
        foreColor: 'white',
        toolbar: {
          show: false,
        },
      },
      colors,
      stroke: {
        width: 3,
      },
      dataLabels: {
        enabled: false,
        formatter: function(val) {
          return formatCurrencyAmount(val, 0);
        },
      },
      xaxis: {
        categories: $getMaxMonthlyRange.map(date =>
          format(date, 'MMM', { locale: frLocale }),
        ),
      },
      yaxis: {
        labels: {
          show: true,
          formatter: function(val) {
            return formatCurrencyAmount(val, 0);
          },
        },
      },
      tooltip: {
        theme: 'dark',
      },
    });
    chart.render();
  });

  $: seriesData = getSeriesData($transactions, $accounts);
  $: {
    if (chart) {
      console.log('seriesData', seriesData);
      chart.updateSeries(seriesData);
    }
  }
</script>

<style>

</style>

<div class="dashboard-container">
  <h3 class="header">Evolution des mouvements sur 1 an glissant</h3>
  <div bind:this={chartContainer} />
</div>
