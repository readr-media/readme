<template>
  <div class="list">
    <div class="list__header" v-if="type !== 'wrapper'">
      <div class="list__wrapper left">
        <div class="list__search" :class="{ focused: isSearchFocused }" tabindex="0" @click="focusSearch" @focusout="focusSearchOut">
          <TextInput
            width="400px"
            :backgroundColor="isSearchFocused ? '#efefef' : '#eeeeee'"
            :placeHolder="$t('LIST.SEARCH')"
            :value.sync="filter"></TextInput>
          <div class="btn">
            <span v-text="$t('LIST.SEARCH_APPLIED')" class="applied" v-if="isFilterApplied"></span>
            <span v-text="$t('LIST.SEARCH_APPLY')" class="apply" v-else @click="search"></span>
          </div>
        </div>
        <!--FilterGroup class="list__filter" :filterChecks="filterChecks" :model="model" :value.sync="filterChecksCurrent"></FilterGroup-->
      </div>
      <div class="list__wrapper right">
        <div class="list__toolbox">
          <div class="btn create" @click="create"><span v-text="$t('LIST.ADD')"></span></div>
        </div>
      </div>
    </div>
    <ListContainer class="list__container" :flag="model" :refresh="refresh" :refreshItemsCount="refreshItemsCount" v-if="type !== 'wrapper'">
      <template slot="new-item" slot-scope="props">
        <Editor type="create"
          :is="props.Editor"
          :isActive.sync="isNewItemEditorActive"
          :structure="props.structure"
          :add="props.add"></Editor>
      </template>
      <div slot="spinner" style="text-align: center; height: 30px;" v-show="isSpinnerActive"><Spinner :show="true"></Spinner></div>
    </ListContainer>
    <WrapperContainer v-else :items="sub"></WrapperContainer>
  </div>
</template>
<script>
  import FilterGroup from 'src/components/list/FilterGroup.vue'
  import ListContainer from 'src/components/list/ListContainer.vue'
  import Spinner from 'src/components/Spinner.vue'
  import TextInput from 'src/components/new-form/TextInput.vue'
  import WrapperContainer from 'src/components/wrapper/WrapperContainer.vue'
  import { DEFAULT_LIST_MAXRESULT, } from 'src/constants'
  import { find, get, map, } from 'lodash'
  import { items as NAV_ITEMS, } from 'src/configuration/navigationAside'

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
      FilterGroup,
      ListContainer,
      Spinner,
      TextInput,
      WrapperContainer,
    },
    computed: {
      isSubItem () {
        return get(this.$route, 'params.subItem', '').replace(/-/g, '_')
      },
      filterChecks () {
        return this.modelData ? this.modelData.filter || [] : []
      },
      model () {
        return (get(this.$route, 'params.subItem', '') || get(this.$route, 'params.item')).replace(/-/g, '_')
      },
      modelRaw () {
        return get(this.$route, 'params.subItem', '') || get(this.$route, 'params.item')
      },
      modelData () {
        let model
        try {
          model = require(`src/model/${this.model.toUpperCase()}`)
        } catch (error) {
          console.log(`There's no model found:`, this.model.toUpperCase())
        }
        return model
      },
      maxResult () {
        return this.modelData ? this.modelData.LIST_MAXRESULT || DEFAULT_LIST_MAXRESULT : DEFAULT_LIST_MAXRESULT
      },
      sub () {
        return get(find(NAV_ITEMS, { name: this.modelRaw, }), 'sub', [])
      },
      type () {
        return this.isSubItem ? 'list' : get(find(NAV_ITEMS, { name: this.modelRaw, }), 'type', 'list')
      },
    },
    data () {
      return {
        filter: '',
        filterSearched: '',
        filterChecksCurrent: {},
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
        map(this.filterChecksCurrent, (filter, key) => {
          if (filter) { params[ key ] = true }
        })
        debug('params.maxResult', params.maxResult)
        debug('this.model', this.modelRaw)
        fetchList(this.$store, params, this.modelRaw).then(() => {
          this.isSpinnerActive = false
        })
      },
      refreshItemsCount ({ params = {}, }) {
        this.filterSearched && (params.keyword = this.filterSearched)
        map(this.filterChecksCurrent, (filter, key) => {
          if (filter) { params[ key ] = true }
        })        
        fetchItemsCount(this.$store, params, this.modelRaw)
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
      filterChecksCurrent () {
        debug('Mutation detected: filterChecksCurrent', this.filterChecksCurrent)
        Promise.all([
          this.refresh({}),
          this.refreshItemsCount({})
        ])
      },
    },
  }
</script>
<style lang="stylus" scoped>
  .list
    // background-color #404040
    padding 10px 60px 40px 10px
    // position relative
    &__header
      height 40px
      margin-bottom 10px
      display flex
      justify-content space-between
    &__search, &__toolbox, &__filter
      display flex
      align-items flex-end
    &__filter
      background-color #a3a3a3
      margin-top 10px
      margin-right 10px
      border-radius 2px
      height 30px
      outline none
      padding 0 10px
    &__search
      background-color #eee
      height 30px
      margin-top 10px
      outline none
      border-radius 2px
      &.focused
        background-color #efefef
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
        display flex
        justify-content center
        align-items center
        margin 0 10px
        background-color #d3d3d3
        border 1px solid #d3d3d3
        
        font-size 1rem
        padding 5px 20px
        border-radius 4px
        &.create
          background-color #000
          border 1px solid #000
          color #fff
          &:hover
            background-color #505050
            border 1px solid #505050
            box-shadow 0 0 5px rgba(250,250,250, 0.7)
    &__wrapper
      display flex
</style>