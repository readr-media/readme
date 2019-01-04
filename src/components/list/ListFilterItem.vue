<template>
  <TextInput v-if="type === 'TextInput'" 
    fontWeight="normal"
    fontSize="0.875rem"
    :placeHolder="$t(`${key}.FILTER_PLACEHOLDER.${name.toUpperCase()}`)"
    :value.sync="val" />
  <ListFilterItemDatetime v-else-if="type === 'Datetime'"
    :value.sync="val" />
</template>
<script>
  import TextInput from 'src/components/form/TextInput.vue'
  import ListFilterItemDatetime from './ListFilterItemDatetime.vue'
  export default {
    name: 'ListFilterItem',
    components: {
      ListFilterItemDatetime,
      TextInput
    },
    data () {
      return {
        key: '',
        val: '',
      }
    },
    methods: {},
    beforeMount () {
      this.key = this.$store.getters.modelName
    },
    mounted () {
      this.val = this.value
    },
    props: {
      type: {},
      name: {},
      value: {},
    },
    watch: {
      '$store.getters.structure': function (newVals, oldVals) {
        if (newVals !== oldVals) {
          this.key = this.$store.getters.modelName
        }
      },      
      val () {
        this.$emit('update:value', this.val)
      }
    }
  }
</script>
<style lang="stylus" scoped></style>