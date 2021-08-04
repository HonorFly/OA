<template>
  <div id="reimburse-details">
    <header-vue
      name="报销单详情"
      :data="details"
      :type="type"
      :judgeBack="judgeBack"
      @goPrev="goPrev"
    ></header-vue>
    <div class="container" ref="container">
      <div :class="[{ detailDisabled: type == 'details' }, 'top']">
        <h2 v-if="type != 'details'">
          {{ name }}申请<span>（填写报销单）</span>
        </h2>
        <steps-vue
          v-else
          :stepData="details"
          :title="`提交的${details.type || ''}`"
        ></steps-vue>
        <!-- 所属分类 -->
        <div class="categories">
          <h3>
            <span>
              <img src="../../../../../assets/images/categories.png" alt=""
            /></span>
            所属分类
            <i><img src="../../../../../assets/images/red-star.png" /></i>
          </h3>
          <div class="btn" v-if="type != 'details'">
            <x-button
              mini
              :class="item == typeBtnVal && 'active'"
              v-for="(item, i) in ['A类报销', 'B类报销']"
              :key="i"
              @click.native="typeBtnClick(item)"
            >
              <span>{{ item && item.substring(0, 2) }}</span>
            </x-button>
          </div>
          <div class="btn" v-else>
            <x-button mini class="active">
              <span>{{
                details.classes && details.classes.substring(0, 2)
              }}</span>
            </x-button>
          </div>
        </div>
        <!-- 异地报销 -->
        <div class="offsite-reimburse">
          <h3>
            <span>
              <img src="../../../../../assets/images/off-site-remburse.png" />
            </span>
            异地报销
            <i><img src="../../../../../assets/images/red-star.png" /></i>
          </h3>
          <div class="off-site-box">
            <span
              @click="ifNonlocal = '是'"
              v-if="
                (type == 'details' && ifNonlocal == '是') || type != 'details'
              "
            >
              是
              <i
                v-if="type != 'details'"
                :class="{ active: ifNonlocal == '是' }"
              ></i>
            </span>
            <span
              @click="ifNonlocal = '否'"
              v-if="
                (type == 'details' && ifNonlocal == '否') || type != 'details'
              "
            >
              否
              <i
                v-if="type != 'details'"
                :class="{ active: ifNonlocal == '否' }"
              ></i>
            </span>
          </div>
        </div>
        <!-- 派工单号 -->
        <div
          class="dispatch-number"
          v-if="name == '派工费用报销单'"
          id="dispatchNumber"
        >
          <h3>
            <span>
              <img src="../../../../../assets/images/dispatch.png" width="20" />
            </span>
            派工单号<i v-if="type != 'details'">（选一项填写）</i>
            <i><img src="../../../../../assets/images/red-star.png" /></i>
          </h3>
          <div class="box">
            <!-- 普通派工 -->
            <common-dispatch-vue
              ref="commonDispatch"
              :dispatch="dispatch"
              @getDispatch="getDispatch"
              v-if="type != 'details'"
            ></common-dispatch-vue>
            <!-- 应用派工 -->
            <application-dispatch-vue
              ref="applicationDispatch"
              :dispatch="dispatch"
              @getDispatch="getDispatch"
              v-if="type != 'details'"
            ></application-dispatch-vue>
          </div>
          <div
            v-show="dispatch.sn"
            :class="[
              'dispatchNumber',
              {
                active: dispatch.sn,
                errorFocus: dispatchFlag && !dispatch.sn,
              },
            ]"
          >
            {{ dispatch.sn }}
          </div>
        </div>
        <!-- 所属项目 -->
        <belong-project-vue
          id="belongProject"
          ref="project"
          :type="type"
          :project="project"
          v-if="name == '项目差旅报销'"
        ></belong-project-vue>
        <!-- 费用归属 -->
        <belong-vue ref="belong" :type="type" :data="details"></belong-vue>
        <div class="time">
          <h3>
            <span>
              <img src="../../../../../assets/images/time.png" alt="" />
            </span>
            费用起止时间
            <i><img src="../../../../../assets/images/red-star.png" /></i>
          </h3>
          <div
            class="select-data"
            ref="time"
            @click="type != 'details' && selectDay()"
          >
            <div class="left" :class="fromDate && 'highlight'">
              <span :class="{ selected: fromDate }">
                {{ fromDate ? fromDate : "请选择开始时间" }}
              </span>
              <span>—</span>
              <span :class="{ selected: endDate }">
                {{ endDate ? endDate : "请选择结束时间" }}
              </span>
            </div>
            <img
              v-if="type != 'details'"
              src="../../../../../assets/images/arrow-right.png"
            />
          </div>
        </div>
        <!-- 借款单号 -->
        <fund-number-vue
          :fundNumbers="loanNote"
          :type="type"
          ref="funds"
        ></fund-number-vue>
        <div class="explain">
          <h3>
            <span>
              <img src="../../../../../assets/images/explain.png" />
            </span>
            报销单说明
            <i><img src="../../../../../assets/images/red-star.png" /></i>
          </h3>
          <van-field
            type="textarea"
            autosize
            rows="1"
            ref="explain"
            @input="input('explain', $event)"
            :disabled="type != 'details' ? false : true"
            v-model="explainValue"
            placeholder="请输入报销单说明"
            :class="explainValue && 'selected'"
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
            ref="upload"
          ></upload-image-vue>
        </div>
      </div>
      <div class="bottom">
        <div class="preview">
          <h3>
            {{ totalNum.year }}年度费用统计
            <p>
              <span>{{ totalNum.money || 0 }}</span
              >元
            </p>
          </h3>
          <div class="bck"></div>
          <div class="top">
            <h4>
              {{ totalNum.year }}年度{{ totalNum.fullName }}已报销
              <!-- {{
                name == "派工费用报销单"
                  ? name.substring(0, name.length - 3)
                  : name.substring(0, name.length - 2)
              }} -->
              <span>{{ totalNum.num }}</span
              >次，累计<span>{{ totalNum.money || 0 }}</span
              >元
            </h4>

            <ul>
              <li v-for="(item, i) in countAndSumMoney" :key="i">
                {{ item.typeName }}<span>{{ item.money }}元</span>
              </li>
            </ul>
          </div>
          <h3>
            本次费用统计
            <p>
              总计:<span>{{ totalMoeny }}</span
              >元
            </p>
          </h3>
          <div class="list">
            <div
              :class="
                item.typeName == '办公费用'
                  ? 'work'
                  : item.typeName == '活动费' || item.typeName == '客户招待'
                  ? 'activity'
                  : item.typeName == '酒店及住宿费'
                  ? 'stay'
                  : item.typeName == '交通费'
                  ? 'traffic'
                  : 'rest'
              "
              v-for="(item, i) in countAndSumMoney"
              :key="i"
            >
              <div
                :class="[
                  'title',
                  { end: i == 4 && item.billApplyItemList.length == 0 },
                ]"
                v-if="type != 'details' || item.billApplyItemList.length"
              >
                <h2>
                  {{ item.typeName }}
                  <span>
                    {{ item.year }}年度 {{ item.fullName }} 已报销{{
                      item.typeName
                    }}{{ item.num }}次，累计{{ item.money || 0 }}元
                  </span>
                </h2>
                <div
                  class="add-btn"
                  v-if="type != 'details'"
                  @click="add(i, item)"
                >
                  <img src="../../../../../assets/images/add@2x.png" />新增
                </div>
              </div>
              <ul v-if="type != 'details' || item.billApplyItemList.length">
                <li
                  v-for="(val, j) in item.billApplyItemList"
                  :key="j"
                  @click="itemClick(item, val, j)"
                >
                  <span class="sub-title">
                    {{ val.countAndSumMoney.year }}年度
                    {{ val.countAndSumMoney.fullName || "你" }}已报销{{
                      val.smallTypeName
                    }}{{ val.countAndSumMoney.num }}次，累计{{
                      val.countAndSumMoney.money || 0
                    }}元
                  </span>
                  <h3 v-if="item.typeName == '酒店及住宿费'">
                    入住-离开时间
                    <p>
                      <span>{{ val.time }}/{{ val.info2 }}</span>
                      <span>共{{ val.info4 }}天</span>
                    </p>
                  </h3>

                  <h3 v-else>
                    费用产生于<span>{{ val.time }}</span>
                  </h3>

                  <h3 class="priceStyle">
                    费用金额<span class="price">{{ val.money }}元</span>
                  </h3>

                  <ul v-if="item.typeName == '酒店及住宿费'">
                    <li><span>住房单价</span>{{ val.info3 }}元</li>
                    <li><span>其他消费</span>{{ val.info5 }}元</li>
                  </ul>
                  <ul v-if="item.typeName == '交通费'">
                    <li><span>出发地</span>{{ val.info2 }}</li>
                    <li><span>目的地</span>{{ val.info3 }}</li>
                  </ul>

                  <h3 class="content" v-if="val.note != ''">
                    费用描述<span>{{ val.note }}</span>
                  </h3>
                  <!--
                  <div class="content" v-if="val.note != ''">

                  </div> -->
                  <div class="TP" v-if="val.ifTP == '是'">
                    TP费用种类：
                    <span>{{ val.tptype }}</span>
                  </div>

                  <div class="type-title">
                    {{ val.smallTypeName }}
                  </div>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
    <footer-button-vue
      @footButton="footButton"
      v-if="type != 'details' && (!isApproval || isApproval == 'false')"
      :status="details.status"
    ></footer-button-vue>
    <footer-approve-button-vue
      v-if="isApproval && isShowfooterApproval"
      :data="details"
      type="reimburse"
    ></footer-approve-button-vue>
    <van-calendar v-model="show" type="range" @confirm="onConfirm" />
  </div>
