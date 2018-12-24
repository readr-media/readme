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
      <div v-if="isLoading"><Spinner :show="true"></Spinner></div>
      <div v-else><ItemEditor type="create" @saved="assetGened" modelName="ASSET"></ItemEditor></div>
    </div>
  </Tab>
</template>
<script>
  import Tab from 'src/components/common/Tab.vue'
  import ListFilter from 'src/components/list/ListFilter.vue'
  import ListItemIcon from 'src/components/list/ListItemIcon.vue'
  import Spinner from 'src/components/Spinner.vue'
  import axios from 'axios'
  import { camelizeKeys, } from 'humps'
  import { get } from 'lodash'

  const debug = require('debug')('CLIENT:AssetPickerPanel')
  const fetchAsset = assets_endpoint => axios.get(assets_endpoint)
  const switchOff = store => store.dispatch('COMMON_LIGHTBOX_SWITCH', { active: false })

  export default {
    name: 'AssetPickerPanel',
    components: {
      // Have to dynamic import component ItemEditor 'cause recursive components issue.
      ItemEditor: () => import('src/components/item/ItemEditor.vue'),
      ListFilter,
      ListItemIcon,
      Spinner,
      Tab
    },
    computed: {
      modelData () {
        let model
        try {
          model = require(`model/ASSET`)
        } catch (error) {
          console.log(`There's no model found: ASSET`)
        }
        return model        
      },
      endpointOfList () {
        return get(this.modelData, 'assetsEndpoint')
      }
    },
    data () {
      return {
        assets: [],
        isLoading: false,
        selectedItem: -1,
        tabs: [ this.$t('EDITOR.ASSET_PICKER.PICK'), this.$t('EDITOR.ASSET_PICKER.GENERATE') ]
      }
    },
    methods: {
      assetGened (res) {
        debug('Got a new asset!!!!!', res)
        const assetDestination = get(res, 'body.url.desktop')
        setTimeout(() => this.callback(assetDestination).then(() => switchOff(this.$store) ), 1000)
      },
      choose (index) {
        debug('select!', index)
        this.selectedItem = index
      },
      confirm () {
        debug('Going to call back!', `${get(this.assets, `${this.selectedItem}.destination`)}.${get(this.assets, `${this.selectedItem}.fileExt`)}`)
        this.callback(`${get(this.assets, `${this.selectedItem}.destination`)}.${get(this.assets, `${this.selectedItem}.fileExt`)}`)
          .then(() => switchOff(this.$store) )
      },
    },
    mounted () {
      debug('Going to fetch assets list.')
      this.endpointOfList && fetchAsset(this.endpointOfList)
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
    overflow auto
    .uploader
      > div
        height 100%
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