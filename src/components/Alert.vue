<template>
  <div class="alert" v-show="isActive">
    <div class="panel">
      <div class="panel__message"><span v-text="message"></span></div>
      <div class="panel__actions">
        <div class="confirm" @click="confirm"><span v-text="$t('ALERT.CONFIRM')"></span></div>
        <template v-if="type === 'action'">
          <div class="cancel" @click="close"><span v-text="$t('ALERT.CANCEL')"></span></div>
        </template>
      </div>
    </div>
  </div>
</template>
<script>
  import preventScroll from 'prevent-scroll'
  import { get, } from 'lodash'
  const debug = require('debug')('CLIENT:Alert')
  const switchAlert = (store, active, message) => store.dispatch('ALERT_SWITCH', { active, message, type: 'info' })
  export default {
    name: 'Alert',
    computed: {
      callback () {
        return get(this.$store, 'state.alertFlag.callback') || function () {
          debug('Go default callback!!')
        }
      },
      isActive () {
        return get(this.$store, 'state.alertFlag.active', false)
      },
      message () {
        return get(this.$store, 'state.alertFlag.message')
      },
      type () {
        return get(this.$store, 'state.alertFlag.type', 'action')
      },
    },
    methods: {
      close () {
        switchAlert(this.$store, false)
      },
      confirm () {
        this.callback()
        switchAlert(this.$store, false)
      },
    },
    mounted () {},
    watch: {
      isActive () {
        if (this.isActive) {
          preventScroll.on()
        } else {
          preventScroll.off()
        }
      },      
    },
  }
</script>
<style lang="stylus" scoped>
  .alert
    position fixed
    left 0
    top 0
    height 100vh
    width 100vw
    background-color rgba(0,0,0,0.8)
    z-index 99999
    display flex
    justify-content center
    align-items center
    .panel
      width 400px
      // height 200px
      background-color rgba(255,255,255,0.8)
      box-shadow 0px 0px 10px rgba(250,250,250,0.8)
      border-radius 2px
      padding 20px 50px 50px
      position relative
      &__message
        margin-bottom 20px
        font-size 1.125rem
        // color
      &__actions
        display flex
        justify-content space-between
        height 30px
        width 100%
        position absolute
        left 0
        bottom 20px
        padding 0 50px
        > div
          flex 1
          display flex
          justify-content center
          align-items center
          background-color rgba(150,111,0,0.7)
          box-shadow 0px 0px 5px rgba(100,100,100,0.5)
          border-radius 2px
          padding 5px
          cursor pointer
          &:not(:last-child)
            margin-right 10px
          &:hover
            background-color rgba(203,175,94,0.7)
            box-shadow 0px 0px 5px rgba(250,250,250,0.5)
</style>