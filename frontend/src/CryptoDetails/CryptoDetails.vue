<template>
  <div>
    <Chart />
  </div>
</template>

<script>
import Chart from './Chart.vue'

export default {
  name: 'home',
  components: {
    Chart
  },
  created () {
    this.$store.commit('SET_LOADING')
  },
  mounted () {
    setTimeout(() => {
      this.$store.commit('UNSET_LOADING')
    }, 500)
  }
}
</script>
