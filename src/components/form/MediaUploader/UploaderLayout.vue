<template>
  <div class="uploader"><slot></slot></div>
</template>
<script>
  export default {
    name: 'UploaderLayout',
    methods: {},
    mounted () {},
  }
</script>
<style lang="stylus" scoped>
  $plus-sign
    content ''
    background-color white
    position absolute
    top 0
    bottom 0
    left 0
    right 0
    margin auto
  .uploader
    display flex
    position relative
    min-height 185px
    &.full
      justify-content center
      align-items center
      background-color #eee
      margin-bottom 40px
    &__item
      &--previewer
        position absolute
        top 0
        left 0
        height 100%
        width 100%
        z-index 0
      &--info
        position absolute
        top 100%
        left 0
        margin-top 10px
        min-height 40px
        width 100%
        font-weight normal
        font-style normal
        font-stretch normal
        line-height normal
        letter-spacing normal
        .name
          font-size 0.875rem
          color #000
        .size
          font-size 0.75rem
          color #3f3f3f

      &--remover
        position absolute
        right -15px
        top -15px
        height 38px
        width 38px
        background-color #fff
        border-radius 50%
        box-shadow 2px 2px 10px rgba(0,0,0,0.1)
        z-index 10
        cursor pointer
    >>> &__upload-button
      r = 38px
      width r
      height r
      min-width r
      min-height r      
      background-color #808080
      border-radius r
      box-shadow 0 1px 2px 0 rgba(0, 0, 0, 0.5)
      position relative
      margin 30px auto 17px
      outline none
      &.hidden
        opacity 0
      &:before
        @extends $plus-sign
        width 24px
        height 4px
      &:after
        @extends $plus-sign
        width 4px
        height 24px
    &__spinner
      position absolute
      width 50px
      height 50px
      left 50%
      top 50%
      margin-left -25px
      margin-top -25px
    >>> .filepond
      &--wrapper
        width 100%
        &.full
          .filepond--panel-root
            background-color transparent!important

          .filepond--root
            min-height 185px
            .filepond--list-scroller
              position relative
              width 100%
              height 100%
              display flex
              align-items center
              margin 0
              display none
              .filepond--list
                position relative
              .filepond--item
                position relative
      &--root
        min-height 100%
        display flex
        justify-content center
        margin-bottom 0
        overflow hidden
      &--list-scroller
        display none
      &--drop-label
        margin 40px auto
      &--action-remove-item
        opacity 1
        left auto
        right -15px
        top -15px
        background-color #fff
        width 38px
        height 38px
        box-shadow 2px 2px 10px rgba(0,0,0,0.1)
        display none
      &--file-info
        transform none!important
        // position absolute
        // top 100%
        // margin-top 10px
        // &-main
        //   color #000
        //   font-size 0.875rem
        // &-sub
        //   font-size 0.75rem
        //   color #5a5a5a
      &--list
        left 0
        width 100%
      &--image-preview-overlay-idle  
        mix-blend-mode color
      &--panel-root
        background-color #fff!important
</style>