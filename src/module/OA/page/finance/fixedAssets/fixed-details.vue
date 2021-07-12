<template>
  <div id="fixed-details">
    <header-vue
      :type="type"
      :data="details"
      :judgeBack="judgeBack"
      @goPrev="goPrev"
    ></header-vue>
    <div class="container" ref="container">
      <div class="top">
        <h2 v-if="type == 'apply' || type == 'edit'">固定资产申请</h2>
        <steps-vue
          v-else
          :stepData="details"
          title="的固定资产申请"
        ></steps-vue>
        <div class="assetName">
          <h3 class="special">
            <div class="other">
              <span>
                <img
                  src="../../../../../assets/images/fixed-assets.png"
                  width="21"
                  height="19"
                  alt=""
                  style="height:19px;"
                />
              </span>
              <i>
                固定资产名称
                <img src="../../../../../assets/images/red-star.png" />
              </i>
            </div>
            <div class="asset-name">
              <img src="../../../../../assets/images/daily-tariff.png" alt="" />
              {{ assetName }}
            </div>
          </h3>
          <cost-type-vue
            :costTypeArr="btn"
            :ButtonText="buttonText"
            :isShowTitle="false"
            :isDisabled="type == 'details' ? false : true"
            @btnHundleClick="getSelectValue"
          ></cost-type-vue>
        </div>
        <div class="specificationModel">
          <h3>
            <span>
              <img
                src="../../../../../assets/images/equipment-model.png"
                width="20"
                alt=""
              />
            </span>
            规格型号
            <i><img src="../../../../../assets/images/red-star.png"/></i>
          </h3>
          <van-field
            type="textarea"
            :class="{
              errorFocus: standardFlag && !details.standard,
              selected: details.standard
            }"
            ref="standard"
            v-model.trim="details.standard"
            placeholder="请输入规格型号"
            :disabled="type == 'details'"
            autosize
            rows="1"
          />
        </div>
        <div class="applyNumber">
          <h3>
            <span>
              <img src="../../../../../assets/images/apply-number.png" alt="" />
            </span>
            申请数量
            <i><img src="../../../../../assets/images/red-star.png"/></i>
          </h3>
          <van-stepper v-if="type != 'details'" v-model.trim="number" />
          <span v-else>{{ number }}</span>
        </div>
        <div class="money">
          <h3>
            <span>
              <img src="../../../../../assets/images/money.png" alt="" />
            </span>
            预计金额
            <i><img src="../../../../../assets/images/red-star.png"/></i>
          </h3>
          <van-field
            :class="{
              errorFocus: moneyFlag && !details.money,
              selected: details.money
            }"
            ref="money"
            v-model.trim="details.money"
            type="number"
            placeholder="请输入金额"
            @input="handleValue"
            :disabled="type == 'details'"
          />
        </div>
        <div class="useTime">
          <h3>
            <span>
              <img src="../../../../../assets/images/time.png" alt="" />
            </span>
            预计使用时间
            <i><img src="../../../../../assets/images/red-star.png"/></i>
          </h3>
          <van-cell-group>
            <van-field
              id="date"
              :class="{
                errorFocus: dateFlag && !dateValue,
                selected: dateValue
              }"
              v-model.trim="dateValue"
              placeholder="请选择日期"
              disabled
              @click="type != 'details' && calendar()"
            >
              <span slot="right-icon">
                <img src="../../../../../assets/images/calendar.png" alt="" />
              </span>
            </van-field>
          </van-cell-group>
        </div>
        <div class="usePerson">
          <h3>
            <span>
              <img src="../../../../../assets/images/use-person.png" alt="" />
            </span>
            使用人
            <i><img src="../../../../../assets/images/red-star.png"/></i>
          </h3>
          <van-field
            :class="{
              errorFocus: personFlag && !details.person,
              selected: details.person
            }"
            ref="person"
            v-model.trim="details.person"
            placeholder="请输入使用人姓名"
            :disabled="type == 'details'"
          />
        </div>
        <div class="applyReason">
          <h3>
            <span>
              <img src="../../../../../assets/images/explain.png" alt="" />
            </span>
            申请原因
            <i><img src="../../../../../assets/images/red-star.png"/></i>
          </h3>
          <van-field
            :class="{
              errorFocus: noteFlag && !details.note,
              selected: details.note
            }"
            ref="note"
            v-model="details.note"
            placeholder="请输入申请原因"
            type="textarea"
            autosize
            rows="1"
            :disabled="type == 'details'"
          />
        </div>
        <div class="totalMoney">申请费用为“ {{ details.money }} ”元</div>
      </div>
    </div>

    <footer-button-vue
      v-if="type != 'details' && (!isApproval || isApproval == 'false')"
      @footButton="footButton"
      :status="details.status"
    ></footer-button-vue>
    <footer-approve-button-vue
      v-if="isApproval && isShowfooterApproval"
      :data="details"
      type="fixed"
    ></footer-approve-button-vue>
  </div>
