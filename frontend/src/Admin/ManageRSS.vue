<template>
  <v-card elevation="0" :dark="getDarkMode">
    <v-card-title>
      RSS link
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
      class="elevation-1"
    >
      <template v-slot:top>
        <v-toolbar flat :dark="getDarkMode">
          <v-spacer></v-spacer>
          <v-dialog v-model="dialog" max-width="500px">
            <template v-slot:activator="{ on }">
              <v-btn class="mb-2" v-on="on">New RSS link</v-btn>
            </template>
            <v-card>
              <v-card-title>
                <span class="headline">New RSS link</span>
              </v-card-title>

              <v-card-text>
                <v-container>
                  <v-row>
                    <v-col cols="12" sm="6" md="4">
                      <v-text-field v-model="editedRSS.name" label="Name"></v-text-field>
                    </v-col>
                    <v-col cols="12" sm="6" md="4">
                      <v-text-field v-model="editedRSS.link" label="Link"></v-text-field>
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
      <template v-slot:item.action="{ item }">
        <v-icon small @click="deleteC(item)">fa-trash</v-icon>
      </template>
    </v-data-table>
  </v-card>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  data () {
    return {
      search: '',
      headers: [
        { text: 'Name', value: 'name' },
        { text: 'Url', value: 'link' },
        { text: 'Actions', value: 'action', sortable: false }
      ],
      dialog: false,
      editedRSS: {
        name: '',
        link: ''
      }
    }
  },
  async created () {
    await this.$store.dispatch('adminPreference/getRSSList')
  },
  computed: {
    ...mapGetters('app', ['getDarkMode']),
    favorites () {
      return this.$store.state.adminPreference.rssList
    }
  },
  watch: {
    dialog (val) {
      val || this.close()
    }
  },
  methods: {
    async save () {
      this.$store.commit('app/SET_LOADING')
      const resp = await this.$store.dispatch(
        'adminPreference/setRSS',
        this.editedRSS
      )
      if (resp) {
        this.close()
        this.$store.dispatch('app/showSnackBar', {
          text: `${this.editedRSS.name} successfully added!`,
          type: 'success'
        })
        this.$store.commit('app/UNSET_LOADING')
      } else {
        this.$store.dispatch('app/showSnackBar', {
          text: `An error occured when adding ${this.editedRSS.name}!`,
          type: 'warning'
        })
        this.close()
        this.$store.commit('app/UNSET_LOADING')
      }
      this.close()
    },
    async deleteC (item) {
      const resp = await this.$store.dispatch('adminPreference/deleteRSS', item.id)
      if (resp) {
        this.$store.dispatch('app/showSnackBar', {
          text: `${item.name} successfully deleted!`,
          type: 'success'
        })
        this.$store.commit('app/UNSET_LOADING')
      } else {
        this.$store.dispatch('app/showSnackBar', {
          text: `An error occured when deleting ${item.name}!`,
          type: 'warning'
        })
        this.$store.commit('app/UNSET_LOADING')
      }
    },
    close () {
      this.dialog = false
      this.editedRSS.name = ''
      this.editedRSS.link = ''
    }
  }
}
</script>
