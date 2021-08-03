<script>
	import _ from 'lodash';
	import BattleCharacterStatusComponent from './BattleCharacterStatusComponent/BattleCharacterStatusComponent.svelte';
	
	export let enemies, partyMembers, enemyAttacksEnabled;
  export let onEnemyChange, onPartyMemberChange, onKillAllEnemiesClick, onDisableEnableEnemyAttacksClick, onDamageAllEnemiesClick, onCureAllPartyMembersClick;
</script>

<battle-status>
	<enemies>
    <!-- Render each enemy -->
		{#each enemies as enemy}
			<BattleCharacterStatusComponent character={enemy} onBattleCharacterStatusChange={onEnemyChange} />
		{/each}
    <!-- Actions the user can take on the enemies -->
		<button-panel>
			<button on:click={onKillAllEnemiesClick}>Kill All</button>
			<button on:click={onDisableEnableEnemyAttacksClick}>{enemyAttacksEnabled ? 'Disable' : 'Enable'} Attacks</button>
			<button on:click={onDamageAllEnemiesClick}>Damage All</button>
		</button-panel>
	</enemies>
	<party-members>
    <!-- Render each party member -->
		{#each partyMembers as partyMember}
			<BattleCharacterStatusComponent character={partyMember} onBattleCharacterStatusChange={onPartyMemberChange} />
		{/each}
    <!-- Actions the user can take on the party members -->
		<button-panel>
			<button on:click={onCureAllPartyMembersClick}>Cure All</button>
		</button-panel>
	</party-members>
</battle-status>

<style>
	enemies, party-members {
		display: inline-flex;
		flex-direction: column;
		width: 237px;
	}
	
	party-members {
		margin-left: 30px;
	}
	
	button-panel {
		display: flex;
		flex-wrap: wrap;
		margin-top: 5px;
		border-top: 1px solid;
	}
	
	button-panel button {
    text-decoration: underline;
    border: none;
    background: none;
    font-weight: 600;
    font-size: 14px;
    padding: 0 10px 0 0;
    margin: 0;
    cursor: pointer;
	}
</style>
