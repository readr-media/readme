<template>
  <div class="value-setter" v-if="active">
    <div class="value-setter__container">
      <div class="title"><span v-text="$t('EDITOR.QUILLEDITOR.VALUE_SETTER.TITLE.EMBED')"></span></div>
      <div class="value">
        <TextareaInput
          :autoHeightActive="true"
          :placeholder="$t('EDITOR.QUILLEDITOR.VALUE_SETTER.TITLE.EMBED')"
          :value.sync="val"></TextareaInput>
      </div>
      <div class="actions">
        <div class="cancel btn" @click="cancel">
          <span v-text="$t('EDITOR.QUILLEDITOR.VALUE_SETTER.CANCEL')"></span>
        </div>      
        <div class="confirm btn" @click="confirm">
          <span v-text="$t('EDITOR.QUILLEDITOR.VALUE_SETTER.CONFIRM')"></span>
        </div>      
      </div>
    </div>
  </div>
</template>
<script>
  import TextareaInput from 'src/components/form/TextareaInput.vue'
  import sanitizeHtml from 'sanitize-html'
  import { get, } from 'lodash'
  const debug = require('debug')('CLIENT:ValueSetter')
  const setUpValue = (store, { active, type, value }) => store.dispatch('SET_VALUE', { active, type, value })
  export default {
    name: 'ValueSetter',
    components: {
      TextareaInput,
    },
    computed: {
      active () {
        return get(this.$store, 'state.valueSetter.active')
      },
      type () {
        return get(this.$store, 'state.valueSetter.type')
      },
      value () {
        return get(this.$store, 'state.valueSetter.value')
      },
    },
    data () {
      return {
        isProcessing: false,
        val: '',
        whitelist: [ 'www.youtube.com', 'dev.readr.tw', 'www.readr.tw', 'cloud.highcharts.com', 'public.flourish.studio' ]
      }
    },
    methods: {
      cancel () {
        setUpValue(this.$store, { active: false, type: '', value: '' })
      },
      confirm () {
        debug('this.isProcessing', this.isProcessing)
        if (this.isProcessing) { return }
        if (this.type === 'readme-embed') {
          const value = this.validateEmbed()
          return value
            ? setUpValue(this.$store, { active: true, type: '', value })
            : alert(`Only source from "${this.whitelist.join(', ')}" with https are valid.`)
        }
        setUpValue(this.$store, { active: true, type: '', value: this.val })
        this.isProcessing = true
      },
      validateEmbed () {
        /**
         * Filter unallowed content here.
         */
        const exp_valid_src = new RegExp(`^https:\/\/(${this.whitelist.join('|')})`)
        let isEmbedValid = true
        
        const sanitizeHtmlOptions = {
          allowedAttributes: Object.assign({}, sanitizeHtml.defaults.allowedAttributes, {
            iframe: [ 'frameborder', 'scrolling', 'allowfullscreen', 'src', 'width', 'height', 'allow', 'style' ],
            /**
             * Notice: <script> can only be set with attribute 'src'
             */
            script: [ 'src' ],
            div: [ 'style' ],
            a: [ 'class', 'href', 'target', 'style' ],
            img: [ 'alt', 'src', 'style' ],
          }),
          allowedIframeHostnames: this.whitelist,
          allowedTags: [ 'img', 'strong', 'h1', 'h2', 'figcaption', 'em', 'blockquote', 'a', 'iframe', 'script', 'div' ],
          customContentBreakTagName: 'hr',
          transformTags: {
            'iframe': function (tagName, attribs) {
              return {
                tagName,
                attribs: Object.assign(attribs, {
                  allowfullscreen: 'allowfullscreen',
                }),
              }
            },
            'script': function (tagName, attribs) {
              /**
               * Notice:
               * - There's nothing could be embraced in script, so text would be setup to empty.
               * - Source should be maintained in whitelist.
               * - Source should be go with https protocol.
               */
              const src = get(attribs, 'src', '')
              const isSrcValid = exp_valid_src.test(src)

              return {
                tagName,
                text: '',
                attribs: Object.assign(attribs, {
                  src: isSrcValid ? src : '' ,
                }),
              }
            },
            'a': function (tagName, attribs) {
              /**
               * Notice:
               * - Source should be maintained in whitelist.
               * - Source should be go with https protocol.
               */
              const href = get(attribs, 'href', '')
              const isSrcValid = exp_valid_src.test(href)

              return {
                tagName,
                attribs: Object.assign(attribs, {
                  href: isSrcValid ? href : '' ,
                }),
              }
            }
          },
          exclusiveFilter: function (frame) {
            if (((frame.tag === 'script' || frame.tag === 'iframe') && !get(frame.attribs, 'src', '').trim())
              || (frame.tag === 'a' && !get(frame.attribs, 'href', '').trim())) {
              isEmbedValid = false
              return true
            }
            return false
          }
        }
        const val = sanitizeHtml(this.val, sanitizeHtmlOptions)        
        return isEmbedValid && val
      }
    },
    mounted () {
      this.val = this.value
    },
    watch: {
      active () {
        if (!this.active) {
          this.isProcessing = false
          this.val = this.value
        }
      }
    },
  }
</script>
<style lang="stylus" scoped>
  .value-setter
    position fixed
    z-index 9999
    top 0
    left 0
    width 100vw
    height 100vh
    background-color rgba(0, 0, 0, 0.7)
    display flex
    justify-content center
    align-items center
    &__container
      width 500px
      padding 30px 30px 25px
      background-color #f1f1f1
      border-radius 4px
      .title
        font-size 1.5rem
        font-weight 600
      .value
        margin-top 20px
        min-height 50px
        max-height 50vh
        overflow auto
      .actions
        margin-top 30px
        text-align right
        .btn
          cursor pointer
          display inline-flex
          justify-content center
          align-items center
          height 36px
          background-color #0db9c9
          color #fff
          padding 0 20px
          border-radius 4px
          margin-left 20px
</style>