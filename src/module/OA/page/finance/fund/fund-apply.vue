<template>
  <div id="fund-apply">
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
            type="fund"
            name="款项类型"
          ></apply-vue>
        </swiper-item>
        <swiper-item>
          <record-vue
            ref="record"
            :recordList="recordList"
            v-on:onPullingUp="onPullingUp"
            :pageCount="pageCount"
            :getData="getData"
            type="fund"
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
      name: "款项申请",
      icon: "fund-apply-icon.png",
      iconActive: "fund-apply-icon-active.png"
    },
    {
      name: "申请记录",
      icon: "fund-record-icon.png",
      iconActive: "fund-record-icon-active.png"
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
        parentId: "",
        typeName: "funds"
      }).then(data => {
        this.applyList = data;
      });
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
          if (from.path != "/fund-details") {
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
        console.log(currentPage);
        this.currentPage = currentPage;
      },
      async getData() {
        await _getData("financeFunds/financeFundsList", {
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
  #fund-apply {
    position: fixed;
    .container {
      background: $base-background;
      padding: 0;
      /deep/ .apply-content {
        ul {
          li {
            > div > span > i {
              img {
                height: 21px;
              }
            }
            &:last-child {
              > div > span > i {
                img {
                  height: 17px;
                }
              }
            }
          }
        }
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