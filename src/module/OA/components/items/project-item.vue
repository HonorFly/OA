<template>
  <li class="project-item" @click="handleClick(data.id)">
    <div class="main">
      <h2>
        {{ data.fullName }} 提交的{{ data.itemType || data.type }}项目审批
        <span>{{ data.addTime }}</span>
      </h2>
      <ul>
        <li>
          <span>项目名称</span><i>{{ data.itemName ? data.itemName : "--" }}</i>
        </li>
        <li>
          <span>所属公司</span><i>{{ data.chinaName }}</i>
        </li>
        <li>
          <span>成本中心</span>
          <i>{{
            data.costCenter || data.centerName
              ? data.costCenter || data.centerName
              : "--"
          }}</i>
        </li>
        <li>
          <span>佣金</span>
          <i>{{
            data.itemComm || data.money
              ? (data.itemComm || data.money) + "元"
              : "0元"
          }}</i>
        </li>
      </ul>
      <div><span></span>{{ data.statusName }}</div>
      <span>{{ data.itemType || data.type }}</span>
      <item-status-vue :status="data.status"></item-status-vue>
    </div>
    <!-- <item-footer-button-vue
      v-if="
        showBtn &&
          !isApproval &&
          data.status != 1 &&
          data.status != 3 &&
          data.status != 5 &&
          data.status != 7
      "
      :data="data"
      type="project"
    ></item-footer-button-vue> -->
    <footer-approve-button-vue
      v-if="isApproval && isShowfooterApproval"
      :data="data"
      type="project"
      @agreeOrRefuse="$emit('agreeOrRefuse')"
    ></footer-approve-button-vue>
  </li>
</template>

<script>
  import { mapMutations } from "vuex";
  import itemFooterButtonVue from "../footer/item-footer-button.vue";
  import footerApproveButtonVue from "../footer/footer-approve-button";
  import itemStatusVue from "../common/itemStatus.vue";
  export default {
    data() {
      return {};
    },
    props: {
      showBtn: {
        //是否显示底部按钮
        type: Boolean,
        default: true
      },
      data: {
        type: Object
      },
      isApproval: {
        type: Boolean,
        default: false
      },
      isShowfooterApproval: {
        type: Boolean,
        default: false
      }
    },
    components: { itemFooterButtonVue, itemStatusVue, footerApproveButtonVue },
    methods: {
      ...mapMutations(["setTransition"]),
      handleClick(id) {
        this.setTransition("turn-on");
        this.$router.push({
          path: "/project-details",
          query: {
            type: "details",
            id,
            isApproval: this.isApproval,
            isShowfooterApproval: this.isShowfooterApproval
          }
        });
      }
    }
  };
</script>

<style lang="scss" scoped>
  @import "../../../../../static/scss/_commonScss";
  .project-item {
    @include box_shadow_style;
    position: relative;
    display: flex;
    width: 100%;
    flex-direction: column;
    padding: 47px 0 0px;
    margin-bottom: 10px;
    overflow: hidden;
    &:last-child {
      margin-bottom: 0;
    }
    .main {
      padding: 0 13px;
      padding-bottom: 13px;
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
          background: url("../../../../assets/images/point.png") no-repeat center;
          background-size: 100% 100%;
          display: flex;
          height: 21px;
          width: 22px;
          margin-right: 2px;
          margin-left: -4px;
        }
      }
      & > span {
        // transform: scaleX(-1);
        background-image: linear-gradient(222deg, #8aabff 0%, #4176ff 100%);
        border-radius: 8px 0 8px 0;
        position: absolute;
        top: 0;
        //min-width: 54px;
        padding: 0 19px;
        height: 28px;
        left: 0;
        font-family: PingFangSC-Medium;
        font-size: 14px;
        color: #ffffff;
        font-weight: bold;
        display: flex;
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
          i {
            flex: 1;
            font-style: normal;
            line-height: 20px;
          }
        }
      }
    }

    .btn {
      display: flex;
      height: 50px;
      border-top: 1px solid #f6f6f6;
      align-items: center;
      //padding: 0 42px;
      justify-content: space-between;

      .weui-btn_default:not(.weui-btn_disabled):active {
        //color: rgba(0, 0, 0, 0.6);
        background: rgba($color: #000000, $alpha: 0.1);
      }
      /deep/ button.weui-btn {
        // width: 90px;
        height: 100%;
        // border-radius: 30px;
        border: 0;
        flex: 1;
        display: flex;
        align-items: center;
        justify-content: center;
        line-height: 50px;
        background: #fff;
        // border: 0.5px solid #f10215;
        font-family: PingFangSC-Medium;
        font-size: 14px;
        color: #666666;
        font-weight: bold;
        margin: 0;
        img {
          width: 18px;
          margin-right: 5px;
        }
        &::after {
          border: 0;
        }

        &:last-child {
          //   background: rgba(65, 118, 255, 0.06);
          //   border: 0.5px solid #4176ff;
          //   color: #4176ff;
        }
      }
    }
  }
</style>