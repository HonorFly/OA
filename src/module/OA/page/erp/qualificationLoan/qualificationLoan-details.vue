<template>
  <div id="qualification-loan-details">
    <header-vue :type="type" :data="details"></header-vue>
    <div class="container" ref="container">
      <div class="top">
        <h2 v-if="type == 'apply' || type == 'edit'">公司资质出借申请</h2>
        <steps-vue
          v-else
          :stepData="details"
          title="的公司资质出借申请"
        ></steps-vue>
        <div class="qualificationType">
          <h3>
            <span>
              <img
                src="../../../../../assets/images/fixed-assets.png"
                width="21"
                height="19"
                style="height:19px;"
              />
            </span>
            资质类型
            <i><img src="../../../../../assets/images/red-star.png"/></i>
            <i v-if="type != 'details'">(可多选)</i>
          </h3>
          <ul>
            <li
              v-for="item in qualificationArr"
              :key="item.id"
              @click="type != 'details' && clickHandle(item.wordBook)"
              :class="[
                addClass(item.wordBook),
                { detailShow: type == 'details' }
              ]"
            >
              <span>{{ item.wordBook }}</span>
            </li>
          </ul>
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
            资质所属公司
            <i><img src="../../../../../assets/images/red-star.png"/></i>
          </h3>
          <ul>
            <li
              id="company"
              @click="type != 'details' && selectCompany()"
              :class="{
                selected: companyName != '请选择资质所属公司',
                errorFocus: companyFlag && companyName == '请选择资质所属公司'
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
        <div class="useTime" id="useTime">
          <h3>
            <span>
              <img src="../../../../../assets/images/time.png" />
            </span>
            使用日期
            <i><img src="../../../../../assets/images/red-star.png"/></i>
          </h3>
          <div
            :class="['select-data', { errorFocus: useTimeFlag && !fromDate }]"
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
        <div class="categories">
          <h3>
            <span>
              <img src="../../../../../assets/images/loan-method.png" />
            </span>
            出借方式
            <i><img src="../../../../../assets/images/red-star.png"/></i>
          </h3>
          <div class="btn" v-if="type != 'details'">
            <x-button
              mini
              :class="item == ifSend && 'active'"
              v-for="(item, i) in ['自提', '寄出']"
              :key="i"
              @click.native="typeBtnClick(item)"
            >
              <span>{{ item }}</span>
            </x-button>
          </div>
          <div class="btn" v-else>
            <x-button mini class="active"
              ><span>{{ ifSend }}</span></x-button
            >
          </div>
        </div>
        <div class="otherInfo" v-show="ifSend == '寄出'">
          <ul>
            <li>
              <span>收件人</span>
              <van-field
                :class="{
                  selected: details.person,
                  errorFocus: personFlag && !details.person
                }"
                ref="person"
                v-model.trim="details.person"
                placeholder="请输入姓名"
                :disabled="type == 'details'"
              />
            </li>
            <li>
              <span>联系电话</span>
              <van-field
                :class="{
                  selected: details.tel,
                  errorFocus: telFlag && !details.tel
                }"
                ref="tel"
                v-model.trim="details.tel"
                placeholder="请输入联系方式"
                :disabled="type == 'details'"
              />
            </li>
            <li>
              <span>快递地址</span>
              <van-field
                :class="{
                  selected: details.adr,
                  errorFocus: adrFlag && !details.adr
                }"
                ref="adr"
                v-model.trim="details.adr"
                placeholder="请输入地址"
                :disabled="type == 'details'"
              />
            </li>
          </ul>
        </div>
        <div class="backTime">
          <h3>
            <span><img src="../../../../../assets/images/time.png"/></span>
            预计归还日期
            <i><img src="../../../../../assets/images/red-star.png"/></i>
          </h3>
          <van-cell-group>
            <van-field
              id="date"
              v-model="dateValue"
              placeholder="请选择日期"
              disabled
              @click="type != 'details' && calendar()"
              :class="{
                selected: dateValue,
                errorFocus: dateFlag && !dateValue
              }"
            >
              <span slot="right-icon">
                <img
                  v-if="type != 'details'"
                  src="../../../../../assets/images/calendar.png"
                />
              </span>
            </van-field>
          </van-cell-group>
        </div>
        <div class="applyReason">
          <h3>
            <span><img src="../../../../../assets/images/explain.png"/></span>
            使用事由
            <i><img src="../../../../../assets/images/red-star.png"/></i>
          </h3>
          <van-field
            ref="note"
            :class="{
              selected: details.note,
              errorFocus: noteFlag && !details.note
            }"
            v-model="details.note"
            placeholder="请输入使用事由"
            type="textarea"
            autosize
            rows="1"
            :disabled="type == 'details'"
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
      type="qualification"
    ></footer-approve-button-vue>
  </div>
