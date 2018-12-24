<template>
  <Tab :tabs="tabs">
    <div class="asset-picker-panel picker" slot="0">
      <div class="asset-picker-panel__search"><ListFilter></ListFilter></div>
      <div class="asset-picker-panel__list">
        <template v-for="(a, i) in assets">
          <div @click="choose(i)" :class="[ 'asset-item', i === selectedItem ? 'selected' : '' ]">
            <ListItemIcon :item="a"></ListItemIcon>
          </div>
        </template>
      </div>
      <div class="asset-picker-panel__confirm button" @click="confirm">
        <span v-text="$t('EDITOR.ASSET_PICKER.TAKE_UP')"></span>
      </div>
    </div>
    <div class="asset-picker-panel uploader" slot="1">
      <ItemEditor></ItemEditor>
    </div>
  </Tab>
</template>
<script>
  import Tab from 'src/components/common/Tab.vue'
  import ItemEditor from 'src/components/item/ItemEditor.vue'
  import ListFilter from 'src/components/list/ListFilter.vue'
  import ListItemIcon from 'src/components/list/ListItemIcon.vue'
  import axios from 'axios'
  import { camelizeKeys, } from 'humps'
  import { get } from 'lodash'

  const ASSETS_ENDPOINT = '/api/asset/list'
  const debug = require('debug')('CLIENT:AssetPickerPanel')
  const fetchAsset = assets_endpoint => axios.get(assets_endpoint)
  const switchOff = store => store.dispatch('COMMON_LIGHTBOX_SWITCH', { active: false })

  export default {
    name: 'AssetPickerPanel',
    components: {
      ItemEditor,
      ListFilter,
      ListItemIcon,
      Tab
    },
    data () {
      return {
        assets: [],
        selectedItem: -1,
        tabs: [ this.$t('EDITOR.ASSET_PICKER.PICK'), this.$t('EDITOR.ASSET_PICKER.GENERATE') ]
      }
    },
    methods: {
      choose (index) {
        debug('select!', index)
        this.selectedItem = index
      },
      confirm () {
        debug('Going to call back!', `${get(this.assets, `${this.selectedItem}.destination`)}.${get(this.assets, `${this.selectedItem}.fileExt`)}`)
        this.callback(`${get(this.assets, `${this.selectedItem}.destination`)}.${get(this.assets, `${this.selectedItem}.fileExt`)}`)
        switchOff(this.$store)
      },
    },
    mounted () {
      debug('Going to fetch assets list.')
      ASSETS_ENDPOINT && fetchAsset(ASSETS_ENDPOINT)
        .then(res => {
          debug('Assets Get!', res.data)
          const data = camelizeKeys(res.data)
          this.assets = get(data, 'items')
        })
        .catch(err => {
          debug('Getting Assets in fail!!', err)
          this.assets = []
        })
    },
    props: {
      callback: {
        default: () => {}
      }
    },
  }
</script>
<style lang="stylus" scoped>
  .asset-picker-panel
    max-width 900px
    max-height 700px
    width 90vw
    height 90vh
    padding 30px 80px
    display flex
    flex-direction column
    &__list
      flex 1
      display flex
      flex-wrap wrap
      margin-top 30px
      .asset-item
        &.selected
          > div
            background-color #e6f8f9
    &__confirm
      margin-top 30px
      display flex
      justify-content flex-end
      span
        font-size 1.25rem
        font-weight normal
        font-style normal
        font-stretch normal
        line-height normal
        letter-spacing normal
        text-align center
        color #f7f7f7
        border-radius 4px
        background-color #0db9c9
        padding 20px 30px
        display inline-block
        cursor pointer
</style>