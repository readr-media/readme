<template>
  <div v-if="isMounted && (itemObj.isEditable || (itemObj.isInitiliazible && editorMode === 'create'))">
    <TextInput v-if="itemObj.type === 'TextInput'"
      backgroundColor="#fff"
      :placeHolder="$t(`${$store.getters.modelName}.${decamelize(itemObj.name).toUpperCase()}`)"
      :value.sync="value"></TextInput>
    <DatetimeItem v-else-if="itemObj.type === 'Datetime'"
      :relativeToRef="itemObj.relativeToWatcher"
      :dateRef="refVals[ itemObj.watcher ]"
      :value.sync="value"></DatetimeItem>
    <TextareaInput v-else-if="itemObj.type === 'TextareaInput'"
      :autoHeightActive="itemObj.autoHeightActive"
      :placeholder="$t(`${$store.getters.modelName}.${decamelize(itemObj.name).toUpperCase()}`)"
      :value.sync="value"></TextareaInput>
    <template v-else-if="itemObj.type === 'RadioItem'">
      <RadioItem v-for="opt in itemObj.options" :name="get(itemObj, 'name')"
        @updateForm="updateForm"
        :label="$t(`${$store.getters.modelName}.${decamelize(itemObj.name).toUpperCase()}_${opt.name}`)"
        :key="get(opt, 'name')"
        :value="get(opt, 'value')"
        :currSelected.sync="value"></RadioItem>
    </template>
    <QuillEditor v-else-if="itemObj.type === 'ContentEditor'" :content.sync="value" />
    <TextTagItem v-else-if="itemObj.type === 'TextTagItem'"
      :placeholder="$t(`${$store.getters.modelName}.${decamelize(itemObj.name).toUpperCase()}`)"
      :currTagValues.sync="value"
      :currInput.sync="currTagInput"
      :autocomplete="autocompleteArr"></TextTagItem>
    <BooleanSwitcher v-else-if="itemObj.type === 'BooleanSwitcher'"
      :status.sync="value"></BooleanSwitcher>
    <ImageUploader v-else-if="itemObj.type === 'Image'"
      :imageUrl.sync="value"></ImageUploader>
    <Dropdownlist v-else-if="itemObj.type === 'Dropdownlist'"
      :name="itemObj.name"
      :defaultVal="itemObj.default"
      :defaultText="itemObj.defaultText"
      :fetchSource="itemObj.fetchSource"
      :selectedItem.sync="value"></Dropdownlist>
    <MediaOptions v-else-if="itemObj.type === 'MediaOptions'"
      :fetchData="itemObj.fetchData"
      :id="refVals[ 'id' ]"
      :options.sync="value"></MediaOptions>
    <CheckboxItem v-else-if="itemObj.type === 'CheckboxItem'"
      theme="editor"
      :text="$t(`${$store.getters.modelName}.${itemObj.subText}`)"
      :value.sync="value"></CheckboxItem>
    <Uploader v-else-if="itemObj.type === 'Uploader'"
      :destination="refVals[ 'destination' ]"
      :fileId="refVals[ 'fileName' ] || refVals[ 'id' ]"
      :fileObj.sync="value"></Uploader>
  </div>
  <div v-else>
    <span v-if="itemObj.type === 'RadioItem'" v-text="mapValue(itemObj.name, itemObj.options, itemVal)"></span>
    <span v-else-if="itemObj.type === 'Datetime'" v-text="moment(itemVal).format('YYYY-MM-DD HH:mm:ss')"></span>
    <span v-else v-text="itemVal"></span>
  </div>
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
  import Uploader from 'src/components/form/MediaUploader/Uploader.vue'
  import moment from 'moment'
  import { decamelize, } from 'humps'
  import { filter, get, map } from 'lodash'
  const debug = require('debug')('CLIENT:Item')
  export default {
    name: 'Item',
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
      Uploader,      
    },
    data () {
      return {
        currTagInput: '',
        isMounted: false,
        value: undefined,
        autocompleteArr: [],
      }
    },
    methods: {
      decamelize,
      get,
      moment,
      mapValue (name, options, value) {
        return this.$t(`${this.$store.getters.modelName}.${decamelize(name).toUpperCase()}_${get(filter(options, { value, }), '0.name', 'NEVER').toUpperCase()}`, '')
      },      
      updateForm () {
        this.$emit('updateForm')
      },
    },
    mounted () {
      this.value = get(this, 'itemVal', this.itemObj.default)
      this.isMounted = true
      // this.$forceUpdate()
    },
    props: {
      itemObj: {
        type: Object,
        default: () => ({})
      },
      itemVal: {
        default: ''
      },
      refVals: {
        type: Object,
        default: () => ({})         
      },
      editorMode: {
        type: String,
        default: ''
      }
    },
    watch: {
      itemVal () {
        // this.value = this.value !== this.itemVal ? this.itemVal : this.value
        // this.$forceUpdate()
      },
      value () {
        this.$emit('update:itemVal', this.value)
      },
      currTagInput (newValue, oldValue) {
        debug(`Mutation detected: currTagInput`)
        debug('Data changed from ', oldValue, ' to ', newValue, '!')
        if (this.itemObj.autocomplete && newValue) {
          this.itemObj.autocomplete(this.$store, newValue).then(({ items, }) => {
            const list= [
              ...map(items, a => ({
                name: get(a, get(this.itemObj, 'map.name')),
                value: get(a, get(this.itemObj, 'map.value')),
              }))
            ]
            this.autocompleteArr = list
          })
        }        
      },
    }
  }
</script>
<style lang="stylus" scoped></style>