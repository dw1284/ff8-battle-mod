<script>
	import _ from 'lodash';
	import TeamCharacterStatusComponent from './TeamCharacterStatusComponent.svelte';
	
	export let teamMembers;
  export let onTeamMemberChange;
	
	$: editableTeamMembers = _.filter(teamMembers, 'isAvailable');
</script>

<team-status>
	<team-members>
		{#each editableTeamMembers as teamMember}
			<TeamCharacterStatusComponent character={_.cloneDeep(teamMember)} onTeamCharacterStatusChange={onTeamMemberChange} />
		{/each}
		{#each editableTeamMembers as teamMember}
			<spacer />
		{/each}
	</team-members>
</team-status>

<style>
	team-members {
		display: flex;
		flex-wrap: wrap;
		justify-content: space-evenly;
		padding: 20px;
	}
	
	spacer {
		width: 336px;
	}
</style>
