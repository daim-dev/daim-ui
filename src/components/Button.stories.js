import Button from './Button.vue'

// More on default export: https://storybook.js.org/docs/vue/writing-stories/introduction#default-export
export default {
  title: 'Button',
  component: Button,
  // More on argTypes: https://storybook.js.org/docs/vue/api/argtypes
  argTypes: {
    size: {
      control: { type: 'select' },
      options: ['sm', 'md', 'lg'],
    },
  },
}

// More on component templates: https://storybook.js.org/docs/vue/writing-stories/introduction#using-args
const Template = (args) => ({
  // Components used in your story `template` are defined in the `components` object
  components: { Button },
  // The story's `args` need to be mapped into the template through the `setup()` method
  setup() {
    return { args }
  },
  // And then the `args` are bound to your component with `v-bind="args"`
  template: '<Button v-bind="args" />',
})

export const Primary = Template.bind({})
// More on args: https://storybook.js.org/docs/vue/writing-stories/args
Primary.args = {
  text: 'Button',
}

export const Secondary = Template.bind({})
Secondary.args = {
  variant: 'secondary',
  text: 'Button',
}

export const Large = Template.bind({})
Large.args = {
  size: 'lg',
  text: 'Button',
}

export const Small = Template.bind({})
Small.args = {
  size: 'sm',
  text: 'Button',
}
