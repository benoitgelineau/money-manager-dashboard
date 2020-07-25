<script>
  import { accounts, setAccountSelected, setAccountType } from "../store";

  const options = [
    {
      id: "current",
      label: "Courant"
    },
    {
      id: "savings",
      label: "Epargne"
    },
    {
      id: "investment",
      label: "Investissement"
    }
  ];

  function handleCheckClick(event) {
    const { name, checked: selected } = event.target;
    setAccountSelected({ name, selected });
  }

  function handleTypeChange(event) {
    const { name, value: type } = event.target;
    setAccountType({ name, type });
  }

  $: sortedAccounts = [...$accounts]
    // Sort alphabetically
    .sort((a, b) => (a.name.toUpperCase() < b.name.toUpperCase() ? -1 : 1))
    // Sort selected account before non-selected ones
    .sort((a, b) => {
      if (!a.selected) {
        return 1;
      }
      if (!b.selected) {
        return -1;
      }
      return 0;
    });
</script>

<style>
  ul {
    width: 85%;
    max-width: 550px;
    padding: 0;
    margin: 0 auto;
  }

  li {
    list-style: none;
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 5px;
  }

  li *:first-child {
    display: flex;
  }

  li *:first-child input {
    margin-right: 10px;
  }

  li > * {
    min-width: 150px; /* Enable ellipsis on label */
  }

  .label {
    margin-right: 15px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  select {
    flex: 0 1 auto; /* Enable ellipsis on label */
  }
</style>

<h2>Gestion des comptes</h2>
<p>
  <!-- Les revenus, dépenses, épargne et investissements sont agrégés à partir des
  comptes courants sélectionnés ci-dessous : -->
  Choisissez les comptes à afficher avec leur type respectif :
</p>
<ul>
  {#each sortedAccounts as { name, type, selected } (name)}
    <li>
      <div>
        <input
          type="checkbox"
          id={name}
          {name}
          on:click={handleCheckClick}
          checked={selected} />
        <label for={name} class="label">{name}</label>
      </div>
      <select {name} bind:value={type} on:change={handleTypeChange}>
        {#each options as { id, label }}
          <option value={id} selected={id === type}>{label}</option>
        {/each}
      </select>
    </li>
  {/each}
</ul>
