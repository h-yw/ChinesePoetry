<template>
  <div>
    <v-dialog
      :value="showLoginDialog"
      width="80%"
      max-width="80%"
      height="60%"
      light
      @click:outside="outLoginClick"
    >
      <v-card>
        <v-card-title class="text-center">登录</v-card-title>
        <v-card-text>
          <v-form>
            <v-container>
              <v-row>
                <v-col cols="12" align-self="center">
                  <v-text-field
                    v-model="formData.username"
                    label="用户名"
                    aria-required="true"
                    dense
                    @blur="checkUser"
                  ></v-text-field>
                </v-col>
                <v-col cols="12">
                  <v-text-field
                    v-model="formData.password"
                    label="密码"
                    required
                    dense
                    type="password"
                  ></v-text-field>
                </v-col>
                <v-col cols="12" align-self="center" class="text-center">
                  <v-btn @click="login">
                    <span v-if="isLogin">登录</span>
                    <!--                    <span v-else>注册</span>-->
                  </v-btn>
                  <!--                  <v-chip-->
                  <!--                    label-->
                  <!--                    color="#fff"-->
                  <!--                    text-color="blue"-->
                  <!--                    small-->
                  <!--                    pill-->
                  <!--                    @click="signUp"-->
                  <!--                  >-->
                  <!--                    <span v-if="!isLogin">登录</span>-->
                  <!--                    <span v-else>注册</span>-->
                  <!--                  </v-chip>-->
                </v-col>
              </v-row>
            </v-container>
          </v-form>
        </v-card-text>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
export default {
  name: 'Index',
  props: {
    showLoginDialog: {
      type: Boolean,
      default: false,
    },
    errMsg: {
      type: String,
    },
    userInfo: {},
  },
  data() {
    return {
      isShow: false,
      formData: {
        password: '',
        username: '',
      },
      isLogin: true,
    }
  },
  watch: {
    showLoginDialog(n, o) {
      console.log('o,n', o, n)
    },
  },
  mounted() {
    // this.formData = {
    //   username: '',
    //   password: '',
    // }
  },
  methods: {
    outLoginClick() {
      this.$emit('outLoginClick', this.isShow)
    },
    login() {
      console.log('login')
      this.$emit('login', this.formData)
      console.log('form', this.formData)
    },
    checkUser() {
      this.$emit('checkUser', this.formData)
    },
    signUp() {
      this.$emit('signUp')
      this.isLogin = false
    },
  },
}
</script>

<style scoped></style>
