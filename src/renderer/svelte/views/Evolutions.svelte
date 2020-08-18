<script>
  import Select from '../components/common/Select.svelte';
  import YearlyFlowsChart from '../components/charts/YearlyFlowsChart.svelte';
  const chartsList = [
    {
      // Line chart
      id: '',
      label: 'Évolution des mouvements sur 1 an',
      component: YearlyFlowsChart,
    },
    {
      // Stacked bar chart
      id: '',
      label:
        'Graphique des dépenses par catégorie, avec tableau en dessous pour valeurs exactes (absolues et relatives)',
    },
    {
      id: '',
      label:
        'Graphique de la moyenne glissante des dépenses sur 1 an glissant',
    },
    {
      id: '',
      label:
        "Graphique de mon taux d'inflation sur 1 an glissant ((total dépenses année n/total dépenses année n-1) - 1",
    },
    {
      id: '',
      label:
        "Graphique de mon taux d'épargne sur 1 an glissant (revenus/dépenses -1)",
    },
    {
      id: '',
      label:
        "Graphique de l'évolution de mes investissements (total montants versés + valeur actuelle des investissements)",
    },
    {
      id: '',
      label:
        "Graphique de l'évolution de mon patrimoine (total tous les comptes + cours actuels des investissements)",
    },
  ];
  let currentSelection = chartsList[0];

  function handleOptionClick(option) {
    console.log('handleOptionClick option', option);
    currentSelection = option;
  }
</script>

<style>

</style>

<Select options={chartsList} {handleOptionClick} />
<svelte:component this={currentSelection.component} />
