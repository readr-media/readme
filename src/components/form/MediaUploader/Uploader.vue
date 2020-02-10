<template>
  <UploaderLayout :class="{ full: !isEmpty }">
    <template v-if="!isEmpty">
      <div class="uploader__item--remover" @click="removeFile"></div>
      <MidiaPreviewer class="uploader__item--previewer" :file="file"></MidiaPreviewer>
      <div class="uploader__item--info">
        <div class="name"><span v-text="itemName"></span></div>
        <div class="size"><span v-text="calcFileSize(itemSize)"></span></div>
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
      maxFileSize="10MB"
      :files="filesUploaded"
      @updatefiles="onupdatefiles"
      @addfile="addfile"
      @init="init"
    />
    <div class="uploader__spinner" v-show="isLoading"><Spinner :show="isLoading"></Spinner></div>
  </UploaderLayout>
</template>
<script>
  import MidiaPreviewer from 'src/components/common/MidiaPreviewer.vue'
  import Spinner from 'src/components/Spinner.vue'
  import UploaderLayout from './UploaderLayout.vue'
  import { calcFileSize } from 'src/util/comm'
  import { get } from 'lodash'

  /** import file uploader lib */
  import vueFilePond from 'vue-filepond'
  import 'filepond/dist/filepond.min.css'
  import FilePondPluginFileValidateType from 'filepond-plugin-file-validate-type'
  import FilePondPluginFileValidateSize from 'filepond-plugin-file-validate-size'
  const FilePond = vueFilePond(FilePondPluginFileValidateType, FilePondPluginFileValidateSize)

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
        file: undefined,
        filesUploaded: [],
        isEmpty: true,
        isLoading: false,
        isMounted: false,
        isUploading: false,
        itemName: '', 
        itemSize: 0,
        server: {
          url: '/',
          process: (fieldName, file, metadata, load, error, progress, abort) => {
            const formData = new FormData()
            formData.append('filepond-file', file, file.name)

            const CancelToken = axios.CancelToken
            const source = CancelToken.source()

            axios.post(`/api/asset/process/${this.location}`, formData, {
              cancelToken: source.token,
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
              if (axios.isCancel(err)) {
                console.error('Request canceled', err.message)
              } else {
                // handle error
              }              
              error('Processing temp asset in fail.', err)
            })
            
            return {
              abort: () => {
                source.cancel('Due to some problems, peration canceled.')
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
              this.$emit('update:fileObj', '')
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
        debug('files',  this.$refs.pond.getFiles())
        get(this.$refs.pond.getFiles(), 'length', 0) > 0 && (this.isLoading = true)
      },
      calcFileSize,
      addfile(error, file) {
        debug('file loaded', error, file)
        if (!error) {
          // this.isEmpty = true
          this.file = file
          this.itemName = get(file, 'file.name')
          this.itemSize = get(file, 'file.size')
          this.isEmpty = false
          debug('file should be added!', this.itemName, this.$refs.pond.getFiles())
        } else {
          // this.isEmpty = false
          this.file = null
          this.itemName = ''
          this.itemSize = 0
          this.isEmpty = true
          debug('message', error)
          const status = get(file, 'main')
          switch (status) {
            case 'File is of invalid type':
              switchAlert(this.$store, true, this.$t('EDITOR.UPLOADER.INCORRECT_FILE_TYPE'), () => {})
              break
            case 'File is too large':
              switchAlert(this.$store, true, this.$t('EDITOR.UPLOADER.SIZE_LIMIT'), () => {})
              break
            default:
              switchAlert(this.$store, true, this.$t('EDITOR.UPLOADER.ERROR'), () => {})
              break
          }
          this.$refs.pond.removeFile()
          console.error(file)
        }
        this.isLoading = false
      },
      onupdatefiles (items) {
        debug('onupdatefiles', this.$refs.pond.getFiles(), items)
      },
      removeFile () {
        this.fileObj && axios.delete('/api/asset/revert', {
          data: this.fileObj
        }).then(response => {
          debug('Deleting temp asset successfully.')
          this.$emit('update:fileObj', '')
        }).catch(err => {
          debug('Deleting temp asset in fail.', err)
        })         
        this.$refs.pond && this.$refs.pond.removeFile()
        this.isEmpty = true
      },
    },
    mounted () {
      debug('height should be ', this.$el.clientHeight)
      debug('${this.destination}.${this.fileExt}', `${this.destination}.${this.fileExt}`)
      debug('typeof(this.fileObj)', typeof(this.fileObj), this.fileObj)
      const originAsset = typeof(this.fileObj) !== 'string' || !this.fileObj 
        ? this.destination
        ? `${this.destination}${this.fileExt ? `.${this.fileExt}` : ''}`
        : null
        : this.fileObj

      debug('originAsset', originAsset)
      originAsset && this.filesUploaded.push({
        source: originAsset,
        options: {
          /**
           *  type:
           *  - remote: file would be loaded by fetch
           *  - local: file would be loaded by load
           *  - limbo: file would be loaded by restore(means this file is a temp file)
           */
          type: originAsset.indexOf('http') === 0 ? 'remote' : 'local'
        }
      })
      this.isMounted = true
    },
    props: {
      acceptedFileTypes: {
        default: () => [ 'image/*', 'video/*', 'audio/*' ]
      },      
      destination: {},
      fileObj: {},
      fileExt: {},
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