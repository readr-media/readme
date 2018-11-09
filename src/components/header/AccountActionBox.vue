<template>
  <div class="account-info" @focus="switchActions(true, $event)" @focusout="switchActions(false, $event)" tabindex="0">
    <div class="account-info__avatar" :style="{ backgroundImage: `url(${getFullUrl(get(me, 'profileImage'))})` }"></div>
    <div class="account-info__name"><span v-text="get(me, 'nickname', $t('USER'))"></span></div>
    <div class="account-info__dropdown-hint">
      <img src="/public/icons/icon-down.png">
    </div>
    <div class="account-info__actions">
      <ActionBox :active.sync="isActionsActive" align="right">
        <template slot="actions">
          <div class="item"><span v-text="$t('HEADER.LOGOUT')"></span></div>
        </template>
      </ActionBox>
    </div>
  </div>
</template>
<script>
  import ActionBox from 'src/components/common/ActionBox.vue'
  import { get, } from 'lodash'
  import { isDescendant, getFullUrl, } from 'src/util/comm'
  const debug = require('debug')('CLIENT:AccountActionBox')
  export default {
    name: 'AccountActionBox',
    components: {
      ActionBox,
    },
    computed: {
      me () {
        return get(this.$store, 'state.profile', {})
      },
    },
    data () {
      return {
        isActionsActive: false,
      }
    },
    methods: {
      get,
      getFullUrl,
      switchActions (status, event) {
        const targ = event.target
        if (isDescendant(targ, { parent: this.$el })) {
          this.isActionsActive = true
        } else {
          this.isActionsActive = status
        }
      }
    },
    mounted () {
      this.$el.ondragstart = function () { return false }
      this.$el.onselectstart = function () { return false }
    },
  }
</script>
<style lang="stylus" scoped>
  .account-info
    height 100%
    position relative
    outline none
    > div
      &:not(:first-child)
        margin-left 15px
    &__avatar
      height 100%
      width 22px
      background-position center center
      background-repeat no-repeat
      background-size contain
      border-radius 50%
    &__name
      color #626262
      font-size 0.875rem
      font-weight normal
      line-height normal
    &__dropdown-hint
      display flex
      img
        height 6px
    &__actions
      position absolute
      left 0
      top 100%
      width 100%
</style>