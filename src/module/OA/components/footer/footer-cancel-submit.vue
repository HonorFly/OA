<template>
  <div
    class="footer-button footer"
    v-if="type != 'details' || data.status == 6"
  >
    <!-- v-if="type != 'details' || data.status == 1 || data.status == 6" 状态为1撤销，此功能暂时没有-->
    <x-button
      class="cancelBtn"
      type="primary"
      @click.native.stop="cancel"
      v-if="type == 'details' && data.status == 1"
    >
      <img src="../../../../assets/images/cancel.png" />
      撤销
    </x-button>
    <x-button
      class="cancelBtn"
      type="primary"
      @click.native.stop="returnFun"
      v-if="type == 'details' && data.status == 6"
    >
      <img src="../../../../assets/images/return.png" />
      归还
    </x-button>
    <x-button
      type="primary"
      @click.native.stop="submit"
      v-if="type != 'details'"
      :class="{ loadClass: loading }"
      :show-loading="loading"
      :disabled="loading"
    >
      提交
    </x-button>
  </div>
</template>

<script>
  export default {
    data() {
      return { loading: false };
    },
    props: ["data", "type", "submitFlag"],
    watch: {
      submitFlag(newVal) {
        console.log("submitFlag:::", newVal);
        if (newVal) {
          this.loading = false;
          this.$emit("submit", "submitFlag");
        }
      }
    },
    methods: {
      cancel() {
        this.$dialog
          .confirm({
            message: "确认撤销此条记录？",
            overlayStyle: {
              background: "rgba(0,0,0,0.30)"
            }
          })
          .then(() => {
            //撤销操作请求接口，成功以后改变数据状态
            this.data.status = 4;
            this.$route.query.status = 4;
            this.$router.go(-1);
          });
      },
      returnFun() {
        this.$dialog
          .confirm({
            message: "确认归还？",
            overlayStyle: {
              background: "rgba(0,0,0,0.30)"
            }
          })
          .then(() => {
            //撤销操作请求接口，成功以后改变数据状态
            this.data.status = 7;
            this.$route.query.status = 7;
            this.$toast("归还成功");
            this.$router.go(-1);
          });
      },
      submit() {
        this.loading = true;
        this.$emit("submit", "submit");
      }
    }
  };
</script>

<style lang="scss" scoped>
  @import "../../../../../static/scss/_commonScss";
  .footer {
    height: 50px;
    display: flex;
    align-items: center;
    background: #ffffff;
    border-top: 1px solid #f6f6f6;
    padding: 0 13px;
    @include iphone-X-footer;
    .weui-btn {
      height: 40px;
      display: flex;
      align-items: center;
      justify-content: center;
      background-color: $button-color;
      font-family: PingFangSC-Light;
      font-size: 14px;
      line-height: 40px;
      font-weight: bold;
      border-radius: 20px;
      // width: 90px;
      margin: 0 auto;
      &.cancelBtn {
        background-color: #fff;
        color: #666;
        padding: 0;
        height: 100%;
        font-family: PingFangSC-Medium;
        font-weight: bold;
        img {
          width: 17px;
          height: 16px;
          margin-right: 5px;
        }
      }
      &::after {
        display: none;
      }
      &.loadClass {
        opacity: 0.3;
      }
    }
  }
</style>