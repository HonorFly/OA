<template>
  <li class="fixed-assets-item" @click="handleClick(data.id)">
    <div class="main">
      <h2>
        {{ data.fullName }} 提交的固定资产审批
        <span>{{ data.updateTime ? data.updateTime : data.addTime }}</span>
      </h2>
      <ul>
        <li>
          <span>申请总额</span>{{ data.money ? data.money + "元" : "--" }}
        </li>
        <li><span>固定资产名称</span>{{ data.wordBook || data.type }}</li>
        <li><span>规格型号</span>{{ data.standard ? data.standard : "--" }}</li>
        <li><span>申请数量</span>{{ data.num ? data.num : "--" }}</li>
      </ul>
      <div v-if="data.status != 0 && data.status != 9">
        <span></span>{{ data.statusName }}
      </div>
      <span>{{ data.bigCategoryName || data.bigType }}</span>
      <item-status-vue :status="data.status"></item-status-vue>
    </div>
    <item-footer-button-vue
      v-if="
        showBtn &&
          !isApproval &&
          data.status != 1 &&
          data.status != 3 &&
          data.status != 5 &&
          data.status != 7
      "
      :data="data"
      type="fixed"
    ></item-footer-button-vue>
    <footer-approve-button-vue
      v-if="isApproval && isShowfooterApproval"
      :data="data"
      type="fixed"
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
    mounted() {
      // console.log(this.isShowfooterApproval);
    },
    components: { itemFooterButtonVue, itemStatusVue, footerApproveButtonVue },
    methods: {
      ...mapMutations(["setTransition"]),
      handleClick(id) {
        this.setTransition("turn-on");
        this.$router.push({
          path: "/fixed-details",
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
  .fixed-assets-item {
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
        background-image: linear-gradient(59deg, #fb4354 0%, #fd788d 100%);
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
          font-weight: bold;
          color: #222222;
          font-weight: bold;
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
        }
      }
    }
  }
</style>
