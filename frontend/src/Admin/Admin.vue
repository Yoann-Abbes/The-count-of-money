<template>
  <v-container>
    <ManageCryptocurrency />
    <ManageRSS />
  </v-container>
</template>

<script>
import ManageCryptocurrency from './ManageCryptocurrency'
import ManageRSS from './ManageRSS'
export default {
  components: { ManageRSS, ManageCryptocurrency }
}
</script>

<style scoped>

</style>
