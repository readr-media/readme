<template>
  <div class="common-tab">
    <div class="common-tab__nav">
      <template v-for="(tab, i) in tabs">
        <div class="item" :class="{ active: activeItem === i }" @click="select(i)">
          <span v-text="tab"></span>
        </div>    
      </template>
    </div>
    <div class="common-tab__content">
      <slot v-if="i === activeItem"
        v-for="(t, i) in tabs" :name="i"></slot>
    </div>
  </div>
</template>
<script>
  export default {
    name: 'Tab',
    data () {
      return {
        activeItem: 0
      }
    },
    methods: {
      select (index) {
        this.activeItem = index
      }
    },
    mounted () {},
    props: {
      tabs: {}
    },
  }
</script>
<style lang="stylus" scoped>
  .common-tab
    &__nav
      height 80px
      background-color #eeeeee
      .item
        display inline-flex
        width 230px
        height 100%
        justify-content center
        align-items center
        font-size 1.25rem
        font-weight bold
        font-style normal
        font-stretch normal
        line-height normal
        letter-spacing normal
        color #000
        cursor pointer
        &.active
          background-color #f7f7f7
</style>