<template>
  <div class="list">
    <template v-if="type !== 'wrapper'">
      <div class="list__header">
        <template v-if="!isEditorActive">
          <div class="list__wrapper left">
            <div class="list__name"><span v-text="title"></span></div>
          </div>
          <div class="list__wrapper right">
            <div class="list__search" v-if="isFilterActive">
              <ListFilter :value.sync="searchVal" :filters.sync="filters" :key="key"></ListFilter>
            </div>
            <div class="list__toolbox">
              <div class="btn back" @click="back" v-if="isSubItem"><span v-text="$t('LIST.BACK')"></span></div>
              <div class="btn create" @click="create"><span v-text="`＋　${$t(`${$store.getters.modelName}.NEW`)}`"></span></div>
            </div>
          </div>
        </template>
        <template v-else>
          <div class="list__wrapper left">
            <div class="list__name"><span v-text="title"></span></div>
          </div>
          <div class="list__wrapper right">
            <div class="list__toolbox">
              <div class="btn back" @click="back"><span v-text="$t('LIST.BACK')"></span></div>
            </div>
          </div>
        </template>
      </div>      
      <ListContainer class="list__container"
        :flag="model"
        :backToParent="backToParent"
        :refresh="refresh"
        :refreshItemsCount="refreshItemsCount">
        <div slot="spinner" style="text-align: center; height: 30px;" v-show="isSpinnerActive"><Spinner :show="true"></Spinner></div>
      </ListContainer>
    </template>
    <WrapperContainer v-else :items="sub"></WrapperContainer>
  </div>
