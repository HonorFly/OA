<template>
  <div id="record">
    <div class="nav search">
      <div class="swiper-container" ref="swiper">
        <div class="swiper-wrapper">
          <div class="swiper-slide" @click="openFullscreenDialog(0)">
            <div slot="title" class="title">
              <span>
                <img src="../../../../assets/images/search.png" />
              </span>
              搜索
            </div>
          </div>
          <div class="swiper-slide" @click="openFullscreenDialog(1)">
            <div slot="title" class="title">
              <span><img src="../../../../assets/images/screen.png" /></span>
              筛选
            </div>
          </div>
          <div
            class="bar"
            v-if="bar"
            :class="{ active1: openFullscreen1, active2: openFullscreen2 }"
          ></div>
        </div>
      </div>
    </div>
    <div class="content-box">
      <cube-scroll
        ref="scroll"
        :options="options"
        @pulling-up="onPullingUp"
        :data="recordList"
        v-if="recordList.length > 0"
      >
        <div class="record-container">
          <div class="common" v-if="isBackLog">
            <ul v-for="item in recordList" :key="item.id">
              <reimburse-item-vue
                v-if="item.module == 1"
                :showBtn="true"
                :data="item"
                :isApproval="isApproval"
                :isShowfooterApproval="isShowfooterApproval"
                @agreeOrRefuse="$emit('agreeOrRefuse')"
              ></reimburse-item-vue>
              <fund-item-vue
                v-if="item.module == 2"
                :data="item"
                :showBtn="true"
                :isApproval="isApproval"
                :isShowfooterApproval="isShowfooterApproval"
                @agreeOrRefuse="$emit('agreeOrRefuse')"
              ></fund-item-vue>
              <fixed-item-vue
                v-if="item.module == 3"
                :showBtn="true"
                :data="item"
                :isApproval="isApproval"
                :isShowfooterApproval="isShowfooterApproval"
                @agreeOrRefuse="$emit('agreeOrRefuse')"
              ></fixed-item-vue>
              <chapter-item-vue
                v-if="item.module == 4"
                :showBtn="true"
                :data="item"
                :isApproval="isApproval"
                :isShowfooterApproval="isShowfooterApproval"
                @agreeOrRefuse="$emit('agreeOrRefuse')"
              ></chapter-item-vue>
              <stamp-chapter-item-vue
                v-if="item.module == 5"
                :showBtn="true"
                :data="item"
                :isApproval="isApproval"
                :isShowfooterApproval="isShowfooterApproval"
                @agreeOrRefuse="$emit('agreeOrRefuse')"
              ></stamp-chapter-item-vue>
              <qualification-item-vue
                v-if="item.module == 6"
                :showBtn="true"
                :data="item"
                :isApproval="isApproval"
                :isShowfooterApproval="isShowfooterApproval"
                @agreeOrRefuse="$emit('agreeOrRefuse')"
              ></qualification-item-vue>
              <project-item-vue
                v-if="item.module == 7"
                :showBtn="true"
                :data="item"
                :isApproval="isApproval"
                :isShowfooterApproval="isShowfooterApproval"
                @agreeOrRefuse="$emit('agreeOrRefuse')"
              ></project-item-vue>
            </ul>
          </div>
          <div v-else>
            <ul v-if="type == 'fund'">
              <fund-item-vue
                v-for="item in recordList"
                :key="item.id"
                :data="item"
                :showBtn="true"
                :isApproval="isApproval"
                :isShowfooterApproval="isShowfooterApproval"
                @agreeOrRefuse="$emit('agreeOrRefuse')"
              ></fund-item-vue>
            </ul>
            <ul v-else-if="type == 'reimburse'">
              <reimburse-item-vue
                v-for="item in recordList"
                :key="item.id"
                :showBtn="true"
                :data="item"
                :isApproval="isApproval"
                :isShowfooterApproval="isShowfooterApproval"
                @agreeOrRefuse="$emit('agreeOrRefuse')"
              ></reimburse-item-vue>
            </ul>
            <ul v-else-if="type == 'fixed'">
              <fixed-item-vue
                v-for="item in recordList"
                :key="item.id"
                :showBtn="true"
                :data="item"
                :isApproval="isApproval"
                :isShowfooterApproval="isShowfooterApproval"
                @agreeOrRefuse="$emit('agreeOrRefuse')"
              ></fixed-item-vue>
            </ul>
            <ul v-else-if="type == 'useChapter'">
              <chapter-item-vue
                v-for="item in recordList"
                :key="item.id"
                :showBtn="true"
                :data="item"
                :isApproval="isApproval"
                :isShowfooterApproval="isShowfooterApproval"
                @agreeOrRefuse="$emit('agreeOrRefuse')"
              ></chapter-item-vue>
            </ul>
            <ul v-else-if="type == 'stampChapter'">
              <stamp-chapter-item-vue
                v-for="item in recordList"
                :key="item.id"
                :showBtn="true"
                :data="item"
                :isApproval="isApproval"
                :isShowfooterApproval="isShowfooterApproval"
                @agreeOrRefuse="$emit('agreeOrRefuse')"
              ></stamp-chapter-item-vue>
            </ul>
            <ul v-else-if="type == 'qualification'">
              <qualification-item-vue
                v-for="item in recordList"
                :key="item.id"
                :showBtn="true"
                :data="item"
                :isApproval="isApproval"
                :isShowfooterApproval="isShowfooterApproval"
                @agreeOrRefuse="$emit('agreeOrRefuse')"
              ></qualification-item-vue>
            </ul>
            <ul v-else-if="type == 'project'">
              <project-item-vue
                v-for="item in recordList"
                :key="item.id"
                :showBtn="true"
                :data="item"
                :isApproval="isApproval"
                :isShowfooterApproval="isShowfooterApproval"
                @agreeOrRefuse="$emit('agreeOrRefuse')"
              ></project-item-vue>
            </ul>
            <ul v-else-if="type == 'dispatch'">
              <dispatch-item-vue
                v-for="item in recordList"
                :key="item.id"
                :showBtn="true"
                :data="item"
                :isApproval="isApproval"
                :isShowfooterApproval="isShowfooterApproval"
                @agreeOrRefuse="$emit('agreeOrRefuse')"
              ></dispatch-item-vue>
            </ul>
          </div>
        </div>
      </cube-scroll>
      <no-data v-else></no-data>
    </div>

    <mu-dialog
      width="360"
      transition="slide-bottom"
      fullscreen
      :overlay="false"
      :open.sync="openFullscreen1"
      class="dialog-search"
    >
      <search-vue
        :placeholder="placeholder"
        @cancelSearch="
          () => {
            openFullscreen1 = false;
            bar = false;
          }
        "
        @onSearch="search"
      ></search-vue>
    </mu-dialog>
    <mu-dialog
      width="360"
      transition="slide-bottom"
      fullscreen
      :overlay="false"
      :open.sync="openFullscreen2"
      class="dialog-screen"
      scrollable
    >
      <div class="status" v-if="!isApproval">
        <h2><img src="../../../../assets/images/backlog-status.png" />状态</h2>
        <ul>
          <li
            v-for="(item, i) in ['全部', '审批中', '已拒绝', '已同意']"
            :key="i"
            @click="index = i"
            :class="{ active: i == index }"
          >
            {{ item }}
          </li>
        </ul>
      </div>
      <div class="type">
        <h2><img src="../../../../assets/images/backlog-type.png" />类型</h2>
        <van-collapse v-model="activeNames" :border="false" v-if="!isBackLog">
          <ul>
            <li :class="{ active: allSelect }" @click="selectAll">全部</li>
            <li
              v-for="(item, i) in allTypeData"
              :key="i"
              :class="addClass(item.wordBook)"
              @click="clickHandle(item.wordBook)"
            >
              {{ item.wordBook }}
            </li>
          </ul>
        </van-collapse>
        <div v-else class="backLogType">
          <ul>
            <li
              v-for="(module, i) in allTypeData"
              :key="i"
              :class="addClass(i)"
              @click="clickHandle(i)"
            >
              {{ module }}
            </li>
          </ul>
        </div>
      </div>
      <div class="btn">
        <x-button @click.native="sureClick">确定</x-button>
      </div>
    </mu-dialog>
  </div>
