<template>
  <div class="sys-info">
    <div class="name"><span>ReadMe</span></div>
    <div class="version"><span v-text="`version ${systemVersion}`"></span></div>
    <div class="right"><span>Readr-Team©2018</span></div>
  </div>
</template>
<script>
  import { get, } from 'lodash'
  export default {
    name: 'SystemInfo',
    computed: {
      systemVersion () {
        return get(this.$store, 'state.systemVersion', '')
      },
    },
    methods: {},
    mounted () {},
  }
</script>
<style lang="stylus" scoped>
  .sys-info
    position fixed
    left 0px
    bottom 10px
    // background-color rgba(0,0,0,0.5)
    background-color rgba(0,0,0,0.2)
    width 210px
    height 100px
    z-index 9997
    display flex
    flex-direction column
    justify-content center
    align-items center
    // color #d3d3d3
    color #fff
    padding 20px 30px
    > div
      font-size 0.75rem
      line-height normal
      width 100%
      &.name
        font-size 0.875rem
        font-weight 800
      
</style>