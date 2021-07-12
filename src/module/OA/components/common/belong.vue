<template>
  <div class="affiliation" id="belong">
    <h3>
      <span><img src="../../../../assets/images/affiliation.png"/></span>
      费用归属
      <i><img src="../../../../assets/images/red-star.png"/></i>
    </h3>
    <!-- 填写 -->
    <ul>
      <li
        @click="type != 'details' && selectCompany()"
        :class="{
          active: companyActive,
          highlight: company != '请选择归属公司'
        }"
      >
        {{ company }}
        <img
          v-if="type != 'details'"
          src="../../../../assets/images/arrow-right.png"
        />
      </li>
      <li
        @click="type != 'details' && selectCost()"
        :class="{
          active: costActive,
          highlight: cost != '请选择成本中心'
        }"
      >
        {{ cost }}
        <img
          v-if="type != 'details'"
          src="../../../../assets/images/arrow-right.png"
        />
      </li>
    </ul>
  </div>
</template>

<script>
  import { _getData } from "../../service/getData";
  import _ from "lodash";
  let column1 = [];
  let column2 = [];
  export default {
    data() {
      return {
        company: "请选择归属公司",
        companyId: "",
        cost: "请选择成本中心",
        costId: "",
        companyActive: false, //未填写是显示border
        costActive: false,
        // companySelected: false,
        // costSelected: false,
        picker1: null,
        picker2: null
      };
    },
    props: {
      disabled: {
        //是否显示箭头
        type: [Boolean],
        default: false
      },
      type: {
        type: String
      },
      data: {
        type: Object
      }
    },
    // activated() {

    // },
    activated() {
      this.companyActive = false;
      this.costActive = false;

      //console.log(this.data);
      //if (this.type != "details") {
      //成本中心
      _getData("costCenter/costCenterList").then(data => {
        column2 = _.map(data, v => {
          return { text: v.centerName, value: v.centerName, id: v.id };
        });
      });

      //归属公司

      _getData("company/companyList").then(data => {
        column1 = _.map(data, v => {
          return { text: v.chinaName, value: v.chinaName, id: v.id };
        });
      });
      //}
    },
    methods: {
      selectCompany() {
        if (!this.picker1) {
          this.picker1 = this.$createPicker({
            data: [column1],
            selectedIndex: this.selectedIndex1,
            onSelect: (selectedVal, selectedIndex, selectedText) => {
              this.company = selectedText.join("");
              this.companyId = column1[selectedIndex[0]].id;
              this.selectedIndex1 = selectedIndex;
              this.companyActive = false;
            }
          });
        }
        this.picker1.show();
      },
      selectCost() {
        if (!this.picker2) {
          this.picker2 = this.$createPicker({
            data: [column2],
            selectedIndex: this.selectedIndex2,
            onSelect: (selectedVal, selectedIndex, selectedText) => {
              this.cost = selectedText.join("");
              this.costId = column2[selectedIndex[0]].id;
              this.selectedIndex2 = selectedIndex;
              this.costActive = false;
            }
          });
        }
        this.picker2.show();
      }
    },
    watch: {
      data(newVal, oldVal) {
        console.log(newVal);
        if (Object.keys(newVal).length) {
          this.company = newVal.chinaName || "请选择归属公司";
          this.companyId = newVal.companyId || "";
          this.cost = newVal.centerName || "请选择成本中心";
          this.costId = newVal.costCenter || "";
        } else {
          this.company = "请选择归属公司";
          this.cost = "请选择成本中心";
          this.companyId = "";
          this.costId = "";
        }
      }
    }
  };
</script>

<style lang="scss" scoped>
  @import "../../../../../static/scss/_commonScss";
  h3 {
    font-family: PingFangSC-Medium;
    font-size: 15px;
    font-weight: bold;
    color: #222222;
    display: flex;
    align-items: center;
    font-weight: bold;
    margin-bottom: 10px;
    &.detailDisabled {
      //color: #666;
      font-weight: normal;
      img {
        opacity: 1;
      }
    }
    span {
      height: 22px;
      width: 22px;
      display: flex;
      align-items: center;
      font-weight: bold;
      margin-right: 10px;
      &.detailDisabled {
        color: #666;
        font-weight: normal;
        img {
          opacity: 0.3;
        }
      }
    }
  }
  .affiliation {
    h3 {
      span {
        img {
          width: 20px;
          height: 19px;
        }
      }
      i {
        img {
          width: 8px;
          height: 7px;
          margin-bottom: 6px;
          margin-left: 5px;
        }
      }
    }
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
        border: 1px solid #f8f8f8;
        > img {
          height: 19px;
        }
        &.highlight {
          color: #323233;
        }
        &.active {
          border: 1px solid $button-color;
        }
        &:first-child {
          margin-bottom: 10px;
        }
      }
    }
  }
</style>
