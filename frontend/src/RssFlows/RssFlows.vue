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
import Vue from 'vue'
import { mapGetters } from 'vuex'

export default {
  data () {
    return {
      limit: 5,
      rssUrls: [
        {
          url: 'https://bitcoin.fr/feed/',
          name: 'BitCoin'
        },
        {
          url: 'https://cryptogains.fr/feed',
          name: 'CryptoGains'
        },
        {
          url: 'https://cryptonaute.fr/feed/',
          name: 'CryptoNaute'
        },
        {
          url: 'https://news.crypto-analyse.com/feed/',
          name: 'CryptoAnalyse'
        },
        {
          url: 'https://cryptoactu.com/feed/',
          name: 'CryptoActu'
        }
      ],
      rssFeeds: {},
      searchString: ''
    }
  },
  async mounted () {
    this.$store.commit('app/SET_LOADING')
    await this.getFeeds()
    this.$store.commit('app/UNSET_LOADING')
  },
  computed: {
    ...mapGetters('app', ['getDarkMode']),
    filteredFeeds () {
      if (
        !this.searchString ||
        this.searchString === '' ||
        this.searchString === null ||
        this.searchString === undefined
      ) {
        return this.rssFeeds
      }
      const filtered = JSON.parse(JSON.stringify(this.rssFeeds))
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
  },
  methods: {
    async getFeeds () {
      let Parser = require('rss-parser')
      let parser = new Parser()
      const CORS_PROXY = 'https://cors-anywhere.herokuapp.com/'
      for (const rss of this.rssUrls) {
        try {
          await parser.parseURL(CORS_PROXY + rss.url, async (err, feed) => {
            if (err) throw err
            for (const item of feed.items) {
              item.content = item.content.replace('[ ]', '[...]')
            }
            Vue.set(this.rssFeeds, rss.name, feed)
          })
        } catch (error) {
          console.log('FAILED TO FETCH RSS', error.message)
        }
      }
    }
  }
}
</script>

<style>
</style>