</template>

<script>
  import headerVue from "../../../components/header/header.vue";
  import footerCancelSubmitVue from "../../../components/footer/footer-cancel-submit";
  import footerApproveButtonVue from "../../../components/footer/footer-approve-button";
  import costTypeVue from "../../../components/common/cost-type.vue";
  import stepsVue from "../../../components/common/steps.vue";
  import { _getData } from "../../../service/getData";
  import { mapMutations } from "vuex";
  import _ from "lodash";
  import { getDay, iosKeyboard } from "../../../components/mixins/mixins";

  export default {
    data() {
      return {
        details: {},
        ifSend: "自提",
        picker1: null, //所属公司
        datePicker: null, //日期
        qualificationArr: [], //资质
        selectQualificationArr: [], //所选资质
        qualificationTypeId: "", //资质类型id
        qualificationTypeName: "", //资质类型名称
        companyName: "请选择资质所属公司", //公司名称
        companyList: [], //公司列表
        dateValue: "", //日期
        number: "", //申请数量
        applyReasonvalue: "", //申请原因
        selectedIndex1: [0],
        selectDate: "",
        isShowfooterApproval: false,
        companyFlag: false,
        personFlag: false,
        telFlag: false,
        adrFlag: false,
        useTimeFlag: false,
        dateFlag: false,
        noteFlag: false,
        submitFlag: false,
        scrollTop: 0
      };
    },
    mixins: [getDay, iosKeyboard],
    props: ["type", "isApproval"],
    activated() {
      this.scrollTop = 0;
      this.details = {};
      this.companyName = "请选择资质所属公司";
      this.selectDate = "";
      this.dateValue = "";
      this.ifSend = "自提";
      this.selectedIndex1 = [0];
      this.selectQualificationArr = [];
      this.isShowfooterApproval = false;
      this.companyFlag = false;
      this.noteFlag = false;
      this.useTimeFlag = false;
      this.dateFlag = false;
      this.personFlag = false;
      this.telFlag = false;
      this.adrFlag = false;
      this.fromDate = ""; //开始时间
      this.endDate = ""; //结束时间
      this.dayNum = ""; //天数
      _getData("company/companyList", {}).then(data => {
        console.log("公司列表：", data);
        this.companyList = data;
      });
      _getData("category/getCategory", {
        type: "3",
        parentId: "584",
        typeName: "license"
      }).then(data => {
        console.log("资质类型：：：", data);
        this.qualificationArr = data;
      });
      switch (this.type) {
        case "details":
          this.getDetailInfo();
          break;
        case "edit":
          this.getDetailInfo();
          break;
        default:
          this.selectQualificationArr.push(
            this.$route.query.qualificationTypeName
          );
          this.qualificationTypeId = this.$route.query.qualificationTypeId;
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
        if (val == "submit") {
          if (_.isEmpty(this.details)) {
            this.details = {
              person: "",
              tel: "",
              adr: "",
              note: ""
            };
          }
          this.details = {
            ...this.details,
            id: this.$route.query.id || "",
            licenseType: this.selectQualificationArr.join(","),
            ifSend: this.ifSend,
            predictTime: this.dateValue,
            belongCompany: this.companyName,
            useTime: this.fromDate,
            useTime1: this.endDate,
            status: 7
          };
          console.log(this.details);
          if (this.details.licenseType == "") {
            this.submitFlag = true;
            this.$toast("请选择资质类型");
            return;
          }
          if (this.details.belongCompany == "请选择资质所属公司") {
            this.companyFlag = true;
            this.submitFlag = true;
            document.getElementById("company").scrollIntoView();
            return;
          } else {
            this.companyFlag = false;
          }

          if (this.details.useTime1 == "" || this.details.useTime == "") {
            this.useTimeFlag = true;
            this.submitFlag = true;
            document.getElementById("useTime").scrollIntoView();
            return;
          } else {
            this.useTimeFlag = false;
          }
          if (this.ifSend == "寄出") {
            if (!this.details.person) {
              this.personFlag = true;
              this.submitFlag = true;
              this.$refs.person.focus();
              return;
            } else {
              this.personFlag = false;
            }
            if (!this.details.tel) {
              this.telFlag = true;
              this.submitFlag = true;
              this.$refs.tel.focus();
              return;
            } else {
              this.telFlag = false;
            }
            if (!this.details.adr) {
              this.adrFlag = true;
              this.submitFlag = true;
              this.$refs.adr.focus();
              return;
            } else {
              this.adrFlag = false;
            }
          }
          if (!this.dateValue) {
            this.submitFlag = true;
            this.dateFlag = true;
            document.getElementById("date").scrollIntoView();
            return;
          } else {
            this.dateFlag = false;
          }

          if (
            new Date(this.endDate).getTime() > new Date(this.dateValue).getTime()
          ) {
            this.submitFlag = true;
            this.$toast("归还日期不能小于使用日期");
            return;
          }
          if (!this.details.note) {
            this.noteFlag = true;
            this.submitFlag = true;
            this.$refs.note.focus();
            return;
          } else {
            this.noteFlag = false;
          }
          _getData("license/saveLicense", this.details).then(() => {
            this.submitFlag = true;
            this.$route.params.path = "saveBtn";
            this.$toast("提交成功");
            this.details = {};
            this.$router.go(-1);
          });
          this.setTransition("turn-on");
        }
      },
      addClass(item) {
        for (const v of this.selectQualificationArr) {
          if (v == item) {
            return "active";
          }
        }
      },
      clickHandle(item) {
        let select = _.find(this.selectQualificationArr, o => {
          return o == item;
        });
        select
          ? (this.selectQualificationArr = _.without(
              this.selectQualificationArr,
              select
            ))
          : this.selectQualificationArr.push(item);
      },
      typeBtnClick(item) {
        this.ifSend = item;
      },
      selectCompany() {
        if (!this.picker1) {
          this.picker1 = this.$createPicker({
            data: [this.companyList],
            alias: { value: "id", text: "chinaName" },
            selectedIndex: this.selectedIndex1,
            onSelect: (selectedVal, selectedIndex, selectedText) => {
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
      calendar() {
        if (!this.datePicker) {
          this.datePicker = this.$createDatePicker({
            min: new Date(2019, 7, 8),
            max: new Date(2029, 12, 31),
            value: this.selectDate || new Date(),
            onSelect: (date, selectedVal, selectedText) => {
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
      async getDetailInfo() {
        await _getData("license/getLicense", {
          id: this.$route.query.id
        }).then(data => {
          console.log("资质详情：", data);
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
          this.selectQualificationArr = data.licenseType.split(",");
          this.dateValue = data.predictTime;
          this.companyName = data.belongCompany;
          this.companyId = data.belongCompanyId;
          this.details = data;
          this.ifSend = data.ifSend;
          this.fromDate = data.useTime;
          this.endDate = data.useTime1;
        });
      }
    },
    components: {
      headerVue,
      stepsVue,
      costTypeVue,
      footerCancelSubmitVue,
      footerApproveButtonVue
    }
  };
</script>

<style lang="scss" scoped>
  @import "../../../../../../static/scss/_commonScss";
  #qualification-loan-details {
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
        }
        .errorFocus {
          border: 1px solid #f10215;
        }
        .van-cell {
          &.selected {
            /deep/ .van-field__control:disabled {
              -webkit-text-fill-color: #222;
            }
          }
        }
        .qualificationType {
          h3 {
            i {
              font-style: normal;
              margin-left: 6px;
              font-weight: bold;
              font-family: PingFangSC-Medium;
            }
          }
          ul {
            display: flex;
            flex-wrap: wrap;
            li {
              width: 107px;
              height: 40px;
              margin-right: 10px;
              display: flex;
              align-items: center;
              justify-content: center;
              font-family: PingFangSC-Light;
              font-size: 14px;
              color: #666666;
              padding: 0 10px;
              background: #f4f4f4;
              text-align: center;
              line-height: 17px;
              margin-bottom: 10px;
              border-radius: 2px 2px 4px 2px;
              &.active {
                background-image: linear-gradient(
                  119deg,
                  rgba(241, 2, 21, 0.1) 0%,
                  rgba(255, 137, 28, 0.1) 100%
                );
                position: relative;
                span {
                  font-weight: bold;
                  background-image: -webkit-gradient(
                    linear,
                    left 0,
                    right 0,
                    from(rgba(241, 2, 21, 1)),
                    to(rgba(255, 137, 28, 1))
                  );
                  -webkit-background-clip: text; /*必需加前缀 -webkit- 才支持这个text值 */
                  -webkit-text-fill-color: transparent; /*text-fill-color会覆盖color所定义的字体颜色： */
                }
                &::after {
                  content: "";
                  background: url("../../../../../assets/images/pitch-on.png");
                  background-size: 100% 100%;
                  display: flex;
                  height: 20px;
                  width: 20px;
                  position: absolute;
                  right: 0;
                  bottom: 0;
                }
              }
              &:nth-child(3n) {
                margin-right: 0;
              }
              &:nth-child(3n + 1) {
                margin-bottom: 0;
              }
              &.detailShow {
                &::after {
                  display: none;
                }
              }
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
              color: #aaaaaa;
              padding: 0 3px 0 10px;
              justify-content: space-between;
              > img {
                height: 19px;
              }
              &:first-child {
                // margin-bottom: 10px;
              }
              &.selected {
                color: #222;
              }
            }
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
        .categories {
          display: flex;
          justify-content: space-between;
          margin-bottom: 14px;
          align-items: center;
          margin-top: 20px;
          h3 {
            margin-bottom: 0;
          }
          .btn {
            display: flex;
            align-items: center;
            padding-right: 2px;
            .weui-btn {
              height: 26px;
              width: 68px;
              font-family: PingFangSC-Regular;
              font-size: 13px;
              color: #666666;
              //line-height: 26px;
              display: flex;
              align-items: center;
              justify-content: center;
              margin: 0;
              &:not(.active) {
                border: rgba($color: #666, $alpha: 0.2) 1px solid;
              }
              > span {
                line-height: normal;
              }
              &::after {
                //border-color: #666;
                display: none;
              }
              &:first-child {
                margin-right: 10px;
              }
              &.active {
                background: url("../../../../../../static/images/btn-background.png")
                  center no-repeat;
                background-size: 100% 100%;
                color: #fff;
                &::after {
                  border-color: #f10215;
                  display: none;
                }
              }
            }
          }
        }
        .otherInfo {
          padding-left: 10px;
          ul {
            width: 100%;
            li {
              width: 100%;
              display: flex;
              margin-bottom: 10px;
              > span {
                width: 56px;
                height: 46px;
                margin-right: 8px;
                display: flex;
                align-items: center;
                justify-content: center;
                font-family: PingFangSC-Light;
                font-size: 14px;
                color: #222222;
              }
            }
          }
          .van-cell {
            flex: 1;
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
          }
        }
        .backTime {
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
            padding: 10px;
            justify-content: space-between;
            @include placeholder();
          }
        }
      }
    }
  }
</style>
