<script>
  import { fields } from "../config";
  import { formattedTransactions } from "../store";
</script>

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
      repeat(2, minmax(90px, 1fr))
      repeat(4, minmax(130px, 2.33fr))
      minmax(90px, 1.67fr);
    overflow: auto;
  }

  thead,
  tbody,
  tr {
    display: contents; /* Enable cells to be grid items */
  }

  th,
  td {
    padding: 10px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  th {
    /* Works only if scroll is in table */
    /* position: sticky;
    top: 0; */
    background: #6c7ae0;
    text-align: left;
    font-weight: normal;
    font-size: 0.9rem;
    color: white;
  }

  td {
    font-size: 0.8rem;
    padding-top: 6px;
    padding-bottom: 6px;
    color: #808080;
  }

  td[data-id="amount"] {
    text-align: right;
  }

  tr:nth-child(even) td {
    background: #f8f6ff;
  }
</style>

<table class="transaction-list">
  <thead>
    <tr>
      {#each fields as { label }}
        <th>{label}</th>
      {/each}
    </tr>
  </thead>
  <tbody>
    {#each $formattedTransactions as transaction}
      <tr>
        {#each fields as { id }}
          <td data-id={id}>{transaction[id]}</td>
        {/each}
      </tr>
    {/each}
  </tbody>
</table>
