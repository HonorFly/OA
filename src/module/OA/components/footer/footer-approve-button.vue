<template>
  <div class="footer-button footer">
    <x-button
      type="primary"
      action-type="button"
      @click.native.stop="clickHandle(0)"
    >
      拒绝
    </x-button>
    <x-button
      type="primary"
      action-type="button"
      @click.native.stop="clickHandle(1)"
    >
      同意
    </x-button>
    <mu-dialog
      width="360"
      transition="slide-bottom"
      fullscreen
      :overlay="true"
      :open.sync="openFullscreen"
      class="dialog-screen-approval"
      scrollable
    >
      <div class="title">
        {{ i == 0 ? "拒绝" : "同意" }}
        <span>{{ data.fullName }}</span>
        提交的{{ text }}审批
      </div>
      <div class="content">
        <van-field
          type="textarea"
          rows="4"
          v-model="value"
          :placeholder="`请输入${i == 1 ? '评论' : '拒绝原因'}`"
        />
      </div>
      <div class="btnBox">
        <x-button
          type="primary"
          action-type="button"
          @click.native.stop="openFullscreen = false"
        >
          取消
        </x-button>
        <x-button type="primary" action-type="button" @click.native.stop="sure">
          确定
        </x-button>
      </div>
    </mu-dialog>
  </div>
</template>

<script>
  import { mapMutations } from "vuex";
  import { _getData } from "../../service/getData";
  import { iosKeyboard } from "../mixins/mixins";

  export default {
    data() {
      return { value: "", openFullscreen: false, i: 0, text: "" };
    },
    props: ["data", "type"],
    mixins: [iosKeyboard],
    methods: {
      ...mapMutations(["setTransition"]),
      sure() {
        switch (this.type) {
          case "fixed":
            this.approvalData("fixedAssets/fixedAssetsAudit", "assetsId", 3);
            break;
          case "reimburse":
            this.approvalData("billApply/billApplyAudit", "billApplyId", 1);
            break;
          case "fund":
            this.approvalData("financeFunds/fundsAudit", "fundsId", 2);
            break;
          case "useChapter":
            this.approvalData("seal/sealAudit", "id", 4);
            break;
          case "stampChapter":
            this.approvalData("borrow/borrowAudit", "id", 5);
            break;
          case "qualification":
            this.approvalData("license/licenseAudit", "id", 6);
            break;
          case "project":
            this.approvalData("item/itemAudit", "itemId", 7);
            break;
        }
        this.openFullscreen = false;
      },
      clickHandle(i) {
        switch (this.type) {
          case "fixed":
            this.text = "固定资产";
            break;
          case "reimburse":
            this.text = "报销";
            break;
          case "useChapter":
            this.text = "盖章";
            break;
          case "stampChapter":
            this.text = "借章";
            break;
          case "fund":
            this.text = "款项";
            break;
          case "qualification":
            this.text = "资质";
            break;
          case "project":
            this.text = "项目";
            break;
        }
        this.openFullscreen = true;
        this.i = i;
      },
      async approvalData(url, key, module) {
        let toast = this.$toast.loading({
          message: "提交中...",
          duration: 0,
          forbidClick: true
        });
        await _getData(url, {
          [key]: this.data.id,
          checkId: this.data.checkEntity
            ? this.data.checkEntity.id
            : this.data.fundsCheck
            ? this.data.fundsCheck.id
            : this.data.checkId
            ? this.data.checkId
            : "",
          checkNote: this.value,
          checkState: this.i == 1 ? "consent" : "refuse"
        })
          .then(data => {
            toast.clear();
            return data;
          })
          .then(data => {
            console.log("审批结果", data);
            if (data != "审核成功") {
              this.$toast("审批失败");
              return;
            } else {
              this.$toast("审批完成");
              _getData("send/sendMessage", {
                module: module,
                id: this.data.id,
                checkState: this.i == 1 ? "consent" : "refuse"
              }).then(res => {
                console.log(res);
              });
            }

            if (
              this.$route.path.indexOf("approval") != -1 ||
              this.$route.path == "/backlog"
            ) {
              this.$emit("agreeOrRefuse");
            } else {
              // if (getUrlParam("fromNative") == 2) {
              //   this.$route.query.approved = true;
              //   isBackNativePage();
              // } else {
              // alert(getUrlParam("fromNative"));
              // alert(this.$route);
              this.$route.query.approved = true;
              this.$router.go(-1);
              // }
            }
          });
      }
    }
  };
</script>

<style lang="scss" scoped>
  @import "../../../../../static/scss/_commonScss";
  @import "../../../../../static/scss/_dialog";

  // /deep/ .cube-dialog-fade-enter {
  //   opacity: 0 !important;
  // }

  // /deep/ .cube-dialog-fade-enter-to {
  //   opacity: 1 !important;
  // }

  .footer {
    height: 60px;
    display: flex;
    align-items: center;
    background: #ffffff;
    border-top: 1px solid #f6f6f6;
    .weui-btn {
      height: 32px;
      display: flex;
      align-items: center;
      justify-content: center;
      background-color: $button-color;
      font-family: PingFangSC-Light;
      font-size: 14px;
      line-height: 32px;
      font-weight: bold;
      border-radius: 20px;
      width: 90px;
      margin: 0 auto;
      &:first-child {
        background: rgba(241, 2, 21, 0.06);
        color: #f10215;
        border: 1px solid #f10215;
      }
      &:last-child {
        color: #4176ff;
        background: rgba(65, 118, 255, 0.06);
        border: 1px solid #4176ff;
      }
      &::after {
        display: none;
      }
    }
  }
</style>
