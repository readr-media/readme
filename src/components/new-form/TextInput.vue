<template>
  <div class="text-input" :style="{ width, }">
    <input ref="input"
      v-model="current"
      :disabled="disabled"
      :type="type"
      :placeholder="placeHolder"
      :style="{
        backgroundColor: background_color,
      }"
      @focus="focus"
      @focusout="focusout"
      @keyup="keyup">
  </div>
</template>
<script>
  import validator from 'validator'
  export default {
    name: 'TextInput',
    computed: {
      background_color () {
        return this.isFocused ? this.backgroundColorFocused || this.backgroundColor : this.backgroundColor
      },
    },
    data () {
      return {
        current: '',
        isFocused: false,
      }
    },
    methods: {
      focus () {
        this.isFocused = true
      },
      focusout () {
        this.isFocused = false
      },
      keyup () {},
    },
    mounted () {
      this.current = this.value
    },
    props: {
      backgroundColor: {
        type: String,
      },
      backgroundColorFocused: {
        type: String,
      },
      disabled: {
        type: Boolean,
        default: () => false,
      },
      placeHolder: {
        type: String,
        default: () => '',
      },
      type: {
        type: String,
        default: () => 'text',
      },
      value: {},
      width: {},
    },
    watch: {
      current: function () {
        this.$emit('update:value', validator.trim(`${this.current}` || '') || undefined)
      },
    },
  }
</script>
<style lang="stylus" scoped>
  .text-input
    input
      border none
      border-radius 2px
      width 100%
      height 30px
      font-size 1.125rem
      padding 0 10px
      vertical-align top
      background-color #ffffff
      outline none
      font-weight 100
      &::-webkit-input-placeholder
        color #bdbdbd
        font-weight 100
</style>