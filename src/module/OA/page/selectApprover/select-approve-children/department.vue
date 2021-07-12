<template>
  <div id="department">
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
          event="click"
          @click.native="!item.disabled && $router.back()"
          >{{ item.text }}</mu-breadcrumbs-item
        >
      </mu-breadcrumbs>
    </div>
    <ul>
      <router-link
        tag="li"
        :to="{
          path: 'co-worker',
          query: {
            groupId: $route.query.id,
            groupName: $route.query.name,
            id: item.id,
            name: item.depName
          }
        }"
        v-for="item in department"
        :key="item.id"
      >
        <div>
          {{ item.depName }}<span>({{ item.userList.length }}人)</span>
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
  import _ from "lodash";
  export default {
    data() {
      return {
        items: [
          {
            text: "集团架构",
            disabled: false
          },
          {
            text: this.$route.query.name,
            disabled: true
          }
        ],
        department: []
      };
    },
    created() {
      _getData("company/getApprover", {}).then(data => {
        console.log(data);
        this.department = _.filter(data, o => {
          return o.id == this.$route.query.id;
        })[0].departmentList;
        console.log(this.department);
      });
    },
    methods: {
      goPre() {}
    }
  };
</script>

<style lang="scss" scoped>
  @import "../../../../../../static/scss/_commonScss";
  #department {
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
      // display: flex;
      // flex-direction: column;
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
