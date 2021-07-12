<template>
  <div id="noData">
    <img src="../../../../../static/images/noData.png" />
    <span>暂无数据</span>
  </div>
</template>

<script>
  import _ from "lodash";
  export default {
    data() {
      return {};
    },
    props: {},
    mounted() {}
  };
</script>

<style lang="scss" scoped>
  #noData {
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
    img {
      width: 142px;
      height: 154px;
      margin-bottom: 20px;
    }
  }
</style>