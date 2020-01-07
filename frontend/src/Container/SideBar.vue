<template>
  <v-navigation-drawer app expand-on-hover permanent dark>
    <template v-slot:prepend>
      <v-list>
        <v-list-item>
          <v-list-item-avatar>
            <v-img src="https://randomuser.me/api/portraits/women/85.jpg"></v-img>
          </v-list-item-avatar>
        </v-list-item>

        <v-list-item link two-line>
          <v-list-item-content>
            <v-list-item-title class="title">Sandra Adams</v-list-item-title>
            <v-list-item-subtitle>sandra_a88@gmail.com</v-list-item-subtitle>
          </v-list-item-content>
          <v-list-item-action>
            <!-- <v-icon>fa-arrow-up</v-icon> -->
          </v-list-item-action>
        </v-list-item>
        <v-list-item>
          <v-list-item-icon>
            <v-switch v-model="darkMode"></v-switch>
          </v-list-item-icon>
          <v-list-item-title>Dark Mode</v-list-item-title>
        </v-list-item>
      </v-list>
    </template>

    <v-divider></v-divider>

    <v-list nav dense>
      <v-list-item
        link
        :to="`/CryptoDetails/${cur.currency}`"
        v-for="cur of cryptoCurrency"
        :key="cur.currency"
      >
        <v-list-item-icon>
          <v-icon>{{cur.icon}}</v-icon>
        </v-list-item-icon>
        <v-list-item-title>
          <span class="overline text-left">{{cur.value}}</span>
        </v-list-item-title>
        <v-list-item-subtitle>
          <span class="subtitle-2 text-right green--text">{{cur.percentage}}%</span>
          <v-icon dense v-if="cur.percentage > 0" color="#2E7D32">fa-arrow-up</v-icon>
          <v-icon dense v-if="cur.percentage === 0" color="#BDBDBD">fa-arrow-right</v-icon>
          <v-icon dense v-if="cur.percentage < 0" color="#C62828">fa-arrow-down</v-icon>
        </v-list-item-subtitle>
      </v-list-item>
    </v-list>
  </v-navigation-drawer>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  mounted () {
    this.darkMode = this.getDarkMode
  },
  computed: {
    ...mapGetters(['getDarkMode'])
  },
  watch: {
    darkMode: {
      handler (value) {
        this.$store.commit(`${value ? '' : 'UN'}SET_DARKMODE`)
      }
    }
  },
  data () {
    return {
      darkMode: false,
      cryptoCurrency: [
        {
          currency: 'BTC',
          icon: 'fab fa-bitcoin',
          value: '3232.234',
          percentage: '0.98'
        }
      ]
    }
  }
}
</script>

<style>
</style>
