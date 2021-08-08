<template>
  <div id="dispatch-edit">
    <header-vue name="编辑派工" ></header-vue>
    <div class="container" ref="container">
      <div class="top">
        <!-- <h2>编辑派工</h2> -->
        <div class="number">
          <h3>
            <span>
              <img
                src="../../../../assets/images/dispatchNo.png"
                width="20"
                height="21"
              />
            </span>
            派工单号
          </h3>
          <span>{{ details.sn }}</span>
        </div>
        <div class="common description">
          <h3>
            <span>
              <img
                src="../../../../assets/images/faultDescribe.png"
                width="20"
                height="21"
              />
            </span>
            故障描述
          </h3>
          <van-field
            v-model="details.faultDescribe"
            type="textarea"
            autosize
            rows="1"
            :disabled="true"
          />
        </div>
        <div class="common content">
          <h3>
            <span>
              <img
                src="../../../../assets/images/serviceContent.png"
                width="20"
                height="21"
              />
            </span>
            服务内容
          </h3>
          <van-field
            v-model="details.serviceContent"
            type="textarea"
            autosize
            rows="1"
            :disabled="true"
          />
        </div>
        <div class="upload">
          <h3>
            <span>
              <img
                src="../../../../assets/images/dispatchUpload.png"
                width="20"
                height="21"
              />
            </span>
            工单
          </h3>
          <upload-image-vue
            :deletable="true"
            :file="fileList"
            @updata="updata"
            ref="upload"
          ></upload-image-vue>
        </div>
        <div class="applyReason">
          <h3>
            <span><img src="../../../../assets/images/explain.png" /></span>
            备注
          </h3>
          <van-field
            ref="note"
            :class="{
              selected: details.note,
              errorFocus: noteFlag && !details.note,
            }"
            v-model="details.note"
            placeholder="请输入备注"
            type="textarea"
            autosize
            rows="1"
          />
        </div>
        <div class="useTime" id="useTime">
          <h3>
            <span>
              <img src="../../../../assets/images/time.png" />
            </span>
            服务时间
          </h3>
          <ul>
            <service-time-vue
              ref="time"
              v-for="(item, index) in dispatchItem"
              :key="index"
              :data="dispatchItem"
              :index="index"
              @handle="clickHandle"
            ></service-time-vue>
          </ul>
        </div>
      </div>
    </div>
    <footer-cancel-submit-vue @submit="submit"></footer-cancel-submit-vue>
  </div>
</template>

<script>
  import headerVue from "../../components/header/header.vue";
  import footerCancelSubmitVue from "../../components/footer/footer-save";
  import costTypeVue from "../../components/common/cost-type.vue";
  import uploadImageVue from "../../components/common/upload-image.vue";
  import serviceTimeVue from "../../components/common/serviceTime.vue";
  import { _getData } from "../../service/getData";
  import { mapMutations } from "vuex";
  import { getDay, iosKeyboard } from "../../components/mixins/mixins";

  export default {
    data() {
      return {
        dispatchItem: [],
        file: [],
        fileList: [],
        details: {},
        noteFlag: false,
        submitFlag: false,
        scrollTop: 0,
      };
    },
    mixins: [getDay, iosKeyboard],
    props: ["type", "isApproval"],
    activated() {
      this.dispatchItem = [];
      this.file = [];
      this.fileList = [];
      this.scrollTop = 0;
      this.details = {};
      this.submitFlag = false;
      this.noteFlag = false;
      this.getDispatchDetail();
    },
    methods: {
      ...mapMutations(["setTransition"]),
      clickHandle(val) {
        if (val === "add") {
          this.dispatchItem.push({fromTime:"",endTime:'',hours:'',travelHours:''});
        } else {
          this.dispatchItem.pop();
        }
      },
      submit(val) {
        console.log(this.details,this.$refs.time[0].data)
        const times = this.$refs.time[0].data;
        if(this.file.length===0){
          this.$toast("请上传工单照片");
          return;
        }

          if (!this.details.note) {
            this.noteFlag = true;
            this.submitFlag = true;
            this.$refs.note.focus();
            return;
          } else {
            this.noteFlag = false;
          }

          for (let index = 0; index < times.length; index++) {
            const item = times[index];
            if(!(item.fromTime&&item.endTime&&item.hours&&item.travelHours)){
                this.$toast('请检查"服务时间"是否有空')
                return;
            }else{
              item.hours = parseFloat(item.hours);
              item.travelHours = parseFloat(item.travelHours);
            }
          }

          let str = '',name='',len=this.file.length;
          _.each(this.file,(v,i)=>{
            if(i===len-1){
              str += v.url;
              name += v.name;
            }else{
              str += v.url+'#';
              name += v.name+'#';
            }
          })
          this.details.file = str;
          this.details.fileName = name;
          this.details.dispatchItem = times;
          _getData("dispatch/saveDispatchItemEntity", this.details).then((res) => {
            console.log("hhhhhhhhhh",res)
            this.submitFlag = true;
            this.$router.go(-1)
            if(res===undefined || res.code){
              this.$toast("失败，请稍后重试")
            }else{
              this.$toast("保存成功");
            }
          }).catch(err=>{
            this.$toast("失败，请稍后重试")
          });
      },
      //更新图片
      updata(val) {
        this.file = val;
      },
      getDispatchDetail() {
        _getData("dispatch/getDispatch", {
          id: this.$route.query.id,
        }).then((res) => {
          console.log("详情：：：", res);
          this.details = res.dispatch || {};
          this.dispatchItem = res.dispatchItem;
          if(res.dispatch.file){
              this.file = res.dispatch.file.split("#");
              this.fileName = res.dispatch.fileName.split("#");
              _.each(this.file,(v,i)=>{
                  this.fileList.push({url:v,name:this.fileName[i+1]})
              })
              this.file = this.fileList;
          }

          if (this.dispatchItem.length) return;
          res.dispatchItem.push({
            fromTime: "",
            endTime: "",
            hours: "",
            travelHours: "",
          });
          //  console.log(res.dispatchItem)
        });
      },
    },
    components: {
      headerVue,
      costTypeVue,
      footerCancelSubmitVue,
      uploadImageVue,
      serviceTimeVue,
    },
  };
