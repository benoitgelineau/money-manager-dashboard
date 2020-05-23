<script>
  import { accounts } from '../config.js';
</script>

<h2>Dashboard</h2>

<h3>Patrimoine : <strong>XXXX.XX€</strong></h3>
<ul>
  {#each accounts as account}
    <!-- TODO Display current investment accounts values (with value date) -->
		<li>{account} : <strong>XXXX.XX€</strong></li>
	{/each}
</ul>

<h3>Dernier mois</h3>
<ul>
  <li>Revenus : <strong>1950.00€</strong></li>
  <li>Dépenses : <strong>1200.00€</strong></li>
  <li>Epargne : <strong>200.00€</strong></li>
  <li>Investissement : <strong>300.00€</strong></li>
</ul>
