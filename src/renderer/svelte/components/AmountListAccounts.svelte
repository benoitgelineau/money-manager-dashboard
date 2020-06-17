<script>
  import { accountsData } from "../stores";
  import { formatCurrencyAmount } from "../helper";
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
  {#each $accountsData as { label, amount }}
    <li>
      <div class="label">{label}</div>
      <div class="absolute-value">{formatCurrencyAmount(amount, 2)}</div>
    </li>
  {/each}
</ul>