</script>

<style lang="scss" scoped>
  @import "../../../../../static/scss/_commonScss";
  #dispatch-edit {
    position: fixed;
    .container {
      background: $base-background;
      padding: 0;
      .top {
        padding: 16px 13px 32px;
        background: #fff;
        margin-bottom: 30px;
        &.detailDisabled {
          h3 {
            color: #666;
            font-weight: normal;
            i {
              font-weight: normal !important;
            }
            img {
              opacity: 0.3;
            }
          }
        }
        > h2 {
          height: 65px;
          display: flex;
          align-items: center;
          font-family: PingFangSC-Medium;
          font-size: 17px;
          color: #222222;
          line-height: 65px;
          font-weight: bold;
          span {
            font-family: PingFangSC-Regular;
            font-size: 14px;
            color: #999999;
          }
        }

        h3 {
          font-family: PingFangSC-Medium;
          font-size: 15px;
          font-weight: bold;
          color: #222222;
          display: flex;
          align-items: center;
          font-weight: bold;
          margin-bottom: 10px;
          span {
            height: 22px;
            width: 22px;
            display: flex;
            align-items: center;
            justify-content: center;
            margin-right: 8px;
            img {
              height: 20px;
            }
          }
          i {
            img {
              width: 8px;
              height: 7px !important;
              margin-bottom: 6px;
              margin-left: 5px;
            }
          }
        }
        .errorFocus {
          border: 1px solid #f10215;
        }
        .van-cell {
          &.selected {
            /deep/ .van-field__control:disabled {
              -webkit-text-fill-color: #222;
            }
          }
        }
        .common {
          margin-bottom: 10px;
          .van-cell {
            min-height: 46px;
            height: auto;
            background: #f8f8f8;
            border-radius: 5px;
            font-family: PingFangSC-Regular;
            font-size: 14px;
            padding: 10px;
            display: flex;
            align-items: center;
            justify-content: space-between;
            @include placeholder();
            /deep/ .van-field__control:disabled {
              -webkit-text-fill-color: #222;
            }
          }
        }
        .number {
          display: flex;
          justify-content: space-between;
          align-items: center;
          span {
            height: 22px;
            font-size: 17px;
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
        }
        .upload {
          margin-top: 20px;
          margin-bottom: 20px;
        }
        .applyReason {
          margin-top: 20px;
          margin-bottom: 20px;
          h3 {
            img {
              height: 22px;
            }
          }
          .van-cell {
            min-height: 46px;
            height: auto;
            display: flex;
            align-items: center;
            background: #f8f8f8;
            border-radius: 5px;
            font-family: PingFangSC-Regular;
            font-size: 14px;
            padding: 10px;
            justify-content: space-between;
            @include placeholder();
          }
        }
      }
    }
  }
</style>
