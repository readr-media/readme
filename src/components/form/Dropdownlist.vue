<template>
  <select :name="name" v-model.number="selected" class="dropdown-selector">
    <option v-text="defaultText ? $t(`EDITOR.DROPDOWN_LIST.${defaultText}`) : $t('EDITOR.DROPDOWN_LIST.HINT')" :value="defaultVal"></option>
    <option v-for="opt in source"
            :key="opt.id"
            :value="`${opt.id}`"
            v-text="opt.text">
    </option>
  </select>
</template>
<script>
  const debug = require('debug')('CLIENT:Dropdownlist')
  export default {
    name: 'Dropdownlist',
    data () {
      return {
        selected: '',
        source: [],
      }
    },
    methods: {},
    mounted () {
      this.fetchSource(this.$store, { vueInstance: this }).then(source => {
        debug('source', source)
        this.source = source || []
        this.selected = `${this.selectedItem || this.defaultVal}` 
      }).catch(err => {
        console.error('Fetching projects list with error.', err)
        this.selected = this.defaultVal
        this.source = []
      })
    },
    props: {
      defaultVal: {
        default: -1
      },
      defaultText: {},
      fetchSource: {
        type: Function,
        default: () => new Promise(resolve => resolve()),
      },
      name: {
        required: true,
      },
      selectedItem: {},
    },
    watch: {
      selected () {
        debug('Mutation detected: selected.', this.selected)
        this.$emit('update:selectedItem', this.selected !== '-1' ? this.selected : undefined )
      },
      selectedItem () {
        !this.selected && (this.selected = this.selectedItem)
      },
    },
  }
</script>
<style lang="stylus" scoped>
  .dropdown-selector
    width 100%
    outline none
    border none
    height 35px
    font-weight 300
    font-size 1.125rem
    background-color #fff
    border-radius 4px
</style>