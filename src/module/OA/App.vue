<template>
  <div id="app" :class="createClass">
    <transition :name="$store.state.states">
      <keep-alive>
        <router-view v-if="isRouterAlive"></router-view>
      </keep-alive>
    </transition>
    <!-- <transition :name="$store.state.states" class="no-keep-alive">
      <router-view
        v-if="!$route.meta.keepAlive"
        key="no-keep-alive"
      ></router-view>
    </transition> -->
  </div>
</template>

<script>
  import { userInfo } from "os";
  export default {
    name: "app",
    provide() {
      //父组件中通过provide来提供变量，在子组件中通过inject来注入变量。
      return {
        reload: this.reload,
      };
    },

    data() {
      return { isRouterAlive: true };
    },
    computed: {
      createClass() {
        if (this.$util.isAndroid()) {
          return "Android";
        } else {
          return "ios";
        }
      },
    },
    methods: {
      reload() {
        this.isRouterAlive = false; //先关闭，
        this.$nextTick(() => {
          this.isRouterAlive = true; //再打开
        });
      },
    },
    mounted() {
      // var height = document.getElementById("app").clientHeight;
      // alert(height);
      //监听浏览器返回事件
      window.addEventListener(
        "popstate",
        (e) => {
          if (this.$route.params.path != "saveBtn") {
            this.$store.commit("setTransition", "turn-off");
          }
        },
        false
      );
      console.log(this.$router.currentRoute);
      // window.WebViewJavascriptBridge.registerHandler(
      //   "androidPhysicalBack",
      //   (data, responseCallback) => {
      //     if (
      //       this.$router.currentRoute.path == "/" ||
      //       this.$route.query.fromNative == 1 ||
      //       getUrlParam("fromNative") == 2
      //     ) {
      //       responseCallback({ isNativeBack: "true" });
      //     } else {
      //       this.$store.commit("setTransition", "turn-off");
      //       this.$router.back();
      //     }
      //   }
      // );
      //监听键盘收起事件
      window.addEventListener("focusout", () => {});
    },
  };
</script>

