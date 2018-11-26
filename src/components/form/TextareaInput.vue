<template>
  <div class="textarea-container" :style="{ height: autoHeightActive && autoHeight }">
    <textarea
      v-model="current"
      ref="textarea"
      @keyup="autosize"
      @keydown="autosize"
      :style="{
        backgroundColor,
        height: autoHeightActive ? autoHeight : height,
      }"      
      :placeholder="placeholder"></textarea>
  </div>
</template>
<script>
  import validator from 'validator'
  const debug = require('debug')('CLIENT:TextareaInput')
  export default {
    name: 'TextareaInput',
    data () {
      return {
        current: '',
        autoHeight: '',
      }
    },
    methods: {
      autosize(){
        debug('autosize')
        this.autoHeight = 'auto'
        this.autoHeight = this.$refs[ 'textarea' ].scrollHeight + 'px'
      }
    },
    mounted () {
      this.current = this.value
      this.autosize()
    },
    props: {
      backgroundColor: {},
      placeholder: {},
      value: {},
      height: {
        type: String,
      },
      autoHeightActive: {
        type: Boolean,
        default: false,
      },
    },
    watch: {
      current: function () {
        this.$emit('update:value', validator.trim(`${this.current}` || '') || undefined)
      }
    }
  }
</script>
<style lang="stylus" scoped>
  .textarea-container
    width 100%
    min-height 100%
    background-color #fff
    textarea
      min-height 100%
      width 100%
      border none
      outline none
      font-size 1.125rem
      font-weight 100
      padding 5px 10px
      resize none
      line-height normal
      overflow hidden
      box-sizing border-box
      &::-webkit-input-placeholder
        color #bdbdbd
        font-weight 100
</style>