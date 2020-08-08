<script>
  import { onMount } from 'svelte';
  import ApexCharts from 'apexcharts';
  import { filteredTransactions, categories } from '../store';
  import { getTotalAmountBy, formatCurrencyAmount } from '../helper';

  let chart, chartContainer;

  onMount(() => {
    chart = new ApexCharts(chartContainer, {
      series: [],
      chart: {
        width: 380,
        type: 'pie',
        foreColor: 'white',
      },
      labels: [],
      responsive: [
        {
          breakpoint: 480,
          options: {
            chart: {
              width: 200,
            },
            legend: {
              position: 'bottom',
            },
          },
        },
      ],
    });
    chart.render();
  });

  $: categoriesData = () => {
    const result = $categories.find(({ id }) => id === 'expense');
    if (!result) {
      return [];
    }
    return (
      result.values
        // Get amounts
        .map(category => {
          const absoluteAmount = getTotalAmountBy(
            'category',
            category,
            $filteredTransactions,
          );
          const totalExpenses = getTotalAmountBy(
            'type',
            'expense',
            $filteredTransactions,
          );
          const getRelativeAmount = () =>
            (parseFloat(absoluteAmount) / totalExpenses) * 100;
          return {
            label: category,
            values: [absoluteAmount, getRelativeAmount()],
          };
        })
        // Remove null or negative values
        .filter(({ values }) => parseFloat(values[0]) > 0)
        // Sort from higher to lower value
        .sort(
          (a, b) => parseFloat(b.values[0]) - parseFloat(a.values[0]),
        )
        // Format values
        .map(({ label, values }) => {
          const [absoluteValue, relativeValue] = values;
          return {
            label,
            value: absoluteValue,
          };
        })
    );
  };
  $: {
    if (chart) {
      const data = categoriesData();
      const series = data.map(({ value }) => value);
      const labels = data.map(({ label }) => label);
      chart.updateOptions({
        series,
        labels,
      });
    }
  }
</script>

<style>
  .dashboard-container {
    grid-area: 1 / 2 / span 2 / 2;
  }
</style>

<div class="dashboard-container">
  <h3 class="header">Dépenses par catégorie</h3>
  <div bind:this={chartContainer} />
</div>
