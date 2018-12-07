<template>
  <div class="login">
    <LoginPanel class="login__panel"></LoginPanel>
  </div>
</template>
<script>
  import LoginPanel from 'src/components/login/LoginPanel.vue'
  const getDisposableToken = store => store.dispatch('DISPOSABLE_TOKEN', { type: 'register', })
  export default {
    name: 'Login',
    components: {
      LoginPanel,
    },
    methods: {},
    beforeMount () {
      getDisposableToken(this.$store)
    },
    mounted () {},
  }
</script>
<style lang="stylus" scoped>
  .login
    padding 40px
    background-color #fff
    display flex
    justify-content center
    align-items center
    background-color #f1f1f1
    &__panel
      width 250px
      height 300px
</style>