</template>

<script>
  import searchVue from "../search/search.vue";
  import reimburseItemVue from "../items/reimburse-item.vue";
  import fundItemVue from "../items/fund-item.vue";
  import fixedItemVue from "../items/fixed-assets-item.vue";
  import chapterItemVue from "../items/use-chapter-item.vue";
  import stampChapterItemVue from "../items/stamp-chapter-item.vue";
  import qualificationItemVue from "../items/qualification-loan-item.vue";
  import projectItemVue from "../items/project-item.vue";
  import dispatchItemVue from "../items/dispatch-item.vue";
  import { _getData } from "../../service/getData";
  import _ from "lodash";

  export default {
    data() {
      return {
        openFullscreen1: false,
        openFullscreen2: false,
        tab: 0,
        activeNames: ["1", "2", "3", "4", "5", "6", "7"],
        options: {
          pullDownRefresh: false,
          pullUpLoad: {
            txt: { noMore: "全部数据加载完毕" },
            visible: true,
          },
        },
        bar: false,
        currentPage: 1, //当前页
        qualificationArr: [],
        filterData: [],
        allTypeData: [],
        allSelect: true,
        activeIndex: 0,
        index: 0,
        typeIndex: 0,
        placeholder: "",
      };
    },
    components: {
      searchVue,
      reimburseItemVue,
      fundItemVue,
      fixedItemVue,
      chapterItemVue,
      qualificationItemVue,
      stampChapterItemVue,
      projectItemVue,
      dispatchItemVue,
    },
    props: {
      recordList: {
        type: Array,
        default: [],
      },
      pageCount: {
        //总页数
        type: Number,
      },
      getData: {},
      type: {
        //类型
        type: String,
      },
      isInit: { type: Boolean, default: false },
      isBackLog: { type: Boolean, default: false },
      isApproval: { type: Boolean, default: false },
      isShowfooterApproval: { type: Boolean, default: false },
    },
    watch: {
      recordList(newVal) {
        console.log(newVal);
        //if (newVal.length == 0) this.$refs.scroll.resetPullUpTxt();
      },
      currentPage(newVal) {
        if (newVal == 1 && newVal < this.pageCount)
          this.$refs.scroll.resetPullUpTxt();
      },
    },
    mounted() {
      switch (this.type) {
        case "qualification":
          this.placeholder = "搜索申请人名称、资质所属公司";
          this.getTypeData("category/getCategory", "3", "584", "license");
          break;
        case "stampChapter":
          this.placeholder = "搜索申请人名称、印章所属公司";
          this.getTypeData("category/getCategory", "3", "579", "seal");
          break;
        case "useChapter":
          this.placeholder = "搜索申请人名称、印章所属公司";
          this.getTypeData("category/getCategory", "3", "579", "seal");
          break;
        case "fixed":
          this.placeholder = "搜索申请人名称";
          this.getTypeData("category/getCategory", "2", "144", "assets");
          break;
        case "fund":
          this.placeholder = "搜索申请人名称、项目名称";
          this.getTypeData("category/getCategory", "2", "", "funds");
          break;
        case "reimburse":
          this.placeholder = "搜索申请人名称、所属公司";
          this.getTypeData("category/getCategory", "2", "445", "bill");
          break;
        case "project":
          this.placeholder = "搜索申请人名称、所属公司";
          this.getTypeData("category/getCategory", "3", "703", "item");
          break;
        case "dispatch":
          this.getDispatchType();
          break;
        default:
          this.placeholder = "搜索申请人名称、所属公司";
          this.allTypeData = [
            "全部",
            "报销",
            "款项",
            "固定资产",
            "盖章",
            "借章",
            "公司资质",
            "项目",
          ];
          this.filterData = [0];
          break;
      }
    },
    activated() {
      console.log(this.isInit);
      if (this.isInit) {
        this.tab = 0;
        this.index = 0;
        this.allSelect = true;
        this.filterData = [];
        if (this.isBackLog) {
          this.filterData = [0];
        }
      }
    },
    deactivated() {
      this.openFullscreen1 = false;
      this.openFullscreen2 = false;
      this.bar = false;
    },
    methods: {
      async getDispatchType() {
        await _getData("wordbook/getWordBookList", { code: "Dispatch" }).then(
          (data) => {
            console.log("获取类型", data);
            this.allTypeData = data;
          }
        );
      },
      search(val) {
        this.openFullscreen1 = false;
        this.bar = false;
        this.index = 0;
        this.allSelect = true;
        this.filterData = [];
        if (this.isBackLog) {
          this.filterData = [0];
        }
        this.$emit("search", val);
      },
      selectAll() {
        this.filterData = [];
        this.allSelect = true;
      },
      clickHandle(item) {
        let select = _.find(this.filterData, (o) => {
          return o == item;
        });

        if (select) {
          this.filterData = _.without(this.filterData, select);
        } else {
          this.filterData.push(item);
        }
        if (typeof item == "number") {
          if (item == 0) {
            this.filterData = [0];
          } else {
            this.filterData = _.without(this.filterData, 0);
          }
          if (
            this.filterData.length == 0 ||
            this.filterData.length == this.allTypeData.length - 1
          ) {
            this.filterData = [0];
          }
        } else {
          if (
            this.filterData.length == 0 ||
            this.filterData.length == this.allTypeData.length
          ) {
            this.allSelect = true;
            this.filterData = [];
          } else {
            this.allSelect = false;
          }
        }
      },
      addClass(item) {
        for (const v of this.filterData) {
          if (v == item) {
            return "active";
          }
        }
      },
      onPullingUp() {
        console.log(this.currentPage);
        this.currentPage += 1;

        if (this.currentPage > this.pageCount) {
          this.$refs.scroll.forceUpdate();
          this.$nextTick(() => {
            //this.$refs.scroll.refresh();
          });
          return;
        }
        console.log(this.currentPage);
        this.$emit("onPullingUp", this.currentPage);
        setTimeout(() => {
          this.getData().then(() => {
            // this.$refs.scroll.forceUpdate();
            this.$nextTick(() => {
              this.$refs.scroll.refresh();
            });
          });
        }, 500);
      },
      pullDownTip() {
        if (this.pullDownY <= 60) {
          return "下拉刷新...";
        } else if (this.pullDownY <= 90) {
          return "继续下拉有惊喜...";
        } else {
          return "松手得惊喜！";
        }
      },
      openFullscreenDialog(name) {
        // console.log(name);
        this.bar = true;
        if (name == 0) {
          this.openFullscreen1 = true;
          this.openFullscreen2 = false;
        } else {
          this.openFullscreen1 = false;
          this.openFullscreen2 = true;
        }
      },
      sureClick() {
        this.openFullscreen2 = false;
        this.bar = false;
        this.$emit("sureClick", {
          filterData: this.filterData,
          state: this.index || "",
        });
      },
      closeFullscreenDialog() {
        this.openFullscreen1 = false;
        this.bar = false;
      },
      cancelSearch() {
        this.bar = false;
        this.closeFullscreenDialog();
      },
      delHistory() {
        this.$dialog.confirm({
          message: "确认删除全部历史记录？",
          overlayStyle: {
            background: "rgba(0,0,0,0.30)",
          },
        });
      },
      async getTypeData(url, type, parentId, typeName) {
        await _getData(url, {
          type: type,
          parentId: parentId,
          typeName: typeName,
        }).then((data) => {
          console.log("获取类型", data);
          this.allTypeData = data;
        });
      },
    },
  };
