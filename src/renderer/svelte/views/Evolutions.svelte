<script>
  const analytics = [
    {
      id: '',
      label:
        'Graphique des courbes des dépenses, revenus, épargne et investissement sur 1 an, avec tableau en dessous pour valeurs exactes',
    },
    {
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
</script>

<style>
  ul {
    list-style-type: none;
    padding: 0;
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    grid-gap: 20px;
  }

  li {
    background: lightcoral;
    border-radius: 5px;
    padding: 10px;
  }
</style>

<ul>
  {#each analytics as { label }}
    <li>{label}</li>
  {/each}
</ul>
