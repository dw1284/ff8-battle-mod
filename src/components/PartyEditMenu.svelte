<script>
  import _ from 'lodash';
  
	export let partyMembers;
  export let teamMembers;
  export let onPartyMemberChange;
  export let onTeamMemberChange;
  export let disabled;
  
  function onSelectChange() {
    _.each(partyMembers, partyMember => {
      onPartyMemberChange(partyMember.id, {teamMemberId: partyMember.teamMemberId});
    });
  };
  
  function onCheckboxChange() {
    _.each(teamMembers, teamMember => {
      onTeamMemberChange(teamMember.name, {isAvailable: teamMember.isAvailable});
    });
  };
  
  // Computed values
  $: slot1AvailableTeamMembers = [{id: 255, displayName: ''}, ..._.filter(_.filter(teamMembers, 'isAvailable'), teamMember => {return teamMember.id !== partyMembers[1].teamMemberId && teamMember.id !== partyMembers[2].teamMemberId})];
  $: slot2AvailableTeamMembers = [{id: 255, displayName: ''}, ..._.filter(_.filter(teamMembers, 'isAvailable'), teamMember => {return teamMember.id !== partyMembers[0].teamMemberId && teamMember.id !== partyMembers[2].teamMemberId})];
  $: slot3AvailableTeamMembers = [{id: 255, displayName: ''}, ..._.filter(_.filter(teamMembers, 'isAvailable'), teamMember => {return teamMember.id !== partyMembers[0].teamMemberId && teamMember.id !== partyMembers[1].teamMemberId})];
</script>

<party-edit-menu>
  <settings>
    <setting>
      <setting-name>Main Party:</setting-name>
      <options class="main-party">
        <!-- svelte-ignore a11y-no-onchange -->
        <select bind:value={partyMembers[0].teamMemberId} on:change={onSelectChange} disabled={disabled === true || _.includes(disabled, 'main-party')}>
          {#each slot1AvailableTeamMembers as teamMember}<option value={teamMember.id}>{teamMember.displayName}</option>{/each}
        </select>
        <!-- svelte-ignore a11y-no-onchange -->
        <select bind:value={partyMembers[1].teamMemberId} on:change={onSelectChange} disabled={disabled === true || _.includes(disabled, 'main-party')}>
          {#each slot2AvailableTeamMembers as teamMember}<option value={teamMember.id}>{teamMember.displayName}</option>{/each}
        </select>
        <!-- svelte-ignore a11y-no-onchange -->
        <select bind:value={partyMembers[2].teamMemberId} on:change={onSelectChange} disabled={disabled === true || _.includes(disabled, 'main-party')}>
          {#each slot3AvailableTeamMembers as teamMember}<option value={teamMember.id}>{teamMember.displayName}</option>{/each}
        </select>
      </options>
    </setting>
    <setting>
      <setting-name>Team Members:</setting-name>
      <options class="team-availability">
        {#each teamMembers as teamMember}
          <label>
            <input type="checkbox" bind:checked={teamMember.isAvailable} on:change={onCheckboxChange} disabled={disabled === true || _.includes(disabled, 'team-availability')}>
            {_.get(teamMember, 'displayName', '')}
          </label>
        {/each}
      </options>
    </setting>
  </settings>
  <note>
    Note: Some setting require that you be out of the FF8 menu before they become editable
  </note>
</party-edit-menu>

<style>
	party-edit-menu {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    align-items: center;
    padding: 10px;
    height: 95%;
  }
  
  settings {
    display: flex;
    flex-direction: column;
    width: 510px;
  }
  
  setting {
    display: flex;
    align-items: baseline;
    margin: 10px 0;
  }
  
  setting-name {
    width: 200px;
    text-align: right;
    margin-right: 25px;
    font-weight: 700;
  }
  
  /* options {
  } */
  
  .main-party {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    height: 65px;
  }
  
  .main-party select {
    width: 100px;
  }
  
  .team-availability {
    display: flex;
    flex-wrap: wrap;
    width: 180px;
  }
  
  .team-availability label {
    width: 80px;
    font-weight: 500;
  }
</style>
