<script>
	import _ from 'lodash';
	import TeamCharacterStatusComponent from './TeamCharacterStatusComponent/TeamCharacterStatusComponent.svelte';
	
	export let teamMembers;
  export let onTeamMemberChange;
	
	$: editableTeamMembers = _.filter(teamMembers, 'isAvailable');
</script>

<team-status>
	<team-members>
    <!-- Render each team member -->
		{#each editableTeamMembers as teamMember}
			<TeamCharacterStatusComponent character={_.cloneDeep(teamMember)} onTeamCharacterStatusChange={onTeamMemberChange} />
		{/each}
    <!-- The below is purely for spacing. We add empty slots at the end which forces the last rendered item to
         appear on the left side of the flex grid (lined up with the item above it) instead of center window -->
		{#each editableTeamMembers as teamMember}<spacer />{/each}
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
