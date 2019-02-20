<template>
  <div class="list-item-icon">
    <div class="list-item-icon__preview">
      <Spinner :show="isLoading"></Spinner>
      <MidiaPreviewer :file="file"></MidiaPreviewer>
    </div>
    <div class="list-item-icon__title"><span v-text="title"></span></div>
  </div>
</template>
<script>
  import MidiaPreviewer from 'src/components/common/MidiaPreviewer.vue'
  import Spinner from 'src/components/Spinner.vue'
  import axios from 'axios'
  import truncate from 'truncate-html'
  import { get } from 'lodash'
  const debug = require('debug')('CLIENT:ListItemIcon')
  export default {
    name: 'ListItemIcon',
    components: {
      MidiaPreviewer,
      Spinner
    },
    computed: {       
      source () {
        return `${get(this.item, 'destination')}.${get(this.item, 'fileExtension')}`
      },
      title () {
        return truncate(get(this.item, 'title'), 23)
      },
    },
    data () {
      return {
        file: undefined,
        isLoading: false,
      }
    },
    methods: {},
    mounted () {
      this.isLoading = true
      axios.get('/api/asset/fetch?a=' + this.source, {
        responseType: 'arraybuffer',
      }).then(response => {
        debug('response', response)
        this.isLoading = false
        const file = new Blob([response.data], {
          type: get(response, 'headers.content-type')
        })
        this.file = {
          file,
          destination: get(this.item, 'destination'),
          fileExtension: get(this.item, 'fileExtension'),
          source: this.source
        }
      })
      .catch(error => {
        this.isLoading = false
        console.error(error) 
      })
    },
    props: {
      item: {}
    },
  }
</script>
<style lang="stylus" scoped>
  .list-item-icon
    width 100%
    outline none
    &__title
      font-size 0.875rem
      font-weight normal
      font-style normal
      font-stretch normal
      line-height normal
      letter-spacing normal
      text-align justify
      color #000000
      margin 5px 0
    &__preview
      height 100px
      display flex
      justify-content center
      align-items center
</style>