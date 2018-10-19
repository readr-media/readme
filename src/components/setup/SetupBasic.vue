<template>
  <div class='setup-basic'>

  </div>
</template>
<script>
  export default {
    name: 'SetupBasic',
    methods: {},
    mounted () {},
  }
</script>
<style lang="stylus" scoped>
  .setup-basic
    background-color #303030
    box-shadow 0 0 5px rgba(100,100,100,0.5)
    padding 30px 20px 60px
    font-size 0.9475rem
    position relative
    display flex
    flex-direction column
    justify-content flex-start
    align-items center
    outline none
    &.active
      box-shadow 0 0 5px rgba(255,255,255,0.5)
      background-color #353535    
</style>