<template>
  <div id="fund-details">
    <header-vue
      name="借款单详情"
      :type="type"
      :data="details"
      :judgeBack="judgeBack"
      @goPrev="goPrev"
    ></header-vue>
    <div class="container" ref="container">
      <div class="top">
        <h2 v-if="type != 'details'">
          {{ name }}申请<span>（填写借款单）</span>
        </h2>
        <steps-vue
          v-else
          :stepData="details"
          :title="`提交的${!details.type ? '个人借款' : '对公付款'}审批`"
        ></steps-vue>
        <belong-vue ref="belong" :type="type" :data="details"></belong-vue>
        <!-- 归属部门 -->
        <div class="section">
          <h3>
            <span>
              <img
                src="../../../../../assets/images/section.png"
                width="22"
                height="16"
              />
            </span>
            归属部门
            <i><img src="../../../../../assets/images/red-star.png"/></i>
          </h3>
          <ul>
            <li
              @click="type != 'details' && getDepList()"
              :class="[
                depActive && 'active',
                { hasValue: dep != '请选择归属部门' }
              ]"
            >
              {{ dep }}
              <img
                v-if="type != 'details'"
                src="../../../../../assets/images/arrow-right.png"
              />
            </li>
          </ul>
        </div>
        <belong-project-vue
          ref="project"
          :type="type"
          :project="project"
        ></belong-project-vue>
        <div class="odd">
          <h3>
            <span><img src="../../../../../assets/images/money.png"/></span>
            款项金额
            <i><img src="../../../../../assets/images/red-star.png"/></i>
          </h3>
          <van-field
            :class="{ hasValue: money }"
            ref="money"
            v-model="money"
            type="number"
            @input="input('money', $event)"
            :disabled="type != 'details' ? false : true"
            placeholder="请输入金额"
          />
        </div>
        <div class="pay">
          <div class="top">
            <h3>
              <span>
                <img src="../../../../../assets/images/pay.png" />
              </span>
              付款方式
              <i><img src="../../../../../assets/images/red-star.png"/></i>
            </h3>
            <div class="btn" v-if="type != 'details'">
              <x-button
                mini
                :class="item == typeBtnVal && 'active'"
                v-for="(item, i) in ['转账', '现金']"
                :key="i"
                @click.native="typeBtnClick(item)"
              >
                <span>{{ item }}</span>
              </x-button>
            </div>
            <div class="btn" v-else>
              <x-button mini class="detailStyle"
                ><span>{{ details.payType }}</span></x-button
              >
            </div>
          </div>
          <ul v-show="typeBtnVal == '转账'">
            <li>
              <span>开户名称</span>
              <van-field
                ref="username"
                :class="{ hasValue: username }"
                @input="input('username', $event)"
                :disabled="type != 'details' ? false : true"
                v-model="username"
                placeholder="请填写开户名"
              />
            </li>
            <li>
              <span>开户银行</span>
              <van-field
                ref="bank"
                :class="{ hasValue: bank }"
                :disabled="type != 'details' ? false : true"
                v-model="bank"
                @input="input('bank', $event)"
                placeholder="请填写开户银行"
              />
            </li>
            <li>
              <span>银行账户</span>
              <van-field
                ref="bankNum"
                :class="{ hasValue: bankNum }"
                :disabled="type != 'details' ? false : true"
                v-model="bankNum"
                type="text"
                @input="input('bankNum', $event)"
                placeholder="请填写银行账号"
              />
            </li>
            <li>
              <span>备注</span>
              <van-field
                v-model="note"
                type="textarea"
                :class="{ hasValue: note }"
                autosize
                :disabled="type != 'details' ? false : true"
                rows="1"
                placeholder="请填写备注"
              />
            </li>
          </ul>
        </div>
        <div class="explain">
          <h3>
            <span>
              <img src="../../../../../assets/images/explain.png" />
            </span>
            款项用途
            <i><img src="../../../../../assets/images/red-star.png"/></i>
          </h3>
          <van-field
            type="textarea"
            autosize
            :class="{ hasValue: explainValue }"
            ref="explainValue"
            @input="input('explainValue', $event)"
            rows="1"
            :disabled="type != 'details' ? false : true"
            v-model="explainValue"
            placeholder="请输入款项用途"
          />
        </div>
        <div class="real-explain">
          <h3>
            <span>
              <img src="../../../../../assets/images/explain.png" />
            </span>
            费用描述
            <!-- <i><img src="../../../../../assets/images/red-star.png"/></i> -->
          </h3>
          <van-field
            type="textarea"
            autosize
            :class="{ hasValue: realExplainValue }"
            ref="realExplainValue"
            @input="input('realExplainValue', $event)"
            rows="1"
            :disabled="type != 'details' ? false : true"
            v-model="realExplainValue"
            placeholder="请输入费用描述"
          />
        </div>
        <div
          class="voucher"
          v-show="
            type != 'details' || (type == 'details' && fileList.length > 0)
          "
        >
          <h3>
            <span>
              <img src="../../../../../assets/images/voucher.png" />
            </span>
            相关凭证
          </h3>
          <upload-image-vue
            :deletable="type != 'details' ? true : false"
            :file="fileList"
            @updata="updata"
          ></upload-image-vue>
        </div>
        <div class="totalMoney">申请费用为“ {{ money }} ”元</div>
      </div>
    </div>

    <footer-button-vue
      v-if="type != 'details' && (!isApproval || isApproval == 'false')"
      @footButton="footButton"
      :status="details.status"
    ></footer-button-vue>
    <footer-approve-button-vue
      v-if="isApproval && isShowfooterApproval"
      :data="details"
      type="fund"
    ></footer-approve-button-vue>
  </div>
