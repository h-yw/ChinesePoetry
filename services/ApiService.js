export default class Services {
  constructor(ctx) {
    this.$axios = ctx.$axios
  }

  getManager() {
    return this.$axios({ url: '/manager', method: 'get' })
  }

  getAuthor(params) {
    return this.$axios({
      url: '/author',
      method: 'get',
      params,
    })
  }

  getWorks(params) {
    return this.$axios({
      url: '/work',
      method: 'get',
      params,
    })
  }

  getCipai(params) {
    return this.$axios({
      url: '/cipai',
      method: 'get',
      params,
    })
  }

  getYun(params) {
    return this.$axios({
      url: '/yun',
      method: 'get',
      params,
    })
  }

  uploadCreate(data) {
    return this.$axios({
      url: '/create',
      method: 'post',
      data,
    })
  }

  login(data) {
    return this.$axios({
      url: '/login',
      method: 'post',
      data,
    })
  }

  getUserCreate(params) {
    console.log(params)
    return this.$axios({
      url: '/user-create',
      method: 'get',
      params,
    })
  }

  // 今日诗词
  commonLoad(token) {
    return this.$axios({
      url:
        'https://v2.jinrishici.com/one.json?client=npm-sdk/1.0&X-User-Token=' +
        encodeURIComponent(token),
      method: 'get',
    })
  }

  corsLoad() {
    return this.$axios({
      url: 'https://v2.jinrishici.com/one.json?client=npm-sdk/1.0',
      method: 'get',
    })
  }
}
