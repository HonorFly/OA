<template>
  <div id="backLog">
    <header-vue name="待办" :isShowClose="true"></header-vue>

    <div class="container">
      <swiper :options="swiperOption" ref="mySwiper">
        <!-- slides -->
        <swiper-slide class="swiper-no-swiping"
          ><record-vue
            ref="recordAwait"
            :recordList="awaitList"
            v-on:onPullingUp="onPullingUpAwait"
            :pageCount="awaitPageCount"
            :getData="getAwaitData"
            :isInit="isInit"
            :isApproval="isApproval"
            :isShowfooterApproval="true"
            :isBackLog="true"
            @sureClick="sureClick"
            @search="search"
            @agreeOrRefuse="agreeOrRefuse"
          ></record-vue
        ></swiper-slide>
        <swiper-slide class="swiper-no-swiping"
          ><record-vue
            ref="record"
            :recordList="approveList"
            v-on:onPullingUp="onPullingUp"
            :pageCount="pageCount"
            :getData="getData"
            :isApproval="isApproval"
            :isBackLog="true"
            :isInit="isInit"
            @sureClick="sureClick"
            @search="search"
          ></record-vue
        ></swiper-slide>
        <!-- Optional controls -->
      </swiper>
    </div>

    <!-- <cube-slide
        ref="swiper"
        :loop="false"
        :showDots="false"
        :initial-index="index"
        :auto-play="false"
        direction="horizontal"
        :options="options"
        :threshold="1"
        @scroll="scroll"
        @change="tab"
      >
        <cube-slide-item>
          <record-vue
            ref="recordAwait"
            :recordList="awaitList"
            v-on:onPullingUp="onPullingUpAwait"
            :pageCount="awaitPageCount"
            :getData="getAwaitData"
            :isInit="isInit"
            :isApproval="isApproval"
            :isShowfooterApproval="true"
            :isBackLog="true"
            @sureClick="sureClick"
            @search="search"
            @agreeOrRefuse="agreeOrRefuse"
          ></record-vue>
        </cube-slide-item>
        <cube-slide-item>
          <record-vue
            ref="record"
            :recordList="approveList"
            v-on:onPullingUp="onPullingUp"
            :pageCount="pageCount"
            :getData="getData"
            :isApproval="isApproval"
            :isBackLog="true"
            :isInit="isInit"
            @sureClick="sureClick"
            @search="search"
          ></record-vue>
        </cube-slide-item>
      </cube-slide> -->
    <!-- <swiper
        ref="swiper"
        v-model="index"
        :show-dots="true"
        :min-moving-distance="10"
      >
        <swiper-item>
          <record-vue
            ref="recordAwait"
            :recordList="awaitList"
            v-on:onPullingUp="onPullingUpAwait"
            :pageCount="awaitPageCount"
            :getData="getAwaitData"
            :isInit="isInit"
            :isApproval="isApproval"
            :isShowfooterApproval="true"
            :isBackLog="true"
            @sureClick="sureClick"
            @search="search"
            @agreeOrRefuse="agreeOrRefuse"
          ></record-vue>
        </swiper-item>
        <swiper-item>
          <record-vue
            ref="record"
            :recordList="approveList"
            v-on:onPullingUp="onPullingUp"
            :pageCount="pageCount"
            :getData="getData"
            :isApproval="isApproval"
            :isBackLog="true"
            :isInit="isInit"
            @sureClick="sureClick"
            @search="search"
          ></record-vue>
        </swiper-item>
      </swiper> -->

    <footer-vue
      :footer="footer"
      v-on:tab="tab"
      :currentIndex="index"
    ></footer-vue>
  </div>
</template>

<script>
  import headerVue from "../components/header/header.vue";
  import footerVue from "../components/footer/footer-tabbar";
  import recordVue from "../components/main/record.vue";
  import { _getData } from "../service/getData";
  import { Swiper, SwiperItem } from "vux";

  import { swiper, swiperSlide } from "vue-awesome-swiper";
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
        awaitList: [], //待我审批
        awaitCurrentPage: 1, //当前页
        currentPage: 1, //当前页
        awaitPageCount: 1, //总页数
        pageCount: 1, //总页数
        searchVal: "",
        isInit: false,
        selectType: "",
        swiperOption: { noSwiping: true },
        options: {
          listenScroll: true,
          probeType: 3
        }
      };
    },
    props: ["isApproval"],
    activated() {
      //this.$refs.swiper.slide()
      var mySwiper = new Swiper(".swiper-container", {
        autoplay: true //可选选项，自动滑动
      });
    },
    beforeRouteEnter(to, from, next) {
      next(vm => {
        if (
          from.name == "首页" ||
          (!_.endsWith(from.path, "details") && getUrlParam("fromNative") == 2)
        ) {
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
          vm.getData();
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
            this.swiper.slideTo(0, 300, false);
          }, 300);

          this.isInit = true;
        } else {
          this.isInit = false;
        }
      });
    },
    methods: {
      // scroll({ x, y }) {
      //   this.$refs.swiper.slide.x = 0;
      // },
      sureClick(val) {
        console.log(val);
        if (val.filterData.length == 1 && val.filterData[0] == 0) {
          this.selectType = "";
        } else {
          this.selectType = val.filterData.join(",");
        }
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
      agreeOrRefuse(val) {
        console.log("触发:::", val);
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
      // change(i){

      // },
      tab(i) {
        // console.log(this.$refs.swiper);
        //this.$refs.swiper.current = i;
        //this.$refs.swiper.index = i;
        this.swiper.slideTo(i, 300, false);
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
        await _getData("backLog/backLogList", {
          type: this.selectType,
          name: this.searchVal,
          currentPage: this.awaitCurrentPage,
          status: "pending",
          countPerPage: "10"
        }).then(data => {
          console.log("待我审批列表", data);
          this.awaitPageCount = data.totalPages;
          this.awaitList = [...this.awaitList, ...data.data];
        });
      },
      async getData() {
        await _getData("backLog/backLogList", {
          type: this.selectType,
          name: this.searchVal,
          currentPage: this.currentPage,
          status: "approval",
          countPerPage: "10"
        }).then(data => {
          console.log("我已审批列表", data);
          this.pageCount = data.totalPages;
          this.approveList = [...this.approveList, ...data.data];
        });
      }
    },
    computed: {
      swiper() {
        return this.$refs.mySwiper.swiper;
      }
    },
    components: {
      headerVue,
      footerVue,
      swiper,
      swiperSlide,
      recordVue
    }
  };
</script>

<style lang="scss" scoped>
  @import "../../../../static/scss/_commonScss";
  @import "../../../../static/scss/_dialog";
  #backLog {
    position: fixed;
    .container {
      background: $base-background;
      padding: 0;

      .swiper-container {
        height: 100%;
        .swiper-wrapper {
          height: 100%;
        }
      }

      /deep/ .cube-slide {
        .cube-slide-group {
          width: 100%;
          .cube-slide-item {
            // width: 80% !important;
            // background: yellowgreen;
            // opacity: 0.2;
            // &:last-child {
            //   background: red !important;
            //   // width: 100% !important;
            // }
          }
        }
      }
      .vux-slider {
        height: 100%;

        /deep/ .vux-swiper {
          height: 100% !important;
          display: flex;
          // flex-direction: column;
          .vux-swiper-item {
            // // position: static;
            // height: 50%;
            width: 80%;
            background: yellowgreen;
            opacity: 0.2;
            &:last-child {
              background: red;
              width: 100%;
            }
          }
        }
      }
    }
  }
</style>
