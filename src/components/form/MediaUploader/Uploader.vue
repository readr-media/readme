<template>
  <div class="uploader" :class="{ full: !isEmpty }">
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
  </div>
</template>
<script>
  import MidiaPreviewer from './MidiaPreviewer.vue'
  import Spinner from 'src/components/Spinner.vue'
  import numeral from 'numeral'
  import { get } from 'lodash'

  /** import file uploader lib */
  import vueFilePond from 'vue-filepond'
  import 'filepond/dist/filepond.min.css'
  import FilePondPluginFileValidateType from 'filepond-plugin-file-validate-type'
  const FilePond = vueFilePond(FilePondPluginFileValidateType)

  const debug = require('debug')('CLIENT:Uploader')
  const switchAlert = (store, active, message, callback) => store.dispatch('ALERT_SWITCH', { active, message, callback, type: 'info' })
  export default {
    name: 'Uploader',
    components: {
      FilePond,
      MidiaPreviewer,
      Spinner
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
          process: null,
          load: './api/asset/load?a=',      
          fetch: './api/asset/fetch?a=',       
        },
      }
    },
    methods: {
      init () {
        debug('inited!!!')
        debug('existed url', this.url)
        debug('files',  this.$refs.pond.getFiles())
        this.url && this.$refs.pond.addFiles(this.url, {
          type: this.url.indexOf('http') === 0 ? 'remote' : 'local'
        }).then(() => {
        }).catch(err => {
          debug('Error occurred when fetching file from', this.url, err)
        })
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
          // this.$refs.pond.removeFile()
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
        this.$refs.pond && this.$refs.pond.removeFile()
      },
    },
    mounted () {
      debug('height should be ', this.$el.clientHeight)
      this.isMounted = true
    },
    props: {
      name: {
        type: String,
        default: `uploader-${Date.now().toString()}`
      },
      theme: {},
      url: {},
    },
  }
</script>
<style lang="stylus" scoped>
  $plus-sign
    content ''
    background-color white
    position absolute
    top 0
    bottom 0
    left 0
    right 0
    margin auto
  .uploader
    display flex
    position relative
    min-height 185px
    &.full
      justify-content center
      align-items center
      background-color #eee
      margin-bottom 40px
    &__item
      &--previewer
        position absolute
        top 0
        left 0
        height 100%
        width 100%
        z-index 0
      &--info
        position absolute
        top 100%
        left 0
        margin-top 10px
        min-height 40px
        width 100%
        font-weight normal
        font-style normal
        font-stretch normal
        line-height normal
        letter-spacing normal
        .name
          font-size 0.875rem
          color #000
        .size
          font-size 0.75rem
          color #3f3f3f

      &--remover
        position absolute
        right -15px
        top -15px
        height 38px
        width 38px
        background-color #fff
        border-radius 50%
        box-shadow 2px 2px 10px rgba(0,0,0,0.1)
        z-index 10
        cursor pointer
    >>> &__upload-button
      r = 38px
      width r
      height r
      min-width r
      min-height r      
      background-color #808080
      border-radius r
      box-shadow 0 1px 2px 0 rgba(0, 0, 0, 0.5)
      position relative
      margin 30px auto 17px
      outline none
      &.hidden
        opacity 0
      &:before
        @extends $plus-sign
        width 24px
        height 4px
      &:after
        @extends $plus-sign
        width 4px
        height 24px
    &__spinner
      position absolute
      width 50px
      height 50px
      left 50%
      top 50%
      margin-left -25px
      margin-top -25px
  >>> .filepond
    &--wrapper
      width 100%
      &.full
        .filepond--panel-root
          background-color transparent!important

        .filepond--root
          min-height 185px
          .filepond--list-scroller
            position relative
            width 100%
            height 100%
            display flex
            align-items center
            margin 0
            display none
            .filepond--list
              position relative
            .filepond--item
              position relative
    &--root
      min-height 100%
      display flex
      justify-content center
      margin-bottom 0
      overflow hidden
    &--list-scroller
      display none
    &--drop-label
      margin 40px auto
    &--action-remove-item
      opacity 1
      left auto
      right -15px
      top -15px
      background-color #fff
      width 38px
      height 38px
      box-shadow 2px 2px 10px rgba(0,0,0,0.1)
      display none
    &--file-info
      transform none!important
      // position absolute
      // top 100%
      // margin-top 10px
      // &-main
      //   color #000
      //   font-size 0.875rem
      // &-sub
      //   font-size 0.75rem
      //   color #5a5a5a
    &--list
      left 0
      width 100%
    &--image-preview-overlay-idle  
      mix-blend-mode color
    &--panel-root
      background-color #fff!important
</style>