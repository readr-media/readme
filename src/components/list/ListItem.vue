<template>
  <div class="list-item" tabIndex="0"
    :class="{ header: type === 'header', }">
    <div class="list-item__checkbox" v-if="type !== 'header'"><CheckboxItem :value.sync="checked" :id="get(item, 'id', `${Date.now()}`)"></CheckboxItem></div>
    <div class="list-item__checkbox header" v-else><ActionBox @copy="copy" @del="del"></ActionBox></div>
    <template v-for="obj in structure">
      <div v-if="obj.isListable"
        @click="clickHandler(obj.isEditEntry)"
        :class="`list-item__content ${obj.name}`"
        :style="{ width: get(obj, 'width.list') && `${get(obj, 'width.list')}px`, flex: !get(obj, 'width.list') ? '1' : 'none' }">
        <template v-if="!obj.isAnchoric || type === 'header'">
          <span v-text="get(item, obj.name)" v-if="(obj.type !== 'RadioItem' && obj.type !== 'Datetime' && obj.type !== 'BooleanSwitcher') || type === 'header'"></span>
          <span v-text="mapValue(obj.name, obj.options, get(item, obj.name))" v-else-if="obj.type === 'RadioItem'"></span>
          <span v-text="mapValue(obj.name, obj.options, get(item, obj.name))" v-else-if="obj.type === 'BooleanSwitcher'"></span>
          <span v-text="normalizeDatetime(get(item, obj.name), get(obj, 'format'))" v-else-if="obj.type === 'Datetime'"></span>
        </template>
        <router-link v-else-if="obj.isAnchoric" :to="`/${get($route, 'params.item')}/${get(item, 'id')}`">        
          <span v-text="get(item, obj.name)" v-if="(obj.type !== 'RadioItem' && obj.type !== 'Datetime' && obj.type !== 'BooleanSwitcher') || type === 'header'"></span>
          <span v-text="mapValue(obj.name, obj.options, get(item, obj.name))" v-else-if="obj.type === 'RadioItem'"></span>
          <span v-text="mapValue(obj.name, obj.options, get(item, obj.name))" v-else-if="obj.type === 'BooleanSwitcher'"></span>
          <span v-text="normalizeDatetime(get(item, obj.name), get(obj, 'format'))" v-else-if="obj.type === 'Datetime'"></span>        
        </router-link>
      </div>
    </template>
  </div>
</template>
<script>
  import ActionBox from 'src/components/list/ActionBox.vue'
  import CheckboxItem from 'src/components/new-form/CheckboxItem.vue'
  import moment from 'moment'
  import { decamelize, } from 'humps'
  import { filter, get, } from 'lodash'
  const debug = require('debug')('CLIENT:ListItem')
  export default {
    name: 'ListItem',
    components: {
      ActionBox,
      CheckboxItem,
    },
    data () {
      return {
        checked: false,
      }
    },
    methods: {
      clickHandler (isEditEntry) {
        isEditEntry && this.$emit('edit', this.item)
      },
      copy () {
        this.$emit('copy')
      },
      del () {
        this.$emit('del')
      },
      get,
      mapValue (name, options, value) {
        return this.$t(`${this.model.toUpperCase()}.${decamelize(name).toUpperCase()}_${get(filter(options, { value, }), '0.name', 'NEVER').toUpperCase()}`, '')
      },
      normalizeDatetime (datetime, format) {
        return format ? moment(datetime).format(format) : moment(datetime).format('YYYY-MM-DD hh:mm:ss')
      }, 
    },
    mounted () {},
    props: {
      model: {
        type: String,
      },
      item: {
        type: Object,
        default: () => {}
      },
      type: {
        type: String,
      },
      structure: {
        type: Array,
      },
    },
    watch: {
      checked () {
        this.$emit('checkup', { id: get(this.item, 'id'), value: this.checked, })
      },
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
    justify-content space-between
    &.header
      font-weight 800
      border-bottom 1px solid #940606
      padding-bottom 10px
      margin-bottom 15px
      
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

    &__content
      display flex
      align-items center
    // &__toolbox
    //   position absolute
    //   top 0
    //   right 0
    //   height 100%
    //   width 100px
    //   display none
    //   > div
    //     height 100%
    //     max-height 30px
    //     display inline-flex
    //     justify-content center
    //     align-items center
    //     margin 0 3px
    //     padding 0 5px
    //     border-radius 5px
    //     color #e1e1e1
    //     font-size 0.875rem
    //     background-color rgba(27, 138, 13, 0.8)
    //     box-shadow 0px 0px 5px rgba(42,42,42,0.6)
    //     &:hover
    //       background-color rgba(62, 171, 48, 0.8)
    //       box-shadow 0px 0px 5px rgba(100,100,100,0.6)
    //       color #f1f1f1
    > div, > a
      &:not(:first-child)
        margin-left 20px
      &:last-child
        flex 1
</style>