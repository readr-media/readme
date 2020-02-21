<template>
  <div class="filter-tools">
    <template v-for="item in filterItems">
      <div class="filter--item" :key="item.name">
        <div class="filter--item__title"><span v-text="$t(`${modelName}.${decamelize(get(item, 'name', '')).toUpperCase()}`)"></span></div>
        <div class="filter--item__value" :key="itemValKey">
          <ListFilterItem :type="item.type" :name="item.name" :value.sync="filters[ item.name ]"></ListFilterItem>
        </div>
      </div>
    </template>
    <div class="filter--actions">
      <div class="clear" ref="clear" @click="clear"><span v-text="$t('LIST.FILTER.CLEAR')"></span></div>
      <div class="confirm" ref="confirm" @click="confirm"><span v-text="$t('LIST.FILTER.CONFIRM')"></span></div>
    </div>
  </div>
</template>
<script>
  import ListFilterItem from './ListFilterItem.vue'
  import { filter, get, map } from 'lodash'
  import { decamelize, } from 'humps'

  export default {
    name: 'ListFilterTools',
    components: {
      ListFilterItem,
    },
    computed: {
      filterItems () {
        return this.$store.getters.filters || []
      },
      filledItems () {
        const filledItems = {}
        map(this.filters, (f, k) => {
          if (f) {
            filledItems[ k ] = f
          }
        })
        return filledItems
      }
    },
    data () {
      return {
        filters: {},
        itemValKey: Date.now().toString(),
        modelName: ''
      }
    },
    methods: {
      clear () {
        this.filters = {}
        console.log('update filters value')
        this.$emit('update:filtersVals', this.filledItems)
        console.log('close filter tools')
        this.$emit('close')
        this.itemValKey = Date.now().toString()
      },
      confirm () {
        console.log('update filters value')
        this.$emit('update:filtersVals', this.filledItems)
        console.log('close filter tools')
        this.$emit('close')
      },
      decamelize,
      get
    },
    beforeMount () {
      this.modelName = this.$store.getters.modelName
    },
    mounted () {
      this.$refs.clear.ondragstart = function () { return false }
      this.$refs.clear.onselectstart = function () { return false }   
      this.$refs.confirm.ondragstart = function () { return false }
      this.$refs.confirm.onselectstart = function () { return false }               
    },
    props: {
      filtersVals: {}
    },
    watch: {
      '$store.getters.structure': function (newVals, oldVals) {
        if (newVals !== oldVals) {
          this.modelName = this.$store.getters.modelName
        }
      },        
    }
  }
</script>
<style lang="stylus" scoped>
  .filter
    &-tools
      padding 10px 18px
      width 100%
    &--item
      min-height 34px
      display flex
      margin 10px 0
      &:first-child
        margin-top 0
      &__title
        width 60px
        font-size 0.875rem
        line-height normal
        color #000
        display flex
        justify-content flex-start
        align-items flex-start
        span
         min-height 34px
         display inline-flex
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