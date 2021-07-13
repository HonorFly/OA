<template>
  <div class="cost-type">
    <div class="title" v-if="isShowTitle">
      <h2>
        <div>
          费用种类
          <i><img src="../../../../assets/images/red-star.png"/></i>
        </div>
        <span :class="{ isDetail: !isDisabled }">
          <span>{{ btnText.wordBook }}</span>
        </span>
      </h2>
      <p v-if="isDisabled">
        {{ btnText.note }}年你已报销 {{ btnText.wordBook }}
        <span>{{ btnText.num }}</span>
        次，累计
        <span>{{ btnText.money }}</span>
        元。
      </p>
    </div>
    <ul v-if="isShowList">
      <li
        v-for="(item, i) in costTypeArr"
        :class="[
          item.wordBook == btnActivetext && 'active',
          { detailShow: !isDisabled }
        ]"
        :key="i"
        @click="isDisabled && btnHundleClick(item, i)"
      >
        <span>{{ item.wordBook }}</span>
      </li>
    </ul>
  </div>
</template>

<script>
  export default {
    data() {
      return {
        btnActivetext: "",
        btnText: {}
      };
    },
    props: {
      costTypeArr: {
        type: Array,
        required: true,
        default: []
      },
      isShowTitle: {
        type: Boolean,
        default: true
      },
      ButtonText: {
        type: String
      },
      isDisabled: {
        type: Boolean,
        default: true
      },
      isShowList: {
        type: Boolean,
        default: true
      }
    },
    created() {
      if (!this.ButtonText && this.costTypeArr.length) {
        this.btnText = this.costTypeArr[0];
        this.btnActivetext = this.costTypeArr[0].wordBook;
        console.log(this.btnActivetext);
      } else {
        if (this.costTypeArr.length) {
          this.btnActivetext = this.ButtonText;
          this.btnText = _.filter(this.costTypeArr, {
            wordBook: this.ButtonText
          })[0];
        }
      }
    },
    activated() {
      // this.btnText = {};
      // this.btnActivetext = "";
      // console.log(this.costTypeArr, this.ButtonText);
    },
    watch: {
      costTypeArr(newVal) {
        console.log(newVal);
        if (newVal.length) {
          this.btnActivetext = "";

          if (!this.ButtonText) {
            this.btnText = newVal[0];
            this.btnActivetext = newVal[0].wordBook;
            this.$emit("btnHundleClick", newVal[0]);
          } else {
            this.btnActivetext = this.ButtonText;
            this.btnText = _.filter(newVal, { wordBook: this.ButtonText })[0];
            this.$emit("btnHundleClick", this.btnText);
          }
        }
      }
    },

    methods: {
      btnHundleClick(item, i) {
        this.btnActivetext = item.wordBook;
        this.btnText = item;
        this.$emit("btnHundleClick", item, i);
      }
    }
  };
</script>

<style lang="scss" scoped>
  @import "../../../../../static/scss/_commonScss";

  .cost-type {
    background: #f6f6f6;
    padding: 17px 0 0;
    .title {
      // height: 63px;
      padding: 0 13px;
      h2 {
        font-family: PingFangSC-Medium;
        font-size: 15px;
        color: #222222;
        font-weight: bold;
        //line-height: 21px;
        margin-bottom: 10px;
        // padding-bottom: 17px;
        display: flex;
        align-items: center;
        justify-content: space-between;
        > div {
          font-weight: bold;
          display: flex;
        }
        i {
          img {
            width: 8px;
            height: 7px;
            margin-bottom: 6px;
            margin-left: 5px;
          }
        }
        > span {
          height: 30px;
          min-width: 88px;
          display: flex;
          align-items: center;
          justify-content: center;
          background-image: url("../../../../../static/images/btn-background.png");
          //background: #f10215;
          //border-radius: 5px;
          background-size: 100% 100%;
          font-family: PingFangSC-Regular;
          font-size: 14px;
          color: #ffffff;
          padding: 0 9px;
        }
        .isDetail {
          margin-bottom: 10px;
        }
      }

      p {
        font-family: PingFangSC-Regular;
        font-size: 12px;
        color: #4176ff;
        line-height: 17px;
        margin-bottom: 7px;
        span {
          color: #f96a0e;
        }
      }
    }
    > ul {
      background: #fff;
      display: flex;
      // flex-direction: row;
      flex-wrap: wrap;
      padding: 18px 13px 4px;
      // justify-content: space-between;
      // margin-bottom: -14px;
      li {
        height: 40px;
        width: 107px;
        display: flex;
        align-items: center;
        font-family: PingFangSC-Regular;
        font-size: 14px;
        color: #666666;
        background: #f4f4f4;
        border-radius: 4px;
        justify-content: center;
        margin-bottom: 14px;
        margin-right: 14px;
        &:nth-child(3n) {
          margin-right: 0;
        }
        > span {
          text-align: center;
          padding: 3px 0;
        }
        &.active {
          background-image: linear-gradient(
            119deg,
            rgba(241, 2, 21, 0.1) 0%,
            rgba(255, 137, 28, 0.1) 100%
          );

          position: relative;
          > span {
            font-family: PingFangSC-Medium;
            font-size: 15px;

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
            background: url("../../../../assets/images/pitch-on.png");
            background-size: 100% 100%;
            display: flex;
            height: 20px;
            width: 20px;
            position: absolute;
            right: 0;
            bottom: 0;
          }
        }
        &.detailShow {
          &::after {
            display: none;
          }
        }
      }
    }
  }
</style>
