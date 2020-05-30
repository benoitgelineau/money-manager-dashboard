<script>
  import { fields, transactionTypes, categories, accounts } from "./config.js";
  import { newTransaction, transactions } from "./stores.js";

  function submitTransaction() {
    // Should send request to update .csv & clean fields
    // Update state only after response from server

    // Assignment to enable transactions update (push doesn't update list)
    // Use spread operator to remove dynamic update from newTransaction variable
    $transactions = [{ ...$newTransaction }, ...$transactions];
  }

  function handleValueChange({ target: { name, value } }) {
    $newTransaction = {
      ...$newTransaction,
      [name]: value
    };
  }

  function handleTypeChange({ target: { value } }) {
    newTransaction.reset();
    // Set category to 'Virement' if type is 'Virement'
    if (value === transactionTypes[2]) {
      $newTransaction = {
        ...$newTransaction,
        category: transactionTypes[2]
      };
    }
  }
</script>

<style>
  form {
    overflow: hidden;
  }
</style>

<form on:submit|preventDefault={submitTransaction}>
  <select
    name={fields[1].id}
    bind:value={$newTransaction.type}
    on:change={handleTypeChange}>
    {#each transactionTypes as transactionType}
      <option
        value={transactionType}
        selected={transactionType === $newTransaction.type}>
        {transactionType}
      </option>
    {/each}
  </select>
  <input type="date" name={fields[0].id} bind:value={$newTransaction.date} />
  <input
    type="text"
    name={fields[2].id}
    placeholder={fields[2].label}
    bind:value={$newTransaction.description}
    on:change={handleValueChange} />
  <select
    name={fields[3].id}
    bind:value={$newTransaction.category}
    on:change={handleValueChange}
    disabled={$newTransaction.type === transactionTypes[2]}>
    <option
      selected={!$newTransaction.category || $newTransaction.category === transactionTypes[2]}
      disabled>
      {$newTransaction.category === transactionTypes[2] ? $newTransaction.category : fields[3].label}
    </option>
    {#each categories as category}
      <option value={category} selected={category === $newTransaction.category}>
        {category}
      </option>
    {/each}
  </select>
  <select
    name={fields[4].id}
    bind:value={$newTransaction.source}
    on:change={handleValueChange}>
    <option value="" disabled>Choisis un compte</option>
    {#each accounts as account}
      <option value={account} selected={account === $newTransaction.source}>
        {account}
      </option>
    {/each}
  </select>
  <input
    type="text"
    name={fields[5].id}
    placeholder={fields[5].label}
    bind:value={$newTransaction.beneficiary}
    on:change={handleValueChange} />
  <input
    type="text"
    name={fields[6].id}
    placeholder={fields[6].label}
    bind:value={$newTransaction.amount}
    on:change={handleValueChange} />
  <input type="submit" />
</form>
