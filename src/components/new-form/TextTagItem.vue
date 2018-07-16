<template>
  <div class="input-tag-container" @click="focus">
    <span v-for="(tag, index) in tags" :key="index" class="input__tag">
      <span v-text="getTagVal(tag)"></span>
      <a v-if="!readOnly" @click.prevent.stop="remove(index)" class="input__tag__remove"></a>
    </span>
    <div class="input__wrapper">
      <input type="text" class="input" ref="input"
        :disabled="isTagsExceedLimit"
        :placeholder="placeholder"
        v-model="currInput"
        @keyup="keyupHandeler"
        @keypress="keypressHandler"
        @keypress.delete.stop="removeLastTag">
      <div class="autocomplete" v-show="currInput" ref="autocomplete" 
        tabIndex="0"
        @keyup="browser">
        <span class="autocomplete__item"
          v-for="(item, index) in autocomplete"
          v-text="get(item, 'name')"
          :class="{ selected: currAutocompleteIndex === index }"></span>
      </div>
    </div>
  </div>
</template>
<script>
  import { find, get } from 'lodash'
  import { isDescendant } from 'src/util/comm'

  const debug = require('debug')('CLIENT:TextTagItem')
  export default {
    name: 'TextTagItem',
    data () {
      return {
        currInput: '',
        currAutocompleteIndex: 0,
        keys: [ 13, 188, 9 ],
        // tags: [ ...this.currTagValues ],
      }
    },
    computed: {
      tags () {
        return this.currTagValues
      },
      isTagsExceedLimit () {
        return this.tags ? this.tags.length >= this.tagLimitNum : false
      }
    },
    methods: {
      keyupHandeler (e) {
        if (e) {
          if (e.keyCode === 40 && this.currInput) {
            this.$refs[ 'input' ].blur()
            this.$refs[ 'autocomplete' ].focus()
            this.browser(e)
            return
          } else if (this.keys.indexOf(e.keyCode) === -1 ) {
            this.$emit('update:currInput', this.currInput)
            return
          }
          e.stopPropagation()
          e.preventDefault()
        }
      },
      keypressHandler (e) {
        if (e && this.keys.indexOf(e.keyCode) === -1) { return }
        if (e) {
          e.stopPropagation()
          e.preventDefault()
        }
        if (this.currInput && this.tags.indexOf(this.currInput) === -1) {
          const item = find(this.autocomplete, (i) => get(i, 'name').indexOf(this.currInput) > -1)
          debug('item', item)
          debug('this.currInput', this.currInput)
          item && this.tags.push(item)
          this.currInput = ''
        }
      },
      focus (e) {
        if (this.readOnly || isDescendant(e.target, { parant: this.$refs[ 'autocomplete' ] })) {
          return
        }
        this.$refs[ 'input' ].focus()
        this.isAutocompleteActive = true
      },
      get,
      getTagVal (rawVal) {
        return typeof(rawVal) !== 'string' ? get(rawVal, 'name') : rawVal
      },
      browser (e) {
        if (e.keyCode !== 38 && e.keyCode !== 40 && e.keyCode !== 13) {
          return
        } else {
          if (e.keyCode === 40) {
            this.currAutocompleteIndex += this.currAutocompleteIndex < ((this.autocomplete ? this.autocomplete.length - 1 : 0) || 0) ? 1 : 0
          } else if (e.keyCode === 38) {
            this.currAutocompleteIndex -= this.currAutocompleteIndex > 0 ? 1 : 0
          } if (e.keyCode === 13) {
            const item = this.autocomplete[ this.currAutocompleteIndex ]
            item && this.tags.push(item)
            this.currInput = ''
            this.$refs[ 'input' ].focus()
            debug('Slected item', item)
          }
        }
        debug('browser the autocomplete item.', e.keyCode)
      },
      remove (index) {
        this.tags.splice(index, 1)
      },
      removeLastTag () {
        if (this.currInput) { return }
        this.tags.pop()
      },
    },
    mounted () {},
    // props: [ 'placeholder', 'autocomplete', 'readOnly', 'currTagValues', ],
    props: {
      placeholder: String,
      autocomplete: Array,
      readOnly: Boolean,
      currTagValues: Array,
      tagLimitNum: {
        type: Number,
        default: Infinity,
      }
    },
    watch: {
      autocomplete: function () {
        debug('autocomplete change detected.', this.autocomplete)
      },
      tags: function () {
        debug('tags change detected.')
        this.$emit('update:currTagValues', this.tags)
      },
      isTagsExceedLimit () {
        if (this.isTagsExceedLimit) {
          this.$refs[ 'input' ].blur()
        }
      }
    }
  }
</script>
<style lang="stylus">
  .input-tag-container
    // margin-top 5px
    background-color #fff
    // overflow hidden
    cursor text
    text-align left
    -webkit-appearance textfield
    padding 0 5px
    .input
      &__tag
        margin 5px 5px 5px 0
        padding 0 7px
        background-color #f5e845
        border-radius 2px
        border 1px solid #c8bf56
        color #847a00
        display inline-flex
        font-size 1rem
        font-weight 400
        height 35px
        align-items center
        &__remove
          cursor pointer
          height 100%
          display flex
          align-items center
          &::before
            content "x"
            margin-left 5px
            vertical-align text-top
      &__wrapper
        display inline-block
        vertical-align top
        position relative
        > .input
          border none
          // width 100%
          height 35px
          font-size 1.125rem
          padding 0 10px
          margin 5px 5px 5px 0
          vertical-align top
          background-color #ffffff
          outline none
          font-weight 100
          &::-webkit-input-placeholder
            color #bdbdbd
            font-weight 100
        .autocomplete
          position absolute
          top 100%
          left 0
          // width 100%
          z-index 999
          background-color #fff
          outline none
          &__item
            padding 5px 20px 5px 10px
            cursor pointer
            display block
            font-size 1rem
            line-height 1.375rem
            min-width 150px
            outline none
            &:hover
              background-color #000
              color #fff
            &.selected
              background-color #c5c5c5
              color #fff
              &:hover
                background-color #000
</style>