<template>
  <div class="value-setter" v-if="active">
    <div class="value-setter__container">
      <div class="title"><span v-text="$t('EDITOR.QUILLEDITOR.VALUE_SETTER.TITLE.EMBED')"></span></div>
      <div class="value">
        <TextareaInput
          :autoHeightActive="true"
          :placeholder="$t('EDITOR.QUILLEDITOR.VALUE_SETTER.TITLE.EMBED')"
          :value.sync="val"></TextareaInput>
      </div>
      <div class="actions">
        <div class="cancel btn" @click="cancel">
          <span v-text="$t('EDITOR.QUILLEDITOR.VALUE_SETTER.CANCEL')"></span>
        </div>      
        <div class="confirm btn" @click="confirm">
          <span v-text="$t('EDITOR.QUILLEDITOR.VALUE_SETTER.CONFIRM')"></span>
        </div>      
      </div>
    </div>
  </div>
</template>
<script>
  import TextareaInput from 'src/components/form/TextareaInput.vue'
  import { get, } from 'lodash'
  const debug = require('debug')('CLIENT:ValueSetter')
  const setUpValue = (store, { active, type, value }) => store.dispatch('SET_VALUE', { active, type, value })
  export default {
    name: 'ValueSetter',
    components: {
      TextareaInput,
    },
    computed: {
      active () {
        return get(this.$store, 'state.valueSetter.active')
      },
      type () {
        return get(this.$store, 'state.valueSetter.type')
      },
      value () {
        return get(this.$store, 'state.valueSetter.value')
      },
    },
    data () {
      return {
        val: '',
        isProcessing: false
      }
    },
    methods: {
      cancel () {
        setUpValue(this.$store, { active: false, type: '', value: '' })
      },
      confirm () {
        debug('this.isProcessing', this.isProcessing)
        if (this.isProcessing) { return }
        setUpValue(this.$store, { active: true, type: '', value: this.val })
        this.isProcessing = true
      },
    },
    mounted () {
      this.val = this.value
    },
    watch: {
      active () {
        if (!this.active) {
          this.isProcessing = false
          this.val = this.value
        }
      }
    },
  }
</script>
<style lang="stylus" scoped>
  .value-setter
    position fixed
    z-index 9999
    top 0
    left 0
    width 100vw
    height 100vh
    background-color rgba(0, 0, 0, 0.7)
    display flex
    justify-content center
    align-items center
    &__container
      width 500px
      padding 30px 30px 25px
      background-color #f1f1f1
      border-radius 4px
      .title
        font-size 1.5rem
        font-weight 600
      .value
        margin-top 20px
        min-height 50px
        max-height 50vh
        overflow auto
      .actions
        margin-top 30px
        text-align right
        .btn
          cursor pointer
          display inline-flex
          justify-content center
          align-items center
          height 36px
          background-color #0db9c9
          color #fff
          padding 0 20px
          border-radius 4px
          margin-left 20px
</style>