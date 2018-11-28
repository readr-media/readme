<template>
  <div id="app" class="app">
    <ReadMeHeader class="app-header"></ReadMeHeader>
    <ReadMeAside class="app-aside"></ReadMeAside>
    <Alert></Alert>
    <transition name="fade" mode="out-in">
      <router-view class="view"></router-view>
    </transition>
    <SystemInfo></SystemInfo>
  </div>
</template>

<script>
import Alert from 'src/components/Alert.vue'
import ReadMeHeader from 'src/components/header/ReadMeHeader.vue'
import ReadMeAside from 'src/components/aside/ReadMeAside.vue'
import SystemInfo from 'src/components/SystemInfo.vue'

export default {
  components: {
    Alert,
    ReadMeHeader,
    ReadMeAside,
    SystemInfo,
  },  
}
</script>

<style lang="stylus">
a, a:hover, a:link, a:visited
  text-decoration none
  color #000
  

button
  cursor pointer
  &:disabled
    cursor not-allowed
.view
  min-height calc(100vh - 60px)
  margin 0 auto
  position relative
    
.datepicker__input
  padding-left 10px
  width 100%
  height 35px
  color #808080
  border none

.fade-enter-active, .fade-leave-active
  transition all .2s ease

.fade-enter, .fade-leave-active
  opacity 0


.app
  padding-top 60px
  padding-left 250px
  position relative
  background-color #fff
  min-height 100vh

  &-header
    position absolute
    left 0
    top 0
    z-index 2
  &-aside
    position absolute
    left 0
    top 0
    z-index 1
@media screen and (min-width: 1200px)
  .app
    padding-left 310px

</style>
