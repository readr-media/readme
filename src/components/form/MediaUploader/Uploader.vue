<template>
  <div class="uploader" :class="{ full: !isEmpty }">
    <div class="uploader__item-remover" :class="{ full: !isEmpty }" @click="removeFile"></div>
    <FilePond
      v-if="$store.state.isClientSideMounted && isMounted"
      ref="pond"
      :server="server"
      :class="{ full: !isEmpty }"
      :allowMultiple="false"
      :name="name"
      :labelIdle="`${uploadButton}${$t('EDITOR.UPLOADER.TOOLTIP')}`"
      :ignoredFiles="ignoredFiles"
      :files="filesUploaded"
      @updatefiles="onupdatefiles"
      @init="init"/>
  </div>
</template>
<script>
  import Spinner from 'src/components/Spinner.vue'

  /** import file uploader lib */
  import vueFilePond from 'vue-filepond'
  import 'filepond/dist/filepond.min.css'
  import 'filepond-plugin-image-preview/dist/filepond-plugin-image-preview.min.css'
  import FilePondPluginFileValidateType from 'filepond-plugin-file-validate-type'
  import FilePondPluginImagePreview from 'filepond-plugin-image-preview'
  const FilePond = vueFilePond(FilePondPluginFileValidateType, FilePondPluginImagePreview)
  
  const debug = require('debug')('CLIENT:Uploader')
  export default {
    name: 'Uploader',
    components: {
      FilePond,
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
        filesUploaded: [],
        ignoredFiles: [ '.ds_store', 'thumbs.db', 'desktop.ini' ],
        isEmpty: true,
        isMounted: false,
        isUploading: false,
        server: {
          url: '/',
          process: null,
          load: './api/assets/load?a=',
          fetch: './api/assets/fetch?a=',       
        },
        title: '', 
      }
    },
    methods: {
      init () {
        debug('inited!!!')
        debug('existed url', this.url)
        debug('files',  this.$refs.pond.getFiles())
        this.url && this.$refs.pond.addFiles(this.url, {
          type: this.url.indexOf('http') === 0 ? 'remote' : 'local'
        }).catch(err => {
          debug('Error occurred when fetching file from', this.url)
        })
      },
      onupdatefiles (items) {
        debug('done', this.$refs.pond.getFiles())
        this.isEmpty = items.length === 0
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
    watch: {
      'isMounted': function () {
        debug('isMounted = true!!!!')
      }
    }
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
    &__item-remover
      position absolute
      right -15px
      top -15px
      height 38px
      width 38px
      background-color #fff
      border-radius 50%
      box-shadow 2px 2px 10px rgba(0,0,0,0.1)
      z-index 10
      display none
      cursor pointer
      &.full
        display block
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