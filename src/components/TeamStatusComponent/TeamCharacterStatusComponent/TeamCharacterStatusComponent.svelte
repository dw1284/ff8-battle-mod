<script>
  import _ from 'lodash';
  import NumericInput from '../../NumericInput.svelte';
  import magicSpells from '../../../configs/magic-spells';
  
	export let character;
  export let onTeamCharacterStatusChange = _.noop;
  
  let propertyToEdit = null;
  let newValue = null;
  
  function onEditClick(propertyName) {
    if (propertyName === 'maxHealth') {
      alert('Cannot edit because this is calculated by character\'s level');
      return;
    }
    propertyToEdit = propertyName;
    newValue = _.get(character, propertyName, 0);
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
    const maxValue = (propertyToEdit === 'currentHealth') ? calcMaxHealth(character) : newValue;
    const data = {[propertyToEdit]: Math.min(newValue, maxValue)};
    if (data.maxHealth < character.currentHealth)
      data.currentHealth = data.maxHealth;
    onTeamCharacterStatusChange(character.name, data);
    propertyToEdit = null;
    newValue = null;
  };
  
  function onCancelClick() {
    propertyToEdit = null;
    newValue = null;
  };
  
  function onMagicChange() {
    onTeamCharacterStatusChange(character.name, {magic: character.magic});
  };
  
  function calcMaxHealth(targetCharacter) {
    const {currentLevel: lvl, maxHealthModifier1: mod1, maxHealthModifier2: mod2, healthBonusSpell: bonusSpellId} = targetCharacter;
    const bonusMultiplier = _.find(magicSpells, {id: bonusSpellId}).hpBonusModifier;
    const bonusQuantity = _.get(_.find(character.magic, magicSlot => magicSlot[0] === bonusSpellId), 1, 0);
    const bonusHp = bonusQuantity * bonusMultiplier;
    return (bonusHp-Math.floor(((lvl*lvl)+((lvl*lvl)*4))*2/255))+lvl*mod1+mod2;
  };
  
  // Computed values
  $: maxHealth = calcMaxHealth(character);
</script>

<character-status>
  <portrait style={`background-image: url(images/${character.name}.png)`} />
  <status>
    <statline>
      <name>{character.displayName || character.name}</name>
    </statline>
    <statline>
      <stat-name>Level:</stat-name>
      <stat on:click={() => {onEditClick('currentLevel')}}>{character.currentLevel}</stat>
      <stat-name>Health:</stat-name>
      <stat class="health" on:click={() => {onEditClick('currentHealth')}}>{character.currentHealth}</stat>
      <stat-separator>/</stat-separator>
      <stat class="health" on:click={() => {onEditClick('maxHealth')}}>{maxHealth}</stat>
    </statline>
    <statline>
      <magic-editor>
        {#each character.magic as magicSlot}
          <magic-slot>
            <!-- svelte-ignore a11y-no-onchange -->
            <select on:change={(e) => {magicSlot[0] = e.target.selectedIndex; onMagicChange();}}>
              {#each magicSpells as spell, index}<option value={spell} selected={index === magicSlot[0]}>{spell.name}</option>{/each}
            </select>
            <NumericInput min={0} max={100} bind:value={magicSlot[1]} on:change={onMagicChange} />
          </magic-slot>
        {/each}
      </magic-editor>
    </statline>
  </status>
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
    font-weight: 500;
    margin: 10px 15px;
	}
  
  portrait {
    background-repeat: no-repeat;
    background-size: 100% auto;
    width: 88px;
    margin-right: 14px;
  }
  
  name {
    width: 66px;
    font-size: 19px;
  }
  
  status {
    display: flex;
    flex-direction: column;
    margin-top: 3px;
  }
  
  statline {
    display: flex;
  }
  
  stat-name {
    margin-right: 10px;
    font-size: 15px;
    font-weight: 500;
  }
  
  stat {
    cursor: pointer;
    text-decoration: underline;
    font-weight: 600;
    font-size: 16px;
    margin-right: 10px;
    width: 24px;
  }
  
  stat.health {
    width: 38px;
    text-align: right;
    margin: 0;
  }
  
  stat-separator {
    padding: 0 4px;
    font-weight: 400;
    font-size: 16px;
  }
  
  magic-editor {
    display: flex;
    flex-direction: column;
    height: 105px;
    margin-top: 4px;
    overflow-y: scroll;
    border: 1px inset;
    flex-grow: 1;
  }
  
  magic-slot {
    display: flex;
  }
  
  magic-slot select {
    flex-grow: 1;
    margin-right: 2px;
  }
  
  magic-slot :global(input) {
    width: 45px;
    margin-right: 2px;
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
