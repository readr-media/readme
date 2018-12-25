<template>
  <div class="asset-picker" @click="openPicker">
    <div class="asset-picker__preview" v-if="file" >
      <div class="content">
        <MidiaPreviewer :file="file"></MidiaPreviewer>
        <div class="remover" @click.stop="renmove"></div>
      </div>
      <div class="info">
        <div class="name"><span v-text="filename"></span></div>
        <div class="size"><span v-text="calcFileSize(filesize)"></span></div>
      </div>
    </div>
    <div class="asset-picker__wrapper" :class="{ grey: theme === 'grey' }" v-else>
      <template v-if="!isLoading">
        <div class="asset-picker__upload-button"></div>
        <div class="asset-picker__desc"><span v-text="$t('EDITOR.ASSET_PICKER.DESCRIPTION')"></span></div>
      </template>
      <template v-else>
        <Spinner :show="true"></Spinner>
      </template>
    </div>
  </div>
</template>
<script>
  import AssetPickerPanel from './AssetPickerPanel.vue'
  import MidiaPreviewer from 'src/components/common/MidiaPreviewer.vue'
  import Spinner from 'src/components/Spinner.vue'
  import axios from 'axios'
  import numeral from 'numeral'
  import { calcFileSize } from 'src/util/comm'
  import { get, last } from 'lodash'
  const debug = require('debug')('CLIENT:AssetPicker')
  const openPicker = (store, callback) => store.dispatch('COMMON_LIGHTBOX_SWITCH', {
    active: true,
    component: AssetPickerPanel,
    callback,
  })
  export default {
    name: 'AssetPicker',
    components: {
      AssetPickerPanel,
      MidiaPreviewer,
      Spinner
    },
    data () {
      return {
        file: undefined,
        filename: '',
        filesize: 0,
        isLoading: false
      }
    },
    methods: {
      calcFileSize,
      preparePreviewData (value) {
        this.file = undefined
        this.isLoading = true
        const assetUrl = get(value, 'desktop')
        debug('value', value)
        debug('assetUrl', assetUrl) 
        if (assetUrl) {
          return axios.get('/api/asset/fetch?a=' + assetUrl, {
            responseType: 'arraybuffer',
          }).then(response => {
            debug('response', response)
            this.isLoading = false
            this.filename = last(assetUrl.split('/'))
            this.filesize = numeral(get(response, 'headers.content-length')).value()
            
            const file = new Blob([response.data], {
              name: this.filename,
              type: get(response, 'headers.content-type'),
              size: this.filesize,
            })
            this.file = { file, source: assetUrl }
            this.$emit('update:value', assetUrl)
          })
          .catch(error => {
            this.isLoading = false
            this.filename = ''
            this.filesize = 0
            this.$emit('update:value', '')
            console.error(error) 
          })          
        }
        return   
      },
      openPicker () {
        openPicker(this.$store, this.preparePreviewData)
      },
      renmove () {
        this.$emit('update:value', '')
        this.filename = ''
        this.filesize = 0
        this.file = undefined
      }
    },
    mounted () {
      this.value && this.preparePreviewData({
        desktop: this.value
      })
    },
    props: {
      theme: {},
      value: {}
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
  .asset-picker
    min-height 185px
    max-width 340px
    width 100%
    &__wrapper
      background-color #fff
      min-height 185px
      display flex
      justify-content center
      align-items center
      flex-direction column
      cursor pointer
      &.grey
        background-color #f7f7f7      
    &__preview
      .content
        height 185px
        position relative
        .remover
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
          background-image url(/public/icons/icon_close.png)
          background-position center center
          background-size contain
          background-repeat no-repeat          
      .info
        margin-top 10px
        font-weight normal
        font-style normal
        font-stretch normal
        line-height normal
        letter-spacing normal
        .name
          font-size 0.875rem
          color #000
          overflow hidden
          white-space nowrap
          text-overflow ellipsis
        .size
          font-size 0.75rem
          color #3f3f3f      
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
    &__desc
      font-size 1rem
      font-weight normal
      font-style normal
      font-stretch normal
      line-height normal
      letter-spacing normal
      color #a0a0a0
</style>