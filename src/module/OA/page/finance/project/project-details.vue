<template>
  <div id="project-details">
    <header-vue name="项目详情" :data="details" :type="type"></header-vue>
    <div class="container" ref="container">
      <div :class="[{ detailDisabled: type == 'details' }, 'top']">
        <h2 v-if="type != 'details'">
          {{ name }}申请<span>（填写报销单）</span>
        </h2>
        <steps-vue
          v-else
          :stepData="details"
          :title="`提交的${details.itemType}项目申请`"
        ></steps-vue>
        <!-- 项目名称 -->
        <div class="name">
          <h3>
            <span>
              <img src="../../../../../assets/images/view-project.png" />
            </span>
            项目名称
            <i><img src="../../../../../assets/images/red-star.png"/></i>
          </h3>
          <van-field
            type="textarea"
            autosize
            rows="1"
            ref="projectName"
            @input="input('explain', $event)"
            :disabled="type != 'details' ? false : true"
            v-model="projectName"
            placeholder="请输入项目名称"
            :class="projectName && 'selected'"
          />
        </div>
        <!-- 项目类别 -->
        <div class="section categories">
          <h3>
            <span>
              <img
                src="../../../../../assets/images/project-categoies.png"
                width="22"
                height="16"
              />
            </span>
            项目类别
            <i><img src="../../../../../assets/images/red-star.png"/></i>
          </h3>
          <ul>
            <li
              @click="type != 'details' && getDepList()"
              :class="[
                CategoriesActive && 'active',
                { hasValue: projectCategories != '请选择项目类别' }
              ]"
            >
              {{ projectCategories }}
              <img
                v-if="type != 'details'"
                src="../../../../../assets/images/arrow-right.png"
              />
            </li>
          </ul>
        </div>
        <!-- 项目性质 -->
        <div class="section property">
          <h3>
            <span>
              <img
                src="../../../../../assets/images/project-property.png"
                width="22"
                height="16"
              />
            </span>
            项目性质
            <i><img src="../../../../../assets/images/red-star.png"/></i>
          </h3>
          <ul>
            <li
              @click="type != 'details' && getDepList()"
              :class="[
                PropertyActive && 'active',
                { hasValue: projectProperty != '请选择项目性质' }
              ]"
            >
              {{ projectProperty }}
              <img
                v-if="type != 'details'"
                src="../../../../../assets/images/arrow-right.png"
              />
            </li>
          </ul>
        </div>
        <!-- 所属公司 -->
        <div class="section company">
          <h3>
            <span>
              <img
                src="../../../../../assets/images/company.png"
                width="22"
                height="16"
              />
            </span>
            所属公司
            <i><img src="../../../../../assets/images/red-star.png"/></i>
          </h3>
          <ul>
            <li
              @click="type != 'details' && getDepList()"
              :class="[
                companyActive && 'active',
                { hasValue: company != '请选择所属公司' }
              ]"
            >
              {{ company }}
              <img
                v-if="type != 'details'"
                src="../../../../../assets/images/arrow-right.png"
              />
            </li>
          </ul>
        </div>
        <!-- 成本中心 -->
        <div class="section cost">
          <h3>
            <span>
              <img
                src="../../../../../assets/images/cost.png"
                width="22"
                height="16"
              />
            </span>
            成本中心
            <i><img src="../../../../../assets/images/red-star.png"/></i>
          </h3>
          <ul>
            <li
              @click="type != 'details' && getDepList()"
              :class="[
                costActive && 'active',
                { hasValue: cost != '请选择成本中心' }
              ]"
            >
              {{ cost }}
              <img
                v-if="type != 'details'"
                src="../../../../../assets/images/arrow-right.png"
              />
            </li>
          </ul>
        </div>
        <!-- 项目负责人 -->
        <div class="section principal">
          <h3>
            <span>
              <img
                src="../../../../../assets/images/project-principal.png"
                width="22"
                height="16"
              />
            </span>
            项目负责人
            <i><img src="../../../../../assets/images/red-star.png"/></i>
          </h3>
          <ul>
            <li
              @click="type != 'details' && getDepList()"
              :class="[
                PrincipalActive && 'active',
                { hasValue: projectPrincipal != '请选择项目负责人' }
              ]"
            >
              {{ projectPrincipal }}
              <img
                v-if="type != 'details'"
                src="../../../../../assets/images/arrow-right.png"
              />
            </li>
          </ul>
        </div>
        <!-- 费用起止时间 -->
        <div class="time">
          <h3>
            <span>
              <img src="../../../../../assets/images/time.png" alt="" />
            </span>
            费用起止时间
            <i><img src="../../../../../assets/images/red-star.png"/></i>
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
        <!-- 项目状态 -->
        <div class="project-status">
          <h3>
            <span>
              <img src="../../../../../assets/images/project-status.png" />
            </span>
            项目状态
            <i><img src="../../../../../assets/images/red-star.png"/></i>
          </h3>
          <div class="off-site-box">
            <span
              @click="status = '开启'"
              v-if="
                (type == 'details' && status == '开启') || type != 'details'
              "
            >
              开启
              <i
                v-if="type != 'details'"
                :class="{ active: status == '开启' }"
              ></i>
            </span>
            <span
              @click="status = '关闭'"
              v-if="
                (type == 'details' && status == '关闭') || type != 'details'
              "
            >
              关闭
              <i
                v-if="type != 'details'"
                :class="{ active: status == '关闭' }"
              ></i>
            </span>
          </div>
        </div>
        <!-- 项目合作方式 -->
        <div class="project-status approaches">
          <h3>
            <span>
              <img src="../../../../../assets/images/project-approaches.png" />
            </span>
            项目合作方式
            <i><img src="../../../../../assets/images/red-star.png"/></i>
          </h3>
          <div class="off-site-box">
            <span
              @click="isCooperation = 0"
              v-if="
                (type == 'details' && isCooperation == 0) || type != 'details'
              "
            >
              部门项目
              <i
                v-if="type != 'details'"
                :class="{ active: isCooperation == 0 }"
              ></i>
            </span>
            <span
              @click="isCooperation = 1"
              v-if="
                (type == 'details' && isCooperation == 1) || type != 'details'
              "
            >
              公司项目
              <i
                v-if="type != 'details'"
                :class="{ active: isCooperation == 1 }"
              ></i> </span
            ><span
              @click="isCooperation = 2"
              v-if="
                (type == 'details' && isCooperation == 2) || type != 'details'
              "
            >
              集团项目
              <i
                v-if="type != 'details'"
                :class="{ active: isCooperation == 2 }"
              ></i>
            </span>
          </div>
        </div>
        <!-- 项目描述 -->
        <div class="explain">
          <h3>
            <span>
              <img src="../../../../../assets/images/explain.png" />
            </span>
            项目描述
            <i><img src="../../../../../assets/images/red-star.png"/></i>
          </h3>
          <van-field
            type="textarea"
            autosize
            rows="1"
            ref="explain"
            @input="input('explain', $event)"
            :disabled="type != 'details' ? false : true"
            v-model="explainValue"
            placeholder="请输入项目描述"
            :class="explainValue && 'selected'"
          />
        </div>
      </div>
      <div class="bottom">
        <div class="preview">
          <div class="bck"></div>
          <div class="top">
            <h4>费用统计</h4>
            <ul>
              <!-- <li v-for="(item, i) in countAndSumMoney" :key="i">
                {{ item.typeName }}<span>{{ item.money }}元</span>
              </li> -->
              <li>
                <p>佣金：</p>
                <span>{{ itemComm }}元</span>
              </li>
              <li>
                <p>合计收款：</p>
                <span>{{ itemIncomes }}元</span>
              </li>
              <li>
                <p>合计付款：</p>
                <span>{{ itemPay }}元</span>
              </li>
              <li>
                <p>毛利率：</p>
                <span>{{ itemGross }}</span>
              </li>
              <li>
                <p>净利率：</p>
                <span>{{ itemNet }}</span>
              </li>
            </ul>
          </div>
          <div class="list">
            <div class="income">
              <div class="title">
                <h2>
                  预算收入表
                </h2>
                <div class="add-btn" v-if="type != 'details'">
                  <img src="../../../../../assets/images/add@2x.png" />新增
                </div>
              </div>
              <ul>
                <li v-for="item in itemBudgetList" :key="item.id">
                  <h3>
                    <p>付款方</p>
                    <span>{{ item.itemOther }}</span>
                  </h3>
                  <h3>
                    <p>成本中心</p>
                    <span>{{ item.centerName }}</span>
                  </h3>
                  <h3>
                    <p>金额</p>
                    <span>{{ item.ibMoney }}元</span>
                  </h3>
                  <h3>
                    <p>税率</p>
                    <span>{{ item.ibComm }}</span>
                  </h3>
                  <h3>
                    <p>预计收入时间</p>
                    <span>{{ item.ibTime }}</span>
                  </h3>
                  <h3>
                    <p>收入说明</p>
                    <span>{{ item.ibNote }}</span>
                  </h3>
                </li>
              </ul>
            </div>
            <div class="expense">
              <div class="title">
                <h2>
                  预算支出表
                </h2>
                <div class="add-btn" v-if="type != 'details'">
                  <img src="../../../../../assets/images/add@2x.png" />新增
                </div>
              </div>
              <ul>
                <li v-for="item in itemBudgetSpendingList" :key="item.id">
                  <h3>
                    <p>收款方</p>
                    <span>{{ item.itemOther }}</span>
                  </h3>
                  <h3>
                    <p>成本中心</p>
                    <span>{{ item.centerName }}</span>
                  </h3>
                  <h3>
                    <p>金额</p>
                    <span>{{ item.ibMoney }}元</span>
                  </h3>
                  <h3>
                    <p>税率</p>
                    <span>{{ item.ibComm }}</span>
                  </h3>
                  <h3>
                    <p>预计支出时间</p>
                    <span>{{ item.ibTime }}</span>
                  </h3>
                  <h3>
                    <p>支出说明</p>
                    <span>{{ item.ibNote }}</span>
                  </h3>
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
      type="project"
    ></footer-approve-button-vue>
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

  import { _getData } from "../../../service/getData";
  import { mapMutations } from "vuex";
  import footerApproveButtonVue from "../../../components/footer/footer-approve-button";

  import { JsCallNativeMethods } from "../../../../../common/js/jsBridge";
  import { getDay, iosKeyboard } from "../../../components/mixins/mixins";
  import { isBackNativePage } from "../../../../../common/js/jsBridge";

  export default {
    data() {
      return {
        projectName: "", //项目名称
        explainValue: "", //项目描述
        details: {},
        status: "开启", //项目状态
        projectCategories: "请选择项目类别", //项目类别
        CategoriesActive: false,
        projectProperty: "请选择项目性质", //项目性质
        PropertyActive: false,
        company: "请选择所属公司", //所属公司
        companyId: "",
        cost: "请选择成本中心", //成本中心
        costId: "",
        itemComm: "", //佣金
        itemGross: "", //毛利率
        itemNet: "", //净利率
        itemIncomes: "", //合计收入
        itemPay: "", //合计支出
        itemBudgetList: [], //预算收入表
        itemBudgetSpendingList: [], //预算支出表
        isCooperation: 0, //项目
        companyActive: false, //未填写是显示border
        costActive: false,
        projectPrincipal: "请选择项目负责人", //项目负责人
        PrincipalActive: false,
        // companySelected: false,
        // costSelected: false,
        picker1: null,
        picker2: null,

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
        judgeBack: false
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
      }
    },
    activated() {
      this.judgeBack = false;
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
      next(vm => {
        vm.details = {};
        vm.projectName = "";
        vm.projectCategories = "";
        vm.projectProperty = "";
        vm.company = "";
        vm.cost = "";
        vm.projectPrincipal = "";
        vm.fromDate = "";
        vm.endDate = "";
        vm.isCooperation = 0;
        vm.status = "关闭";
        vm.explainValue = "";
        vm.itemComm = "";
        vm.itemNet = "";
        vm.itemGross = "";
        vm.itemIncomes = "";
        vm.itemPay = "";
        vm.itemBudgetList = [];
        vm.itemBudgetSpendingList = [];
        vm.isShowfooterApproval = false;
        _getData("item/getItem", { id: vm.$route.query.id }).then(data => {
          console.log(data);
          vm.details = data;
          vm.projectName = data.itemName;
          vm.projectCategories = data.itemType;
          vm.projectProperty = data.itemNature;
          vm.company = data.chinaName;
          vm.cost = data.costCenter;
          vm.projectPrincipal = data.managerFullName;
          vm.fromDate = data.itemStartTime;
          vm.endDate = data.itemEndTime;
          vm.isCooperation = data.isCooperation;
          vm.status = data.isClose == 1 ? "关闭" : "开启";
          vm.explainValue = data.note;
          vm.itemComm = data.itemComm;
          vm.itemNet = data.itemNet;
          vm.itemGross = data.itemGross;
          vm.itemIncomes = data.itemIncomes;
          vm.itemPay = data.itemPay;
          vm.itemBudgetList = data.itemBudgetList;
          vm.itemBudgetSpendingList = data.itemBudgetSpendingList;
          let checkState;
          _.each(data.fundsCheckList, o => {
            if (userId == o.checkUser) {
              checkState = o.checkState;
            }
          });
          vm.isShowfooterApproval =
            data.status == 1 && userId != data.addUser && checkState == 0
              ? true
              : false;
        });
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
            index: this.type == "apply" ? i : "",
            data: JSON.stringify(val),
            fromDate: this.fromDate,
            endDate: this.endDate
          }
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
        _.each(this.file, o => {
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
          status: this.status, //是否异地
          checkUsers: "", //类型：审批人ID组
          billCheckList: this.details.financeBillLog || "",
          billApplyExpenseList: billApplyItemList
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
            _getData("billApply/saveBillApply", data).then(data => {
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
              query: { type: "reimburse", details: JSON.stringify(data) }
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
                endDate: this.endDate
              }
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
                endDate: this.endDate
              }
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
                endDate: this.endDate
              }
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
                endDate: this.endDate
              }
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
                endDate: this.endDate
              }
            });
            break;
        }
      }
    },
    components: {
      headerVue,
      belongVue,
      footerButtonVue,
      stepsVue,
      belongProjectVue,
      footerApproveButtonVue
    }
  };
