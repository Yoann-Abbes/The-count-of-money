<template>
  <v-container fluid dark>
    <v-row>
      <v-col cols="12" align="center" justify="center" dark>
        <p :class="`display-3 ${getDarkMode? 'white' : 'black'}--text `">RSS FEEDS</p>
      </v-col>
    </v-row>
    <v-row>
      <v-col cols="12">
        <v-text-field :dark="getDarkMode" v-model="searchString" label="Type something to search..."></v-text-field>
      </v-col>
    </v-row>
    <v-row>
      <v-col cols="6" v-for="feed in Object.keys(filteredFeeds)" :key="feed">
        <v-card :dark="getDarkMode">
          <v-card-title>{{filteredFeeds[feed].title}}</v-card-title>
          <v-card-text>
            <v-expansion-panels hover popout>
              <v-expansion-panel v-for="(item, i) in filteredFeeds[feed].items" :key="i">
                <v-expansion-panel-header disable-icon-rotate>
                  {{item.title}}
                  <template v-slot:actions>
                    <a :href="item.link" target="_blank">
                      <v-icon color="#4BC867">fa-external-link-alt</v-icon>
                    </a>
                  </template>
                </v-expansion-panel-header>
                <v-expansion-panel-content>
                  <v-container fluid>
                    <v-row v-html="item.content"></v-row>
                    <v-row>
                      <v-col cols="4">{{item.creator}}</v-col>
                      <v-spacer />
                      <v-col cols="4">{{item.pubDate}}</v-col>
                    </v-row>
                  </v-container>
                </v-expansion-panel-content>
              </v-expansion-panel>
            </v-expansion-panels>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  data () {
    return {
      limit: 5,
      searchString: ''
    }
  },
  async mounted () {
    this.$store.commit('app/SET_LOADING')
    await this.$store.dispatch('rss/fetchRssArticles')
    this.$store.commit('app/UNSET_LOADING')
  },
  computed: {
    ...mapGetters('app', ['getDarkMode']),
    ...mapGetters('rss', ['getArticles']),
    filteredFeeds () {
      if (
        !this.searchString ||
        this.searchString === '' ||
        this.searchString === null ||
        this.searchString === undefined
      ) {
        return this.getArticles
      }
      const filtered = JSON.parse(JSON.stringify(this.getArticles))
      for (const feed of Object.keys(filtered)) {
        filtered[feed].items = filtered[feed].items.filter(item => {
          for (const category of item.categories) {
            if (category.includes(this.searchString)) {
              return true
            }
          }
          return false
        })
        if (filtered[feed].items.length === 0) {
          delete filtered[feed]
        }
      }
      return filtered
    }
  }
}
</script>

<style>
</style>
