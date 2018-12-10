<template>
  <ItemEditorLayout>
    <div class="panel">
      <div class="panel__content">
        <template v-for="group in actualGroups">
          <div class="panel__group" v-if="!(type === 'create' && group.name === 'info')">
            <div class="panel__group--title"><span v-text="$t(`EDITOR.GROUPS.${group.name.toUpperCase()}`)"></span></div>
            <template v-for="obj in group.objs">
              <div class="panel__content--item" :key="`panel__content--item-${obj.name}`">
                <div class="title" :class="{ short: isShort($t(`${model}.${decamelize(obj.name).toUpperCase()}`)) }">
                  <span v-text="$t(`${model}.${decamelize(obj.name).toUpperCase()}`)" v-if="!obj.hideTitle"></span>
                </div>
                <div class="value">
                  <template v-if="obj.isEditable || (obj.isInitiliazible && type === 'create')">
                    <TextInput v-if="obj.type === 'TextInput'"
                      backgroundColor="#fff"
                      :placeHolder="$t(`${model}.${decamelize(obj.name).toUpperCase()}`)"
                      :value.sync="formData[ obj.name ]"></TextInput>
                    <DatetimeItem v-else-if="obj.type === 'Datetime'"
                      :relativeToRef="obj.relativeToWatcher"
                      :dateRef="formData[ obj.watcher ]"
                      :value.sync="formData[ obj.name ]"></DatetimeItem>
                    <TextareaInput v-else-if="obj.type === 'TextareaInput'"
                      :autoHeightActive="obj.autoHeightActive"
                      :placeholder="$t(`${model}.${decamelize(obj.name).toUpperCase()}`)"
                      :value.sync="formData[ obj.name ]"></TextareaInput>
                    <template v-else-if="obj.type === 'RadioItem'">
                      <RadioItem v-for="opt in obj.options" :name="get(obj, 'name')"
                        @updateForm="updateForm"
                        :label="$t(`${model}.${decamelize(obj.name).toUpperCase()}_${opt.name}`)"
                        :key="get(opt, 'name')"
                        :value="get(opt, 'value')"
                        :currSelected.sync="formData[ obj.name ]"></RadioItem>
                    </template>
                    <QuillEditor v-else-if="obj.type === 'ContentEditor'" :content.sync="formData[ obj.name ]" />
                    <TextTagItem v-else-if="obj.type === 'TextTagItem'"
                      :placeholder="$t(`${model}.${decamelize(obj.name).toUpperCase()}`)"
                      :currTagValues.sync="formData[ obj.name ]"
                      :currInput.sync="currTagInput[ obj.name ]"
                      :autocomplete="autocompleteArr[ obj.name ]"></TextTagItem>
                    <BooleanSwitcher v-else-if="obj.type === 'BooleanSwitcher'"
                      :status.sync="formData[ obj.name ]"></BooleanSwitcher>
                    <ImageUploader v-else-if="obj.type === 'Image'"
                      :imageUrl.sync="formData[ obj.name ]"></ImageUploader>
                    <Dropdownlist v-else-if="obj.type === 'Dropdownlist'"
                      :name="obj.name"
                      :defaultVal="obj.default"
                      :defaultText="obj.defaultText"
                      :fetchSource="obj.fetchSource"
                      :selectedItem.sync="formData[ obj.name ]"></Dropdownlist>
                    <MediaOptions v-else-if="obj.type === 'MediaOptions'"
                      :fetchData="obj.fetchData"
                      :id="formData[ 'id' ]"
                      :options.sync="formData[ obj.name ]"></MediaOptions>
                    <CheckboxItem v-else-if="obj.type === 'CheckboxItem'"
                      theme="editor"
                      :text="$t(`${model}.${obj.subText}`)"
                      :value.sync="formData[ obj.name ]"></CheckboxItem>
                  </template>
                  <template v-else>
                    <span v-if="obj.type === 'RadioItem'" v-text="mapValue(obj.name, obj.options, get(item, obj.name))"></span>
                    <span v-else-if="obj.type === 'Datetime'" v-text="moment(get(item, obj.name)).format('YYYY-MM-DD HH:mm:ss')"></span>
                    <span v-else v-text="get(item, obj.name)"></span>
                  </template>
                </div>
              </div>
            </template>
          </div>
        </template>
      </div>
      <div class="panel__actions">
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
  </ItemEditorLayout>
