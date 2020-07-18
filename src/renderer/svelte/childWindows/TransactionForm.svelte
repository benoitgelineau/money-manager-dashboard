<script>
  import { onMount } from "svelte";
  import { format } from "date-fns";
  import { fields, transactionTypes } from "../config";
  import { transactions, categories, accounts, MAIN_ACCOUNT } from "../store";
  import { addTransaction, closeChildWindow } from "../store/actions";
  import { convertAmountToFloat, formatInputAmount } from "../helper";

  let newTransaction = {};

  function initNewTransaction(type = "") {
    // Exclude typeLabel from fields to be inserted in .csv
    const txFields = fields.filter(({ id }) => id !== "typeLabel");
    const defaultValues = {
      type: type || "expense",
      date: newTransaction.date || format(Date.now(), "yyyy-MM-dd"),
      beneficiary: type === "income" ? MAIN_ACCOUNT : "",
      source: type !== "income" ? MAIN_ACCOUNT : ""
      // category: categories[0],
    };
    newTransaction = txFields.reduce((insertedFields, field) => {
      return {
        ...insertedFields,
        [field.id]: defaultValues[field.id] || ""
      };
    }, {});
    console.log("initNewTransaction -> data", newTransaction);
  }

  // function resetTransaction() {
  //   const notToResetFields = ["type", "date"];
  //   newTransaction = Object.keys(newTransaction).reduce(
  //     (a, b) => ({
  //       ...a,
  //       [b]: notToResetFields.includes(b) ? newTransaction[b] : ""
  //     }),
  //     {}
  //   );
  // }

  function submitTransaction() {
    // Should send request to update .csv & clean fields
    // Update state only after response from server

    const mockTransferTx = {
      date: "2020-06-01",
      type: "transfer",
      description: "",
      category: "",
      source: "VSCode",
      beneficiary: "Me",
      amount: 100
    };
    console.log("addTransaction convert to float", {
      ...newTransaction,
      amount: convertAmountToFloat(newTransaction.amount)
    });
    // addTransaction(mockTransferTx);
    addTransaction({
      ...newTransaction,
      amount: convertAmountToFloat(newTransaction.amount)
    });
  }

  function handleValueChange({ target: { name, value } }) {
    newTransaction = {
      ...newTransaction,
      [name]: value
    };
  }

  function handleTypeChange({ target: { value } }) {
    // console.log("handleTypeChange", name, value);
    initNewTransaction(value);
  }

  onMount(() => {
    initNewTransaction();
  });

  $: getCategories =
    newTransaction.type === "transfer"
      ? []
      : $categories.find(({ id }) => id === (newTransaction.type || "expense"))
          .values;
  $: {
    if (newTransaction.amount) {
      newTransaction.amount = formatInputAmount(newTransaction.amount);
    }
  }
</script>

<style>
  form {
    height: 100%;
    width: 80%;
    margin: 0 auto;
    display: flex;
    flex-direction: column;
    justify-content: space-evenly;
    overflow: hidden;
  }

  .form-line {
    display: flex;
  }

  .form-line > * {
    width: 50%;
  }

  label {
    display: flex;
    flex-direction: column;
  }
</style>

<form on:submit|preventDefault={submitTransaction}>
  <div class="form-line">
    <label>
      Type
      <select
        name={fields[1].id}
        bind:value={newTransaction.type}
        on:change={handleTypeChange}>
        {#each transactionTypes as { id, label }}
          <option value={id} selected={id === newTransaction.type}>
            {label}
          </option>
        {/each}
      </select>
    </label>
    <label>
      Date
      <input type="date" name={fields[0].id} bind:value={newTransaction.date} />
    </label>
  </div>
  <div class="form-line">
    <label>
      Description
      <input
        type="text"
        name={fields[2].id}
        placeholder={fields[2].label}
        bind:value={newTransaction.description}
        on:change={handleValueChange} />
    </label>
    {#if newTransaction.type !== 'transfer'}
      <label>
        Catégorie
        <select
          name={fields[3].id}
          bind:value={newTransaction.category}
          on:change={handleValueChange}
          disabled={newTransaction.type === transactionTypes[2]}>
          <option
            selected={!newTransaction.category || newTransaction.category === transactionTypes[2]}
            disabled>
            {newTransaction.category === transactionTypes[2] ? newTransaction.category : fields[3].label}
          </option>
          {#each getCategories as category}
            <option
              value={category}
              selected={category === newTransaction.category}>
              {category}
            </option>
          {/each}
        </select>
      </label>
    {/if}
  </div>
  <div class="form-line">
    <label>
      Source
      {#if newTransaction.type === 'income'}
        <input
          type="text"
          name={fields[4].id}
          placeholder={fields[4].label}
          bind:value={newTransaction.source}
          on:change={handleValueChange} />
      {:else}
        <select
          name={fields[4].id}
          bind:value={newTransaction.source}
          on:change={handleValueChange}>
          <option value="" disabled>Choisis un compte</option>
          {#each $accounts as account}
            <option
              value={account}
              selected={account === newTransaction.source}
              disabled={account === newTransaction.beneficiary}>
              {account}
            </option>
          {/each}
        </select>
      {/if}
    </label>
    <label>
      Bénéficiaire
      {#if newTransaction.type === 'expense'}
        <input
          type="text"
          name={fields[5].id}
          placeholder={fields[5].label}
          bind:value={newTransaction.beneficiary}
          on:change={handleValueChange} />
      {:else}
        <select
          name={fields[5].id}
          bind:value={newTransaction.beneficiary}
          on:change={handleValueChange}>
          <option value="" disabled>Choisis un compte</option>
          {#each $accounts as account}
            <option
              value={account}
              selected={account === newTransaction.beneficiary}
              disabled={account === newTransaction.source}>
              {account}
            </option>
          {/each}
        </select>
      {/if}
    </label>
  </div>
  <label>
    Montant
    <input
      type="text"
      name={fields[6].id}
      placeholder={fields[6].label}
      bind:value={newTransaction.amount}
      on:change={handleValueChange} />
  </label>
  <button type="submit" disabled={!newTransaction.amount}>Ajouter</button>
</form>
