<template>
  <div class="upload-image">
    <div class="upload-image__container" @click="uploadImage" :class="{ grey: theme === 'grey' }">
      <div class="upload-image__thumbnail" v-if="(!isImgEmpty || preImgByte) && !isUploading">
        <img alt="thumbnail" ref="thumbnail"
          :src="preImgByte"
          :class="{ notEmpty: !isImgEmpty }">
      </div>
      <div class="upload-image__upload" :class="{ hidden: !isImgEmpty }"></div>
      <div class="upload-image__name">
        <div class="title" v-text="title || $t('IMAGE_UPLOADER.TOOLTIP')"></div>
        <div class="desc">
          <span v-text="$t('IMAGE_UPLOADER.SIZE_LIMIT')"></span>
        </div>
        <div class="alert"><span v-text="alert"></span></div>
        <div class="filename"></div>
      </div>      
      <Spinner class="upload-image__spinner" :show="isUploading"></Spinner>
      <!--template >
      </template>
      <div class="upload-image__upload" v-else-if="!isUploading"></div>
      <Spinner class="upload-image__spinner" :show="isUploading"></Spinner-->
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
      theme: {
        type: String,
        default: "white"
      },
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
    min-height 185px
    // align-items center
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
    &__thumbnail
      // border 1px solid #b5b5b5
      position absolute
      top 10px
      left 0
      display flex
      justify-content center
      width 100%
      height calc(100% - 20px)
      padding 10px
      img
        // width 100%
        height 100%
        // width auto
        // width auto
        object-position center center
        object-fit contain
        // &.notEmpty
        //   // height 100%
        //   width 100%                
    &__upload
      r = 38px
      width r
      height r
      background-color #808080
      border-radius r
      box-shadow 0 1px 2px 0 rgba(0, 0, 0, 0.5)
      position relative
      margin-top 30px
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
</style>
