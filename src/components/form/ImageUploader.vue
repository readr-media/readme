<template>
  <div class="upload-image">
    <div class="upload-image__name">
      <div class="title" v-text="title"></div>
      <div class="desc"><span v-text="$t('IMAGE_UPLOADER.SIZE_LIMIT')"></span></div>
      <div class="alert"><span v-text="alert"></span></div>
      <div class="filename"></div>
    </div>
    <div class="upload-image__container" @click="uploadImage">
      <img class="upload-image__thumbnail" alt="thumbnail" ref="thumbnail"
        v-if="(!isImgEmpty || preImgByte) && !isUploading"
        :src="preImgByte"
        :class="{ notEmpty: !isImgEmpty }">
      <div class="upload-image__upload" v-else-if="!isUploading"></div>
      <Spinner class="upload-image__spinner" :show="isUploading"></Spinner>
    </div>
  </div>
</template>
<script>
  import { get } from 'lodash'
  import Spinner from 'src/components/Spinner.vue'

  const debug = require('debug')('CLIENT:UploadImage')
  const uploadImage = (store, file) => {
    debug('file', file)
    return store.dispatch('UPLOAD_IMAGE', { file, type: 'post' })
  }
  // const deleteImage = (store, file) => {
  //   return store.dispatch('DELETE_IMAGE', { file, type: 'post' })
  // }

  export default {
    name: 'ImageUploader',
    components: {
      Spinner
    },
    computed: {
      alert () {
        return this.alert_type && this.$t(`IMAGE_UPLOADER.${this.alert_type}`)
      },
      isImgEmpty () {
        debug('this.thumbnailPath', this.imageUrl)
        debug('this.thumbnailPath ? true : false', this.imageUrl ? true : false)
        return this.imageUrl ? false : true
      },
    },
    data () {
      return {
        alert_type: '',
        isUploading: false,
        preImgByte: null
      }
    },
    methods: {
      uploadImage () {
        const saveImage = (file) => {
          const fd = new FormData()
          const fileExt = file.type.split('image/')[1]
          fd.append('image', file, `project-${Math.random()}.${fileExt}`)
          debug('fd', fd)
          uploadImage(this.$store, fd)
            .then((res) => {
              // this.thumbnailPath = get(res, 'body.url')
              this.isUploading = false
              // this.isImgEmpty = false
              debug('res', res)
              debug('thumbnailPath',get(res, 'body.url'))
              this.$emit('update:imageUrl', get(res, 'body.url'))
            })
            .catch((err) => {
              this.isUploading = false
              console.log(err)
            })
        }

        const input = document.createElement('input')
        input.setAttribute('type', 'file')
        input.setAttribute('accept', 'image/*')
        input.click()
        input.onchange = (e) => {
          this.isUploading = true
          this.alert_type = ''        
          const file = input.files[0]
          debug('file0', file)
          if (/^image\//.test(file.type)) {
            // deleteImage(this.$store, this.thumbnailFilePath)
            debug('Going to uppload image.')
            const targ = e.target || window.event.srcElement
            const files = targ.files

            if (FileReader && files && files.length) {
              const fr = new FileReader()
              fr.onload = () => {
                this.preImgByte = fr.result
              }
              fr.readAsDataURL(files[0]);
            }

            if (file.size <= 3145728) {
              saveImage(file)
            } else {
              console.log(`file size is ${file.size} bytes bigger than 3MB`)
              this.isUploading = false
              this.alert_type = 'too_big'
            }
          }
        }
      },
    },
    mounted () {
      this.preImgByte = this.imageUrl
    },
    props: {
      title: {},
      imageUrl: {},
    },
    watch: {
      imageUrl () {
        debug('Mutation detatected: imageUrl', this.imageUrl)
      },
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
  .upload-image
    display flex
    position relative
    // align-items center
    &__container
      flex 1
      background-color #fff
      height 80px
      display flex
      align-items center
      justify-content center
      padding 10px 10px
      position relative
      cursor pointer
    &__thumbnail
      // border 1px solid #b5b5b5
      height 50%
      object-position center center
      object-fit contain
      &.notEmpty
        height 100%
        width 100%        
    &__upload
      r = 38px
      width r
      height r
      background-color #808080
      border-radius r
      box-shadow 0 1px 2px 0 rgba(0, 0, 0, 0.5)
      &:before
        @extends $plus-sign
        width 24px
        height 4px
      &:after
        @extends $plus-sign
        width 4px
        height 24px
    &__name
      min-width 80px
      max-width 80px
      margin-right 15px
      .title
        font-size 1.25rem
      .desc
        margin 5px 0
        font-size 0.75rem
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
</style>
