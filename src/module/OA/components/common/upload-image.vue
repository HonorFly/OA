<template>
  <div class="upload-image">
    <van-uploader
      v-model="fileList"
      :multiple="true"
      :max-count="5"
      :after-read="afterRead"
      :before-delete="deleteImg"
      :before-read="asyncBeforeRead"
      :deletable="deletable"
      :class="!deletable && 'disabled'"
    />
  </div>
</template>

<script>
  /**
   * @name 上传图片组件
   * @props
   *
   * *父组件data必须包含fileList数组
   **/
  import { uploadImage } from "../../service/getData";
  import _ from "lodash";

  export default {
    data() {
      return {
        fileList: [
          // { url: "https://img.yzcdn.cn/vant/leaf.jpg" }
          // Uploader 根据文件后缀来判断是否为图片文件
          // 如果图片 URL 中不包含类型信息，可以添加 isImage 标记来声明
          //{ url: "https://cloud-image", isImage: true }
        ],
        fileArr: [],
        loading: false
      };
    },
    props: {
      type: {},
      deletable: {
        //是否展示删除按钮
        type: Boolean,
        default: true
      },
      file: {
        type: Array
      }
    },
    watch: {
      file(newVal) {
        // console.log(newVal);
        this.fileList = newVal;
        this.fileArr = [...this.fileList];
      }
    },
    methods: {
      deleteImg(file) {
        console.log(file);
        // console.log(this.fileArr);
        return new Promise((resolve, reject) => {
          _.each(this.fileArr, o => {
            console.log(o);
            if (file.file && o.name == file.file.name) {
              this.fileArr = _.without(this.fileArr, o);
            } else if (o.name == file.name) {
              this.fileArr = _.without(this.fileArr, o);
            }
          });
          this.$emit("updata", this.fileArr);
          resolve();
        });
      },
      asyncBeforeRead(file) {
        return new Promise((resolve, reject) => {
          // console.log(file);
          // console.log(this.fileList);
          // _.each(this.fileList, v => {
          //   if (
          //     (v.file && v.file.name == file.name && v.file.size == file.size) ||
          //     v.name == file.name
          //   ) {
          //     this.$toast("请不要上传同一张图片");
          //     reject();
          //   }
          // });
          resolve();
        });
      },
      afterRead(file) {
        console.log(file.length);

        this.loading = true;
        var imgUrl, processFile, formFile;
        if (!file.length) {
          file = [file];
        }
        console.log(file);
        _.each(file, o => {
          if (o.file.size < 524288) {
            //小于500kb
            formFile = o.file;
            this.upload(o, formFile);
          } else {
            const img = new Image();
            img.src = o.content;
            this.compress(img, o.file.type, compressRes => {
              processFile = this.processData(compressRes);
              formFile = new File(processFile, o.file.name, {
                type: o.file.type
              });
              this.upload(o, formFile);
            });
          }
        });
      },
      compress(img, type, cb) {
        img.onload = () => {
          const limitWidth = arguments[3] ? arguments[3] : 640;
          const width = img.width > limitWidth ? limitWidth : img.width;
          const height =
            img.width > limitWidth
              ? parseInt((img.height * limitWidth) / img.width)
              : img.height;
          const canvas = document.createElement("canvas");
          const ctx = canvas.getContext("2d");
          canvas.width = width;
          canvas.height = height;
          ctx.fillStyle = "#fff";
          ctx.fillRect(0, 0, canvas.width, canvas.height);
          ctx.drawImage(img, 0, 0, width, height);
          cb(canvas.toDataURL(type, 0.5));
        };
      },
      processData(dataUrl) {
        var binaryString = window.atob(dataUrl.split(",")[1]),
          arrayBuffer = new ArrayBuffer(binaryString.length),
          intArray = new Uint8Array(arrayBuffer);
        for (var i = 0, j = binaryString.length; i < j; i++) {
          intArray[i] = binaryString.charCodeAt(i);
        }
        return [intArray];
      },
      upload(file, formFile) {
        // 此时可以自行将文件上传至服务器
        let formData = new FormData();
        formData.append("file", formFile);
        let obj = {};
        uploadImage("upload/imageUpload", formData)
          .then(data => {
            console.log("上传数据：：", data);
            this.loading = false;
            obj.name = data.imageList[0].fileName;
            obj.url = data.imageList[0].imageurl;
            return obj;
          })
          .then(obj => {
            // console.log(obj);
            // console.log(this.fileList);
            this.fileArr.push(obj);
            this.$emit("updata", this.fileArr);
          });
      }
    }
  };
</script>

<style lang="scss" scoped>
  @import "../../../../../static/scss/_commonScss";
  .upload-image {
    .van-uploader {
      min-height: 101px;
      display: flex;
      align-items: center;
      /deep/ .van-uploader__wrapper {
        .van-uploader__preview {
          margin-right: 10px;
          margin-bottom: 10px;
          .van-uploader__preview-image {
            height: 101px;
            width: 101px;
            background: #e9e9e9;
            border-radius: 3px;
          }
          .van-uploader__file {
            height: 101px;
            width: 101px;
          }
        }
        .van-uploader__upload {
          height: 101px;
          width: 101px;
          background: #e9e9e9;
          border-radius: 3px;
        }
      }
      &.disabled {
        /deep/ .van-uploader__upload {
          display: none !important;
        }
      }
    }
  }
</style>