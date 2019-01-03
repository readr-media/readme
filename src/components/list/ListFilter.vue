<template>
  <div class="list-search">
    <input class="list-search__input" type="text" ref="searchInput"
      :placeholder="$t('LIST.SEARCH')"
      v-model="currentSearchVal"
      @keyup="setCurrVal"
      @change="checkIsChanged">
    <div class="list-search__filter filter-button" ref="filterBox"
      :class="{ active: isFilterHovered }" tabindex="0"
      @focusin="isFilterHovered = true"
      @focusout="isFilterHovered = false">
      <div class="list-search__filter__hint hint"><span v-text="$t('LIST.SEARCH_HINT')"></span></div>
    </div>
    <div class="list-search__filter--toolbox filter-toolbox"
      @focusin="isFilterHovered = true" tabindex="0"
      @focusout="isFilterHovered = false">
      <ListFilterTools></ListFilterTools>
    </div>
  </div>
</template>
<script>
  import ListFilterTools from './ListFilterTools.vue'
  export default {
    name: 'ListFilter',
    components: {
      ListFilterTools,
    },
    data () {
      return {
        currentSearchVal: '',
        isFilterHovered: false,
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
    border-radius 4px
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
      line-height normal

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
      border-radius 0 5px 5px 0
      outline none
      &:not(.active)
        animation fade-out 0.5s
      &.active
        background-image url(/public/icons/icon_filter_clicked.png)
        & ~ .filter-toolbox
          display flex
      &:hover
        .hint
          display flex
      &--toolbox
        position absolute
        top 100%
        left 0
        margin-top 5px
        width 100%
        min-height 100px
        background-color #eeeeee
        border-radius 4px
        z-index 9999
        display none
        outline none
      &__hint
        font-size 0.875rem
        line-height normal
        position absolute
        top 100%
        left 50%
        margin-top 15px
        margin-left -60px
        width 120px
        min-height 32px
        padding 5px 10px
        background-color rgba(0,0,0,0.8)
        color #fff
        font-size 0.875rem
        line-height normal
        justify-content center
        align-items center
        border-radius 4px
        display none
        z-index 10000
        &::before
          content ''
          position absolute
          top -11px
          left 50%
          margin-left -4px
          border-width 0 4px 11px 4px
          border-color transparent transparent rgba(0,0,0,0.8) transparent
          border-style solid
  
  @keyframes fade-out
    0%
      opacity 0
    100%
      opacity 1

</style>