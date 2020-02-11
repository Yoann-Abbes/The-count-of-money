<template>
  <v-container fluid>
    <v-row v-if="getIsLogged">
      <v-col cols="12">
        <v-btn :dark="getDarkMode" link @click="onlyFavourite = !onlyFavourite">{{getButtonText}}</v-btn>
      </v-col>
    </v-row>
    <v-row>
      <v-col cols="12">
        <v-data-table
          :items-per-page="10"
          :headers="headers"
          :items="items"
          class="elevation-1"
          :dark="getDarkMode"
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
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  data () {
    return {
      onlyFavourite: false
    }
  },
  mounted () {
    this.onlyFavourite = this.getIsLogged
  },
  watch: {
    getIsLogged: {
      handler (value) {
        this.onlyFavourite = value
      }
    }
  },
  computed: {
    ...mapGetters('cryptoList', ['getCryptos']),
    ...mapGetters('app', ['getDarkMode']),
    ...mapGetters('auth', ['getIsLogged']),
    ...mapGetters('auth', ['getFavouriteCrypto']),
    getButtonText () {
      return this.onlyFavourite
        ? 'See all crypto'
        : 'Filter with your favourites'
    },
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
      }).filter(crypto => {
        return this.onlyFavourite ? this.getFavouriteCrypto.includes(crypto.id.toString()) : true
      })
    }
  },
  methods: {
    getColor (item) {
      return item.openDay - item.closeDay > 0 ? 'green' : 'red'
    },
    getVariation (item) {
      return (
        Math.round((item.openDay - item.closeDay + Number.EPSILON) * 100) / 100
      )
    }
  }
}
</script>
