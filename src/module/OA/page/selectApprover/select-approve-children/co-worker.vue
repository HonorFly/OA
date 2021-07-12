<template>
  <div id="co-worker">
    <div class="head">
      <mu-breadcrumbs divider="—">
        <!-- <mu-icon value="chevron_right" slot="divider"></mu-icon> -->
        <img
          slot="divider"
          src="../../../../../assets/images/arrow-right.png"
          alt=""
        />
        <mu-breadcrumbs-item
          v-for="item in items"
          :key="item.text"
          :disabled="item.disabled"
          @click.native="!item.disabled && goPre(item.index)"
          >{{ item.text }}</mu-breadcrumbs-item
        >
      </mu-breadcrumbs>
    </div>
    <ul>
      <li v-for="(item, i) in userList" :key="item.id" @click="selectWorker(i)">
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
</template>

<script>
  import { _getData } from "../../../service/getData";
  import _ from "lodash";
  export default {
    data() {
      return {
        selectVal: "",
        items: [
          {
            text: "集团架构",
            disabled: false,
            index: 0
          },
          {
            text: this.$route.query.groupName,
            disabled: false,
            index: 1
          },
          {
            text: this.$route.query.name,
            disabled: true
          }
        ],
        userList: []
      };
    },
    created() {
      _getData("company/getApprover", {}).then(data => {
        console.log(data);
        this.userList = _.filter(
          _.filter(data, o => {
            return o.id == this.$route.query.groupId;
          })[0].departmentList,
          o => {
            return o.id == this.$route.query.id;
          }
        )[0].userList;
        console.log(this.userList);
      });
    },
    methods: {
      sureClick() {
        console.log(this.selectVal);
        // console.log(this.userList[this.selectVal]);
        // console.log(this.$route);
        if (this.selectVal !== "") {
          this.$route.query.selectWorker = JSON.stringify({
            checkUser: this.userList[this.selectVal].id,
            fullName: this.userList[this.selectVal].fullName
          });
          this.$router.go(-3);
        } else {
          this.$toast("请选择审批人");
          return;
        }
      },
      selectWorker(i) {
        this.selectVal = i;
      },
      goPre(index) {
        if (index == 0) {
          this.$router.go(-2);
        } else {
          this.$router.go(-1);
        }
      }
    }
  };
</script>

<style lang="scss" scoped>
  @import "../../../../../../static/scss/_commonScss";

  #co-worker {
    flex: 1;
    height: 0;
    display: flex;
    flex-direction: column;
    .head {
      /deep/ .mu-breadcrumbs {
        padding: 10px 13px;
        background: #fff;

        li.mu-breadcrumbs-item {
          a {
            font-family: PingFangSC-Medium;
            font-size: 15px;
            color: #f10215;
            font-weight: bold;
            display: block;
            max-width: 80px;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
            padding: 2px 0;
          }
          &.is-disabled a {
            font-family: PingFangSC-Regular;
            font-size: 15px;
            color: #666;
            font-weight: 500;
          }
        }
        li.mu-breadcrumbs-divider {
          padding: 0 8px;
          > img {
            width: 18px;
          }
        }
      }
    }
    > ul {
      background: #f6f6f6;
      padding-top: 10px;
      // display: flex;
      // flex-direction: column;
      flex: 1;
      height: calc(100% - 100px);
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
            background: url("../../../../../assets/images/selected.png") no-repeat
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
</style>
