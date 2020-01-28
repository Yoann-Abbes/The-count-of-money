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
  watch: {
    getDarkMode: {
      handler (value) {
        this.$refs.candleChart.updateOptions({
          theme: {
            mode: value ? 'dark' : 'ligth'
          },
          chart: {
            background: value ? '#424242' : '#FAFAFA'
          }
        })
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
          mode: this.getDarkMode ? 'dark' : 'ligth'
        }
      }
    }
  }
}
</script>

<style>
</style>
