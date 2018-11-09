<template>
  <div class="action-box" :class="{ active, right: align === 'right', }">
    <slot name="actions"></slot>
  </div>
</template>
<script>
  const debug = require('debug')('CLIENT:ActionBox')
  export default {
    name: 'ActionBox',
    methods: {},
    mounted () {},
    props: {
      active: {
        type: Boolean,
        default: false
      },
      align: {
        type: String,
        default: 'left'
      },
    },
  }
</script>
<style lang="stylus" scoped>
  .action-box
    position absolute
    top 0
    left 0
    background-color rgba(160,160,160,0.9)
    border-radius 2px
    width 120px 
    padding 8px 0
    z-index 9999
    display none
    &.active
      display block
    &.right
      right 0
    .item
      padding 8px
      display flex
      justify-content center
      align-items center
      font-size 0.75rem
      font-weight 300
      color #fff
      width 100%
      &:hover
        background-color #000
</style>