<template>
  <Button
    target="_blank"
    :href="url"
    rel="noopener"
    :data-address="address"
    :data-domain="domain"
    :data-tel="tel"
    :variant="variant"
    :size="size"
    v-bind="$attrs"
  >
    <span v-if="_icon" :class="_icon"></span>&nbsp;
    <slot>
      <span style="display: none">info.</span>
      <span v-if="address && domain" itemprop="email">{{ stripped }}</span>
      <span style="display: none">.localhost</span>
      <span v-if="tel" itemprop="telephone">{{ tel }}</span>
    </slot>
  </Button>
</template>

<script>
// import { faEnvelope } from '@fortawesome/free-regular-svg-icons';
// import { faPhone } from '@fortawesome/free-solid-svg-icons';
import mailgo from 'mailgo'
import { defineComponent } from 'vue-demi'
import Button from './Button.vue'
export default defineComponent({
  extends: Button,
  props: {
    href: { type: String, required: true, default: '' },
    icon: { type: [String, Object], default: null },
    noIcon: { type: Boolean, defulat: undefined },
  },
  computed: {
    _icon() {
      if (this.noIcon) return
      if (this.icon) return this.icon
      return this.isTel ? 'i-fa6-solid-phone' : 'i-fa6-solid-envelope'
    },
    stripped() {
      return this.href.replace(/^mailto:/, '').replace(/^tel:/, '')
    },
    splits() {
      return this.stripped.split('@')
    },
    hasSplits() {
      return this.splits.length > 1
    },
    url() {
      return this.hasSplits || this.isTel ? '#mailgo' : this.href
    },
    address() {
      return this.hasSplits ? this.splits[0] : undefined
    },
    domain() {
      return this.hasSplits ? this.splits[1] : undefined
    },
    isTel() {
      return this.href.startsWith('tel:')
    },
    tel() {
      return this.isTel ? this.stripped : undefined
    },
  },
  created() {
    // if (process?.client) {
    mailgo()
    // }
  },
})
</script>
