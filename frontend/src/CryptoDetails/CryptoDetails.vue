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
  mounted () {
    this.$store.commit('SET_LOADING')
    setTimeout(() => {
      this.$store.commit('UNSET_LOADING')
    }, 2000)
  }
}
</script>
