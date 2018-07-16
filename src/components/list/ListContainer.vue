<template>
  <div class="list-container">
    <div class="list-container__header"><ListItem :item="header" :structure="itemStructure" :model="model" type="header"></ListItem></div>
    <div class="list-container__items">
      <template v-for="item in items">
        <ListItem :item="item" :structure="itemStructure" :model="model" @editorOn="openEditor" @del="delItem"></ListItem>
      </template>
    </div>
    <div class="list-container__footer">
      <RecordCount :total="itemsCount"></RecordCount>
      <PaginationNav :currPage.sync="curr_page" :totalPages="totalPages"></PaginationNav>
    </div>
    <ItemEditor type="update"
      :isActive.sync="isItemEditorActive"
      :structure="itemStructure"
      :item="editorItem"
      :update="update"></ItemEditor>
    <slot name="new-item" :Editor="Editor" :structure="itemStructure" :add="add"></slot>
  </div>
</template>
<script>
  import ItemEditor from 'src/components/item/ItemEditor.vue'
  import ListItem from 'src/components/list/ListItem.vue'
  import PaginationNav from 'src/components/list/PaginationNav.vue'
  import RecordCount from 'src/components/list/RecordCount.vue'
  import moment from 'moment'
  import { DEFAULT_LIST_MAXRESULT, } from 'src/constants'
  import { decamelize, decamelizeKeys, } from 'humps'
  import { get, map, } from 'lodash'
  const debug = require('debug')('CLIENT:ListContainer')
  const update = (store, params, flag) => store.dispatch('UPDATE_ITEM', { params, flag, })
  const post = (store, params, flag) => store.dispatch('POST_ITEM', { params, flag, })
  const del = (store, params, flag) => store.dispatch('DEL_ITEM', { params, flag, })
  export default {
    name: 'ListContainer',
    components: {
      ItemEditor,
      ListItem,
      PaginationNav,
      RecordCount,
    },
    computed: {
      Editor () {
        return ItemEditor
      },      
      header () {
        const item = {}
        map(this.itemStructure, i => { 
          item[ i.name ] = this.$t(`${this.model}.${decamelize(i.name).toUpperCase()}`)
        })
        return item
      },
      items () {
        return get(this.$store, 'state.list', [])
      },
      itemsCount () {
        return get(this.$store, 'state.listItemsCount', 0)
      },
      itemStructure () {
        return require(`src/model/${this.model}`).model
      },
      maxResult () {
        return require(`src/model/${this.model}`).LIST_MAXRESULT || DEFAULT_LIST_MAXRESULT
      },
      me () {
        return get(this.$store, 'state.profile.id')
      },
      model () {
        return get(this.$route, 'params.item', '').toUpperCase()
      },
      totalPages () {
        return Math.floor(this.itemsCount / this.maxResult) + 1
      },
    },
    data () {
      return {
        curr_page: this.currPage,
        editorItem: {},
        isItemEditorActive: false,
      }
    },
    methods: {
      add (form) {
        const normalizedForm = this.normalizeData(form)
        return post(this.$store, decamelizeKeys(normalizedForm), this.flag).then(() => {
          /**
           * Go refresh item-list.
           */
          this.refresh({})
        })
      },
      delItem (item) {
        return del(this.$store, item, this.flag).then(() => {
          /**
           * Go refresh item-list.
           */
          this.refresh({})          
        })
      },
      normalizeData (form) {
        const preForm = form
        /**
         * Have to normalize any datetime type data before send put request.
         * And remove those data which is not editable(excluding 'ID').
         */
        map(this.itemStructure, item => {
          debug('item.name', item.name, item.name.toUpperCase())
          if (item.type === 'Datetime') {
            debug('preForm[ item.name ]', preForm[ item.name ])
            if (!preForm[ item.name ]) {
              preForm[ item.name ] = null
            } else {
              item.isDatetimeSentitive && (moment(new Date(get(preForm, item.name, Date.now() + 600000))).format('YYYY-MM-DD hh:mm:ss'))
            }
          } else if (item.type === 'TextInput' && item.isNumSentitive) {
            preForm[ item.name ] = preForm[ item.name ] && !isNaN(preForm[ item.name ]) ? Number(preForm[ item.name ]) : null
          }
          if (!item.isEditable && item.name.toUpperCase() !== 'ID') {
            debug('Going to delete item that is not editable!', item.name)
            delete preForm[ item.name ]
          }
          if (item.name.toUpperCase() === 'UPDATEDBY' || item.name.toUpperCase() === 'AUTHOR') {
            preForm[ item.name ] = this.me
          }
          debug('preForm', preForm)
        })
        return preForm
      },
      openEditor (item) {
        this.isItemEditorActive = true
        this.editorItem = item
      },
      update (form) {
        const normalizedForm = this.normalizeData(form)
        return update(this.$store, decamelizeKeys(normalizedForm), this.flag).then(() => {
          /**
           * Go refresh item-list.
           */
          this.refresh({})
        })
      },
    },
    mounted () {},
    props: {
      flag: {
        type: String,
      },
      refresh: {
        type: Function,
        default: () => {},
      },
      refreshItemsCount: {
        type: Function,
        default: () => {},
      },
      currPage: {
        type: Number,
        default: 1,
      },
    },
    watch: {
      curr_page () {
        this.refresh({
          params: {
            page: this.curr_page,
          },
        })
      },
    },
  }
</script>
<style lang="stylus" scoped>
  .list-container
    padding 30px 30px 70px
    background-color rgba(250,250,250,0.5)
    position relative
    // height 750px
    // height 100%
    &:hover
      background-color rgba(250,250,250,0.9)
    &__footer
      // margin-top 20px
      position absolute
      bottom 0
      left 0
      height 50px
      width 100%
      padding 10px 10px 10px
      display flex
      justify-content space-between
      align-items center
      background-color rgba(0,0,0,0.7)
      &:hover
        background-color rgba(0,0,0,0.5)
</style>