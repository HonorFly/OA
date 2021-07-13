<template>
  <div id="work-cost">
    <header-vue
      name="办公费用"
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
          :isShowList="type == 'details' ? false : true"
          :ButtonText="btnText"
          @btnHundleClick="btnHundleClick"
        ></cost-type-vue>
        <h3>
          费用产生时间
          <i><img src="../../../../../assets/images/red-star.png"/></i>
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
          费用金额
          <i><img src="../../../../../assets/images/red-star.png"/></i>
        </h3>
        <van-cell-group>
          <van-field
            ref="costValue"
            @input="input('costValue', $event)"
            type="number"
            v-model="costValue"
            :disabled="type == 'details' ? true : false"
            placeholder="请输入费用金额"
          />
        </van-cell-group>
        <h3>
          费用描述
          <i><img src="../../../../../assets/images/red-star.png"/></i>
        </h3>
        <van-cell-group class="cost-description">
          <van-field
            v-model="descriptionValue"
            type="textarea"
            ref="descriptionValue"
            rows="1"
            :disabled="type == 'details' ? true : false"
            placeholder="请输入费用描述"
            autosize
          />
        </van-cell-group>

        <t-p-vue
          type="办公费用"
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
  import { cost_mixins } from "./mixins/cost-mixins";
  import { _getData } from "../../../service/getData";
  import TPVue from "../../../components/common/TP.vue";
  import { iosKeyboard } from "../../../components/mixins/mixins";

  let btn = [];
  export default {
    data() {
      return {
        column1: [],
        picker1: null,
        btnText: "",
        descriptionValue: "", //费用描述
        costValue: "", //费用金额
        value: "" //日期
      };
    },
    mixins: [cost_mixins, iosKeyboard],
    components: { headerVue, costTypeVue, TPVue },
    methods: {
      save(i) {
        console.log(this.$refs.TP);
        if (this.value == "") {
          this.$refs.time.$el.classList.add("errorFocus");
          this.$refs.container.scrollTo(0, 120);
          return;
        } else if (this.costValue == "") {
          this.$refs.costValue.$el.classList.add("errorFocus");
          this.$refs.costValue.focus();
          return;
        } // else if (this.descriptionValue == "") {
        //   this.$refs.descriptionValue.$el.classList.add("errorFocus");
        //   this.$refs.descriptionValue.focus();
        //   return;
        // }

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
            //tptypeName: this.$refs.TP.TPflag ? this.$refs.TP.TPtype : "",
            type: this.$route.query.id
            // withhold: 0,
            // withholdNote: ""
          }
        ];
        // if (this.index != "") {
        //   this.$route.query.index = this.index;
        // }
        this.cost = [...this.cost, ...arg];
        if (i == 1) {
          this.$route.query.cost = JSON.stringify(this.cost);
          this.$router.go(-1);
        } else {
          this.value = "";
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
    },
    activated() {},

    beforeRouteEnter(to, from, next) {
      console.log(to, from);
      next(vm => {
        vm.value = "";
        vm.descriptionValue = "";
        vm.costValue = "";
        vm.data = [];
        vm.TPSHOW = true;
        vm.cost = [];
        vm.btn = [];
        // if (vm.TPSHOW) {
        vm.$refs.TP.TPflag = false;
        vm.$refs.TP.TPdescriptionValue = "";
        vm.$refs.time.$el.classList.remove("errorFocus");
        vm.$refs.costValue.$el.classList.remove("errorFocus");
        vm.$refs.descriptionValue.$el.classList.remove("errorFocus");
        // }

        vm.column1 = [];
        vm.btnText = "";
        if (vm.detailsData && Object.keys(JSON.parse(vm.detailsData)).length) {
          let detailsData = JSON.parse(vm.detailsData);
          console.log(detailsData);
          vm.value = detailsData.time;
          // vm.$refs.costType.btnText = detailsData;
          vm.btnText = detailsData.smallTypeName;
          vm.costValue = detailsData.money;
          vm.descriptionValue = detailsData.note;
          if (detailsData.ifTP == "是") {
            vm.$refs.TP.TPflag = true;
            vm.TPSHOW = true;
            vm.$refs.TP.activeNames = ["1"];
            //vm.$refs.TP.tptype=detailsData.
            vm.$refs.TP.TPdescriptionValue = detailsData.tpnote;
            vm.$refs.TP.TP = detailsData.TP || "";
            vm.$refs.TP.btnText = detailsData.tptype;
            console.log(vm.$refs.TP);
          } else {
            if (vm.type != "details") {
              vm.TPSHOW = true;
            } else {
              vm.TPSHOW = false;
            }
          }
        }
      });
    }
  };
</script>

<style lang="scss" scoped>
  @import "../../../../../../static/scss/_commonScss";
  /deep/.errorFocus {
    border: 1px solid #f10215 !important;
  }
  #work-cost {
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

          .van-cell {
            display: flex;
            align-items: center;
            height: 100%;
            padding: 0 13px;
            border: 1px solid #fff;
            @include placeholder;
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
            .van-cell {
              padding: 11.5px 13px;
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
