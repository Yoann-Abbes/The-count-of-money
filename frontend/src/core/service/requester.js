import axios from 'axios'

export default {
  get (url, body) {
    if (body) {
      return axios
        .get(url, body)
    } else {
      return axios
        .get(url)
    }
  },
  post (url, body) {
    if (body) {
      return axios
        .post(url, body)
    } else {
      return axios
        .post(url)
    }
  },
  del (url) {
    return axios
      .delete(url)
  },
  setHeader (key, value) {
    axios.defaults.headers.common[key] = value
  }
}