</template>

<script>
  import headerVue from "../../../components/header/header.vue";
  import belongVue from "../../../components/common/belong.vue";
  import footerButtonVue from "../../../components/footer/footer-button.vue";
  import footerApproveButtonVue from "../../../components/footer/footer-approve-button";
  import stepsVue from "../../../components/common/steps.vue";
  import belongProjectVue from "../../../components/common/belongProject.vue";
  import uploadImageVue from "../../../components/common/upload-image.vue";
  import { _getData, uploadImage } from "../../../service/getData";
  import { mapMutations } from "vuex";
  import _ from "lodash";
  import { iosKeyboard } from "../../../components/mixins/mixins";
  import { isBackNativePage } from "../../../../../common/js/jsBridge";

  let column = [];

  export default {
    data() {
      return {
        money: 0, //款项金额
        depActive: false,
        projectActive: false,
        dep: "请选择归属部门", //部门名称
        projectName: "请选择归属项目", //项目名称
        username: "", //开户名
        bank: "", //开户行
        bankNum: "", //银行账户
        note: "", //备注
        explainValue: "", //报销单说明
        realExplainValue: "", //真实费用说明
        typeBtnVal: "转账",
        details: {},
        picker: null,
        selectedIndex1: [0],
        scrollTop: 0,
        depId: 0,
        checkUsers: "",
        project: {},
        projectList: [],
        file: [],
        isShowfooterApproval: false,
        fileList: [
          // { url: "https://img.yzcdn.cn/vant/leaf.jpg" }
          // Uploader 根据文件后缀来判断是否为图片文件
          // 如果图片 URL 中不包含类型信息，可以添加 isImage 标记来声明
          //{ url: "https://cloud-image", isImage: true }
        ],
        judgeBack: false
      };
    },
    props: ["type", "name", "isApproval"],
    mixins: [iosKeyboard],
    watch: {
      type(newVal) {
        if (newVal != "details") {
          this.judgeBack = true;
        }
      }
    },
    mounted() {},
    activated() {
      if (!this.$route.meta.isBack) {
        this.judgeBack = false;
        this.details = {};
        this.$refs.belong.companyActive = false;
        this.$refs.belong.costActive = false;
        this.file = [];
        for (let i in this.$refs) {
          if (this.$refs[i].$el) {
            this.$refs[i].$el.classList.remove("errorFocus");
          }
        }
        this.scrollTop = 0;

        this.dep = "请选择归属部门";
        this.depId = "";
        this.itemName = "请选择归属项目";
        this.money = "";
        this.bank = "";
        this.bankNum = "";
        this.username = "";
        this.realExplainValue = "";
        this.note = "";
        this.fileList = [];
        this.explainValue = "";
        this.projectId = "";
        this.isShowfooterApproval = false;
        this.typeBtnVal = "转账";
        _getData("department/departmentList").then(data => {
          column = _.map(data, v => {
            return { text: v.depName, value: v.id, id: v.id };
          });
        });
        if (this.type != "apply") {
          _getData("financeFunds/getFinanceFunds", {
            id: this.$route.query.id
          }).then(data => {
            console.log("借款单详情：：：", data);
            let checkState;
            _.each(data.financeBillLog, o => {
              if (userId == o.checkUser) {
                checkState = o.checkState;
              }
            });
            this.isShowfooterApproval =
              data.status == 1 && userId != data.applyUser && checkState == 0
                ? true
                : false;
            this.details = data;
            this.dep = data.depName || "请选择归属部门";
            this.money = data.money;
            this.bank = data.bank;
            this.bankNum = data.bankSn;
            console.log(this.bankNum);
            this.realExplainValue = data.noteHide;
            this.note = data.note;
            this.explainValue = data.uses;
            this.username = data.accountName;
            this.typeBtnVal = data.payType;
            this.project = { itemName: data.itemName, id: data.itemId };
            if (data.file) {
              let file = data.file.split(","),
                name = data.fileName.split(",");
              console.log(file);
              _.each(file, (o, i) => {
                this.fileList = [
                  ...this.fileList,
                  {
                    url: o,
                    name: name[i]
                  }
                ];
              });
            }
          });
        }
        if (this.type != "details") {
          this.judgeBack = true;
        }
      }
    },
    beforeRouteEnter(to, from, next) {
      if (from.path == "/select-approver-list") {
        to.meta.isBack = true;
      } else {
        to.meta.isBack = false;
      }
      next(vm => {
        vm.$refs.container.scrollTop = vm.scrollTop;
      });
    },
    beforeRouteLeave(to, from, next) {
      if (to.path == "/select-approver-list") {
        this.scrollTop = this.$refs.container.scrollTop;
      } else {
        this.scrollTop = 0;
      }
      next();
    },
    methods: {
      ...mapMutations(["setTransition"]),
      goPrev() {
        if (this.type != "details") {
          this.$dialog
            .confirm({
              message: "您填的内容没保存,确定返回吗?",
              overlayStyle: {
                background: "rgba(0,0,0,0.30)"
              }
            })
            .then(() => {
              this.$store.commit("setTransition", "turn-off");
              if (getUrlParam("fromNative") == 2) {
                isBackNativePage();
              } else {
                this.$router.go(-1);
              }
            })
            .catch(() => {
              this.$dialog.close();
            });
        }
      },
      updata(val) {
        console.log(val);
        this.file = val;
      },
      input(name, val) {
        if (val == "") {
          this.$refs[name].$el.classList.add("errorFocus");
        } else {
          this.$refs[name].$el.classList.remove("errorFocus");
        }
        if (name == "money") {
          if (this.money.indexOf(".") != -1) {
            this.money = this.money.substr(0, this.money.indexOf(".") + 3);
          }
        }
      },

      footButton(val) {
        var fileStr = "",
          fileName = "";
        if (this.file.length > 0) {
          _.each(this.file, o => {
            console.log(o);
            fileStr = fileStr + o.url + "#";
            fileName = fileName + o.name + "#";
          });
        }
        let data = {
          id: this.$route.query.id || "",
          type: this.name == "个人借款" ? 0 : 1,
          companyId: this.$refs.belong.companyId,
          costCenter: this.$refs.belong.costId,
          depId: this.depId,
          itemId: this.$refs.project.projectId || "",
          money: this.money,
          payType: this.typeBtnVal,
          accountName: this.username,
          bank: this.bank,
          bankSn: this.bankNum,
          note: this.note,
          uses: this.explainValue,
          noteHide: this.realExplainValue,
          file: fileStr,
          fileName: fileName,
          checkUsers: this.checkUsers,
          billCheckList: this.details.billApplyCheckEntityList|| [],
          status: 8
        };
        if (val == "cancel") {
          //请求撤销的接口
          this.details.status = 4;
        } else if (val == "save") {
          // console.log(this.details);
          _getData("financeFunds/saveFinanceFunds", data).then(data => {
            this.$route.params.path = "saveBtn";
            this.$toast("保存成功");
            this.$router.go(-1);
          });
        } else {
          // console.log(this.$refs.project.projectId);
          if (this.$refs.belong.company == "请选择归属公司") {
            this.$refs.belong.companyActive = true;
            this.$refs.container.scrollTo(0, 80);
            return;
          } else if (this.$refs.belong.cost == "请选择成本中心") {
            this.$refs.belong.costActive = true;
            this.$refs.container.scrollTo(0, 100);
            return;
          } else if (this.dep == "请选择归属部门") {
            this.depActive = true;
            this.$refs.container.scrollTo(0, 120);
            return;
          } else if (this.money == "") {
            //款项金额
            this.$refs.money.$el.classList.add("errorFocus");
            this.$refs.money.focus();
            return;
          } else if (this.explainValue == "") {
            this.$refs.explainValue.$el.classList.add("errorFocus");
            this.$refs.explainValue.focus();
            return;
          } //else if (this.realExplainValue == "") {
          //   this.$refs.realExplainValue.$el.classList.add("errorFocus");
          //   this.$refs.realExplainValue.focus();
          //   return;
          // }
          this.$router.push({
            path: "/select-approver-list",
            query: { type: "fund", details: JSON.stringify(data) }
          });
        }
        this.setTransition("turn-on");
      },
      getDepList() {
        if (!this.picker) {
          this.picker = this.$createPicker({
            data: [column],
            selectedIndex: this.selectedIndex2,
            onSelect: (selectedVal, selectedIndex, selectedText) => {
              this.depId = selectedVal[0];
              this.selectedIndex2 = selectedIndex;
              this.dep = selectedText.join("");
              this.depActive = false;
            }
          });
        }
        this.picker.show();
      },
      typeBtnClick(i) {
        this.typeBtnVal = i;
      }
    },
    components: {
      headerVue,
      belongVue,
      footerButtonVue,
      stepsVue,
      uploadImageVue,
      belongProjectVue,
      footerApproveButtonVue
    }
  };
