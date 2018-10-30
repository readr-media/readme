<template>
  <div class="search">
    <input class="search__input" type="text" ref="searchInput"
      :placeholder="$t('LIST.SEARCH')"
      v-model="currentSearchVal"
      @keyup="setCurrVal"
      @change="checkIsChanged">
  </div>
</template>
<script>
  export default {
    name: 'ListFilter',
    data () {
      return {
        currentSearchVal: '',
      }
    },
    methods: {
      checkIsChanged () {},
      setCurrVal () {},
    },
    mounted () {},
    props: {
      value: {
        type: String,
      },
    },
    watch: {
      currentSearchVal () {
        this.$emit('update:value', this.currentSearchVal)
      },
    },
  }
</script>
<style lang="stylus" scoped>
  .search
    border-radius 2px
    display flex
    justify-content center
    align-items center
    height 36px
    width 100%    
    background-color #eee
    padding 10px 10px 10px 45px
    position relative
    &::before
      position absolute
      content ''
      left 23px
      top 10px
      display block
      background-image url(/public/icons/search-grey.png)
      background-repeat no-repeat
      background-size contain
      background-position center center
      height 16px
      width 16px
    &__input
      outline none
      width 100%
      height 16px
      border none
      background-color #eee
      font-size 1rem
      font-weight 100
      color #0f0f0f
      &::-webkit-input-placeholder
        color #bdbdbd
        font-weight 100
    &.focused
      background-color #efefef
</style>