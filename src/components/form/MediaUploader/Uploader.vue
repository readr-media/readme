<template>
  <UploaderLayout :class="{ full: !isEmpty }">
    <template v-if="!isEmpty">
      <div class="uploader__item--remover" @click="removeFile"></div>
      <MidiaPreviewer class="uploader__item--previewer"
        :file="file"></MidiaPreviewer>
      <div class="uploader__item--info">
        <div class="name"><span v-text="itemName"></span></div>
        <div class="size"><span v-text="calcSize(itemSize)"></span></div>
      </div>
    </template>
    <FilePond
      v-if="$store.state.isClientSideMounted && isMounted"
      ref="pond"
      :server="server"
      :class="{ full: !isEmpty }"
      :allowMultiple="false"
      :name="name"
      :labelIdle="`${uploadButton}${$t('EDITOR.UPLOADER.TOOLTIP')}`"
      :acceptedFileTypes="acceptedFileTypes"
      :files="filesUploaded"
      @updatefiles="onupdatefiles"
      @addfile="addfile"
      @init="init"/>
  </UploaderLayout>
</template>
<script>
  import MidiaPreviewer from './MidiaPreviewer.vue'
  import Spinner from 'src/components/Spinner.vue'
  import UploaderLayout from './UploaderLayout.vue'
  import numeral from 'numeral'
  import { get } from 'lodash'

  /** import file uploader lib */
  import vueFilePond from 'vue-filepond'
  import 'filepond/dist/filepond.min.css'
  import FilePondPluginFileValidateType from 'filepond-plugin-file-validate-type'
  const FilePond = vueFilePond(FilePondPluginFileValidateType)

  const axios = require('axios')
  const debug = require('debug')('CLIENT:Uploader')
  const switchAlert = (store, active, message, callback) => store.dispatch('ALERT_SWITCH', { active, message, callback, type: 'info' })
  export default {
    name: 'Uploader',
    components: {
      FilePond,
      MidiaPreviewer,
      Spinner,
      UploaderLayout
    },
    computed: {
      uploadButton () {
        return '<div class="uploader__upload-button filepond--label-action"></div>'
      }
    },
    data () {
      return {
        alert: '',
        acceptedFileTypes: [ 'image/*', 'video/*', 'audio/*'  ],
        file: undefined,
        filesUploaded: [],
        isEmpty: true,
        isMounted: false,
        isUploading: false,
        itemName: '', 
        itemSize: 0,
        server: {
          url: '/',
          process: (fieldName, file, metadata, load, error, progress, abort) => {
            const formData = new FormData()
            formData.append('filepond-file', file, file.name)

            axios.post(`/api/asset/process/${this.location}`, formData, {
              onUploadProgress: e => {
                progress(e.lengthComputable, e.loaded, e.total)
              }
            })
            .then(res => {
              debug('Processing temp file successfully.', res)
              this.$emit('update:fileObj', res.data)
              load(res.request.responseText)
            })
            .catch(err => {
              error('Processing temp asset in fail.', err)
            })
            
            return {
              abort: () => {
                request.abort()
                abort()
              }
            }
          },          
          revert: (uniqueFileId, load, error) => {
            debug('Going to rever tmp file:', uniqueFileId)
            axios.delete('/api/asset/revert', {
              data: JSON.parse(uniqueFileId)
            }).then(response => {
              debug('Deleting temp asset successfully.')
              load()
            }).catch(err => {
              error('Deleting temp asset in fail.', err)
            })            
          },          
          remove: (source, load, error) => {
            debug('Local file gets replaced.', source)
            load()
          },
          restore: null,
          load: './api/asset/load?a=',      
          fetch: './api/asset/fetch?a=',       
        },
      }
    },
    methods: {
      init () {
        debug('inited!!!')
        debug('existed url', `${this.destination}.${this.fileId}`)
        debug('files',  this.$refs.pond.getFiles())
      },
      calcSize (bytes) {
        return numeral(bytes).format('0 b')
      },
      addfile(error, file) {
        debug('file loaded', error, file)
        if (!error) {
          // this.isEmpty = true
          this.file = file
          this.itemName = get(file, 'file.name')
          this.itemSize = get(file, 'file.size')
        } else {
          // this.isEmpty = false
          this.file = null
          this.itemName = ''
          this.itemSize = 0
          if (get(file, 'main') === 'File is of invalid type') {
            switchAlert(this.$store, true, this.$t('EDITOR.UPLOADER.INCORRECT_FILE_TYPE'), () => {})
          } else {
            switchAlert(this.$store, true, this.$t('EDITOR.UPLOADER.INCORRECT_FILE_TYPE'), () => {})
          }
          this.$refs.pond.removeFile()
          console.error(file)
        }
      },
      onupdatefiles (items) {
        debug('done', this.$refs.pond.getFiles(), items)
        if (items.length === 0) {
          this.isEmpty = true
          this.file = null
          this.itemName = ''
          this.itemSize = 0  
        } else {
          this.isEmpty = false
        }
      },
      removeFile () {
        this.fileObj && axios.delete('/api/asset/revert', {
          data: this.fileObj
        }).then(response => {
          debug('Deleting temp asset successfully.')
        }).catch(err => {
          debug('Deleting temp asset in fail.', err)
        })         
        this.$refs.pond && this.$refs.pond.removeFile()
      },
    },
    mounted () {
      debug('height should be ', this.$el.clientHeight)
      debug('${this.destination}.${this.fileId}', `${this.destination}.${this.fileId}`)
      this.destination && this.fileId && this.filesUploaded.push({
        source: `${this.destination}${this.fileId}`,
        options: {
          /**
           *  type:
           *  - remote: file would be loaded by fetch
           *  - local: file would be loaded by load
           *  - limbo: file would be loaded by restore(means this file is a temp file)
           */
          type: `${this.destination}${this.fileId}`.indexOf('http') === 0 ? 'remote' : 'local'
        }
      })
      this.isMounted = true
    },
    props: {
      destination: {},
      fileObj: {},
      fileId: {},
      location: {
        default: 'tmp'
      },
      name: {
        type: String,
        default: `uploader-${Date.now().toString()}`
      },
      theme: {},
    },
  }
</script>
<style lang="stylus" scoped></style>