<template>
  <div>
    <v-sheet light>
      <Carousel :banner="banner" />

      <v-sheet class="d-flex flex-nowrap">
        <v-card class="flex-grow-1 text-center" light min-height="100" tile>
          <div class="content-box">
            <span style="display: block" class="text-h6 font-weight-black">
              <span
                style="display: inline-block"
                :title="todayData ? todayData.content : ''"
              >
                {{ todayData ? todayData.content : '' }}
              </span>

              <v-tooltip left>
                <template #activator="{ on, attrs }">
                  <span v-bind="attrs" class="detail" v-on="on">详</span>
                </template>
                <div>
                  <sapn>
                    作者: {{ todayData ? todayData.origin.author : '' }} [{{
                      todayData ? todayData.origin.dynasty : ''
                    }}]
                  </sapn>
                  <br />
                  <sapn>
                    题目: {{ todayData ? todayData.origin.title : '' }}
                  </sapn>
                </div>
              </v-tooltip>
            </span>
            <span style="display: block">
              <v-chip
                v-for="(item, index) in todayData.matchTags"
                :key="index"
                color="#b71c1c"
                outlined
                class="ml-3"
                small
              >
                {{ item }}
              </v-chip>
            </span>
          </div>
        </v-card>
        <v-card class="align-end" light max-width="50%" min-height="100" tile>
          <v-card-title>
            <span>时日</span>
            <span class="jieqi">白露</span>
          </v-card-title>
          <v-card-subtitle>
            {{ dateCN.cDate }}{{ dateCN.cnDate }}
          </v-card-subtitle>
          <v-card-text>{{ dateCN.tdDate }}</v-card-text>
        </v-card>
      </v-sheet>
      <v-sheet>
        <v-card width="100%">
          <v-card-title>搜韵</v-card-title>
          <v-card-actions>
            <v-tooltip v-model="showTips" top :open-on-hover="false">
              <template #activator="{ on, attrs }">
                <v-text-field
                  v-model="yunChar"
                  v-bind="attrs"
                  label="韵字"
                  clearable
                  dense
                  outlined
                  type="text"
                  v-on="on"
                  @change="charChange"
                ></v-text-field>
              </template>
              <span>不能为空</span>
            </v-tooltip>
            <v-select
              v-model="yunDict"
              label="韵典"
              light
              :items="yunType"
              item-color="#fff"
              background-color="#fff"
              dense
              outlined
              type="text"
              append-outer-icon="mdi-magnify"
              @click:append-outer="searchYun"
              @change="yunDictChange"
            ></v-select>
          </v-card-actions>
          <v-card-text v-if="yunData">
            <v-list subheader>
              <v-list-item v-for="(item, index) in yunData" :key="index">
                <v-list-item-content>
                  <v-list-item-title class="font-weight-black">
                    <span v-if="item.group_name">{{ item.group_name }}</span>
                    {{ item.section_desc }}
                  </v-list-item-title>
                  <v-list-item-subtitle>
                    <span class="font-weight-bold">{{ item.tone_name }}</span>
                    <span class="text-wrap" v-html="item.glys"></span>
                  </v-list-item-subtitle>
                </v-list-item-content>
              </v-list-item>
            </v-list>
          </v-card-text>
        </v-card>
      </v-sheet>
    </v-sheet>
  </div>
</template>

<script>
import solarLunar from 'solarlunar'
import Carousel from '~/components/carousel'

export default {
  components: {
    Carousel,
  },
  data() {
    return {
      banner: [
        { url: 'https://dummyimage.com/hd720/00dc00' },
        { url: 'https://dummyimage.com/hd720/d65151' },
        { url: 'https://dummyimage.com/hd720/3e1ce8' },
        { url: 'https://dummyimage.com/hd720/1ee6be' },
        { url: 'https://dummyimage.com/hd720/e6d920' },
      ],
      todayData: '',
      dateCN: {},
      yunType: ['平水韵', '词林正韵', '中华新韵'],
      yunChar: '看',
      yunDict: '平水韵',
      yun: 'p',
      yunData: null,
      showTips: false,
    }
  },
  mounted() {
    this.getJinrishiciLoad()
    this.getToday()
  },
  methods: {
    getJinrishiciLoad() {
      const keyName = 'jinrishici-token'
      if (window.localStorage && window.localStorage.getItem(keyName)) {
        this.$api
          .commonLoad(window.localStorage.getItem(keyName))
          .then((res) => {
            this.todayData = res.data.data
          })
      } else {
        this.$api.corsLoad().then((res) => {
          window.localStorage.setItem(keyName, res.data.token)
          this.$api
            .commonLoad(window.localStorage.getItem(keyName))
            .then((res) => {
              this.todayData = res.data.data
            })
        })
      }
    },
    getToday() {
      this.dateCN = {}
      const date = new Date()
      const solar2lunarDate = solarLunar.solar2lunar(
        date.getFullYear(),
        date.getMonth() + 1,
        date.getDate()
      )
      this.dateCN = {
        cDate: `${solar2lunarDate.cYear}年${solar2lunarDate.cMonth}年${solar2lunarDate.cDay}日`,
        cnDate: `${solar2lunarDate.monthCn} ${solar2lunarDate.dayCn}`,
        tdDate: `${solar2lunarDate.gzYear}年 ${solar2lunarDate.gzMonth}月 ${solar2lunarDate.gzDay}日`,
      }
      console.log('date', solar2lunarDate)
    },
    charChange() {
      if (this.yun) {
        this.showTips = false
      } else {
        this.showTips = true
      }
      console.log('char', this.yunChar)
    },
    yunDictChange() {
      switch (this.yunDict) {
        case '平水韵':
          this.yun = 'p'
          break
        case '词林正韵':
          this.yun = 'c'
          break
        case '中华新韵':
          this.yun = 'z'
          break
        default:
          this.yun = 'p'
      }
      console.log(this.yunDict)
    },
    searchYun() {
      if (!(this.yun && this.yunChar)) {
        console.log({ char: this.yunChar, yun: this.yun })
        if (!this.yunChar) this.showTips = true
        return
      }

      this.$api.getYun({ char: this.yunChar, yun: this.yun }).then((res) => {
        this.yunData = res.data
        this.yunData.forEach((item) => {
          item.glys = this.replaceResult(this.yunChar, item.glys)
        })
      })
    },
    replaceResult(char, str) {
      const temp = `<span style="color:red">${char}</span>`
      return str.replace(char, temp)
    },
    handleDetail() {
      alert('asdads')
    },
  },
}
</script>
<style lang="scss" scoped>
.content-box {
  margin-top: 50px;
  transform: translate(0, -50%);
  .detail {
    cursor: pointer;
    font-size: 10px;
    display: inline-block;
    margin-left: -12px;
    width: 20px;
    height: 20px;
    border-radius: 50% !important;
    border: 1px solid #b71c1c;
    line-height: normal;
  }
}
.jieqi {
  position: absolute;
  right: 10px;
  display: inline-block;
  box-sizing: content-box;
  color: #b71c1c;
  border: 1px solid #b71c1c;
  font-size: 0.8rem;
  border-radius: 50% !important;
  writing-mode: vertical-lr;
}
</style>
