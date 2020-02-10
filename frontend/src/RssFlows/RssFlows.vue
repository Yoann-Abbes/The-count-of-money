<template>
  <v-container fluid dark>
    <v-row>
      <v-col cols="12" align="center" justify="center" :dark="getDarkMode">
        <p :class="`display-3 ${getDarkMode? 'white' : 'black'}--text `">RSS FEEDS</p>
      </v-col>
    </v-row>
    <v-row>
      <v-col cols="6">
        <v-text-field
          :dark="getDarkMode"
          v-model="searchString"
          label="Type something to search..."
        ></v-text-field>
      </v-col>
      <v-col cols="6" v-if="getIsLogged">
        <v-combobox
          :dark="getDarkMode"
          v-model="selectedKeywords"
          :items="getKeywords"
          :label="getLabel"
          multiple
          clearable
          persistent-hint
          small-chips
          outlined
        ></v-combobox>
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
      searchString: '',
      selectedKeywords: []
    }
  },
  async mounted () {
    this.$store.commit('app/SET_LOADING')
    await this.$store.dispatch('rss/fetchRssArticles')
    this.$store.commit('app/UNSET_LOADING')
    this.selectedKeywords = this.getKeywords
  },
  watch: {
    getKeywords: {
      handler () {
        this.selectedKeywords = this.getKeywords
      }
    }
  },
  methods: {
    sanitize (text) {
      return text.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '')
    },
    itemIsShowed (item) {
      const content = this.sanitize(item.content)
      const title = this.sanitize(item.title)
      let sanitizeKeyword = ''
      let sanitizedCategory = ''
      const searchString = this.sanitize(this.searchString)

      if (this.searchString !== '') {
        if (content.includes(searchString)) return true
        if (title.includes(searchString)) return true
        for (const category of item.categories) {
          sanitizedCategory = this.sanitize(category)
          if (sanitizedCategory.includes(searchString)) {
            return true
          }
        }
        return false
      }

      if (this.selectedKeywords.length !== 0) {
        for (const keyword of this.selectedKeywords) {
          sanitizeKeyword = this.sanitize(keyword)
          if (content.includes(sanitizeKeyword)) return true
          if (title.includes(sanitizeKeyword)) return true
          for (const category of item.categories) {
            sanitizedCategory = this.sanitize(category)
            if (sanitizedCategory.includes(sanitizeKeyword)) {
              return true
            }
          }
        }
      }
      return false
    }
  },
  computed: {
    ...mapGetters('app', ['getDarkMode']),
    ...mapGetters('auth', ['getKeywords']),
    ...mapGetters('auth', ['getIsLogged']),
    ...mapGetters('rss', ['getArticles']),
    getLabel () {
      if (this.selectedKeywords.length !== 0) {
        return 'Warning, some keywords are activated. You might not see all last published articles.'
      } else {
        return 'You can select some keywords to filter the last published articles.'
      }
    },
    filteredFeeds () {
      if (this.searchString === '' && this.selectedKeywords.length === 0) {
        return this.getArticles
      }
      const filtered = JSON.parse(JSON.stringify(this.getArticles))
      for (const feed of Object.keys(filtered)) {
        filtered[feed].items = filtered[feed].items.filter(item => this.itemIsShowed(item))
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
