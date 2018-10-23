<template>
  <div class="aside">
    <div class="aside__container">
      <router-link to="/" class="aside--item" v-show="showIndex"><span v-text="$t('NAVIGATION.INDEX')"></span></router-link>
      <template v-for="item in asideItems">
        <router-link :to="`/${get(item, 'route', '')}`" class="aside--item" v-if="get(item, 'active')">
          <span v-text="$t(`NAVIGATION.${(get(item, 'name', '').replace(/-/g, '_')).toUpperCase()}`)"></span>
        </router-link>
        <template v-for="sub in get(item, 'sub')">
          <router-link class="aside--item sub" v-if="get(sub, 'active')"
            :to="`/${get(sub, 'route', '')}`" 
            :class="{ active: get(item, 'name') === get($route, 'params.item'), }">
            <span v-text="$t(`NAVIGATION.${(get(sub, 'name', '').replace(/-/g, '_')).toUpperCase()}`)"></span>
          </router-link>
        </template>
      </template>
    </div>
  </div>
</template>
<script>
  import { get, } from 'lodash'
  const fetchAsideItems = (store) => store.dispatch('FETCH_ASIDE_ITEMS', { params: {}, })
  const debug = require('debug')('CLIENT:NewAside')
  export default {
    name: 'NewAside',
    computed: {
      asideItems () {
        return get(this.$store, 'state.asideItems', [])
      },
      showIndex () {
        return this.$route.fullPath !== '/'
      },
    },
    methods: {
      get,
    },
    mounted () {
      fetchAsideItems(this.$store)
    },
  }
</script>
<style lang="stylus" scoped>
  .aside
    height 100%
    width 200px
    // background-color #3a3a3a
    &__container
      position absolute
      top 50px
      left 10px
      width 100%
      height calc(100% - 60px)
      // background-color rgba(50,50,50,0.5)
      // box-shadow 1px 1px 5px rgba(50,50,50,0.5)
    &--item
      height 30px
      width 100%
      padding 5px 20px
      display flex
      justify-content center
      align-items center
      // background-color #232323
      // color #a1a1a1
      color #000
      cursor pointer
      &:hover
        box-shadow 1px 1px 5px rgba(100,100,100,0.5)
        // background-color #131313
        background-color rgba(156,156,156,0.5)
        color #fff
      &:not(:first-child)
        margin-top 10px
      &.sub
        // background-color #834f4f
        background-color #dfdfdf
        border-radius 3px
        width 90%
        margin-left 10%
        text-align center
        display none
        &.active
          display block
</style>