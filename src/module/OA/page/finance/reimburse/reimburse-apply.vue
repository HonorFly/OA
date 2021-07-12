<template>
  <div id="reimburse-apply">
    <header-vue name="报销申请"></header-vue>

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
            type="reimburse"
            name="报销类型"
          ></apply-vue>
        </swiper-item>
        <swiper-item>
          <record-vue
            ref="record"
            :recordList="recordList"
            v-on:onPullingUp="onPullingUp"
            :pageCount="pageCount"
            type="reimburse"
            :getData="getData"
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
      name: "报销申请",
      icon: "reimburse-apply-icon.png",
      iconActive: "reimburse-apply-icon-active.png"
    },
    {
      name: "报销记录",
      icon: "reimburse-record-icon.png",
      iconActive: "reimburse-record-icon-active.png"
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
        filterType: "",
        filterStatus: ""
      };
    },

    activated() {
      _getData("category/getCategory", {
        type: "2",
        parentId: "445",
        typeName: "bill"
      }).then(data => {
        this.applyList = data.reverse();
      });

      //this.getData();
    },
    components: {
      headerVue,
      footerVue,
      Swiper,
      SwiperItem,
      applyVue,
      recordVue
    },
    beforeRouteEnter(to, from, next) {
      console.log(from);
      next(vm => {
        if (from.params.path == "saveBtn") {
          vm.index = 1;
          vm.$refs.swiper.swiper.go(1);
          vm.searchVal = "";
          vm.filterStatus = "";
          vm.filterType = "";
          vm.currentPage = 1;
          vm.pageCount = 1;
          vm.recordList = [];
          vm.$refs.record.currentPage = 1;
          vm.getData();
        } else {
          if (from.path != "/reimburse-details") {
            vm.index = 0;
            vm.searchVal = "";
            vm.filterStatus = "";
            vm.filterType = "";
            vm.currentPage = 1;
            vm.pageCount = 1;
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
    deactivated() {},
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
        //  console.log(this.$refs.swiper.swiper.go());
        this.$refs.swiper.swiper.go(i);
        this.index = i;
      },
      onPullingUp(currentPage) {
        this.currentPage = currentPage;
      },
      async getData() {
        // this.$toast.loading({
        //   message: "加载中...",
        //   forbidClick: true,
        //   overlay: true
        //   // duration: 0
        // });
        await _getData("billApply/billApplyList", {
          currentPage: this.currentPage,
          countPerPage: "10",
          type: this.filterType,
          state: this.filterStatus,
          name: this.searchVal
        })
          .then(data => {
            console.log(data);
            this.pageCount = data.totalPages;
            this.recordList = [...this.recordList, ...data.data];
          })
          .then(() => {
            this.$toast.clear();
          });
      }
    }
  };
</script>

<style lang="scss" scoped>
  @import "../../../../../../static/scss/_commonScss";
  @import "../../../../../../static/scss/_dialog";
  #reimburse-apply {
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
