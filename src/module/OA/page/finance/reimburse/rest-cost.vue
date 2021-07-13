<template>
  <div id="rest-cost" ref="restCost">
    <header-vue
      name="其他费用"
      :isDelete="type == 'edit'"
      @delClick="delClick"
      @goPrev="goPrev"
    ></header-vue>
    <div class="container" ref="container">
      <div class="content">
        <cost-type-vue
          :costTypeArr="btn"
          ref="costType"
          :isDisabled="type == 'details' ? false : true"
          :ButtonText="btnText"
          :isShowList="type == 'details' ? false : true"
          @btnHundleClick="handleClick"
        ></cost-type-vue>
        <h3 v-if="numberFlag">
          资产申请号<i
            ><img src="../../../../../assets/images/red-star.png"
          /></i>
        </h3>
        <van-cell-group v-if="numberFlag">
          <van-field
            v-model="number"
            ref="number"
            disabled
            @click.native="type != 'details' && selectNumber()"
            placeholder="请选择资产申请号"
          >
            <span
              slot="right-icon"
              v-if="type != 'details'"
              style="margin-left:8px"
            >
              <img src="../../../../../assets/images/arrow-right.png" alt="" />
            </span>
          </van-field>
        </van-cell-group>
        <h3>
          费用产生时间<i
            ><img src="../../../../../assets/images/red-star.png"
          /></i>
        </h3>
        <van-cell-group @click.native="type != 'details' && calendar()">
          <van-field
            ref="time"
            v-model="value"
            placeholder="请选择日期"
            disabled
          >
            <span slot="right-icon" v-if="type != 'details'">
              <img src="../../../../../assets/images/calendar.png" alt="" />
            </span>
          </van-field>
        </van-cell-group>
        <h3>
          费用金额<i><img src="../../../../../assets/images/red-star.png"/></i>
        </h3>
        <van-cell-group>
          <van-field
            v-model="costValue"
            ref="costValue"
            type="number"
            :disabled="type == 'details' ? true : false"
            @input="input('costValue', $event)"
            placeholder="请输入费用金额"
          />
        </van-cell-group>
        <h3>
          费用描述<i><img src="../../../../../assets/images/red-star.png"/></i>
        </h3>
        <van-cell-group class="cost-description">
          <van-field
            v-model="descriptionValue"
            type="textarea"
            rows="1"
            :disabled="type == 'details' ? true : false"
            placeholder="请输入费用描述"
            autosize
          />
        </van-cell-group>
        <t-p-vue
          type="其他费用"
          v-show="TPSHOW"
          :disabled="type == 'details' ? true : false"
          :data="data"
          ref="TP"
        ></t-p-vue>
      </div>
    </div>
    <div class="footer" v-if="this.type != 'details'">
      <x-button @click.native="save(1)" :class="type == 'edit' && 'editSave'"
        >保存</x-button
      >
      <x-button v-if="type != 'edit'" @click.native="save(2)"
        >保存新增一项</x-button
      >
    </div>
  </div>
</template>

