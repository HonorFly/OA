<template>
  <div class="belong-project">
    <h3>
      <div class="text-title">
        <span>
          <img src="../../../../assets/images/view-project.png" width="20" />
        </span>
        所属项目
        <i v-if="$route.path == '/reimburse-details'">
          <img src="../../../../assets/images/red-star.png" />
        </i>
      </div>
      <span class="del-project" @click="delProject" v-if="type != 'details'">
        <img src="../../../../assets/images/del.png" />
        删除所属项目
      </span>
    </h3>
    <div
      class="select-project"
      @click="type != 'details' && (openFullscreen = true)"
    >
      <span :class="{ active: projectName }">
        {{ projectName ? projectName : "请选择所属项目" }}
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
          所属项目
        </h2>
      </div>
      <div class="mu-dialog-content">
        <search-vue
          @cancelSearch="openFullscreen = false"
          @onSearch="search"
        ></search-vue>
        <div class="list-content">
          <div class="select-company" @click="selectCompany">
            <h2>所属公司</h2>
            <span>{{ companyId ? companyName : "请选择所属公司" }}</span>
          </div>
          <cube-scroll
            ref="scroll"
            :options="options"
            @pulling-up="onPullingUp"
            :data="projectList"
            v-if="projectList.length > 0"
          >
            <ul>
              <li
                v-for="project in projectList"
                :key="project.id"
                @click="clickHandle(project)"
              >
                <div class="left-box">
                  <div>
                    <span>项目编号</span><span>{{ project.sn }}</span>
                  </div>
                  <div>
                    <span>项目名称</span><span>{{ project.itemName }}</span>
                  </div>
                  <div>
                    <span>负责人</span
                    ><span>{{ project.managerFullName }}</span>
                  </div>
                  <div>
                    <span>所属公司</span><span>{{ project.chinaName }}</span>
                  </div>
                </div>
                <div class="right-box">
                  <span
                    :class="{ active: currentProject.id == project.id }"
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
  export default {
    data() {
      return {
        openFullscreen: false,
        picker: null,
        selectedIndex: [0],
        searchVal: "",
        companyId: "",
        companyName: "",
        companyList: [],
        projectId: "",
        projectName: "",
        currentProject: this.project,
        scrollHeight: 0,
        currentPage: 1,
        projectList: [],
        options: {
          pullDownRefresh: false,
          pullUpLoad: {
            txt: { noMore: "全部数据加载完毕" },
            visible: true
          }
        }
      };
    },
    props: ["type", "project"],
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
        // console.log("sssssssssssss:::", newVal);
        if (!_.isEmpty(newVal)) {
          this.currentProject = newVal;
          this.projectName = newVal.itemName;
          this.projectId = newVal.itemId;
        }
      }
    },
    activated() {
      // console.log(this.$route.meta.isBack);
      if (!this.$route.meta.isBack) {
        _getData("company/companyList", {}).then(data => {
          console.log("公司列表：", data);
          data.unshift({ id: "", chinaName: "全部" });
          this.companyList = data;
        });
        this.scrollHeight = 0;
        this.searchVal = "";
        this.companyId = "";
        this.companyName = "";
        this.currentPage = 1;
        this.pageCount = 1;
        this.projectId = "";
        this.projectName = "";
        this.currentProject = {};
        this.projectList = [];
        this.getData();
      }
    },
    methods: {
      delProject() {
        this.currentProject = {};
        this.projectName = "";
        this.projectId = "";
      },
      sureHandle() {
        console.log(this.currentProject);
        // if (_.isEmpty(this.currentProject) && _.isEmpty(this.project)) {
        //   this.$toast("您未选择归属项目");
        //   return;
        // } else {
        this.openFullscreen = false;
        this.projectName = this.currentProject.itemName;
        this.projectId = this.currentProject.id;
        // }
      },
      clickHandle(project) {
        this.currentProject = project;
      },
      search(val) {
        this.searchVal = val;
        this.currentPage = 1;
        this.pageCount = 1;
        this.projectList = [];
        this.companyId = "";
        this.companyName = "";
        this.currentProject = {};
        this.getData();
      },
      selectCompany() {
        if (!this.picker) {
          this.picker = this.$createPicker({
            data: [this.companyList],
            alias: { value: "id", text: "chinaName" },
            selectedIndex: this.selectedIndex1,
            zIndex: 25000000,
            onSelect: (selectedVal, selectedIndex, selectedText) => {
              console.log(selectedText);
              if (selectedText == "全部") {
                this.companyId = "";
              } else {
                this.companyId = selectedVal[0];
              }
              this.companyName = selectedText.join("");
              this.selectedIndex = selectedIndex;
              this.currentPage = 1;
              this.pageCount = 1;
              this.projectList = [];
              this.currentProject = {};
              this.getData();
            },
            onCancel: () => {
              this.picker = null;
            }
          });
        }
        this.picker.show();
      },
      onPullingUp() {
        this.currentPage += 1;
        if (this.currentPage >= this.pageCount) {
          this.$refs.scroll.forceUpdate();
          return;
        }
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
      async getData() {
        await _getData("item/itemList", {
          companyId: this.companyId,
          name: this.searchVal,
          currentPage: this.currentPage,
          countPerPage: "10"
        }).then(data => {
          console.log("项目列表：：：", data);
          this.projectList = [...this.projectList, ...data.data];
          this.pageCount = data.totalPages;
        });
      }
    },
    components: { searchVue }
  };
