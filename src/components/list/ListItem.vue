<template>
  <div class="list-item" tabIndex="0"
    :class="{ header: type === 'header', active: isActive && type !== 'header', }"
    @focus="focusin"
    @focusout="focusout">
    <template v-for="obj in structure">
      <div v-if="obj.isListable"
        :class="`list-item__content ${obj.name}`"
        :style="{ width: `${obj.width.list}px`, }">
          <span v-text="get(item, obj.name)" v-if="(obj.type !== 'RadioItem' && obj.type !== 'Datetime' && obj.type !== 'BooleanSwitcher') || type === 'header'"></span>
          <span v-text="mapValue(obj.name, obj.options, get(item, obj.name))" v-else-if="obj.type === 'RadioItem'"></span>
          <span v-text="mapValue(obj.name, obj.options, get(item, obj.name))" v-else-if="obj.type === 'BooleanSwitcher'"></span>
          <span v-text="normalizeDatetime(get(item, obj.name))" v-else-if="obj.type === 'Datetime'"></span>
        </div>
    </template>
    <div class="list-item__toolbox">
      <div class="edit"><span v-text="$t('LIST.EDIT')" @click="edit"></span></div>
      <div class="del"><span v-text="$t('LIST.DEL')" @click="del"></span></div>
    </div>
  </div>
</template>
<script>
  import moment from 'moment'
  import { decamelize, } from 'humps'
  import { filter, get, } from 'lodash'
  const debug = require('debug')('CLIENT:ListItem')
  const switchAlert = (store, active, message, callback) => store.dispatch('ALERT_SWITCH', { active, message, callback, })
  export default {
    name: 'ListItem',
    data () {
      return {
        isActive: false,
      }
    },
    methods: {
      del () {
        switchAlert(this.$store, true, 'Are you sure about doing this?', () => {
          this.$emit('del', this.item)
        })
      },
      edit () {
        this.$emit('editorOn', this.item)
      },
      get,
      mapValue (name, options, value) {
        return this.$t(`${this.model.toUpperCase()}.${decamelize(name).toUpperCase()}_${get(filter(options, { value, }), '0.name', 'NEVER').toUpperCase()}`, '')
      },
      normalizeDatetime (datetime) {
        return moment(datetime).format('YYYY-MM-DD hh:mm:ss')
      }, 
      focusin () {
        this.isActive = true
      },
      focusout () {
        this.isActive = false
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
  }
</script>
<style lang="stylus" scoped>
  .list-item
    display flex
    font-size 0.9375rem
    font-weight 300
    line-height normal
    padding 5px 100px 5px 10px
    cursor pointer
    outline none
    position relative
    &:not(:last-child)
      margin-bottom 10px
    &.header
      font-size 1.0625rem
      font-weight 800
      border-bottom 1px solid #940606
      padding-bottom 10px
      margin-bottom 15px
      
    &:not(.header):not(.active):hover
      background-color rgba(0,0,0,0.5)
      box-shadow 0px 0px 5px rgba(42,42,42,0.6)
      // background-image linear-gradient(to right, rgba(0,0,0,0.7) 10%, rgba(0,0,0,0.6) 40%, rgba(0,0,0,0.6) 70%, rgba(0,0,0,0) 90%)
      color #f1f1f1
    &.active
      background-image linear-gradient(to right, rgba(0,0,0,0.5) 10%, rgba(0,0,0,0.4) 40%, rgba(0,0,0,0.3) 70%, rgba(0,0,0,0) 90%)
      color #e3e3e3
      .list-item__toolbox
        display block
    &__content
      display flex
      align-items center
    &__toolbox
      position absolute
      top 0
      right 0
      height 100%
      width 100px
      display none
      > div
        height 100%
        max-height 30px
        display inline-flex
        justify-content center
        align-items center
        margin 0 3px
        padding 0 5px
        border-radius 5px
        color #e1e1e1
        font-size 0.875rem
        background-color rgba(27, 138, 13, 0.8)
        box-shadow 0px 0px 5px rgba(42,42,42,0.6)
        &:hover
          background-color rgba(62, 171, 48, 0.8)
          box-shadow 0px 0px 5px rgba(100,100,100,0.6)
          color #f1f1f1
    > div
      overflow hidden
      &:not(:first-child)
        margin-left 20px
      &:last-child
        flex 1
</style>