<script>
  import headerVue from "../../../components/header/header.vue";
  import costTypeVue from "../../../components/common/cost-type.vue";
  import { provinceList, cityList } from "../../../../../assets/data/area";
  import { _getData } from "../../../service/getData";
  import TPVue from "../../../components/common/TP.vue";
  import { cost_mixins } from "./mixins/cost-mixins";
  import { JsCallNativeMethods } from "../../../../../common/js/jsBridge";
  import { iosKeyboard } from "../../../components/mixins/mixins";
  const addressData = provinceList;
  addressData.forEach(province => {
    province.children = cityList[province.value];
    // province.children.forEach(city => {
    //   city.children = areaList[city.value];
    // });
  });

  let btn = [];
  export default {
    data() {
      return {
        column2: [],
        picker3: null,
        selectedIndex3: ["0"],
        descriptionValue: "", //费用描述
        number: "", //资产申请号
        numberFlag: true,
        otherValue: "", //其他消费
        costValue: "", //费用金额
        btnText: "",
        scrollTop: 0,
        value: "" //日期
      };
    },
    components: { headerVue, costTypeVue, TPVue },
    mixins: [cost_mixins, iosKeyboard],
    mounted() {},
    activated() {
      _getData("fixedAssets/getAssets", {
        currentPage: 1,
        countPerPage: ""
      }).then(data => {
        this.column2 = _.map(data.data, v => {
          return { text: v.sn, value: v.sn, id: v.id };
        });
      });
    },
    beforeRouteEnter(to, from, next) {
      next(vm => {
        vm.value = "";
        vm.descriptionValue = "";
        vm.costValue = "";
        vm.number = "";
        vm.data = [];
        vm.btn = [];
        vm.picker3 = null;
        vm.TPSHOW = true;
        vm.$refs.TP.TPflag = false;
        vm.$refs.TP.TPdescriptionValue = "";
        vm.column1 = [];
        vm.cost = [];
        vm.btnText = "";
        vm.selectedIndex3 = ["0"];
        for (let i in vm.$refs) {
          if (vm.$refs[i].$el) {
            vm.$refs[i].$el.classList.remove("errorFocus");
          }
        }
        if (vm.detailsData && Object.keys(JSON.parse(vm.detailsData)).length) {
          let detailsData = JSON.parse(vm.detailsData);
          console.log(detailsData);
          vm.value = detailsData.time;
          // vm.$refs.costType.btnText = detailsData;
          vm.btnText = detailsData.smallTypeName;
          vm.costValue = detailsData.money;
          vm.descriptionValue = detailsData.note;
          vm.number = detailsData.info1;
          if (detailsData.ifTP == "是") {
            vm.$refs.TP.TPflag = true;
            vm.TPSHOW = true;
            vm.$refs.TP.activeNames = ["1"];
            vm.$refs.TP.TPdescriptionValue = detailsData.tpnote;
            vm.$refs.TP.TP = detailsData.TP || "";
            vm.$refs.TP.btnText = detailsData.tptype;
          } else {
            if (vm.type != "details") {
              vm.TPSHOW = true;
            } else {
              vm.TPSHOW = false;
            }
          }
        }
      });
    },
    methods: {
      //选择资产申请号
      selectNumber() {
        if (!this.picker3) {
          this.picker3 = this.$createPicker({
            data: [this.column2],
            selectedIndex: this.selectedIndex3,
            onSelect: (selectedVal, selectedIndex, selectedText) => {
              console.log(selectedIndex);
              this.number = selectedText.join("");
              this.selectedIndex3 = selectedIndex;
              this.$refs.number.$el.classList.remove("errorFocus");
            }
          });
        }
        this.picker3.show();
      },
      handleClick(item) {
        console.log(item);
        if (item.wordBook == "固定资产") {
          this.numberFlag = true;
        } else {
          this.numberFlag = false;
        }
        let { note: year, num, money, ...rest } = item;

        this.countAndSumMoney = {
          year,
          num,
          money,
          fullName: ""
        };
      },
      save(i) {
        if (this.number == "" && this.numberFlag == true) {
          // //申请号
          this.$refs.number.$el.classList.add("errorFocus");
          this.$refs.number.focus();
          return;
        } else if (this.value == "") {
          //费用产生时间
          this.$refs.time.$el.classList.add("errorFocus");
          this.$refs.container.scrollTo(0, 120);
          return;
        } else if (this.costValue == "") {
          //费用金额
          this.$refs.costValue.$el.classList.add("errorFocus");
          this.$refs.costValue.focus();
          return;
        } else if (this.descriptionValue == "") {
          this.$refs.descriptionValue.$el.classList.add("errorFocus");
          this.$refs.descriptionValue.focus();
          return;
        }

        let arg = [
          {
            // bigBillItemTypeName: null,
            // billId: 3664,
            id:
              this.detailsData && Object.keys(JSON.parse(this.detailsData)).length
                ? JSON.parse(this.detailsData).id
                : "",
            ifTP: this.$refs.TP.TPflag ? "是" : "否",
            info1: this.number,
            info2: "",
            info3: "",
            info4: "",
            info5: "",
            info6: "",
            money: this.costValue,
            note: this.descriptionValue,
            countAndSumMoney: this.countAndSumMoney,
            payed: "",
            smallType: this.$refs.costType.btnText.id,
            smallTypeName: this.$refs.costType.btnText.wordBook,
            time: this.value,
            TP: this.$refs.TP.TPflag ? this.$refs.TP.TP : "",
            tpnote: this.$refs.TP.TPdescriptionValue || "",
            tptype: this.$refs.TP.TPflag ? this.$refs.TP.TPtype : "",
            type: this.$route.query.id
            // withhold: 0,
            // withholdNote: ""
          }
        ];
        this.cost = [...this.cost, ...arg];
        if (i == 1) {
          this.$route.query.cost = JSON.stringify(this.cost);
          this.$router.go(-1);
        } else {
          this.value = "";
          this.number = "";
          this.costValue = "";
          this.descriptionValue = "";
          // //this.data = [];
          // this.TPSHOW = true;
          // // this.btn = [];
          // this.column1 = [];
          // this.btnText = "";
          // // if (vm.TPSHOW) {
          // this.$refs.TP.TPflag = false;
          // this.$refs.TP.TPdescriptionValue = "";

          console.log(this);
          //this.$router.go(0);
          this.reload();
        }
      }
    }
  };
