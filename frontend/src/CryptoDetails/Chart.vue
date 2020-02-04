<template>
  <apexchart
    ref="candleChart"
    width="100%"
    height="400"
    type="candlestick"
    :options="chartOptions"
    :series="series"
  />
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  props: ['period', 'currency'],
  computed: {
    ...mapGetters('app', ['getDarkMode']),
    ...mapGetters('cryptoHistory', ['getFormatedPeriodHistory']),
    series () {
      return [
        {
          data: this.getFormatedPeriodHistory({
            period: this.period,
            currency: this.currency
          })
        }
      ]
    }
  },
  mounted () {
    this.updateTheme(this.getDarkMode)
  },
  methods: {
    updateTheme (value) {
      this.$refs.candleChart.updateOptions({
        theme: {
          mode: value ? 'dark' : 'light'
        },
        chart: {
          background: value ? '#424242' : '#FAFAFA'
        }
      })
    }
  },
  watch: {
    '$route': {
      handler (value) {
        this.updateTheme(this.getDarkMode)
      },
      deep: true
    },
    getDarkMode: {
      handler (value) {
        this.updateTheme(value)
      }
    }
  },
  data () {
    return {
      chartOptions: {
        chart: {
          animations: {
            enabled: false
          },
          events: {
            mounted: (chartContext, config) => {
              this.$store.commit('app/UNSET_LOADING')
            },
            updated: (chartContext, config) => {
              this.$store.commit('app/UNSET_LOADING')
            }
          },
          type: 'candlestick',
          height: 350,
          background: this.getDarkMode ? '#424242' : '#FAFAFA'
        },
        xaxis: {
          type: 'datetime'
        },
        yaxis: {
          tooltip: {
            enabled: true
          }
        },
        theme: {
          mode: this.getDarkMode ? 'dark' : 'light'
        }
      }
    }
  }
}
</script>

<style>
</style>
