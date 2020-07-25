<script>
  import { totalAccountAmounts, selectedAccounts } from "../store";
  import { formatCurrencyAmount } from "../helper";

  $: displayedAccounts = $totalAccountAmounts.filter(({ label }) =>
    $selectedAccounts.map(({ name }) => name).includes(label)
  );
</script>

<style>
  ul {
    min-height: 0;
    padding: 0;
    margin: 0;
    overflow-y: auto;
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
  {#each displayedAccounts as { label, amount }}
    <li>
      <div class="label">{label}</div>
      <div class="absolute-value">{formatCurrencyAmount(amount, 2)}</div>
    </li>
  {/each}
</ul>
