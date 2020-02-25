<template>
  <div class="text-input" :class="{ warned: isWarned }" :style="{ width, }">
    <input ref="input"
      v-model="current"
      :disabled="disabled"
      :type="type"
      :placeholder="placeHolder"
      :style="{
        backgroundColor: background_color,
        color,
        width,
        fontSize,
        fontWeight,
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
      isWarned: {},
      lengthLimit: {},
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
      color: {},
      fontSize: {},
      fontWeight: {},
    },
    watch: {
      current (value) {
        if (this.lengthLimit && typeof value === 'string' && value.length > this.lengthLimit) {
          this.current = value.substring(0, this.lengthLimit)
        }
        this.$emit('update:value', validator.trim(`${this.current}` || '') || undefined)
      },
    },
  }
</script>
<style lang="stylus" scoped>
  .text-input
    &.warned
      input
        border 1px solid #ff0000
    input
      border none
      width 100%
      height 34px
      font-size 1.125rem
      border-radius 4px
      padding 0 10px
      vertical-align top
      background-color #ffffff
      outline none
      &::-webkit-input-placeholder
        color #a0a0a0
</style>