<template>
  <div class="list">
    <div class="list__header">
      <div class="list__title"><span v-text="model"></span></div>
      <div class="list__wrapper right">
        <div class="list__toolbox">
          <div class="btn create" @click="create"><span v-text="$t('LIST.ADD')"></span></div>
        </div>
        <div class="list__search" :class="{ focused: isSearchFocused }" tabindex="0" @click="focusSearch" @focusout="focusSearchOut">
          <TextInput
            :backgroundColor="isSearchFocused ? '#fff' : '#a3a3a3'"
            :placeHolder="$t('LIST.SEARCH')"
            :value.sync="filter"></TextInput>
          <div class="btn">
            <span v-text="$t('LIST.SEARCH_APPLIED')" class="applied" v-if="isFilterApplied"></span>
            <span v-text="$t('LIST.SEARCH_APPLY')" class="apply" v-else @click="search"></span>
          </div>
        </div>
      </div>
    </div>
    <ListContainer class="list__container" :flag="model" :refresh="refresh" :refreshItemsCount="refreshItemsCount">
      <template slot="new-item" slot-scope="props">
        <Editor type="create"
          :is="props.Editor"
          :isActive.sync="isNewItemEditorActive"
          :structure="props.structure"
          :add="props.add"></Editor>
      </template>
      <div slot="spinner" style="text-align: center; height: 30px;" v-show="isSpinnerActive"><Spinner :show="true"></Spinner></div>
    </ListContainer>
  </div>
</template>
<script>
  import ListContainer from 'src/components/list/ListContainer.vue'
  import Spinner from 'src/components/Spinner.vue'
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
      memberId: get(store, 'state.profile.id'),
      page: DEFAULT_PAGE,
      sort: DEFAULT_SORT,
      fields: [ 'nickname', 'id' ],
    }, params),
    flag,
  })

  export default {
    name: 'List',
    components: {
      ListContainer,
      Spinner,
      TextInput,
    },
    computed: {
      model () {
        return get(this.$route, 'params.item')
      },
      maxResult () {
        return require(`src/model/${this.model.toUpperCase()}`).LIST_MAXRESULT || DEFAULT_LIST_MAXRESULT
      }
    },
    data () {
      return {
        filter: '',
        filterSearched: '',
        isFilterApplied: false,
        isNewItemEditorActive: false,
        isSearchFocused: false,
        isSpinnerActive: false,
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
      refresh ({ params = {}, }) {
        this.filterSearched && (params.keyword = this.filterSearched)
        this.page = params.page || this.page
        if (params.page) {
          this.page = params.page
        } else {
          params.page = this.page
        }
        params.maxResult = this.maxResult
        debug('params.maxResult', params.maxResult)
        fetchList(this.$store, params, this.model).then(() => {
          this.isSpinnerActive = false
        })
      },
      refreshItemsCount ({ params = {}, }) {
        fetchItemsCount(this.$store, params, this.model)
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
        this.refresh({}),
        this.refreshItemsCount({})
      ])
    },
    watch: {
      model () {
        this.isSpinnerActive = true
        Promise.all([
          this.refresh({}),
          this.refreshItemsCount({})
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
            cursor pointer
            background-color #909090
          &.apply
            background-color #a80606
            &:hover
              background-color #d40505
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