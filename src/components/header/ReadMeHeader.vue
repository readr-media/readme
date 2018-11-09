<template>
  <div class="header">
    <div class="header__wrapper">
      <div class="left"></div>
      <div class="right">
        <div class="logout" @click="logout" v-show="showLogout"><span v-text="$t('HEADER.LOGOUT')"></span></div>
      </div>    
    </div>
  </div>
</template>
<script>
  const debug = require('debug')('CLIENT:ReadMeHeader')
  export default {
    name: 'ReadMeHeader',
    computed: {
      showLogout () {
        return !this.$route.path.match(/\/login([A-Za-z0-9.*+?^=!:${}()#%~&_@\-`|\[\]\/\\]*)?$/)
      },
    },
    data () {
      return {}
    },
    methods: {
      logout () {
        location.replace('/login')
      },
    },
    mounted () {
      debug(this.$route.path.match(/\/login([A-Za-z0-9.*+?^=!:${}()#%~&_@\-`|\[\]\/\\]*)?$/))
    },
  }
</script>
<style lang="stylus" scoped>
  .header
    height 60px
    width 100%
    background-color #fff
    &__wrapper
      background-color rgba(229,229,229,0.3)
      display flex
      justify-content space-between
      padding 8px
      height 100%
      width 100%
    .left, .right
      > div
        background-color #010101
        box-shadow 0 0 5px rgba(125,125,125,0.6)
        color #d3d3d3
        padding 0 10px
        height 100%
        display flex
        justify-content center
        align-items center
        &:hover
          background-color #000
          cursor pointer
          color #ffed6f
</style>