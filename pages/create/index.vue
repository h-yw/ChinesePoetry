<template>
  <div>
    <v-sheet light>
      <v-sheet>
        <v-tooltip v-model="showTips" top :open-on-hover="false">
          <template #activator="{ on, attrs }">
            <v-text-field
              v-model="search"
              v-bind="attrs"
              label="词牌"
              clearable
              dense
              outlined
              type="text"
              append-outer-icon="mdi-magnify"
              v-on="on"
              @click:append-outer="searchCipai"
            >
              <template></template>
            </v-text-field>
          </template>
          <span>不能为空</span>
        </v-tooltip>
      </v-sheet>
      <v-sheet>
        <v-container>
          <v-row align="center" justify="start" dense>
            <v-col v-for="(item, index) in cipai" :key="index" cols="3">
              <v-card
                class="pa-2 text-center"
                outlined
                rounded
                @click="showCipaiDetail(item)"
              >
                {{ item.name }}
              </v-card>
            </v-col>
          </v-row>
        </v-container>
      </v-sheet>
      <v-dialog
        v-model="isShow"
        width="80%"
        max-width="80%"
        height="60%"
        light
        @click:outside="outClick"
      >
        <v-card elevation="0">
          <v-card-title>
            {{ cipaiDetail.name }}
          </v-card-title>
          <v-card-subtitle>[字数] {{ cipaiDetail.wordcount }}</v-card-subtitle>
          <v-card-text>
            <div
              v-for="(pz, index) in cipaiDetail.pingzeSymbol"
              :key="index"
              align="center"
            >
              <!--              <div v-html="pz"></div>-->
              <!--                  <fieldset style="border: none">-->
              <!--                    <legend v-html="pz"></legend>-->
              <!--                    <input-->
              <!--                      v-model="inpValue[index]"-->
              <!--                      class="inp-content"-->
              <!--                      type="text"-->
              <!--                      -->
              <!--                    />-->
              <!--                  </fieldset>-->

              <v-text-field
                v-model="inpValue[index]"
                hide-details
                clearable
                type="text"
                @input="filedChange"
              >
                <template #label>
                  <div
                    style="text-align: center; color: initial; font-size: 18px"
                    v-html="pz"
                  ></div>
                </template>
              </v-text-field>
            </div>
          </v-card-text>
          <v-divider></v-divider>
          <v-card-actions>
            <!--            <input class="inp-content" type="text" />-->
            <v-text-field
              v-model="createData.title"
              label="题目"
              hide-details
              clearable
              dense
              outlined
              type="text"
            ></v-text-field>
            <v-text-field
              v-model="createData.author"
              hide-details
              label="姓名"
              class="ml-2"
              clearable
              dense
              outlined
              type="text"
            ></v-text-field>
            <v-btn class="ml-2" outlined shaped @click="saveCreate">保存</v-btn>
          </v-card-actions>
          <v-divider></v-divider>
          <v-card-actions>
            <v-btn-toggle v-model="changePanel" borderless dense tile>
              <v-btn
                v-if="cipaiDetail.example"
                text
                color="#b71c1c"
                @click="setPanel(cipaiDetail.example[0].text)"
              >
                例子
              </v-btn>
              <v-btn
                v-if="cipaiDetail.source"
                text
                color="#b71c1c"
                @click="setPanel(cipaiDetail.source)"
              >
                简介
              </v-btn>
              <!--                    <v-btn>辑评</v-btn>-->
            </v-btn-toggle>
          </v-card-actions>
          <v-card-text v-if="showPanel" v-html="panelContent"></v-card-text>
        </v-card>
      </v-dialog>
    </v-sheet>
  </div>
</template>
<script>
export default {
  data() {
    return {
      cipai: null,
      search: '',
      showTips: false,
      isShow: false,
      cipaiDetail: {},
      changePanel: undefined,
      showPanel: false,
      panelContent: '',
      filedValue: '',
      inpValue: [],
      createData: {},
    }
  },
  computed: {},
  mounted() {
    this.getCipai({})
  },
  methods: {
    getCipai(params) {
      this.$api.getCipai(params).then((res) => {
        this.cipai = res.data
      })
    },
    searchCipai() {
      if (this.search === '') {
        this.showTips = true
        return
      }
      this.getCipai({ cipai: this.search })
      console.log(this.search)
    },
    showCipaiDetail(item) {
      console.log(item)
      this.cipaiDetail = item
      this.isShow = true
      this.createData = {
        cipai: item.name,
        author: '',
        title: '',
      }
      if (!item.pingzeSymbol) item.pingzeSymbol = this.pingzeSymbol(item.pingze)
      // console.log(this.pingzeSymbol(item.pingze))
    },
    setPanel(content) {
      this.showPanel = true
      this.changePanel = undefined
      this.panelContent = this.splitContent(content).text
    },
    filedChange(e) {
      console.log(this.inpValue, this.inpValue.length)
    },
    saveCreate() {
      const userInfo = localStorage.getItem('userInfo')
      if (!userInfo) {
        alert('请登录！')
        return
      }
      const temp = {
        ...this.createData,
        user_id: JSON.parse(userInfo).id,
        content: this.inpValue,
        created: new Date(),
      }
      this.$api.uploadCreate(temp).then((res) => {
        console.log('creteeee', res.data)
      })
    },
    splitContent(content) {
      if (!content) return { sub: '', text: '' }
      return {
        sub: content.split('。')[0],
        text: content.replace(/\n/g, '<br>'),
      }
    },
    outClick() {
      this.isShow = false
      this.showPanel = false
      console.log('outclick')
    },
    pingzeSymbol(str) {
      const zy = `<span style="color:red">●</span>`
      const py = `<span style="color:red">○</span>`
      let temp = ''
      let temp1 = []
      temp = str.replace(/中平/g, '◎○')
      temp = temp.replace(/中仄/g, '◉●')
      temp = temp.replace(/平/g, '○')
      temp = temp.replace(/仄/g, '●')
      temp = temp.replace(/●（韵）/g, zy)
      temp = temp.replace(/○（韵）/g, py)
      temp = temp.replace(/\n/g, '1')
      temp1 = temp = temp.split('1')
      temp = temp1.filter((item) => {
        return item && item.trim()
      })
      return temp
    },
  },
}
</script>
<style lang="scss" scoped>
.inp-content {
  border: none !important;
  text-align: center !important;
  height: 30px;
  width: 60%;
  padding: 5px;
}
</style>
