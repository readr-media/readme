<template>
  <div class="header">
    <div class="left"></div>
    <div class="right">
      <div class="logout" @click="logout" v-show="showLogout"><span v-text="$t('HEADER.LOGOUT')"></span></div>
    </div>
  </div>
</template>
<script>
  const debug = require('debug')('CLIENT:NewHeader')
  export default {
    name: 'NewHeader',
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
    height 40px
    width 100%
    // background-image linear-gradient(to right, #2a2a2a 0%, transparent 10%, #2a2a2a 70%, #2a2a2a 100%)
    // box-shadow 1px 1px 5px rgba(42,42,42,0.6)
    display flex
    justify-content space-between
    padding 8px
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