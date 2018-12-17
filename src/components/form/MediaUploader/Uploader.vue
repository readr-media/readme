<template>
  <div class="uploader">
    <div class="uploader__container" :class="{ grey: theme === 'grey' }">
      <!--div class="uploader__upload-button"></div>
      <div class="uploader__name">
        <!--div class="title" v-html="title || $t('EDITOR.UPLOADER.TOOLTIP')"></div>
        <div class="desc">
          <span v-text="$t('EDITOR.UPLOADER.SIZE_LIMIT')"></span>
        </div>
        <div class="alert"><span v-text="alert"></span></div>
        <div class="filename"></div>
      </div>      
      <Spinner class="uploader__spinner" :show="isUploading"></Spinner-->
      <div class="uploader__upload-button" v-show="filesUploaded.length === 0"></div>
      <FilePond
        ref="pond"
        :name="name"
        :allow-multiple="false"
        :label-idle="$t('EDITOR.UPLOADER.TOOLTIP')"
        @init="handleFilePondInit"
        :files="filesUploaded"/>
    </div>
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
    data () {
      return {
        alert: '',
        filesUploaded: [],
        isUploading: false,
        title: ''
      }
    },
    methods: {
      handleFilePondInit () {
        debug('Uploader inited!')
      }
    },
    mounted () {},
    props: {
      name: {
        type: String,
        default: `uploader-${Date.now().toString()}`
      },
      theme: {}
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
    &__container
      flex 1
      background-color #fff
      border-radius 4px    
      &.grey
        background-color #f7f7f7
      // height 80px
      display flex
      align-items center
      justify-content center
      flex-direction column
      padding 10px
      position relative
      cursor pointer
      z-index 1
    &__upload-button
      r = 38px
      width r
      height r
      min-width r
      min-height r      
      background-color #808080
      border-radius r
      box-shadow 0 1px 2px 0 rgba(0, 0, 0, 0.5)
      position relative
      margin-top 30px
      margin-bottom 3px
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
    &__name
      background-color rgba(255,255,255,0.9)
      padding 10px
      border-radius 5px
      position relative
      z-index 1
      margin-top 17px
      margin-bottom 30px
      font-size 1rem
      font-weight normal
      font-style normal
      font-stretch normal
      line-height 1.5
      letter-spacing normal
      text-align center
      color #a0a0a0
      .title
        // font-size 1.25rem
      .desc
        margin 5px 0
        // font-size 0.75rem
      .alert
        margin 5px 0
        color #ff7979
        font-size 0.75rem
      // .filename
      //   color
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
      // height 100%
    // &--root
    //   height 100%!important
    // &--drop-label
    //   height 100%    
    //   label
    //     width 100%
    //     min-height 100%
    //     display flex
    //     justify-content center
    //     align-items center
    &--panel-root
      background-color #fff!important
</style>