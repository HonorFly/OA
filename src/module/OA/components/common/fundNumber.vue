<template>
  <div class="fund-number">
    <h3 :class="type == 'details' && 'detailDisabled'">
      <span>
        <img src="../../../../assets/images/odd.png" width="20" />
      </span>
      借款单号
    </h3>
    <div
      class="select-loan-number"
      @click="type != 'details' && (openFullscreen = true)"
    >
      <span :class="{ active: fundNumber }">
        {{ fundNumber ? fundNumber : "请选择借款单号（可多选）" }}
      </span>
      <img
        v-if="type != 'details'"
        src="../../../../assets/images/arrow-right.png"
      />
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
        <h2>
          借款单
        </h2>
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
            :data="loanList"
            v-if="loanList.length > 0"
          >
            <ul>
              <li
                v-for="item in loanList"
                :key="item.id"
                @click="clickHandle(item)"
              >
                <div class="left-box">
                  <div>
                    <span>申请单号</span><span>{{ item.sn }}</span>
                  </div>
                  <div>
                    <span>申请时间</span>
                    <span>{{ item.applyTime.split(" ")[0] }}</span>
                  </div>
                  <div v-if="item.itemName">
                    <span>项目名称</span><span>{{ item.itemName }}</span>
                  </div>
                  <div>
                    <span>款项用途</span
                    ><span class="fundUse">{{ item.uses }}</span>
                  </div>
                  <div>
                    <span>申请总额</span><span>{{ item.money }}</span>
                  </div>
                </div>
                <div class="right-box">
                  <span :class="addClass(item.sn)"></span>
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
  export default {
    data() {
      return {
        openFullscreen: false,
        picker: null,
        selectedIndex: [0],
        searchVal: "",
        projectId: "",
        fundNumber: "",
        currentProject: this.project,
        scrollHeight: 0,
        currentPage: 1,
        loanList: [],
        selectedLoanArr: this.fundNumbers,
        fundsId: "",
        options: {
          pullDownRefresh: false,
          pullUpLoad: {
            txt: { noMore: "全部数据加载完毕" },
            visible: true
          }
        }
      };
    },
    props: ["fundNumbers", "type"],
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
      fundNumbers(newVal) {
        console.log("借款单:::", newVal);
        if (!_.isEmpty(newVal)) {
          if (newVal.fundsName) {
            this.selectedLoanArr = newVal.fundsName.split(",");
          } else {
            this.selectedLoanArr = [];
          }
          this.fundNumber = newVal.fundsName;
          this.fundsId = newVal.fundsId;
        }
      }
    },
    activated() {
      // console.log(this.$route.meta.isBack);
      if (!this.$route.meta.isBack) {
        this.scrollHeight = 0;
        this.searchVal = "";
        this.currentPage = 1;
        this.pageCount = 1;
        this.projectId = "";
        this.fundNumber = "";
        this.fundsId = "";
        this.currentProject = {};
        this.loanList = [];
        this.selectedLoanArr = [];
        this.getData();
      }
    },
    methods: {
      sureHandle() {
        // console.log(this.selectedLoanArr);
        // console.log(this.fundsId);
        this.openFullscreen = false;
        this.fundNumber = this.selectedLoanArr.join(",");
      },
      clickHandle(item) {
        let select = _.find(this.selectedLoanArr, o => {
          return o == item.sn;
        });
        let selectId = _.find(this.fundsId.split(","), o => {
          return o == item.id;
        });
        console.log(this.fundsId);
        if (select) {
          this.selectedLoanArr = _.without(this.selectedLoanArr, select);
          let temp = _.without(this.fundsId.split(","), selectId);
          this.fundsId = temp.join(",");
        } else {
          this.selectedLoanArr.push(item.sn);
          if (this.fundsId) {
            this.fundsId += "," + item.id;
          } else {
            this.fundsId += item.id;
          }
        }
        console.log(this.fundsId);
      },
      addClass(sn) {
        for (const v of this.selectedLoanArr) {
          if (v == sn) {
            return "active";
          }
        }
      },
      getValue(val) {
        this.searchVal = val;
      },
      search(val) {
        this.searchVal = val;
        this.currentPage = 1;
        this.pageCount = 1;
        this.loanList = [];
        this.getData();
      },
      onPullingUp() {
        this.currentPage += 1;
        if (this.currentPage >= this.pageCount) {
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
        await _getData("financeFunds/IfPayedFundsList", {
          name: this.searchVal,
          currentPage: this.currentPage,
          countPerPage: "10"
        }).then(data => {
          console.log("借款单列表：：：", data);
          this.loanList = [...this.loanList, ...data.data];
          this.pageCount = data.totalPages;
          console.log(this.loanList);
        });
      }
    },
    components: { searchVue }
  };
</script>

<style lang="scss" scoped>
  @import "../../../../../static/scss/_commonScss";
  .fund-number {
    margin-top: 20px;
    h3 {
      display: flex;
      align-items: center;
      font-weight: bold;
      font-size: 15px;
      color: #222222;
      font-family: PingFangSC-Medium;
      &.detailDisabled {
        font-weight: 400;
      }
      img {
        width: 20px;
        height: 18px;
        margin-right: 10px;
      }
    }
    .select-loan-number {
      width: 100%;
      height: 46px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 0 3px 0 10px;
      background-color: #f8f8f8;
      border-radius: 5px;
      color: #aaa;
      font-size: 14px;
      margin-top: 10px;
      span {
        //padding: rem(3) 0;
        width: 310px;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        line-height: 18px;
        &.active {
          color: $font-high-light;
        }
      }
      img {
        height: 19px;
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
    }
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
      h2 {
        font-family: PingFangSC-Medium;
        font-size: 18px;
        color: #222222;
        display: flex;
        height: 100%;
        font-weight: bold;
        width: calc(100% - 88px);
        align-items: center;
        justify-content: center;
      }
    }
  }
  /deep/ .mu-dialog-body {
    // height: calc(100% - 44px);
    // min-height: calc(100% - 44px);
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
                    &.fundUse {
                      text-overflow: -o-ellipsis-lastline;
                      overflow: hidden;
                      text-overflow: ellipsis;
                      display: -webkit-box;
                      -webkit-line-clamp: 2;
                      line-clamp: 2;
                      -webkit-box-orient: vertical;
                    }
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
      // padding-top: 20px;
      .weui-btn {
        height: 40px;
        border-radius: 20px;
        background-color: $button-color;
        font-family: PingFangSC-Medium;
        font-size: 16px;
        color: #ffffff;
        font-weight: bold;
      }
    }
  }
</style>
