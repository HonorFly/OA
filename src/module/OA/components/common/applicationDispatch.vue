<template>
  <div class="app-dispatch">
    <div class="select-dispatch">
      <x-button @click.native="openFullscreen = true">
        <img src="../../../../assets/images/dispatch-app.png" />
      </x-button>
    </div>
    <mu-dialog
      fullscreen
      scrollable
      transition="slide-bottom"
      :overlay="false"
      :open.sync="openFullscreen"
    >
      <div class="mu-dialog-header" slot="title">
        <span class="back" @click="openFullscreen = false">
          <img src="../../../../assets/images/back.png" />
        </span>
        <h2>应用培训派工单</h2>
      </div>
      <div class="mu-dialog-content">
        <search-vue
          :defaultValue="searchVal"
          @cancelSearch="openFullscreen = false"
          @onSearch="search"
          @onInput="getValue"
        ></search-vue>
        <div class="list-content">
          <cube-scroll
            ref="scroll"
            :options="options"
            @pulling-up="onPullingUp"
            :data="applicationList"
            v-if="applicationList.length > 0"
          >
            <ul>
              <li
                v-for="item in applicationList"
                :key="item.id"
                @click="clickHandle(item)"
              >
                <div class="left-box">
                  <div>
                    <span>派工单号</span><span>{{ item.sn }}</span>
                  </div>
                  <div>
                    <span>开单时间</span>
                    <span>{{ item.addTime.split(" ")[0] }}</span>
                  </div>
                  <div>
                    <span>派工类型</span><span>{{ item.type }}</span>
                  </div>
                  <div>
                    <span>所属区域</span><span>{{ item.area }}</span>
                  </div>
                  <div>
                    <span>机器型号</span><span>{{ item.no }}</span>
                  </div>
                  <div>
                    <span>厂家派工单号</span><span>{{ item.factorySn }}</span>
                  </div>
                  <div>
                    <span>医院名称</span><span>{{ item.clientName }}</span>
                  </div>
                  <div>
                    <span>应用医生</span><span>{{ item.fullName }}</span>
                  </div>
                </div>
                <div class="right-box">
                  <span
                    :class="{ active: currentDispatch.id == item.id }"
                  ></span>
                </div>
              </li>
            </ul>
          </cube-scroll>
          <no-data v-else></no-data>
        </div>
      </div>
      <div class="mu-dialog-footer">
        <x-button type="primary" @click.native="sureHandle">确定</x-button>
      </div>
    </mu-dialog>
  </div>
</template>

<script>
  import { _getData } from "../../service/getData";
  import searchVue from "../search/search.vue";
  import _ from "lodash";
  import { type } from "os";
  export default {
    data() {
      return {
        openFullscreen: false,
        picker: null,
        selectedIndex: [0],
        searchVal: "",
        currentDispatch: this.dispatch,
        scrollHeight: 0,
        pageCount: 1,
        currentPage: 1,
        applicationList: [],
        options: {
          pullDownRefresh: false,
          pullUpLoad: {
            txt: { noMore: "全部数据加载完毕" },
            visible: true
          }
        }
      };
    },
    props: ["dispatch"],
    watch: {
      openFullscreen(newVal) {
        if (this.$refs.scroll) {
          if (newVal) {
            setTimeout(() => {
              this.$refs.scroll.scrollTo(0, this.scrollHeight, 0, "ease");
            }, 0);
          } else {
            this.scrollHeight = this.$refs.scroll.scroll.y;
          }
        }
      },
      project(newVal) {
        if (!_.isEmpty(newVal)) {
          this.currentDispatch = newVal;
        }
      }
    },
    activated() {
      console.log(this.$route.meta.isBack);
      if (!this.$route.meta.isBack) {
        this.scrollHeight = 0;
        this.searchVal = "";
        this.currentPage = 1;
        this.pageCount = 1;
        this.currentDispatch = {};
        this.applicationList = [];
        this.getData();
      }
    },
    methods: {
      sureHandle() {
        this.openFullscreen = false;
        this.currentDispatch.dispatchType = "erp_train_dispatch";
        this.$emit("getDispatch", this.currentDispatch);
      },
      clickHandle(item) {
        this.currentDispatch = item;
      },
      getValue(val) {
        this.searchVal = val;
      },
      search(val) {
        this.searchVal = val;
        this.currentDispatch = {};
        this.currentPage = 1;
        this.pageCount = 1;
        this.applicationList = [];
        this.getData();
      },
      onPullingUp() {
        this.currentPage += 1;
        if (this.currentPage > this.pageCount) {
          this.$refs.scroll.forceUpdate();
          return;
        }
        setTimeout(() => {
          this.getData().then(() => {
            this.$nextTick(() => {
              this.$refs.scroll.refresh();
            });
          });
        }, 500);
      },
      async getData() {
        await _getData("trainDispatch/trainDispatchList", {
          name: this.searchVal,
          currentPage: this.currentPage,
          countPerPage: "10"
        }).then(data => {
          console.log("应用派工列表：：：", data);
          this.applicationList = [...this.applicationList, ...data.data];
          this.pageCount = data.totalPages;
        });
      }
    },
    components: { searchVue }
  };