<style lang="scss">
  @import "../../../static/scss/_dialog";
  @import "../../../static/scss/_commonScss";
  // @import "../../../static/scss/_font";
  // body,
  // html {
  //   background: #4176ff;
  // }
  #app {
    height: 100%;

    //background: #4176ff;
    // position: relative;
    > div {
      display: flex;
      height: 100%;
      width: 100%;
      flex-direction: column;
      overflow: hidden;
    }
  }
  .container {
    padding: 0 13px;
    background: #f6f6f6;
    flex: 1;
    height: 0;
    // display: flex;
    // flex-direction: column;
    overflow: auto;
    overflow-x: hidden;
    -webkit-overflow-scrolling: touch;

    &::-webkit-scrollbar {
      width: 0 !important;
    }
  }
  .turn-on-enter {
    transform: translate3d(100%, 0, 0);
  }
  .turn-on-leave-to {
    transform: translate3d(-20%, 0, 0);
  }
  .turn-on-enter-active,
  .turn-on-leave-active {
    transition: transform 0.3s ease;
  }
  // .turn-on-enter-to{
  //    transform: translate3d(0, 0, 0);
  //  }
  .turn-off-enter {
    transform: translate3d(-20%, 0, 0);
  }
  .turn-off-leave-to {
    transform: translate3d(100%, 0, 0);
  }
  .turn-off-enter-active,
  .turn-off-leave-active {
    transition: transform 0.3s ease;
  }
  .turn-off-leave-active,
  .turn-on-enter-active {
    z-index: 9998;
  }
  .cube-popup-mask {
    //background-color: $overlay-color !important;
  }
  .van-overlay {
    background: $overlay-color !important;
  }
  .cube-picker-panel {
    .cube-picker-choose {
      background: #e9e9e9 !important;
      height: 46px !important;
      > span {
        height: 100%;
        line-height: 46px;
        font-family: PingFangSC-Regular;
        font-size: 14px;
        color: #4176ff;
        &.cube-picker-confirm {
        }
      }
    }
    .cube-picker-content {
      .cube-picker-wheel-wrapper {
        .cube-picker-wheel-item {
          font-family: PingFangSC-Regular;
          font-size: 16px;
          color: #222222;
        }
      }
    }
  }
  .cube-picker-title-group {
  }
  .cube-dialog {
    .cube-popup-container {
      -moz-transform: none;
      -webkit-transform: none;
      -o-transform: none;
      -ms-transform: none;
      transform: none;
      .cube-popup-content {
        -moz-transform: none;
        -webkit-transform: none;
        -o-transform: none;
        -ms-transform: none;
        transform: none;
        top: 50%;
        left: 13px;
        margin-top: -139.5px;
      }
      .cube-dialog-main {
        width: 345px;
        height: 279px;
        border-radius: 5px;
        // .cube-dialog-confirm {
        //   min-height: 115px;
        //   display: flex;
        //   flex-direction: column;
        .cube-dialog-btns {
          height: 50px;
          a {
            text-decoration: none;
            padding: 0;
            display: flex;
            height: 100%;
            justify-content: center;
            align-items: center;
            font-family: PingFangSC-Medium;
            font-weight: bold;
            font-size: 15px;
            color: #4176ff;
          }
        }
        .cube-dialog-title {
          margin: 32px 13px 21px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-family: PingFangSC-Medium;
          font-weight: bold;
          font-size: 16px;
          color: #333333;
          height: 22px;
          .my-title {
            height: 100%;
            line-height: 22px;
            font-weight: bold;
            span {
              color: #f10215;
              font-weight: bold;
            }
          }
        }
        .cube-dialog-content {
          height: 124px;
          padding: 0 20px;
          display: flex;
          align-items: center;
          justify-content: center;
          margin-bottom: 30px;
          -moz-transform: none;
          -webkit-transform: none;
          -o-transform: none;
          -ms-transform: none;
          transform: none;
          .cube-textarea-wrapper {
            width: 100%;
            height: 100%;
            // padding: 10px;
            border-radius: 5px;
            font-family: PingFangSC-Regular;
            font-size: 14px;
            color: #333333;
            .cube-textarea {
              background: #f6f6f6;
            }
            &.cube-textarea_active:after {
              border: 0;
            }
          }
          .van-cell {
            width: 100%;
            height: 100%;
            padding: 10px;
            background: #f6f6f6;
            border-radius: 5px;
            font-family: PingFangSC-Regular;
            font-size: 14px;
            color: #333333;
            // overflow-y: auto;
            .van-field__body {
              width: 100%;
              height: 100%;
              align-items: flex-start;
              overflow-y: scroll;
              .van-field__control {
                // height: 100%;
              }
            }
          }
        }
        // }
      }
    }
  }
  .dialog-screen-approval {
    background-color: transparent !important;
    .mu-dialog {
      background-color: transparent !important;
      display: flex;
      align-items: center;
      justify-content: center;
      box-shadow: none;
      .mu-dialog-body {
        width: 345px;
        height: 279px;
        border-radius: 5px;
        background-color: #fff;
        .title {
          margin: 32px 13px 21px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-family: PingFangSC-Medium;
          font-weight: bold;
          font-size: 16px;
          color: #333333;
          height: 22px;
          line-height: 22px;
          font-weight: bold;
          span {
            color: #f10215;
            font-weight: bold;
          }
        }
        .content {
          height: 124px;
          margin: 0 20px 30px;
          .van-cell {
            width: 100%;
            height: 100%;
            padding: 10px;
            background: #f6f6f6;
            border-radius: 5px;
            font-family: PingFangSC-Regular;
            font-size: 14px;
            color: #333333;
            .van-field__body {
              width: 100%;
              height: 100%;
              align-items: flex-start;
              .van-field__control {
                height: 100%;
              }
            }
          }
        }
        .btnBox {
          width: 100%;
          height: 50px;
          display: flex;
          align-items: center;
          background-color: #fff;
          border-top: 1px solid #f6f6f6;
          .weui-btn {
            flex: 1;
            height: 100%;
            margin-top: 0;
            font-family: PingFangSC-Medium;
            font-size: 15px;
            color: #4176ff;
            font-weight: bold;
            background-color: #fff;
            &:after {
              border-radius: 0;
              border: none;
            }
            &:first-child {
              border-right: 1px solid #f6f6f6;
            }
          }
        }
      }
    }
  }

  .van-toast {
    z-index: 10000 !important;
  }
  .van-dialog {
    height: auto !important;
  }
  .vux-loading {
    .weui-mask_transparent {
      // background: rgba($color: #000000, $alpha: 0.2);
    }
    .weui-toast {
      top: 50%;
      margin-top: -3.8em;
      // /* background: url("../../../static/images/home_loading.gif") no-repeat
      //                                                                                                                   center;
      //                                                                                                               background-size: 100px 100px;
      //                                                                                                               i {
      //                                                                                                                   display: none;
      //                                                                                                               }
      //                                                                                                               p {
      //                                                                                                                   display: none;
      //                                                                                                               } */
    }
  }
  .cube-scroll-content {
    .cube-pullup-wrapper {
      .before-trigger {
        font-size: 13px;
        color: #999999;
        font-family: PingFangSC-Regular;
        padding: 15px 0;
      }
      .after-trigger {
        padding: 12.5px 0;
        .cube-loading {
          font-size: 18px;
        }
      }
    }
  }
</style>
