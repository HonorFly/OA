<template>
  <div id="payment-approval">
    <header-vue name="盖章审批" :isShowClose="true"></header-vue>

    <div class="container">
      <swiper
        ref="swiper"
        v-model="index"
        :show-dots="false"
        :min-moving-distance="1000"
      >
        <swiper-item>
          <record-vue
            :recordList="recordList"
            v-on:onPullingUp="onPullingUp"
            :pageCount="pageCount"
            :getData="getData"
            type="useChapter"
          ></record-vue>
        </swiper-item>
        <swiper-item>
          <record-vue
            :recordList="recordList"
            v-on:onPullingUp="onPullingUp"
            :pageCount="pageCount"
            :getData="getData"
            type="useChapter"
          ></record-vue>
        </swiper-item>
      </swiper>
    </div>
    <footer-vue :footer="footer" v-on:tab="tab"></footer-vue>
  </div>
</template>

<script>
  import headerVue from "../../../components/header/header.vue";
  import { _getData } from "../../../service/getData";
  import footerVue from "../../../components/footer/footer-tabbar";
  import { Swiper, SwiperItem } from "vux";
  import recordVue from "../../../components/main/record.vue";
  const footer = [
    {
      name: "待我审批",
      icon: "approve-icon-await.png",
      iconActive: "approve-icon-await-active.png"
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
        applyList: [],
        recordList: [],
        currentPage: 1, //当前页
        pageCount: 1 //总页数
      };
    },

    created() {
      _getData("category/getCategory", {
        type: "2",
        parentId: "144"
      }).then(data => {
        console.log(data);
        this.applyList = data.reverse();
      });

      this.getData();
    },
    components: {
      headerVue,
      footerVue,
      Swiper,
      SwiperItem,
      recordVue
    },
    methods: {
      tab(i) {
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
          countPerPage: "10"
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
  #payment-approval {
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
