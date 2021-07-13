<template>
  <div class="footer">
    <van-tabbar v-model="active">
      <van-tabbar-item v-for="(item, i) in footer" :key="i" @click="tab(i)">
        <span>{{ item.name }}</span>
        <img
          slot="icon"
          slot-scope="props"
          :src="
            `../static/images/${props.active ? item.iconActive : item.icon}`
          "
        />
      </van-tabbar-item>
    </van-tabbar>
  </div>
</template>

<script>
  /**
   * ?van-tabbar-item  设置dot属性后，会在图标右上角展示一个小红点。info="3" 设置info属性后，会在图标右上角展示相应的徽标;v-model默认绑定选中标签的索引值，通过修改v-model即可切换选中的标签;通过 icon 插槽自定义图标，可以通过 slot-scope 判断标签是否选中
   */
  export default {
    data() {
      return {
        active: this.currentIndex
      };
    },
    props: {
      footer: {
        type: Array
      },
      currentIndex: {
        type: Number,
        default: 0
      }
    },
    watch: {
      currentIndex(newVal) {
        this.active = newVal;
      }
    },
    methods: {
      tab(i) {
        this.$emit("tab", i);
      }
    }
  };
</script>

<style lang="scss" scoped>
  @import "../../../../../static/scss/_commonScss";
  .footer {
    display: flex;
    height: 50px;
    align-items: center;
    box-shadow: $base-box-shadow;
    @media only screen and (device-width: 375px) and (device-height: 812px) and (-webkit-device-pixel-ratio: 3),
      only screen and (device-width: 414px) and (device-height: 896px) and (-webkit-device-pixel-ratio: 2),
      only screen and (device-width: 414px) and (device-height: 896px) and (-webkit-device-pixel-ratio: 3) {
      height: 84px !important;
      //padding-bottom: constant(safe-area-inset-bottom);
    }
    /deep/ .van-tabbar {
      //height: 100%;
      height: 50px;
      @include iphone-X-footer;
      flex: 1;
      display: flex;
      align-items: center;
      align-self: baseline;
      .van-tabbar-item {
        height: 100%;
      }
      .van-tabbar-item--active {
        span {
          color: #f10215;
        }
      }
    }
  }
</style>
