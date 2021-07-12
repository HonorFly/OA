<template>
  <div class="common-dispatch">
    <div class="select-dispatch">
      <x-button @click.native="openFullscreen = true">
        <img src="../../../../assets/images/dispatch-common.png" />
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
        <h2>普通派工单</h2>
      </div>
      <div class="mu-dialog-content">
        <search-vue
          :defaultValue="searchVal"
          @cancelSearch="openFullscreen = false"
          @onSearch="search"
          @onInput="getValue"
        ></search-vue>
        <div class="list-content">
          <div class="select-box">
            <span @click="selectCompany">
              <i>{{ companyName ? companyName : "所属公司" }}</i>
              <img src="../../../../assets/images/arrow-bottom-double.png" />
            </span>
            <span @click="selectDispatch">
              {{ dispatchTypeName ? dispatchTypeName : "派工单类型" }}
              <img src="../../../../assets/images/arrow-bottom-double.png" />
            </span>
            <span @click="selectRepair">
              {{ repairTypeName ? repairTypeName : "业务类型" }}
              <img src="../../../../assets/images/arrow-bottom-double.png" />
            </span>
          </div>
          <cube-scroll
            ref="scroll"
            :options="options"
            @pulling-up="onPullingUp"
            :data="commonList"
            v-if="commonList.length>0"
          >
            <ul>
              <li
                v-for="item in commonList"
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
                    <span>维修类型</span><span>{{ item.repairType }}</span>
                  </div>
                  <div>
                    <span>医院名称</span><span>{{ item.clientName }}</span>
                  </div>
                  <div>
                    <span>所属公司</span><span>{{ item.chinaName }}</span>
                  </div>
                  <div>
                    <span>工程师</span><span>{{ item.fullName }}</span>
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
        picker1: null,
        picker2: null,
        selectedIndex: [0],
        selectedIndex1: [0],
        selectedIndex2: [0],
        searchVal: "",
        companyName: "",
        companyList: [], //公司
        repairTypeName: "",
        repairTypeList: [], //维修类型
        dispatchTypeName: "",
        dispatchTypeList: [], //派工单类型
        currentDispatch: this.dispatch,
        scrollHeight: 0,
        pageCount: 1,
        currentPage: 1,
        commonList: [],
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
        }}
      },
      project(newVal) {
        if (!_.isEmpty(newVal)) {
          this.currentDispatch = newVal;
        }
      }
    },
    activated() {
      if (!this.$route.meta.isBack) {
        this.scrollHeight = 0;
        this.searchVal = "";
        this.companyId = "";
        this.companyName = "";
        this.currentPage = 1;
        this.pageCount = 1;
        this.currentDispatch = {};
        this.commonList = [];
        this.getData();
        _getData("company/companyList", {}).then(data => {
          console.log("公司列表：", data);
          data.unshift({ id: "", chinaName: "全部" });
          this.companyList = data;
        });
        _getData("dispatch/getDispatchTypeList", {
          type: "3",
          id: "530"
        }).then(data => {
          console.log("派工单类型：", data);
          data.unshift({ id: "", wordBook: "全部" });
          this.dispatchTypeList = data;
        });
        _getData("dispatch/getDispatchTypeList", {
          type: "3",
          id: "537"
        }).then(data => {
          console.log("维修类型：", data);
          data.unshift({ id: "", wordBook: "全部" });
          this.repairTypeList = data;
        });
      }
    },
    methods: {
      sureHandle() {
        this.openFullscreen = false;
        this.currentDispatch.dispatchType = "config";
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
        this.currentPage = 1;
        this.pageCount = 1;
        this.companyId = "";
        this.companyName = "";
        this.dispatchTypeId = "";
        this.dispatchTypeName = "";
        this.repairTypeId = "";
        this.repairTypeName = "";
        this.currentDispatch = {};
        this.commonList = [];
        this.getData();
      },
      selectCompany() {
        if (!this.picker) {
          this.picker = this.$createPicker({
            data: [this.companyList],
            alias: { value: "id", text: "chinaName" },
            zIndex: 25000000,
            selectedIndex: this.selectedIndex,
            onSelect: (selectedVal, selectedIndex, selectedText) => {
              console.log(selectedText);
              this.companyId = selectedVal[0];
              this.companyName = selectedText.join("");
              this.selectedIndex = selectedIndex;
              this.currentPage = 1;
              this.pageCount = 1;
              this.currentDispatch = {};
              this.commonList = [];
              this.getData();
            },
            onCancel: () => {
              this.picker = null;
            }
          });
        }
        this.picker.show();
      },
      selectDispatch() {
        if (!this.picker1) {
          this.picker1 = this.$createPicker({
            data: [this.dispatchTypeList],
            alias: { value: "id", text: "wordBook" },
            zIndex: 25000000,
            selectedIndex: this.selectedIndex1,
            onSelect: (selectedVal, selectedIndex, selectedText) => {
              console.log(selectedText);
              this.dispatchTypeId = selectedVal[0];
              this.dispatchTypeName = selectedText.join("");
              this.selectedIndex1 = selectedIndex;
              this.currentPage = 1;
              this.pageCount = 1;
              this.currentDispatch = {};
              this.commonList = [];
              this.getData();
            },
            onCancel: () => {
              this.picker1 = null;
            }
          });
        }
        this.picker1.show();
      },
      selectRepair() {
        if (!this.picker2) {
          this.picker2 = this.$createPicker({
            data: [this.repairTypeList],
            alias: { value: "id", text: "wordBook" },
            zIndex: 25000000,
            selectedIndex: this.selectedIndex2,
            onSelect: (selectedVal, selectedIndex, selectedText) => {
              console.log(selectedText);
              this.repairTypeId = selectedVal[0];
              this.repairTypeName = selectedText.join("");
              this.selectedIndex2 = selectedIndex;
              this.currentPage = 1;
              this.pageCount = 1;
              this.currentDispatch = {};
              this.commonList = [];
              this.getData();
            },
            onCancel: () => {
              this.picker2 = null;
            }
          });
        }
        this.picker2.show();
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
        await _getData("dispatch/dispatchList", {
          type: this.dispatchTypeName,
          chinaName: this.companyName,
          repairType: this.repairTypeName,
          name: this.searchVal,
          currentPage: this.currentPage,
          countPerPage: "10"
        }).then(data => {
          console.log("普通列表：：：", data);
          this.commonList = [...this.commonList, ...data.data];
          this.pageCount = data.totalPages;
        });
      }
    },
    components: { searchVue }
  };
