<template>
  <div class="pagination-nav" ref="pagination">
    <template v-if="totalPages > 0">
      <div class="pagination-nav__prev prev" @click="clickPrev">&lt;</div>
      <!--div class="pagination-nav__rest" @click="clickPrev" v-if="showLeftRest">...</div-->
      <div class="pagination-nav__page" v-for="i in activePages" v-text="i"
        :key="`pagination-nav__page-${i}`"
        :class="{ active: i === currPage }"
        @click="clickHandler(i)"></div>
      <!--div class="pagination-nav__rest" @click="clickNext" v-if="showRightRest">...</div-->
      <div class="pagination-nav__next next" @click="clickNext">&gt;</div>
    </template>
  </div>
</template>

<script>
  const debug = require('debug')('CLIENT:PaginationNav')
  export default {
    computed: {
      activePages () {
        const pagesArr = []
        if (this.currPage < 4) {
          this.setRestPage('right')
          debug('this.currPage < 4', this.currPage)
          for (let i = 0; i < 5; i += 1) {
            if (i + 1 > this.totalPages) { continue }
            pagesArr.push(i + 1)
          }
        } else if (this.currPage > this.totalPages - 3) {
          const base = this.totalPages <= 5 ? 0 : this.totalPages - 5
          debug('this.currPage > this.totalPages - 3', this.currPage, this.totalPages - 3)
          this.setRestPage('left')
          for (let i = base; i < this.totalPages; i += 1) {
            pagesArr.push(i + 1)
          }
        } else {
          this.setRestPage('both')
          debug('else', this.currPage)
          for (let i = this.currPage - 3; i < this.currPage + 2; i += 1) {
            pagesArr.push(i + 1)
          }
        }
        debug('activePages', pagesArr)
        return pagesArr
      },
    },
    data () {
      return {
        page: this.currPage,
        showLeftRest: false,
        showRightRest: false,
      }
    },
    name: 'PaginationNav',
    methods: {
      clickHandler (i) {
        this.page = i
        this.updateCurrPage()
      },
      clickPrev () {
        this.page = this.page > 1 ? this.page - 1 : this.page
        this.updateCurrPage()
      },
      clickNext () {
        this.page = this.page < this.totalPages ? this.page + 1 : this.page
        this.updateCurrPage()
      },
      setRestPage (restCase) {
        if (this.totalPages > 5) {
          switch (restCase) {
            case 'left':
              this.showLeftRest = true
              this.showRightRest = false
              break
            case 'right':
              this.showLeftRest = false
              this.showRightRest = true
              break
            case 'both':
              this.showLeftRest = true
              this.showRightRest = true
              break
          }
        }
      },
      updateCurrPage () {
        if (this.currPage !== this.page) {
          debug('Mutation detected: page', this.page)
          this.$emit('update:currPage', this.page)
        }
      }
    },
    mounted () {
      debug('PaginationNav mounted')
      this.$refs[ 'pagination' ].addEventListener('dragstart', (e) => {
        e.preventDefault()
        return false
      }, false)
      this.$refs[ 'pagination' ].addEventListener('selectstart', (e) => {
        e.preventDefault()
        return false
      }, false)
    },
    props: {
      currPage: {
        type: Number,
        default: 1
      },
      totalPages: {
        type: Number,
        default: 0
      }
    },
    watch: {
      currPage (page) {
        this.page = page
      },
      totalPages () {
        debug('Mutation detected: totalPages', this.totalPages)
      },
    },
  }
</script>

<style lang="stylus" scoped>
  .pagination-nav
    font-size 0.75rem
    color #d3d3d3
    > div
      cursor pointer
      margin 0 4px
      width 20px
      padding 2px
      // background-color green
      display inline-flex
      justify-content center
      align-items center
      border-radius 2px
      &:hover
        background-color #f7f7f7
    &__page
      &.active
        color #626262
    &__prev, &__next
      color #626262
  .main-panel
    .pagination-nav
      margin-bottom 25px
      text-align right
</style>