<template>
  <div class="buttonized-item" v-if="options.length" @click="handler">
    <span v-text="$t(`EDITOR.BUTTONIZED_BUTTON.${wording}`)"></span>
  </div>
</template>
<script>
  import { find, get, } from 'lodash'
  const debug = require('debug')('CLIENT:ButtunizedItem')
  export default {
    name: 'ButtunizedItem',
    computed: {
      status () {
        const current = find(this.options, opt => opt.value === this.value)
        return get(current, 'name', 'DRAFT')
      },
      options () {
        return get(this.item, 'options')
      },
      wording () {
        switch (this.status) {
          case 'UNPUBLISHED': {}
          case 'DRAFT': {
            return 'PUBLISH'
          }
          case 'PUBLISHED': {
            return 'UNPUBLISH'
          }
        }
      }
    },
    methods: {
      handler () {
        if (this.isProcessing) { return }
        let valSet
        switch (this.wording) {
          case 'PUBLISH': {
            valSet = find(this.options, opt => opt.name === 'PUBLISHED')
            break
          }
          case 'UNPUBLISH': {
            valSet = find(this.options, opt => opt.name === 'UNPUBLISHED')
            break
          }
        }        
        debug('go update value', valSet, get(valSet, 'value', 0))
        this.$emit('update:value', get(valSet, 'value', 0))
        this.clickHandler()
      }
    },
    mounted () {},
    props: {
      clickHandler: {
        type: Function,
        default: () => {}
      },
      isProcessing: {
        type: Boolean,
        defualt: false,
      },
      item: {
        type: Object,
      },
      value: {},
    }
  }
</script>
<style lang="stylus" scoped></style>