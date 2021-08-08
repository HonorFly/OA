<template>
  <div id="header" :class="createClass">
    <span class="back" @click="goPrev">
      <img v-show="showBack" src="../../../../assets/images/back.png" alt="" />
    </span>
    <h2>
      {{ name }}
    </h2>
    <span class="quit">
      <!-- <span v-if="isShowClose" @click="close">
        <img src="../../../../assets/images/close-special.png" />
      </span> -->
      <span
        v-if="
          type == 'details' &&
          userId == (data.addUser || data.applyUser) &&
          (data.status == 0 || data.status == 2 || data.status == 4)
        "
        @click="editHandle()"
      >
        编辑
      </span>
      <span v-if="isDelete" @click="delClick"> 删除 </span>
      <slot></slot>
    </span>
    <!-- <div class="placeholder"></div> -->
  </div>
</template>

<script>
  import { isBackNativePage } from "../../../../common/js/jsBridge";
  export default {
    data() {
      return { userId };
    },
    mounted() {
      //监听浏览器返回事件
      window.addEventListener(
        "popstate",
        (e) => {
          this.$store.commit("setTransition", "turn-off");
        },
        false
      );
    },
    created(){
      // console.log("3333:",this.showBack,this.judgeBack);
    },
    activated() {
      console.log(userId);
      // console.log("222:",this.showBack,this.judgeBack);
    },
    computed: {
      createClass() {
        if (this.$util.isAndroid()) {
          return "Android-header";
        } else {
          return "ios-header";
        }
      },
    },
    methods: {
      editHandle() {
        console.log(this.$route);
        this.$router.replace({
          path: this.$route.path,
          query: {
            ...this.$route.query,
            ...{ type: "apply", isApproval: false },
          },
        });
      },
      close() {
        isBackNativePage();
      },

      /**
       * fromNative 标识是否从原生页面进入oa页面
       * @description 此参数为原生跳转页面传入，代表入口来源，有两种参数选择
       * @params （1,2） 1 进入首页时传入，代表进入整个oa系统页面，2 进入OA某一特定页面时传入
       **/
      goPrev() {

        // console.log("111:",this.showBack,this.judgeBack);
        if(this.showBack){

             this.$emit("goPrev");
            if (!this.judgeBack) {
              alert("444:"+l)
              this.$router.back();
              this.$store.commit("setTransition", "turn-off");
              if (this.saveId) {
                this.$emit("changeSaveId", "");
              }
              if (this.editSelectId) {
                this.$emit("changeEditSelectId", "");
              }
              // if (
              //   this.$router.currentRoute.path == "/" ||
              //   this.$route.query.fromNative == 1 ||
              //   getUrlParam("fromNative") == 2
              // ) {
              //   isBackNativePage();
              // } else {
              //   this.$router.go(-1);
              //   this.$store.commit("setTransition", "turn-off");
              //   if (this.saveId) {
              //     this.$emit("changeSaveId", "");
              //   }
              //   if (this.editSelectId) {
              //     this.$emit("changeEditSelectId", "");
              //   }
              // }
            }
        }
      },
      delClick() {
        this.$emit("delClick");
      },
    },
    props: {
      name: { type: String, default: "" },
      isShowClose: { type: Boolean, default: false },
      status: { type: Number, default: 1 },
      data: {},
      showBack: {
        type: Boolean,
        default: true,
      },
      isDelete: {
        //是否显示删除按钮
        type: Boolean,
        default: false,
      },
      type: { type: String, default: "apply" },
      isApproval: { type: [Boolean, String], default: false },
      judgeBack: { type: Boolean, default: false },
    },
    watch:{
      showBack(newVal){
         alert("新值:",newVal)
      }
    }
  };
</script>

<style lang="scss" scoped>
  @import "../../../../../static/scss/_commonScss";

  #header {
    @include iphone-X-header;
    display: flex;
    align-items: center;
    justify-content: flex-start;
    background: #fff;

    .back {
      display: flex;
      align-items: center;
      height: 100%;
      width: 44px;
      img {
        height: 100%;
        width: 100%;
      }
    }
    .quit {
      height: 100%;
      display: flex;
      min-width: 44px;
      span {
        display: flex;
        align-items: center;
        height: 100%;
        padding-right: 13px;
        font-size: 14px;
        color: #222;
      }
      img {
        width: 20px;
        height: 20px;
      }
    }
    h2 {
      font-family: PingFangSC-Medium;
      font-size: 18px;
      color: #222222;
      display: flex;
      font-weight: bold;
      flex: 1;
      height: 100%;
      align-items: center;
      justify-content: center;
    }
    // .placeholder {
    //   height: 88px;
    //   // width: 10rem;
    // }
  }
</style>
