<template>
  <div class="page-not-found">
    <div class="page-not-found__main">
      <a href="/" class="go-homepage--arrow">
        <div class="background"></div>
        <div class="arrow"></div>
      </a>
      <a href="/" class="go-homepage--logo">
        <div class="logo"><img src="/public/icons/readme.png"></div>
        <div class="hint"><span v-text="$t('PAGE_NOT_FOUND.GO_HOME')"></span></div>
      </a>
      <div class="message">
        <div class="label"><span>404</span></div>
        <div class="content"><span v-text="$t('PAGE_NOT_FOUND.MESSAGE')"></span></div>
      </div>
    </div>
    <div class="page-not-found__bottom">
      <div class="fishbow"><img src="/public/icons/fishbowl@2x.png"></div>
    </div>
  </div>
</template>
<script>
  import verge from 'verge'
  export default {
    name: 'PageNotFound',
    data () {
      return {}
    },
    methods: {
      dynamicRenderRandomCircles () {
        const circleNum = 6
        for(let i = 0; i < circleNum; i += 1) {
          let size = Math.floor(Math.random() * 175) + 100
          let posX = Math.floor(Math.random() * verge.viewportW() )
          let posY = Math.floor(Math.random() * verge.viewportH())

          const circle = document.createElement('div')
          circle.setAttribute('class', 'dynamic-circle')
          circle.setAttribute('style', `width:${size}px;height:${size}px;top:${posY}px;left:${posX}px;`)
          this.$el.appendChild(circle)
        }
      }
    },
    mounted () {
      this.dynamicRenderRandomCircles()
    }
  }
</script>
<style lang="stylus">
.page-not-found
  background-color #e6f8f9
  position relative
  .dynamic-circle
    position absolute
    background-repeat no-repeat
    background-position center center
    background-size contain
    background-image url(/public/icons/circle@2x.png)
  &__bottom
    height 33vh
    position relative
    .fishbow
      position absolute
      right 0
      top 0
      width 33%
      height 100%
      img
        width 204px
        height 184px
        object-fit contain
  &__main
    display flex
    height 67vh
    width 100%
    padding-top 33vh
    > div + div, > a + a
      margin-left 30px    
    .message
      flex 1
      display flex
      justify-content center
      .label
        display flex
        justify-content center
        align-items center
        flex 1
        max-width 352px        
        text-shadow 1.4px 1.4px 1.9px rgba(0, 0, 0, 0.2)
        font-family ArialRoundedMT
        font-size 12.5rem
        font-weight bold
        font-style normal
        font-stretch normal
        line-height 0.81
        letter-spacing normal
        text-align center
        color #0db9c9
      .content
        flex 1
        font-size 1.75rem
        font-weight 600
        color #0db9c9
        display flex
        align-items center
        padding-bottom 1.75rem
    .go-homepage
      &--logo
        width 150px
        display flex
        flex-direction column
        justify-content center
        div + div
          margin-top 8px
        .logo
          width 142px
          height 29px
          img
            width 100%
            height 100%
            object-fit contain
        .hint
          font-size 1.75rem
          font-weight 600
          text-align right
          color #0db9c9

      &--arrow
        position relative
        height 100%
        width 150px
        display flex
        justify-content center
        align-items center
        > div
          background-repeat no-repeat
          background-size contain
          background-position center center

        .background
          position absolute
          left 0
          bottom 0
          width 100%
          height 100%
          background-image url(/public/icons/halfcircle@2x.png)
          z-index 0
          
        .arrow
          height 50px
          width 60px
          background-image url(/public/icons/icon_arrow_left@2x.png)
          position relative
          z-index 1
</style>