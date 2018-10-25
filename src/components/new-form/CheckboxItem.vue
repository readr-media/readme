<template>
  <label class="container">
    <input type="checkbox" v-model="checked">
    <span class="checkmark"></span>
  </label>
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
    mounted () {},
    props: {
      value: {
        type: Boolean,
      },
      id: {},
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
  .container
    display block
    position relative
    cursor pointer
    font-size 22px
    user-select none
    width 16px
    height 16px
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
    top 0
    left 0
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