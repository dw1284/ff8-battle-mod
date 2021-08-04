<script>
	import _ from 'lodash';
  
  export let heightWhenClosed = '6px';                          // How many pixels of the drawer will peek out when its closed (at 0px only the handle shows)
  export let maxHeight = `calc(100vh - ${heightWhenClosed})`;   // The maximum height that the drawer will expand to when it opens
  
  let isOpen = false;
  let transitionsEnabled = true;
  let currentHeight, currentWidth; // These are bound to the content container and auto-calculated by svelte
  
  function toggleDrawerState() {
    isOpen = !isOpen;
  };
  
  function disableTransitions() {
    transitionsEnabled = false;
    setTimeout(() => {
      transitionsEnabled = true;
    }, 100);
  };
  
  $: drawerStyle = `max-height: ${maxHeight}; margin-left: -${currentWidth / 2}px; ${transitionsEnabled ? 'transition: bottom .5s;' : ''} ${isOpen ? `bottom: calc(100% - ${currentHeight}px);` : `bottom: calc(100% - ${heightWhenClosed});`}`;
</script>

<svelte:window on:resize={disableTransitions} />

<menu-drawer style={drawerStyle} bind:clientHeight={currentHeight} bind:clientWidth={currentWidth}>
  <margin-spacer class="left" />
  <drawer-content><slot /></drawer-content>
	<drawer-handle on:click={toggleDrawerState}><div>| | | |</div></drawer-handle>
  <margin-spacer class="right" />
</menu-drawer>

<style>
	menu-drawer {
    position: fixed;
    display: flex;
    flex-direction: column;
		width: calc(100vw - 200px);
    min-width: 425px;
    left: 50%;
    background: #adadad;
    box-shadow: 0 1px black;
	}
  
  margin-spacer {
    position: absolute;
    top: 0;
    width: 125px;
    height: calc(100% - 30px);
    background: inherit;
    box-shadow: 0 1px black;
    z-index: -3;
  }
  
  margin-spacer.left {
    left: -125px;
  }
  
  margin-spacer.right {
    right: -125px;
  }
  
  menu-drawer:before {
    content: '';
    position: absolute;
    left: 0;
    bottom: 0;
    width: 40px;
    height: 30px;
    background: inherit;
    transform-origin: 0 100%;
    transform: skew(50deg);
    box-shadow: -2px 1px black;
    z-index: -2;
  }
  
  menu-drawer:after {
    content: '';
    position: absolute;
    right: 0;
    bottom: 0;
    width: 40px;
    height: 30px;
    background: inherit;
    transform-origin: 0 100%;
    transform: skew(-50deg);
    box-shadow: 3px 1px black;
    z-index: -2;
  }
  
  drawer-content {
    flex-grow: 1;
    margin-bottom: 15px;
    background: inherit;
    overflow: hidden;
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
    cursor: pointer;
    user-select: none;
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
    box-shadow: -1px .5px black;
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
    box-shadow: 2px .5px black;
  }
  
  drawer-handle div {
    position: relative;
    top: -2px;
  }
</style>
