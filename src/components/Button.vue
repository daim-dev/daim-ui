<template>
  <button :type="type" :class="classes" class="btn" v-bind="$attrs">
    <slot>{{ text }}</slot>
  </button>
</template>

<script lang="ts">
import { defineComponent } from 'vue-demi'

export default defineComponent({
  props: {
    type: {
      type: String as () => 'button' | 'reset' | 'submit' | undefined,
      default: 'button',
    },
    variant: {
      type: String,
      default: 'primary',
    },
    block: {
      type: Boolean,
      default: false,
    },
    text: {
      type: String,
    },
    size: {
      type: String,
      validator(value: string) {
        return ['small', 'medium', 'large'].includes(value)
      },
    },
    dark: { type: Boolean, default: false },
  },
  computed: {
    classes(): object {
      return {
        [`btn-${this.variant}`]: this.variant,
        // 'text-white': !this.dark,
        'text-gray-700': this.dark,
        block: this.block,
      }
    },
  },
})
</script>
