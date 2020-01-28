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
    loginUser () {
      let target = {
        email: this.email,
        password: this.password
      }
      this.$store.dispatch('auth/login', target)
        .then(() => {
          this.msgErr = 'success'
          this.msgErrColor = 'green'
          this.$store.dispatch('auth/getProfile')
            .then(() => { this.msgErr = 'success profile' }) // TODO redirect to profile
            .catch(err => console.log(err))
        })
        .catch(err => {
          this.msgErrColor = 'red'
          if (err.status === 400) {
            this.msgErr = 'wrong password or email'
          } else {
            this.msgErr = 'error server'
          }
        })
    }
  }
}
</script>

<style scoped>

</style>