</script>

<style lang="scss" scoped>
  @import "../../../../../static/scss/_commonScss";
  .common-dispatch {
    margin-left: 8px;
    h3 {
      display: flex;
      align-items: center;
      font-weight: bold;
      font-size: 15px;
      color: #222222;
      font-family: PingFangSC-Medium;
      img {
        width: 20px;
        height: 18px;
        margin-right: 10px;
      }
      i {
        font-family: PingFangSC-Regular;
        font-size: 14px;
        color: #999999;
        font-style: normal;
      }
    }
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
        font-size: 18px;
        font-weight: bold;
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
      // height: calc(100% - 50px) !important;
      background-color: #f6f6f6;
      width: 100%;
      flex: 1;
      flex-direction: column;
      overflow: hidden;
      display: flex;
      .list-content {
        flex: 1;
        overflow: hidden;
        display: flex;
        flex-direction: column;
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
            i {
              max-width: 86px;
              height: 22px;
              line-height: 22px;
              text-align: right;
              font-style: normal;
              overflow: hidden;
              text-overflow: ellipsis;
              white-space: nowrap;
            }
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
      @include iphone-X-footer;
      // position: absolute;
      bottom: 0;
      box-shadow: 0 2px 8px 0 rgba(0, 0, 0, 0.16);
      display: flex;
      align-items: center;
      .weui-btn {
        height: 40px;
        border-radius: 20px;
        background-color: $button-color;
        font-family: PingFangSC-Medium;
        font-size: 16px;
        font-weight: bold;
        color: #ffffff;
      }
    }
  }
</style>
