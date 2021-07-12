<template>
  <div id="use-chapter-apply">
    <header-vue :name="footer[index].name"></header-vue>
    <div class="container">
      <swiper
        ref="swiper"
        v-model="index"
        :show-dots="false"
        :min-moving-distance="1000"
      >
        <swiper-item>
          <apply-vue
            :applyList="applyList"
            type="useChapter"
            name="印章类型"
          ></apply-vue>
        </swiper-item>
        <swiper-item>
          <record-vue
            ref="record"
            :recordList="recordList"
            v-on:onPullingUp="onPullingUp"
            :pageCount="pageCount"
            :getData="getData"
            type="useChapter"
            :isInit="isInit"
            @sureClick="sureClick"
            @search="search"
          ></record-vue>
        </swiper-item>
      </swiper>
    </div>
    <footer-vue
      :footer="footer"
      v-on:tab="tab"
      :currentIndex="index"
    ></footer-vue>
  </div>
</template>

<script>
  import headerVue from "../../../components/header/header.vue";
  import { _getData } from "../../../service/getData";
  import footerVue from "../../../components/footer/footer-tabbar";
  import { Swiper, SwiperItem } from "vux";
  import applyVue from "../../../components/main/apply.vue";
  import recordVue from "../../../components/main/record.vue";
  const footer = [
    {
      name: "盖章申请",
      icon: "use-chapter-apply-icon.png",
      iconActive: "use-chapter-apply-icon-active.png"
    },
    {
      name: "盖章记录",
      icon: "use-chapter-record-icon.png",
      iconActive: "use-chapter-record-icon-active.png"
    }
  ];

  export default {
    data() {
      return {
        footer,
        index: 0,
        applyList: [],
        recordList: [],
        currentPage: 1, //当前页
        pageCount: 1, //总页数
        isInit: false,
        searchVal: "",
        filterStatus: "",
        filterType: ""
      };
    },
    activated() {
      _getData("category/getCategory", {
        type: "3",
        parentId: "579",
        typeName: "seal"
      }).then(data => {
        console.log("章的类型:::", data);
        this.applyList = data;
      });
    },
    beforeRouteEnter(to, from, next) {
      next(vm => {
        if (from.params.path == "saveBtn") {
          vm.index = 1;
          vm.$refs.swiper.swiper.go(1);
          vm.searchVal = "";
          vm.filterStatus = "";
          vm.filterType = "";
          vm.pageCount = 1;
          vm.currentPage = 1;
          vm.recordList = [];
          vm.$refs.record.currentPage = 1;
          vm.getData();
        } else {
          if (from.path != "/useChapter-details") {
            vm.index = 0;
            vm.searchVal = "";
            vm.filterStatus = "";
            vm.filterType = "";
            vm.pageCount = 1;
            vm.currentPage = 1;
            vm.recordList = [];
            vm.$refs.record.currentPage = 1;
            vm.getData();
          } else {
            if (from.query.status) {
              _.find(vm.recordList, (o, i) => {
                if (o.id == from.query.id) {
                  o.status = from.query.status;
                }
              });
            }
          }
        }
      });
    },
    beforeRouteLeave(to, from, next) {
      next();
      this.$nextTick().then(() => {
        if (to.path == "/") {
          setTimeout(() => {
            this.index = 0;
          }, 300);

          this.isInit = true;
        } else {
          this.isInit = false;
        }
      });
    },
    methods: {
      search(val) {
        console.log(val);
        this.searchVal = val;
        this.filterStatus = "";
        this.filterType = "";
        this.pageCount = 1;
        this.currentPage = 1;
        this.recordList = [];
        this.$refs.record.currentPage = 1;
        this.getData();
      },
      sureClick(val) {
        console.log(val);
        this.searchVal = "";
        this.filterStatus = val.state;
        this.filterType = val.filterData.join(",");
        this.pageCount = 1;
        this.currentPage = 1;
        this.recordList = [];
        this.$refs.record.currentPage = 1;
        this.getData();
      },
      tab(i) {
        this.$refs.swiper.swiper.go(i);
        this.index = i;
      },
      onPullingUp(currentPage) {
        this.currentPage = currentPage;
      },
      async getData() {
        await _getData("seal/sealList", {
          type: this.filterType,
          state: this.filterStatus,
          name: this.searchVal,
          currentPage: this.currentPage,
          countPerPage: "10"
        }).then(data => {
          console.log("盖章记录：：：", data);
          this.pageCount = data.totalPages;
          this.recordList = [...this.recordList, ...data.data];
        });
      }
    },
    components: {
      headerVue,
      footerVue,
      Swiper,
      SwiperItem,
      applyVue,
      recordVue
    }
  };
</script>

<style lang="scss" scoped>
  @import "../../../../../../static/scss/_commonScss";
  @import "../../../../../../static/scss/_dialog";
  #use-chapter-apply {
    position: fixed;
    .container {
      background: $base-background;
      padding: 0;
      /deep/ .tab-swiper .apply-content > ul li {
        margin-bottom: 10px;
      }
      .vux-slider {
        height: 100%;
        /deep/ .vux-swiper {
          height: 100% !important;
        }
      }
    }
  }
</style>
