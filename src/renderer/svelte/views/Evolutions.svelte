<script>
  import { accounts } from "../store";

  let selectedAccount = "";

  function submitDatesInterval(event) {
    console.log("submitDatesInterval");
  }
</script>

<label for="select-account">Compte</label>
<select name="account-select" id="select-account" bind:value={selectedAccount}>
  <option value="" disabled>Choisis un compte</option>
  {#each accounts as account}
    <option value={account}>{account}</option>
  {/each}
</select>

{#if selectedAccount}
  <form on:submit|preventDefault={submitDatesInterval}>
    <div>
      Début :
      <input type="date" name="start-date" />
    </div>
    <div>
      Fin :
      <input type="date" name="end-date" />
    </div>
    <input type="submit" />
  </form>

  <h3>TOTAL {selectedAccount}</h3>
  <h6>Début de période :</h6>
  <h6>Fin de période :</h6>
{/if}
