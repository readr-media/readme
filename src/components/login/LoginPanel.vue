<template>
  <div class="login-panel" :class="{ active: isPanelActive, }" tabIndex="0" @focus="focusin" @focusout="focusout">
    <div class="login-panel__account">
      <div class="title"><span v-text="$t('LOGIN.ACCOUNT')"></span></div>
      <div>
        <TextInput
          backgroundColor="#a3a3a3"
          backgroundColorFocused="#fff"
          :value.sync="account"></TextInput>
      </div>
    </div>
    <div class="login-panel__password">
      <div class="title"><span v-text="$t('LOGIN.PASSWORD')"></span></div>
      <div>
        <TextInput
          backgroundColor="#a3a3a3"
          backgroundColorFocused="#fff"
          type="password"
          :value.sync="password"></TextInput>
      </div>
    </div>
    <div class="login-panel__go"><span v-text="$t('LOGIN.GO_LOGIN')" @click="login"></span></div>
  </div>
</template>
<script>
  import TextInput from 'src/components/new-form/TextInput.vue'
  const debug = require('debug')('CLIENT:LoginPanel')
  const login = (store, params) => store.dispatch('LOGIN', { params, })

  export default {
    name: 'LoginPanel',
    components: {
      TextInput,
    },
    data () {
      return {
        account: undefined,
        isPanelActive: false,
        password: undefined,
      }
    },
    methods: {
      focusin () {
        this.isPanelActive = true
      },
      focusout () {
        this.isPanelActive = false
      },
      login () {
        if (this.validate()) {
          login(this.$store, {
            account: '',
            password: '',
          }).then((res) => {
            if (res.status === 200) {
              // const memberCenter = get(filter(ROLE_MAP, { key: get(this.$store, [ 'state', 'profile', 'role', ]), }), [ 0, 'route', ], 'member')
              // this.$route.path === '/comment' ? this.$router.push(this.$route.fullPath) : this.$router.push(`/${memberCenter}`)
              // location.replace(`/${memberCenter}`)
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
      validate () {
        return true
      },
    },
    mounted () {},
  }
</script>
<style lang="stylus" scoped>
  .login-panel
    // width 100%
    // height 100%
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
    > div
      &:not(:first-child)
        margin-top 20px
      > div:not(:last-child)
        margin-bottom 10px
    &__account, &__password
      .title
        color #d3d3d3
    &__go
      position absolute
      bottom 30px
      left 0
      width 100%
      height 30px
      padding 0 30px
      span
        background-color #808080
        display flex
        justify-content center
        align-items center
        width 100%
        height 30px
        border-radius 2px
        cursor pointer
</style>