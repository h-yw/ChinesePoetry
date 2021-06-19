<template>
  <div id="testtttt">
    <!--    <v-overlay :value="value">-->
    <v-responsive id="detail-responsive">
      <v-dialog
        id="dialog"
        :attach="domNode"
        :value="value"
        light
        overlay-color="#f0f0f0"
        persistent
        width="70%"
      >
        <v-card>
          <v-card-actions style="position: sticky; top: 15px; z-index: 5">
            <v-btn
              fab
              light
              right
              rounded
              absolute
              small
              depressed
              elevation="0"
              @click="closeDialog"
            >
              <v-icon large>mdi-close</v-icon>
            </v-btn>
          </v-card-actions>
          <v-card-title style="align-items: flex-end; margin-bottom: 8px">
            {{ author.name }}
            <span class="text-caption" style="margin-left: 8px">
              [{{ author.dynasty }}]{{ author.birthYear }}-{{
                author.deathYear
              }}
            </span>
          </v-card-title>
          <v-card-subtitle>
            {{ author.desc }}
          </v-card-subtitle>
          <v-card-text v-scroll.self="onScroll">
            <v-expansion-panels v-model="open">
              <v-expansion-panel
                v-for="(item, index) in works"
                :key="index"
                @change="doPanel"
              >
                <v-expansion-panel-header hide-actions>
                  {{ item.title }}
                </v-expansion-panel-header>
                <v-expansion-panel-content>
                  <v-card elevation="0">
                    <v-card-text style="color: #000">
                      <div v-html="splitContent(item.content).text"></div>
                    </v-card-text>
                    <v-divider></v-divider>
                    <v-divider></v-divider>
                    <v-card-actions>
                      <v-btn-toggle v-model="changePanel" borderless dense tile>
                        <v-btn
                          v-if="item.annotation"
                          text
                          color="#b71c1c"
                          @click="setPanel(item.annotation)"
                        >
                          注释
                        </v-btn>
                        <v-btn
                          v-if="item.translation"
                          text
                          color="#b71c1c"
                          @click="setPanel(item.translation)"
                        >
                          译文
                        </v-btn>
                        <v-btn
                          v-if="item.intro"
                          text
                          color="#b71c1c"
                          @click="setPanel(item.intro)"
                        >
                          评析
                        </v-btn>
                        <!--                    <v-btn>辑评</v-btn>-->
                      </v-btn-toggle>
                    </v-card-actions>
                    <v-card-text
                      v-if="showPanel"
                      v-html="panelContent"
                    ></v-card-text>
                  </v-card>
                </v-expansion-panel-content>
              </v-expansion-panel>
            </v-expansion-panels>
          </v-card-text>
          <v-pagination
            v-model="page"
            circle
            light
            color="#b71c1c"
            :length="totalPage"
            total-visible="7"
            prev-icon="mdi-menu-left"
            next-icon="mdi-menu-right"
            @next="nextPage"
            @previous="prevPage"
            @input="inputPage"
          ></v-pagination>
        </v-card>
      </v-dialog>
    </v-responsive>
    <!--    </v-overlay>-->
  </div>
</template>
<script>
export default {
  props: {
    value: {
      type: Boolean,
      default: true,
    },
    author: {
      type: Object,
    },
    kindTotal: {
      type: Number,
    },
    kind: {
      type: String,
    },
    works: {
      type: Array,
    },
  },
  data() {
    return {
      showPanel: false,
      panelContent: '',
      changePanel: undefined,
      lazyLoading: '',
      open: '',
      domNode: null,
      page: 1,
      pageSize: 10,
    }
  },
  computed: {
    totalPage() {
      return Math.ceil(this.kindTotal / this.pageSize)
    },
  },
  watch: {},
  mounted() {
    this.domNode = document.querySelector('#detail-responsive')
  },
  methods: {
    setPanel(content) {
      console.log(this.lazyLoading)
      this.showPanel = true
      this.panelContent = this.splitContent(content).text
    },
    doPanel() {
      console.log('open')
      this.changePanel = undefined
      this.showPanel = false
    },
    onScroll(e) {
      this.$emit('onScroll', e, {
        name: this.author.name,
        dynasty: this.author.dynasty,
      })
    },
    closeDialog() {
      this.open = undefined
      this.panelContent = ''
      this.showPanel = false
      this.$emit('closeDialog', this.value)
    },
    splitContent(content) {
      return {
        sub: content.split('。')[0],
        text: content.replace(/\n/g, '<br>'),
      }
    },
    nextPage() {
      this.$emit('setPage', {
        name: this.author.name,
        dynasty: this.author.dynasty,
        kind: this.kind,
        pageSize: this.pageSize,
        pageNum: this.page,
      })
      console.log('page', this.page)
    },
    prevPage() {
      this.$emit('setPage', {
        name: this.author.name,
        dynasty: this.author.dynasty,
        kind: this.kind,
        pageSize: this.pageSize,
        pageNum: this.page,
      })
      console.log('prev', this.page)
    },
    inputPage(inp) {
      this.$emit('setPage', {
        name: this.author.name,
        dynasty: this.author.dynasty,
        kind: this.kind,
        pageSize: this.pageSize,
        pageNum: this.page,
      })
      console.log('inp', inp)
    },
  },
}
</script>
<style lang="scss" scoped>
.active {
  color: #b71c1c;
  //background-color: #fff;
}
</style>
