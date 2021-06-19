<template>
  <v-app id="inspire">
    <v-app-bar app centered :elevation="1" flat light>
      <v-tabs centered color="#b71c1c">
        <v-tab v-for="link of links" :key="link.name" :to="link.to" tag="li">
          {{ link.name }}
        </v-tab>
      </v-tabs>
      <v-btn icon class="mr-5" @click="clickAvatar">
        <v-avatar color="#b71c1c77" right>
          <span v-if="!userInfo.username" class="white--text">未登录</span>
          <span class="white--text">{{ userInfo.username }}</span>
        </v-avatar>
      </v-btn>
    </v-app-bar>
    <v-main class="grey lighten-3">
      <v-container>
        <Nuxt />
      </v-container>
    </v-main>
    <v-footer light :elevation="1" padless>
      <v-card tile width="100%" light>
        <!--        <v-divider></v-divider>-->
        <v-card-text class="text-center">
          {{ new Date().getFullYear() }} —
          <strong>Vuetify</strong>
        </v-card-text>
      </v-card>
    </v-footer>
    <LoaginDialog
      :show-login-dialog="showLoginDialog"
      @outLoginClick="outLoginClick"
      @login="login"
      @checkUser="checkUser"
      @signUp="signUp"
    ></LoaginDialog>
    <UserDetail
      :show-user-detail="showUserDetail"
      :user-info="userInfo"
      :user-create="userCreate"
      @outUserClick="outUserClick"
    ></UserDetail>
  </v-app>
</template>

<script>
import LoaginDialog from '~/components/Login'
import UserDetail from '~/components/UserDetail'

export default {
  components: {
    LoaginDialog,
    UserDetail,
  },
  data: () => ({
    links: [
      { name: '首页', to: '/' },
      { name: '诗人', to: 'author' },
      { name: '作品', to: 'work' },
      { name: '创作', to: 'create' },
    ],
    showLoginDialog: false,
    showUserDetail: false,
    userInfo: {},
    userCreate: {},
  }),
  mounted() {
    const userInfo = localStorage.getItem('userInfo')
    console.log(userInfo)
    if (userInfo) this.userInfo = JSON.parse(userInfo)
  },
  methods: {
    clickAvatar() {
      const userInfo = localStorage.getItem('userInfo')
      if (userInfo) {
        this.showUserDetail = true
        this.userInfo = JSON.parse(userInfo)
        this.getUserCreate({ id: JSON.parse(userInfo).id })
        return
      }
      this.showLoginDialog = true
      console.log('degq', this.LoaginDialog)
    },
    outLoginClick() {
      this.showLoginDialog = false
    },
    outUserClick() {
      this.showUserDetail = false
    },
    login(data) {
      const userInfo = localStorage.getItem('userInfo')
      if (userInfo) return
      if (data.username === '' || data.password === '') return
      console.log(data)
      this.$api.login(data).then((res) => {
        if (res.data.code === 200) {
          this.userInfo = res.data.info
          this.showLoginDialog = false
          localStorage.setItem('userInfo', JSON.stringify(res.data.info))
        } else {
          alert(res.data.msg)
        }
        console.log(res.data)
      })
    },
    checkUser(data) {
      // this.$api.login(data).then((res) => {})
      // console.log('check', data)
    },
    getUserCreate(params) {
      this.$api.getUserCreate(params).then((res) => {
        this.userCreate = res.data
        console.log(res.data)
      })
    },
    signUp() {
      console.log('注册')
    },
  },
}
</script>
<style scoped>
.active {
}
</style>
