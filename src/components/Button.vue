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
      default: 'md',
      validator(value: string) {
        return ['sm', 'md', 'lg'].includes(value)
      },
    },
    rounded: { type: Boolean, default: true },
    dark: { type: Boolean, default: false },
  },
  computed: {
    classes(): object {
      return {
        'btn-primary': this.variant === 'primary',
        'btn-secondary': this.variant === 'secondary',
        'btn-link': this.variant === 'link',
        'btn-sm': this.size === 'sm',
        'btn-md': this.size === 'md',
        'btn-lg': this.size === 'lg',

        'text-white': !this.dark && this.variant !== 'link',
        'text-gray-700': this.dark,
        block: this.block,
        rounded: this.rounded,
        'rounded-lg': this.rounded,
      }
    },
  },
})
</script>
