export default ({ store, redirect, req, router, app: { $axios } }) => {
  $axios.defaults.baseURL = process.env.baseUrl
  $axios.onRequest((config) => {
    if (!config) {
      console.log(config)
    }
  })
  $axios.onRequestError((error) => {
    if (error) console.log(error)
  })
  $axios.onError((error) => {
    if (error) {
      console.log(error)
    }
  })
  $axios.onResponse((response) => {
    if (!response) {
      // console.log(response)
    }
  })
  $axios.onResponseError((error) => {
    if (error) {
      console.log(error)
    }
  })
}
