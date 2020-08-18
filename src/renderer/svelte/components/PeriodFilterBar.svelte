<script>
  import {
    format,
    startOfMonth,
    endOfMonth,
    eachMonthOfInterval,
    startOfYear,
    endOfYear,
  } from 'date-fns';
  import frLocale from 'date-fns/locale/fr';
  import { removeDuplicates } from '../helper';
  import {
    startDate,
    endDate,
    transactions,
    getOldestDate,
    getLatestDate,
  } from '../store';
  import Select from './common/Select.svelte';
  import PeriodSwitchButton from './PeriodSwitchButton.svelte';

  let selectedPeriod = 'month';
  let options = [];

  function handlePeriodRangeChange(event) {
    const { value } = event.target;
    selectedPeriod = value;
    if (value === 'year') {
      udpatePeriod(new Date(availableYears[0], 0));
    } else if (value === 'month') {
      udpatePeriod(new Date(allAvailableMonths[0].value));
    }
  }

  function udpatePeriod({ value }) {
    if (selectedPeriod === 'month') {
      $startDate = startOfMonth(new Date(value));
      $endDate = endOfMonth(new Date(value));
    } else if (selectedPeriod === 'year') {
      $startDate = startOfYear(new Date(value));
      $endDate = endOfYear(new Date(value));
    }
  }

  function getAllAvailableMonths(oldestDate, latestDate) {
    if (!oldestDate || !latestDate) {
      return [];
    }
    return eachMonthOfInterval({
      start: oldestDate,
      end: latestDate,
    })
      .map(date => ({
        label: format(date, 'MMMM yyyy', { locale: frLocale }),
        value: date,
      }))
      .sort((a, b) => b.value - a.value);
  }

  $: allAvailableMonths = getAllAvailableMonths(
    $getOldestDate,
    $getLatestDate,
  );
  $: availableYears = removeDuplicates(
    allAvailableMonths.map(({ value }) => value.getFullYear()),
  );
  $: {
    // Update options list
    if (selectedPeriod === 'month') {
      options = allAvailableMonths;
    } else if (selectedPeriod === 'year') {
      options = availableYears.map(value => ({
        label: value,
        value,
      }));
    }
  }
</script>

<style>
  .period-filter {
    display: flex;
    align-items: center;
    justify-content: flex-end;
    padding: 10px 5px;
    list-style: none;
  }

  .period-filter li:not(:last-child) {
    margin-right: 15px;
  }
</style>

<ul class="period-filter">
  <li>
    <PeriodSwitchButton {handlePeriodRangeChange} />
  </li>
  <li>
    <Select {options} handleOptionClick={udpatePeriod} />
  </li>
</ul>
