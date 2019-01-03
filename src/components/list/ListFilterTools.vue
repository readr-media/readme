<template>
  <div class="filter-tools">
    <template v-for="item in FILTERS">
      <div class="filter--item">
        <div class="filter--item__title"><span v-text="$t(`LIST.FILTER.${item.name}`)"></span></div>
        <div class="filter--item__value">
          <ListFilterItems :type="item.type" :name="item.name"></ListFilterItems>
        </div>
      </div>
    </template>
    <div class="filter--actions">
      <div class="clear" ref="clear"><span v-text="$t('LIST.FILTER.CLEAR')"></span></div>
      <div class="confirm" ref="confirm"><span v-text="$t('LIST.FILTER.CONFIRM')"></span></div>
    </div>
  </div>
</template>
<script>
  import ListFilterItems from './ListFilterItems.vue'
  const FILTERS = [
    { name: 'TITLE', type: 'TextInput' },
    { name: 'CONTENT', type: 'TextInput' },
    { name: 'AUTHOR', type: 'TextInput' },
    { name: 'TAG', type: 'TextInput' },
    { name: 'ID', type: 'TextInput' },
    { name: 'SLUG', type: 'TextInput' },
    { name: 'TIME', type: 'Datetime' },
    { name: 'PEROID', type: 'Datetime' },
    { name: 'DATE', type: 'Datetime' },
  ]
  export default {
    name: 'ListFilterTools',
    components: {
      ListFilterItems,
    },
    data () {
      return {
        FILTERS,
      }
    },
    methods: {},
    mounted () {
      this.$refs.clear.ondragstart = function () { return false }
      this.$refs.clear.onselectstart = function () { return false }   
      this.$refs.confirm.ondragstart = function () { return false }
      this.$refs.confirm.onselectstart = function () { return false }               
    },
  }
</script>
<style lang="stylus" scoped>
  .filter
    &-tools
      padding 10px 18px
      width 100%
    &--item
      height 34px
      display flex
      margin 10px 0
      &:first-child
        margin-top 0
      &__title
        width 30px
        font-size 0.875rem
        line-height normal
        color #000
        display flex
        justify-content flex-start
        align-items center
      &__value
        flex 1  
        background-color #fff
        border-radius 4px
        margin-left 14px
    &--actions
      height 34px
      text-align right
      > div
        display inline-flex
        justify-content center
        align-items center
        width 140px
        height 100%
        border-radius 4px
        cursor pointer
        margin-left 10px
      .confirm
        background-color #f98866
        color #fff
      .clear
        color #000
        &:hover
          background-color #f7f7f7
</style>