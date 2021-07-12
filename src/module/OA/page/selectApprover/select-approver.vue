<template>
  <div id="select-approver">
    <header-vue name="选择审批人"></header-vue>
    <div class="container">
      <search-vue
        placeholder="快速搜索你的审批人"
        @onInput="onInput"
        @onSearch="onInput"
        @cancelSearch="cancelSearch"
        :defaultValue="searchVal"
        controlText="cancel"
      ></search-vue>
      <div class="content">
        <router-view></router-view>
      </div>
      <mu-dialog
        width="360"
        transition="slide-bottom"
        fullscreen
        :overlay="false"
        :open.sync="openFullscreen"
        :append-body="false"
      >
        <h2 v-show="userList.length > 0">联系人</h2>
        <div class="searchList">
          <ul>
            <li
              v-for="(item, i) in userList"
              :key="item.id"
              @click="selectWorker(i)"
            >
              <mu-avatar color="#4176FF">
                {{ item.fullName.substring(item.fullName.length - 2) }}
              </mu-avatar>
              <h2>
                {{ item.fullName }}<span>{{ item.position }}</span>
              </h2>
              <span :class="i === selectVal && 'active'"></span>
            </li>
          </ul>
          <div class="footer" @click="sureClick">
            <x-button>确定</x-button>
          </div>
        </div>
      </mu-dialog>
    </div>
  </div>
</template>

<script>
  import headerVue from "../../components/header/header.vue";
  import searchVue from "../../components/search/search.vue";
  import { _getData } from "../../service/getData";

  export default {
    data() {
      return {
        openFullscreen: false,
        items: [
          {
            text: "集团架构",
            disabled: false
          },
          {
            text: "网来天下",
            disabled: false
          },
          {
            text: "产品运营部",
            disabled: true
          }
        ],
        userList: [],
        selectVal: "",
        searchVal: ""
      };
    },
    activated() {
      console.log(111);
      this.searchVal = "";
      this.selectVal = "";
      this.openFullscreen = false;
    },
    methods: {
      cancelSearch() {
        this.openFullscreen = false;
      },
      sureClick() {
        // console.log(this.selectVal);
        // console.log(this.$route);
        if (this.selectVal !== "") {
          this.$route.query.selectWorker = JSON.stringify({
            checkUser: this.userList[this.selectVal].id,
            fullName: this.userList[this.selectVal].fullName
          });
          this.openFullscreen = false;
          if (this.$route.name == "同事列表") {
            this.$router.go(-3);
          } else if (this.$route.name == "部门列表") {
            this.$router.go(-2);
          } else if (this.$route.name == "集团架构") {
            this.$router.go(-1);
          }
        } else {
          this.$toast("请选择审批人");
          return;
        }
      },
      selectWorker(i) {
        this.selectVal = i;
      },
      onInput(val) {
        console.log(val);
        this.searchVal = val;
        if (val) {
          this.openFullscreen = true;
          this.searchData(val);
        } else {
          this.openFullscreen = false;
        }
      },
      async searchData(name) {
        await _getData("company/getApprover", { fullName: name }).then(data => {
          console.log(data);
          this.userList = [];
          _.map(data, o => {
            _.each(o.departmentList, v => {
              console.log(v);
              _.each(v.userList, item => {
                this.userList.push(item);
              });
            });
          });
          console.log(this.userList);
        });
      }
    },
    components: {
      headerVue,
      searchVue
    }
  };
</script>

<style lang="scss" scoped>
  @import "../../../../../static/scss/_commonScss";
  #select-approver {
    position: fixed;
    .container {
      padding: 0;
      overflow: hidden;

      .content {
        height: calc(100% - 55px);
        flex: 1;
        display: flex;
        flex-direction: column;
      }
    }
  }
  .mu-dialog-wrapper {
    height: calc(100% - 119px);
    top: 119px;
    @media only screen and (device-width: 375px) and (device-height: 812px) and (-webkit-device-pixel-ratio: 3),
      only screen and (device-width: 414px) and (device-height: 896px) and (-webkit-device-pixel-ratio: 2),
      only screen and (device-width: 414px) and (device-height: 896px) and (-webkit-device-pixel-ratio: 3) {
      height: calc(100% - 143px) !important;
      top: 143px !important;
    }

    /deep/ .mu-dialog {
      background-color: #f6f6f6;
      box-shadow: none;
      display: flex;
      flex-direction: column;
      .mu-dialog-body {
        height: 100%;
        background-color: #fff;
        border-top-left-radius: 8px;
        border-top-right-radius: 8px;
        display: flex;
        flex-direction: column;
        > h2 {
          font-size: 16px;
          height: 46px;
          line-height: 46px;
          padding-left: 13px;
          border-bottom: 1px solid #f5f5f5;
        }
      }
    }
    .searchList {
      flex: 1;
      overflow: auto;
      -webkit-overflow-scrolling: touch;
      display: flex;
      flex-direction: column;
      > ul {
        background: #f6f6f6;
        flex: 1;
        // height: calc(100% - 50px);
        overflow: auto;
        -webkit-overflow-scrolling: touch;
        &::-webkit-scrollbar {
          width: 0 !important;
        }
        li {
          padding: 0 13px;
          display: flex;
          height: 55px;
          align-items: center;
          position: relative;
          background: #fff;
          border-bottom: 1px solid #f6f6f6;
          .mu-avatar {
            height: 35px !important;
            width: 35px !important;
            /deep/ .mu-avatar-inner {
              font-family: PingFangSC-Regular;
              font-size: 13px;
              color: #ffffff;
            }
          }
          h2 {
            display: flex;
            flex-direction: column;
            font-family: PingFangSC-Regular;
            font-size: 15px;
            color: #222222;
            line-height: 21px;
            margin-left: 15px;
            span {
              font-family: PingFangSC-Regular;
              font-size: 12px;
              color: #aaaaaa;
              line-height: 17px;
            }
          }
          > span {
            height: 22px;
            width: 22px;
            display: flex;
            // box-sizing: content-box;
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
              background: url("../../../../assets/images/selected.png") no-repeat
                center;
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
      .footer {
        height: 50px;
        box-shadow: $base-box-shadow;
        display: flex;
        background: #fff;
        align-items: center;
        padding: 0 13px;
        @include iphone-X-footer;
        .weui-btn {
          height: 40px;
          border-radius: 20px;
          background: $button-color;
          font-family: PingFangSC-Regular;
          font-size: 15px;
          color: #ffffff;
          &::after {
            display: none;
          }
        }
      }
    }
  }
</style>
