<!--
 * @Author: lxb
 * @Date: 2021-08-04 22:56:58
 * @Description:
 * @LastEditTime: 2021-08-05 10:25:47
-->
<template>
  <div class="train-video">
    <header-vue name="培训视频"></header-vue>
    <div class="container">
      <div id="myPDF" v-if="type == 'pdf'"></div>
      <video :src="url" autoplay v-if="type == 'mp4'" controls></video>
    </div>
  </div>
</template>

<script>
  import headerVue from "../../components/header/header.vue";
  export default {
    data() {
      return {
        src: "",
        type: "",
      };
    },
    props: ["url"],
    components: { headerVue },
    activated() {
      console.log(this.url);
      this.src = "";
      this.type = "";
      if (this.url.endsWith(".mp4")) {
        this.type = "mp4";
      } else if (this.url.endsWith(".pdf")) {
        this.type = "pdf";
      }
      if (this.type == "pdf") {
        this.$nextTick(() => {
          console.log($("#myPDF"));
          $("#myPDF").pdf({ source: this.url });
        });
      }
    },
  };
</script>

<style lang="scss" scoped>
  .train-video {
    position: fixed;
    .container {
      overflow-y: auto;
      video {
        margin-top: 20px;
        width: 100%;
      }
      /deep/ .pdf-outerdiv {
        transform: none !important;
        left: 0 !important;
        width: 100% !important;
        .pdf-tabs {
          width: 100% !important;
        }
        .pdf-toolbar {
          width: 100% !important;
        }
        .pdf-viewer {
          border: none !important;
          box-shadow: none !important;
          width: 100% !important;
          .pdf-drag {
            width: 100% !important;
            .pdf-canvas {
              width: 100% !important;
            }
          }
        }
      }
    }
  }
</style>
