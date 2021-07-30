<template>
  <div id="stamp-chapter-details">
    <header-vue :type="type" :data="details"></header-vue>
    <div class="container">
      <div class="top">
        <h2 v-if="type == 'apply' || type == 'edit'">借章申请</h2>
        <steps-vue v-else :stepData="details" title="的借章申请"></steps-vue>
        <div class="chapterType">
          <h3 class="special">
            <div class="other">
              <span>
                <img
                  src="../../../../../assets/images/chapter-type.png"
                  width="21"
                  height="19"
                />
              </span>
              <i
                >印章类型<img src="../../../../../assets/images/red-star.png"
              /></i>
            </div>
            <div class="chapter-name">
              <img src="../../../../../assets/images/chapter.png" />
              {{ sealType }}
            </div>
          </h3>
        </div>
        <div class="companyName">
          <h3>
            <span>
              <img
                src="../../../../../assets/images/company.png"
                width="20"
                height="21"
              />
            </span>
            印章所属公司
            <i><img src="../../../../../assets/images/red-star.png"/></i>
          </h3>
          <ul>
            <li
              id="company"
              @click="type != 'details' && selectCompany()"
              :class="{
                errorFocus: companyFlag && companyName == '请选择印章所属公司',
                selected: companyName != '请选择印章所属公司'
              }"
            >
              {{ companyName }}
              <img
                v-if="type != 'details'"
                src="../../../../../assets/images/arrow-right.png"
              />
            </li>
          </ul>
        </div>
        <div class="useTime">
          <h3>
            <span>
              <img src="../../../../../assets/images/time.png" />
            </span>
            使用日期
            <i><img src="../../../../../assets/images/red-star.png"/></i>
          </h3>
          <div
            class="select-data"
            id="date"
            ref="time"
            @click="type != 'details' && selectDay()"
          >
            <div class="left">
              <span :class="{ selected: fromDate }">
                {{ fromDate ? fromDate : "请选择开始时间" }}
              </span>
              <span>—</span>
              <span :class="{ selected: endDate }">
                {{ endDate ? endDate : "请选择结束时间" }}
              </span>
            </div>
            <img
              v-if="type != 'details'"
              src="../../../../../assets/images/calendar.png"
            />
          </div>
        </div>
        <div class="applyNumber">
          <h3>
            <span>
              <img src="../../../../../assets/images/apply-number.png" />
            </span>
            申请份数
            <i><img src="../../../../../assets/images/red-star.png"/></i>
          </h3>
          <van-stepper v-if="type != 'details'" v-model.trim="number" />
          <span v-else>{{ number }}</span>
        </div>
        <div class="applyReason">
          <h3>
            <span>
              <img src="../../../../../assets/images/explain.png" />
            </span>
            借章原事由
            <i><img src="../../../../../assets/images/red-star.png"/></i>
          </h3>
          <van-field
            ref="note"
            :class="{
              errorFocus: noteFlag && !details.note,
              selected: details.note
            }"
            v-model="details.note"
            placeholder="请输入借章事由"
            :disabled="type == 'details'"
            type="textarea"
            autosize
            rows="1"
          />
        </div>
      </div>
    </div>
    <footer-cancel-submit-vue
      @submit="submit"
      :data="details"
      :type="type"
      :submitFlag="submitFlag"
      v-if="!isApproval"
    ></footer-cancel-submit-vue>
    <footer-approve-button-vue
      v-if="isApproval && isShowfooterApproval"
      :data="details"
      type="stampChapter"
    ></footer-approve-button-vue>
    <van-calendar v-model="show" type="range" @confirm="onConfirm" />
  </div>
</template>