</script>

<style lang="scss" scoped>
  @import "../../../../../static/scss/_commonScss";
  #record {
    flex: 1;
    height: 100%;
    overflow: hidden;
    background: #f6f6f6;
    .search {
      height: 44px;
      width: 100%;
      display: flex;
      justify-content: flex-start;
      align-items: center;
      font-family: PingFangSC-Regular;
      font-size: 15px;
      color: #666666;
      background: #fff;
      .swiper-container {
        width: 100%;
        display: flex;
        height: 100%;
        .swiper-wrapper {
          width: 100%;
          display: flex;
          height: 100%;
          position: relative;
          .swiper-slide {
            flex: 1;
            display: flex;
            .title {
              display: flex;
              flex: 1;
              justify-content: center;
              align-items: center;
              span {
                display: flex;
                width: 17px;
                height: 16px;
                margin-right: 5px;
                img {
                  width: 100%;
                  height: 100%;
                }
              }
            }
          }
          .bar {
            position: absolute;
            width: 108px;
            height: 2px;
            background-color: #ee0a24;
            bottom: 0;

            border-radius: 2px;
            &.active1 {
              left: 40px;
            }
            &.active2 {
              right: 40px;
            }
          }
        }
      }

      /deep/ .van-tabs__wrap {
        width: 100%;
        &::after {
          border: 0;
        }
        .van-tab {
          font-family: PingFangSC-Regular;
          font-size: 15px;
          color: #666666;
          .title {
            display: flex;
            flex: 1;
            justify-content: center;
            align-items: center;
            span {
              display: flex;
              width: 17px;
              height: 16px;
              margin-right: 5px;
              img {
                width: 100%;
                height: 100%;
              }
            }
          }
        }
      }
    }
    .content-box {
      height: calc(100% - 44px);
    }
    .cube-scroll-wrapper {
      height: 100%;
      /deep/ .cube-pullup-wrapper {
        height: 43px;
      }
    }
    .record-container {
      background: $base-background;
      padding: 0 13px;
      margin-top: 10px;
      .common {
        ul {
          margin-bottom: 10px;
        }
      }
      > ul {
        display: flex;
        padding-top: 10px;
        flex-direction: column;
        > li {
          @include box_shadow_style;
          position: relative;
          display: flex;
          width: 100%;
          flex-direction: column;
          padding: 47px 0 0px;
          margin-bottom: 10px;
          &:last-child {
            margin-bottom: 0;
          }
          .main {
            padding: 0 13px;
            & > i {
              display: flex;
              height: 24px;
              width: 56px;
              position: absolute;
              top: 10px;
              right: 10px;
              img {
                height: 100%;
              }
            }
            & > div {
              font-family: PingFangSC-Light;
              font-size: 13px;
              color: #f96a0e;
              display: flex;
              align-items: center;
              height: 21px;
              margin-top: 6px;
              span {
                margin-top: 4px;
                background: url("../../../../assets/images/point.png") no-repeat
                  center;
                background-size: 100% 100%;
                display: flex;
                height: 21px;
                width: 22px;
                margin-right: 2px;
                margin-left: -4px;
              }
            }
            & > span {
              background: #59a8c7;
              border-radius: 12px 0 11px 0;
              position: absolute;
              top: 0;
              //min-width: 54px;
              padding: 0 19px;
              height: 28px;
              left: 0;
              font-family: PingFangSC-Medium;
              font-size: 14px;
              color: #ffffff;
              display: flex;
              font-weight: bold;
              align-items: center;
              justify-content: center;
            }
            > h2 {
              font-family: PingFangSC-Medium;
              font-size: 17px;
              color: #222222;
              font-weight: bold;
              line-height: 24px;
              display: flex;
              flex-direction: column;
              align-items: flex-start;
              justify-content: flex-start;
              margin-bottom: 15px;
              span {
                font-family: PingFangSC-Regular;
                font-size: 13px;
                color: #aaaaaa;
              }
            }
            > ul {
              li {
                display: flex;
                font-family: PingFangSC-Medium;
                font-size: 14px;
                color: #222222;
                align-items: center;
                font-weight: bold;
                margin-bottom: 9px;

                > span {
                  display: flex;
                  width: 104px;
                  font-family: PingFangSC-Light;
                  font-size: 14px;
                  color: #666666;
                  line-height: 20px;
                  margin-bottom: 2px;
                }
              }
            }
          }

          .btn {
            display: flex;
            height: 59px;
            border-top: 1px solid #f6f6f6;
            align-items: center;
            padding: 0 42px;
            justify-content: space-between;
            margin-top: 13px;
            .weui-btn_default:not(.weui-btn_disabled):active {
              //color: rgba(0, 0, 0, 0.6);
              background: rgba($color: #000000, $alpha: 0.1);
            }
            /deep/ button.weui-btn {
              width: 90px;
              height: 30px;
              border-radius: 30px;
              border: 0;
              display: flex;
              align-items: center;
              justify-content: center;
              line-height: 30px;
              background: rgba(241, 2, 21, 0.06);
              border: 0.5px solid #f10215;
              font-family: PingFangSC-Light;
              font-size: 14px;
              color: #f10215;
              margin: 0;

              &::after {
                border: 0;
              }

              &:last-child {
                background: rgba(65, 118, 255, 0.06);
                border: 0.5px solid #4176ff;
                color: #4176ff;
              }
            }
          }
          &.assets {
            > div.main > span {
              background: none;
              background-image: linear-gradient(75deg, #00a96a 0%, #50cb9c 98%);
            }
          }
        }
      }
    }
  }
  /deep/.mu-dialog-wrapper {
    border-top: 1px solid #f6f6f6;
    height: calc(100% - 108px) !important;
    top: 108px;
    z-index: 100 !important;
    @media only screen and (device-width: 375px) and (device-height: 812px) and (-webkit-device-pixel-ratio: 3),
      only screen and (device-width: 414px) and (device-height: 896px) and (-webkit-device-pixel-ratio: 2),
      only screen and (device-width: 414px) and (device-height: 896px) and (-webkit-device-pixel-ratio: 3) {
      height: calc(100% - 132px) !important;
      top: 132px !important;
    }
  }

  /deep/ .mu-dialog-fullscreen {
    height: 100% !important;
    top: 0px;
    box-shadow: none;
  }
  /deep/.dialog-search {
    .mu-dialog-body {
      .history-content {
        padding: 0 13px;
        h2 {
          font-family: PingFangSC-Medium;
          font-size: 15px;
          color: #222222;
          font-weight: bold;
          height: 60px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          span {
            // height: 20px;
            // width: 20px;
            display: flex;
            align-items: center;
            justify-content: center;
            font-family: PingFangSC-Regular;
            font-size: 14px;
            color: #999999;
            img {
              height: 18px;
              width: 16px;
              margin-right: 5px;
            }
          }
        }
        ul {
          padding: 0 13px;
          li {
            width: 100%;
            height: 49px;
            display: flex;
            align-items: center;
            justify-content: space-between;
            font-family: PingFangSC-Regular;
            font-size: 13px;
            color: #666666;
            border-bottom: 1px solid #f6f6f6;
            > span {
              display: flex;
              align-items: center;
              > span {
                font-family: PingFangSC-Regular;
                font-size: 14px;
                color: #666666;
              }
            }
            img {
              &:first-child {
                width: 19px;
                height: 19px;
                margin-right: 10px;
              }
              &:last-child {
                width: 14px;
                height: 14px;
                margin-left: 10px;
              }
            }
          }
        }
      }
    }
  }
  /deep/.dialog-screen {
    .mu-dialog-body {
      padding: 0 13px;
      max-height: 529px !important;
      padding-bottom: 20px;
      h2 {
        font-family: PingFangSC-Medium;
        font-size: 16px;
        color: #222222;
        font-weight: bold;
        height: 58px;
        display: flex;
        align-items: center;
        img {
          width: 23px;
          height: 23px;
          margin-top: 5px;
          margin-right: 6.5px;
        }
      }
      ul {
        display: flex;
        // justify-content: space-between;
        flex-direction: row;
        flex-wrap: wrap;
        margin-bottom: -10px;
        padding-left: 7px;
        li {
          height: 44px;
          width: 107px;
          border-radius: 5px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-family: PingFangSC-Light;
          font-size: 14px;
          color: #222222;
          text-align: center;
          background: #f4f4f4;
          margin-bottom: 10px;
          padding: 0 11px;
          line-height: 18px;
          margin-right: 10px;
          &.active {
            font-family: PingFangSC-Medium;
            font-size: 14px;
            color: #4176ff;
            font-weight: bold;
            background: rgba(65, 118, 255, 0.1);
          }
          &:nth-child(3n) {
            margin-right: 0;
          }
        }
      }
      .type {
        > div {
          display: flex;
        }
        ul {
          li {
            &.active {
              color: #50cb9c;
              background: rgba(80, 203, 156, 0.1);
            }
          }
        }
        > ul {
          margin-bottom: 0.1px;
          li {
            &.active {
              color: #50cb9c;
              background: rgba(80, 203, 156, 0.1);
            }
          }
        }
      }
      /deep/ .van-collapse {
        .van-collapse-item {
          &::after {
            border: 0;
          }
          .van-cell {
            padding: 0;

            padding-left: 7px;

            height: 50px;
            display: flex;
            align-items: center;
            font-family: PingFangSC-Regular;
            font-size: 15px;
            color: #222222;
            &::after {
              border-bottom: 1px solid #f6f6f6;
              width: 100%;
              left: 7px;
            }
            .van-cell__title {
            }
            > i {
              font-size: 20px;
              &::after {
              }
            }
          }
          .van-collapse-item__wrapper {
            .van-collapse-item__content {
              padding: 0;
              padding: 10px 0;
              //padding-left: 7px;
            }
          }
        }
      }
      .btn {
        height: 50px;
        position: absolute;
        bottom: 0px;
        left: 0;
        display: flex;
        width: 100%;
        @include iphone-X-footer;
        padding: 0 13px;
        align-items: center;
        > button {
          height: 36px;
          background: #f10215;
          border-radius: 18px;
          font-family: PingFangSC-Medium;
          font-size: 16px;
          color: #ffffff;
          font-weight: bold;
        }
      }
    }
  }
</style>
