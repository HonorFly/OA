<template>
  <div id="item-footer-button">
    <x-button
      v-if="data.status == 0 || data.status == 4"
      @click.native.stop="del"
    >
      <img src="../../../../assets/images/del.png" />删除
    </x-button>
    <x-button
      v-if="data.status == 2 || data.status == 4"
      @click.native.stop="edit"
    >
      <img src="../../../../assets/images/submit.png" />重新编辑
    </x-button>
    <x-button v-if="data.status == 0" @click.native.stop="edit">
      <img src="../../../../assets/images/edit.png" />编辑
    </x-button>
    <!-- <x-button v-if="data.status == 1" @click.native.stop="cancel">
      <img src="../../../../assets/images/cancel.png" />撤销
    </x-button> -->
    <x-button v-if="data.status == 6" @click.native.stop="returning">
      <img src="../../../../assets/images/return.png" />归还
    </x-button>
  </div>
</template>

<script>
  import { mapMutations } from "vuex";
  import _ from "lodash";
  import { _getData } from "../../service/getData";
  export default {
    data() {
      return {};
    },
    props: {
      data: {
        type: Object
      },
      type: {
        type: String
      }
    },
    methods: {
      ...mapMutations(["setTransition"]),
      del() {
        this.$dialog
          .confirm({
            message: "确认删除此条记录？",
            overlayStyle: {
              background: "rgba(0,0,0,0.30)"
            }
          })
          .then(() => {
            switch (this.type) {
              case "fixed":
                this.operatingData("fixedAssets/deleteAssets");
                break;
              case "reimburse":
                this.operatingData("billApply/deleteBillApply");
                break;
              case "fund":
                this.operatingData("financeFunds/deleteFunds");
                break;
              case "useChapter":
                this.operatingData("seal/deleteSeal");
                break;
              case "stampChapter":
                this.operatingData("borrow/deleteBorrow");
                break;
            }
            var index = _.indexOf(
              this.$parent.$parent.$parent.$parent.$parent.$parent.recordList,
              this.data
            );
            console.log(index);
            this.$delete(
              this.$parent.$parent.$parent.$parent.$parent.$parent.recordList,
              index
            );
          });
      },
      edit() {
        this.setTransition("turn-on");
        switch (this.type) {
          case "reimburse":
            this.$router.push({
              path: "/reimburse-details",
              query: {
                type: "edit",
                id: this.data.id,
                reimburseName: this.data.type
              }
            });
            break;
          case "fixed":
            this.$router.push({
              path: "/fixed-details",
              query: { type: "edit", id: this.data.id }
            });
            break;
          case "useChapter":
            this.$router.push({
              path: "/useChapter-details",
              query: { type: "edit", id: this.data.id }
            });
            break;
          case "stampChapter":
            this.$router.push({
              path: "/stampChapter-details",
              query: { type: "edit", id: this.data.id }
            });
            break;
          case "qualification":
            this.$router.push({
              path: "/qualificationLoan-details",
              query: { type: "edit", id: this.data.id }
            });
            break;
          case "fund":
            this.$router.push({
              path: "/fund-details",
              query: {
                type: "edit",
                id: this.data.id,
                fundName: this.data.type ? "对公借款" : "个人借款"
              }
            });
            break;
        }
      },
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
          });
      },
      operatingData(url) {
        _getData(url, { id: this.data.id });
      },
      returning() {
        this.$dialog
          .confirm({
            message: "确认归还？",
            overlayStyle: {
              background: "rgba(0,0,0,0.30)"
            }
          })
          .then(() => {
            if (this.type == "stampChapter") {
              // 调接口
            } else if (this.type == "qualification") {
              // 调接口
            }
            this.$toast("归还成功");
            this.data.status = 7;
          });
      }
    }
  };
</script>

<style lang="scss" scoped>
  @import "../../../../../static/scss/_commonScss";
  @import "../../../../../static/scss/_dialog";
  #item-footer-button {
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
</style>