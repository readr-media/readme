<template>
  <div class="list-actions" @focus="switchActions(true, $event)" @focusout="switchActions(false, $event)" tabindex="0">
    <div class="list-actions__switcher"></div>
    <div class="list-actions__actions">
      <ActionBox :active.sync="isActionsActive">
        <template slot="actions">
          <div class="item" @click="copy"><span v-text="$t('LIST.ACTIONS.COPY')"></span></div>
          <div class="item" @click="del"><span v-text="$t('LIST.ACTIONS.DELETE')"></span></div>
        </template>
      </ActionBox>
    </div>
  </div>
</template>
<script>
  import ActionBox from 'src/components/common/ActionBox.vue'
  import { isDescendant } from 'src/util/comm'
  const debug = require('debug')('CLIENT:ActionBox')

  export default {
    name: 'ListActionBox',
    components: {
      ActionBox,
    },
    data () {
      return {
        isActionsActive: false,
      }
    },
    methods: {
      del () {
        this.$emit('del')
      },
      copy () {
        this.$emit('copy')
      },
      switchActions (status, event) {
        const targ = event.target
        if (isDescendant(targ, { parent: this.$el })) {
          this.isActionsActive = true
        } else {
          this.isActionsActive = status
        }
      }
    },
    mounted () {},
  }
</script>
<style lang="stylus" scoped>
  .list-actions
    position relative
    outline none
    &__switcher
      display block
      background-color #eeeeee
      background-image url(/public/icons/icon-more.png)
      background-position center center
      background-size auto 20px
      background-repeat no-repeat
      cursor pointer
      border-radius 16px
      width 32px
      height 32px
      &:hover
        background-color #e1e1e1
    &__actions
      position absolute
      top 100%
      left 0
</style>