</script>

<style lang="scss" scoped>
  @import "../../../../../static/scss/_commonScss";
  .belong-project {
    margin-top: 20px;
    h3 {
      display: flex;
      align-items: center;
      justify-content: space-between;
      font-size: 15px;
      color: #222222;
      .text-title {
        font-family: PingFangSC-Medium;
        font-weight: bold;
        display: flex;
        align-items: center;
        img {
          width: 20px;
          height: 18px;
          margin-right: 10px;
        }
        > i {
          font-family: PingFangSC-Regular;
          font-size: 14px;
          color: #999999;
          font-style: normal;
          img {
            width: 8px;
            height: 7px !important;
            margin-bottom: 6px;
            margin-left: 5px;
          }
        }
      }
      .del-project {
        display: flex;
        align-items: center;
        font-family: PingFangSC-Regular;
        font-size: 14px;
        color: #999999;
        img {
          width: 18px;
          height: 19px;
          margin-right: 5px;
        }
      }
      &.detailDisabled {
        img {
          opacity: 0.3;
        }
        .text-title {
          color: #666666;
          font-weight: normal;
        }
      }
    }
    .select-project {
      width: 100%;
      height: 46px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 0 3px 0 10px;
      background-color: #f8f8f8;
      color: #aaa;
      border-radius: 5px;
      font-size: 14px;
      margin-top: 10px;
      span {
        width: 310px;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        line-height: 18px;
        &.active {
          color: #222;
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
      width: 100%;
      flex: 1;
      flex-direction: column;
      overflow: hidden;
      display: flex;
      background-color: #f6f6f6;
      .list-content {
        flex: 1;
        overflow: hidden;
        display: flex;
        flex-direction: column;
        .select-company {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 0 3px 0 13px;
          height: 50px;
          background-color: #fff;
          border-bottom: 1px solid #f6f6f6;
          h2 {
            font-family: PingFangSC-Medium;
            font-size: 15px;
            color: #222222;
            font-weight: bold;
          }
          span {
            background: url("../../../../assets/images/arrow-right.png") no-repeat
              right center / 18px 19px;
            font-family: PingFangSC-Regular;
            font-size: 14px;
            color: #aaaaaa;
            padding-right: 23px;
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
      //position: absolute;
      bottom: 0;
      box-shadow: 0 2px 8px 0 rgba(0, 0, 0, 0.16);
      display: flex;
      align-items: center;
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
