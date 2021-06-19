<template>
  <div>
    <v-tabs
      grow
      light
      centered
      show-arrows
      slider-size="1"
      next-icon="$next"
      prev-icon="$prev"
    >
      <v-tab
        v-for="(data, index) in manager"
        :key="index"
        active-class="active"
        color="#b71c1c"
        @click="getAuthor(data.dynastyCN)"
      >
        {{ data.dynastyCN }}
      </v-tab>
    </v-tabs>
    <!--    <v-lazy height="200" max-height="300" min-height="200">-->
    <v-sheet class="d-flex flex-wrap justify-center flex-column" light outlined>
      <v-sheet class="d-flex flex-wrap justify-center" light outlined>
        <v-card
          v-for="(author, index) in authors"
          :key="index"
          hover
          light
          max-height="300"
          max-width="300"
          width="300"
          rounded
          class="ma-2"
        >
          <v-card-title style="align-items: flex-end">
            {{ author.name }}
            <span class="text-caption" style="margin-left: 8px">
              {{ author.birthYear }}-{{ author.deathYear }}
            </span>
          </v-card-title>
          <v-divider></v-divider>
          <v-card-text class="d-inline-block text-truncate">
            {{ author.desc }}
          </v-card-text>
          <v-card-actions class="flex justify-center">
            <v-chip-group light>
              <v-chip
                v-for="(item, name, index) in worksClass(
                  author.worksShiCount,
                  author.worksCiCount,
                  author.worksQuCount,
                  author.worksFuCount,
                  author.worksWenCount
                )"
                :key="index"
                label
                light
                outlined
                color="#b71c1c"
                @click="showDetailDialog(name, author, item)"
              >
                {{ name }} {{ item }}
              </v-chip>
            </v-chip-group>
          </v-card-actions>
        </v-card>
      </v-sheet>
      <v-sheet>
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
      </v-sheet>
      <!--      @onScroll="onScroll"-->
      <DetailDialog
        :value="value"
        :author="author"
        :works="works"
        :kind-total="kindTotal"
        :kind="kind"
        @closeDialog="closeDialog"
        @setPage="setPage"
      ></DetailDialog>
    </v-sheet>
  </div>
</template>
<script>
import DetailDialog from '~/components/DetailDialog'

export default {
  components: {
    DetailDialog,
  },
  data() {
    return {
      page: 1,
      pageSize: 21,
      totalPage: 0,
      dynasty: '',
      author: {},
      works: [],
      manager: [],
      authors: [],
      workClass: [],
      showDetail: false,
      value: false,
      kindTotal: 0,
      kind: '',
      isRefresh: false,
      comKey: 'keyyyy',
    }
  },
  computed: {},
  watch: {
    value(o, n) {
      console.log('au', o, n)
    },
  },
  mounted() {
    this.getManager()
    this.getAuthor('金', 1)
  },
  methods: {
    getManager() {
      this.$api.getManager().then((res) => {
        this.manager = res.data
        console.log(res)
      })
    },
    getAuthor(dynasty, pageNum, pageSize = 21) {
      this.dynasty = dynasty
      this.$api.getAuthor({ dynasty, pageNum, pageSize }).then((res) => {
        this.authors = res.data.data
        console.log('author', res.data)
        this.totalPage = Math.ceil(res.data.total / this.pageSize)
      })
    },
    worksClass(shi, ci, qu, fu, wen) {
      const temp = {}
      if (shi !== 0) temp['诗'] = shi
      if (ci !== 0) temp['词'] = ci
      if (qu !== 0) temp['曲'] = qu
      if (fu !== 0) temp['赋'] = fu
      if (wen !== 0) temp['文'] = wen

      return temp
    },
    showDetailDialog(kind, author, kindTotal) {
      this.kindTotal = kindTotal
      this.kind = kind
      this.$api
        .getWorks({
          dynasty: author.dynasty,
          name: author.name,
          kind,
          pageSize: 10,
          pageNum: 1,
        })
        .then((res) => {
          // author.works = res.data.data
          this.author = author
          this.works = res.data.data
          this.value = true
          console.log('show', author)
        })
    },
    closeDialog(value) {
      this.value = false
    },
    onScroll(e, data) {
      const scrollTop = e.target.scrollTop
      const scrollHeight = e.target.scrollHeight
      const offsetHeight = Math.ceil(e.target.getBoundingClientRect().height)
      const currentHeight = scrollTop + offsetHeight
      if (currentHeight >= scrollHeight) {
        this.workPage += 1
        console.log(data, this.isRefresh)
        this.$api
          .getWorks({
            ...data,
            kind: this.kind,
            pageNum: this.workPage,
          })
          .then((res) => {
            if (!res.data.data) return
            console.log('scrool', res)
            const works = [...this.author.works, ...res.data.data]
            this.$set(this.author, 'works', works)
          })
      }
    },
    nextPage() {
      this.getAuthor(this.dynasty, this.page, this.pageSize)
      console.log('page', this.page)
    },
    prevPage() {
      this.getAuthor(this.dynasty, this.page, this.pageSize)
      console.log('prev', this.page)
    },
    inputPage(inp) {
      this.getAuthor(this.dynasty, this.page, this.pageSize)
      console.log('inp', inp)
    },
    setPage(params) {
      this.comKey = params.pageNum
      this.$api.getWorks(params).then((res) => {
        this.$set(this.$data, 'works', res.data.data)
      })
      console.log('pageee', this.author)
    },
  },
}
</script>
<style lang="scss" scoped>
.active {
  color: $bg_red_1;
}
</style>