</template>

<script>
  /**
   * ?报销单详情页面 有两种状态 ① 编辑状态 ② 查看状态，当上一页面跳转到此页面时，使用参数 type 区分; type='apply'，代表编辑状态，页面所有输入框处于可编辑状态，type='details'，代表只读状态，页面不可编辑
   */
  import axios from "axios";
  import headerVue from "../../../components/header/header.vue";
  import belongVue from "../../../components/common/belong.vue";
  import footerButtonVue from "../../../components/footer/footer-button.vue";
  import stepsVue from "../../../components/common/steps.vue";
  import belongProjectVue from "../../../components/common/belongProject.vue";
  import applicationDispatchVue from "../../../components/common/applicationDispatch.vue";
  import commonDispatchVue from "../../../components/common/commonDispatch.vue";
  import fundNumberVue from "../../../components/common/fundNumber.vue";
  import { _getData } from "../../../service/getData";
  import { mapMutations } from "vuex";
  import footerApproveButtonVue from "../../../components/footer/footer-approve-button";
  import uploadImageVue from "../../../components/common/upload-image.vue";
  import { JsCallNativeMethods } from "../../../../../common/js/jsBridge";
  import { getDay, iosKeyboard } from "../../../components/mixins/mixins";
  import { isBackNativePage } from "../../../../../common/js/jsBridge";

  export default {
    data() {
      return {
        ifNonlocal: "否",
        value: "", //单号
        oddId: "", //单号id
        explainValue: "", //说明
        typeBtnVal: "A类报销",
        details: {},
        countAndSumMoney: [],
        totalNum: {}, //费用统计详情
        totalMoeny: 0, //费用总计
        workList: [], //办公费用
        activity: [], //活动费用
        stay: [], //住宿费用
        traffic: [], //交通费用
        rest: [], //其他费用
        fileList: [],
        file: [],
        scrollTop: 0, //获取路由离开时的滚动位置
        selectedIndex1: [0],
        column1: [],
        picker1: null,
        project: {}, //所属项目
        dispatch: {}, //派工单号
        loanNote: {}, //借款单
        dispatchType: "config", //派工类型
        sn: "",
        dispatchFlag: false,
        belongProjectFlag: false,
        isShowfooterApproval: false,
        judgeBack: false,
      };
    },
    props: ["type", "name", "isApproval"],
    mixins: [iosKeyboard, getDay],
    watch: {
      type(newVal) {
        console.log(newVal);
        if (newVal != "details") {
          this.judgeBack = true;
        }
      },
    },
    activated() {
      this.judgeBack = false;
      _getData("financeFunds/IfPayedFundsList", {
        currentPage: 1,
        countPerPage: ""
      }).then(data => {
        this.column1 = _.map(data.data, v => {
          return { text: v.sn, value: v.sn, id: v.id };
        });
      });
      if (this.type != "details") {
        this.judgeBack = true;
      }
    },
    beforeRouteLeave(to, from, next) {
      this.scrollTop = this.$refs.container.scrollTop;
      //关闭全部弹框
      this.$refs.project && (this.$refs.project.openFullscreen = false);
      this.$refs.belong &&
        this.$refs.belong.picker1 &&
        this.$refs.belong.picker1.hide();
      this.$refs.belong &&
        this.$refs.belong.picker2 &&
        this.$refs.belong.picker2.hide();
      this.$refs.funds && (this.$refs.funds.openFullscreen = false);
      this.$refs.commonDispatch &&
        (this.$refs.commonDispatch.openFullscreen = false);
      this.$refs.applicationDispatch &&
        (this.$refs.applicationDispatch.openFullscreen = false);
      next();
    },
    beforeRouteEnter(to, from, next) {
      console.log(from);
      if (from.path == "/select-approver-list" || _.endsWith(from.path, "cost")) {
        to.meta.isBack = true;
      } else {
        to.meta.isBack = false;
      }
      next(vm => {
        vm.$refs.belong.companyActive = false;
        vm.$refs.belong.costActive = false;
        vm.$refs.odd && vm.$refs.odd.$el.classList.remove("errorFocus");
        vm.$refs.time.classList.remove("errorFocus");
        vm.$refs.explain.$el.classList.remove("errorFocus");
        if (
          _.endsWith(from.path, "cost") ||
          from.path == "/select-approver-list"
        ) {
          vm.$refs.container.scrollTop = vm.scrollTop;
        } else {
          vm.details = {};
          vm.project = {};
          vm.dispatch = {};
          vm.loanNote = {};
          vm.value = "";
          vm.sn = "";
          vm.ifNonlocal = "否";
          vm.oddId = "";
          vm.fileList = [];
          vm.file = [];
          vm.fromDate = "";
          vm.endDate = "";
          vm.dayNum = "";
          vm.explainValue = "";
          vm.belongProjectFlag = false;
          vm.dispatchFlag = false;
          vm.dispatchType = "config";
          vm.isShowfooterApproval = false;
          vm.picker1 = null;
          vm.selectedIndex1 = [0];
          vm.typeBtnVal = "A类报销";
          _getData("billApply/getBillApplyInfo", {
            type: vm.name, //类型：String  必有字段  备注：报销类型
            billApplyId: vm.$route.query.id || ""
          }).then(data => {
            vm.countAndSumMoney = data.CountAndSumMoneyEntity;
            vm.totalNum = data.countAndSumMoney;
            vm.totalMoeny = data.countAndSumMoney.amount || 0;
          });
        }

        if (vm.type != "apply" && !_.endsWith(from.path, "cost")) {
          _getData("billApply/getBillApply", {
            Id: vm.$route.query.id,
            wordBook: vm.name
          }).then(data => {
            console.log("报销单详情：：：", data);
            // console.log("22222222222", userInfo);
            let checkState;
            _.each(data.financeBillLog, o => {
              if (userId == o.checkUser) {
                checkState = o.checkState;
              }
            });
            vm.isShowfooterApproval =
              data.status == 1 && userId != data.applyUser && checkState == 0
                ? true
                : false; //需要判断userid是不是本人
            vm.details = data;
            vm.value = "";
            vm.typeBtnVal = data.classes;
            vm.fromDate = data.fromTime;
            vm.endDate = data.endTime;
            vm.sn = data.sn;
            vm.ifNonlocal = data.ifNonlocal;
            vm.dispatchType = data.dispatchType;
            vm.dispatch = {
              id: data.dispatchId,
              sn:
                data.dispatchType == "config"
                  ? data.erpDispatchSn
                  : data.trainDispatch
            };
            vm.project = { itemId: data.itemId, itemName: data.itemName };
            vm.loanNote = {
              fundsId: data.fundsId,
              fundsName: data.financeFundsSn
            };
            if (data.file) {
              let file = data.file.split(","),
                name = data.fileName.split(",");
              console.log(file);
              _.each(file, (o, i) => {
                vm.fileList = [
                  ...vm.fileList,
                  {
                    url: o,
                    name: name[i]
                  }
                ];
              });
            }
            console.log(vm.fileList);
            vm.explainValue = data.note;
          });
        }
        //共同处理函数
        const middleware = n => {
          if (from.query.cost) {
            if (from.query.index >= 0) {
              //编辑
              vm.$set(
                vm.countAndSumMoney[n].billApplyItemList,
                from.query.index,
                JSON.parse(from.query.cost)[0]
              );
            } else {
              //新增
              vm.$set(vm.countAndSumMoney[n], "billApplyItemList", [
                ...JSON.parse(from.query.cost),
                ...vm.countAndSumMoney[n].billApplyItemList
              ]);
            }
          } else {
            if (from.query.index >= 0 && from.query.action == "del") {
              vm.countAndSumMoney[n].billApplyItemList.splice(
                from.query.index,
                1
              );
            }
          }
        };

        //办公费用
        if (from.path == "/work-cost") {
          middleware(0);
        }
        //活动费
        if (from.path == "/activity-cost") {
          middleware(1);
        }
        //酒店及住宿费
        if (from.path == "/stay-cost") {
          middleware(2);
        }
        //交通费
        if (from.path == "/traffic-cost") {
          middleware(3);
        }
        //其他费用
        if (from.path == "/rest-cost") {
          middleware(4);
        }

        if (
          (vm.type == "apply" || vm.type == "edit") &&
          _.endsWith(from.path, "cost")
        ) {
          vm.totalMoeny = 0;

          _.each(vm.countAndSumMoney, o => {
            _.each(o.billApplyItemList, v => {
              vm.totalMoeny += Number(v.money);
            });
          });
        }
      });
    },
    methods: {
      ...mapMutations(["setTransition"]),
      goPrev() {
        if (this.type != "details") {
          this.$dialog
            .confirm({
              message: "您填的内容没保存,确定返回吗?",
              overlayStyle: {
                background: "rgba(0,0,0,0.30)",
              },
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
      //更新图片
      updata(val) {
        this.file = val;
      },
      getDispatch(val) {
        console.log(val);
        this.dispatch = val;
      },
      itemClick(item, val, i) {
        console.log(item, val, i);
        this.setTransition("turn-on");

        this.$router.push({
          path:
            item.typeName == "办公费用"
              ? "/work-cost"
              : item.typeName == "活动费" || item.typeName == "客户招待"
              ? "/activity-cost"
              : item.typeName == "酒店及住宿费"
              ? "/stay-cost"
              : item.typeName == "交通费"
              ? "/traffic-cost"
              : item.typeName == "其他费用"
              ? "rest-cost"
              : "",
          query: {
            id: item.id,
            type: this.type == "details" ? "details" : "edit",
            name: this.name,
            typeName: item.typeName,
            index: this.type == "apply" || this.type == "edit" ? i : "",
            data: JSON.stringify(val),
            fromDate: this.fromDate,
            endDate: this.endDate,
          },
        });
      },
      input(name, val) {
        if (val == "") {
          this.$refs[name].$el.classList.add("errorFocus");
        } else {
          this.$refs[name].$el.classList.remove("errorFocus");
        }
      },
      //点击下一步
      footButton(val) {
        // console.log(this.$refs.upload.loading);
        let billApplyItemList = _.flattenDeep(
          _.map(this.countAndSumMoney, "billApplyItemList")
        );
        console.log(billApplyItemList);
        var fileStr = "",
          fileName = "";
        _.each(this.file, (o) => {
          console.log(o);
          fileStr = fileStr + o.url + ",";
          fileName = fileName + o.name + ",";
        });
        console.log(fileStr);

        //提交申请所需参数
        let data = {
          id: this.$route.query.id || "",
          companyId: this.$refs.belong.companyId, //费用归属公司
          depid: "", //部门id
          type: this.name, //报销单类型 汉字
          itemId: (this.$refs.project && this.$refs.project.projectId) || "", //所属项目
          fundsId: this.$refs.funds.fundsId, //借款单id
          dispatchId: this.dispatch.id || "", //派工id
          dispatchType: this.dispatch.dispatchType || "config", //派工类型
          costCenter: this.$refs.belong.costId, //费用归属成本中心
          fromTime: this.fromDate, //开始时间
          endTime: this.endDate, //结束时间
          total: this.totalMoeny, //申请金额
          note: this.explainValue, //报销单说明
          status: 8, //0：未提交；1：已提交；2：审核人；3：审核通过；4：退回；8：保存 9：撤销
          file: fileStr, //相关凭证地址
          fileName: fileName,
          ifPayed: "", //付款状态 1.已付款
          payNote: "", //
          classes: this.typeBtnVal, //所属分类
          ifNonlocal: this.ifNonlocal, //是否异地
          checkUsers: "", //类型：审批人ID组
          billCheckList: this.details.billApplyCheckEntityList || [],
          billApplyExpenseList: billApplyItemList,
        };
        if (val == "cancel") {
          //撤销接口
          this.data.status = 4;
        } else if (val == "save") {
          console.log(data);
          if (this.$refs.upload.loading) {
            this.toast("您还有图片未上传完成，请稍等再次点击");
            return;
          } else {
            this.$route.params.path = "saveBtn";
            _getData("billApply/saveBillApply", data).then((data) => {
              // console.log("保存：", data);
              this.$toast("保存成功");
              this.$router.go(-1);
            });
          }
        } else {
          if (
            this.$refs.project &&
            !this.$refs.project.projectId &&
            this.name == "项目差旅报销"
          ) {
            //所属项目
            document.getElementById("belongProject").scrollIntoView();
            this.belongProjectFlag = true;
            return;
          } else if (!this.dispatch.id && this.name == "派工费用报销单") {
            //派工单号
            document.getElementById("dispatchNumber").scrollIntoView();
            this.dispatchFlag = true;
            return;
          } else if (this.$refs.belong.company == "请选择归属公司") {
            //归属公司
            this.$refs.belong.companyActive = true;
            this.$refs.container.scrollTo(0, 100);
            return;
          } else if (this.$refs.belong.cost == "请选择成本中心") {
            //成本中心
            this.$refs.belong.costActive = true;
            this.$refs.container.scrollTo(0, 100);
            return;
          } else if (this.fromDate == "" || this.endDate == "") {
            //费用起止时间
            this.$refs.time.classList.add("errorFocus");
            this.$refs.container.scrollTo(0, 150);
            return;
          } else if (this.explainValue == "") {
            //报销单说明
            this.$refs.explain.$el.classList.add("errorFocus");
            this.$refs.explain.focus();
            return;
          } else {
            console.log(billApplyItemList);
            if (!billApplyItemList.length) {
              this.$toast("请填写报销费用");
              this.$refs.container.scrollTo(0, 700);
              return;
            }
          }
          this.setTransition("turn-on");
          if (this.$refs.upload.loading) {
            this.$toast("您还有图片未上传完成，请稍等再次点击");
            return;
          } else {
            this.$router.push({
              path: "/select-approver-list",
              query: { type: "reimburse", details: JSON.stringify(data) },
            });
          }
        }
      },
      typeBtnClick(item) {
        this.typeBtnVal = item;
      },
      //点击添加按钮
      add(i, item) {
        if (this.fromDate == "" || this.endDate == "") {
          this.$refs.time.classList.add("errorFocus");
          this.$refs.container.scrollTo(0, 150);
          this.$toast("请先选择费用起止时间");
          return;
        }

        // console.log(i,item)
        this.setTransition("turn-on");
        switch (i) {
          case 0:
            this.$router.push({
              path: "/work-cost",
              query: {
                id: item.id,
                type: "add",
                name: this.name,
                fromDate: this.fromDate,
                endDate: this.endDate,
              },
            });
            break;
          case 1:
            this.$router.push({
              path: "/activity-cost",
              query: {
                id: item.id,
                type: "add",
                name: this.name,
                typeName: item.typeName,
                fromDate: this.fromDate,
                endDate: this.endDate,
              },
            });
            break;
          case 2:
            this.$router.push({
              path: "/stay-cost",
              query: {
                id: item.id,
                type: "add",
                name: this.name,
                fromDate: this.fromDate,
                endDate: this.endDate,
              },
            });
            break;
          case 3:
            this.$router.push({
              path: "/traffic-cost",
              query: {
                id: item.id,
                type: "add",
                name: this.name,
                fromDate: this.fromDate,
                endDate: this.endDate,
              },
            });
            break;
          case 4:
            this.$router.push({
              path: "/rest-cost",
              query: {
                id: item.id,
                type: "add",
                name: this.name,
                fromDate: this.fromDate,
                endDate: this.endDate,
              },
            });
            break;
        }
      },
    },
    components: {
      headerVue,
      belongVue,
      footerButtonVue,
      stepsVue,
      uploadImageVue,
      belongProjectVue,
      applicationDispatchVue,
      commonDispatchVue,
      footerApproveButtonVue,
      fundNumberVue,
    },
  };
</script>

<style lang="scss" scoped>
  @import "../../../../../../static/scss/_commonScss";
  @import "../../../../../../static/scss/_dialog";
  /deep/.errorFocus {
    border: 1px solid #f10215 !important;
  }
  #reimburse-details {
    position: fixed;
    .container {
      background: #fff;
      padding: 0;
      .top {
        padding: 0 13px;
        &.detailDisabled {
          h3 {
            //color: #666;
            font-weight: bold;
            .other {
              i {
                font-family: PingFangSC-Regular;
                font-weight: bold !important;
              }
            }
            img {
              opacity: 1;
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
        > .step {
          background: rgba(34, 34, 34, 0.03);
          border-radius: 5px;
          padding: 15px 13px 18px;
          margin-bottom: 20px;
          h4 {
            font-family: PingFangSC-Regular;
            font-size: 15px;
            color: #222222;
            line-height: 21px;
            margin-bottom: 13px;
            span {
              font-family: PingFangSC-Regular;
              font-size: 15px;
              color: #00303d;
              padding: 0 4px;
            }
          }
          > span {
            font-family: PingFangSC-Regular;
            font-size: 14px;
            color: #666666;
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
            font-family: PingFangSC-Regular;
            font-size: 14px;
            color: #999999;
            font-style: normal;
            img {
              width: 8px;
              height: 7px;
              margin-bottom: 6px;
              margin-left: 5px;
            }
          }
        }
        .categories {
          display: flex;
          justify-content: space-between;
          margin-bottom: 20px;
          align-items: center;
          h3 {
            margin-bottom: 0;
          }
          .btn {
            display: flex;
            align-items: center;
            //padding: 0 5px;
            .weui-btn {
              height: 26px;
              width: 68px;

              font-family: PingFangSC-Regular;
              font-size: 13px;
              color: #666666;
              //  line-height: 26px;
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
              &:last-child {
                margin-left: 10px;
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
            }
          }
        }
        .offsite-reimburse {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 20px;
          h3 {
            margin-bottom: 0;
          }
          .off-site-box {
            display: flex;
            align-items: center;
            span {
              display: flex;
              align-items: center;
              &:last-child {
                margin-left: 34px;
              }
              i {
                height: 22px;
                width: 22px;
                display: flex;
                border: 1px solid #999;
                border-radius: 11px;
                margin-left: 8px;
                position: relative;
                &::after {
                  content: "";
                  display: flex;
                  transition: opacity 0.3s;
                  width: 22px;
                  height: 22px;
                  background: url("../../../../../assets/images/selected.png")
                    no-repeat center;
                  background-size: 100% 100%;
                  top: -1px;
                  left: -1px;
                  position: absolute;
                  opacity: 0;
                }
                &.active {
                  &::after {
                    opacity: 1;
                  }
                }
              }
            }
          }
        }
        .dispatch-number {
          margin-bottom: 20px;
          .box {
            display: flex;
            .common-dispatch {
              margin-right: 15px;
            }
          }
          .dispatchNumber {
            width: 100%;
            height: 46px;
            border: 1px solid #f8f8f8;
            background-color: #f8f8f8;
            margin-top: 10px;
            display: flex;
            align-items: center;
            font-size: 14px;
            color: #aaa;
            padding: 0 10px;
            border-radius: 5px;
            &.active {
              color: #222;
            }
          }
        }
        .belong-project {
          margin-bottom: 20px;
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
              &.highlight {
                > span {
                  color: $font-high-light !important;
                }
                //字体高亮
                //color: $font-high-light;
              }
            }
          }
        }
        .odd {
          margin-top: 20px;
          h3 {
            img {
              height: 19px;
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
            padding: 0 0px 0 10px;
            justify-content: space-between;
            @include placeholder();
            &.selected {
              /deep/ .van-field__control:disabled {
                -webkit-text-fill-color: $font-high-light;
                text-shadow: none;
              }
            }
            /deep/ .van-field__right-icon {
              height: 20px;
              width: 20px;
              padding: 0;
              margin-right: 0px;
              span {
                display: flex;
                img {
                  height: 19px;
                }
              }
            }
          }
        }
        .explain {
          margin-top: 20px;
          .van-cell {
            display: flex;
            align-items: center;
            background: #f8f8f8;
            border: 1px solid #f8f8f8;
            border-radius: 5px;
            font-family: PingFangSC-Regular;
            font-size: 14px;
            color: #aaaaaa;
            padding: 13px 10px;
            justify-content: space-between;
            @include placeholder();
            &.selected {
              /deep/ .van-field__control:disabled {
                -webkit-text-fill-color: $font-high-light;
                text-shadow: none;
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
        }
      }
      .bottom {
        margin-top: 20px;
        .preview {
          margin-top: 16px;
          .bck {
            height: 22px;
            display: flex;
            width: 100%;
            //padding-top: 22px;
            background: url("../../../../../assets/images/bck.png") no-repeat
              center top;
            background-size: 100% 100%;
          }
          .top {
            // box-shadow: 0 5px 8px 0 rgba(255, 186, 141, 0.2);

            background-color: #fdf9f6;
            min-height: 150px;
            > h4 {
              font-family: PingFangSC-Regular;
              font-size: 14px;
              color: #4176ff;
              padding: 0 13px;
              margin-bottom: 20px;
              line-height: 20px;
              span {
                color: #f96a0e;
              }
            }
            > ul {
              display: flex;
              flex-direction: row;
              justify-content: space-between;
              flex-wrap: wrap;
              padding: 0 13px;
              li {
                font-family: PingFangSC-Light;
                font-size: 15px;
                color: #ad7d36;
                width: 50%;
                line-height: 21px;
                margin-bottom: 10px;
                span {
                  font-family: PingFangSC-Regular;
                  font-size: 15px;
                  color: #f96a0e;
                }
              }
            }
          }
          > h3 {
            display: flex;
            font-family: PingFangSC-Medium;
            font-size: 17px;
            padding: 0 13px;
            color: #222222;
            height: 24px;
            align-items: center;
            font-weight: bold;
            justify-content: space-between;
            margin: 20px 0;
            &:first-child {
              margin-bottom: 0px;
            }
            p {
              font-family: PingFangSC-Regular;
              font-size: 16px;
              color: $button-color;
              span {
                font-family: PingFangSC-Medium;
                font-size: 22px;
                font-weight: bold;
              }
            }
          }
          .list {
            display: flex;
            flex-direction: column;
            .work,
            .activity,
            .stay,
            .traffic,
            .rest {
              position: relative;

              .title {
                height: 137px;
                padding: 18px 13px 0;
                position: relative;
                background-image: linear-gradient(
                  144deg,
                  #ea565c 0%,
                  #bd65ff 48%,
                  #5abceb 100%
                );

                > h2 {
                  font-family: PingFangSC-Semibold;
                  font-size: 17px;
                  color: #ffffff;
                  display: flex;
                  flex-direction: column;
                  font-weight: 800;
                  line-height: 24px;

                  span {
                    font-family: PingFangSC-Regular;
                    font-size: 14px;
                    color: #ffffff;
                  }
                }
                .add-btn {
                  font-family: PingFangSC-Medium;
                  font-size: 14px;
                  color: #ffffff;
                  font-weight: bold;
                  display: flex;
                  justify-content: center;
                  align-items: center;
                  position: absolute;
                  top: 22px;
                  right: 13px;
                  img {
                    width: 18px;
                    margin-right: 5px;
                  }
                }
              }
              > ul {
                display: flex;
                // position: absolute;
                margin: 0 13px;
                width: 349px;
                margin-top: -43px;
                //height: 148px;

                left: 0;
                top: 90px;
                border-radius: 6px;
                flex-direction: column;

                > li {
                  border-radius: 6px;
                  display: flex;
                  flex-direction: column;
                  padding: 23px 13px 20px;
                  background: #ffffff;
                  border: 1px solid rgba(0, 0, 0, 0);
                  box-shadow: 0 2px 6px 1px rgba(0, 0, 0, 0.07);
                  //  min-height: 130px;
                  position: relative;
                  margin-bottom: 20px;
                  width: 100%;
                  .sub-title {
                    font-family: PingFangSC-Regular;
                    font-size: 14px;
                    color: #cfa972;
                    line-height: 20px;
                    margin-bottom: 10px;
                  }
                  > h3 {
                    font-family: PingFangSC-Light;
                    font-size: 14px;
                    color: #222222;
                    line-height: 20px;
                    display: flex;
                    align-items: center;
                    margin-bottom: 7px;
                    span {
                      font-family: PingFangSC-Medium;
                      font-weight: bold;
                      margin-left: 20px;
                      &.price {
                        display: flex;
                        line-height: 24px;
                        font-family: PingFangSC-Medium;
                        font-size: 16px;
                        margin-left: 34px;
                        color: $button-color;
                        // position: absolute;
                        // top: 17px;
                        // right: 13px;
                        font-weight: bold;
                      }
                    }
                  }
                  .content {
                    font-family: PingFangSC-Light;
                    font-size: 14px;
                    color: #222222;
                    //font-weight: bold;
                    flex-direction: row;
                    display: flex;

                    > span {
                      margin-left: 34px;
                      display: flex;
                      line-height: 20px;
                      flex-wrap: wrap;
                      height: 100%;
                      flex: 1;
                      //width: calc(100% - 58px);
                      word-break: break-all;
                    }
                  }
                  .TP {
                    font-family: PingFangSC-Regular;
                    font-size: 14px;
                    color: #4176ff;
                    display: flex;
                    align-items: center;
                    margin-top: 15px;
                    span {
                      display: flex;
                      height: 24px;
                      padding: 0 8px;
                      font-family: PingFangSC-Regular;
                      font-size: 12px;
                      color: #666666;
                      background: rgba(0, 0, 0, 0.05);
                      justify-content: center;
                      align-items: center;
                      line-height: 24px;
                    }
                  }

                  .type-title {
                    position: absolute;
                    height: 28px;
                    font-family: PingFangSC-Regular;
                    font-size: 14px;
                    color: #ffffff;
                    min-width: 110px;
                    background-image: linear-gradient(
                      42deg,
                      #fb4354 0%,
                      #fd788d 100%
                    );
                    border-radius: 4px;
                    display: flex;
                    align-items: center;
                    padding: 0 7px;
                    width: auto;
                    justify-content: center;
                    top: -14px;
                    left: 13px;
                  }
                  &:last-child {
                    margin-bottom: 12px;
                  }
                }
              }
            }
            .rest {
              .title.end {
                height: 94px;
              }
            }
            .activity {
              .title {
                background-image: linear-gradient(
                  134deg,
                  #6041e2 0%,
                  #59ffde 100%
                );
              }
              > ul > li .type-title {
                background-image: linear-gradient(
                  220deg,
                  #ffb775 0%,
                  #f96a0e 100%
                );
              }
            }
            .stay {
              .title {
                background-image: linear-gradient(
                  119deg,
                  #f73d4c 0%,
                  #fb9e47 100%
                );
              }
              > ul > li {
                .type-title {
                  background-image: linear-gradient(
                    43deg,
                    #ffbc00 0%,
                    #ffdf00 100%
                  );
                }
                h3 {
                  display: flex;
                  flex-direction: column;
                  align-items: flex-start;
                  > p {
                    margin-top: 8px;
                    > span {
                      margin-left: 0;
                      line-height: 20px;
                      &:last-child {
                        margin-left: 40px;
                      }
                    }
                  }
                  &.priceStyle {
                    flex-direction: row;
                    align-items: center;
                  }
                }
                > ul {
                  display: flex;
                  flex-direction: column;
                  > li {
                    display: flex;

                    align-items: center;
                    font-family: PingFangSC-Medium;
                    font-size: 14px;
                    color: #222222;
                    font-weight: bold;
                    margin-bottom: 8px;
                    span {
                      font-family: PingFangSC-Light;
                      font-size: 14px;
                      color: #222222;
                      font-weight: normal;
                      width: 90px;
                      line-height: 20px;
                      display: flex;
                      align-items: center;
                    }
                  }
                }
              }
            }
            .traffic {
              .title {
                background-image: linear-gradient(
                  -38deg,
                  #845bef 0%,
                  #fb4b3a 100%
                );
              }
              > ul > li {
                .type-title {
                  background-image: linear-gradient(
                    50deg,
                    #00a96a 0%,
                    #50cb9c 100%
                  );
                }
                > ul {
                  display: flex;
                  flex-direction: column;
                  > li {
                    display: flex;

                    align-items: center;
                    font-family: PingFangSC-Medium;
                    font-size: 14px;
                    color: #222222;
                    font-weight: bold;
                    margin-bottom: 8px;
                    span {
                      font-family: PingFangSC-Light;
                      font-size: 14px;
                      color: #222222;
                      font-weight: normal;
                      width: 90px;
                      line-height: 20px;
                      display: flex;
                      align-items: center;
                    }
                  }
                }
              }
            }
            .rest {
              .title {
                background-image: linear-gradient(
                  -45deg,
                  #fad961 0%,
                  #f76b1c 100%
                );
              }
              > ul > li .type-title {
                background-image: linear-gradient(
                  44deg,
                  #ffa716 0%,
                  #ffd692 100%
                );
              }
            }
          }
        }
      }
    }
  }
</style>
