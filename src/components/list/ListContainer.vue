<template>
  <div class="list-container" :class="{ 'editor-active': activeEditor, }">
    <template v-if="!activeEditor">
      <transition name="fade" mode="out-in">
        <div :key="key">
          <div class="list-container__header">
            <ListItem :item="header" type="header" @del="del" @copy="copy"></ListItem>
          </div>
          <div class="list-container__items">
            <template v-for="(item, index) in items">
              <ListItem @edit="editItem($event, item.id)" @checkup="checkup"
                :item="item"
                :key="`list-container__items-${index}`"></ListItem>
            </template>
            <slot name="spinner"></slot>
          </div>
          <div class="list-container__footer">
            <RecordCount :total="itemsCount"></RecordCount>
            <PaginationNav :currPage.sync="curr_page" :totalPages="totalPages"></PaginationNav>
          </div>
        </div>
      </transition>
    </template>
    <template v-else>
      <ItemEditor type="create" slot="editor" v-if="activeEditor === 'new'"
        @saved="itemSaved"
        :refresh="refresh"></ItemEditor>
      <ItemEditor type="update" slot="editor" v-else-if="activeEditor === 'edit'"
        @saved="itemSaved"
        :refresh="refresh"
        :item="editorItem"></ItemEditor>
    </template>
  </div>
</template>

<script>
import ItemEditor from 'src/components/item/ItemEditor.vue'
import ListItem from 'src/components/list/ListItem.vue'
import PaginationNav from 'src/components/list/PaginationNav.vue'
import RecordCount from 'src/components/list/RecordCount.vue'
import { DEFAULT_LIST_MAXRESULT, } from 'src/constants'
import { decamelize, decamelizeKeys, } from 'humps'
import { filter, get, isEmpty, map, } from 'lodash'

const debug = require('debug')('CLIENT:ListContainer')
// const del = (store, params, endpoint) => store.dispatch('DEL_ITEM', { params, endpoint, })
// const editItem = (store, id, params, endpoint) => store.dispatch('EDIT_ITEM', { id, params, endpoint })
const fetchItem = (store, id, params, endpoint) => store.dispatch('FETCH_ITEM', { id, params, endpoint })
const delItems = (store, params, endpoint) => store.dispatch('DEL_ITEMS', { params, endpoint, })
const switchAlert = (store, active, message, callback) => store.dispatch('ALERT_SWITCH', { active, message, callback, type: 'action' })

export default {
  name: 'ListContainer',
  components: {
    ItemEditor,
    ListItem,
    PaginationNav,
    RecordCount,
  },
  computed: {     
    activeEditor () {
      return get(this.$route, 'params.subItem') === 'new' || get(this.$route, 'params.action') === 'new'
        ? 'new'
        : get(this.$route, 'params.subItem') === 'edit' || get(this.$route, 'params.action') === 'edit'
        ? 'edit'
        : ''
    },
    items () {
      return get(this.$store, 'state.list', [])
    },
    itemsCount () {
      return get(this.$store, 'state.listItemsCount', 0)
    },
    maxResult () {
      return this.$store.getters.modelData ? this.$store.getters.modelData.LIST_MAXRESULT || DEFAULT_LIST_MAXRESULT : DEFAULT_LIST_MAXRESULT
    },
    // me () {
    //   return get(this.$store, 'state.profile.id')
    // },
    totalPages () {
      return Math.floor(this.itemsCount / this.maxResult) + 1
    },
    modelName () {
      return this.$store.getters.modelName
    }
  },
  data () {
    return {
      curr_page: this.currPage,
      checkedItems: {},
      editorItem: {},
      header: {},
      key: '',
      isAllowedToSave: true,
      isFetchingItem: false
    }
  },
  methods: {
    checkup ({ id, value }) {
      this.checkedItems[ id ] = value
    },
    copy () {},
    del () {
      switchAlert(this.$store, true, 'Are you sure about doing this?', () => {
        return delItems(this.$store, {
          ids: filter(map(this.checkedItems, (item, key) => (item && key))),
        }, this.flag).then(() => {
          this.checkedItems = {}
          return this.refresh({})
        })
      })        
    },
    // delItem (item) {
    //   return del(this.$store, item, this.flag).then(() => {
    //     /**
    //      * Go refresh item-list.
    //      */
    //     this.refresh({})          
    //   })
    // },
    editItem (item, id) {
      if (this.isFetchingItem) { return }

      this.isFetchingItem = true

      console.log('edit')
      
      switch (this.flag) {
        case 'poll':
        case 'promotion':
          this.editorItem = item
          this.$router.push(`${get(this.$route, 'fullPath')}/edit`)
          this.isFetchingItem = false
          break
        default:
          // editItem(this.$store, id, {}, this.flag).then((item) => {
          //   console.log('fetch list item successfully')
          //   this.editorItem = item
          //   this.$router.push(`${get(this.$route, 'fullPath')}/edit`)
          // })
          fetchItem(this.$store, id, {}, this.flag).then((item) => {
            console.log('fetch item successfully')
            this.editorItem = item
            this.$router.push(`${get(this.$route, 'fullPath')}/edit`)
            this.isFetchingItem = false
          })
          break
      }
      // this.editorItem = item
      // this.$router.push(`${get(this.$route, 'fullPath')}/edit`)
    },
    itemSaved () {
      this.$router.go(-1)
    },
    get
  },
  mounted () {
    this.activeEditor === 'edit' && isEmpty(this.editorItem) && this.backToParent()
    this.key = this.modelName
    map(this.$store.getters.structure, i => { 
      this.header[ i.name ] = this.$t(`${this.modelName}.${decamelize(i.name).toUpperCase()}`)
    })
  },
  props: {
    backToParent: {
      type: Function,
      default: () => {},
    },
    flag: {
      type: String,
    },
    refresh: {
      type: Function,
      default: () => {},
    },
    filtersVals: {
      type: Object,
      default: () => ({})
    },
    // refreshItemsCount: {
    //   type: Function,
    //   default: () => {},
    // },
    currPage: {
      type: Number,
      default: 1
    }
  },
  watch: {
    curr_page (page) {
      console.log(`change current page: ${page}`);
      
      // console.log(this.filtersVals)
      
      // console.log(val)
      
      // if (this.$store.state.isFiltered) {
      //   this.refresh({
      //     params: Object.assign(this.$store.state.filterParams, { page: this.curr_page })
      //   })
      // } else {
      this.refresh({ params: { ...this.filtersVals, page } })
      // }
    },
    '$store.getters.structure': function (newVals, oldVals) {
      if (newVals !== oldVals) {
        this.key = this.modelName
        map(this.$store.getters.structure, (i) => { 
          this.header[ i.name ] = this.$t(`${this.modelName}.${decamelize(i.name).toUpperCase()}`)
        })
      }
    }
  },
}
</script>

<style lang="stylus" scoped>
.list-container
  padding 30px 0 70px
  position relative
  &.editor-active
    // height calc(100vh - 100px)
    height 100%
  &__footer
    position absolute
    bottom 0
    left 0
    height 50px
    width 100%
    padding 10px 10px 10px
    display flex
    justify-content space-between
    align-items center
</style>