</script>

<style lang="scss" scoped>
  @import "../../../../../../static/scss/_commonScss";
  /deep/.errorFocus {
    border: 1px solid #f10215 !important;
  }
  #rest-cost {
    position: fixed;
    .container {
      padding: 0;

      .content {
        background: #fff;
        h3 {
          height: 55px;
          background: #f6f6f6;
          font-family: PingFangSC-Medium;
          font-size: 15px;
          color: #222222;
          font-weight: bold;
          display: flex;
          align-items: center;
          padding-left: 13px;
          i {
            img {
              width: 8px;
              height: 7px;
              margin-bottom: 6px;
              margin-left: 5px;
            }
          }
        }
        .van-cell-group {
          height: 47px;
          &::after {
            border: 0;
          }
          @include placeholder;
          .van-cell {
            display: flex;
            align-items: center;
            height: 100%;
            padding: 0 13px;
            border: 1px solid #fff;
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
          &.cost-description {
            min-height: 47px;
            height: auto;
            padding: 11.5px 0;
          }
          .select-data {
            height: 47px;
            display: flex;
            align-items: center;
            background: #fff;
            border-radius: 5px;
            font-family: PingFangSC-Regular;
            font-size: 14px;
            color: #aaaaaa;
            justify-content: space-between;
            padding-right: 13px;
            padding-left: 28px;
            line-height: 46px;
            > img {
              height: 20px;
            }
            .left {
              display: flex;
              > span {
                &:nth-child(2) {
                  display: flex;
                  font-family: PingFangSC-Regular;
                  font-size: 16px;
                  color: #222222;
                  margin: 0 30px;
                }
              }
            }
          }
        }
      }
    }
    .footer {
      height: 50px;
      box-shadow: $base-box-shadow;
      display: flex;
      background: #fff;
      align-items: center;
      @include iphone-X-footer;
      .weui-btn {
        height: 40px;
        margin: 0;
        border-radius: 20px;
        border: 1px solid #f10215;
        line-height: 40px;
        display: flex;
        align-items: center;
        justify-content: center;
        &::after {
          display: none;
        }
        &:first-child {
          width: 100px;
          background: #fff;
          font-family: PingFangSC-Medium;
          font-weight: bold;
          font-size: 16px;
          color: #f10215;
          margin-left: 77px;
          &.editSave {
            width: 100%;
            margin: 0;
            margin: 0 13px;
            color: #fff;
            background: #f10215;
          }
        }
        &:nth-child(2) {
          width: 100%;
          color: #fff;
          width: 175px;
          font-family: PingFangSC-Medium;
          font-weight: bold;
          font-size: 16px;
          background: #f10215;
          margin: 0 13px;
        }
      }
    }
  }
</style>
