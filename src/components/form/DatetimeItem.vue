<template>
  <Datetime
    :class="{ warn: isWarningActive, grey: theme === 'grey' }"
    v-model="current"
    input-format="YYYY/MM/DD HH:mm"
    input-class="datepicker__input"
    type="datetime"></Datetime>
</template>
<script>
  import moment from 'moment'
  import { Datetime, } from 'vue-datetime'
  const debug = require('debug')('CLIENT:DatetimeItem')
  export default {
    name: 'DatetimeItem',
    components: {
      Datetime
    },
    data () {
      return {
        current: moment().toISOString(true),
        isWarningActive: false,
        init: undefined
      }
    },
    methods: {
      checkVal () {
        const ref = moment(this.dateRef)
        const curr = moment(this.current)
        const diff = curr.diff(ref) / (60 * 60 * 1000)
        debug('should refer to ref.', 'diff', diff)
        if (this.relativeToRef === 'after' && diff <= 0) {
          this.isWarningActive = true
        } else if (this.relativeToRef === 'before' && diff >= 0) {
          this.isWarningActive = true
        } else {
          this.isWarningActive = false
        }        
      }
    },
    mounted () {
      debug('this.init', this.init)
      debug('this.value', this.value)
      this.init = this.value
      this.current = this.value || this.current
    },
    props: {
      value: {},
      dateRef: {},
      relativeToRef: {},
      theme: {},
    },
    watch: {
      current () {
        debug('Mutation detected', this.current)
        this.checkVal()
        this.$emit('update:value', this.current)
      },
      dateRef () {
        if (this.dateRef) {
          debug('found ref')
          debug('this.init', this.init)
          debug('this.value', this.value)
          debug('this.current', this.current)
          debug('this.dateRef', this.dateRef)
          if (!this.init) {
            this.init = this.current
            if (this.relativeToRef === 'after') {
              this.current = moment(this.dateRef).add(1, 'h').toISOString(true)
            } else if (this.relativeToRef === 'before') {
              this.current = moment(this.dateRef).subtract(1, 'h').toISOString(true)
            }
          } else {
            this.checkVal()
          }
        }
      },
    },
  }
</script>
<style lang="stylus" scoped>
  >>> .datepicker__input
    cursor pointer
    background-size 20px 20px
    background-repeat no-repeat
    background-image url(/public/icons/icon-time.png)
    background-position 15px center
    background-color #fff
    padding-left 50px
    width 100%
    height 35px
    color #808080
    border none   
  &.grey
    >>> .datepicker__input
      background-color rgba(0,0,0,0.05)
</style>