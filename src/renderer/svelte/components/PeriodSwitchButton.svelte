<script>
  export let handlePeriodRangeChange;
</script>

<style>
  .switch {
    --switch-width: 190px;
    --switch-height: 35px;
    --switch-selection-offset: 2px;
    position: relative;
    display: flex;
    height: var(--switch-height);
    width: var(--switch-width);
    background: rgba(0, 0, 0, 0.2);
    border-radius: calc(var(--switch-height) / 2);
    box-shadow: inset 0 1px 3px rgba(0, 0, 0, 0.3),
      0 1px rgba(255, 255, 255, 0.1);
  }
  .switch-label {
    flex: 1 0 50%;
    position: relative;
    z-index: 2;
    line-height: var(--switch-height);
    font-size: 12px;
    color: var(--font-color-blur);
    text-align: center;
    text-shadow: 0 1px 1px rgba(0, 0, 0, 0.45);
    transition: 0.15s ease-out;
    transition-property: color, text-shadow, font-weight;
    cursor: pointer;
  }
  .switch-label:active {
    font-weight: bold;
  }

  .switch-input {
    display: none;
  }
  .switch-input:checked + .switch-label {
    font-weight: bold;
    color: white;
    text-shadow: 0 1px rgba(255, 255, 255, 0.25);
  }
  .switch-selection {
    position: absolute;
    z-index: 1;
    top: var(--switch-selection-offset);
    left: var(--switch-selection-offset);
    display: block;
    width: calc(50% - var(--switch-selection-offset));
    height: calc(100% - 2 * var(--switch-selection-offset));
    border-radius: calc(var(--switch-height) / 2);
    background-color: var(--color-action);
    box-shadow: inset 0 1px rgba(255, 255, 255, 0.5),
      0 0 2px rgba(0, 0, 0, 0.2);
    transition: transform 0.15s ease-out;
  }
  .switch-input:checked + .switch-label.on ~ .switch-selection {
    transform: translate(100%, 0);
  }
</style>

<div class="switch">
  <input
    type="radio"
    class="switch-input"
    name="view"
    value="month"
    id="month"
    checked
    on:change={handlePeriodRangeChange} />
  <label for="month" class="switch-label off">Mois</label>
  <input
    type="radio"
    class="switch-input"
    name="view"
    value="year"
    id="year"
    on:change={handlePeriodRangeChange} />
  <label for="year" class="switch-label on">Année</label>
  <span class="switch-selection" />
</div>

