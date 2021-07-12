<template>
  <div id="loading">
    <img src="../../../../../static/images/noData.png" />
  </div>
</template>

<script>
  import _ from "lodash";
  export default {
    data() {
      return {};
    }
  };
</script>

<style lang="scss" scoped>
  #loading {
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
  }
</style>