<template>
  <v-card elevation="0" :dark="getDarkMode" class="pa-2">
    <v-form ref="formConfirmation" v-model="confirmation" :lazy-validation="lazy">
      <v-checkbox
        class="final"
        color="#4BC867"
        :rules="[v => !!v || 'You must agree to submit!']"
        label="Do you agree?"
        required
      ></v-checkbox>
    </v-form>
    <v-card-actions>
      <v-btn color="secondary" @click="submit">Continue</v-btn>
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
      lazy: false,
      confirmation: false,
      formConfirmation: false
    }
  },
  methods: {
    submit () {
      if (this.$refs.formConfirmation.validate()) {
        this.$emit('clicked')
      }
    },
    cancel () {
      this.confirmation = false
      this.formConfirmation = false
      this.$emit('cancel', '3')
    }
  }
}
</script>

<style scoped>
.final {
  margin-left: 3rem;
}
</style>
