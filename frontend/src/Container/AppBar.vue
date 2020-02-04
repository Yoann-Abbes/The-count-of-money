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
    <v-btn text v-if="getIsAdmin" to="/Admin">Admin</v-btn>
    <v-btn text to="/Home">Home</v-btn>
    <v-btn text to="/RssFlows">RSS</v-btn>
    <v-btn text v-if="!getIsLogged" to="/SignUp">Sign Up</v-btn>
    <v-btn text v-if="!getIsLogged" to="/LogIn">Log In</v-btn>
    <v-btn text v-if="getIsLogged" @click="logout">Logout</v-btn>
    <template v-if="$vuetify.breakpoint.smAndUp"></template>
  </v-app-bar>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  computed: {
    ...mapGetters('app', ['getDarkMode']),
    ...mapGetters('auth', ['getIsLogged']),
    ...mapGetters('auth', ['getIsAdmin'])
  },
  methods: {
    logout () {
      this.$store.dispatch('auth/logout')
      this.$store.dispatch('app/showSnackBar', { text: 'GoodBye !', type: 'success' })
      if (this.$route.name !== 'Home') {
        this.$router.push('/')
      }
    }
  }
}
</script>
