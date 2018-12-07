<template>
  <div class="buttonized-item--wrapper" v-if="options.length">
    <template v-if="status !== 'PUBLISHED' && status !== 'SCHEDULING'">
      <div class="buttonized-item btn schedule" tabIndex="0"
        :class="{ block: isProcessing }">
        <span v-text="$t(`EDITOR.BUTTONIZED_BUTTON.SCHEDULE`)"></span>
        <Spinner class="spinner" :show="isProcessing"></Spinner>
      </div>    
      <div class="buttonized-item--schedule-picker" tabIndex="0">
        <div class="picker">
          <DatetimeItem theme="grey" :value.sync="scheduleDate" v-if="scheduleDate || status === 'DRAFT'"></DatetimeItem>
        </div>
        <div class="confirm" @click="handlerSchedule">
          <span v-text="$t('EDITOR.BUTTONIZED_BUTTON.SCHEDULE_CONFIRM')"></span>
        </div>  
      </div>
    </template>
    <div class="buttonized-item btn"  v-if="options.length"
      :class="{ block: isProcessing }" @click="handler">
      <span v-text="$t(`EDITOR.BUTTONIZED_BUTTON.${wording}`)"></span>
      <Spinner class="spinner" :show="isProcessing"></Spinner>
    </div>
  </div>
</template>
<script>
  import DatetimeItem from 'src/components/form/DatetimeItem.vue'
  import Spinner from 'src/components/Spinner.vue'
  import moment from 'moment'
  import { find, get, } from 'lodash'
  const debug = require('debug')('CLIENT:ButtunizedItem')
  export default {
    name: 'ButtunizedItem',
    components: {
      DatetimeItem,
      Spinner
    },
    computed: {
      status () {
        const current = find(this.options, opt => opt.value === this.value)
        return get(current, 'name', 'DRAFT')
      },
      options () {
        return get(this.item, 'options')
      },
      wording () {
        switch (this.status) {
          case 'UNPUBLISHED': {}
          case 'DRAFT': {
            return 'PUBLISH'
          }
          case 'SCHEDULING': {
            return 'UNSCHEDULE'
          }
          case 'PUBLISHED': {
            return 'UNPUBLISH'
          }
          default: {
            return this.status
          }
        }
      }
    },
    data () {
      return {
        scheduleDate: '',
      }
    },
    methods: {
      handler () {
        if (this.isProcessing) { return }
        let valSet
        switch (this.wording) {
          case 'PUBLISH': {
            valSet = find(this.options, opt => opt.name === 'PUBLISHED')
            break
          }
          case 'UNPUBLISH': {
            valSet = find(this.options, opt => opt.name === 'UNPUBLISHED')
            break
          }
        }        
        debug('go update value', valSet, get(valSet, 'value', 0))
        if (get(valSet, 'value', 0) === 2) {
          this.$emit('update:publishDate', moment().toISOString(true))
        }
        this.$emit('update:value', get(valSet, 'value', 0))
        this.clickHandler()
      },
      handlerSchedule () {
        debug('do schedule!')
        this.$emit('update:publishDate', this.scheduleDate)
        this.$emit('update:value', 3)
        this.clickHandler()
      },
    },
    mounted () {
      this.scheduleDate = this.publishDate
      debug('MOUNTED', this.publishDate)
    },
    props: {
      clickHandler: {
        type: Function,
        default: () => {}
      },
      isProcessing: {
        type: Boolean,
        defualt: false,
      },
      item: {
        type: Object,
      },
      value: {},
      publishDate: {},
    },
    watch: {
      publishDate () {
        debug('Mutation detected: publishDate', this.publishDate)
        this.scheduleDate = this.publishDate
      }
    },
  }
</script>
<style lang="stylus" scoped>
.buttonized-item
  &--wrapper
    position relative
  &--schedule-picker
    position absolute
    bottom 100%
    right 50%
    width 100%
    max-width 400px
    background-color rgba(255,255,255,0.7)
    box-shadow 5px 5px 15px #f1f1f1
    border-radius 2px
    padding 20px
    margin-bottom 10px
    display none
    justify-content center
    outline none
    &:hover, &:focus
      display flex
    .picker
      display inline-block
    .confirm
      display inline-flex
      color #fff
      background-color #0db9c9
      box-shadow 0px 0px 5px rgba(100,100,100,0.5)
      border-radius 2px
      margin-left 10px
      height 35px
      font-size 1.25rem
      justify-content center
      align-items center
      cursor pointer
      padding 0 15px
  &.schedule
    outline none
    &:focus ~ .buttonized-item--schedule-picker
      display flex
</style>
