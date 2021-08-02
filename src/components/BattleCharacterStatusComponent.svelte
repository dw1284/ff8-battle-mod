<script>
  import _ from 'lodash';
  import NumericInput from '../components/NumericInput.svelte';
  
	export let character;
  export let onBattleCharacterStatusChange = _.noop;
  
  let propertyToEdit = null;
  let newValue = null;
  
  $: currentHealth = character.isDead ? 0 : character.currentHealth;
  $: maxHealth = character.isDead ? 0 : character.maxHealth;
  
  function onEditClick(propertyName) {
    if (!character.isDead) {
      propertyToEdit = propertyName;
      newValue = _.get(character, propertyName, 0);
    } else {
      alert('Cannot edit because the character is ko\'d');
    }
  };
  
  function onInputInit(inputEle) {
    inputEle.select();
  };
  
  function onInputKeydown(e) {
    if (e.key === 'Enter')
      onConfirmClick();
    else if (e.key === 'Escape')
      onCancelClick();
  };
  
  function onConfirmClick() {
    const maxValue = (propertyToEdit === 'currentHealth') ? character.maxHealth : newValue;
    const data = {[propertyToEdit]: Math.min(newValue, maxValue)};
    if (data.maxHealth < character.currentHealth)
      data.currentHealth = data.maxHealth;
    onBattleCharacterStatusChange(character.id, data);
    propertyToEdit = null;
    newValue = null;
  };
  
  function onCancelClick() {
    propertyToEdit = null;
    newValue = null;
  };
</script>

<character-status>
  <!-- Render the character's stats -->
  <name>{character.displayName || character.name}:</name>
  <statline>
    <stat name="current-health" on:click={() => {onEditClick('currentHealth')}}>{currentHealth}</stat>
    <stat-separator>/</stat-separator>
    <stat name="max-health" on:click={() => {onEditClick('maxHealth')}}>{maxHealth}</stat>
  </statline>
  <!-- Edit panel only shows up when the user is editing a value -->
  {#if propertyToEdit}
    <div class="property-edit-panel">
      <NumericInput bind:value={newValue} on:keydown={onInputKeydown} onInit={onInputInit} />
      <button on:click={onConfirmClick}>Confirm</button>
      <button on:click={onCancelClick}>Cancel</button>
    </div>
  {/if}
</character-status>

<style>
	character-status {
		display: flex;
    align-items: center;
    justify-content: space-between;
    height: 20px;
    font-weight: bold;
	}
  
  name {
    padding-right: 15px;
    font-size: 19px;
  }
  
  statline {
    display: flex;
  }
  
  stat {
    cursor: pointer;
    text-decoration: underline;
    font-weight: 600;
    font-size: 16px;
    width: 63px;
    text-align: right;
  }
  
  stat-separator {
    padding: 0 4px;
    font-weight: 400;
    font-size: 16px;
  }
  
  .property-edit-panel {
    display: flex;
    position: absolute;
    left: 107px;
  }
  
  .property-edit-panel :global(input) {
    width: 82px;
  }
</style>
