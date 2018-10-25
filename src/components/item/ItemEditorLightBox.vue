<template>
  <div class="editor-lightbox" v-if="isActive">
    <div class="panel">
      <slot name="editor" class="editor"></slot>
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
    .panel
      width 900px
      padding 20px 30px 10px
      background-color #eee
      border-radius 2px
      position relative
      .editor
        width 100%
      .close
        cursor pointer
        position absolute
        top 10px
        right 10px
        height 36px
        width 35px
        img
          width 100%
          object-fit contain
          object-position center
</style>