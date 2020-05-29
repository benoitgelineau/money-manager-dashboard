<script>
	import { onMount } from 'svelte';
	import { transactions } from './stores.js';
	import HomePage from './pages/Home.svelte';
	import DetailsPage from './pages/Details.svelte';
	import TransactionForm from './TransactionForm.svelte';
	import TransactionList from './TransactionList.svelte';

	const pages = [{
		id: 'home',
		label: 'Dashboard',
	},
	{
		id: 'details',
		label: 'Details',
	},
	{
		id: 'addTransaction',
		label: 'Ajouter une transaction',
	}];
	let currentPage = 'home';

	function showPage(id) {
		currentPage = id;
	}

	onMount(async () => {
		const res = await fetch('http://localhost:5000/api/transactions');
		const data = await res.json();
		console.log('App onMount', data);
		$transactions = data.data;
	})
</script>

<h1>Money Manager test</h1>

<div id="main">
	<nav>
		<ul>
			{#each pages as { id, label }}
				<li>
					<button on:click={() => showPage(id)}>{label}</button>
				</li>
			{/each}
		</ul>
	</nav>

	<div id="page-content">
		{#if currentPage === 'home'}
			<HomePage/>
		{:else if currentPage === 'details'}
			<DetailsPage/>
		{:else if currentPage === 'addTransaction'}
			<TransactionForm/>
			<TransactionList/>
		{/if}
	</div>
</div>

<div id="app-version"/>

<style>
	h1 {
		text-align: center;
	}

	#main {
		position: relative;
		width: 100%;
		max-width: 80vw;
		display: flex;
		align-items: flex-start;
		justify-content: flex-start;
		margin: 0 auto;
	}

	nav {
		flex: 0 0 200px;
	}

	nav ul {
		list-style-type: none;
		padding: 0;
	}
	nav button {
		cursor: pointer;
	}

	#app-version {
		position: absolute;
		top: 5px;
		right: 5px;
	}
</style>