<template>
  <div class="textarea-container">
    <textarea rows="4" cols="50"
      v-model="current"
      :placeholder="placeholder"></textarea>
  </div>
</template>
<script>
  import validator from 'validator'
  export default {
    name: 'TextareaInput',
    data () {
      return {
        current: '',
      }
    },
    methods: {},
    mounted () {
      this.current = this.value
    },
    props: [ 'placeholder', 'value' ],
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
    background-color #fff
    textarea
      width 100%
      border none
      outline none
      font-size 1.125rem
      font-weight 100
      padding 5px 10px
      resize none
      line-height normal
      &::-webkit-input-placeholder
        color #bdbdbd
        font-weight 100
</style>