<template>
  <v-app :style="{backgroundColor: getDarkMode? '#424242' : ''}" v-if="getAppInitiated">
    <Overlay />
    <AppBar />
    <SideBar />
    <v-content class="ma-5">
      <router-view></router-view>
      <v-snackbar :color="getSnackBarType" v-model="getSnackBarDisplayed">
        {{ getSnackBarText }}
      </v-snackbar>
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
    ...mapGetters('app', ['getAppInitiated']),
    ...mapGetters('app', ['getSnackBarDisplayed']),
    ...mapGetters('app', ['getSnackBarText']),
    ...mapGetters('app', ['getSnackBarType'])
  },
  mounted () {
    this.$store.dispatch('app/init')
  }
}
</script>

<style lang="scss">
@import "@/core/styles/index.scss";
</style>
