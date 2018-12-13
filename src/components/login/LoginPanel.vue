<template>
  <div class="login-panel" tabIndex="0" @keyup="keyupHandler">
    <div class="login-panel__account item" :class="{ 'hint-active': hint.account }">
      <TextInput
        backgroundColor="#fff"
        backgroundColorFocused="#fff"
        :placeHolder="$t('LOGIN.INPUT_HINT.ACCOUNT')"
        :value.sync="account"></TextInput>
      <div class="hint" v-show="hint.account"><span v-text="$t(hint.account)"></span></div>
    </div>
    <div class="login-panel__password item" :class="{ 'hint-active': hint.password }">
      <TextInput
        backgroundColor="#fff"
        backgroundColorFocused="#fff"
        type="password"
        :placeHolder="$t('LOGIN.INPUT_HINT.PASSWORD')"
        :value.sync="password"></TextInput>
      <div class="hint" v-show="hint.password"><span v-text="$t(hint.password)"></span></div>        
    </div>
    <div class="login-panel__keep-alive item">
      <CheckboxItem
        theme="login"
        :value.sync="keepLive"
        :text="$t('LOGIN.KEEP_ALIVE')"></CheckboxItem>
    </div>
    <div class="login-panel__go item"><span v-text="$t('LOGIN.GO_LOGIN')" @click="login"></span></div>
    <div class="login-panel__issue item">
      <div class="recover-pwd"><span v-text="$t('LOGIN.RECOVER_PASSWORD')"></span></div>
      <div class="register"><span v-text="$t('LOGIN.REGISTER')"></span></div>
    </div>
  </div>
</template>
<script>
  import CheckboxItem from 'src/components/form/CheckboxItem.vue'
  import TextInput from 'src/components/form/TextInput.vue'
  import validator from 'validator'
  import { get } from 'lodash'
  const debug = require('debug')('CLIENT:LoginPanel')
  const login = (store, params, token) => store.dispatch('LOGIN', { params, token })

  export default {
    name: 'LoginPanel',
    components: {
      CheckboxItem,
      TextInput,
    },
    data () {
      return {
        account: undefined,
        keepLive: false,
        password: undefined,
        hint: {
          account: '',
          password: '',
        }
      }
    },
    methods: {
      login () {
        if (this.validate()) {
          login(this.$store, {
            account: this.account,
            password: this.password,
            keepAlive: this.keepLive,
          }, get(this.$store, 'state.register-token')).then(res => {
            if (res.status === 200) {
              location.replace('/')
            } else {
              // this.resMsg = this.$t('login.WORDING_LOGIN_INFAIL_VALIDATION_ISSUE')
              debug('LOGGED-IN IN FAIL!!', res.status)
              debug('LOGGED-IN IN FAIL!!', res.status)
            }
          }).catch(err => {
            if (err.status === 401 && err.message === 'Validated in fail. Please offer correct credentials.') {
              // this.resMsg = this.$t('login.WORDING_LOGIN_UNAUTHORIZED')
              this.hint.account = 'LOGIN.HINT.INCORRECT_CREDENTIAL'
              this.hint.password = 'LOGIN.HINT.INCORRECT_CREDENTIAL'
            }
            debug('Err status', err.status)
            debug('Err message', err.message)
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
        let pass = true
        this.hint.account = ''
        this.hint.password = ''
        if (!this.account || !validator.isEmail(this.account)) {
          pass = false
          this.hint.account = 'LOGIN.HINT.INCORRECT_EMAIL_FORMAT'
        }
        if (!this.password || validator.isEmpty(this.password)) {
          pass = false
          this.hint.password = 'LOGIN.HINT.EMPTY_PASSWORD'
        }
        // this.$forceUpdate()
        return pass
      },
    },
    mounted () {},
  }
</script>
<style lang="stylus" scoped>
  .login-panel
    padding 30px 20px
    font-size 0.9475rem
    position relative
    display flex
    flex-direction column
    justify-content flex-start
    align-items center
    outline none
    background-color transparent
    .item
      width 100%
      position relative
      &:not(:first-child)
        margin-top 35px
      &.hint-active
        border 1px solid #ff0000
        border-radius 4px
      .hint
        position absolute
        right 0
        top 100%
        margin-top 5px
        width 100%
        height 100%
        font-size 0.75rem
        font-weight normal
        font-style normal
        font-stretch normal
        line-height normal
        letter-spacing normal
        text-align right
        color #ff0000
    &__issue
      font-size 1rem
      font-weight normal
      font-style normal
      font-stretch normal
      line-height normal
      letter-spacing normal
      text-align left
      color #0db9c9
      > div
        &:not(:first-child)
          margin-top 16px
      span
        text-decoration underline
    &__go
      font-size 1.25rem
      font-weight normal
      font-style normal
      font-stretch normal
      line-height normal
      letter-spacing normal
      text-align center
      color #ffffff
      span
        background-color #0db9c9
        color #fff
        display flex
        justify-content center
        align-items center
        width 160px
        height 55px
        border-radius 2px
        cursor pointer

</style>