</script>

<style lang="scss" scoped>
  @import "../../../../../static/scss/_commonScss";
  .app-dispatch {
    .select-dispatch {
      height: 46px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      font-size: 14px;
      .weui-btn {
        width: 160px;
        height: 46px;
        padding: 0;
        img {
          width: 100%;
          height: 100%;
        }
        &:after {
          display: none;
        }
      }
    }
  }
  /deep/ .mu-dialog {
    display: flex;
    flex-direction: column;
    .mu-dialog-title {
      width: 100%;
      padding: 0;
      @include iphone-X-header;
      .mu-dialog-header {
        width: 100%;
        height: 100%;
        display: flex;
        align-items: center;
        justify-content: flex-start;
        background: #fff;
        .back {
          display: flex;
          align-items: center;
          height: 100%;
          width: 44px;
          img {
            height: 100%;
            width: 100%;
          }
        }
      }
      h2 {
        font-family: PingFangSC-Medium;
        font-weight: bold;
        font-size: 18px;
        color: #222222;
        display: flex;
        height: 100%;
        width: calc(100% - 88px);
        align-items: center;
        justify-content: center;
      }
    }
  }
  /deep/ .mu-dialog-body {
    flex: 1;
    max-height: none !important;
    display: flex;
    flex-direction: column;
    .mu-dialog-content {
      background-color: #f6f6f6;
      width: 100%;
      flex: 1;
      flex-direction: column;
      overflow: hidden;
      display: flex;
      .list-content {
        flex: 1;
        overflow: hidden;
        .select-box {
          display: flex;
          align-items: center;
          height: 50px;
          background-color: #fff;
          border-bottom: 1px solid #f6f6f6;
          span {
            display: flex;
            justify-content: center;
            align-items: center;
            height: 31px;
            flex: 1;
            border-right: 1px solid #f6f6f6;
            font-family: PingFangSC-Regular;
            font-size: 14px;
            color: #666666;
            img {
              width: 12px;
              height: 11px;
              margin-left: 5px;
            }
            &:last-child {
              border-right: none;
            }
            &.active {
              color: #222;
            }
          }
        }
        .cube-scroll-wrapper {
          height: 100%;
          flex: 1;
          .cube-scroll-content {
            // height: 100%;
            .cube-scroll-list-wrapper {
              //min-height: 100% !important;
            }
            .cube-pullup-wrapper {
              height: 43px;
            }
          }
        }
        ul {
          li {
            background-color: #fff;
            padding: 20px 13px;
            display: flex;
            margin-bottom: 10px;
            &:last-child {
              margin-bottom: 0;
            }
            .left-box {
              width: 290px;
              > div {
                display: flex;
                margin-bottom: 10px;
                line-height: 20px;
                &:last-child {
                  margin-bottom: 0;
                }
                span {
                  font-size: 14px;
                  &:first-child {
                    width: 56px;
                    margin-right: 20px;
                    color: #666666;
                    font-family: PingFangSC-Light;
                  }
                  &:last-child {
                    flex: 1;
                    color: #222;
                    font-family: PingFangSC-Medium;
                    font-weight: bold;
                  }
                }
              }
            }
            .right-box {
              flex: 1;
              display: flex;
              justify-content: center;
              align-items: center;
              > span {
                height: 22px;
                width: 22px;
                display: flex;
                border: 1px solid #999;
                border-radius: 11px;
                position: absolute;
                right: 13px;
                &::after {
                  content: "";
                  position: absolute;
                  display: flex;
                  transition: opacity 0.3s;
                  width: 22px;
                  height: 22px;
                  background: url("../../../../assets/images/selected.png")
                    no-repeat center;
                  background-size: 100% 100%;
                  top: -1px;
                  left: -1px;
                  opacity: 0;
                }
                &.active {
                  &::after {
                    opacity: 1;
                  }
                }
              }
            }
          }
        }
      }
    }
    .mu-dialog-footer {
      width: 100%;
      height: 50px;
      padding: 0 13px;
      // position: absolute;
      bottom: 0;
      box-shadow: 0 2px 8px 0 rgba(0, 0, 0, 0.16);
      display: flex;
      align-items: center;
      @include iphone-X-footer;
      .weui-btn {
        height: 40px;
        border-radius: 20px;
        background-color: $button-color;
        font-family: PingFangSC-Medium;
        font-weight: bold;
        font-size: 16px;
        color: #ffffff;
      }
    }
  }
</style>
