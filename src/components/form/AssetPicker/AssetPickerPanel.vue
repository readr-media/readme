<template>
  <Tab :tabs="tabs" :defaultIndex="1">
    <div class="asset-picker-panel picker" slot="0">
      <div class="asset-picker-panel__search"><ListFilter bgcolor="#eeeeee"></ListFilter></div>
      <div class="asset-picker-panel__list">
        <template v-for="(a, i) in assets">
          <div @click="choose(i)" 
            :class="[
              'asset-item',
              i === selectedItem ? 'selected' : '',
              i % 4 ? '' : 'first',]"
            :key="a.id">
            <ListItemIcon :item="a"></ListItemIcon>
          </div>
        </template>
      </div>
      <div class="asset-picker-panel__info">
        <PaginationNav :currPage.sync="page" :totalPages="totalPages"></PaginationNav>
      </div>
      <div class="asset-picker-panel__confirm button" @click="confirm">
        <span v-text="$t('EDITOR.ASSET_PICKER.TAKE_UP')"></span>
      </div>
    </div>
    <div class="asset-picker-panel uploader" slot="1">
      <div v-if="isLoading"><Spinner :show="true"></Spinner></div>
      <div v-else><ItemEditor type="create" @saved="assetGenedHandler" modelName="ASSET"></ItemEditor></div>
    </div>
  </Tab>
</template>
<script>
  import Tab from 'src/components/common/Tab.vue'
  import ListFilter from 'src/components/list/ListFilter.vue'
  import ListItemIcon from 'src/components/list/ListItemIcon.vue'
  import PaginationNav from 'src/components/list/PaginationNav.vue'
  import Spinner from 'src/components/Spinner.vue'
  import axios from 'axios'
  import { IMAGE_SIZE } from 'src/constants'
  import { camelizeKeys, } from 'humps'
  import { get, map } from 'lodash'
  import { constructUrlWithQuery } from 'src/api/comm'

  const ASSETS_TYPE = {
    IMAGE: 1,
    VIDEO: 2,
    AUDIO: 3
  }
  const MAX_RESULT = 8

  const debug = require('debug')('CLIENT:AssetPickerPanel')
  const fetchAssetData = (endpoint, params, type) => {
    if (!endpoint) { return Promise.resolve({}) }
    const query = type !== 'count' ? Object.assign(params, { max_result: MAX_RESULT }) : params
    const url = constructUrlWithQuery(endpoint, query)
    return axios.get(url)
  }
  const switchOff = store => store.dispatch('COMMON_LIGHTBOX_SWITCH', { active: false })

  export default {
    name: 'AssetPickerPanel',
    components: {
      // Have to dynamic import component ItemEditor 'cause recursive components issue.
      ItemEditor: () => import('src/components/item/ItemEditor.vue'),
      ListFilter,
      ListItemIcon,
      PaginationNav,
      Spinner,
      Tab
    },
    computed: {
      totalPages () {
        return Math.ceil(this.assetsCount / MAX_RESULT) 
      }
    },
    data () {
      return {
        assets: [],
        assetsCount: 0,
        assetType: [ 1 ],
        endpointOfList: '',
        isLoading: false,
        modelData: {},
        page: 1,
        selectedItem: -1,
        tabs: [ this.$t('EDITOR.ASSET_PICKER.PICK'), this.$t('EDITOR.ASSET_PICKER.GENERATE') ],
      }
    },
    methods: {
      assetGenedHandler (res) {
        debug('Got a new asset!!!!!', res)
        const assetDestinations = get(res, 'body.url')
        const assetTitle = get(res, 'params.title')
        setTimeout(() => this.callback(assetDestinations, assetTitle).then(() => switchOff(this.$store) ), 1000)
      },
      choose (index) {
        debug('select!', index)
        this.selectedItem = index
      },
      confirm () {
        const fileBasicDestination = get(this.assets, `${this.selectedItem}.destination`)
        const fileDestinations = {}
        const file = get(this.assets, this.selectedItem)
        debug('Going to call back!', file)
        if (get(file, 'assetType') === ASSETS_TYPE.IMAGE) {
          map(IMAGE_SIZE, f => {
            fileDestinations[ f ] = `${fileBasicDestination}-${f}.${get(file, 'fileExtension')}`
          })
        }     
        fileDestinations.desktop = `${fileBasicDestination}.${get(file, 'fileExtension')}`
        debug('fileDestinations', fileDestinations)
        this.callback(fileDestinations, get(file, 'title', '')).then(() => switchOff(this.$store) )
      },
      getAssetsCount () {
        const assetsCountEndpoint = get(get(this.modelData, 'assetsCountEndpoint', '').split('?'), '0')
        return fetchAssetData(assetsCountEndpoint, { asset_type: this.assetType }, 'count')
          .then(res => get(res, 'data.meta.total', 0))
          .catch(() => 0)
      }
    },
    async beforeMount () {
      debug('Going to fetch assets list.')
      this.assetType = get(this.custProps, 'assetType') || this.assetType
      this.modelData = await import(`model/ASSET`)
      this.assetsCount= await this.getAssetsCount()
      this.endpointOfList = get(get(this.modelData, 'assetsEndpoint', '').split('?'), '0')
      fetchAssetData(this.endpointOfList, { asset_type: this.assetType, page: this.page }, 'list')
        .then(res => {
          debug('Assets Get!', res.data)
          const data = camelizeKeys(res.data)
          this.assets = get(data, 'items', [])
        })
        .catch(err => {
          debug('Getting Assets in fail!!', err)
          this.assets = []
        })
    },
    props: {
      callback: {
        default: () => {}
      },
      custProps: {},
    },
    watch: {
      page () {
        fetchAssetData(this.endpointOfList, { asset_type: this.assetType, page: this.page }, 'list')
        .then(res => {
          debug('Assets Get!', res.data)
          const data = camelizeKeys(res.data)
          this.assets = get(data, 'items', [])
        })
        .catch(err => {
          debug('Getting Assets in fail!!', err)
          this.assets = []
        })        
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
    padding 80px 80px 120px
    overflow hidden
    &.uploader
      padding 30px 80px
      > div
        height 100%
    &__search
      position absolute
      top 110px
      left 80px
      width calc(100% - 160px)
      height 36px

    &__list
      display flex
      flex-wrap wrap
      align-content flex-start
      margin-top 15px
      height calc(100% - 50px)
      width 100%
      overflow auto
      .asset-item
        width calc(25% - 5px)
        height 200px
        margin-bottom 5px
        cursor pointer
        padding 15px
        &:not(.first)
          margin-left 5px
        &.selected
          background-color #e6f8f9
    &__info
      height 50px
      text-align right
    &__confirm
      margin-top 30px
      display flex
      justify-content flex-end
      position absolute
      bottom 30px
      right 80px
      width 160px
      height 68px
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