<template>
  <div class="list">
    <div class="list__header">
      <div class="list__title"><span v-text="listName"></span></div>
      <div class="list__wrapper right">
        <div class="list__toolbox">
          <div class="btn create" @click="create"><span v-text="$t('LIST.ADD')"></span></div>
        </div>
        <div class="list__search" :class="{ focused: isSearchFocused }" tabindex="0" @click="focusSearch" @focusout="focusSearchOut">
          <TextInput
            :backgroundColor="isSearchFocused ? '#fff' : '#a3a3a3'"
            :placeHolder="$t('LIST.SEARCH')"
            :value.sync="filter"></TextInput>
          <div class="btn" @click="search">
            <span v-text="$t('LIST.SEARCH_APPLIED')" class="applied" v-if="isFilterApplied"></span>
            <span v-text="$t('LIST.SEARCH_APPLY')" class="apply" v-else></span>
          </div>
        </div>
      </div>
    </div>
    <ListContainer class="list__container" :flag="listName" :refresh="refresh" :refreshItemsCount="refreshItemsCount">
      <template slot="new-item" slot-scope="props">
        <Editor type="create"
          :is="props.Editor"
          :isActive.sync="isNewItemEditorActive"
          :structure="props.structure"
          :add="props.add"></Editor>
      </template>
    </ListContainer>
  </div>
</template>
<script>
  import ListContainer from 'src/components/list/ListContainer.vue'
  import TextInput from 'src/components/new-form/TextInput.vue'
  import { DEFAULT_LIST_MAXRESULT, } from 'src/constants'
  import { get, } from 'lodash'

  const DEFAULT_MAXRESULT = DEFAULT_LIST_MAXRESULT
  const DEFAULT_PAGE = 1
  const DEFAULT_SORT = '-updated_at'

  const debug = require('debug')('CLIENT:List')
  const fetchItemsCount = (store, params, flag) => store.dispatch('GET_ITEMS_COUNT', { params, flag, })
  const fetchList = (store, params, flag) => store.dispatch('FETCH_LIST', {
    params: Object.assign({
      maxResult: DEFAULT_MAXRESULT,
      page: DEFAULT_PAGE,
      sort: DEFAULT_SORT,
    }, params),
    flag,
  })

  export default {
    name: 'List',
    components: {
      ListContainer,
      TextInput,
    },
    computed: {
      listName () {
        return get(this.$route, 'params.item')
      },
    },
    data () {
      return {
        filter: '',
        filterSearched: '',
        isFilterApplied: false,
        isNewItemEditorActive: false,
        isSearchFocused: false,
        page: DEFAULT_PAGE,
      }
    },
    methods: {
      create () {
        this.isNewItemEditorActive = true
      },
      focusSearch () {
        this.isSearchFocused = true
      },
      focusSearchOut () {
        this.isSearchFocused = false
      },
      // isFilterApplied () {
      //   return this.filterSearched === this.filter && this.filter !== ''
      // },
      refresh ({ params = {}, }) {
        // this.page = params.page || this.page
        this.filterSearched && (params.keyword = this.filterSearched)
        fetchList(this.$store, params, this.listName)
      },
      refreshItemsCount ({ params = {}, }) {
        fetchItemsCount(this.$store, params, this.listName)
      },
      search () {
        this.filterSearched = this.filter
        this.isFilterApplied = true
        Promise.all([
          this.refresh({
            params: {
              keyword: this.filterSearched || '',
            }
          }),
          this.refreshItemsCount({
            params: {
              keyword: this.filterSearched || '',
            }
          })
        ])
      },
    },
    beforeMount () {
      Promise.all([
        fetchList(this.$store, {}, this.listName),
        fetchItemsCount(this.$store, {}, this.listName)
      ])
    },
    watch: {
      listName () {
        Promise.all([
          fetchList(this.$store, {}, this.listName),
          fetchItemsCount(this.$store, {}, this.listName)
        ])
      },
      filter () {
        debug('Mutation detected: filter', this.filter)
        this.isFilterApplied = this.filterSearched === this.filter
      },
    },
  }
</script>
<style lang="stylus" scoped>
  .list
    background-color #404040
    padding 10px 60px 40px 10px
    // position relative
    &__header
      height 40px
      margin-bottom 10px
      display flex
      justify-content space-between
    &__title
      // position absolute
      // top 10px
      // left 10px
      min-width 300px
      height 100%
      font-size 1.375rem
      color rgba(250,250,250,0.9)
      background-color rgba(138,138,138,0.5)
      border-radius 2px
      padding 0 20px
      display flex
      justify-content center
      align-items center
    &__search, &__toolbox
      display flex
      align-items flex-end
    &__search
      background-color #a3a3a3
      height 30px
      margin-top 10px
      outline none
      &.focused
        background-color #fff
        .btn
          span
            color #fff
      .btn
        display flex
        justify-content center
        align-items center
        padding 2px
        height 100%
        span
          cursor pointer
          box-shadow 0 0 5px rgba(0,0,0,0.5)
          color #d3d3d3
          display flex
          justify-content center
          align-items center
          width 100%
          height 100%
          padding 0 7px
          border-radius 3px
          font-size 0.8125rem
          &.applied
            background-color #909090
          &.apply
            background-color #d40505
            &:hover
              background-color #ff2f2f
              color #fff

    &__toolbox
      .btn
        cursor pointer
        padding 5px
        display flex
        justify-content center
        align-items center
        margin 0 10px
        border-radius 2px
        background-color #d3d3d3
        border 1px solid #d3d3d3
        &.create
          background-color green
          border 1px solid green
          color #d3d3d3
          &:hover
            background-color #13a213
            border 1px solid #13a213
            box-shadow 0 0 5px rgba(250,250,250, 0.7)
    &__wrapper
      display flex
</style>