</template>
<script>
  import ListFilter from 'src/components/list/ListFilter.vue'
  import ListContainer from 'src/components/list/ListContainer.vue'
  import Spinner from 'src/components/Spinner.vue'
  import TextInput from 'src/components/form/TextInput.vue'
  import WrapperContainer from 'src/components/wrapper/WrapperContainer.vue'
  import { DEFAULT_LIST_MAXRESULT, } from 'src/constants'
  import { find, get, map, } from 'lodash'

  const DEFAULT_MAXRESULT = DEFAULT_LIST_MAXRESULT
  const DEFAULT_PAGE = 1
  const DEFAULT_SORT = '-updated_at'

  const debug = require('debug')('CLIENT:List')
  const fetchModelData = store => store.dispatch('FETCH_MODEL_DATA')
  const fetchItemsCount = (store, params, endpoint) => store.dispatch('GET_ITEMS_COUNT', { params, endpoint, })
  const fetchList = (store, params, endpoint) => store.dispatch('FETCH_LIST', {
    params: Object.assign({
      maxResult: DEFAULT_MAXRESULT,
      memberId: get(store, 'state.profile.id'),
      page: DEFAULT_PAGE,
      sort: DEFAULT_SORT,
      fields: [ 'nickname', 'id' ],
    }, params),
    endpoint,
    type: 'LITING_PAGE'
  })
  const setupDataMutationState = (store, status, handler) => store.dispatch('UPDATE_EDITOR_MUTATION_STATE', { status, handler })
  const switchAlert = (store, active, {
    message,
    textConfirm,
    textCancel,
    type = 'action',
    cancelHandler,
    confirmHandler
  }) => store.dispatch('ALERT_SWITCH', {
    active, message, textConfirm, cancelHandler,
    confirmHandler, textCancel, type })

  export default {
    name: 'List',
    components: {
      ListFilter,
      ListContainer,
      Spinner,
      TextInput,
      WrapperContainer,
    },
    computed: {
      asideItems () {
        return get(this.$store, 'state.asideItems', [])
      },
      isEditorActive () {
        return get(this.$route, 'params.subItem') === 'new'
          || get(this.$route, 'params.action') === 'new'
          || get(this.$route, 'params.subItem') === 'edit'
          || get(this.$route, 'params.action') === 'edit'
      },
      isEditorDataMutated () { return get(this.$store, 'state.isEditorItemMutated.value', false) },
      isSubItem () {
        return (get(this.$route, 'params.subItem') && get(this.$route, 'params.subItem') !== 'new' && get(this.$route, 'params.subItem') !== 'edit') || false
      },
      filterChecks () {
        return this.modelData ? this.modelData.filter || [] : []
      },
      model () {
        return get(this.$route, 'params.item').replace(/-/g, '_')
      },
      modelRaw () {
        return get(this.$route, 'params.item')
      },
      modelData () {
        return this.$store.getters.modelData
      },
      sub () {
        return get(find(this.asideItems, { name: this.modelRaw, }), 'sub', [])
      },
      type () {
        return this.isSubItem ? 'list' : get(find(this.asideItems, { name: this.modelRaw, }), 'type', 'list')
      },
      title () {
        if (get(this.$route, 'params.subItem') === 'new') {
          return this.$t(`${this.model.toUpperCase()}.NEW`)
        } else if (get(this.$route, 'params.subItem') === 'edit') {
          return this.$t(`${this.model.toUpperCase()}.EDIT`)
        } else {
          return this.$t(`NAVIGATION.${this.model.toUpperCase()}`)
        }
      },
    },
    data () {
      return {
        filters: {},
        filterSearched: '',
        filterChecksCurrent: {},
        leavingReminder: {
          message: this.$t('ALERT.LEAVING_REMINDER'),
          textConfirm: this.$t('ALERT.SAVE'),
          textCancel: this.$t('ALERT.LEAVE_WITHOUT_SAVING'),
        },
        isFilterActive: false,
        isSearchFocused: false,
        isSpinnerActive: false,
        key: Date.now().toString(),
        page: DEFAULT_PAGE,
        searchVal: '',
      }
    },
    methods: {
      back () {
        this.$router.go(-1)
      },
      backToParent () {
        this.isSubItem ? this.$router.push(`/list/${get(this.$route, 'params.item')}/${get(this.$route, 'params.subItem')}`) : this.$router.push(`/list/${get(this.$route, 'params.item')}`)
      },
      create () {
        this.isSubItem
          ? this.$router.push(`/list/${get(this.$route, 'params.item')}/${get(this.$route, 'params.subItem')}/new`)
          : this.$router.push(`/list/${get(this.$route, 'params.item')}/new`)
      },
      focusSearch () {
        this.isSearchFocused = true
      },
      focusSearchOut () {
        this.isSearchFocused = false
      },
      get,
      editorDataMutatedHandler (next) {
        const handler = get(this.$store, 'state.isEditorItemMutated.handler', () => Promise.resolve())
        return handler(next)
      },      
      leavingHandler (next) {
        if (!this.isEditorDataMutated) {
          next()
        } else {
          switchAlert(this.$store, true, {
            message: this.leavingReminder.message,
            textConfirm: this.leavingReminder.textConfirm,
            textCancel: this.leavingReminder.textCancel,
            type: 'action',
            cancelHandler: () => {
              setupDataMutationState(this.$store, false)
              next()
            },
            confirmHandler: () => {
              this.editorDataMutatedHandler(next)
            }
          }) 
        }
      },
      refresh ({ params = {}, }) {
        debug('Goin to refresh!')
        this.filterSearched && (params.keyword = this.filterSearched)
        this.page = params.page || this.page
        if (params.page) {
          this.page = params.page
        } else {
          params.page = this.page
        }

        params.maxResult = this.modelData ? this.modelData.LIST_MAXRESULT || DEFAULT_LIST_MAXRESULT : DEFAULT_LIST_MAXRESULT
        params.id = this.isSubItem || undefined
        map(this.filterChecksCurrent, (filter, key) => {
          if (filter) { params[ key ] = true }
        })
        debug('params.maxResult', params.maxResult)
        debug('this.model', this.modelRaw)
        return fetchList(this.$store, params, this.modelRaw).then(() => {
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
        this.filterSearched = this.searchVal
        // this.isFilterApplied = true
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
      fetchModelData(this.$store)
    },  
    beforeRouteUpdate (to, from, next) {
      next(false) // dont revise the url bar
      this.leavingHandler(next, to)
    },
    beforeRouteLeave (to, from, next) {
      this.leavingHandler(next, to)
    }, 
    mounted () {
      this.isFilterActive = true
    },
    watch: {
      '$route': function (newRoute, oldRoute) {
        if (newRoute.params.item !== oldRoute.params.item) {
          /**
          *  As soon as the route changes and the model get different, we fetch the proper model data at first.
          */
          fetchModelData(this.$store)          
        }
      },
      '$store.getters.structure': function (newStructure, oldStructure) {
        debug('$store.getters.structure gets changed:', [ newStructure, oldStructure ])
        if (newStructure !== oldStructure) {
          /**
          *  Make sure the structure changed before we fetch list.
          */
          Promise.all([
            this.refresh({}),
            this.refreshItemsCount({})
          ])  
          this.filters = {}
          this.searchVal = ''
          this.key = Date.now().toString()
        }
      },
      searchVal () {
        debug('Mutation detected: search', this.searchVal)
        this.search()
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
    padding 50px 60px 40px 10px
    // position relative
    &__header
      height 36px
      margin-bottom 10px
      display flex
      justify-content space-between
    &__name
      font-size 1.5rem
      font-weight bold
      font-style normal
      font-stretch normal
      line-height normal
      letter-spacing normal
      text-align left
      color #000000
    &__search, &__toolbox, &__filter
      display flex
      align-items flex-end
    &__filter
      background-color #a3a3a3
      margin-top 10px
      margin-right 10px
      border-radius 4px
      height 30px
      outline none
      padding 0 10px
    &__search
      width 400px
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
        color #fff
        height 36px
        &.back
          background-color #a0a0a0
        &.create
          background-color #000
          border 1px solid #000
          &:hover
            background-color #505050
            border 1px solid #505050
            box-shadow 0 0 5px rgba(250,250,250, 0.7)
    &__wrapper
      display flex
      align-items center
</style>