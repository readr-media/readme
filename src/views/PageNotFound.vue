<template>
  <div class="page-not-found">
    <HomePageDirector class="page-not-found__main"
      :message="$t('PAGE_NOT_FOUND.MESSAGE')" label="404" />
    <div class="page-not-found__bottom">
      <div class="fishbow"><img src="/public/icons/fishbowl@2x.png"></div>
    </div>
  </div>
</template>
<script>
  import HomePageDirector from 'src/components/HomePageDirector.vue'
  import verge from 'verge'
  export default {
    name: 'PageNotFound',
    components: {
      HomePageDirector,
    },
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
<style lang="stylus" scoped>
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
    >>> div + div, >>> a + a
      margin-left 30px    
    
</style>