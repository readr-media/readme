<template>
  <div class="list">
    <div class="list__header">
      <div class="list__title"><span v-text="listName"></span></div>
      <div class="list__wrapper right">
        <div class="list__toolbox">
          <div class="btn create" @click="create"><span v-text="$t('LIST.ADD')"></span></div>
        </div>
        <div class="list__search">
          <TextInput
            backgroundColor="#a3a3a3"
            backgroundColorFocused="#fff"
            :placeHolder="$t('LIST.SEARCH')"
            :value.sync="filter"></TextInput>      
        </div>
      </div>
    </div>
    <ListContainer class="list__container" :flag="listName" :refresh="refresh">
      <template slot="new-item" slot-scope="props">
        <Editor type="create"
          :is="props.Editor"
          :isActive.sync="isNewItemEditorActive"
          :structure="props.structure"
          :add="props.add"></Editor>
      </template>
    </ListContainer>
  </div>
</template>
<script>
  import ListContainer from 'src/components/list/ListContainer.vue'
  import TextInput from 'src/components/new-form/TextInput.vue'
  import { DEFAULT_LIST_MAXRESULT, } from 'src/constants'
  import { get, } from 'lodash'

  const DEFAULT_MAXRESULT = DEFAULT_LIST_MAXRESULT
  const DEFAULT_PAGE = 1
  const DEFAULT_SORT = '-updated_at'

  const debug = require('debug')('CLIENT:List')
  const fetchList = (store, params, flag) => store.dispatch('FETCH_LIST', {
    params: Object.assign({
      maxResult: DEFAULT_MAXRESULT,
      page: DEFAULT_PAGE,
      sort: DEFAULT_SORT,
    }, params),
    flag,
  })

  export default {
    name: 'List',
    components: {
      ListContainer,
      TextInput,
    },
    computed: {
      listName () {
        return get(this.$route, 'params.item')
      },
    },
    data () {
      return {
        filter: '',
        isNewItemEditorActive: false,
      }
    },
    methods: {
      create () {
        this.isNewItemEditorActive = true
      },
      refresh ({ params = {}, }) {
        fetchList(this.$store, params, this.listName)
      },
    },
    beforeMount () {
      fetchList(this.$store, {}, this.listName)
    },
    watch: {
      listName () {
        fetchList(this.$store, {}, this.listName)
      },
    },
  }
</script>
<style lang="stylus" scoped>
  .list
    background-color #404040
    padding 10px 60px 40px 10px
    // position relative
    &__header
      height 40px
      margin-bottom 10px
      display flex
      justify-content space-between
    &__title
      // position absolute
      // top 10px
      // left 10px
      min-width 300px
      height 100%
      font-size 1.375rem
      color rgba(250,250,250,0.9)
      background-color rgba(150,111,0,0.7)
      border-radius 2px
      padding 0 20px
      display flex
      justify-content center
      align-items center
    &__search, &__toolbox
      display flex
      align-items flex-end
    &__toolbox
      .btn
        cursor pointer
        padding 5px
        display flex
        justify-content center
        align-items center
        margin 0 10px
        border-radius 2px
        background-color #d3d3d3
        border 1px solid #d3d3d3
        &.create
          background-color green
          border 1px solid green
          color #d3d3d3
          &:hover
            background-color #13a213
            border 1px solid #13a213
            box-shadow 0 0 5px rgba(250,250,250, 0.7)
    &__wrapper
      display flex
</style>