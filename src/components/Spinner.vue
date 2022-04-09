<template>
  <div
    class="spinner-border animate-spin inline-block w-16 h-16 border-4 rounded-full"
    role="status"
    style="
      vertical-align: -0.125em;
      border: 0.25em solid;
      border-right-color: transparent;
    "
  >
    <span class="sr-only">Loading...</span>
  </div>
</template>

<script>
import { defineComponent } from 'vue-demi'
export default defineComponent({
  name: 'Spinner',
})
</script>
