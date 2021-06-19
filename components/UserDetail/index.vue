<template>
  <div>
    <v-dialog
      :value="showUserDetail"
      width="80%"
      max-width="80%"
      fullscreen
      light
      @click:outside="outUserClick"
    >
      <v-sheet height="100%">
        <v-card>
          <v-toolbar>
            <v-toolbar-title>个人中心</v-toolbar-title>
            <v-spacer></v-spacer>
            <v-btn icon @click="outUserClick">
              <v-icon>mdi-close</v-icon>
            </v-btn>
          </v-toolbar>
          <v-card-text>
            <v-card>
              <v-card-title>信息</v-card-title>
              <v-divider></v-divider>
              <v-card-text class="black--text">
                <v-container>
                  <v-row align="center" justify="center">
                    <v-col cols="6">
                      <v-text-field
                        class="black--text"
                        dense
                        hide-details
                        color="#000"
                        disabled
                        :value="userInfo.username"
                      >
                        <template #label>
                          <div>用户名:</div>
                        </template>
                      </v-text-field>
                    </v-col>
                    <v-col cols="6">
                      <v-text-field
                        class="black--text"
                        disabled
                        dense
                        hide-details
                        :value="userInfo.email"
                      >
                        <template #label>
                          <div>邮箱:</div>
                        </template>
                      </v-text-field>
                    </v-col>
                  </v-row>
                </v-container>
              </v-card-text>
            </v-card>
            <v-card class="mt-5">
              <v-card-title>创作</v-card-title>
              <v-divider></v-divider>
              <v-card-text>
                <v-list>
                  <v-list-item
                    v-for="(item, index) in userCreate.create"
                    :key="index"
                  >
                    <v-card width="100%" class="mb-2">
                      <v-card-title>
                        {{ item.cipai }}
                        <span v-if="item.title">·</span>
                        {{ item.title }}
                      </v-card-title>
                      <v-card-subtitle class="black--text">
                        {{ item.author }}
                      </v-card-subtitle>
                      <v-card-text>
                        <div v-for="(juzi, index) in item.content" :key="index">
                          {{ juzi }}
                        </div>
                      </v-card-text>
                    </v-card>
                  </v-list-item>
                </v-list>
              </v-card-text>
            </v-card>
          </v-card-text>
        </v-card>
      </v-sheet>
    </v-dialog>
  </div>
</template>

<script>
export default {
  name: 'Index',
  props: {
    showUserDetail: {
      type: Boolean,
      default: false,
    },
    userInfo: {
      type: Object,
    },
    userCreate: {
      type: Object,
      default: null,
    },
  },
  data() {
    return {
      user: {},
    }
  },
  mounted() {
    console.log('detail', this.userInfo)
    this.user = this.userInfo
  },
  methods: {
    outUserClick() {
      this.$emit('outUserClick')
    },
  },
}
</script>

<style scoped></style>
