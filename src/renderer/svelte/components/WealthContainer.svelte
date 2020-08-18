<script>
  import { onMount } from 'svelte';
  import ApexCharts from 'apexcharts';
  import {
    monthlyTotalAccountAmounts,
    monthlyWealthAmount,
  } from '../store';
  import { formatCurrencyAmount } from '../helper';

  let chart, chartContainer;

  onMount(() => {
    chart = new ApexCharts(chartContainer, {
      // Init series
      series: [],
      chart: {
        type: 'area',
        height: 200,
        zoom: {
          enabled: false,
        },
        foreColor: 'white',
        toolbar: {
          show: false,
        },
      },
      stroke: {
        colors: ['#4ecdc4'],
        width: 3,
      },
      fill: {
        colors: ['#4ecdc4'],
      },
      dataLabels: {
        enabled: false,
      },
      xaxis: {
        labels: {
          show: false,
        },
        axisBorder: {
          show: false,
        },
        axisTicks: {
          show: false,
        },
      },
      yaxis: {
        labels: {
          show: false,
        },
        axisBorder: {
          show: false,
        },
        axisTicks: {
          show: false,
        },
      },
      grid: {
        show: false,
      },
      tooltip: {
        enabled: false,
      },
    });
    chart.render();
  });

  function formatWealthProgress(progress) {
    return `${(progress * 100).toFixed(2)}%`;
  }

  $: wealthAmount =
    $monthlyWealthAmount.length > 0
      ? $monthlyWealthAmount[$monthlyWealthAmount.length - 1]
      : 0;
  // $: lastMonthlyWealthProgress =
  //   $monthlyWealthAmount.length > 1
  //     ? $monthlyWealthAmount[$monthlyWealthAmount.length - 1] /
  //         $monthlyWealthAmount[$monthlyWealthAmount.length - 2] -
  //       1
  //     : '';
  $: yearlyWealthProgress =
    $monthlyWealthAmount.length > 1
      ? $monthlyWealthAmount[$monthlyWealthAmount.length - 1] /
          $monthlyWealthAmount[0] -
        1
      : '';
  $: {
    if (chart && wealthAmount && yearlyWealthProgress) {
      chart.updateOptions({
        annotations: {
          texts: [
            {
              text: formatCurrencyAmount(wealthAmount, 0),
              textAnchor: 'end',
              x: '54%',
              y: '20%',
              foreColor: 'white',
              fontSize: '36px',
              fontWeight: 500,
            },
            {
              text: formatWealthProgress(yearlyWealthProgress),
              textAnchor: 'start',
              x: '56%',
              y: '14%',
              foreColor:
                yearlyWealthProgress > 0 ? '#00E396' : '#FF4560',
              fontSize: '12px',
            },
          ],
        },
      });
    }
  }
  $: {
    if (chart && $monthlyWealthAmount.length > 0) {
      chart.updateSeries([
        {
          data: $monthlyWealthAmount,
        },
      ]);
    }
  }
</script>

<style>

</style>

<div class="dashboard-container">
  <h3 class="header">Patrimoine</h3>
  <div bind:this={chartContainer} />
</div>
