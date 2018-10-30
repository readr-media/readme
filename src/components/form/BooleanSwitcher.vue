<template>
  <div class="switcher ios-style-switch">
    <input type='checkbox' class='ios-style-switch__checkbox'
      @click="toggle" 
      :id="`checkbox-${id}`"
      :checked="isChecked">
    <label :for="`checkbox-${id}`" class='ios-style-switch__label'></label>
  </div>
</template>
<script>
  const debug = require('debug')('CLIENT:BooleanSwitcher')
  export default {
    name: 'BooleanSwitcher',
    data () {
      return {
        isChecked: false,
      }
    },
    methods: {
      toggle () {
        // const newStatus = !this.isChecked
        debug('Going to make isChecked to be', !this.isChecked)
        this.$emit('update:status', !this.isChecked)
      },
    },
    mounted () {
      this.isChecked = this.status
    },
    props: {
      id: {
        type: Number,
        default: () => Number(Date.now().toString())
      },
      status: {
        type: Boolean,
      },
    },
    watch: {
      status () {
        debug('this.status', this.status)
        this.isChecked = this.status
      },
    },
  }
</script>
<style lang="stylus" scoped>
  .switcher
    position relative
  .ios-style-switch
    width 28px
    height 15px
    &__checkbox
      position absolute
      opacity 0
      &:checked
        & + .ios-style-switch__label:after
          margin-left 14px
        & + .ios-style-switch__label:before
          background #6aa863
    &__label
      cursor pointer
      &:before
        content ""
        position absolute
        display block
        top 0
        width 28px
        height 15px
        border-radius 16px
        background transparent
        border 1px solid #c3c3c3
        -webkit-transition all 0.3s
        transition all 0.3s
      &:after
        content ""
        position absolute
        display block
        top 0px
        width 15px
        height 15px
        border-radius 16px
        background rgba(250,250,250,0.9)
        border 1px solid #c3c3c3
        -webkit-transition all 0.3s
        transition all 0.3s
      &:hover:after
        box-shadow 0 0 5px rgba(0, 0, 0, 0.3)</style>