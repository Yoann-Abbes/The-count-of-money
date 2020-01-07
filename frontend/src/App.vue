<template>
  <v-app>
    <Overlay />
    <AppBar />
    <SideBar />
    <v-content class="ma-5">
      <router-view></router-view>
    </v-content>
  </v-app>
</template>

<script>
import AppBar from '@/Container/AppBar'
import SideBar from '@/Container/SideBar'
import Overlay from '@/Overlay/Overlay'

export default {
  name: 'App',
  components: {
    AppBar,
    SideBar,
    Overlay
  }
}
</script>

<style lang="scss">
@import "@/core/styles/index.scss";
</style>
