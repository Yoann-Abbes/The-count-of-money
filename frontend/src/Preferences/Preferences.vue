<template>
  <v-container fluid>
    <v-row>
      <v-col cols="6">
        <v-text-field :dark="getDarkMode" outlined label="Username" v-model="nicknameInput"></v-text-field>
      </v-col>
      <v-col cols="6">
        <!-- THE FOLLOWING LINE IS BULLSHIT -->
        <v-select
          :dark="getDarkMode"
          outlined
          label="Default currency"
          value="EUR"
          :items="['EUR']"
        ></v-select>
      </v-col>
    </v-row>
    <v-row>
      <v-col cols="12">
        <v-card elevation="0" :dark="getDarkMode">
          <v-card-title>
            Favorite Crypto Currency
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
            :items-per-page="5"
            :items="items"
            :search="search"
            item-key="name"
            show-select
            class="elevation-1"
          >
            <template v-slot:item.logo="{ item }">
              <v-list-item-icon>
                <v-img :src="item.logo" aspect-ratio="1" />
              </v-list-item-icon>
            </template>
            <template v-slot:item.dayVariation="{ item }">
              <v-chip :color="item.color" dark>{{ item.dayVariation }}</v-chip>
            </template>
          </v-data-table>
        </v-card>
      </v-col>
    </v-row>
    <v-row>
      <v-col cols="12">
        <v-card elevation="0" :dark="getDarkMode">
          <v-card-title>
            Keywords
            <v-spacer></v-spacer>
            <v-text-field
              v-model="currentKeyword"
              color="secondary"
              append-icon="fa-plus-square"
              label="Add keyword"
              single-line
              hide-details
              @click:append="addChip"
              @keyup="addChipEnterKey"
            ></v-text-field>
          </v-card-title>
          <v-chip
            v-for="item in keywords"
            :key="item"
            @click:close="closeChip(item)"
            class="ma-2"
            close
          >{{item}}</v-chip>
        </v-card>
      </v-col>
    </v-row>
    <v-row>
      <v-btn color="secondary" @click="confirm">Confirm</v-btn>
    </v-row>
  </v-container>
</template>

<script>
import { mapGetters } from 'vuex'
export default {
  computed: {
    ...mapGetters('app', ['getDarkMode']),
    ...mapGetters('auth', ['getKeywords']),
    ...mapGetters('auth', ['getFavouriteCrypto']),
    ...mapGetters('auth', ['getUsername']),
    ...mapGetters('cryptoList', ['getCryptos']),
    headers () {
      return [
        { text: 'Logo', value: 'logo' },
        {
          text: 'Name',
          align: 'left',
          sortable: true,
          value: 'name'
        },
        { text: 'Day Variation', value: 'dayVariation' },
        { text: 'Open', value: 'openDay' },
        { text: 'High', value: 'highDay' },
        { text: 'Close', value: 'closeDay' },
        { text: 'Low', value: 'lowDay' }
      ]
    },
    items () {
      return this.getCryptos.map(crypto => {
        return {
          id: crypto.id,
          logo: crypto.picture_url,
          name: crypto.fullname,
          openDay: crypto.openDay,
          closeDay: crypto.closeDay,
          highDay: crypto.highDay,
          lowDay: crypto.lowDay,
          color: this.getColor(crypto),
          dayVariation: this.getVariation(crypto)
        }
      })
    }
  },
  data () {
    return {
      keywords: [],
      currentKeyword: '',
      search: '',
      favoritesSelected: [],
      nicknameInput: ''
    }
  },
  mounted () {
    this.keywords = this.getKeywords || []
    this.favoritesSelected = this.items.filter(crypto => {
      return this.getFavouriteCrypto.includes(crypto.id.toString())
    })
    this.nicknameInput = this.getUsername
  },
  methods: {
    getColor (item) {
      return item.openDay - item.closeDay > 0 ? 'green' : 'red'
    },
    getVariation (item) {
      return (
        Math.round((item.openDay - item.closeDay + Number.EPSILON) * 100) / 100
      )
    },
    async confirm () {
      const values = {
        newFavorites: this.favoritesSelected.map(f => f.id.toString()),
        newKeywords: this.keywords,
        newUsername: this.nicknameInput
      }
      const updateStatus = await this.$store.dispatch('auth/updateUserInfos', values)
      if (updateStatus) {
        this.$store.dispatch('app/showSnackBar', { text: `Profile successfully updated !`, type: 'success' })
        this.$router.push('/')
      } else {
        this.$store.dispatch('app/showSnackBar', { text: `An error occured during the update of your profile`, type: 'warning' })
      }
    },
    addChip () {
      if (
        this.currentKeyword.trim() !== '' &&
        !this.keywords.includes(this.currentKeyword)
      ) {
        this.keywords.push(this.currentKeyword)
        this.currentKeyword = ''
      }
    },
    addChipEnterKey (e) {
      if (
        this.currentKeyword.trim() !== '' &&
        !this.keywords.includes(this.currentKeyword) &&
        e.keyCode === 13
      ) {
        this.keywords.push(this.currentKeyword.trim())
        this.currentKeyword = ''
      }
    },
    closeChip (item) {
      let index = this.keywords.indexOf(item)
      this.keywords.splice(index, 1)
    }
  }
}
</script>
