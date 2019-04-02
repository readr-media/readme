<template>
  <div class="system-error">
    <HomePageDirector class="system-error__main" :message="$t('SYSTEM_ERROR.MESSAGE')" label="500" />
  </div>
</template>
<script>
  import HomePageDirector from 'src/components/HomePageDirector.vue'
  export default {
    name: 'SystemError',
    components: {
      HomePageDirector,
    },
    data () {
      return {}
    },
    mounted () {}
  }
</script>
<style lang="stylus" scoped>
.system-error
  height 100vh
  background-color #e6f8f9
  background-position center center
  background-size contain
  background-repeat no-repeat
  background-image url(/public/icons/fishes@2x.png)
  &__main
    display flex
    height 67%
    width 100%
    padding-top 33vh
    >>> div + div, >>> a + a
      margin-left 30px    
</style>