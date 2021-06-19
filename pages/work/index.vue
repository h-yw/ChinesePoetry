<template>
  <div>
    <v-sheet class="mx-auto ma-2" light outlined elevation="2" max-width="85%">
      <v-card class="mx-auto ma-2" width="95%" height="95%">
        <v-list v-for="(item, index) in works" :key="index" subheader>
          <v-list-item style="cursor: pointer" @click="showContent(item)">
            <v-list-item-content>
              <v-list-item-title>{{ item.title }}</v-list-item-title>
              <v-list-item-subtitle>
                {{ splitContent(item.content).sub }}
              </v-list-item-subtitle>
            </v-list-item-content>
            <v-list-item-action>
              <v-list-item-action-text>
                [{{ item.dynasty }}] {{ item.authorName }}
              </v-list-item-action-text>
            </v-list-item-action>
          </v-list-item>
          <v-divider></v-divider>
        </v-list>
      </v-card>
      <v-pagination
        v-model="page"
        circle
        light
        color="#b71c1c"
        :length="1000"
        :total-visible="5"
        prev-icon="mdi-menu-left"
        next-icon="mdi-menu-right"
      ></v-pagination>
    </v-sheet>
    <v-dialog v-model="isShow" light @click:outside="outClick">
      <v-card elevation="0">
        <v-card-title>
          {{ content.title }}
        </v-card-title>
        <v-card-subtitle>
          [{{ content.dynasty }}]{{ content.authorName }}
        </v-card-subtitle>
        <v-card-text>
          <div v-html="splitContent(content.content).text"></div>
        </v-card-text>
        <v-divider></v-divider>
        <v-card-actions>
          <v-btn-toggle v-model="changePanel" borderless dense tile>
            <v-btn
              v-if="content.annotation"
              text
              color="#b71c1c"
              @click="setPanel(content.annotation)"
            >
              注释
            </v-btn>
            <v-btn
              v-if="content.translation"
              text
              color="#b71c1c"
              @click="setPanel(content.translation)"
            >
              译文
            </v-btn>
            <v-btn
              v-if="content.intro"
              text
              color="#b71c1c"
              @click="setPanel(content.intro)"
            >
              评析
            </v-btn>
            <!--                    <v-btn>辑评</v-btn>-->
          </v-btn-toggle>
        </v-card-actions>
        <v-card-text v-if="showPanel" v-html="panelContent"></v-card-text>
      </v-card>
    </v-dialog>
  </div>
</template>
<script>
export default {
  data() {
    return {
      page: 1,
      works: [],
      dynasty: ['秦', '三国', '周', '金', '汉', '晋', '明', '南北', '隋'],
      num: 0,
      isShow: false,
      content: {},
      changePanel: undefined,
      showPanel: false,
      panelContent: '',
    }
  },
  watch: {
    page(n, o) {
      this.getWork({
        dynasty: this.dynasty[this.num],
        pageSize: 30,
        pageNum: this.page,
      })
    },
  },
  mounted() {
    this.getWork({ dynasty: '秦', pageSize: 30, pageNum: 1 })
  },
  methods: {
    getWork(params) {
      this.$api.getWorks(params).then((res) => {
        console.log(res.data.data)
        if (res.data.data.length > 0) {
          this.works = res.data.data
        } else {
          this.num += 1
          this.getWork({
            dynasty: this.dynasty[this.num],
            pageSize: 30,
            pageNum: this.page,
          })
        }
      })
    },
    showContent(item) {
      this.content = item
      console.log('item', item)
      this.isShow = true
      this.changePanel = undefined
      this.showPanel = false
    },
    setPanel(content) {
      this.showPanel = true
      this.panelContent = this.splitContent(content).text
    },
    outClick() {
      this.isShow = false
      console.log('outclick')
    },
    splitContent(content) {
      if (!content) return { sub: '', text: '' }
      return {
        sub: content.split('。')[0],
        text: content.replace(/\n/g, '<br>'),
      }
    },
  },
}
</script>
