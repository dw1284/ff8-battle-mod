<script>
	import _ from 'lodash';
  
  export let maxHeight = 'calc(100vh - 13px)';
  
  let isOpen = false;
  let transitionsEnabled = true;
  let currentHeight;
  
  function toggleDrawerState() {
    isOpen = !isOpen;
  };
  
  function disableTransitions() {
    transitionsEnabled = false;
    setTimeout(() => {
      transitionsEnabled = true;
    }, 100);
  };
  
  $: drawerStyle = `max-height: ${maxHeight}; ${transitionsEnabled ? 'transition: bottom .5s;' : ''} ${isOpen ? `bottom: calc(100vh - ${currentHeight}px);` : 'bottom: calc(100vh - 12px);'}`;
</script>

<svelte:window on:resize={disableTransitions} />

<menu-drawer style={drawerStyle}>
  <drawer-content bind:clientHeight={currentHeight}><slot /></drawer-content>
	<drawer-handle on:click={toggleDrawerState}><div>| | | |</div></drawer-handle>
</menu-drawer>

<style>
	menu-drawer {
    position: fixed;
    display: flex;
    flex-direction: column;
    height: calc(100vh - 13px);
		width: 100%;
    background: #adadad;
    box-shadow: 0 1px black;
	}
  
  drawer-content {
    flex-grow: 1;
    overflow: hidden;
    margin-bottom: 12px;
  }
  
  drawer-handle {
    position: absolute;
    display: flex;
    justify-content: center;
    align-items: center;
    color: #e6e6e6;
    font-size: 6px;
    letter-spacing: 1px;
    height: 12px;
    width: 40px;
    margin: auto;
    left: 0;
    right: 0;
    bottom: -12px;
    background: inherit;
    box-shadow: 0 1.5px black;
    cursor: pointer;
    user-select: none;
  }
  
  drawer-handle div {
    position: relative;
    top: -2px;
  }
  
  drawer-handle:before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: inherit;
    transform-origin: 0 100%;
    transform: skew(45deg);
    z-index: -1;
    box-shadow: -1px 1px black;
  }
  
  drawer-handle:after {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: inherit;
    transform-origin: 0 100%;
    transform: skew(-45deg);
    z-index: -1;
    box-shadow: 2px 1px black;
  }
</style>