</script>

<style lang="scss" scoped>
  @import "../../../../../../static/scss/_commonScss";

  /deep/.errorFocus {
    border: 1px solid #f10215 !important;
  }
  #fund-details {
    position: fixed;
    .cube-scroll-wrapper {
      /deep/.cube-scroll-content {
        height: 100%;
      }
    }

    .container {
      background: $base-background;
      padding: 0;

      .top {
        padding: 0 13px;
        background: #fff;
        margin-bottom: 30px;
        padding-bottom: 10px;
        &.detailDisabled {
          h3 {
            color: #666;
            font-weight: normal;
            .other {
              i {
                font-family: PingFangSC-Regular;
                font-weight: normal !important;
              }
            }
            img {
              opacity: 0.3;
            }
          }
          .pay {
            li > span {
              color: #666;
              font-weight: normal;
            }
          }
          .btn {
            opacity: 0.7;
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
          > i {
            font-family: PingFangSC-Regular;
            font-size: 14px;
            color: #999999;
            font-style: normal;
            img {
              width: 8px;
              height: 7px !important;
              margin-bottom: 6px;
              margin-left: 5px;
            }
          }
        }
        .section {
          h3 {
            img {
              height: 16px;
            }
          }
        }
        .section {
          margin-top: 20px;
          ul {
            display: flex;
            flex-direction: column;
            li {
              height: 46px;
              display: flex;
              align-items: center;
              background: #f8f8f8;
              border-radius: 5px;
              font-family: PingFangSC-Regular;
              font-size: 14px;
              border: 1px solid #f8f8f8;
              color: #aaaaaa;
              padding: 0 3px 0 10px;
              justify-content: space-between;
              > img {
                height: 19px;
              }
              &.active {
                border: 1px solid $button-color;
              }
              &.hasValue {
                color: #222;
              }
            }
          }
        }
        .time {
          margin-top: 20px;
          .select-data {
            height: 46px;
            display: flex;
            align-items: center;
            background: #f8f8f8;
            border-radius: 5px;
            font-family: PingFangSC-Regular;
            font-size: 14px;
            color: #aaaaaa;
            justify-content: space-between;
            padding-right: 3px;
            padding-left: 28px;
            line-height: 46px;
            > img {
              height: 19px;
            }
            .left {
              display: flex;
              > span {
                &:nth-child(2) {
                  display: flex;
                  width: 9px;
                  overflow: hidden;
                  margin: 0 30px;
                }
              }
            }
          }
        }
        .odd {
          margin-top: 20px;
          h3 {
            img {
              height: 22px;
            }
          }
          .van-cell {
            height: 46px;
            display: flex;
            align-items: center;
            background: #f8f8f8;
            border-radius: 5px;
            font-family: PingFangSC-Regular;
            font-size: 14px;
            color: #aaaaaa;
            border: 1px solid #f8f8f8;
            padding: 0 10px 0 10px;
            justify-content: space-between;
            @include placeholder();
            &.hasValue {
              /deep/ .van-field__control:disabled {
                -webkit-text-fill-color: #222;
              }
            }
          }
        }
        .pay {
          display: flex;
          margin-bottom: 14px;
          align-items: center;
          margin-top: 20px;
          flex-direction: column;
          .top {
            display: flex;
            width: 100%;
            padding: 0;
            margin-bottom: 15px;
            justify-content: space-between;
            h3 {
              margin-bottom: 0;
              img {
                height: 21px;
              }
            }
            .btn {
              display: flex;
              align-items: center;
              .weui-btn {
                height: 26px;
                width: 68px;
                font-family: PingFangSC-Regular;
                font-size: 13px;
                color: #666666;
                line-height: 26px;
                display: flex;
                align-items: center;
                justify-content: center;
                margin: 0;
                &:not(.active) {
                  border: rgba($color: #666, $alpha: 0.2) 1px solid;
                }
                > span {
                  line-height: normal;
                }
                &::after {
                  //border-color: #666;
                  display: none;
                }
                &:first-child {
                  margin-right: 10px;
                }
                &.active {
                  background: url("../../../../../../static/images/btn-background.png")
                    center no-repeat;
                  background-size: 100% 100%;
                  color: #fff;
                  &::after {
                    border-color: #f10215;
                    display: none;
                  }
                }
                &.detailStyle {
                  background: #f8f8f8;
                  color: #222222;
                  font-family: PingFangSC-Medium;
                  font-size: 14px;
                  font-weight: bold;
                  margin-right: 0;
                  height: 30px;
                  &::after {
                    display: none;
                  }
                }
              }
            }
          }

          > ul {
            display: flex;
            width: 100%;
            flex-direction: column;
            li {
              display: flex;
              align-items: center;
              margin-bottom: 10px;
              span {
                display: flex;

                width: 66px;
                font-family: PingFangSC-Light;
                font-size: 14px;
                color: #222222;
              }
              .van-field {
                padding: 0;
                background: #f8f8f8;
                min-height: 46px;
                flex: 1;
                border: 1px solid #f8f8f8;
                padding: 11px 10px;
                border-radius: 5px;
                @include placeholder();
                /deep/ .van-field__control {
                  //  caret-color: red;
                }
                &.hasValue {
                  /deep/ .van-field__control:disabled {
                    -webkit-text-fill-color: #222;
                  }
                }
              }
            }
          }
        }
        .explain,
        .real-explain {
          margin-top: 20px;
          .van-cell {
            display: flex;
            align-items: center;
            background: #f8f8f8;
            border-radius: 5px;
            border: 1px solid #f8f8f8;
            font-family: PingFangSC-Regular;
            font-size: 14px;
            color: #aaaaaa;
            padding: 13px 10px;
            justify-content: space-between;
            @include placeholder();
            &.hasValue {
              /deep/ .van-field__control:disabled {
                -webkit-text-fill-color: #222;
              }
            }
          }
        }
        .voucher {
          margin-top: 20px;
          h3 {
            img {
              width: 20px;
              height: 18px;
            }
          }
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
        .totalMoney {
          display: flex;
          height: 40px;
          font-family: PingFangSC-Regular;
          font-size: 16px;
          color: #ffffff;
          justify-content: center;
          align-items: center;
          background: #cfa972;
          border-radius: 5px;
          margin-top: 20px;
        }
      }
    }
  }
</style>
