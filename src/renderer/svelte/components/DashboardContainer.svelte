<script>
  export let title, list;
  let withRelativeValue = false;

  $: withRelativeValue = list.length > 0 && list[0].values.length > 1;
</script>

<style>
  .container {
    background: lightgoldenrodyellow;
    border-radius: 4px;
    padding: 25px;
  }

  .container:not(:last-child) {
    margin-right: 25px;
  }

  .container h4 {
    margin: 0;
  }

  .container ul {
    padding-left: 10px;
    margin: 5px 0;
  }

  .container ul li {
    position: relative;
    display: flex;
    align-items: center;
    justify-content: space-between;
  }

  .container li .label {
    max-width: 300px;
    margin-right: 20px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .container li .absolute-value {
    font-weight: bold;
  }

  .container[withRelativeValue="true"] li {
    display: grid;
    grid-template-columns: 1fr auto 10px 50px;
  }

  .container[withRelativeValue="true"] li .separator {
    text-align: center;
  }
</style>

<div class="container" {withRelativeValue}>
  <h4>{title}</h4>
  <ul>
    {#each list as { label, values }}
      <li>
        <div class="label">{label}</div>
        <div class="absolute-value">{values[0]}</div>
        {#if withRelativeValue}
          <div class="separator">|</div>
          <div class="relative-value">{values[1]}</div>
        {/if}
      </li>
    {/each}
  </ul>
</div>
