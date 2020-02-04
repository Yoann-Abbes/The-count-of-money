<template>
<div>
  {{getUser}}
</div>
</template>

<script>
import { mapGetters } from 'vuex'
export default {
  computed: {
    ...mapGetters('auth', ['getUser'])
  }
}
</script>

<style>

</style>
