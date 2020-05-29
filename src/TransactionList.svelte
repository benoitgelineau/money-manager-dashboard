<script>
  import { fields } from './config.js';
  import { transactions } from './stores.js';
</script>

<table class="transaction-list">
  <thead>
    <tr>
      {#each fields as { label }}
        <th>{label}</th>
      {/each}
    </tr>
  </thead>
  <tbody>
    {#each $transactions as transaction}
      <tr>
        {#each Object.values(transaction) as value}
          <td>{value}</td>
        {/each}
      </tr>
    {/each}
  </tbody>
</table>

<style>
  table {
    min-width: 100%;
    border-collapse: collapse;
    display: grid;
    /* grid-template-columns:
      minmax(150px, 1fr)
      minmax(150px, 1fr)
      minmax(150px, 2.33fr)
      minmax(150px, 2.33fr)
      minmax(150px, 2.33fr)
      minmax(150px, 2.33fr)
      minmax(150px, 1.67fr); */
    grid-template-columns:
      repeat(2, minmax(150px, 1fr))
      repeat(4, minmax(150px, 2.33fr))
      minmax(150px, 1.67fr);
  }

  thead,
  tbody,
  tr {
    display: contents; /* Enable cells to be grid items */
  }

  th,
  td {
    padding: 15px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  th {
    position: sticky;
    top: 0;
    background: #6c7ae0;
    text-align: left;
    font-weight: normal;
    font-size: 1.1rem;
    color: white;
  }

  td {
    padding: 10px inherit;
    color: #808080;
  }

  tr:nth-child(even) td {
    background: #f8f6ff;
  }
</style>