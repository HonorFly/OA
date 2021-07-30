<template>
  <div class="footer-button footer">
    <div>
      <x-button type="primary" @click.native="$emit(`submit`)"> 保存 </x-button>
      <!-- <x-button type="primary" @click.native="$emit('footButton', 'approver')">
        下一步：选择审批人
      </x-button> -->
    </div>
  </div>
</template>

<script>
  export default {
    data() {
      return {};
    },
    props: ["type", "status"],
  };
</script>

<style lang="scss" scoped>
  @import "../../../../../static/scss/_commonScss";
  @import "../../../../../static/scss/_dialog";
  .footer {
    height: 50px;
    display: flex;
    align-items: center;
    justify-content: flex-end;

    background: #ffffff;
    @include iphone-X-footer;
    > div {
      width: 100%;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 0 13px;
      height: 100%;
      &.revocation-box {
        &:active {
          background: $button-active-color;
          > .revocation {
            background: transparent;
          }
        }
      }
    }
    .weui-btn {
      margin-top: 0;
      height: 40px;
      display: flex;
      align-items: center;
      justify-content: center;
      background-color: $button-color;
      font-family: PingFangSC-Medium;
      font-size: 16px;
      color: #ffffff;
      font-weight: bold;
      line-height: 40px;
      font-weight: bold;
      border-radius: 20px;
      &:active {
      }
      // &:first-child {
      //   background: #ffffff;
      //   color: #f10215;
      //   border: 1px solid #f10215;
      //   margin-right: 10px;
      //   width: 100px;
      // }
      // &:last-child {
      //   width: 212px;
      //   margin: 0;
      //   background: #f10215;
      // }
      &::after {
        display: none;
      }
      &.revocation {
        height: 100%;
        width: 100%;
        background: #fff;
        border: none;
        font-family: PingFangSC-Medium;
        font-size: 14px;
        color: #666666;
        font-weight: bold;
        padding: 0;
        img {
          height: 16px;
          margin-right: 5px;
        }
      }
    }
  }
</style>
