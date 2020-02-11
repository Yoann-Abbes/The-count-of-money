<template>
  <v-navigation-drawer app expand-on-hover permanent dark>
    <template v-slot:prepend v-if="getIsLogged">
      <v-list>
        <v-list-item>
          <v-list-item-avatar>
            <v-img :src="getUserPicture"></v-img>
          </v-list-item-avatar>
        </v-list-item>

        <v-list-item link two-line>
          <v-list-item-content>
            <v-list-item-title class="title">{{getUsername}}</v-list-item-title>
            <v-list-item-subtitle>{{getUserEmail}}</v-list-item-subtitle>
          </v-list-item-content>
        </v-list-item>
        <v-list-item link to="/Preferences">
          <v-list-item-icon>
            <v-icon>fas fa-user-cog</v-icon>
          </v-list-item-icon>
          <v-list-item-title>Preferences</v-list-item-title>
        </v-list-item>
      </v-list>
    </template>

    <v-divider></v-divider>

    <v-list-item>
      <v-list-item-icon>
        <v-switch v-model="darkMode"></v-switch>
      </v-list-item-icon>
      <v-list-item-title>Dark Mode</v-list-item-title>
    </v-list-item>

    <v-divider></v-divider>

    <v-list nav dense>
      <v-list-item
        v-for="cur of getCryptos"
        :to="`/CryptoDetails/${cur.symbol}`"
        :key="cur.symbol"
        link
      >
        <v-list-item-icon>
          <v-img :src="cur.picture_url" aspect-ratio="1.7" />
        </v-list-item-icon>
        <v-list-item-title>
          <span class="overline text-left">{{cur.fullname}}</span>
        </v-list-item-title>
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
    ...mapGetters('app', ['getDarkMode']),
    ...mapGetters('auth', ['getIsLogged']),
    ...mapGetters('auth', ['getUserPicture']),
    ...mapGetters('auth', ['getUsername']),
    ...mapGetters('auth', ['getUserEmail']),
    ...mapGetters('cryptoList', ['getCryptos'])
  },
  watch: {
    darkMode: {
      handler (value) {
        localStorage.setItem('darkMode', value)
        this.$store.commit(`app/${value ? '' : 'UN'}SET_DARKMODE`)
      }
    }
  },
  data () {
    return {
      darkMode: false
    }
  }
}
</script>
