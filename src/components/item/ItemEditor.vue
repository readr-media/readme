<template>
  <ItemEditorLayout v-if="isActive">
  
    <div class="panel">
      <div class="panel__content">
        <template v-for="obj in structure">
          <div class="panel__content--item" v-if="!obj.isHidden">
            <div class="title" :class="{ short: isShort($t(`${listFlag}.${decamelize(obj.name).toUpperCase()}`)) }">
              <span v-text="$t(`${listFlag}.${decamelize(obj.name).toUpperCase()}`)"></span>
            </div>
            <div class="value">
              <template v-if="obj.isEditable">
                <TextInput v-if="obj.type === 'TextInput'"
                  backgroundColor="#fff"
                  :placeHolder="$t(`${listFlag}.${decamelize(obj.name).toUpperCase()}`)"
                  :value.sync="formData[ obj.name ]"></TextInput>
                <Datetime v-else-if="obj.type === 'Datetime'"
                  v-model="formData[ obj.name ]"
                  input-format="YYYY/MM/DD HH:mm"
                  input-class="datepicker__input"
                  type="datetime"></Datetime>
                <TextareaInput v-else-if="obj.type === 'TextareaInput'"
                  :placeholder="$t(`${listFlag}.${decamelize(obj.name).toUpperCase()}`)"
                  :value.sync="formData[ obj.name ]"></TextareaInput>
                <template v-else-if="obj.type === 'RadioItem'">
                  <RadioItem v-for="opt in obj.options" :name="get(obj, 'name')"
                    :label="$t(`${listFlag}.${decamelize(obj.name).toUpperCase()}_${opt.name}`)"
                    :key="get(opt, 'name')"
                    :value="get(opt, 'value')"
                    :currSelected.sync="formData[ obj.name ]"></RadioItem>                
                </template>
                <QuillEditor v-else-if="obj.type === 'ContentEditor'"
                  :content.sync="formData[ obj.name ]" /></QuillEditor>
                <TextTagItem v-else-if="obj.type === 'TextTagItem'"
                  :placeholder="$t(`${listFlag}.${decamelize(obj.name).toUpperCase()}`)"
                  :currTagValues.sync="formData[ obj.name ]"
                  :currInput.sync="currTagInput[ obj.name ]"
                  :autocomplete="autocompleteArr[ obj.name ]"></TextTagItem>                  
              </template>
              <template v-else>
                <span v-text="get(item, obj.name)"></span>
              </template>
            </div>
          </div>
        </template>
      </div>
      <div class="panel__actions">
        <div class="save" @click="save"><span v-text="$t('EDITOR.SAVE')"></span></div>
        <div class="cancel" @click="close"><span v-text="$t('EDITOR.CANCEL')"></span></div>
      </div>
    </div>
  </ItemEditorLayout>
</template>
<script>
  import ItemEditorLayout from 'src/components/item/ItemEditorLayout.vue'
  import RadioItem from 'src/components/new-form/RadioItem.vue'
  import TextInput from 'src/components/new-form/TextInput.vue'
  import TextareaInput from 'src/components/new-form/TextareaInput.vue'
  import TextTagItem from 'src/components/new-form/TextTagItem.vue'
  import QuillEditor from 'src/components/new-form/QuillEditor.vue'
  import preventScroll from 'prevent-scroll'
  import { Datetime, } from 'vue-datetime'
  import { decamelize, } from 'humps'
  import { get, map, } from 'lodash'
  import 'vue-datetime/dist/vue-datetime.css'
  const debug = require('debug')('CLIENT:ItemEditor')

  export default {
    name: 'ItemEditor',
    components: {
      Datetime,
      ItemEditorLayout,
      QuillEditor,
      RadioItem,
      TextareaInput,
      TextInput,
      TextTagItem,
    },
    computed: {
      listFlag () {
        return get(this.$route, 'params.item', '').toUpperCase()
      },
    },
    data () {
      return {
        formData: {},
        currTagInput: {},
        autocompleteArr: {},
      }
    },
    methods: {
      close () {
        this.$emit('update:isActive', false)
      },
      decamelize,
      get,
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
                break
              default:
                this.formData[ item.name ] = get(this.item, item.name)
            } 
          })
        } else if (this.type === 'create') {
          map(this.structure, item => {
            if (item.isEditable) {
              switch (item.type) {
                case 'TextInput':
                case 'TextareaInput':
                  this.formData[ item.name ] = ''
                  break
                case 'TextTagItem':
                  this.formData[ item.name ] = []
                  break
                default:
                  this.formData[ item.name ] = null
              }
            }
          })
        }
      },
      isShort (str) {
        return str.length > 2 || false
      },
      save () {
        if (this.type === 'update') {
          this.update(this.formData).then(() => {
            this.$emit('update:isActive', false)
          }).catch(err => {
            debug('err', err)
          })
        } else if (this.type === 'create') {
          this.add(this.formData).then(() => {
            this.$emit('update:isActive', false)
          }).catch(err => {
            debug('err', err)
          })          
        }
      },
    },
    beforeMount () { this.initValue() },
    mounted () {},
    props: {
      add: {
        type: Function,
        default: (form) => new Promise(resolve => {
          debug('Run add default.') 
          debug('form:', form)
          resolve()
        }),
      },
      isActive: {
        type: Boolean,
        default: () => false,
      },
      structure: Array,
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
      // currTagInput: {
      //   handler: function (newValue, oldValue) {
      //     debug('Got something.')
      //     debug(newValue, oldValue)
      //     map(newValue, (item, key) => {
      //       if (item !== oldValue[ key ]) {
      //         debug(`Mutation detected: currTagInput.${key}`)
      //         debug('Data changed from ', oldValue[ key ], ' to ', item, '!')
      //         const fn = get(this.structure, `${key}.autocomplete`)
      //         if (fn && item) {
      //           fn(this.$store, item).then(({ items, }) => {
      //             this.autocompleteArr[ key ] = [
      //               ...map(items, a => ({
      //                 name: get(a, get(this.structure, `${key}.map.name`)),
      //                 value: get(a, get(this.structure, `${key}.map.value`)),
      //               }))
      //             ]
      //           })
      //         }          
      //       }
      //     })
      //   },
      //   deep: true,
      // },
      // autocompleteArr: {
      //   handler: function (newValue, oldValue) {
      //     debug('newValue, oldValue', newValue, oldValue)
      //   },
      //   deep: true,
      // },
      isActive () {
        if (this.isActive) {
          preventScroll.on()
        } else {
          preventScroll.off()
        }
      },   
      item () { this.initValue() }, 
      structure () { this.initValue() },
    },
  }
</script>
