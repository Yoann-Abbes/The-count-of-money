<template>
  <v-card elevation="0" :dark="getDarkMode" class="pa-2">
    <v-form ref="form" v-model="valid" :lazy-validation="lazy">
      <v-text-field
        class="required"
        v-model="name"
        :counter="10"
        :rules="nameRules"
        label="Name*"
        color="secondary"
        required
      ></v-text-field>
      <v-text-field v-model="email" :rules="emailRules" label="E-mail*" color="secondary" required></v-text-field>
      <v-text-field
        v-model="password"
        :rules="passwordRules"
        :append-icon="show1 ? 'fas fa-eye' : 'fas fa-eye-slash'"
        :type="show1 ? 'text' : 'password'"
        @click:append="show1 = !show1"
        label="Password*"
        color="secondary"
        required
      ></v-text-field>
      <v-text-field
        v-model="passwordConfirmation"
        :rules="passwordConfirmationRules"
        :append-icon="show2 ? 'fas fa-eye' : 'fas fa-eye-slash'"
        :type="show2 ? 'text' : 'password'"
        @click:append="show2 = !show2"
        label="Password confirmation*"
        color="secondary"
        required
      ></v-text-field>
      <v-file-input v-model="photo" label="Photo" color="secondary" prepend-icon="fa-user-circle"></v-file-input>
    </v-form>
    <p class="mandatory">* : mandatory field</p>
    <v-card-actions>
      <v-btn color="secondary" :disabled="!valid" @click="validate">Continue</v-btn>
      <v-btn color="secondary" @click="cancel" text>Cancel</v-btn>
    </v-card-actions>
  </v-card>
</template>

<script>
import { mapGetters } from 'vuex'
export default {
  computed: {
    ...mapGetters('app', ['getDarkMode'])
  },
  data () {
    return {
      valid: true,
      lazy: false,
      show1: false,
      show2: false,
      name: '',
      email: '',
      password: '',
      passwordConfirmation: '',
      photo: null,
      nameRules: [
        v => !!v || 'Name is required',
        v => (v && v.length <= 10) || 'Name must be less than 10 characters'
      ],
      emailRules: [
        v => !!v || 'E-mail is required',
        v => /.+@.+\..+/.test(v) || 'E-mail must be valid'
      ],
      passwordRules: [v => !!v || 'Password is required'],
      passwordConfirmationRules: [
        v => !!v || 'Password confirmation must be equal to password',
        v =>
          v === this.password ||
          'Password confirmation must be equal to password'
      ]
    }
  },
  methods: {
    validate () {
      let target = {
        name: this.name,
        email: this.email,
        password: this.password,
        photo: this.photo
      }
      if (this.$refs.form.validate()) {
        this.$emit('clicked', target)
      }
    },
    cancel () {
      this.name = ''
      this.email = ''
      this.password = ''
      this.passwordConfirmation = ''
      this.photo = null
      this.$emit('cancel', '1')
    }
  }
}
</script>

<style scoped>
</style>
