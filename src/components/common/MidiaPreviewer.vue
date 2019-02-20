<template>
  <div class="media-previewer" v-show="file">
    <template v-if="file">
      <img class="media-previewer__img" v-if="isImg"
        :src="preImgSrc || preImgByte">
      <div class="media-previewer__vid" v-else-if="isVid">
        <video width="100%" height="100%" controlsList="nodownload" preload="metadata">
          <source :src="preMediaSource" :type="fileType">
        </video>
      </div>
      <div class="media-previewer__aud" v-else-if="isAud">
        <audio ref="audio" preload="metadata" controls timeupdate="false">
          <source :src="preMediaSource" :type="fileType">
        </audio>      
      </div>
    </template>
  </div>
</template>
<script>
  import { IMAGE_SIZE } from 'src/constants'
  import { get, map } from 'lodash'
  const debug = require('debug')('CLIENT:MidiaPreviewer')

  export default {
    name: 'MidiaPreviewer',
    computed: {
      isAud () {
        const exp_img = /^audio\//
        return exp_img.test(this.fileType)
      },
      isImg () {
        const exp_img = /^image\//
        return exp_img.test(this.fileType)
      },
      isVid () {
        const exp_img = /^video\//
        return exp_img.test(this.fileType)
      },
      fileType () {
        return get(this.file, 'file.type')
      },
    },
    data () {
      return {
        preImgByte: null,
        preImgSrc: null,
        preImgSrcset: null,
        preMediaSource: '',
      }
    },
    methods: {
      prepareFileData () {
        if (!this.file) { return }

        this.preMediaSource = ''
        this.preImgByte = null

        if (this.isImg) {
          if (get(this.file, 'destination')) {
            this.preImgSrc = `${get(this.file, 'destination')}-mobile@2x.${get(this.file, 'fileExtension')}`
            return
          }
          const file = get(this.file, 'file')
          if (FileReader && file) {
            const fr = new FileReader()
            fr.onload = () => {
              this.preImgByte = fr.result
            }
            fr.readAsDataURL(file)
          }        
        } else if (this.isVid || this.isAud) {
          this.preMediaSource = typeof(get(this.file, 'source')) === 'string' ? get(this.file, 'source') : ''
        }
      },
    },
    mounted () {
      debug('file', this.file)
      this.prepareFileData()
    },
    props: {
      file: {},
    },
    watch: {
      file () {
        debug('file', this.file)
        this.prepareFileData()
      }
    },
  }
</script>
<style lang="stylus" scoped>
.media-previewer
  width 100%
  height 100%
  background-color #eee
  &__img
    height 100%
    width 100%
    object-position center center
    object-fit contain
  &__aud
    height 100%
    width 100%
    display flex
    align-items center
    audio
      height 34px
      width 100%
      &::-webkit-media-controls-enclosure
        background-color #a0a0a0
        border-radius 4px
        min-height 24px
      &::-webkit-media-controls-current-time-display
        , &::-webkit-media-controls-time-remaining-display
        , &::-webkit-media-controls-mute-button
        display none
      &::-internal-media-controls-overflow-button
        display none
  
  &__vid
    position relative
    width 100%
    height 100%
    &::after
      content ''
      display block
      position absolute
      height 60px
      width 60px
      top 50%
      left 50%
      margin-top -30px
      margin-left -30px
      background-color #fff
      background-image url(/public/icons/icon_play-video.png)
      background-position center center
      background-size contain
      background-repeat no-repeat
      z-index 1
      border-radius 50%
      cursor pointer
    &::before
      content ''
      display block
      height 100%
      width 100%
      position absolute
      top 0
      left 0
      opacity 0.5
      background-color #000
</style>