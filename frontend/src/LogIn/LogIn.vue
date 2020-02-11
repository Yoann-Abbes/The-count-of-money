<template>
  <v-container>
    <v-row>
      <v-col md="4" offset-md="4">
        <v-img alt="BITSOFCOIN" class="text-xs-center" src="@/core/assets/logo3.png" width="420"></v-img>
        <v-card width="420" :dark="getDarkMode">
          <v-card-title class="headline">Login Here</v-card-title>
          <v-card-text>
            <form @submit.prevent="loginUser">
              <v-text-field v-model="email" label="Email" color="secondary" required></v-text-field>
              <v-text-field
                v-model="password"
                :append-icon="show1 ? 'fas fa-eye' : 'fas fa-eye-slash'"
                :type="show1 ? 'text' : 'password'"
                @click:append="show1 = !show1"
                label="Password"
                color="secondary"
                required
              ></v-text-field>
              <p v-bind:style="{ color: msgErrColor }">{{msgErr}}</p>
              <v-btn color="secondary" type="submit">Log In</v-btn>Want to Register? Register
              <router-link to="/SignUp">here</router-link>
            </form>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  computed: {
    ...mapGetters('app', ['getDarkMode'])
  },
  data () {
    return {
      email: '',
      password: '',
      msgErr: '',
      msgErrColor: 'None',
      show1: false
    }
  },
  methods: {
    async loginUser () {
      let target = {
        email: this.email,
        password: this.password
      }
      const responseLogin = await this.$store.dispatch('auth/login', target)
      this.msgErr = responseLogin.message
      if (responseLogin.status) {
        this.msgErrColor = 'green'
        this.$router.push('/')
        // TODO redirection home page
      } else {
        this.msgErrColor = 'red'
      }
    }
  }
}
</script>

<style scoped>
</style>