<script>
  import headerVue from "../../../components/header/header.vue";
  import footerCancelSubmitVue from "../../../components/footer/footer-cancel-submit";
  import footerApproveButtonVue from "../../../components/footer/footer-approve-button";
  import stepsVue from "../../../components/common/steps.vue";
  import { _getData } from "../../../service/getData";
  import { mapMutations } from "vuex";
  import _ from "lodash";
  import { getDay, iosKeyboard } from "../../../components/mixins/mixins";

  export default {
    data() {
      return {
        details: {},
        picker1: null, //所属公司
        chapterTypeId: "", //印章类型id
        sealType: "", //印章类型名称
        companyId: "", //公司名称id
        companyName: "请选择印章所属公司", //公司名称
        companyList: [], //公司列表
        dateValue: "", //日期
        number: "", //申请数量
        applyReasonvalue: "", //申请原因
        selectedIndex1: [0],
        selectDate: "",
        scrollTop: 0,
        submitFlag: false,
        isShowfooterApproval: false,
        companyFlag: false, //公司判断是否填写值
        noteFlag: false, //申请原因判断是否填写值
        dateFlag: false //预计使用时间判断是否填写值
      };
    },
    mixins: [getDay, iosKeyboard],
    props: ["type", "isApproval"],
    activated() {
      this.details = {};
      this.scrollTop = 0;
      this.number = 1;
      this.isShowfooterApproval = false;
      this.companyFlag = false;
      this.noteFlag = false;
      this.dateFlag = false;
      this.selectDate = "";
      this.dateValue = "";
      this.companyName = "请选择印章所属公司";
      this.fromDate = ""; //开始时间
      this.endDate = ""; //结束时间
      this.dayNum = ""; //天数
      this.$refs.time && this.$refs.time.classList.remove("errorFocus");
      _getData("company/companyList", {}).then(data => {
        console.log("公司列表：", data);
        this.companyList = data;
      });
      switch (this.type) {
        case "details":
          this.getDetailInfo();
          break;
        case "edit":
          this.getDetailInfo();
          break;
        default:
          this.sealType = this.$route.query.chapterTypeName;
          break;
      }
    },
    methods: {
      ...mapMutations(["setTransition"]),
      submit(val) {
        if (val == "submitFlag") {
          this.submitFlag = false;
          return;
        }
        if (_.isEmpty(this.details)) {
          this.details = { note: "", useTime: "", useTime1: "" };
        }
        console.log(this.endDate);
        this.details = {
          ...this.details,
          id: this.$route.query.id || "",
          sealType: this.sealType,
          num: this.number,
          useTime: this.fromDate,
          useTime1: this.endDate,
          belongCompany: this.companyName,
          status: 5
        };
        if (this.companyName == "请选择印章所属公司") {
          this.companyFlag = true;
          this.submitFlag = true;
          document.getElementById("company").scrollIntoView();
          return;
        } else if (this.fromDate == "" || this.endDate == "") {
          this.dateFlag = true;
          this.submitFlag = true;
          this.$refs.time.classList.add("errorFocus");
          document.getElementById("date").scrollIntoView();
          return;
        } else {
          this.companyFlag = false;
          this.$refs.time.classList.remove("errorFocus");
          this.dateFlag = false;
        }
        if (!this.details.note) {
          this.noteFlag = true;
          this.submitFlag = true;
          this.$refs.note.focus();
          return;
        } else {
          this.noteFlag = false;
        }
        _getData("borrow/saveBorrow", this.details).then(data => {
          console.log("提交：", data);
          this.submitFlag = true;
          this.$toast("提交成功");
          this.$route.params.path = "saveBtn";
          this.details = {};
          this.$router.go(-1);
        });
        this.setTransition("turn-on");
      },
      selectCompany() {
        if (!this.picker1) {
          this.picker1 = this.$createPicker({
            data: [this.companyList],
            alias: { value: "id", text: "chinaName" },
            selectedIndex: this.selectedIndex1,
            onSelect: (selectedVal, selectedIndex, selectedText) => {
              this.companyId = selectedVal[0];
              this.companyName = selectedText.join("");
              this.selectedIndex1 = selectedIndex;
            },
            onCancel: () => {
              this.picker1 = null;
            }
          });
        }
        this.picker1.show();
      },
      async getDetailInfo() {
        await _getData("borrow/getBorrow", {
          id: this.$route.query.id
        }).then(data => {
          console.log("借章详情：", data);
          let checkState;
          _.each(data.billCheckList, o => {
            if (userId == o.checkUser) {
              checkState = o.checkState;
            }
          });
          this.isShowfooterApproval =
            data.status == 1 && userId != data.addUser && checkState == 0
              ? true
              : false;
          this.sealType = data.sealType;
          this.companyName = data.belongCompany;
          this.companyId = data.belongCompanyId;
          this.number = data.num;
          this.details = data;
          this.fromDate = data.useTime;
          this.endDate = data.useTime1;
        });
      }
    },
    components: {
      headerVue,
      footerCancelSubmitVue,
      stepsVue,
      footerApproveButtonVue
    }
  };
</script>

<style lang="scss" scoped>
  @import "../../../../../../static/scss/_commonScss";
  /deep/.errorFocus {
    border: 1px solid #f10215 !important;
  }
  #stamp-chapter-details {
    position: fixed;
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
            i {
              font-weight: normal !important;
            }
            img {
              opacity: 0.3;
            }
          }
        }
        > h2 {
          height: 65px;
          display: flex;
          align-items: center;
          font-family: PingFangSC-Medium;
          font-size: 17px;
          color: #222222;
          line-height: 65px;
          font-weight: bold;
          span {
            font-family: PingFangSC-Regular;
            font-size: 14px;
            color: #999999;
          }
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
          &.special {
            justify-content: space-between;
            .chapter-name {
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
        .chapterType {
          .other {
            display: flex;
            align-items: center;
            i {
              font-style: normal;
              font-weight: bold;
            }
          }
        }
        .companyName {
          margin-top: 20px;
          ul {
            display: flex;
            flex-direction: column;
            li {
              height: 46px;
              display: flex;
              align-items: center;
              background: #f8f8f8;
              border-radius: 5px;
              font-family: PingFangSC-Regular;
              font-size: 14px;
              color: #aaa;
              padding: 0 3px 0 10px;
              justify-content: space-between;
              &.errorFocus {
                border: 1px solid #f10215;
              }
              &.selected {
                font-family: PingFangSC-Medium;
                color: #222222;
                font-weight: 500;
              }
              > img {
                height: 19px;
              }
              &:first-child {
                margin-bottom: 10px;
              }
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
            color: #222222;
          }
        }
        .useTime {
          margin-top: 20px;
          .select-data {
            height: 46px;
            display: flex;
            align-items: center;
            background: #f8f8f8;
            border-radius: 5px;
            font-family: PingFangSC-Regular;
            font-size: 14px;
            color: #aaaaaa;
            justify-content: space-between;
            padding-right: 13px;
            padding-left: 28px;
            line-height: 46px;
            > img {
              height: 19px;
            }
            .left {
              display: flex;
              .selected {
                color: #222;
              }
              > span {
                color: #aaa;
                &:nth-child(2) {
                  color: #aaaaaa;
                  display: flex;
                  width: 9px;
                  overflow: hidden;
                  margin: 0 30px;
                }
              }
            }
          }
        }
        .applyReason {
          margin-top: 20px;
          h3 {
            img {
              height: 22px;
            }
          }
          .van-cell {
            min-height: 46px;
            height: auto;
            display: flex;
            align-items: center;
            background: #f8f8f8;
            border-radius: 5px;
            font-family: PingFangSC-Regular;
            font-size: 14px;
            color: #aaaaaa;
            padding: 10px;
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
      }
    }
  }
</style>
