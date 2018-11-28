<template>
  <div class="quill-editor-wrapper">
    <slot></slot>
    <ValueSetter></ValueSetter>    
  </div>
</template>
<script>
  import ValueSetter from 'src/components/form/Quill/ValueSetter.vue'
  export default {
    name: 'QuillEditorWrapper',
    components: {
      ValueSetter,
    },
    methods: {},
    mounted () {},
  }
</script>
<style lang="stylus" scoped></style>