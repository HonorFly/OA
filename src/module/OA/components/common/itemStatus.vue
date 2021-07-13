<template>
  <div id="item-status">
    <img
      v-if="status == 0"
      src="../../../../assets/images/status/submit.png"
      alt=""
    />
    <img
      v-if="status == 1"
      src="../../../../assets/images/status/approve.png"
      alt=""
    />
    <img
      v-if="status == 2"
      src="../../../../assets/images/status/reject.png"
      alt=""
    />
    <img
      v-if="status == 3"
      src="../../../../assets/images/status/agreed.png"
      alt=""
    />
    <img
      v-if="status == 4"
      src="../../../../assets/images/status/backout.png"
      alt=""
    />
    <img
      v-if="status == 5"
      src="../../../../assets/images/status/completed.png"
      alt=""
    />
    <img
      v-if="status == 6"
      src="../../../../assets/images/status/loaned.png"
      alt=""
    />
    <img
      v-if="status == 7"
      src="../../../../assets/images/status/returning.png"
      alt=""
    />
  </div>
</template>

<script>
  export default {
    data() {
      return {};
    },
    props: {
      status: {
        type: [String, Number]
      }
    }
  };
</script>

<style lang="scss" scoped>
  @import "../../../../../static/scss/_commonScss";
  @import "../../../../../static/scss/_dialog";
  #item-status {
    display: flex;
    height: 24px;
    width: 56px;
    position: absolute;
    top: 10px;
    right: 10px;
    img {
      height: 100%;
    }
  }
</style>