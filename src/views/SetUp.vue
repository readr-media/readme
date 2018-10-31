<template>
  <div class="setup">
    <SetupBasic></SetupBasic>
  </div>
</template>
<script>
  import SetupBasic from 'src/components/setup/SetupBasic.vue'
  const debug = require('debug')('CLIENT:Seup')
  export default {
    name: 'Setup',
    components: {
      SetupBasic,
    },
    methods: {},
    mounted () {
      debug('this.type', this.$route.params.type)
    },
  }
</script>
<style lang="stylus" scoped>
  .setup
    padding 40px
    background-color #404040
    display flex
    justify-content center
    align-items center  
</style>