<template>
  <div class="list-filter-datetime">
    <div class="list-filter-datetime__wrapper">
      <div class="list-filter-datetime__type">
        <select v-model="type">
          <option v-for="(t, k) in TYPE" v-text="$t(`LIST.FILTER.DATETIME_TYPE.${k}`)" :value="t"></option>
        </select>
      </div>
      <DatetimeItem class="list-filter-datetime__value"
        datetimeType="date"
        :heightFit="true"
        :value.sync="dateVal1"></DatetimeItem>    
    </div>  
    <div class="list-filter-datetime__wrapper" v-if="type === TYPE.PERIOD">
      <div class="list-filter-datetime__type"></div>
      <DatetimeItem class="list-filter-datetime__value"
        datetimeType="date"  
        relativeToRef="after"
        :dateRef="dateVal1"
        :heightFit="true"
        :value.sync="dateVal2"></DatetimeItem>    
    </div>    
  </div>
</template>
<script>
  import DatetimeItem from 'src/components/form/DatetimeItem.vue'
  import moment from 'moment'
  const TYPE = {
    NONE: 0,
    AFTER: 1,
    BEFORE: 2,
    PERIOD: 3,
  }
  export default {
    name: 'ListFilterItemDatetime',
    components: {
      DatetimeItem,
    },
    data () {
      return {
        TYPE,
        dateVal1: '',
        dateVal2: '',
        type: 0
      }
    },
    methods: {
      emitValue () {
        switch (this.type) {
          case TYPE.NONE:
            this.$emit('update:value', null)
            break
          case TYPE.AFTER:
            this.$emit('update:value', [ this.dateVal1, null ])
            break
          case TYPE.BEFORE:
            this.$emit('update:value', [ null, this.dateVal2 ])
            break
          case TYPE.PERIOD:
            this.$emit('update:value', [ this.dateVal1, this.dateVal2 ])
            break
        }
      },
    },
    mounted () {},
    watch: {
      dateVal1 () { this.emitValue() },
      dateVal2 () { this.emitValue() },
      type () {
        if (this.type === TYPE.PERIOD) {
          this.dateVal2 = moment(this.dateVal1).add(1, 'd').toISOString(true)
        }
        this.emitValue()
      }
    }
  }
</script>
<style lang="stylus" scoped>
  .list-filter-datetime
    padding 0 5px
    &__wrapper
      height 34px
      display flex
    &__type
      width 60px
      height 100%
      select
        width 100%
        border none
        outline none
        height 100%

        font-weight 300
        font-size 0.875rem
        background-color #fff
        // appearance none
    &__value
      flex 1
      height 100%
</style>