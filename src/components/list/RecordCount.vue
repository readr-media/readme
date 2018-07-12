<template>
  <div class="record-count">
    <span class="prefix" v-text="$t('LIST.RECORD_COUNT.PREFIX')"></span>
    <span class="infix" v-text="total"></span>
    <span class="postfix" v-text="$t('LIST.RECORD_COUNT.POSTFIX')"></span>
  </div>
</template>
<script>
  export default {
    name: 'RecordCount',
    methods: {},
    mounted () {},
    props: {
      total: {
        type: Number,
        default: 0,
      },
    },
  }
</script>
<style lang="stylus" scoped>
  .record-count
    .prefix, .postfix
      color #a1a1a1
    .infix
      color #c1c1c1
      font-weight 800
    > span:not(:first-child)
      margin-left 5px
</style>