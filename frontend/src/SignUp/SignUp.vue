<template>
  <v-stepper :vertical="vertical" v-model="elem" :dark="getDarkMode">
    <v-stepper-step
      :key="`${1}-step`"
      :complete="elem > 1"
      :step="1"
      color="secondary">
      Account information
    </v-stepper-step>
    <v-stepper-content
      :key="`${1}-content`"
      :step="1">
      <AccountInformation @clicked="onClickAccountInformation" @cancel="onCancel"></AccountInformation>
    </v-stepper-content>
    <v-stepper-step
      :key="`${2}-step`"
      :complete="elem > 2"
      :step="2"
      color="secondary">
      Favorites / Keywords
    </v-stepper-step>
    <v-stepper-content
      :key="`${2}-content`"
      :step="2">
      <FavoritesAndKeywords @clicked="onClickFavoritesAndKeywords" @cancel="onCancel"></FavoritesAndKeywords>
    </v-stepper-content>
    <v-stepper-step
      :key="`${3}-step`"
      :complete="elem > 3"
      :step="3"
      color="secondary">
      Submit
    </v-stepper-step>
    <v-stepper-content
      :key="`${3}-content`"
      :step="3">
      <SubmitConfirmation @clicked="onClickSubmitConfirmation" @cancel="onCancel"></SubmitConfirmation>
    </v-stepper-content>
  </v-stepper>
</template>
<script>
import AccountInformation from './AccountInformation.vue'
import FavoritesAndKeywords from './FavoritesAndKeywords'
import SubmitConfirmation from './SubmitConfirmation'
import { mapGetters } from 'vuex'
export default {
  components: {
    SubmitConfirmation,
    FavoritesAndKeywords,
    AccountInformation
  },
  computed: {
    ...mapGetters('app', ['getDarkMode'])
  },
  data () {
    return {
      elem: 1,
      vertical: true,
      editable: true,
      lazy: false,
      accountInformation: {},
      favoritesAndKeywords: {}
    }
  },
  methods: {
    onClickAccountInformation (value) {
      this.accountInformation = value
      this.elem = 2
    },
    onClickFavoritesAndKeywords (value) {
      this.favoritesAndKeywords = value
      this.elem = 3
    },
    onClickSubmitConfirmation () {
      let target = {
        is_admin: false,
        username: this.accountInformation.name,
        email: this.accountInformation.email,
        password: this.accountInformation.password,
        picture_url: this.accountInformation.photo,
        keywords: this.favoritesAndKeywords.keywords,
        favorites_crypto: this.favoritesAndKeywords.favoritesSelected
      }
      this.elem = 4
      console.log(target)
    },
    onCancel (value) {
      if (value === '1') {
        // window.location.reload()
      } else if (value === '2') {
        this.elem = 1
      } else if (value === '3') {
        this.elem = 2
      }
    }
  }
}
</script>

<style scoped>
</style>