</script>

<style lang="scss" scoped>
  @import "../../../../../../static/scss/_commonScss";
  @import "../../../../../../static/scss/_dialog";
  /deep/.errorFocus {
    border: 1px solid #f10215 !important;
  }
  #project-details {
    position: fixed;
    #header {
      /deep/ .quit {
        // display: none;
        visibility: hidden;
      }
    }
    .container {
      background: #fff;
      padding: 0;
      .top {
        padding: 0 13px;
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
          //line-height:
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

        .project-status {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin: 20px 0;
          h3 {
            margin-bottom: 0;
            > span {
              img {
                height: 20px;
              }
            }
          }
          &.approaches {
            h3 {
              span {
                img {
                  height: 19px;
                }
              }
            }
          }
          .off-site-box {
            display: flex;
            align-items: center;

            span {
              display: flex;
              align-items: center;
              font-size: 14px;
              font-family: PingFangSC-Regular, PingFang SC;
              font-weight: 500;
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
          &.principal {
            h3 {
              span {
                img {
                  height: 21px;
                  width: 18px;
                }
              }
            }
          }
          &.categories,
          &.company,
          &.cost {
            h3 {
              > span {
                img {
                  width: 20px;
                  height: 20px;
                }
              }
            }
          }
          &.property {
            h3 {
              > span {
                img {
                  width: 20px;
                  height: 21px;
                }
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
        .explain,
        .name {
          margin-top: 20px;
          h3 {
            > span {
              img {
                height: 19px;
              }
            }
          }
          .van-cell {
            display: flex;
            // height: 46px;
            align-items: center;
            background: #f8f8f8;
            border: 1px solid #f8f8f8;
            border-radius: 5px;
            font-family: PingFangSC-Regular;
            font-size: 14px;
            color: #aaaaaa;
            // padding: 13px 10px;
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

            background-color: rgba(253, 249, 246, 1);
            min-height: 150px;
            > h4 {
              height: 21px;
              font-size: 15px;
              font-family: PingFangSC-Medium;
              font-weight: bold;
              color: rgba(34, 34, 34, 1);
              line-height: 21px;
              margin-bottom: 12px;
            }
            > ul {
              display: flex;
              flex-direction: row;
              justify-content: space-between;
              flex-wrap: wrap;
              // padding: 0 13px;
              li {
                font-family: PingFangSC-Light;
                font-size: 15px;
                color: #ad7d36;
                width: 50%;
                line-height: 21px;
                margin-bottom: 10px;
                display: flex;

                &:first-child {
                  width: 100%;
                }
                p {
                  width: 85px;
                  display: flex;
                  align-items: center;
                  justify-content: flex-end;
                  margin-right: 6px;
                }
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
            .income,
            .expense {
              position: relative;
              .title {
                height: 137px;
                padding: 18px 13px 0;
                position: relative;
                // background: linear-gradient(
                //   180deg,
                //   rgba(255, 125, 116, 1) 0%,
                //   rgba(255, 125, 116, 1) 0%,
                //   rgba(255, 62, 52, 1) 100%
                // );
                background: url("../../../../../../static/images/budget-revenue.png")
                  no-repeat;
                background-size: 375px 138px;
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
                margin-top: -77px;
                //height: 148px;

                left: 0;
                top: 90px;
                border-radius: 6px;
                flex-direction: column;

                > li {
                  border-radius: 6px;
                  display: flex;
                  flex-direction: column;
                  padding: 20px 13px 13px;
                  background: #fff
                    url("../../../../../../static/images/card-bgc-red.png")
                    no-repeat -2px -2px;
                  background-size: 101% 83px;
                  border: 1px solid rgba(0, 0, 0, 0);
                  box-shadow: 0 2px 6px 1px rgba(0, 0, 0, 0.07);
                  position: relative;
                  margin-bottom: 10px;
                  width: 100%;

                  > h3 {
                    font-family: PingFangSC-Light;
                    font-size: 14px;
                    color: #222222;
                    line-height: 20px;
                    display: flex;
                    height: 20px;
                    align-items: center;
                    margin-bottom: 7px;
                    p {
                      width: 104px;
                    }
                    span {
                      font-family: PingFangSC-Medium;
                      font-weight: bold;
                      &.price {
                        display: flex;
                        line-height: 24px;
                        font-family: PingFangSC-Medium;
                        font-size: 16px;
                        margin-left: 34px;
                        color: $button-color;
                        font-weight: bold;
                      }
                    }
                  }

                  &:last-child {
                    margin-bottom: 12px;
                  }
                }
              }
            }
            .expense {
              .title {
                background: url("../../../../../../static/images/budget-expenditure.png")
                  no-repeat;
                background-size: 375px 138px;
              }
              > ul {
                > li {
                  background: #fff
                    url("../../../../../../static/images/card-bgc-blue.png")
                    no-repeat -2px -2px;
                  background-size: 101% 83px;
                }
              }
            }
          }
        }
      }
    }
  }
</style>
