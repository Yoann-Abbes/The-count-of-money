import axios from 'axios'

export default {
  put (url, body) {
    if (body) {
      return axios
        .put(url, body)
    } else {
      return axios
        .put(url)
    }
  },
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
  delete (url) {
    return axios
      .delete(url)
  },
  setHeader (key, value) {
    axios.defaults.headers.common[key] = value
  }
}
