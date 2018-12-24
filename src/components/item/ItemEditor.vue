<template>
  <ItemEditorWrapper
    @saved="saved"
    :type="type"
    :item="item"
    :add="add"
    :update="update"></ItemEditorWrapper>
</template>
<script>
  import ItemEditorWrapper from './ItemEditorWrapper.vue'
  import moment from 'moment'
  import numeral from 'numeral'
  import { decamelize, decamelizeKeys, } from 'humps'
  import { get, map } from 'lodash'
  const debug = require('debug')('CLIENT:ItemEditorActionWrapper')
  const update = (store, params, endpoint) => store.dispatch('UPDATE_ITEM', { params, endpoint, })
  const post = (store, params, endpoint) => store.dispatch('POST_ITEM', { params, endpoint, })  
  const switchAlert = (store, active, message, callback) => store.dispatch('ALERT_SWITCH', { active, message, callback, type: 'action' })
  export default {
    name: 'ItemEditor',
    components: {
      ItemEditorWrapper,
    },
    computed: {
      endpoint () {
        return  get(this.$store, 'getters.modelName', '').toLowerCase()
      }
    },
    data () {
      return {
        isAllowedToSave: true,
      }
    },
    methods: {
      add (form) {
        const normalizedForm = this.normalizeData(form)
        if (!this.isAllowedToSave) {
          switchAlert(this.$store, true, 'Incorrect value', () => {})            
          this.isAllowedToSave = true
          return Promise.reject()
        } else {
          normalizedForm.updatedAt = moment().toISOString(true)
          return post(this.$store, decamelizeKeys(normalizedForm), this.endpoint).then(() => {
            /**
            * Go refresh item-list.
            */
            return this.refresh({}) && true
          })
        }        
      },      
      normalizeData (form) {
        const preForm = form
        /**
         * Have to normalize any datetime type data before send put request.
         * And remove those data which's not editable(excluding 'ID').
         */
        map(this.$store.getters.structure, item => {
          if (item.type === 'Datetime') {
            if (!preForm[ item.name ]) {
              debug('item.name', item.name, preForm[ item.name ] )
              preForm[ item.name ] = null
            } else {
              if (item.watcher) {
                const ref = moment(preForm[ item.watcher ])
                const curr = moment(preForm[ item.name ])
                const diff = curr.diff(ref) / (60 * 60 * 1000)
                if ((item.relativeToWatcher === 'after' && diff <= 0) || (item.relativeToWatcher === 'before' && diff >= 0)) {
                  this.isAllowedToSave = false
                }                
              }

              // item.isDatetimeSentitive && (preForm[ item.name ] = moment(new Date(get(preForm, item.name, Date.now() + 600000))).format('YYYY-MM-DD hh:mm:ss'))
            }
          } else if ((item.type === 'TextInput' || item.type === 'Dropdownlist' || item.type === 'CheckboxItem') && item.isNumSentitive) {
            // preForm[ item.name ] = preForm[ item.name ] && !isNaN(preForm[ item.name ]) ? Number(preForm[ item.name ]) : null
            preForm[ item.name ] = preForm[ item.name ] ? numeral(preForm[ item.name ]).value() : 0
          }
          if (!item.isEditable && item.name.toUpperCase() !== 'ID' && !item.isInitialiazible && !item.isButtonized && !item.isButtonizedWith) {
            debug('Going to delete item that is not editable!', item.name)
            delete preForm[ item.name ]
          }
          if (item.type === 'TextTagItem' && get(item, 'map.isValArraySensitive')) {
            preForm[ item.name ] = map(get(preForm, item.name, []), tag => tag.value)
          }
          if (item.name.toUpperCase() === 'UPDATEDBY' || item.name.toUpperCase() === 'AUTHOR') {
            preForm[ item.name ] = this.me
          }
          if (item.required && (!preForm[ item.name ] && preForm[ item.name ] !== 0)) {
            debug(item.name, item.required, preForm[ item.name ])
            this.isAllowedToSave = false
          }
        })
        debug('preForm', preForm)
        return preForm
      },  
      saved () {
        this.$emit('saved')
      },    
      update (form) {
        const normalizedForm = this.normalizeData(form)
        if (!this.isAllowedToSave) {
          switchAlert(this.$store, true, 'Incorrect value', () => {})            
          this.isAllowedToSave = true
          return Promise.reject()
        } else {
          normalizedForm.updatedAt = moment().toISOString(true)
          return update(this.$store, decamelizeKeys(normalizedForm), this.endpoint).then(() => {
            /**
            * Go refresh item-list.
            */
            return this.refresh({}) && true
          })
        }
      },      
    },
    mounted () {},
    props: {
      type: {
        type: String,
        defualt: 'create'
      },     
      item: {
        type: Object,
        default: () => {},
      },      
      refresh: {
        type: Function,
        default: () => {}
      },
    }
  }
</script>
<style lang="stylus" scoped></style>