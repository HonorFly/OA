<template>
  <div id="qualification-loan-approve">
    <header-vue name="派工列表" :isShowClose="true"></header-vue>

    <div class="container">
      <swiper
        ref="swiper"
        v-model="index"
        :show-dots="false"
        :min-moving-distance="1000"
      >
        <swiper-item>
          <record-vue
            ref="recordAwait"
            :recordList="awaitList"
            v-on:onPullingUp="onPullingUpAwait"
            :pageCount="awaitPageCount"
            :getData="getAwaitData"
            type="dispatch"
            :isInit="isInit"
            :isApproval="isApproval"
            :isShowfooterApproval="true"
            @sureClick="sureClick"
            @search="search"
            @agreeOrRefuse="agreeOrRefuse"
          ></record-vue>
        </swiper-item>
        <!-- <swiper-item>
          <record-vue
            ref="record"
            :recordList="approveList"
            v-on:onPullingUp="onPullingUp"
            :pageCount="pageCount"
            :getData="getData"
            type="qualification"
            :isApproval="isApproval"
            :isInit="isInit"
            @sureClick="sureClick"
            @search="search"
          ></record-vue>
        </swiper-item> -->
      </swiper>
    </div>
    <!-- <footer-vue
      :footer="footer"
      v-on:tab="tab"
      :currentIndex="index"
    ></footer-vue> -->
  </div>
</template>

<script>
  import headerVue from "../../components/header/header.vue";
  import { _getData } from "../../service/getData";
  import footerVue from "../../components/footer/footer-tabbar";
  import { Swiper, SwiperItem } from "vux";
  import recordVue from "../../components/main/record.vue";
  const footer = [
    {
      name: "待我审批",
      icon: "approve-await-icon.png",
      iconActive: "approve-await-icon-active.png"
    },
    {
      name: "我已审批",
      icon: "approve-icon.png",
      iconActive: "approve-icon-active.png"
    }
  ];

  export default {
    data() {
      return {
        footer,
        index: 0,
        approveList: [], //我已审批
        awaitList: [
          {},
          {},
          {},
        ], //待我审批
        awaitCurrentPage: 1, //当前页
        currentPage: 1, //当前页
        awaitPageCount: 1, //总页数
        pageCount: 1, //总页数
        searchVal: "",
        isInit: false,
        selectType: ""
      };
    },
    props: ["isApproval"],
    created(){
        // this.getAwaitData()
    },
    beforeRouteEnter(to, from, next) {
      next(vm => {
        if (from.name == "首页") {
          vm.index = 0;
          vm.searchVal = "";
          vm.selectType = "";
          vm.awaitList = [];
          vm.approveList = [];
          vm.currentPage = 1;
          vm.awaitCurrentPage = 1;
          vm.pageCount = 1;
          vm.awaitPageCount = 1;
          vm.$refs.record.currentPage = 1;
          vm.$refs.recordAwait.currentPage = 1;
          vm.getAwaitData();
          // vm.getData();
        } else {
          if (from.query.approved) {
            vm.agreeOrRefuse();
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
      sureClick(val) {
        this.searchVal = "";
        this.selectType = val.filterData.join(",");
        if (this.index == 1) {
          this.approveList = [];
          this.currentPage = 1;
          this.pageCount = 1;
          this.$refs.record.currentPage = 1;
          this.getData();
        } else {
          this.awaitList = [];
          this.awaitCurrentPage = 1;
          this.awaitPageCount = 1;
          this.$refs.recordAwait.currentPage = 1;
          this.getAwaitData();
        }
      },
      search(val) {
        this.searchVal = val;
        this.selectType = "";
        if (this.index == 1) {
          this.approveList = [];
          this.currentPage = 1;
          this.pageCount = 1;
          this.$refs.record.currentPage = 1;
          this.getData();
        } else {
          this.awaitList = [];
          this.awaitCurrentPage = 1;
          this.awaitPageCount = 1;
          this.$refs.recordAwait.currentPage = 1;
          this.getAwaitData();
        }
      },
      agreeOrRefuse() {
        this.awaitList = [];
        this.approveList = [];
        this.currentPage = 1;
        this.awaitCurrentPage = 1;
        this.pageCount = 1;
        this.awaitPageCount = 1;
        this.$refs.record.currentPage = 1;
        this.$refs.recordAwait.currentPage = 1;
        this.getAwaitData();
        this.getData();
      },
      tab(i) {
        this.$refs.swiper.swiper.go(i);
        this.index = i;
        this.searchVal = "";
      },
      onPullingUpAwait(currentPage) {
        this.awaitCurrentPage = currentPage;
      },
      onPullingUp(currentPage) {
        this.currentPage = currentPage;
      },
      async getAwaitData() {
        await _getData("license/licenseAuditList", {
          currentPage: this.awaitCurrentPage,
          countPerPage: "10"
        }).then(data => {
          console.log("待我审批列表", data);
          this.awaitPageCount = data.totalPages;
          this.awaitList = [...this.awaitList, ...data.data];
        });
      },
      async getData() {
        await _getData("license/licenseAuditList", {
          type: this.selectType || "",
          name: this.searchVal,
          status: "approval",
          currentPage: this.currentPage,
          countPerPage: "10"
        }).then(data => {
          console.log("我已审批列表", data);
          this.pageCount = data.totalPages;
          this.approveList = [...this.approveList, ...data.data];
        });
      }
    },
    components: {
      headerVue,
      footerVue,
      Swiper,
      SwiperItem,
      recordVue
    }
  };
</script>

<style lang="scss" scoped>
  @import "../../../../../static/scss/_commonScss";
  @import "../../../../../static/scss/_dialog";
  #qualification-loan-approve {
    position: fixed;
    .container {
      background: $base-background;
      padding: 0;
      .vux-slider {
        height: 100%;
        /deep/ .vux-swiper {
          height: 100% !important;
        }
      }
    }
  }
</style>
