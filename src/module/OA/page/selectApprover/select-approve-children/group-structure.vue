<template>
  <div id="group-structure">
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
          >{{ item.text }}
        </mu-breadcrumbs-item>
      </mu-breadcrumbs>
    </div>
    <ul>
      <router-link
        v-for="item in group"
        :key="item.id"
        tag="li"
        :to="{
          path: `/select-approver/${$route.params.index}/department`,
          query: {
            id: item.id,
            name: item.chinaName
          }
        }"
      >
        <div>
          {{ item.chinaName }}<span>({{ item.countUser }}人)</span>
        </div>
        <span
          ><img src="../../../../../assets/images/arrow-right.png" alt=""
        /></span>
      </router-link>
    </ul>
  </div>
</template>

<script>
  import { _getData } from "../../../service/getData";
  export default {
    data() {
      return {
        items: [
          {
            text: "集团架构",
            disabled: true
          }
        ],
        group: []
      };
    },
    created() {
      _getData("company/getApprover", { fullName: "" }).then(data => {
        console.log(data);
        this.group = data;
      });
    }
  };
</script>

<style lang="scss" scoped>
  @import "../../../../../../static/scss/_commonScss";
  #group-structure {
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
            width: 63px;
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
      height: calc(100% - 50px);
      overflow: auto;
      -webkit-overflow-scrolling: touch;
      &::-webkit-scrollbar {
        width: 0 !important;
      }
      li {
        display: flex;
        align-items: center;
        height: 55px;
        padding: 0 13px;
        border-bottom: 1px solid #f6f6f6;
        background: #fff;
        justify-content: space-between;
        > div {
          font-family: PingFangSC-Regular;
          font-size: 15px;
          color: #222222;
          > span {
            font-family: PingFangSC-Regular;
            font-size: 14px;
            color: #aaaaaa;
            margin-left: 5px;
          }
        }
        > span {
          display: flex;
          margin-right: -5px;
          > img {
            width: 18px;
            height: 19px;
          }
        }
        &:active {
          background: rgba(0, 0, 0, 0.08);
        }
      }
    }
  }
</style>
