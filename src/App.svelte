<script>
	import _ from 'lodash';
	import MenuDrawerComponent from './components/MenuDrawerComponent.svelte';
	import PartyEditMenu from './components/PartyEditMenu.svelte';
	import TeamStatusComponent from './components/TeamStatusComponent/TeamStatusComponent.svelte';
	import BattleStatusComponent from './components/BattleStatusComponent/BattleStatusComponent.svelte';
	
	let ff8MenuIsOpen = false;
	
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
			_.each(data, (val, key) => {
				const attributeName = `${key}TeamMember${teamMemberName}`;
				ff8ProcessWatcherEventEmit('updateGameValue', attributeName, val);
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
			_.each(data, (val, key) => {
				const attributeName = `${key}Enemy${enemyId}`;
				ff8ProcessWatcherEventEmit('updateGameValue', attributeName, val);
			});
		},
		
		sendUpdatedPartyMemberValues: (partyMemberId, data) => {
			_.each(data, (val, key) => {
				const attributeName = `${key}PartyMember${partyMemberId}`;
				ff8ProcessWatcherEventEmit('updateGameValue', attributeName, val);
			});
		},
		
		killAllEnemies: () => {
			// It was very difficult to find a way to inflict damage on an enemy in such a way that would trigger its death
			// animation and give experience points for its death. The way we do it is to inject some code that modified the
			// poison damage calculation routine and makes the next poison tick inflict a lethal amount of damage. We also
			// force the enemy's ATB guage to full, and disable its ability to attack, which forces a poison tick.
			// TLDR: We exploit the poison damage routine in order to inflict instant kills on these enemies
			const originalAttackEnabledVal = battle.enemyAttacksEnabled;
			// Enable code injections
			ff8ProcessWatcherEventEmit('updateGameValue', 'enemyAttacksEnabled', false);
			ff8ProcessWatcherEventEmit('updateGameValue', 'damageLimitEnabled', false);
			ff8ProcessWatcherEventEmit('updateGameValue', 'killOnNextPoisonTick', true);
			// Force a poison tick on each enemy
			_.each(battle.enemies, enemy => battle.sendUpdatedEnemyValues(enemy.id, {hasPoisonWithoutAnimation: true, atb: 46}));
			// Wait for enemies to die then undo code injections
			let interval = setInterval(() => {
				if (_.every(battle.enemies, {currentHealth: 0})) {
					ff8ProcessWatcherEventEmit('updateGameValue', 'killOnNextPoisonTick', false);
					ff8ProcessWatcherEventEmit('updateGameValue', 'damageLimitEnabled', true);
					ff8ProcessWatcherEventEmit('updateGameValue', 'enemyAttacksEnabled', originalAttackEnabledVal);
					clearInterval(interval);
				}
			}, 50);
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
	
	onFf8ProcessWatcherEventEmit('gameValuesUpdated', (deltasObject) => {
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
			} else if (updatedPropertyName === 'menuIsOpen') {
				ff8MenuIsOpen = newVal;
			}
		});
	});
	
	// We won't render the team component until every team member has received its values from memory
	$: teamReady = _.every(team.members, teamMember => _.has(teamMember, 'magic'));
  
  // Party slots hold an ID representing the team member currently occupying the slot
  // Go retrieve the displayName of each team member currently occupying the party slots
	$: {
		_.each(battle.partyMembers, partyMember => {
			partyMember.displayName = _.get(_.find(team.members, {id: partyMember.teamMemberId}), 'displayName', partyMember.name);
		});
	}
</script>

<app>
	<MenuDrawerComponent maxHeight='250px'>
		<PartyEditMenu
			partyMembers={battle.partyMembers}
			teamMembers={team.members}
			onPartyMemberChange={battle.sendUpdatedPartyMemberValues}
			onTeamMemberChange={team.sendUpdatedTeamMemberValues}
			disabled={ff8MenuIsOpen ? ['main-party'] : false} />
	</MenuDrawerComponent>
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
