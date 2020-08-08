<script>
  import { fields } from '../config';
  import { formattedTransactions } from '../store';

  const fieldsLabels = fields.map(field =>
    field.id === 'type'
      ? {
          ...field,
          id: 'typeLabel',
        }
      : field,
  );
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
    text-align: left;
    font-weight: bold;
    border-bottom: 1px solid white;
  }

  td {
    font-size: 0.8rem;
    padding-top: 6px;
    padding-bottom: 6px;
  }

  th[data-id='amount'],
  td[data-id='amount'] {
    text-align: right;
  }

  tr:nth-child(even) td {
    background: rgba(255, 255, 255, 0.1);
  }
</style>

<table class="transaction-list">
  <thead>
    <tr>
      {#each fieldsLabels as { id, label }}
        <th data-id={id}>{label}</th>
      {/each}
    </tr>
  </thead>
  <tbody>
    {#each $formattedTransactions as transaction}
      <tr>
        {#each fieldsLabels as { id }}
          <td data-id={id}>{transaction[id]}</td>
        {/each}
      </tr>
    {/each}
  </tbody>
</table>
