<template>
  <ItemEditorWrapper
    @saved="saved"
    :modelName="modelname"
    :modelData="modelData"
    :structure="structure"
    :type="type"
    :item="item"
    :add="add"
    :formdataErrorLog="formdataErrorLog"
    :update="update"></ItemEditorWrapper>
</template>
<script>
  import ItemEditorWrapper from './ItemEditorWrapper.vue'
  import moment from 'moment'
  import { setupDataMutationState, switchAlert } from 'src/util/actionDispatcher'
  import { decamelize, decamelizeKeys, } from 'humps'
  import { get, map, toNumber } from 'lodash'
  const debug = require('debug')('CLIENT:ItemEditor')
  const update = (store, params, endpoint) => store.dispatch('UPDATE_ITEM', { params, endpoint, })
  const post = (store, params, endpoint) => store.dispatch('POST_ITEM', { params, endpoint, })  
  export default {
    name: 'ItemEditor',
    components: {
      ItemEditorWrapper,
    },
    computed: {
      endpoint () {
        return  this.modelname ? this.modelname.toLowerCase() : ''
      },
      fetchModel () {
        return this.modelName !== this.$store.getters.modelName
          ? () => import(`model/${this.modelname}`)
          : Promise.resolve(this.$store.getters.modelData)
      },
      modelname () { return this.modelName || this.$store.getters.modelName },
      structure () {
        if (this.modelName) {
          return this.modelData.model || []
        } else {
          return this.modelData
            ? this.$store.getters.isSubItem
            ? this.modelData.subModel
            : this.modelData.model
            : []
        }
      }
    },
    data () {
      return {
        isAllowedToSave: true,
        formdataErrorLog: [],
        modelData: {}
      }
    },
    methods: {
      add (form) {
        const normalizedForm = this.normalizeData(form)
        if (!this.isAllowedToSave) {
          this.savingAlertProcess()
          return Promise.reject()
        } else {
          normalizedForm.updatedAt = moment().toISOString(true)
          return post(this.$store, decamelizeKeys(normalizedForm), this.endpoint).then(res => {
            /**
            * Go refresh item-list.
            */
            debug('res', res)
            return this.refresh({}) && res
          })
        }        
      },      
      normalizeData (form) {
        const preForm = form
        this.formdataErrorLog = []
        /**
         * Have to normalize any datetime type data before send put request.
         * And remove those data which's not editable(excluding 'ID').
         */
        map(this.structure, item => {
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
                  this.formdataErrorLog.push({
                    name: item.name,
                    message: this.$t('ALERT.DATETIME_VERIFIED_IN_FAIL')
                  })
                }                
              }

              // item.isDatetimeSentitive && (preForm[ item.name ] = moment(new Date(get(preForm, item.name, Date.now() + 600000))).format('YYYY-MM-DD hh:mm:ss'))
            }
          } else if ((item.type === 'TextInput' || item.type === 'Dropdownlist' || item.type === 'CheckboxItem') && item.isNumSentitive) {
            // preForm[ item.name ] = preForm[ item.name ] && !isNaN(preForm[ item.name ]) ? Number(preForm[ item.name ]) : null
            preForm[ item.name ] = preForm[ item.name ] ? toNumber(preForm[ item.name ]) : 0
          } else if (item.type === 'TextInput' && preForm[ item.name ] === 'undefined') {
            preForm[ item.name ] = ''
          }
          if (!item.isEditable && item.name.toUpperCase() !== 'ID' && !item.isInitialiazible && !item.isButtonized && !item.isButtonizedWith) {
            debug('Going to delete item that is not editable!', item.name)
            delete preForm[ item.name ]
          }
          if (item.type === 'TextAuthorItem' && get(item, 'map.isValArraySensitive')) {
            preForm[ item.name ] = map(get(preForm, item.name, []), author => author.value)
          }
          if (item.type === 'TextTagItem' && get(item, 'map.isValArraySensitive')) {
            preForm[ item.name ] = map(get(preForm, item.name, []), tag => tag.value)
          }
          if (item.name.toUpperCase() === 'UPDATEDBY' || item.name.toUpperCase() === 'AUTHOR') {
            preForm[ item.name ] = this.me
          }
          if (item.required
            && (((!preForm[ item.name ] || preForm[ item.name ].length === 0) && preForm[ item.name ] !== 0) 
              || ((item.type === 'Dropdownlist' || item.type === 'TextAuthorItem') && preForm[ item.name ] == -1))) {
            debug(item.name, item.required, preForm[ item.name ])
            this.formdataErrorLog.push({
              name: item.name,
              message: this.$t('ALERT.REQUIRED_ITEM_EMPTY')
            })            
            this.isAllowedToSave = false
          }
        })
        debug('preForm', preForm)
        return preForm
      },  
      saved (res) {
        this.$emit('saved', res)
      },  
      savingAlertProcess () {
        switchAlert(this.$store, true, {
          message: this.$t('ALERT.SAVE_REMINDER'),
          textConfirm: this.$t('ALERT.KEEP_FILLING'),
          textCancel: this.$t('ALERT.LEAVE_WITHOUT_SAVING'),
          type: 'action',
          cancelHandler: () => {
            this.isAllowedToSave = true
            setupDataMutationState(this.$store, false).then(() => this.saved({}))
          },
          confirmHandler: () => {
            this.isAllowedToSave = true
          }
        })           
      },  
      update (form) {
        const normalizedForm = this.normalizeData(form)
        if (!this.isAllowedToSave) {
          this.savingAlertProcess()
          return Promise.reject()
        } else {
          normalizedForm.updatedAt = moment().toISOString(true)
          return update(this.$store, decamelizeKeys(normalizedForm), this.endpoint).then(res => {
            /**
            * Go refresh item-list.
            */
            return this.refresh({}) && res
          })
        }
      },      
    },
    mounted () {
      this.fetchModel().then(m => {
        this.modelData = m
      })
    },
    watch: {
      modelname () {
        this.fetchModel().then(m => {
          this.modelData = m
        })        
      }
    },
    props: {
      type: {
        type: String,
        defualt: 'create'
      },     
      item: {
        type: Object,
        default: () => {},
      },  
      modelName: {
        type: String,
      },
      refresh: {
        type: Function,
        default: () => Promise.resolve()
      },
    },
  }
</script>
<style lang="stylus" scoped></style>