</template>

<script>
  import headerVue from "../../../components/header/header.vue";
  import footerButtonVue from "../../../components/footer/footer-button.vue";
  import footerApproveButtonVue from "../../../components/footer/footer-approve-button";
  import stepsVue from "../../../components/common/steps.vue";
  import costTypeVue from "../../../components/common/cost-type.vue";
  import { _getData } from "../../../service/getData";
  import _ from "lodash";
  import { mapMutations } from "vuex";
  import { iosKeyboard } from "../../../components/mixins/mixins";
  import { isBackNativePage } from "../../../../../common/js/jsBridge";

  export default {
    data() {
      return {
        btn: [],
        assetImgUrl: "", //固定资产的图片
        details: {},
        isClick: false,
        picker1: null,
        datePicker: null,
        assetName: "请选择固定资产名称",
        parentAssetId: 0, //大资产名称id
        assetId: 0, //小资产名称ID
        dateValue: "", //日期
        number: "", //申请数量
        usePersonValue: "", //使用人
        applyReasonvalue: "", //申请原因
        selectDate: "",
        buttonText: "",
        srcollTop: 0,
        isShowfooterApproval: false,
        standardFlag: false, //规格参数判断是否填写值
        moneyFlag: false, //预计金额判断是否填写值
        personFlag: false, //申请人判断是否填写值
        noteFlag: false, //申请原因判断是否填写值
        dateFlag: false, //预计使用时间判断是否填写值
        judgeBack: false
      };
    },
    props: ["type", "isApproval"],
    mixins: [iosKeyboard],
    beforeRouteEnter(to, from, next) {
      if (from.path == "/select-approver-list") {
        to.meta.isBack = true;
      } else {
        to.meta.isBack = false;
      }
      next(vm => {
        vm.$refs.container.scrollTop = vm.scrollTop;
      });
    },
    beforeRouteLeave(to, from, next) {
      if (to.path == "/select-approver-list") {
        this.scrollTop = this.$refs.container.scrollTop;
      } else {
        this.scrollTop = 0;
      }
      next();
    },
    watch: {
      type(newVal) {
        if (newVal != "details") {
          this.judgeBack = true;
        }
      }
    },
    activated() {
      if (!this.$route.meta.isBack) {
        this.scrollTop = 0;
        this.details = {};
        this.btn = [];
        this.selectDate = "";
        this.dateValue = "";
        this.buttonText = "";
        this.number = 1;
        this.isShowfooterApproval = false;
        this.standardFlag = false;
        this.moneyFlag = false;
        this.personFlag = false;
        this.noteFlag = false;
        this.dateFlag = false;
        this.judgeBack = false;
        switch (this.type) {
          case "details":
            this.getDetailInfo().then(() => {
              this.getAssetName(this.parentAssetId);
            });
            break;
          case "edit":
            this.getDetailInfo().then(() => {
              this.getAssetName(this.parentAssetId);
            });
            this.judgeBack = true;
            break;
          default:
            this.assetImgUrl = this.$route.query.assetImgUrl;
            this.assetName = this.$route.query.assetName;
            this.parentAssetId = this.$route.query.assetId;
            this.getAssetName(this.parentAssetId);
            this.judgeBack = true;
            break;
        }
      }
    },
    methods: {
      ...mapMutations(["setTransition"]),
      goPrev() {
        if (this.type != "details") {
          this.$dialog
            .confirm({
              message: "您填的内容没保存,确定返回吗?",
              overlayStyle: {
                background: "rgba(0,0,0,0.30)"
              }
            })
            .then(() => {
              this.$store.commit("setTransition", "turn-off");
              if (getUrlParam("fromNative") == 2) {
                isBackNativePage();
              } else {
                this.$router.go(-1);
              }
            })
            .catch(() => {
              this.$dialog.close();
            });
        }
      },
      footButton(val) {
        // console.log(val);
        // console.log(this.details);
        // console.log(_.isEmpty(this.details));
        if (_.isEmpty(this.details)) {
          this.details = { standard: "", money: "", person: "", note: "" };
        }
        this.details = {
          ...this.details,
          id: this.$route.query.id || "",
          assetsId: this.assetId,
          num: this.number,
          time: this.dateValue,
          billCheckList: this.details.billApplyCheckEntityList || [],
          checkUsers: "",
          status: 8
        };
        if (val == "cancel") {
        } else if (val == "save") {
          _getData("fixedAssets/saveFixedAssets", this.details).then(data => {
            console.log("保存：", data);
            this.$route.params.path = "saveBtn";
            this.$toast("保存成功");
            this.$router.go(-1);
          });
        } else {
          console.log(this.details);
          if (!this.details.standard) {
            this.standardFlag = true;
            this.$refs.standard.focus();
            return;
          } else {
            this.standardFlag = false;
          }
          if (!this.details.money) {
            this.moneyFlag = true;
            this.$refs.money.focus();
            return;
          } else {
            this.moneyFlag = false;
          }
          if (this.dateValue == "") {
            this.dateFlag = true;
            document.getElementById("date").scrollIntoView();
            return;
          } else {
            this.dateFlag = false;
          }
          if (!this.details.person) {
            this.personFlag = true;
            this.$refs.person.focus();
            return;
          } else {
            this.personFlag = false;
          }
          if (!this.details.note) {
            this.noteFlag = true;
            this.$refs.note.focus();
            return;
          } else {
            this.noteFlag = false;
          }
          this.$router.push({
            path: "/select-approver-list",
            query: { type: "fixed", details: JSON.stringify(this.details) }
          });
        }
        this.setTransition("turn-on");
      },
      handleValue() {
        if (this.details.money.indexOf(".") != -1) {
          this.details.money = this.details.money.substr(
            0,
            this.details.money.indexOf(".") + 3
          );
        }
      },
      getSelectValue(item) {
        console.log(item);
        this.assetId = item.id;
      },
      calendar() {
        if (!this.datePicker) {
          this.datePicker = this.$createDatePicker({
            min: new Date(2019, 7, 8),
            max: new Date(2029, 12, 31),
            value: this.selectDate || new Date(),
            onSelect: (date, selectedVal, selectedText) => {
              // console.log(date);
              this.selectDate = date;
              this.dateValue = selectedText.join("-");
            },
            onCancel: () => {
              this.datePicker = null;
            }
          });
        }
        this.datePicker.show();
      },
      async getAssetName(parentId) {
        await _getData("category/getCategory", {
          type: "2",
          parentId: parentId,
          typeName: "assets"
        }).then(data => {
          console.log("固定资产名称：", data);
          this.btn = data;
        });
      },
      async getDetailInfo() {
        await _getData("fixedAssets/getFixedAssets", {
          id: this.$route.query.id
        }).then(data => {
          console.log("固定资产详情：", data);
          this.buttonText = data.wordBook;
          this.assetName = data.bigCategoryName;
          this.parentAssetId = data.bigCategoryId;
          this.number = data.num;
          this.details = data;
          let checkState;
          _.each(data.financeBillLog, o => {
            if (userId == o.checkUser) {
              checkState = o.checkState;
            }
          });
          this.isShowfooterApproval =
            data.status == 1 && userId != data.addUser && checkState == 0
              ? true
              : false;
          this.dateValue = this.details.time
            ? this.details.time.split(" ")[0]
            : "";
          if (this.dateValue) {
            this.selectDate = new Date(
              parseInt(this.dateValue.split("-")[0]),
              parseInt(this.dateValue.split("-")[1]) - 1,
              parseInt(this.dateValue.split("-")[2])
            );
          } else {
            this.selectDate = "";
          }

          this.getAssetName(this.parentAssetId);
        });
      }
    },
    components: {
      headerVue,
      footerButtonVue,
      stepsVue,
      costTypeVue,
      footerApproveButtonVue
    }
  };
