<template>
  <div class="vanSearch">
    <form action="/">
      <van-search
        ref="search"
        v-model.trim="value"
        :placeholder="placeholder"
        show-action
        shape="round"
        @focus="onFocus"
        @search="onSearch"
        @input="onInput"
        @blur="onBlur"
        @clear="onSearch"
      >
        <img slot="left-icon" src="../../../../assets/images/search.png" />
        <div slot="action" @click="cancel">{{ text }}</div>
      </van-search>
    </form>
  </div>
</template>

<script>
  export default {
    data() {
      return {
        value: this.defaultValue,
        text: "取消"
      };
    },
    props: {
      placeholder: {
        type: String,
        default: "请输入搜索内容"
      },
      defaultValue: {},
      controlText: {}
    },
    watch: {
      defaultValue(newVal) {
        console.log("搜索默认值：：：", newVal);
        this.value = newVal;
      }
    },
    methods: {
      cancel() {
        if (this.text == "搜索") {
          this.onSearch();
        } else {
          this.value = "";
          this.$emit("cancelSearch");
        }
      },
      onSearch() {
        console.log(this.$refs);
        this.text = "取消";
        this.$emit("onSearch", this.value);
      },
      onFocus() {},
      onBlur() {
        // var height = document.getElementById("app").clientHeight;

        if (this.value) {
          this.$children[0].focused = true;
        } else {
          this.$children[0].focused = false;
        }
      },
      onInput() {
        if (this.controlText == "cancel") {
          this.text = "取消";
        } else {
          if (this.value.trim() != "") {
            this.text = "搜索";
          } else {
            this.text = "取消";
          }
        }
        this.$emit("onInput", this.value);
      }
    }
  };
</script>

<style lang="scss" scoped>
  @import "../../../../../static/scss/_commonScss";
  .vanSearch {
    background: $base-background;
    height: 55px;
    display: flex;
    align-items: center;
    padding: 0 13px;

    form {
      display: flex;
      width: 100%;
    }
    .van-search {
      display: flex;
      width: 100%;
      padding: 0;
      background: transparent !important;
      .van-search__content {
        background: #fff;
        height: 36px;
        padding-left: 15px;
        .van-cell {
          display: flex;
          align-items: center;
          @include placeholder();
          /deep/ .van-field__left-icon {
            width: 15.45px;
            height: 14.55px;
            display: flex;
            align-items: center;
            justify-content: center;
            img {
              width: 100%;
              height: 100%;
            }
          }
        }
      }
      .van-search__action {
        padding: 0;

        color: #f10215;
        font-family: PingFangSC-Regular;
        font-size: 14px;
        padding-left: 4px;
        > div {
          height: 35px;
          width: 35px;
          display: flex;

          align-items: center;
          border-radius: 18px;
          justify-content: center;
          &:active {
            background: $button-active-color;
          }
        }
      }
    }
  }
</style>