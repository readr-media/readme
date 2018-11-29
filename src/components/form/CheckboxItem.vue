<template>
  <div class="checkbox-wrapper" :class="{ editor: theme === 'editor' }">
    <label class="container">
      <input type="checkbox" v-model="checked">
      <span class="checkmark"></span>
    </label>  
    <span class="text" v-text="text"></span>
  </div>
</template>
<script>
  export default {
    name: 'CheckboxItem',
    data () {
      return {
        checked: false,
      }
    },
    methods: {},
    mounted () {
      this.checked = this.value || false
    },
    props: {
      value: {},
      id: {},
      text: {},
      theme: {},
    },
    watch: {
      checked () {
        this.$emit('update:value', this.checked)
      },
      id () {
        this.checked = false
      },
    },
  }
</script>
<style lang="stylus" scoped>
  .checkbox-wrapper
    position relative
    &.editor
      .text
        margin-left 12px
      .container
        &:hover
          input ~ .checkmark
            background-color #e6f8f9
        input
          &:checked ~ .checkmark
            background-color #0db9c9
            border none
      .checkmark
        margin-top -10px
        width 20px
        height 20px
        box-shadow 1.6px 1.2px 2px 0px rgba(0, 0, 0, 0.1)
        background-color #fff
        border none
        border-radius 2px
        &:after
          left 6px
          top 2px
          width 8px
          height 12px          
  .text
    margin-left 8px
    font-size 1rem
    font-weight normal
    font-style normal
    font-stretch normal
    line-height normal
    letter-spacing normal
    text-align left
    color #000000
  .container
    display inline-block
    // position relative
    cursor pointer
    font-size 22px
    user-select none
    width 16px
    height 100%
    &:hover
      input ~ .checkmark
        background-color #ccc 
    input
      position absolute
      opacity 0
      cursor pointer
      height 0
      width 0
      &:checked ~ .checkmark
        background-color #000  
        border 1px solid #000   
      &:checked ~ .checkmark:after
        display block
    .checkmark:after
      left 5px
      top 1px
      width 5px
      height 10px
      border solid white
      border-width 0 2px 2px 0
      transform rotate(45deg)
  .checkmark
    position absolute
    top 50%
    left 0
    margin-top -8px
    height 16px
    width 16px
    background-color #fff
    border 1px solid #a0a0a0
    border-radius 2px
    &:after
      content ""
      position absolute
      display none
</style>