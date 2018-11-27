<template>
  <section class="editor news">
    <!-- <div class="editor__heading">
      <div class="editor__heading-text" v-text="$t('POST_EDITOR.EDITOR')"></div>
      <div class="editor__heading-switch" @click="$_quillEditor_toggleHtml">&lt; / &gt;</div>
    </div> -->
    <div id="toolbar" v-show="isInitialized">
      <span class="ql-formats">
        <select class="ql-color"></select>   
        <button class="ql-bold"></button>
        <button class="ql-header" value="1"></button>
        <button class="ql-header" value="2"></button>
        <button class="ql-italic" value="2"></button>
        <button class="ql-blockquote"></button>
        <button class="ql-code-block"></button>
      </span>
      <span class="ql-formats">
        <button class="ql-image"></button>
      </span>
      <span class="ql-formats">
        <button class="ql-link"></button>
        <button class="ql-video"></button>
        <button v-show="$can('editPostOg')" class="ql-hr"></button>
        <button class="ql-embed"></button>
      </span>
    </div>
    <div
      ref="quillEditor"
      :content="content"
      class="editor__quill"
      v-quill:quillEditor="editorOption"
      @change="$_quillEditor_onEditorChange($event)">
    </div>
    <div class="editor__html" v-text="content"></div>
    <input ref="uploadImg" type="file" accept="image/*" @change="$_quillEditor_uploadImg">
  </section>
</template>

<script>
import 'quill/dist/quill.core.css'
import 'quill/dist/quill.snow.css'
import 'quill/dist/quill.bubble.css'
import { get, } from 'lodash'
import {
  registerEmbed,
  registerHr,
  registerFigcaption, } from './custom.js'

const debug = require('debug')('CLIENT:QuillEditor')
const uploadImage = (store, file) => {
  return 
}
const setUpValue = (store, { active, type, value }) => store.dispatch('SET_VALUE', { active, type, value })

export default {
  name: 'QuillEditor',
  computed: {
    valueSetter () {
      return get(this.$store, 'state.valueSetter', {})
    },
  },
  data () {
    return {
      editorOption: {
        // theme: 'bubble',
        // formats: [ 'bold', 'color', 'header', 'italic', 'blockquote', 'code-block', 'link', 'image', 'video', 'hr', 'figcaption', ],
        modules: {
          toolbar: {
            container: '#toolbar',
            handlers: {
              store: this.$store,
              'image': this.$_quillEditor_imageHandler,
              'hr': this.$_quillEditor_customHrHandler,
              'embed': this.valueSetUpEmbed,
            },
          },
          clipboard: {
            matchVisual: false,
          },
        },
      },
      isInitialized: false,
    }
  },
  mounted () {
    const descImageHint = this.$t('EDITOR.QUILLEDITOR.IMAGE.DESCRIPTION')
    Promise.all([
      registerEmbed(),
      registerHr(),
      registerFigcaption(descImageHint)
    ]).then(() => {
      this.isInitialized = true
    })
  },
  methods: {
    $_quillEditor_customHrHandler () {
      // if (this.$can('editPostOg')) {
        const range = this.quillEditor.getSelection()
        this.quillEditor.insertEmbed(range.index, 'hr', 'null')
      // }
    },
    $_quillEditor_imageHandler () {
      this.$refs.uploadImg.click()
    },
    $_quillEditor_insertToEditor (url) {
      const range = this.quillEditor.getSelection()
      this.quillEditor.insertEmbed(range.index, 'image', url)
      this.quillEditor.insertEmbed(range.index + 1, 'figcaption', 'null')
    },
    $_quillEditor_onEditorChange (event) {
      debug('change', event.html)
      if (event.html) {
        this.$emit('update:content', event.html)
      }
    },
    $_quillEditor_toggleHtml (event) {
      event.target.parentNode.parentNode.classList.toggle('showHtml')
    },
    $_quillEditor_uploadImg () {
      const file = this.$refs.uploadImg.files[0]
      if (/^image\//.test(file.type)) {
        const fd = new FormData()
        fd.append('image', file)
        uploadImage(this.$store, fd)
          .then((res) => {
            this.$_quillEditor_insertToEditor(res.body.url)
          })
          .catch((err) => {
            console.error(err)
          })
      }
    },
    valueSetUpEmbed () {
      debug('call valueSetter')
      setUpValue(this.$store, { active: true, type: 'embed', value: '' })
    },
  },
  props: {
    content: {
      default: '',
    },
  },  
  watch: {
    content () {
      debug('MUTATION DETECTED: content', this.content)
    },
    'valueSetter.value': function () {
      debug('this.valueSetter.value', this.valueSetter.value)

      if (!this.valueSetter.value || !this.valueSetter.active) { return }
      this.quillEditor.focus()
      const range = this.quillEditor.getSelection()
      this.quillEditor.insertEmbed(range.index, 'embed', this.valueSetter.value)   

      setUpValue(this.$store, { active: false, type: '', value: '' })
    },
    'valueSetter.type': function () {
      debug('change!valueSetter.type')
    },
  },
}
</script>

<style lang="stylus" scoped>
  .editor
    position relative
    margin-top 15px
    width 100%
    background-color white
    border-radius 4px

    >>> .ql-toolbar
      .ql-picker-label
        outline none
      &.ql-snow
        border none
        border-bottom 1px solid #f1f1f1
    >>> .ql-container
      .ql-color-label.ql-stroke
        stroke #00ff00
      // &.ql-bubble
      //   overflow visible
      &.ql-snow
        border none      
    >>> .ql-hr
      width 54px
      &:after
        content 'More'
    >>> .ql-embed
      width 54px
      &:after
        content 'Embed'
    >>> hr
      height 0px
      margin-top 5px
      margin-bottom 5px
    >>> figcaption
      color #b3b3b1
      font-size .75rem
      font-weight 400
    > input
      display none
    &.showHtml
      .editor__heading-switch
        background-color #d8ca21
      .editor__quill
        width 50%
      .editor__html
        display block
    &__heading
      display flex
      height 20px
      padding-left 10px
      color #fff
      font-size .875rem
      line-height 20px
      background-color #000
      &-text
        flex 1
        user-select none
      &-switch
        width 50px
        text-align center
        background-color #808080
        cursor pointer
        user-select none
        
    &__quill
      height 380px
      font-size 1rem
      // overflow-y auto
      overflow visible
      >>> img
        max-width 50%
      p:has(img)
        color red
    &__html
      display none
      position absolute
      right 0
      bottom 0
      width 50%
      height 380px
      padding 10px
      border-right 1px solid #d3d3d3
      border-bottom 1px solid #d3d3d3
</style>
