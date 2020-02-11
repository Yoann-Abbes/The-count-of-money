<template>
  <v-card elevation="0" :dark="getDarkMode">
    <v-card-title>
      <v-container fluid>
        <v-row>
          <v-col cols="6">Crypto Currencies</v-col>
          <v-col cols="6">
            <v-text-field
              v-model="search"
              color="secondary"
              append-icon="fa-search"
              label="Search"
              single-line
              hide-details
            ></v-text-field>
          </v-col>
        </v-row>
      </v-container>
    </v-card-title>
    <v-data-table
      :dark="getDarkMode"
      :headers="headers"
      :items="getCryptoList"
      :search="search"
      item-key="id"
      class="elevation-1"
    >
      <template v-slot:top>
        <v-toolbar flat :dark="getDarkMode">
          <v-spacer></v-spacer>
          <v-dialog v-model="dialog" max-width="500px">
            <template v-slot:activator="{ on }">
              <v-btn :dark="getDarkMode" class="mb-2" v-on="on">New Crypto Currency</v-btn>
            </template>
            <v-card :dark="getDarkMode">
              <v-card-title>
                <span class="headline">New Crypto Currency</span>
              </v-card-title>

              <v-card-text>
                <v-container>
                  <v-row>
                    <v-col cols="12" sm="6" md="4">
                      <v-text-field v-model="editedCrypto.symbol" label="Symbol"></v-text-field>
                    </v-col>
                  </v-row>
                </v-container>
              </v-card-text>

              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn color="blue darken-1" text @click="close">Cancel</v-btn>
                <v-btn color="blue darken-1" text @click="save">Save</v-btn>
              </v-card-actions>
            </v-card>
          </v-dialog>
        </v-toolbar>
      </template>
      <template v-slot:item.picture_url="{ item }">
        <v-img alt="ICON" class="shrink mr-2" contain :src="item.picture_url" width="25"></v-img>
      </template>
      <template v-slot:item.action="{ item }">
        <v-icon small @click="deleteCrypto(item)">fa-trash</v-icon>
      </template>
    </v-data-table>
  </v-card>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  data: function () {
    return {
      search: '',
      headers: [
        { text: 'Icon', value: 'picture_url' },
        { text: 'Symbol', value: 'symbol' },
        { text: 'Full Name', value: 'fullname' },
        { text: 'Actions', value: 'action', sortable: false }
      ],
      dialog: false,
      editedCrypto: {
        symbol: ''
      }
    }
  },
  async created () {
    await this.$store.dispatch('adminPreference/getCryptoList')
  },
  computed: {
    ...mapGetters('app', ['getDarkMode']),
    ...mapGetters('adminPreference', ['getCryptoList'])
  },
  watch: {
    dialog (val) {
      val || this.close()
    }
  },
  methods: {
    async save () {
      this.$store.commit('app/SET_LOADING')
      const res = await this.$store.dispatch(
        'adminPreference/setCrypto',
        this.editedCrypto
      )
      if (res) {
        this.close()
        this.$store.dispatch('app/showSnackBar', {
          text: `${this.editedCrypto.symbol} successfully added!`,
          type: 'success'
        })
        this.$store.commit('app/UNSET_LOADING')
      } else {
        this.$store.dispatch('app/showSnackBar', {
          text: `An error occured when adding ${this.editedCrypto.symbol}!`,
          type: 'warning'
        })
        this.close()
        this.$store.commit('app/UNSET_LOADING')
      }
    },
    async deleteCrypto (item) {
      this.$store.commit('app/SET_LOADING')
      const resp = await this.$store.dispatch(
        'adminPreference/deleteCrypto',
        item.symbol
      )
      if (resp) {
        this.$store.dispatch('app/showSnackBar', {
          text: `${item.symbol} successfully deleted!`,
          type: 'success'
        })
        this.$store.commit('app/UNSET_LOADING')
      } else {
        this.$store.dispatch('app/showSnackBar', {
          text: `An error occured when deleting ${item.symbol}!`,
          type: 'warning'
        })
        this.$store.commit('app/UNSET_LOADING')
      }
    },
    close () {
      this.dialog = false
      this.editedCrypto.symbol = ''
    }
  }
}
</script>
