<template>
  <v-stepper :vertical="vertical" v-model="elem">
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
      <v-card elevation="0">
        <v-form
          ref="form"
          v-model="valid"
          :lazy-validation="lazy">
          <v-text-field
            class="required"
            v-model="name"
            :counter="10"
            :rules="nameRules"
            label="Name*"
            color="secondary"
            required></v-text-field>
          <v-text-field
            v-model="email"
            :rules="emailRules"
            label="E-mail*"
            color="secondary"
            required></v-text-field>
          <v-text-field
            v-model="password"
            :rules="passwordRules"
            label="Password*"
            color="secondary"
            required></v-text-field>
          <v-text-field
            v-model="passwordConfirmation"
            :rules="passwordConfirmationRules"
            label="Password confirmation*"
            color="secondary"
            required></v-text-field>
          <v-file-input
            v-model="photo"
            label="Photo"
            color="secondary"
            prepend-icon="fa-user-circle"></v-file-input>
        </v-form>
      </v-card>
      <p class="mandatory">* : mandatory field</p>
      <v-btn
        color="secondary"
        :disabled="!valid"
        @click="validate1">
        Continue
      </v-btn>
      <v-btn
        color="secondary"
        @click="cancel1"
        text>
        Cancel
      </v-btn>
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
      <v-card elevation="0">
        <form>
          <v-card elevation="0">
            <v-card-title>
              Favorite Crypto Currency (Optional)
              <v-spacer></v-spacer>
              <v-text-field
                v-model="search"
                color="secondary"
                append-icon="fa-search"
                label="Search"
                single-line
                hide-details
              ></v-text-field>
            </v-card-title>
            <v-data-table
              v-model="favoritesSelected"
              :headers="headers"
              :items="favorites"
              :search="search"
              item-key="name"
              show-select
              class="elevation-1"
            ></v-data-table>
          </v-card>
          <v-card elevation="0">
            <v-card-title>
              Keywords (Optional)
              <v-spacer></v-spacer>
              <v-text-field
                v-model="currentKeyword"
                color="secondary"
                append-icon="fa-plus-square"
                label="Search"
                single-line
                hide-details
                @click:append="addChip"
                @keyup="addChipKey"
              ></v-text-field>
            </v-card-title>
            <v-chip
              v-for="item in keywords"
              :key="item"
              @click:close="closeChip(item)"
              class="ma-2"
              close>
              {{item}}
            </v-chip>
          </v-card>
        </form>
      </v-card>
      <v-btn
        color="secondary"
        @click="validate2">
        Continue
      </v-btn>
      <v-btn
        color="secondary"
        @click="cancel2"
        text>
        Cancel
      </v-btn>
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
      <v-card elevation="0">
        <v-form
          ref="formConfirmation"
          v-model="confirmation"
          :lazy-validation="lazy">
          <v-checkbox
            class="final"
            color="#4BC867"
            :rules="[v => !!v || 'You must agree to submit!']"
            label="Do you agree?"
            required></v-checkbox>
        </v-form>
      </v-card>
      <v-btn
        color="secondary"
        @click="submit">
        Continue
      </v-btn>
      <v-btn
        color="secondary"
        @click="cancel3"
        text>Cancel</v-btn>
    </v-stepper-content>
  </v-stepper>
</template>

<script>
export default {
  data: function () {
    return {
      elem: 1,
      vertical: true,
      editable: true,

      valid: true,
      lazy: false,
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
      passwordRules: [
        v => !!v || 'Password is required'
      ],
      passwordConfirmationRules: [
        v => !!v || 'Password confirmation must be equal to password',
        v => v === this.password || 'Password confirmation must be equal to password'
      ],

      keywords: [],
      currentKeyword: '',

      search: '',
      headers: [
        {
          text: 'Name',
          align: 'left',
          sortable: false,
          value: 'name'
        },
        { text: 'Symbol', value: 'symbol' },
        { text: 'Capital Market (€)', value: 'capital' },
        { text: 'Price (€)', value: 'price' },
        { text: 'Outstanding Offer', value: 'outstanding' },
        { text: 'Volume (24h)', value: 'volume' },
        { text: '% 1h', value: 'hour' },
        { text: '% 24h', value: 'hour24' },
        { text: '% 7j', value: 'week' }
      ],
      favorites: [
        {
          name: 'Bitcoin',
          symbol: 'BTC',
          capital: 139115360496,
          price: 7668.85,
          outstanding: 18159712,
          volume: 26456005213,
          hour: 0.30,
          hour24: 4.93,
          week: 8.07
        },
        {
          name: 'Ethereum',
          symbol: 'ETH',
          capital: 14754890165,
          price: 135.03,
          outstanding: 109271560,
          volume: 9171025522,
          hour: 0.75,
          hour24: 4.49,
          week: 4.92
        },
        {
          name: 'XRP',
          symbol: 'XRP',
          capital: 8647634066,
          price: 0.199409,
          outstanding: 43366238611,
          volume: 1449114597,
          hour: 2.08,
          hour24: 4.29,
          week: 3.14
        }
      ],
      favoritesSelected: [],
      confirmation: false,
      formConfirmation: false
    }
  },
  watch: {
  },
  methods: {
    validate1 () {
      if (this.$refs.form.validate()) {
        this.elem = 2
      }
    },
    validate2 () {
      this.elem = 3
    },
    submit () {
      let target = {
        is_admin: false,
        username: this.name,
        email: this.email,
        password: this.password,
        picture_url: this.photo,
        keyword: this.keyword,
        favorites_crypto: this.favoritesSelected
      }
      if (this.$refs.formConfirmation.validate()) {
        console.log(target)
        this.elem = 4
      }
    },
    cancel1 () {
      window.location.reload()
    },
    cancel2 () {
      this.favoritesSelected = []
      this.keywords = []
      this.elem = 1
    },
    cancel3 () {
      this.confirmation = false
      this.formConfirmation = false
      this.elem = 2
    },
    addChip () {
      if (this.currentKeyword.trim() !== '' && !this.keywords.includes(this.currentKeyword)) {
        this.keywords.push(this.currentKeyword)
        this.currentKeyword = ''
      }
    },
    addChipKey (e) {
      if (this.currentKeyword.trim() !== '' && !this.keywords.includes(this.currentKeyword) && e.keyCode === 13) {
        this.keywords.push(this.currentKeyword.trim())
        this.currentKeyword = ''
      }
    },
    closeChip (item) {
      console.log(item)
      console.log(this.keywords)
      let index = this.keywords.indexOf(item)
      this.keywords.splice(index, 1)
      console.log(this.keywords)
    }
  }
}
</script>

<style scoped>
 .final{
   margin-left: 3rem;
 }
  .mandatory{
    opacity: 0.5;
  }
</style>
