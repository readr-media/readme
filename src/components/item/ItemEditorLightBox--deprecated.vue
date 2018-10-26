<template>
  <div class="editor-lightbox" v-if="isActive">
    <div class="panel">
      <div class="editor">
        <slot name="editor"></slot>
      </div>
      <div class="close" @click="close" ref="close"><img src="/public/icons/icons8-delete-30.png"></div>
    </div>
  </div>
</template>
<script>
  import { get, } from 'lodash'
  export default {
    name: 'ItemEditorLightBox',
    methods: {
      close () {
        this.$emit('update:isActive', false)
      },
    },
    mounted () {
      get(this.$refs, 'close', {}).ondragstart = function () { return false }
      get(this.$refs, 'close', {}).onselectstart = function () { return false }
    },
    props: {
      isActive: {
        type: Boolean,
        default: false,
      },
    },
  }
</script>
<style lang="stylus" scoped>
  .editor-lightbox
    position fixed
    left 0
    top 0
    width 100vw
    height 100vh
    background-color rgba(0,0,0,0.7)
    display flex
    justify-content center
    align-items center
    z-index 9999
    > .panel
      width 900px
      padding 40px 30px 10px
      background-color #eee
      border-radius 2px
      position relative
      .editor
        overflow auto
        max-height calc(99vh - 50px)
        width 100%
      .close
        cursor pointer
        position absolute
        top 10px
        right 10px
        height 36px
        width calc(100% - 10px)
        text-align right
        background-color #eee
        z-index 998
        img
          // width 100%
          height 100%
          object-fit contain
          object-position center
</style>