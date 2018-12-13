<template>
  <div class="login-view">
    <LoginPanel class="login-view__panel"></LoginPanel>
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
  .login-view
    padding 70px 40px 40px
    background-color rgba(13,185,201,0.2)
    display flex
    justify-content center
    align-items flex-start
    &__panel
      width 420px
</style>