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
	</team-members>
</team-status>

<style>
	team-members {
		display: flex;
		flex-wrap: wrap;
	}
</style>
