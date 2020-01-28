<template>
  <v-app :style="{backgroundColor: getDarkMode? '#424242' : ''}">
    <Overlay />
    <AppBar />
    <SideBar />
    <v-content class="ma-5" v-if="getAppInitiated">
      <router-view></router-view>
    </v-content>
  </v-app>
</template>

<script>
import AppBar from '@/Container/AppBar'
import SideBar from '@/Container/SideBar'
import Overlay from '@/Overlay/Overlay'
import { mapGetters } from 'vuex'

export default {
  name: 'App',
  components: {
    AppBar,
    SideBar,
    Overlay
  },
  computed: {
    ...mapGetters('app', ['getDarkMode']),
    ...mapGetters('app', ['getAppInitiated'])
  },
  mounted () {
    this.$store.dispatch('app/init')
  }
}
</script>

<style lang="scss">
@import "@/core/styles/index.scss";
</style>
