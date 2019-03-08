<template>
  <div class="alert" v-show="isActive">
    <div class="panel" v-if="!isReporting">
      <div class="panel__message">
        <template v-if="message"><span v-text="message"></span></template>
        <template v-else>
          <span v-text="$t('ALERT.UNIDENTIFIED_ISSUE.PREFIX')"></span>
          <span v-text="$t('ALERT.UNIDENTIFIED_ISSUE.INFIX')" class="report" @click="report"></span>
          <span v-text="$t('ALERT.UNIDENTIFIED_ISSUE.SUFFIX')"></span>
        </template>
      </div>
      <div class="panel__actions">
        <div class="confirm" @click="confirm"><span v-text="textConfirm"></span></div>
        <template v-if="type === 'action'">
          <div class="cancel" @click="close"><span v-text="$t('ALERT.CANCEL')"></span></div>
        </template>
      </div>
    </div>
    <div class="panel reporting" v-else>
      <div class="panel__message"><span v-text="$t('ALERT.REPORTED')"></span></div>
      <div class="panel__item hint"><span v-text="$t('ALERT.GOING_TO_CLOSE_ITSELF', { count: countdown })"></span></div>
      <div class="panel__item dove"><img src="/public/icons/dove@2x.png" /></div>
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
      textConfirm () {
        return get(this.$store, 'state.alertFlag.textConfirm', this.$t('ALERT.CONFIRM'))
      },
    },
    data () {
      return {
        isReporting: false,
        countdown: 0,
      }
    },
    methods: {
      close () {
        switchAlert(this.$store, false)
      },
      confirm () {
        this.callback()
        switchAlert(this.$store, false)
      },
      report () {
        this.isReporting = true
        this.countdown = 3
        const interval = () => {
          this.countdown -= 1
          if (this.countdown === 0) {
            this.close()
            this.isReporting = false
            clearInterval(interval)
          }          
        }
        setInterval(interval, 1000)
      }
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
    background-color rgba(0,0,0,0.25)
    z-index 9999999
    display flex
    justify-content center
    align-items center
    .panel
      width 400px
      min-height 292px
      max-height 90vh
      background-color #fff
      box-shadow 0px 0px 10px rgba(0,0,0,0.2)
      border-radius 2px
      padding 63px 33px 117px
      position relative
      &.reporting
        padding 63px 33px
        .hint
          font-size 1rem
          font-weight normal
          color #a0a0a0
        .dove
          display flex
          justify-content center
          align-items center
          margin-top 41px
          img
            height 120px
            width 184px  
      &__message
        margin-bottom 20px
        font-size 1.5rem
        font-weight bold
        line-height normal
        letter-spacing normal
        color #000000  
        .report
          color #f98866
          position relative
          cursor pointer
          border-bottom 2px solid #f98866
          line-height 1.8rem
          margin 0 2px
          display inline-block
      &__actions
        display flex
        justify-content space-between
        height 54px
        width 100%
        position absolute
        left 0
        bottom 63px
        padding 0 33px
        > div
          flex 1
          display flex
          justify-content center
          align-items center
          background-color #0db9c9
          box-shadow 0px 0px 5px rgba(100,100,100,0.5)
          border-radius 4px
          padding 5px
          cursor pointer

          font-size 1.125rem
          font-weight normal
          font-style normal
          letter-spacing normal
          text-align center
          color #f7f7f7

          &:not(:last-child)
            margin-right 10px
          &:hover
            background-color #989898
</style>