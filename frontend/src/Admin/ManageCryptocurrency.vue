<template xmlns:v-slot="http://www.w3.org/1999/XSL/Transform">
  <v-card elevation="0">
    <v-card-title>
      Favorite Crypto Currency
      <v-spacer></v-spacer>
      <v-text-field
        v-model="search"
        color="secondary"
        append-icon="fa-search"
        label="Search"
        single-line
        hide-details
      ></v-text-field>
    </v-card-title>
    <v-data-table
      :headers="headers"
      :items="favorites"
      :search="search"
      item-key="id"
      class="elevation-1">
      <template v-slot:top>
        <v-toolbar flat color="white">
          <v-spacer></v-spacer>
          <v-dialog v-model="dialog" max-width="500px">
            <template v-slot:activator="{ on }">
              <v-btn color="primary" dark class="mb-2" v-on="on">New Crypto Currency</v-btn>
            </template>
            <v-card>
              <v-card-title>
                <span class="headline">New Crypto Currency</span>
              </v-card-title>

              <v-card-text>
                <v-container>
                  <v-row>
                    <v-col cols="12" sm="6" md="4">
                      <v-text-field v-model="editedCrypto.symbol" label="Symbol"></v-text-field>
                    </v-col>
                    <v-col cols="12" sm="6" md="4">
                      <v-text-field v-model="editedCrypto.fullname" label="Full name"></v-text-field>
                    </v-col>
                    <v-col cols="12" sm="6" md="4">
                      <v-text-field v-model="editedCrypto.picture_url" label="picture url"></v-text-field>
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
        <v-img
          alt="ICON"
          class="shrink mr-2"
          contain
          :src="item.picture_url"
          width="25">
        </v-img>
      </template>
      <template v-slot:item.action="{ item }">
        <v-icon
          small
          @click="deleteC(item)">
          fa-trash
        </v-icon>
      </template>
    </v-data-table>
  </v-card>
</template>

<script>
export default {
  data: function () {
    return {
      search: '',
      headers: [
        {
          text: '#',
          align: 'left',
          sortable: false,
          value: 'id'
        },
        { text: 'Icon', value: 'picture_url' },
        { text: 'Symbol', value: 'symbol' },
        { text: 'Full Name', value: 'fullname' },
        { text: 'Actions', value: 'action', sortable: false }
      ],
      dialog: false,
      editedCrypto: {
        symbol: '',
        fullname: '',
        picture_url: ''
      }
    }
  },
  async created () {
    await this.$store.dispatch('adminPreference/getCryptoList')
  },
  computed: {
    favorites () {
      return this.$store.state.adminPreference.cryptoList
    }
  },
  watch: {
    dialog (val) {
      val || this.close()
    }
  },
  methods: {
    async save () {
      const resp = await this.$store.dispatch('adminPreference/setCrypto', this.editedCrypto)
      console.log(resp)
      this.close()
    },
    async deleteC (item) {
      // const resp = await this.$store.dispatch('adminPreference/deleteCrypto', item.symbol)
      console.log(item.symbol)
    },
    close () {
      this.dialog = false
      this.editedCrypto.symbol = ''
      this.editedCrypto.fullname = ''
      this.editedCrypto.picture_url = ''
    }
  }
}
</script>

<style scoped>

</style>
