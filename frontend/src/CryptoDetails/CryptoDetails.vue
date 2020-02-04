<template>
  <v-container fluid>
    <v-row align="center">
      <v-col cols="1">
        <v-img :src="picture" />
      </v-col>
      <v-col cols="7" dark>
        <p class="p-0 m-0 display-3 font-weight-black">{{title}}</p>
      </v-col>
      <v-col cols="2">
        <v-btn
          :dark="getDarkMode"
          @click="toggleRealtime"
        >{{realTimeEnabled? 'Disable realtime' : 'Enable realtime'}}</v-btn>
      </v-col>
      <v-col cols="2">
        <v-select :items="periods" v-model="period" label="Period" :dark="getDarkMode" />
      </v-col>
    </v-row>
    <v-row>
      <v-col cols="12">
        <Chart v-if="historyAvailable" :period="period" :currency="currency" />
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import Chart from './Chart.vue'
import { mapGetters } from 'vuex'

export default {
  name: 'home',
  components: {
    Chart
  },
  data () {
    return {
      period: 'minute',
      periods: ['minute', 'hourly', 'daily'],
      realTimeEnabled: true,
      intervalId: null
    }
  },
  computed: {
    ...mapGetters('app', ['getDarkMode']),
    ...mapGetters('cryptoList', ['getCryptoBySymbol']),
    crypto () {
      return this.getCryptoBySymbol(this.currency)
    },
    title () {
      return this.getCryptoBySymbol(this.currency).fullname
    },
    picture () {
      return this.getCryptoBySymbol(this.currency).picture_url
    },
    currency () {
      return this.$route.params.currency
    },
    historyAvailable () {
      return this.$store.getters['cryptoHistory/historyAvailable']({
        period: this.period,
        currency: this.currency
      })
    }
  },
  async mounted () {
    await this.$store.commit('app/SET_LOADING')
    this.fetchNewHistory()
    this.intervalId = setInterval(() => {
      this.fetchNewHistory()
    }, 60000)
  },
  methods: {
    toggleRealtime () {
      this.realTimeEnabled = !this.realTimeEnabled
      if (this.realTimeEnabled) {
        this.intervalId = setInterval(() => {
          this.fetchNewHistory()
        }, 60000)
      } else {
        clearInterval(this.intervalId)
        this.intervalId = null
      }
    },
    async fetchNewHistory () {
      await this.$store.dispatch(
        'cryptoHistory/fetchAllPeriodHistory',
        this.currency
      )
    }
  },
  watch: {
    '$route.params.currency': {
      async handler () {
        await this.$store.commit('app/SET_LOADING')
        this.fetchNewHistory()
      }
    }
  }
}
</script>