</script>

<style lang="scss" scoped>
  @import "../../../../../../static/scss/_commonScss";
  #fixed-details {
    position: fixed;
    .btn {
      width: 100%;
      height: 100%;
      display: flex;
      align-items: center;
      color: #222222;
      font-size: 14px;
    }
    .container {
      background: $base-background;
      padding: 0;
      .top {
        padding: 0 13px;
        background: #fff;
        margin-bottom: 30px;
        padding-bottom: 32px;
        &.detailDisabled {
          h3 {
            color: #666;
            font-weight: normal;
            .other {
              i {
                font-family: PingFangSC-Regular;
                font-weight: normal !important;
              }
            }
            img {
              opacity: 0.3;
            }
          }
        }
        > h2 {
          display: flex;
          align-items: center;
          font-family: PingFangSC-Medium;
          font-size: 18px;
          color: #222222;
          height: 45px;
          line-height: 25px;
          font-weight: bold;
          padding-top: 20px;
        }

        h3 {
          font-family: PingFangSC-Medium;
          font-size: 15px;
          font-weight: bold;
          color: #222222;
          display: flex;
          align-items: center;
          font-weight: bold;
          margin-bottom: 10px;
          span {
            height: 22px;
            width: 22px;
            display: flex;
            align-items: center;
            justify-content: center;
            margin-right: 8px;
            img {
              height: 20px;
            }
          }
          i {
            img {
              width: 8px;
              height: 7px !important;
              margin-bottom: 6px;
              margin-left: 5px;
            }
          }
        }
        .assetName {
          margin-top: 20px;
          h3 {
            img {
              height: 16px;
            }
            .other {
              display: flex;
              align-items: center;
              i {
                font-style: normal;
                font-weight: bold;
                img {
                  width: 8px;
                  height: 7px;
                  margin-bottom: 6px;
                  margin-left: 5px;
                }
              }
            }
            &.special {
              justify-content: space-between;
              .asset-name {
                img {
                  width: 21px;
                  height: 19px;
                  margin-right: 6px;
                }
                height: 30px;
                padding: 0 10px;
                font-family: PingFangSC-Medium;
                font-weight: bold;
                font-size: 14px;
                color: #222222;
                display: flex;
                align-items: center;
                justify-content: center;
                background: #f8f8f8;
              }
            }
          }
          .cost-type {
            padding: 0;
            /deep/ ul {
              padding: 0;
            }
          }
        }
        .applyNumber {
          display: flex;
          justify-content: space-between;
          margin-top: 20px;
          /deep/ .van-stepper {
            width: 92px;
            height: 26px;
            border-radius: 4px;
            background-image: linear-gradient(119deg, #f10215 0%, #ff891c 100%);
            .van-stepper__minus {
              width: 29px;
              height: 26px;
              color: #fff;
              background-color: transparent;
            }
            .van-stepper__input {
              width: 33.8px;
              height: 24px;
              margin: 0.5px 0 0;
              border: none;
              color: $button-color;
              font-family: PingFangSC-Regular;
              font-size: 12px;
            }
            .van-stepper__plus {
              width: 29px;
              height: 26px;
              color: #fff;
              background-color: transparent;
            }
          }
          > span {
            width: 68px;
            height: 30px;
            text-align: center;
            line-height: 30px;
            background: #f8f8f8;
            font-family: PingFangSC-Medium;
            font-size: 14px;
            font-weight: bold;
            // color: #969799;
            color: #222222;
          }
        }
        .useTime {
          margin-top: 20px;
          .van-cell-group {
            height: 46px;
            background-color: #f8f8f8;
            &::after {
              border: 0;
            }
            @include placeholder;
            .van-cell {
              display: flex;
              align-items: center;
              height: 100%;
              padding: 0 13px;
              background-color: #f8f8f8;
              border-radius: 5px;
              &.selected {
                /deep/ .van-field__control:disabled {
                  -webkit-text-fill-color: #222;
                }
              }
              /deep/ .van-field__right-icon {
                height: 20px;
                width: 20px;
                padding: 0;
                margin-right: 1px;
                span {
                  display: flex;
                  img {
                    height: 20px;
                  }
                }
              }
              &.errorFocus {
                border: 1px solid #f10215;
              }
            }
          }
        }

        .specificationModel,
        .money,
        .applyReason,
        .usePerson {
          margin-top: 20px;
          h3 {
            img {
              height: 22px;
            }
          }
          .van-cell {
            height: 46px;
            display: flex;
            align-items: center;
            background: #f8f8f8;
            border-radius: 5px;
            font-family: PingFangSC-Regular;
            font-size: 14px;
            color: #aaaaaa;
            padding: 10px;
            justify-content: space-between;
            @include placeholder();
            &.errorFocus {
              border: 1px solid #f10215;
            }
            &.selected {
              /deep/ .van-field__control:disabled {
                -webkit-text-fill-color: #222;
              }
            }
          }
        }
        .specificationModel {
          .van-cell {
            height: auto;
            min-height: 46px;
          }
        }
        .applyReason {
          .van-cell {
            height: auto;
            min-height: 46px;
          }
        }
        .totalMoney {
          display: flex;
          height: 40px;
          font-family: PingFangSC-Regular;
          font-size: 16px;
          color: #ffffff;
          justify-content: center;
          align-items: center;
          background: #cfa972;
          border-radius: 5px;
          margin-top: 20px;
          //margin-bottom: 10px;
        }
      }
    }
  }
</style>
