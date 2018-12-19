<template>
  <div class="aside">
    <div class="aside__nav">
      <div class="aside__nav__item" v-for="(nav, index) in asideNav" @click="navClickHandler(get(nav, 'name', 'configure'))">
        <div class="icon"><img :src="`/public/icons/icon-${get(nav, 'name', 'configure')}.png`"></div>
        <div class="status-hint" :class="{ active: activeNav === get(nav, 'name', 'configure') }"></div>
      </div>
    </div>
    <div class="aside__container">
      <div class="aside__container__item title"><span v-text="$t(`NAVIGATION.${activeNav.toUpperCase()}`)"></span></div>
      <template v-for="(item, index) in asideItems">
        <template v-if="get(item, 'active', false) && get(item, 'nav', false) === activeNav">
          <div class="aside__container__item" :key="`item-${index}`">
            <router-link v-if="get(item, 'type', 'list') === 'list'"
              :class="{ active: get($route, 'params.item') === get(item, 'name', '') }"
              :to="`/${get(item, 'name', '')}`">
              <span v-text="$t(`NAVIGATION.${get(item, 'name', 'item').replace(/-/g, '_').toUpperCase()}`)"></span>
            </router-link>
            <span v-else v-text="$t(`NAVIGATION.${get(item, 'name', 'item').toUpperCase()}`)"></span>
          </div>
          <template v-for="(sub, sindex) in get(item, 'sub')">
            <div class="aside__container__item sub availible" v-if="get(sub, 'active', false) && get(item, 'nav', false) === activeNav">
              <router-link :to="`/${get(sub, 'name', '')}`"
                :class="{ active: get($route, 'params.item') === get(sub, 'name', '') }">
                <span v-text="$t(`NAVIGATION.${(get(sub, 'name', 'item').replace(/-/g, '_')).toUpperCase()}`)"></span>
              </router-link>
            </div>
          </template>
        </template>
      </template>
    </div>
  </div>
</template>
<script>
  import { find, get, } from 'lodash'
  const fetchAsideItems = store => store.dispatch('FETCH_ASIDE_ITEMS', { params: {}, })
  const fetchAsideNav = store => store.dispatch('FETCH_ASIDE_NAV', { params: {}, })
  const debug = require('debug')('CLIENT:ReadMeAside')
  export default {
    name: 'ReadMeAside',
    computed: {
      asideItems () {
        return get(this.$store, 'state.asideItems', [])
      },
      asideNav () {
        return get(this.$store, 'state.asideNav', [])
      },
      showIndex () {
        return this.$route.fullPath !== '/'
      },
    },
    data () {
      return {
        activeNav: 'configure',
      }
    },
    methods: {
      get,
      navClickHandler (key) {
        debug('key', key)
        this.activeNav = key
      },
      isParentActive (itemParent) {
        return find(get(itemParent, 'sub'), { name: get(this.$route, 'params.item') })
      },
    },
    mounted () {
      Promise.all([
        fetchAsideNav(this.$store),
        fetchAsideItems(this.$store)
      ])
    },
  }
</script>
<style lang="stylus" scoped>
  .aside
    height 100%
    width 250px
    padding-top 60px
    display flex
    &__nav
      height 100%
      width 60px
      background-color rgba(13,185,201,0.1)
      padding-top 25px
      &__item
        width 100%
        height 40px
        display flex
        justify-content center
        align-items center
        position relative
        margin 20px 0
        .icon
          width 24px
          height 24px
          // background-color #0db9c9
          cursor pointer
          img
            width 100%
            object-fit contain
            object-position center
        .status-hint
          position absolute
          top 0
          right 0
          height 100%
          width 4px
          display flex
          justify-content center
          align-items center
          &::after
            transition all 0.5s
            content ''
            width 100%
            height 0
            display block
            background-color #0db9c9
          &.active
            height 100%
            &::after
              height 100%
    &__container
      background-color #fff
      flex 1
      padding 30px 25px
      overflow auto
      &__item
        font-size 0.875rem
        color #626262
        margin-bottom 20px
        a, a:hover, a:link, a:visited
          color #626262
        a.active
          color #0db9c9
        &.title
          font-size 1rem
          font-weight 600
          line-height normal
          color #000
        &.sub
          padding-left 20px
        &.availible
          cursor pointer
  @media screen and (min-width: 1200px)
    .aside
      width 310px
</style>