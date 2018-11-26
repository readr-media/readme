<template>
  <div class="media-options">
    <div class="gen-item" @click="gen"><span v-text="$t('EDITOR.MEDIA_OPTIONS.GEN')"></span></div>
    <div class="item" v-for="(opt, index) in opts" :key="opt.id" :id="`opt-${opt.id}`">
      <div class="left">
        <div class="order">
          <TextInput
            backgroundColor="#f7f7f7"
            :placeHolder="$t('EDITOR.MEDIA_OPTIONS.ORDER')"
            :value.sync="opt.group_order"></TextInput>
        </div>
        <div class="choice-content">
          <TextareaInput
            backgroundColor="#f7f7f7"
            :autoHeightActive="true"
            :placeholder="$t('EDITOR.MEDIA_OPTIONS.ORDER')"
            :value.sync="opt.choice"></TextareaInput>
        </div>
      </div>
      <div class="right">
        <ImageUploader :imageUrl.sync="opt.image" theme="grey"></ImageUploader>
      </div>
      <div class="option-tools">
        <div class="tool del" @click="del(opt)">
          <div class="hint"><span v-text="$t('EDITOR.MEDIA_OPTIONS.DEL')"></span></div>
        </div>
        <div class="tool copy" @click="copy(opt)">
          <div class="hint"><span v-text="$t('EDITOR.MEDIA_OPTIONS.COPY')"></span></div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
  import ImageUploader from 'src/components/form/ImageUploader.vue'
  import TextInput from 'src/components/form/TextInput.vue'
  import TextareaInput from 'src/components/form/TextareaInput.vue'
  import { smoothScrollTo, } from 'kc-scroll'   
  import { get, map, remove, } from 'lodash'
  const debug = require('debug')('CLIENT:MediaOptions')
  const numeral = require('numeral')
  export default {
    name: 'MediaOptions',
    components: {
      ImageUploader,
      TextInput,
      TextareaInput,
    },
    data () {
      return {
        opts: [],
      }
    },
    methods: {
      copy (duplicated) {
        const id = Date.now()
        const copy = Object.assign({}, duplicated, { id, })
        this.opts.push(copy)
        this.goOpt(id)
      },
      del (opt) {
        remove(this.opts, (o, i) => opt === o)
        debug('this.opts', this.opts)
        this.$forceUpdate()
      },
      gen () {
        const id = Date.now()
        this.opts.push({ id, })   
        this.goOpt(id)
      },
      get,
      goOpt (id) {
        setTimeout(() => {
          smoothScrollTo({ eID: `#opt-${id}`, })
        }, 100) 
      },
    },
    mounted () {
      this.opts = this.options || [{ id: Date.now() }]
    },
    props: {
      options: {
        type: Array
      },
    },
    watch: {
      opts: {
        handler: function () {
          debug('Mutation detected: opts', this.opts)
          map(this.opts, opt => {
            opt.group_order = numeral(opt.group_order).value()
          })
          this.$emit('update:options', this.opts)
        },
        deep: true,
      },
    },
  }
</script>
<style lang="stylus" scoped>
.media-options
  .gen-item
    font-size 1rem
    font-weight normal
    font-style normal
    font-stretch normal
    line-height normal
    letter-spacing normal
    color #ffffff
    background-color #000
    display flex
    justify-content center
    align-items center
    height 36px
    width 100%
    cursor pointer
    margin-bottom 20px
    border-radius 4px
    &:hover
     background-color #222
  .item
    background-color #fff
    box-shadow 1.6px 1.2px 2px 0px rgba(0, 0, 0, 0.1)    
    padding 30px 20px
    display flex
    position relative
    border-radius 4px
    &:not(:last-child)
      margin-bottom 10px
    .left, .right
      flex 1
    .left
      display flex
      flex-direction column
      .order, .choice-content
        background-color #f7f7f7
      .choice-content
        margin-top 30px
        flex 1      
    .right
      margin-left 20px  

    &:hover
      .option-tools
        display block

    .option-tools
      position absolute
      right 100%
      padding-right 15px
      top 0
      width 40px
      display none
      .tool
        width 25px
        height 25px
        cursor pointer
        background-size contain
        background-position center center
        background-repeat no-repeat
        margin-bottom 20px
        position relative
        &.del
          background-image url(/public/icons/icon-tick.png)
        &.copy
          background-image url(/public/icons/icon-tick.png)
        &:hover
          .hint
            display flex
        .hint
          position absolute
          right calc(100% + 20px)
          top 50%
          margin-top -17px
          height 34px
          min-width 64px
          background-color #000
          display none
          justify-content center
          align-items center

          opacity 0.8
          border-radius 2px

          font-size 1rem
          font-weight normal
          font-style normal
          font-stretch normal
          line-height normal
          letter-spacing normal
          text-align left
          color #ffffff

          &:after
            position absolute
            left 100%
            top 50%
            margin-top -3px
            content ''
            border-width 3px 0 3px 10px
            border-color transparent transparent transparent #000
            border-style solid
</style>