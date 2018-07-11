<template>
  <div class="item-editor" v-if="isActive">
    <div class="panel">
      <div class="panel__content">
        <template v-for="obj in structure">
          <div class="panel__content--item" v-if="!obj.isHidden">
            <div class="title" :class="{ short: isShort($t(`${listFlag}.${decamelize(obj.name).toUpperCase()}`)) }">
              <span v-text="$t(`${listFlag}.${decamelize(obj.name).toUpperCase()}`)"></span>
            </div>
            <div class="value">
              <template v-if="obj.isEditable">
                <TextInput v-if="obj.type === 'TextInput'"
                  backgroundColor="#fff"
                  :placeHolder="$t(`${listFlag}.${decamelize(obj.name).toUpperCase()}`)"
                  :value.sync="formData[ obj.name ]"></TextInput>
                <Datetime v-else-if="obj.type === 'Datetime'"
                  v-model="formData[ obj.name ]"
                  input-format="YYYY/MM/DD HH:mm"
                  input-class="datepicker__input"
                  type="datetime"></Datetime>
                <TextareaInput v-else-if="obj.type === 'TextareaInput'"
                  :placeholder="$t(`${listFlag}.${decamelize(obj.name).toUpperCase()}`)"
                  :value.sync="formData[ obj.name ]"></TextareaInput>
                <template v-else-if="obj.type === 'RadioItem'">
                  <RadioItem v-for="opt in obj.options" :name="get(obj, 'name')"
                    :label="$t(`${listFlag}.${decamelize(obj.name).toUpperCase()}_${opt.name}`)"
                    :key="get(opt, 'name')"
                    :value="get(opt, 'value')"
                    :currSelected.sync="formData[ obj.name ]"></RadioItem>                
                </template>
              </template>
              <template v-else>
                <span v-text="get(item, obj.name)"></span>
              </template>
            </div>
          </div>
        </template>
      </div>
      <div class="panel__actions">
        <div class="save" @click="save"><span v-text="$t('EDITOR.SAVE')"></span></div>
        <div class="cancel" @click="close"><span v-text="$t('EDITOR.CANCEL')"></span></div>
      </div>
    </div>
  </div>
</template>
<script>
  import RadioItem from 'src/components/new-form/RadioItem.vue'
  import TextInput from 'src/components/new-form/TextInput.vue'
  import TextareaInput from 'src/components/new-form/TextareaInput.vue'
  import preventScroll from 'prevent-scroll'
  import { Datetime, } from 'vue-datetime'
  import { decamelize, } from 'humps'
  import { get, map, } from 'lodash'
  import 'vue-datetime/dist/vue-datetime.css'
  const debug = require('debug')('CLIENT:ItemEditor')

  export default {
    name: 'ItemEditor',
    components: {
      Datetime,
      RadioItem,
      TextareaInput,
      TextInput,
    },
    computed: {
      listFlag () {
        return get(this.$route, 'params.item', '').toUpperCase()
      },
    },
    data () {
      return {
        formData: {},
      }
    },
    methods: {
      close () {
        this.$emit('update:isActive', false)
      },
      decamelize,
      get,
      initValue () {
        this.formData = {}
        if (this.type === 'update') {
          map(this.structure, item => {
            this.formData[ item.name ] = get(this.item, item.name)
          })
        } else if (this.type === 'create') {
          map(this.structure, item => {
            if (item.isEditable) {
              this.formData[ item.name ] = item.type === 'TextInput' || item.type === 'TextareaInput'
                ? '' : null
            }
          })
        }
      },
      isShort (str) {
        return str.length > 2 || false
      },
      save () {
        if (this.type === 'update') {
          this.update(this.formData).then(() => {
            this.$emit('update:isActive', false)
          }).catch(err => {
            debug('err', err)
          })
        } else if (this.type === 'create') {
          this.add(this.formData).then(() => {
            this.$emit('update:isActive', false)
          }).catch(err => {
            debug('err', err)
          })          
        }
      },
    },
    beforeMount () {
      this.initValue()
    },
    mounted () {},
    props: {
      add: {
        type: Function,
        default: (form) => new Promise(resolve => {
          debug('Run add default.') 
          debug('form:', form)
          resolve()
        }),
      },
      isActive: {
        type: Boolean,
        default: () => false,
      },
      structure: {
        type: Array,
      },
      item: {
        type: Object,
        default: () => {},
      },
      update: {
        type: Function,
        default: (form) => new Promise(resolve => {
          debug('Run update default.') 
          debug('form:', form)
          resolve()
        }),
      },
      type: {
        type: String,
        required: true,
      },
    },
    watch: {
      isActive () {
        if (this.isActive) {
          preventScroll.on()
        } else {
          preventScroll.off()
        }
      },   
      item () {
        this.initValue()
      }, 
      structure () {
        this.initValue()
      },  
    },
  }
</script>
<style lang="stylus" scoped>
  .item-editor
    position fixed
    left 0
    top 0
    height 100vh
    width 100vw
    background-color rgba(0,0,0,0.65)
    z-index 9998
    display flex
    justify-content center
    align-items center
    .panel
      overflow hidden
      // max-height 90%
      height 90%
      width 75%
      // min-width 400px
      background-color rgba(250,250,250,0.9)
      box-shadow 0px 0px 10px rgba(250,250,250,0.8)
      border-radius 2px
      padding 30px 50px 70px
      position relative
      &__content
        overflow auto
        height 100%
        // display flex
        // flex-wrap wrap
        // justify-content space-between
        padding-bottom 20px
        border-bottom 1px solid #940606
        &--item
          // width 400px
          display flex
          align-items center
          font-size 1.125rem
          line-height normal
          // margin-right 40px
          margin-bottom 20px
          .title
            margin-right 20px
            height 100%
            width 100px
          .value
            flex 1
      &__actions
        display flex
        justify-content flex-end
        height 30px
        width 100%
        position absolute
        left 0
        bottom 20px
        padding 0 50px
        > div
          // flex 1
          width 100px
          display flex
          justify-content center
          align-items center
          background-color rgba(150,111,0,0.7)
          box-shadow 0px 0px 5px rgba(100,100,100,0.5)
          border-radius 2px
          padding 5px
          cursor pointer
          &:not(:last-child)
            margin-right 10px
          &:hover
            background-color rgba(203,175,94,0.7)
            box-shadow 0px 0px 5px rgba(250,250,250,0.5)       
</style>