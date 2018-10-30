<template>
  <div class="action-box">
    <div class="switcher" tabindex="0"></div>
    <div class="actions">
      <div class="actions__item" @click="copy"><span v-text="$t('LIST.ACTIONS.COPY')"></span></div>
      <div class="actions__item" @click="del"><span v-text="$t('LIST.ACTIONS.DELETE')"></span></div>
    </div>
  </div>
</template>
<script>
  const debug = require('debug')('CLIENT:ActionBox')
  export default {
    name: 'ActionBox',
    methods: {
      del () {
        this.$emit('del')
      },
      copy () {
        this.$emit('copy')
      },
    },
    mounted () {},
  }
</script>
<style lang="stylus" scoped>
  .action-box
    position relative
    .switcher
      outline none
      display block
      background-color #eeeeee
      background-image url(/public/icons/config-ho.png)
      background-position center center
      background-size contain
      background-repeat no-repeat
      cursor pointer
      border-radius 16px
      width 32px
      height 32px
      &:hover
        background-color #e1e1e1
      &:focus ~ .actions
        display block
    .actions
      position absolute
      top 55%
      left 10px
      background-color rgba(160,160,160,0.9)
      border-radius 2px
      width 120px 
      padding 8px 0
      z-index 9999
      display none
      &:hover
        display block
      &__item
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