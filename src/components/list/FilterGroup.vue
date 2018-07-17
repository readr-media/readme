<template>
  <div class="filter">
    <div class="filter__item" v-for="f in filterChecks">
      <input type="checkbox" :id="`checkbox-${f}`" :checked="filterVals[ f ]">
      <label class="checkmark" :class="{ checked: filterVals[ f ], }" @click="check(f)"></label>
      <label class="label" v-text="$t(`${model.toUpperCase()}.${f.toUpperCase()}`)" @click="check(f)"></label>
    </div>
  </div>
</template>
<script>
  const debug = require('debug')('CLIENT:FilterGroup')
  export default {
    name: 'FilterGroup',
    data () {
      return {
        filterVals: {},
      }
    },
    methods: {
      check (item) {
        debug('Go check!', item)
        const newVal = Object.assign({}, this.filterVals)
        newVal[ item ] = newVal[ item ] ? false : true
        this.filterVals = Object.assign({}, this.filterVals, newVal)
      },
    },
    mounted () {},
    props: {
      filterChecks: Array,
      model: String,
      value: Object,
    },
    watch: {
      filterVals: {
        handler () {
          debug('Mutation detected: filterVals', this.filterVals)
          this.$emit('update:value', this.filterVals)
        },
        deep: true,
      },
    },
  }
</script>
<style lang="stylus" scoped>
  .filter
    &__item
      display flex
      justify-content center
      align-items center
      height 100%
      font-size 1.0625rem
      color #404040
      input
        position absolute
        opacity 0
        cursor pointer
        z-index 0
      .checkmark
        height 20px
        width 20px
        background-color transparent
        border 1px solid #808080
        position relative
        cursor pointer
        z-index 1
        &:after
          content ""
          position absolute
          display none
          left 5px
          top 2px
          width 8px
          height 12px
          border solid white
          border-width 0 3px 3px 0
          transform rotate(45deg)
        &.checked
          background-color #808080
          &:after
            display block
      .label
        margin-left 5px
        cursor pointer
</style>