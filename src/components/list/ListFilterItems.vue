<template>
  <TextInput v-if="type === 'TextInput'" 
    fontWeight="normal"
    fontSize="0.875rem"
    :placeHolder="$t(`LIST.FILTER.PLACEHOLDER.${name}`)"/>
</template>
<script>
  import TextInput from 'src/components/form/TextInput.vue'
  export default {
    name: 'ListFilterItems',
    components: {
      TextInput
    },
    methods: {},
    mounted () {},
    props: {
      type: {},
      name: {},
    }
  }
</script>
<style lang="stylus" scoped></style>