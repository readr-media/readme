<template>
  <div class="list-search">
    <input class="list-search__input" type="text" ref="searchInput"
      :placeholder="$t('LIST.SEARCH')"
      v-model="currentSearchVal"
      @keyup="setCurrVal"
      @change="checkIsChanged">
    <div class="list-search__filter" ref="filterBox"></div>
  </div>
</template>
<script>
  export default {
    name: 'ListFilter',
    data () {
      return {
        currentSearchVal: '',
      }
    },
    methods: {
      checkIsChanged () {},
      setCurrVal () {},
    },
    mounted () {
      this.$refs.filterBox.ondragstart = function () { return false }
      this.$refs.filterBox.onselectstart = function () { return false }   
    },
    props: {
      value: {
        type: String,
      },
    },
    watch: {
      currentSearchVal () {
        this.$emit('update:value', this.currentSearchVal)
      },
    },
  }
</script>
<style lang="stylus" scoped>
  .list-search
    border-radius 2px
    display flex
    justify-content center
    align-items center
    height 36px
    width 100%    
    background-color #f7f7f7
    padding 10px 55px 10px 45px
    position relative
    background-image url(/public/icons/icon-search.png)
    background-position 15px 8px
    background-size 20px 20px
    background-repeat no-repeat
    border-radius 4px
    overflow hidden

    &__input
      outline none
      width 100%
      height 16px
      border none
      background-color #f7f7f7
      font-size 1rem
      font-weight 100
      color #000

      font-size 0.875rem
      font-weight normal
      font-style normal
      font-stretch normal
      line-height normal
      letter-spacing normal

      &::-webkit-input-placeholder
        color #a0a0a0
        font-weight 100
    &__filter
      position absolute
      right 0
      top 0
      height 100%
      width 42px
      background-image url(/public/icons/icon_filter_normal.png)
      background-position center center
      background-repeat no-repeat
      background-size contain
      cursor pointer
      &.active
        background-image url(/public/icons/icon_filter_clicked.png)
</style>