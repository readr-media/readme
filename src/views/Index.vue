<template>
  <div class="index">
    <div class="index--items">
      <template v-for="item in asideItems">
        <router-link :to="`/list/${get(item, 'name', '')}`" :key="get(item, 'name')" v-if="findIndex(availableModels, m => m === get(item, 'name', 'item').replace(/-/g, '_').toUpperCase()) > -1">
          <div class="index--item">
            <div :to="`/list/${get(item, 'name', '')}`" class="index--item__title"><span v-text="$t(`NAVIGATION.${get(item, 'name', '').replace(/-/g, '_').toUpperCase()}`)"></span></div>
          </div>
        </router-link>
      </template>
    </div>
  </div>
</template>
<script>
  import { findIndex, get, } from 'lodash'
  import { availableModels } from 'configuration/'
  export default {
    name: 'Index',
    components: {},
    computed: {
      asideItems () {
        return get(this.$store, 'state.asideItems', [])
      },
      availableModels () {
        return get(availableModels, get(this.$store, 'state.setting.DOMAIN'), [])
      },
    },
    methods: {
      findIndex,
      get,
    },
    mounted () {},
  }
</script>
<style lang="stylus" scoped>
  .index
    background-color #fff
    padding 40px 60px
    &--items
      display flex
      flex-wrap wrap

      a, a:hover, a:link, a:active
        color #a4a4a4
    &--item
      width 250px
      height 100px
      background-color #43439c
      box-shadow 0 0 5px rgba(50,50,50,0.5)
      margin-right 20px
      margin-top 20px
      display flex
      justify-content center
      align-items center
      color #f7f7f7
      font-size 1.125rem
      cursor pointer

      &:hover
        box-shadow 0 0 5px rgba(100,100,100,0.5)
        background-color #7979da

</style>