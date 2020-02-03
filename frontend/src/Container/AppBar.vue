<template>
  <v-app-bar app dark>
    <router-link class="d-flex align-center" :to="'/'">
      <v-img
        alt="BITSOFCOIN"
        class="shrink mr-2"
        contain
        src="@/core/assets/logo2.png"
        transition="scale-transition"
        width="100"
      />
      <v-img
        alt="BITSOFCOIN"
        class="shrink mt-1 hidden-sm-and-down"
        contain
        min-width="100"
        src="@/core/assets/Brand.png"
        width="250"
      />
    </router-link>

    <v-spacer></v-spacer>
    <v-btn text to="/RssFlows">RSS</v-btn>
    <v-btn text to="/SignUp">Sign Up</v-btn>
    <v-btn text to="/LogIn">Log In</v-btn>
    <template v-if="$vuetify.breakpoint.smAndUp"></template>
  </v-app-bar>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  computed: {
    ...mapGetters('app', ['getDarkMode'])
  }
}
</script>
