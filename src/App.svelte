<script>
	import _ from 'lodash';
	import TeamStatusComponent from './components/TeamStatusComponent.svelte';
	import BattleStatusComponent from './components/BattleStatusComponent.svelte';
	
	const team = {
		members: [{id: 0, name: 'Squall'}, {id: 1, name: 'Zell'}, {id: 2, name: 'Irvine'}, {id: 3, name: 'Quistis'}, {id: 4, name: 'Rinoa'}, {id: 5, name: 'Selphie'}, {id: 6, name: 'Seifer'}, {id: 7, name: 'Edea'}],
		
		receiveUpdatedTeamMemberValue: (updatedPropertyName, newVal) => {
			const attributeName = updatedPropertyName.split('TeamMember')[0];
			const teamMemberName = updatedPropertyName.split('TeamMember')[1];
			const teamMember = _.find(team.members, {name: teamMemberName});
			_.set(teamMember, attributeName, newVal);
			team.members = team.members;
		},
		
		sendUpdatedTeamMemberValues: (teamMemberName, data) => {
			const teamMemberToUpdate = _.find(team.members, {name: teamMemberName});
			_.each(data, (val, key) => {
				if (!_.isEqual(_.get(teamMemberToUpdate, key), val)) {
					const attributeName = `${key}TeamMember${teamMemberName}`;
					ff8ProcessWatcherEventEmit('updateGameValue', attributeName, val);
				}
			});
		},
	};
	
	const battle = {
		started: false,
		enemies: _.times(4, index => {return {id: index + 1, name: `Enemy ${index + 1}`}}),
		partyMembers: _.times(3, index => {return {id: index + 1, name: `Party ${index + 1}`}}),
		enemyAttacksEnabled: true,
		
		receiveUpdatedEnemyValue: (updatedPropertyName, newVal) => {
			const attributeName = updatedPropertyName.split('Enemy')[0];
			const enemyId = +updatedPropertyName.split('Enemy')[1];
			const enemy = _.find(battle.enemies, {id: enemyId});
			_.set(enemy, attributeName, newVal);
			battle.enemies = battle.enemies;
		},
		
		receiveUpdatedPartyMemberValue: (updatedPropertyName, newVal) => {
			const attributeName = updatedPropertyName.split('PartyMember')[0];
			const partyMemberId = +updatedPropertyName.split('PartyMember')[1];
			const partyMember = _.find(battle.partyMembers, {id: partyMemberId});
			_.set(partyMember, attributeName, newVal);
			battle.partyMembers = battle.partyMembers;
		},
		
		sendUpdatedEnemyValues: (enemyId, data) => {
			const enemyToUpdate = _.find(battle.enemies, {id: enemyId});
			_.each(data, (val, key) => {
				if (!_.isEqual(_.get(enemyToUpdate, key), val)) {
					const attributeName = `${key}Enemy${enemyId}`;
					ff8ProcessWatcherEventEmit('updateGameValue', attributeName, val);
				}
			});
		},
		
		sendUpdatedPartyMemberValues: (partyMemberId, data) => {
			const partyMemberToUpdate = _.find(battle.partyMembers, {id: partyMemberId});
			_.each(data, (val, key) => {
				if (!_.isEqual(_.get(partyMemberToUpdate, key), val)) {
					const attributeName = `${key}PartyMember${partyMemberId}`;
					ff8ProcessWatcherEventEmit('updateGameValue', attributeName, val);
				}
			});
		},
		
		killAllEnemies: () => {
			_.each(battle.enemies, enemy => battle.sendUpdatedEnemyValues(enemy.id, {currentStatus: 4194304, isDead: 1}));
		},
		
		toggleEnemyAttacksEnabled: () => {
			ff8ProcessWatcherEventEmit('updateGameValue', 'enemyAttacksEnabled', !battle.enemyAttacksEnabled);
		},
		
		damageAllEnemies: () => {
			const enemiesToDamage = _.filter(battle.enemies, enemy => !enemy.isDead && enemy.currentHealth > 0);
			_.each(enemiesToDamage, enemy => battle.sendUpdatedEnemyValues(enemy.id, {currentHealth: 1}));
		},
		
		cureAllPartyMembers: () => {
			_.each(battle.partyMembers, partyMember => battle.sendUpdatedPartyMemberValues(partyMember.id, {currentHealth: partyMember.maxHealth}));
		}
	};
	
	window.onFf8ProcessWatcherEventEmit('gameValuesUpdated', (deltasObject) => {      
		_.each(deltasObject, ({newVal, prevVal}, updatedPropertyName) => {
			if (updatedPropertyName.match(/Enemy/g)) {
				battle.receiveUpdatedEnemyValue(updatedPropertyName, newVal);
			} else if (updatedPropertyName.match(/PartyMember/g)) {
				battle.receiveUpdatedPartyMemberValue(updatedPropertyName, newVal);
			} else if (updatedPropertyName.match(/TeamMember/g)) {
				team.receiveUpdatedTeamMemberValue(updatedPropertyName, newVal);
			} else if (updatedPropertyName === 'battleStarted') {
				battle.started = newVal;
			} else if (updatedPropertyName === 'enemyAttacksEnabled') {
				battle.enemyAttacksEnabled = newVal;
			}
		});
	});
	
	// Computed values
	$: teamReady = _.every(team.members, teamMember => _.has(teamMember, 'magic'));
	$: {
		_.each(battle.partyMembers, partyMember => {
			partyMember.displayName = _.get(_.find(team.members, {id: partyMember.teamMemberId}), 'displayName', partyMember.name);
		});
	}
</script>

<app>
	{#if battle.started}
		<BattleStatusComponent
			enemies={battle.enemies}
			partyMembers={battle.partyMembers}
			enemyAttacksEnabled={battle.enemyAttacksEnabled}
			onEnemyChange={battle.sendUpdatedEnemyValues}
			onPartyMemberChange={battle.sendUpdatedPartyMemberValues}
			onKillAllEnemiesClick={battle.killAllEnemies}
			onDisableEnableEnemyAttacksClick={battle.toggleEnemyAttacksEnabled}
			onDamageAllEnemiesClick={battle.damageAllEnemies}
			onCureAllPartyMembersClick={battle.cureAllPartyMembers} />
	{:else if teamReady}
		<TeamStatusComponent
			teamMembers={team.members}
			onTeamMemberChange={team.sendUpdatedTeamMemberValues} />
	{:else}
		Looking for process FF8_EN.exe
	{/if}
</app>

<style>
	app {
		display: inline-flex;
	}
</style>
