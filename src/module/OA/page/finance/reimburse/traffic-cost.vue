<template>
  <div id="traffic-cost">
    <header-vue
      name="交通费用"
      :isDelete="type == 'edit'"
      @delClick="delClick"
      @goPrev="goPrev"
    ></header-vue>
    <div class="container" ref="container">
      <div class="content">
        <cost-type-vue
          :costTypeArr="btn"
          ref="costType"
          :isDisabled="$route.query.type == 'details' ? false : true"
          :isShowList="type == 'details' ? false : true"
          :ButtonText="btnText"
          @btnHundleClick="btnHundleClick"
        ></cost-type-vue>
        <h3>
          出发地<i><img src="../../../../../assets/images/red-star.png"/></i>
        </h3>
        <van-cell-group>
          <van-field
            v-model="startArea"
            ref="startArea"
            :disabled="type == 'details' ? true : false"
            @input="input('startArea', $event)"
            placeholder="请输入出发地"
        /></van-cell-group>
        <h3>
          目的地<i><img src="../../../../../assets/images/red-star.png"/></i>
        </h3>
        <van-cell-group>
          <van-field
            v-model="endArea"
            ref="endArea"
            :disabled="type == 'details' ? true : false"
            @input="input('endArea', $event)"
            placeholder="请输入目的地"
        /></van-cell-group>
        <h3>
          费用产生时间<i
            ><img src="../../../../../assets/images/red-star.png"
          /></i>
        </h3>
        <van-cell-group @click.native="type != 'details' && calendar()">
          <van-field
            v-model="value"
            placeholder="请选择日期"
            ref="time"
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
            @input="input('costValue', $event)"
            ref="costValue"
            type="number"
            :disabled="type == 'details' ? true : false"
            placeholder="请输入费用金额"
          />
        </van-cell-group>
        <h3>
          费用描述<i><img src="../../../../../assets/images/red-star.png"/></i>
        </h3>
        <van-cell-group class="cost-description">
          <van-field
            v-model="descriptionValue"
            ref="descriptionValue"
            type="textarea"
            rows="1"
            :disabled="type == 'details' ? true : false"
            placeholder="请输入费用描述"
            autosize
          />
        </van-cell-group>
        <t-p-vue
          type="交通费"
          :data="data"
          ref="TP"
          v-show="TPSHOW"
          :disabled="type == 'details' ? true : false"
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
  import { mapMutations } from "vuex";
  import _ from "lodash";
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
        CascadePicker: null,
        btnText: "",
        descriptionValue: "", //费用描述
        startArea: "", //出发地
        endArea: "", //目的地
        costValue: "", //费用金额
        value: "" //日期
      };
    },
    components: { headerVue, costTypeVue, TPVue },
    mixins: [cost_mixins, iosKeyboard],
    activated() {},
    beforeRouteEnter(to, from, next) {
      next(vm => {
        vm.value = "";
        vm.descriptionValue = "";
        vm.costValue = "";
        vm.startArea = "";
        vm.endArea = "";
        vm.TPSHOW = true;
        vm.cost = [];
        vm.data = [];
        vm.btn = [];
        vm.$refs.TP.TPflag = false;
        vm.$refs.TP.TPdescriptionValue = "";
        vm.column1 = [];
        vm.btnText = "";

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
          vm.startArea = detailsData.info2;
          vm.endArea = detailsData.info3;
          vm.descriptionValue = detailsData.note;
          if (detailsData.ifTP == "是") {
            vm.$refs.TP.TPflag = true;
            vm.TPSHOW = true;
            vm.$refs.TP.activeNames = ["1"];
            vm.$refs.TP.TP = detailsData.TP || "";
            vm.$refs.TP.btnText = detailsData.tptype;
            vm.$refs.TP.TPdescriptionValue = detailsData.tpnote;
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
      save(i) {
        console.log(this.btn);
        if (this.startArea == "") {
          //出发地
          this.$refs.startArea.$el.classList.add("errorFocus");
          this.$refs.startArea.focus();
          return;
        } else if (this.endArea == "") {
          //目的地
          this.$refs.endArea.$el.classList.add("errorFocus");
          this.$refs.endArea.focus();
          return;
        } else if (this.value == "") {
          // 日期
          this.$refs.time.$el.classList.add("errorFocus");
          this.$refs.container.scrollTo(0, 200);
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
            info1: "",
            info2: this.startArea,
            info3: this.endArea,
            info4: "",
            info5: "",
            info6: "",
            money: this.costValue,
            note: this.descriptionValue, //费用描述
            payed: "",
            countAndSumMoney: this.countAndSumMoney,
            smallType: this.$refs.costType.btnText.id,
            smallTypeName: this.$refs.costType.btnText.wordBook,
            time: this.value,
            tpnote: this.$refs.TP.TPdescriptionValue || "",
            TP: this.$refs.TP.TPflag ? this.$refs.TP.TP : "",
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
          this.costValue = "";
          this.descriptionValue = "";
          this.startArea = "";
          this.endArea = "";
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
      },
      city() {
        if (!this.CascadePicker) {
          console.log(addressData);
          this.CascadePicker = this.$createCascadePicker({
            data: addressData
            //onSelect: this.selectHandle,
          });
        }

        this.CascadePicker.show();
      }
    }
  };
</script>

<style lang="scss" scoped>
  @import "../../../../../../static/scss/_commonScss";
  /deep/.errorFocus {
    border: 1px solid #f10215 !important;
  }
  #traffic-cost {
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
