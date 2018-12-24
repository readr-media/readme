<template>
  <ItemEditorLayout>
    <template>
      <div class="panel">
        <div class="panel__content">
          <template v-for="group in actualGroups">
            <div class="panel__group" v-if="!(type === 'create' && group.name === 'info')">
              <div class="panel__group--title"><span v-text="$t(`EDITOR.GROUPS.${group.name.toUpperCase()}`)"></span></div>
              <template v-for="obj in group.objs">
                <div class="panel__content--item" :key="`panel__content--item-${obj.name}`">
                  <div class="title" :class="{ short: isShort($t(`${modelName}.${decamelize(obj.name).toUpperCase()}`)) }">
                    <span v-text="$t(`${modelName}.${decamelize(obj.name).toUpperCase()}`)" v-if="!obj.hideTitle"></span>
                  </div>
                  <div class="value">
                    <Item
                      :editorMode="type"
                      :modelName="modelName"
                      :refVals="formData"
                      :itemVal.sync="formData[ obj.name ]"
                      :itemObj="obj"></Item>
                  </div>
                </div>
              </template>
            </div>
          </template>
        </div>
        <div class="panel__actions">
          <div class="preview btn" :class="{ block: isProcessing }"
            v-if="$store.getters.isPreviewable && get(item, 'id')"
            @click="preview">
            <span v-text="$t('EDITOR.PREVIEW')" v-show="!isProcessing"></span>
            <Spinner class="spinner" :show="isProcessing"></Spinner>
          </div>
          <template v-for="btn in buttonizedItems">
            <ButtunizedItem
              :isProcessing="isProcessing"
              :item="btn"
              :value.sync="formData[ btn.name ]"
              :publishDate.sync="formData[ 'publishedAt' ]"
              :clickHandler="save"></ButtunizedItem>
          </template>
          <div class="save btn" :class="{ block: isProcessing }" @click="save">
            <span v-text="$t('EDITOR.SAVE')" v-show="!isProcessing"></span>
            <Spinner class="spinner" :show="isProcessing"></Spinner>
          </div>
        </div>
      </div>
    </template>
  </ItemEditorLayout>
