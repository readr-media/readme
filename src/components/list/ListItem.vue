<template>
  <div class="list-item" tabIndex="0"
    :class="{ header: type === 'header', }">
    <template v-if="sortedStructure">
      <transition name="fade" mode="out-in">
        <div class="list-item__checkbox" v-if="type !== 'header'"><CheckboxItem :value.sync="checked" :id="get(item, 'id', `${Date.now()}`)"></CheckboxItem></div>
        <div class="list-item__checkbox header" v-else><ListActionBox @copy="copy" @del="del"></ListActionBox></div>
      </transition>
    </template>
    <template v-for="obj in sortedStructure">
      <transition name="fade" mode="out-in">
        <div v-if="obj.isListable"
          @click="clickHandler(obj.isEditEntry)"
          :key="`list-item__content-${obj.name}-${Date.now()}`"
          :class="`list-item__content ${obj.name}`"
          :style="{
            minWidth: get(calcWidth(obj), 'minWidth'),
            maxWidth: get(calcWidth(obj), 'maxWidth'),
            flex: 1,
          }">
          <template v-if="!obj.isAnchoric || type === 'header'">
            <span v-text="get(item, obj.name)" v-if="isSpicialItems(obj.type) || type === 'header'"></span>
            <span v-text="mapValue(obj.name, obj.options, get(item, obj.name))" v-else-if="obj.type === 'RadioItem'"></span>
            <span v-text="mapValue(obj.name, obj.options, get(item, obj.name))" v-else-if="obj.type === 'BooleanSwitcher'"></span>
            <span v-text="mapValue(obj.name, obj.options, get(item, obj.name))" v-else-if="obj.type === 'Dropdownlist'"></span>
            <span v-text="constructval(obj.map, [ ...get(item, obj.name) ])" v-else-if="obj.type === 'TextTagItem'"></span>
            <span v-text="normalizeDatetime(get(item, obj.name), get(obj, 'format'))" v-else-if="obj.type === 'Datetime'"></span>
          </template>
          <router-link v-else-if="obj.isAnchoric" :to="`/${get($route, 'params.item')}/${get(item, 'id')}`">
            <span v-text="get(item, obj.name)" v-if="isSpicialItems(obj.type) || type === 'header'"></span>
            <span v-text="mapValue(obj.name, obj.options, get(item, obj.name))" v-else-if="obj.type === 'RadioItem'"></span>
            <span v-text="mapValue(obj.name, obj.options, get(item, obj.name))" v-else-if="obj.type === 'BooleanSwitcher'"></span>
            <span v-text="mapValue(obj.name, obj.options, get(item, obj.name))" v-else-if="obj.type === 'Dropdownlist'"></span>
            <span v-text="constructval(obj.map, [ ...get(item, obj.name) ])" v-else-if="obj.type === 'TextTagItem'"></span>
            <span v-text="normalizeDatetime(get(item, obj.name), get(obj, 'format'))" v-else-if="obj.type === 'Datetime'"></span>
          </router-link>
        </div>
      </transition>
    </template>
  </div>
</template>
<script>
  import ListActionBox from 'src/components/list/ListActionBox.vue'
  import CheckboxItem from 'src/components/form/CheckboxItem.vue'
  import moment from 'moment'
  import { decamelize, } from 'humps'
  import { find, filter, get, map, sortBy, } from 'lodash'
  const debug = require('debug')('CLIENT:ListItem')
  export default {
    name: 'ListItem',
    components: {
      ListActionBox,
      CheckboxItem,
    },
    computed: {
      sortedStructure () {
        return filter(sortBy(this.$store.getters.structure, [ obj => get(obj, 'order.list') ]), { isListable: true })
      }
    },
    data () {
      return {
        checked: false,
        modelName: this.$store.getters.modelName
      }
    },
    methods: {
      calcWidth (obj) {
        const setting = get(obj, 'listWidth')
        if (setting) {
          const minWidth = obj.listWidth.min && `${obj.listWidth.min}px`
          const maxWidth = obj.listWidth.max ? `${obj.listWidth.max}px` : minWidth
          return { minWidth, maxWidth, flex: 1 }
        } else {
          return {
            flex: 1
          }
        }
      },
      clickHandler (isEditEntry) {
        isEditEntry && this.$emit('edit', this.item)
      },
      constructval (objMap, valueArray) {
        debug('objMap', objMap)
        debug('valueArray', valueArray)
        if (!objMap) { return }
        return map(valueArray, v => get(v, objMap.name)).join(`、`)
      },
      copy () {
        this.$emit('copy')
      },
      del () {
        debug('DEL!!')
        debug('DEL!!')
        debug('DEL!!')
        this.$emit('del')
      },
      find,
      get,
      isSpicialItems (type) {
        return type !== 'RadioItem'
          && type !== 'Datetime'
          && type !== 'BooleanSwitcher'
          && type !== 'Dropdownlist'
          && type !== 'TextTagItem'
      },
      mapValue (name, options, value) {
        if (options) {
          return this.$t(`${this.modelName.toUpperCase()}.${decamelize(name).toUpperCase()}_${get(filter(options, { value, }), '0.name', 'NEVER').toUpperCase()}`, '')
        }
        return value
      },
      normalizeDatetime (datetime, format) {
        return format ? moment(datetime).format(format) : moment(datetime).format('YYYY-MM-DD hh:mm')
      }, 
    },
    mounted () {},
    props: {
      item: {
        type: Object,
        default: () => {}
      },
      type: {
        type: String,
      },
    },
    watch: {
      checked () {
        this.$emit('checkup', { id: get(this.item, 'id'), value: this.checked, })
      },
      '$store.getters.structure': function (newVals, oldVals) {
        newVals !== oldVals && (this.modelName = this.$store.getters.modelName)
      }
    },
  }
</script>
<style lang="stylus" scoped>
  .list-item
    display flex
    font-size 1rem
    font-weight 300
    line-height normal
    padding 5px 10px
    cursor pointer
    outline none
    position relative
    justify-content flex-start
    &.header
      font-weight 800
      margin-bottom 8px
      .list-item__content
        align-items center
      
    &:not(.header)
      :focus, &:hover
        background-color #eee
        .list-item__toolbox
          display block
    &__checkbox
      display flex
      align-items center
      justify-content center
      height 32px
      width 32px
      min-width 32px

    &__content
      display flex
      align-items flex-start
      justify-content flex-start
    > div, > a
      &:not(:first-child)
        margin-left 20px
      &:last-child
        flex 1
</style>