<template>
  <van-collapse v-model="activeNames" :border="false" @change="collapseChange">
    <van-collapse-item name="1" ref="collapse" :disabled="disabled">
      <h3 slot="title"><i></i>TP<span>(选中填写TP种类)</span></h3>
      <h4>TP费用种类</h4>
      <div class="select" @click="!disabled && select()">
        {{ TP }}
        <img
          v-if="!disabled"
          src="../../../../assets/images/arrow-right.png"
          alt=""
        />
      </div>
      <cost-type-vue
        v-if="btn.length"
        :ButtonText="btnText"
        :costTypeArr="btn"
        :isShowTitle="false"
        :isDisabled="!disabled"
        @btnHundleClick="btnHundleClick"
      ></cost-type-vue>
      <h4 class="description">TP费用描述</h4>
      <van-field
        v-model="TPdescriptionValue"
        type="textarea"
        rows="1"
        :disabled="disabled"
        placeholder="请输入费用描述"
        autosize
      />
    </van-collapse-item>
  </van-collapse>
</template>

<script>
  import costTypeVue from "./cost-type.vue";
  import { _getData } from "../../service/getData";

  export default {
    data() {
      return {
        btn: [],
        btnText: "",
        TPtypeId: "",
        column1: [],
        picker1: null,
        activeNames: [],
        TP: this.type, //TP大类
        selectedIndex1: [0],
        TPflag: false,
        TPtype: "", //TP类型
        TPdescriptionValue: "" //TP费用描述
      };
    },
    props: {
      type: {
        type: String
      },
      data: {
        type: Array
      },
      disabled: {
        type: Boolean,
        default: false
      }
    },
    activated() {
      console.log(this);
      this.TPflag = false;
      this.TPdescriptionValue = "";
      this.TPtype = "";
      this.TPtypeId = "";
      this.TP = this.type;
      this.btn = [];
      this.btnText = "";
      this.activeNames = [];
    },
    created() {
      //   _getData("category/getSmallCategory", {}).then(data => {
      //     this.data = data;
      //     this.btn = _.filter(data, o => {
      //       return o.id == this.$route.query.id;
      //     })[0].dictionaryList;
      //     this.column1 = _.map(data, v => {
      //       return { text: v.wordBook, value: v.wordBook, id: v.id };
      //     });
      //   });
    },
    watch: {
      data(newVal) {
        console.log(newVal);
        console.log(this.TP);
        if (newVal.length) {
          if (this.TP == "") {
            this.TP = _.find(newVal, o => {
              return _.find(o.dictionaryList, v => {
                return v.wordBook.trim() === this.btnText;
              });
            }).wordBook;
          }

          this.btn = _.filter(newVal, o => {
            return o.wordBook == this.TP;
          })[0].dictionaryList;

          // this.btn = _.filter(newVal, o => {
          //   return o.wordBook == this.type;
          // })[0].dictionaryList;

          this.column1 = _.map(newVal, v => {
            return { text: v.wordBook, value: v.wordBook, id: v.id };
          });

          this.TPtype = this.btn[0].wordBook;
          this.selectedIndex1 = [
            _.indexOf(
              newVal,
              _.filter(newVal, o => {
                return o.wordBook == this.TP;
              })[0]
            )
          ];
        }
      },
      btnText(newVal) {
        console.log(newVal);
      }
    },
    methods: {
      btnHundleClick(item) {
        console.log(item);
        this.TPtype = item.wordBook;
        this.TPtypeId = item.id;
      },
      collapseChange(activeNames) {
        this.TPflag = !this.TPflag;
      }, //选择TP费用种类
      select() {
        if (!this.picker1) {
          this.picker1 = this.$createPicker({
            data: [this.column1],
            selectedIndex: this.selectedIndex1,
            onSelect: (selectedVal, selectedIndex, selectedText) => {
              this.selectedIndex1 = selectedIndex;
              this.TP = selectedText.join("");
              this.btnText = "";
              this.btn = this.data[selectedIndex[0]].dictionaryList;
            }
          });
        }
        this.picker1.show();
      }
    },
    components: { costTypeVue }
  };
</script>

<style lang="scss" scoped>
  @import "../../../../../static/scss/_commonScss";
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
  }
  .van-collapse {
    background: #f6f6f6;
    .van-collapse-item {
      /deep/ .van-cell {
        padding: 0;
        .van-cell__title {
          h3 {
            display: flex;
            align-items: center;
            justify-content: flex-start;
            i {
              display: flex;
              width: 18px;
              height: 18px;
              border: 1px solid #999999;
              border-radius: 9px;
              margin-right: 9px;
              position: relative;
              &::after {
                width: 28px;
                height: 27px;
                //transform: scale(0.7);
                //  border-radius: 14px;
                display: flex;
                left: -6px;
                transition: opacity 0.3s;
                top: -5px;
                position: absolute;
                content: "";
                background: url("../../../../assets/images/TP-selected.png")
                  no-repeat center;
                background-size: 100% 100%;
                opacity: 0;
              }
            }
            span {
              font-family: PingFangSC-Regular;
              font-size: 14px;
              color: #aaaaaa;
              margin-left: 9px;
            }
          }
        }
        .van-icon {
          display: none;
        }
        &.van-collapse-item__title--expanded {
          .van-cell__title {
            h3 {
              i {
                &::after {
                  opacity: 1;
                }
              }
            }
          }
        }
      }
      /deep/ .van-collapse-item__wrapper {
        .van-collapse-item__content {
          padding: 0px 13px;
          padding-bottom: 10px;
          h4 {
            font-family: PingFangSC-Regular;
            font-size: 15px;
            color: #222222;
            line-height: 21px;
            margin-bottom: 10px;
            padding-top: 20px;
            &.description {
              padding-top: 6px;
            }
          }
          .cost-type {
            padding-top: 0;
            > ul {
              padding: 0;
              padding-top: 15px;
            }
          }
          .select {
            height: 47px;
            background: #f6f6f6;
            border-radius: 5px;
            display: flex;
            align-items: center;
            justify-content: space-between;
            padding: 0 13px;
            padding-right: 5px;
            color: #222;
            font-size: 14px;
            // font-weight: bold;
            img {
              height: 19px;
            }
          }
          @include placeholder();
          .van-field {
            min-height: 85px;
            background: #f6f6f6;
            border-radius: 5px;
            padding: 10px;
          }
        }
      }
    }
  }
</style>