</template>
<script>
  import BooleanSwitcher from 'src/components/form/BooleanSwitcher.vue'
  import ButtunizedItem from 'src/components/form/ButtunizedItem.vue'
  import CheckboxItem from 'src/components/form/CheckboxItem.vue'
  import DatetimeItem from 'src/components/form/DatetimeItem.vue'
  import Dropdownlist from 'src/components/form/Dropdownlist.vue'
  import ImageUploader from 'src/components/form/ImageUploader.vue'
  import ItemEditorLayout from 'src/components/item/ItemEditorLayout.vue'
  import MediaOptions from 'src/components/form/MediaOptions.vue'
  import RadioItem from 'src/components/form/RadioItem.vue'
  import QuillEditor from 'src/components/form/Quill/QuillEditor.vue'
  import Spinner from 'src/components/Spinner.vue'
  import TextInput from 'src/components/form/TextInput.vue'
  import TextareaInput from 'src/components/form/TextareaInput.vue'
  import TextTagItem from 'src/components/form/TextTagItem.vue'
  import WatchJS from 'melanke-watchjs'
  import moment from 'moment'
  import { decamelize, } from 'humps'
  import { find, filter, get, map, sortBy, } from 'lodash'
  import 'vue-datetime/dist/vue-datetime.css'
  const debug = require('debug')('CLIENT:ItemEditor')
  const watcher = WatchJS.watch
  const callOffWatcher = WatchJS.unwatch
  export default {
    name: 'ItemEditor',
    components: {
      BooleanSwitcher,
      ButtunizedItem,
      CheckboxItem,
      DatetimeItem,
      Dropdownlist,
      ImageUploader,
      ItemEditorLayout,
      MediaOptions,
      QuillEditor,
      RadioItem,
      Spinner,
      TextareaInput,
      TextInput,
      TextTagItem,
    },
    computed: {
      buttonizedItems () {
        return filter(this.structure, obj => obj.isButtonized)
      },
      model () {
        return get(this.$route, 'params.item', '').replace(/-/g, '_').toUpperCase()
      },
    },
    data () {
      return {
        actualGroups: [],
        autocompleteArr: {},
        currTagInput: {},
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
      moment,
      reconstructGroups () {
        const gps = []
        const sortedStructure = sortBy(this.structure, [ obj => get(obj, 'order.editor') ])
        map(this.groups, g => {
          const includedObj = filter(sortedStructure, obj => {
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
      },
      initValue () {
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
                this.setupTagInputWatcher(item) 
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
            if (item.isEditable || item.isInitiliazible) {
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
                  this.setupTagInputWatcher(item) 
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
      mapValue (name, options, value) {
        return this.$t(`${this.model}.${decamelize(name).toUpperCase()}_${get(filter(options, { value, }), '0.name', 'NEVER').toUpperCase()}`, '')
      },    
      save () {
        console.log('GO UPDATE.')
        if (this.isProcessing) {
          return
        } else {
          this.isProcessing = true
        }
        if (this.type === 'update') {
          this.update(this.formData).then(() => {
            // this.$emit('update:isActive', false)
            this.isProcessing = false
            this.$emit('saved')
          }).catch(err => {
            this.isProcessing = false
            debug('err', err)
          })
        } else if (this.type === 'create') {
          this.add(this.formData).then(() => {
            // this.$emit('update:isActive', false)
            this.isProcessing = false
            this.$emit('saved')
          }).catch(err => {
            this.isProcessing = false
            debug('err', err)
          })          
        }
      },
      setUpWatcher (item) {
        if (item.watcher && !this.watchedItem[ item.watcher ]) {
          watcher(this.formData, item.watcher, this.callForActionByWatcher)
          this.watchedItem[ item.watcher ] = true
        }        
      },
      setupTagInputWatcher (item) {
        /**
          * - Setup watchers for this item.
          */
        this.$watch(`currTagInput.${item.name}`, (newValue, oldValue) => {
          debug(`Mutation detected: currTagInput.${item.name}`)
          debug('Data changed from ', oldValue, ' to ', newValue, '!')
          if (item.autocomplete && newValue) {
            item.autocomplete(this.$store, newValue).then(({ items, }) => {
              const obj = {}
              obj[ item.name ] = [
                ...map(items, a => ({
                  name: get(a, get(item, 'map.name')),
                  value: get(a, get(item, 'map.value')),
                }))
              ]
              this.autocompleteArr = Object.assign({}, this.autocompleteArr, obj)
            })
          }
        })                 
        this.$watch(`autocompleteArr.${item.name}`, (newValue, oldValue) => {
          debug(`Mutation detected: autocompleteArr.${item.name}`)
          debug('Data changed from ' + oldValue + ' to ' + newValue + '!')
        })       
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
          resolve()
        }),
      },
      structure: Array,
      groups: {
        type: Array,
        default: () => [ 'none' ]
      },
      item: {
        type: Object,
        default: () => {},
      },
      update: {
        type: Function,
        default: (form) => new Promise(resolve => {
          debug('Run update default.') 
          debug('form:', form)
          resolve()
        }),
      },
      type: {
        type: String,
        required: true,
      },
    },
    watch: {
      item () { this.initValue() }, 
      structure () { this.initValue() },
    },
  }
</script>
