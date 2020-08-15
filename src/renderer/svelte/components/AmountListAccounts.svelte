<script>
  import {
    monthlyTotalAccountAmounts,
    selectedAccounts,
  } from '../store';
  import { formatCurrencyAmount } from '../helper';

  $: amounts =
    $monthlyTotalAccountAmounts.length > 0 &&
    $monthlyTotalAccountAmounts[
      $monthlyTotalAccountAmounts.length - 1
    ].data.length > 0
      ? $monthlyTotalAccountAmounts[
          $monthlyTotalAccountAmounts.length - 1
        ].data
      : [];

  $: displayedAccounts = amounts.filter(({ label }) =>
    $selectedAccounts.map(({ name }) => name).includes(label),
  );
</script>

<style>
  ul {
    padding: 0 15px;
    margin: 0;
    overflow-y: auto;
  }

  li {
    list-style: none;
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 5px;
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
  {#each displayedAccounts as { label, amount }}
    <li>
      <div class="label">{label}</div>
      <div class="absolute-value">
        {formatCurrencyAmount(amount, 2)}
      </div>
    </li>
  {/each}
</ul>
