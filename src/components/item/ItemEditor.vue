<template>
  <ItemEditorLayout>
    <div class="panel">
      <div class="panel__content">
        <template v-for="group in groups">
          <div class="panel__group">
            <div class="panel__group--title"><span v-text="$t(`EDITOR.GROUPS.${group.toUpperCase()}`)"></span></div>
            <template v-for="obj in sortedStructure">
              <div v-if="!obj.isHidden && (obj.group === group || group === 'none')"
                v-show="obj.showWith ? obj.showWith(formData) : true"
                class="panel__content--item"
                :key="`panel__content--item-${obj.name}`">
                <div class="title" :class="{ short: isShort($t(`${model}.${decamelize(obj.name).toUpperCase()}`)) }">
                  <span v-text="$t(`${model}.${decamelize(obj.name).toUpperCase()}`)" v-if="!obj.hideTitle"></span>
                </div>
                <div class="value">
                  <template v-if="obj.isEditable || (obj.isInitiliazible && type === 'create')">
                    <TextInput v-if="obj.type === 'TextInput'"
                      backgroundColor="#fff"
                      :placeHolder="$t(`${model}.${decamelize(obj.name).toUpperCase()}`)"
                      :value.sync="formData[ obj.name ]"></TextInput>
                    <Datetime v-else-if="obj.type === 'Datetime'"
                      v-model="formData[ obj.name ]"
                      input-format="YYYY/MM/DD HH:mm"
                      input-class="datepicker__input"
                      type="datetime"></Datetime>
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
                    <span v-if="obj.type === 'RadioItem'" v-text="mapValue(obj.name, obj.options, get(item, obj.name))" ></span>
                    <span v-else v-text="get(item, obj.name)"></span>
                  </template>
                </div>
              </div>
            </template>
          </div>
        </template>
      </div>
      <div class="panel__actions">
        <div class="save" :class="{ block: isProcessing }" @click="save">
          <span v-text="$t('EDITOR.SAVE')" v-show="!isProcessing"></span>
          <Spinner class="spinner" :show="isProcessing"></Spinner>
        </div>
        <!--div class="cancel" @click="close"><span v-text="$t('EDITOR.CANCEL')"></span></div-->
      </div>
    </div>
  </ItemEditorLayout>
</template>
<script>
  import BooleanSwitcher from 'src/components/form/BooleanSwitcher.vue'
  import CheckboxItem from 'src/components/form/CheckboxItem.vue'
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
  // import preventScroll from 'prevent-scroll'
  import { Datetime, } from 'vue-datetime'
  import { decamelize, } from 'humps'
  import { find, filter, get, map, sortBy, } from 'lodash'
  import 'vue-datetime/dist/vue-datetime.css'
  const debug = require('debug')('CLIENT:ItemEditor')

  export default {
    name: 'ItemEditor',
    components: {
      BooleanSwitcher,
      CheckboxItem,
      Dropdownlist,
      Datetime,
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
      model () {
        return get(this.$route, 'params.item', '').replace(/-/g, '_').toUpperCase()
      },
      sortedStructure () {
        debug(`sortBy(this.structure, [ obj => get(obj, 'order.editor') ])`, sortBy(this.structure, [ obj => get(obj, 'order.editor') ]))
        return sortBy(this.structure, [ obj => get(obj, 'order.editor') ])
      },
    },
    data () {
      return {
        formData: {},
        currTagInput: {},
        autocompleteArr: {},
        isProcessing: false,
      }
    },
    methods: {
      // close () {
      //   this.$emit('update:isActive', false)
      // },
      // checkShowWith (obj) {
      //   const flag = obj.showWith ? get(filter([ this.formData ], obj.showWith), 'length', 0) > 0 : true
      //   debug('obj.showWithWatcher', obj.showWithWatcher)
      //   debug('isFormdataWatchOn', this.isFormdataWatchOn)
      //   debug(`!this.isFormdataWatch[ obj.showWithWatcher ]`, !this.isFormdataWatch[ obj.showWithWatcher ])
      //   debug(`formData.${obj.showWithWatcher}`)
      //   if (flag && !this.isFormdataWatch[ obj.showWithWatcher ]) {
      //     this.45[ obj.showWithWatcher ] = this.formData[ obj.showWithWatcher ] || undefined
      //     this.$watch(`formData.${obj.showWithWatcher}`, (newValue, oldValue) => {
      //       debug('go update')
      //       debug('go update')
      //       debug('go update')
      //       debug('go update')
      //       debug('go update')
      //       this.$forceUpdate()
      //     }, {
      //       deep: true
      //     })
      //     this.isFormdataWatch[ obj.showWithWatcher ] = true
      //   }
      //   return flag
      // },
      decamelize,
      get,
      // isSupposedToShow () {

      // },
      initValue () {
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
              }
            }
          })
        }
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
            debug('err', err)
          })
        } else if (this.type === 'create') {
          this.add(this.formData).then(() => {
            // this.$emit('update:isActive', false)
            this.isProcessing = false
            this.$emit('saved')
          }).catch(err => {
            debug('err', err)
          })          
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
      // this.setupWatcher()
    },
    mounted () {},
    updated () {
      debug('updated detected!')
      debug('updated detected!')
      debug('updated detected!')
      debug('updated detected!')
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
      // isActive: {
      //   type: Boolean,
      //   default: () => false,
      // },
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
      // isActive () {
      //   if (this.isActive) {
      //     preventScroll.on()
      //   } else {
      //     preventScroll.off()
      //   }
      // },   
      item () { this.initValue() }, 
      structure () { this.initValue() },
    },
  }
</script>