</template>
<script>
  import ButtunizedItem from 'src/components/form/ButtunizedItem.vue'
  import ItemEditorLayout from './ItemEditorLayout.vue'
  import Item from './Item.vue'
  import Spinner from 'src/components/Spinner.vue'
  import WatchJS from 'melanke-watchjs'
  import { decamelize, } from 'humps'
  import { find, filter, get, map, sortBy, } from 'lodash'
  import 'vue-datetime/dist/vue-datetime.css'
  const debug = require('debug')('CLIENT:ItemEditorWrapper')
  const debugAdd = require('debug')('CLIENT:ItemEditorWrapper:add')
  const watcher = WatchJS.watch
  const callOffWatcher = WatchJS.unwatch
  export default {
    name: 'ItemEditorWrapper',
    components: {
      ButtunizedItem,
      Item,
      ItemEditorLayout,
      Spinner,
    },
    computed: {      
      buttonizedItems () { return filter(this.structure, obj => obj.isButtonized) },     
    },
    data () {
      return {
        actualGroups: [],
        formData: {},
        isProcessing: false,
        watchedItem: {},
      }
    },
    methods: {
      callForActionByWatcher (prop, action, newvalue, oldvalue) {
        debug(`Mutation detected: formData.${prop}`, newvalue)
        this.reconstructGroups()
      },
      decamelize,
      get,
      preview () {
        const host = get(this.modelData, 'previewHost')
        const id = get(this.item, 'id')
        debug('Go preview', [ host, id ])
        host && id && window.open(`${host}/${id}?preview=true`, '_blank')
      },
      reconstructGroups () {
        debug('reconstructGroups!', this.structure)
        const gps = []
        const sortedStructure = sortBy(this.structure, [ obj => get(obj, 'order.editor') ])
        const groups = get(this.modelData, 'groups', [ 'none' ])
        debug(`get(this.modelData, 'groups', [ 'none' ]) }`, get(this.modelData, 'groups', [ 'none' ]))
        debug('sortedStructure', sortedStructure)
        map(groups, g => {
          const includedObj = filter(sortedStructure, obj => {
            debug('obj.name', obj.name)
            debug('obj.group', obj.group, g)
            if (!obj.isHidden && (obj.group === g || g === 'none')) {
              return obj.showWith ? obj.showWith(this.formData) : true
            } else {
              return false
            }
          })
          if (includedObj.length) {
            gps.push({ name: g, objs: includedObj })
          }
        })
        this.actualGroups = gps 
        debug('this.actualGroups', this.actualGroups)    
      },
      initValue () {
        debug('init!')
        map(this.formData, item => this.callOffWatcher(this.formData, item.name, this.callForActionByWatcher))
        this.watchedItem = {}
        this.formData = {}
        if (this.type === 'update') {
          map(this.structure, item => {
            switch (item.type) {
              case 'TextTagItem':
                this.formData[ item.name ] = [
                  ...map(get(this.item, item.name), a => ({
                    name: get(a, get(item, 'map.name')),
                    value: get(a, get(item, 'map.value')),
                  }))
                ]
                break
              case 'BooleanSwitcher':
                this.formData[ item.name ] = get(this.item, item.name) || false
                break
              default:
                this.formData[ item.name ] = get(this.item, item.name)
                this.setUpWatcher(item)
            } 
          })
        } else if (this.type === 'create') {
          map(this.structure, item => {
            if (item.isEditable || item.isInitialiazible) {
              switch (item.type) {
                case 'BooleanSwitcher':
                  this.formData[ item.name ] = false   
                  break             
                case 'TextInput':
                case 'TextareaInput':
                  this.formData[ item.name ] = ''
                  break
                case 'TextTagItem':
                  this.formData[ item.name ] = []
                  break
                default:
                  this.formData[ item.name ] = null
                  this.setUpWatcher(item)
              }
            }
          })
        }
        this.reconstructGroups()
      },
      isShort (str) { return str.length > 2 || false },  
      save () {
        console.log('GO UPDATE.', this.formData)
        if (this.isProcessing) {
          return Promise.reject()
        } else {
          this.isProcessing = true
        }
        if (this.type === 'update') {
          return this.update(this.formData).then(res => {
            this.isProcessing = false
            return this.$emit('saved', res) && true
          }).catch(err => {
            this.isProcessing = false
            debug('err', err)
            return Promise.reject()
          })
        } else if (this.type === 'create') {
          return this.add(this.formData).then(res => {
            this.isProcessing = false
            debugAdd('res',  res)
            return this.$emit('saved', res) && true
          }).catch(err => {
            this.isProcessing = false
            debug('err', err)
            return Promise.reject()
          })          
        }
      },
      setUpWatcher (item) {
        if (item.watcher && !this.watchedItem[ item.watcher ]) {
          watcher(this.formData, item.watcher, this.callForActionByWatcher)
          this.watchedItem[ item.watcher ] = true
        }        
      },
      updateForm () {
        this.$forceUpdate()
      }
    },
    beforeMount () {
      this.initValue()
    },
    props: {
      add: {
        type: Function,
        default: (form) => new Promise(resolve => {
          debug('Run add default.') 
          debug('form:', form)
          resolve(true)
        }),
      },
      item: {
        type: Object,
        default: () => {},
      },
      modelName: {
        required: true,
      },
      modelData: {
        required: true,
      },
      structure: {
        required: true,
      },
      update: {
        type: Function,
        default: (form) => new Promise(resolve => {
          debug('Run update default.') 
          debug('form:', form)
          resolve(true)
        }),
      },
      type: {
        type: String,
        required: true,
      },
    },
    watch: {
      item () { this.initValue() }, 
    },
  }
</script>
