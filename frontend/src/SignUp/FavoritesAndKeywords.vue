<template>
  <v-card elevation="0" :dark="getDarkMode">
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
    </form>
    <v-card-actions>
      <v-btn color="secondary" @click="validate">Continue</v-btn>
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
          hour: 0.3,
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
  methods: {
    validate () {
      let target = {
        keywords: this.keywords,
        favoritesSelected: this.favoritesSelected
      }
      this.$emit('clicked', target)
    },
    cancel () {
      this.favoritesSelected = []
      this.keywords = []
      this.$emit('cancel', '2')
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
