<template>
  <v-layout
    column
    justify-center
    align-center>
    <v-flex
      xs12
      sm8
      md6>
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
            <v-btn
              color="secondary"
              type="submit">
              Log In
            </v-btn>
            Want to Register? Register <a href="/SignUp">
            here
          </a>
          </form>
          <LogInFacebook/>
        </v-card-text>
      </v-card>
    </v-flex>
  </v-layout>
</template>

<script>
import LogInFacebook from '../LogInFacebook/LogInFacebook.vue'
export default {
  components: {
    LogInFacebook
  },
  data: function () {
    return {
      email: '',
      password: ''
    }
  },
  methods: {
    loginUser () {
      let target = {
        email: this.email,
        password: this.password
      }
      console.log(target)
    }
  }
}
</script>

<style scoped>

</style>
