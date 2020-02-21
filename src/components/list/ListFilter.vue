<template>
  <div class="list-search"
    :class="{ 'with-filter': isFilterSetupped, 'disabled': !$store.getters.isSearchable }"
    :style="{ backgroundColor: bgcolor, }"
  >
    <!-- <input class="list-search__input" type="text" ref="searchInput"
      v-model="currentSearchVal"
      :placeholder="searchInputPlaceholder"
      :style="{ backgroundColor: bgcolor, }"
      @focusin="toggleFilterVisible(true)"
      @focusout="toggleFilterVisible(false)"
      @keyup="setCurrVal"
      @change="checkIsChanged"
    > -->
    <input class="list-search__input" type="text" ref="searchInput"
      v-model="currentSearchVal"
      :placeholder="searchInputPlaceholder"
      :style="{ backgroundColor: bgcolor }"
      @keyup="setCurrVal"
    >
    <!-- <input class="list-search__input" type="text" disabled
      :placeholder="searchInputPlaceholder"
      :style="{ backgroundColor: bgcolor, }"
    > -->
    <template v-if="isFilterSetupped">
      <div class="list-search__filter__wrapper" ref="filterWrapper"
        :class="{ active: isFilterToolbox }"
        @click.stop
      >
        <div class="list-search__filter__toolbox filter-toolbox">
          <ListFilterTools :filtersVals.sync="filters" @close="turnOffFilterBox" ref="filterTools" />
        </div>
        <div class="list-search__filter__button filter-button" ref="filterButton"
          :class="{ working: isFilterWorking }"
          @click.stop="toggleFilterToolbox"
        >
          <div class="list-search__filter__hint hint">
            <span v-text="$t('LIST.SEARCH_HINT')" />
          </div>
        </div>
      </div>
    </template>
  </div>
</template>

<script>
  import ListFilterTools from './ListFilterTools.vue'
  import { filter, find, get, map, debounce } from 'lodash'
  import { isDescendant } from 'src/util/comm'

  export default {
    name: 'ListFilter',
    components: {
      ListFilterTools,
    },
    computed: {
      isFilterSetupped () {
        return get(this.$store, 'getters.filters.length', 0) > 0
      },
      isFilterWorking () {
        return map(this.filters, f => f).length > 0
      },
      model () {
        return get(this.$route, 'params.item', 'post')
      },
      searchInputPlaceholder () {
        // return this.filtersStr || `${this.$t('LIST.SEARCH')}⋯`
        // return this.filtersStr || `${this.$t('LIST.SEARCH')}${this.model === 'member' ? '暱稱' : '標題'}關鍵字⋯`
        return this.isFilterToolbox ? '' : `${this.$t('LIST.SEARCH')}${this.model === 'member' ? '暱稱' : '標題'}關鍵字⋯`
      }
    },
    data () {
      return {
        currentSearchVal: '',
        filters: {},
        // filtersStr: '',
        // isFilterHovered: false,
        isFilterToolbox: false
      }
    },
    methods: {
      // checkIsChanged () {
      //   this.$emit('update:value', this.currentSearchVal)
      // },
      // focusOnFilterWrapper (e) {
      //   const isDesc = isDescendant(e.target, { parant: this.$refs[ 'filterWrapper' ] })
      //   isDesc && !this.isFilterToolbox && this.$refs[ 'filterWrapper' ].focus()
      // },
      setCurrVal () { 
        debounce(() => {
          this.$emit('update:value', this.currentSearchVal)
          this.$refs.filterTools.itemValKey = Date.now().toString()
        }, 600)()
      },
      // toggleFilterVisible (flag) {
      //   if (flag) {
      //     this.filtersStr = ''
      //   } else {
      //     this.filtersStr = map(this.filters, (value) => value).join(', ')
      //   }
      // },
      turnOffFilterBox () {
        // this.isFilterHovered = false
        this.isFilterToolbox = false
      },
      toggleFilterToolbox () {
        if (this.currentSearchVal) {
          this.currentSearchVal = ''
          this.$emit('update:value', this.currentSearchVal)
        }
        this.isFilterToolbox = !this.isFilterToolbox
      },
      handleClickOutsideSearch () {
        this.isFilterToolbox = false
      }
    },
    mounted () {
      if (this.$refs.filterButton) {
        this.$refs.filterButton.ondragstart = function () { return false }
        this.$refs.filterButton.onselectstart = function () { return false } 
      }
      this.currentSearchVal = this.value
      window.addEventListener('click', this.handleClickOutsideSearch)
    },
    props: {
      value: {
        type: String,
      },
      bgcolor: {},
      // filters: {}
      filtersVals: {}
    },
    watch: {
      // currentSearchVal () {
      //   this.$emit('update:value', this.currentSearchVal)
      // },
      filters: {
        handler (filtersVals) {
          // this.filtersStr = map(filter(filtersVals, (val, key) =>
          //   find(this.$store.getters.filters, { name: key }).type !== 'Datetime'),
          // (val) => val).join(', ')
          this.$emit('update:filtersVals', filtersVals)
          // this.$emit('update', this.filters)
        },
        deep: true
      }
    }
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
    padding 10px 10px 10px 45px
    position relative
    background-image url(/public/icons/icon-search.png)
    background-position 15px 8px
    background-size 20px 20px
    background-repeat no-repeat
    // outline none
    &.disabled
      display none
    &.with-filter
      padding-right 55px
    &__input
      outline none
      width 100%
      height 1.5rem
      border none
      background-color #f7f7f7
      // font-weight 100
      color #000

      font-size 0.9375rem
      line-height normal

      &::-webkit-input-placeholder
        color #a0a0a0
        // font-weight normal
        font-size 0.875rem
        vertical-align top
      // &:disabled
      //   cursor pointer
    &__filter
      &__wrapper
        position absolute
        right 0
        top 100%
        height 100%
        width 100%
        z-index 9999
        // outline none
        // cursor default
        &:not(.active)
          .filter-button 
            animation fade-out 0.5s
        &.active
          .filter-toolbox
            display flex  
          .filter-button 
            background-image url(/public/icons/icon_filter_clicked.png)       
      &__button
        position absolute
        right 0
        top -100%
        height 100%
        width 42px

        background-image url(/public/icons/icon_filter_normal.png)
        background-position center center
        background-repeat no-repeat
        background-size contain
        border-radius 0 5px 5px 0
        cursor pointer
        &.working
          background-image url(/public/icons/icon_filter_clicked.png)
      
        &:hover
          .hint
            display flex          
      &__toolbox
        position absolute
        top 5px
        right 0
        width 100%
        min-height 100px
        background-color #eeeeee
        border-radius 4px
        z-index 9999
        display none

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