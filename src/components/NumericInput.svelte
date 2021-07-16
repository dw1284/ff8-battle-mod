<script>
  import _ from 'lodash';
  
	export let value, min, max, onKeypress = _.noop, onInit = _.noop;
  // export let step = 1, precision = 0; // not implemented yet
  
  function onWrappedKeypress(e) {
    const invalidChars = ['-', '+', 'e', '.'];
    if (_.includes(invalidChars, e.key))
      e.preventDefault();
    else
      onKeypress ? onKeypress(e) : _.noop();
  };
</script>

<numeric-input>
  <input type="number" {min} {max} bind:value={value} on:keypress={onWrappedKeypress} on:change on:keydown use:onInit />
</numeric-input>

<style>
  numeric-input {
    display: flex;
  }
  
  input[type=number]::-webkit-inner-spin-button {
    opacity: 1
  }
</style>
