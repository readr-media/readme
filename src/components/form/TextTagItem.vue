<template>
  <div class="input-tag-container" @click="focus">
    <div v-for="(tag, index) in tags" :key="index" class="input__tag">
      <div class="input__tag__container">
        <span v-text="getTagVal(tag)"></span>
        <a v-if="!readOnly && removeBtnActive" @click.prevent.stop="remove(index)" class="input__tag__remove"></a>
      </div>
    </div>
    <div class="input__wrapper">
      <input type="text" class="input" ref="input"
        :disabled="isTagsExceedLimit"
        :placeholder="placeholder"
        v-model="currInput"     
        @keyup.stop.prevent="keyupHandeler"
        @keydown.8="removeLastTag"
        @keypress="keypressHandler">
      <div class="autocomplete" :class="{ active: currInput }" ref="autocomplete" tabIndex="0">
        <span class="autocomplete__item"
          v-for="(item, index) in autocomplete"
          v-text="get(item, 'name')"
          @click="selectTag(index)"
          :key="`autocom-item-${get(item, 'name')}-${Date.now()}`"
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
      donothing (e) {},
      keyupHandeler (e) {
        if (e) {
          if ((e.keyCode === 40 || e.keyCode === 38) && this.currInput) {
            this.browser(e)    
            return
          } else if (this.keys.indexOf(e.keyCode) === -1 ) {
            this.$emit('update:currInput', this.currInput)
            return
          }
        }
      },
      keypressHandler (e) {
        if (e && this.keys.indexOf(e.keyCode) === -1) { return }
        if (this.currInput) {
          if (this.tags.indexOf(this.currInput) === -1) {
            const item = find(this.autocomplete, (i) => get(i, 'name').indexOf(this.currInput) > -1)
            item && this.tags.push(item)
            this.currInput = ''
          }
        }
        e.stopPropagation()
        e.preventDefault()
      },
      focus (e) {
        if (this.readOnly || isDescendant(e.target, { parant: this.$refs[ 'autocomplete' ] })) {
          return
        }
        this.$refs[ 'input' ].focus()
      },
      get,
      getTagVal (rawVal) {
        return typeof(rawVal) !== 'string' ? get(rawVal, 'name') : rawVal
      },
      browser (e) {     
        e.stopPropagation()
        e.preventDefault()
        if (e.keyCode !== 38 && e.keyCode !== 40 && e.keyCode !== 13) {
          return
        } else {
          if (e.keyCode === 40) {
            this.currAutocompleteIndex += this.currAutocompleteIndex < get(this.autocomplete, 'length', 1) - 1 ? 1 : 0
          } else if (e.keyCode === 38) {
            this.currAutocompleteIndex -= this.currAutocompleteIndex > 0 ? 1 : 0
          } if (e.keyCode === 13) {
            const item = this.autocomplete[ this.currAutocompleteIndex ]
            item && this.tags.push(item)
            this.currInput = ''
            this.$refs[ 'input' ].focus()
          }
        }
        debug('browser the autocomplete item.', e.keyCode)
      },
      remove (index) {
        this.tags.splice(index, 1)
        this.$forceUpdate()
      },
      removeLastTag (e) {
        if (this.currInput) { return }
        e.stopPropagation()
        e.preventDefault()
        this.tags.pop()
        this.$forceUpdate()
      },
      selectTag (index) {
        const item = this.autocomplete[ index ]
        item && this.tags.push(item)
        this.currInput = ''
        this.$refs[ 'input' ].focus()        
      }
    },
    mounted () {},
    props: {
      placeholder: String,
      autocomplete: Array,
      readOnly: Boolean,
      currTagValues: Array,
      tagLimitNum: {
        type: Number,
        default: Infinity,
      },
      removeBtnActive: {
        type: Boolean,
        default: false
      },
    },
    watch: {
      autocomplete: function () {
        debug('autocomplete change detected.', this.autocomplete)
        this.currAutocompleteIndex = 0
      },
      tags () {
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
    background-color #fff
    cursor text
    text-align left
    -webkit-appearance textfield
    padding 0 5px
    border-radius 4px
    .input
      &__tag
        margin 5px 5px 5px 0
        display inline-flex
        font-size 1rem
        font-weight 400
        height 35px
        align-items center

        font-size 1rem
        font-weight normal
        font-style normal
        font-stretch normal
        line-height normal
        letter-spacing normal
        text-align left
        color #000000

        &__container
          height 24px
          border-radius 12px
          background-color #e6f8f9
          padding 0 10px

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
          &:focus ~ .autocomplete.active
            display block
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
          display none
          &:focus, &:hover
            &.active
              display block
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