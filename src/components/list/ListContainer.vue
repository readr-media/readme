<template>
  <div class="list-container" :class="{ 'editor-active': activeEditor, }">
    <template v-if="!activeEditor">
      <div class="list-container__header"><ListItem :item="header" :structure="itemStructure" :model="model" type="header" @del="del" @copy="copy"></ListItem></div>
      <div class="list-container__items">
        <template v-for="(item, index) in items">
          <ListItem @edit="editItem" @checkup="checkup"
            :item="item" :structure="itemStructure"
            :key="`list-container__items-${index}`" :model="model"></ListItem>
        </template>
        <slot name="spinner"></slot>
      </div>
      <div class="list-container__footer">
        <RecordCount :total="itemsCount"></RecordCount>
        <PaginationNav :currPage.sync="curr_page" :totalPages="totalPages"></PaginationNav>
      </div>
    </template>
    <template v-else>
      <ItemEditor type="create" slot="editor" v-if="activeEditor === 'new'"
        @saved="itemSaved"
        :structure="itemStructure"
        :add="add"></ItemEditor>
      <ItemEditor type="update" slot="editor" v-else-if="activeEditor === 'edit'"
        @saved="itemSaved"
        :structure="itemStructure"
        :item="editorItem"
        :update="update"></ItemEditor>
      <!--slot name="new-item" :Editor="Editor" :structure="itemStructure" :add="add"></slot-->
    </template>
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
  import { filter, get, isEmpty, map, } from 'lodash'
  const debug = require('debug')('CLIENT:ListContainer')
  const update = (store, params, endpoint) => store.dispatch('UPDATE_ITEM', { params, endpoint, })
  const post = (store, params, endpoint) => store.dispatch('POST_ITEM', { params, endpoint, })
  // const del = (store, params, endpoint) => store.dispatch('DEL_ITEM', { params, endpoint, })
  const delItems = (store, params, endpoint) => store.dispatch('DEL_ITEMS', { params, endpoint, })
  const switchAlert = (store, active, message, callback) => store.dispatch('ALERT_SWITCH', { active, message, callback, })
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
      activeEditor () {
        return get(this.$route, 'params.subItem') === 'new' || get(this.$route, 'params.action') === 'new'
          ? 'new'
          : get(this.$route, 'params.subItem') === 'edit' || get(this.$route, 'params.action') === 'edit'
          ? 'edit'
          : ''
      },
      header () {
        const item = {}
        map(this.itemStructure, i => { 
          item[ i.name ] = this.$t(`${this.model}.${decamelize(i.name).toUpperCase()}`)
        })
        return item
      },
      isSubItem () {
        return (get(this.$route, 'params.subItem') && get(this.$route, 'params.subItem') !== 'new' && get(this.$route, 'params.subItem') !== 'edit') || false
      },
      items () {
        return get(this.$store, 'state.list', [])
      },
      itemsCount () {
        return get(this.$store, 'state.listItemsCount', 0)
      },
      itemStructure () {
        return this.modelData ? this.isSubItem ? this.modelData.subModel : this.modelData.model : []
      },
      maxResult () {
        return this.modelData ? this.modelData.LIST_MAXRESULT || DEFAULT_LIST_MAXRESULT : DEFAULT_LIST_MAXRESULT
      },
      me () {
        return get(this.$store, 'state.profile.id')
      },
      model () {
        return get(this.$route, 'params.item', '').replace(/-/g, '_').toUpperCase()
      },
      modelData () {
        let model
        try {
          model = require(`model/${this.model}`)
        } catch (error) {
          console.log(`There's no model found:`, this.model)
        }
        return model
      },
      totalPages () {
        return Math.floor(this.itemsCount / this.maxResult) + 1
      },
    },
    data () {
      return {
        curr_page: this.currPage,
        checkedItems: {},
        editorItem: {},
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
      editItem (item) {
        this.editorItem = item
        this.$router.push(`${get(this.$route, 'fullPath')}/edit`)
      },
      get,
      itemSaved () {
        this.$router.go(-1)
      },
      normalizeData (form) {
        const preForm = form
        /**
         * Have to normalize any datetime type data before send put request.
         * And remove those data which's not editable(excluding 'ID').
         */
        map(this.itemStructure, item => {
          debug('item.name', item.name, item.name.toUpperCase(), item)
          if (item.type === 'Datetime') {
            debug('preForm[ item.name ]', preForm[ item.name ])
            if (!preForm[ item.name ]) {
              preForm[ item.name ] = null
            } else {
              item.isDatetimeSentitive && (moment(new Date(get(preForm, item.name, Date.now() + 600000))).format('YYYY-MM-DD hh:mm:ss'))
            }
          } else if ((item.type === 'TextInput' || item.type === 'Dropdownlist') && item.isNumSentitive) {
            preForm[ item.name ] = preForm[ item.name ] && !isNaN(preForm[ item.name ]) ? Number(preForm[ item.name ]) : null
          }
          if (!item.isEditable && item.name.toUpperCase() !== 'ID' && !item.isInitiliazible) {
            debug('Going to delete item that is not editable!', item.name)
            delete preForm[ item.name ]
          }
          if (item.type === 'TextTagItem' && get(item, 'map.isValArraySensitive')) {
            preForm[ item.name ] = map(get(preForm, item.name, []), tag => tag.value)
          }
          if (item.name.toUpperCase() === 'UPDATEDBY' || item.name.toUpperCase() === 'AUTHOR') {
            preForm[ item.name ] = this.me
          }
          debug('preForm', preForm)
        })
        return preForm
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
    mounted () {
      this.activeEditor === 'edit' && isEmpty(this.editorItem) && this.backToParent()
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