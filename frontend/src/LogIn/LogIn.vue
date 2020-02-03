<template>
  <v-container>
    <v-row>
      <v-col md="4" offset-md="4">
        <v-img
          alt="BITSOFCOIN"
          class="text-xs-center"
          src="@/core/assets/logo3.png"
          width="420">
        </v-img>
        <v-card width="420">
          <v-card-title class="headline">
            Login Here
          </v-card-title>
          <v-card-text>
            <form @submit.prevent="loginUser">
              <v-text-field
                v-model="email"
                label="Email"
                color="secondary"
                required>
              </v-text-field>
              <v-text-field
                v-model="password"
                label="Password"
                color="secondary"
                type="password"
                required>
              </v-text-field>
              <p v-bind:style="{ color: msgErrColor }">{{msgErr}}</p>
              <v-btn
                color="secondary"
                type="submit">
                Log In
              </v-btn>
              Want to Register? Register <a href="/SignUp">
              here
            </a>
            </form>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
export default {
  data: function () {
    return {
      email: '',
      password: '',
      msgErr: '',
      msgErrColor: 'None'
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
