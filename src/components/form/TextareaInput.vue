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
    <div v-if="lengthLimit" class="remaining">
      <p v-if="remainingLength > 0">剩餘 <span v-text="remainingLength" /> 字</p>
      <p v-else class="warning">已達字數上限</p>
    </div>
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
    computed: {
      remainingLength () {
        return this.lengthLimit - this.current.length
      }
    },
    methods: {
      autosize(){
        debug('press', this.content)
        this.autoHeight = 'auto'
        this.autoHeight = this.$refs[ 'textarea' ].scrollHeight + 'px'
      }
    },
    mounted () {
      this.current = this.value || ''
      setTimeout(() => this.autosize(), 100)
    },
    props: {
      backgroundColor: {},
      lengthLimit: {},
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
      current (value) {
        debug('Mutation detected: current', this.current)
        if (this.lengthLimit && typeof value === 'string' && value.length > this.lengthLimit) {
          this.current = value.substring(0, this.lengthLimit)
        }
        this.$emit('update:value', validator.trim(`${this.current}` || '') || undefined)
      }
    }
  }
</script>
<style lang="stylus" scoped>
  .textarea-container
    position relative
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
      border-radius 4px
      &::-webkit-input-placeholder
        color #bdbdbd
        font-weight 100
  .remaining
    position absolute
    right 5px
    bottom 5px
    p
      margin 0
      &.warning
        color red
</style>