<template xmlns:v-slot="http://www.w3.org/1999/XSL/Transform">
  <v-card elevation="0">
    <v-card-title>
      Favorite RSS link
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
              <v-btn color="primary" dark class="mb-2" v-on="on">New RSS link</v-btn>
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
      const resp = await this.$store.dispatch('adminPreference/setRSS', this.editedRSS)
      console.log(resp)
      this.close()
    },
    async deleteC (item) {
      // const resp = await this.$store.dispatch('adminPreference/deleteRSS', item.name)
      console.log(item.name)
    },
    close () {
      this.dialog = false
      this.editedRSS.name = ''
      this.editedRSS.link = ''
    }
  }
}
</script>

<style scoped>

</style>
