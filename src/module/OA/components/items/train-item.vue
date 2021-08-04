<template>
  <li class="dispatch-item" @click="handleClick(data)">
    <div class="main">
      <ul>
        <li>
          <span>课程名称</span><i>{{ data.title }}</i>
        </li>
        <li>
          <div class="leftLay">
            <span>培训类别</span><i>{{ data.trainType }}</i>
          </div>
          <div class="rightLay">
            <span>讲师</span><i>{{ data.trainTeacher }}</i>
          </div>
        </li>
        <li><span>课程说明</span><i v-html="data.content"></i></li>
        <li>
          <div class="leftLay">
            <span>开始时间</span><i>{{ data.trainFromTime }}</i>
          </div>
          <div class="rightLay">
            <span>结束时间</span><i>{{ data.trainEndTime }}</i>
          </div>
        </li>
      </ul>

      <!-- <item-status-vue :status="0"></item-status-vue> -->
    </div>
  </li>
</template>

<script>
  import { mapMutations } from "vuex";
  import itemStatusVue from "../common/itemStatus.vue";
  export default {
    data() {
      return {};
    },
    props: {
      showBtn: {
        //是否显示底部按钮
        type: Boolean,
        default: true,
      },
      data: {
        type: Object,
      },
      isApproval: {
        type: Boolean,
        default: false,
      },
      isShowfooterApproval: {
        type: Boolean,
        default: false,
      },
    },
    components: { itemStatusVue },
    methods: {
      ...mapMutations(["setTransition"]),
      handleClick({ id, courseware }) {
        this.setTransition("turn-on");
        this.$router.push({
          path: "/train-video",
          query: {
            url: courseware,
          },
        });
      },
    },
  };
</script>

<style lang="scss" scoped>
  @import "../../../../../static/scss/_commonScss";
  .dispatch-item {
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
      & > div.info {
        font-family: PingFangSC-Light;
        font-size: 13px;
        color: #fff;
        @include box_shadow_style;
        background-image: linear-gradient(222deg, #8aabff 0%, #4176ff 100%);
        display: flex;
        align-items: center;
        width: 86px;
        height: 30px;
        margin-top: 6px;
        justify-content: center;
        border-radius: 6px;
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
          div {
            width: 50%;
            display: flex;
            margin-right: 10px;
          }
          // .leftLay{
          //    width: 50%;
          // }
          // .leftLay{

          // }
          span {
            display: flex;
            width: 65px;
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
