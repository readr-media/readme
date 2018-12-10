<template>
  <div class="login-panel" tabIndex="0" @keyup="keyupHandler">
    <div class="login-panel__account">
      <div class="title"><span v-text="$t('LOGIN.ACCOUNT')"></span></div>
      <div>
        <TextInput
          backgroundColor="#f1f1f1"
          backgroundColorFocused="#fff"
          :value.sync="account"></TextInput>
      </div>
    </div>
    <div class="login-panel__password">
      <div class="title"><span v-text="$t('LOGIN.PASSWORD')"></span></div>
      <div>
        <TextInput
          backgroundColor="#f1f1f1"
          backgroundColorFocused="#fff"
          type="password"
          :value.sync="password"></TextInput>
      </div>
    </div>
    <div class="login-panel__go"><span v-text="$t('LOGIN.GO_LOGIN')" @click="login"></span></div>
  </div>
</template>
<script>
  import TextInput from 'src/components/form/TextInput.vue'
  import { get } from 'lodash'
  const debug = require('debug')('CLIENT:LoginPanel')
  const login = (store, params, token) => store.dispatch('LOGIN', { params, token })

  export default {
    name: 'LoginPanel',
    components: {
      TextInput,
    },
    data () {
      return {
        account: undefined,
        password: undefined,
      }
    },
    methods: {
      login () {
        if (this.validate()) {
          login(this.$store, {
            account: this.account,
            password: this.password,
          }, get(this.$store, 'state.register-token')).then(res => {
            if (res.status === 200) {
              location.replace('/')
            } else {
              // this.resMsg = this.$t('login.WORDING_LOGIN_INFAIL_VALIDATION_ISSUE')
              debug('LOGGED-IN IN FAIL!!', res.status)
              debug('LOGGED-IN IN FAIL!!', res.status)
            }
          }).catch((err) => {
            if (err.status === 401) {
              // this.resMsg = this.$t('login.WORDING_LOGIN_UNAUTHORIZED')
            }
            debug('LOGGED-IN IN FAIL!!', err)
            debug('LOGGED-IN IN FAIL!!', err)
          })
        }
      },
      keyupHandler (e) {
        if (e.keyCode === 13) {
          this.login()
        }        
      },
      validate () {
        return true
      },
    },
    mounted () {},
  }
</script>
<style lang="stylus" scoped>
  .login-panel
    background-color #e9e9e9
    padding 30px 20px 60px
    font-size 0.9475rem
    position relative
    display flex
    flex-direction column
    justify-content flex-start
    align-items center
    outline none
    box-shadow 0 0 15px rgba(0,0,0,0.1)
    > div
      &:not(:first-child)
        margin-top 20px
      > div:not(:last-child)
        margin-bottom 10px
    &__account, &__password
      .title
        color #000
    &__go
      position absolute
      bottom 30px
      left 0
      width 100%
      height 30px
      padding 0 30px
      span
        background-color #0db9c9
        color #fff
        display flex
        justify-content center
        align-items center
        width 100%
        height 30px
        border-radius 2px
        cursor pointer
</style>