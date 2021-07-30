<template>
  <div id="work-cost">
    <header-vue
      name="酒店及住宿费用"
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
          所在城市<i><img src="../../../../../assets/images/red-star.png" /></i>
        </h3>
        <van-cell-group @click.native="type != 'details' && city()">
          <van-field
            v-model="cityName"
            ref="city"
            placeholder="请选择城市"
            disabled
          >
            <span slot="right-icon" v-if="type != 'details'">
              <img src="../../../../../assets/images/city.png" alt="" />
            </span>
          </van-field>
        </van-cell-group>
        <h3>
          入住-离开的时间<i
            ><img src="../../../../../assets/images/red-star.png"
          /></i>
        </h3>
        <van-cell-group>
          <div
            class="select-data"
            @click="type != 'details' && selectDay()"
            ref="time"
          >
            <div class="left">
              <span :class="{ selected: fromDate }">
                {{ fromDate ? fromDate : "请选择开始时间" }}</span
              >
              <span>—</span>
              <span :class="{ selected: endDate }">{{
                endDate ? endDate : "请选择结束时间"
              }}</span>
            </div>
            <img src="../../../../../assets/images/calendar.png" alt="" /></div
        ></van-cell-group>
        <h3>
          住房单价<i><img src="../../../../../assets/images/red-star.png" /></i>
        </h3>
        <van-cell-group class="cost-description">
          <van-field
            v-model="price"
            :disabled="type == 'details' ? true : false"
            type="number"
            @input="input('price', $event)"
            ref="price"
            placeholder="请输入金额"
          />
        </van-cell-group>
        <h3>其他消费</h3>
        <van-cell-group class="">
          <van-field
            v-model="otherValue"
            @input="input('otherValue', $event)"
            ref="otherValue"
            :disabled="type == 'details' ? true : false"
            type="number"
            placeholder="请输入金额"
          />
        </van-cell-group>
        <h3>
          费用描述<i><img src="../../../../../assets/images/red-star.png" /></i>
        </h3>
        <van-cell-group class="cost-description">
          <van-field
            v-model.trim="descriptionValue"
            type="textarea"
            :disabled="type == 'details' ? true : false"
            ref="descriptionValue"
            rows="1"
            placeholder="请输入费用描述"
            autosize
          />
        </van-cell-group>
        <h3>
          发票总额<i><img src="../../../../../assets/images/red-star.png" /></i>
        </h3>
        <van-cell-group class="">
          <van-field
            v-model="costValue"
            @input="input('costValue', $event)"
            ref="costValue"
            type="number"
            :disabled="type == 'details' ? true : false"
            placeholder="请输入费用金额(元)"
          />
        </van-cell-group>

        <t-p-vue
          type="酒店及住宿费"
          ref="TP"
          :data="data"
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
    <van-calendar v-model="show" type="range" @confirm="onConfirm" />
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
  import { getDay, iosKeyboard } from "../../../components/mixins/mixins";
  const addressData = provinceList;

  addressData.forEach((province) => {
    province.children = cityList[province.value];
    // province.children.forEach(city => {
    //   city.children = areaList[city.value];
    // });
  });
  let column2 = [];
  export default {
    data() {
      return {
        CascadePicker: null,
        price: "", //住房单价
        descriptionValue: "", //费用描述
        cityName: "", //城市
        otherValue: "", //其他消费
        costValue: "", //发票总额
        btnText: "",
        selectedIndex1: [0],

        value: "", //入住日期
      };
    },
    components: { headerVue, costTypeVue, TPVue },
    mixins: [cost_mixins, getDay, iosKeyboard],
    beforeRouteEnter(to, from, next) {
      next((vm) => {
        vm.price = "";
        vm.cityName = "";
        vm.otherValue = "";
        vm.value = "";
        vm.descriptionValue = "";
        vm.dayNum = "1";
        vm.selectedIndex1 = [0];
        vm.costValue = "";
        vm.data = [];
        vm.btn = [];
        vm.fromDate = "";
        vm.endDate = "";
        vm.TPSHOW = true;
        vm.cost = [];
        vm.$refs.TP.TPflag = false;
        vm.$refs.TP.TPdescriptionValue = "";
        vm.column1 = [];
        vm.btnText = "";

        for (let i in vm.$refs) {
          if (vm.$refs[i].$el) {
            vm.$refs[i].$el.classList.remove("errorFocus");
          } else {
            vm.$refs[i].classList.remove("errorFocus");
          }
        }

        if (vm.detailsData && Object.keys(JSON.parse(vm.detailsData)).length) {
          let detailsData = JSON.parse(vm.detailsData);
          console.log(detailsData);
          vm.value = detailsData.time;
          // vm.$refs.costType.btnText = detailsData;
          console.log(vm.dayNum);
          vm.dayNum = detailsData.info4;
          console.log(vm.dayNum);
          vm.price = detailsData.info3;
          vm.otherValue = detailsData.info5;
          vm.btnText = detailsData.smallTypeName;
          vm.costValue = detailsData.money;
          vm.cityName = detailsData.info1;
          vm.descriptionValue = detailsData.note;
          vm.fromDate = detailsData.time;
          vm.endDate = detailsData.info2;

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
    watch: {
      dayNum(newVal) {
        console.log(newVal);
        if (this.type != "details") {
          this.costValue =
            Number(this.price || 0) * newVal + Number(this.otherValue || 0);
        }
      },
    },
    activated() {
      _getData("category/getCategory", {
        type: "2",
        parentId: "459",
        typeName: "bill",
      }).then((data) => {
        column2 = _.map(data, (v) => {
          return { text: v.wordBook, value: v.wordBook, id: v.id };
        });
      });
    },
    methods: {
      city() {
        if (!this.CascadePicker) {
          //console.log(addressData);

          this.CascadePicker = this.$createPicker({
            data: [column2],
            selectedIndex: this.selectedIndex1,
            onSelect: (selectedVal, selectedIndex, selectedText) => {
              this.cityName = selectedText.join("");

              this.selectedIndex1 = selectedIndex;
              this.$refs.city.$el.classList.remove("errorFocus");
            },
          });
          // this.CascadePicker = this.$createCascadePicker({
          //   data: ["北上广深", "省级", "县级市", "地级市"],
          //   onSelect: (selectedVal, selectedIndex, selectedText) => {
          //     this.cityName = selectedText.join("");
          //     this.$refs.city.$el.classList.remove("errorFocus");
          //   }
          // });
        }

        this.CascadePicker.show();
      },
      input(name, val) {
        if (val == "") {
          this.$refs[name].$el.classList.add("errorFocus");
        } else {
          this.$refs[name].$el.classList.remove("errorFocus");
        }

        //计算消费总额
        if (name == "price" || name == "otherValue") {
          this.costValue =
            Number(this.price || 0) * this.dayNum + Number(this.otherValue || 0);
        }
        if (name == "price" || name == "otherValue" || name == "costValue") {
          if (this[name].indexOf(".") != -1) {
            this[name] = this[name].substr(0, this[name].indexOf(".") + 3);
          }
        }
      },
      save(i) {
        if (this.cityName == "") {
          this.$refs.city.$el.classList.add("errorFocus");
          this.$refs.container.scrollTo(0, 120);
          return;
        }
        // else if (this.fromDate == "" || this.endDate == "") {
        //   //入住-离开时间

        //   this.$refs.time.classList.add("errorFocus");
        //   this.$refs.container.scrollTo(0, 150);
        //   return;
        // }
        else if (this.price == "") {
          //费用单价
          this.$refs.price.$el.classList.add("errorFocus");
          this.$refs.price.focus();
          return;
        } //  else if (this.otherValue == "") {
        //   //其他消费
        //   this.$refs.otherValue.$el.classList.add("errorFocus");
        //   this.$refs.otherValue.focus();
        //   return;
        // }
        else if (this.costValue == "") {
          //发票总额
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
            info1: this.cityName,
            info2: this.endDate,
            info3: this.price,
            info4: this.dayNum,
            info5: this.otherValue,
            info6: "",
            money: this.costValue,
            note: this.descriptionValue, //费用描述
            payed: "",
            countAndSumMoney: this.countAndSumMoney,
            smallType: this.$refs.costType.btnText.id,
            smallTypeName: this.$refs.costType.btnText.wordBook,
            time: this.fromDate,
            TP: this.$refs.TP.TPflag ? this.$refs.TP.TP : "",
            tpnote: this.$refs.TP.TPdescriptionValue || "",
            tptype: this.$refs.TP.TPflag ? this.$refs.TP.TPtype : "",
            type: this.$route.query.id,
            // withhold: 0,
            // withholdNote: ""
          },
        ];
        this.cost = [...this.cost, ...arg];
        if (i == 1) {
          this.$route.query.cost = JSON.stringify(this.cost);
          this.$router.go(-1);
        } else {
          this.cityName = "";
          this.costValue = "";
          this.descriptionValue = "";
          this.price = "";
          this.otherValue = "";
          this.dayNum = 1;
          this.selectedIndex1 = [0];
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
    },
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
          padding: 0 !important;
          &::after {
            border: 0;
          }
          @include placeholder;
          .van-cell {
            display: flex;
            align-items: center;
            height: 100%;
            padding: 11.5px 13px;
            border: 1px solid #fff;
            /deep/ input {
              display: flex;
              align-items: center;
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
            border: 1px solid #fff;
            > img {
              height: 20px;
            }
            .left {
              display: flex;
              > span {
                &:nth-child(2) {
                  display: flex;
                  width: 9px;
                  overflow: hidden;
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
