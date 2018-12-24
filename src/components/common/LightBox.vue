<template>
  <div class="common-lightbox" v-if="isActive">
    <div class="common-lightbox__container">
      <div :is="component" :callback="callback"></div>
      <div class="common-lightbox__close" @click="switchOff"></div>
    </div>
  </div>
</template>
<script>
  import preventScroll from 'prevent-scroll'
  import { get } from 'lodash'
  const switchOff = store => store.dispatch('COMMON_LIGHTBOX_SWITCH', { active: false })
  export default {
    name: 'LightBox',
    computed: {
      isActive () {
        return get(this.$store, 'state.commonLightboxFlag.active')
      },
    },
    data () {
      return {
        callback: () => {}
      }
    },
    methods: {
      switchOff () {
        switchOff(this.$store)
      },
    },
    mounted () {},
    watch: {
      isActive () {
        if (this.isActive) {
          preventScroll.on()
          this.callback = get(this.$store, 'state.commonLightboxFlag.callback')
          this.component = get(this.$store, 'state.commonLightboxFlag.component')
        } else {
          preventScroll.off()
        }
      },  
    }
  }
</script>
<style lang="stylus" scoped>
  .common-lightbox
    position fixed
    top 0
    left 0
    width 100vw
    height 100vh
    background-color rgba(0,0,0,0.8)
    z-index 99999
    display flex
    justify-content center
    align-items center
    &__container
      background-color #f7f7f7
      position relative
      min-width 300px
      min-height 300px
    &__close
      cursor pointer
      position absolute
      right 0
      top 0
      background-position center
      background-size 36px 36px
      background-repeat no-repeat
      background-image url(/public/icons/icon_close-lightbox.png)
      width 80px
      height 80px
      z-index 1
</style>