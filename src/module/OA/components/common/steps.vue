<template>
  <div class="steps">
    <h2>
      {{ stepData.fullName }} {{ title }}
      <div class="look-details-h2">
        <span>
          提交时间：
          {{
            Object.keys(stepData).length
              ? stepData.updateTime
                ? stepData.updateTime
                : stepData.addTime
                ? stepData.addTime
                : stepData.applyTime
              : ""
          }}
        </span>
        <div class="status"><span></span>{{ stepData.statusName }}</div>
        <!-- <img
          class="statusImage"
          v-if="stepData.status == 0"
          src="../../../../assets/images/status/submit.png"
          alt=""
        /> -->
        <img
          class="statusImage"
          v-if="stepData.status == 1"
          src="../../../../assets/images/status/approve.png"
          alt=""
        />
        <img
          v-if="stepData.status == 2"
          src="../../../../assets/images/refuse.png"
          height="107"
          alt=""
        />
        <img
          v-if="stepData.status == 3"
          src="../../../../assets/images/success.png"
          height="107"
          alt=""
        />
        <img
          v-if="stepData.status == 4"
          src="../../../../assets/images/backout.png"
          height="107"
          alt=""
        />
      </div>
    </h2>
    <div
      class="step"
      v-if="Object.keys(stepData).length && setStep.length"
      :class="showAll && 'active'"
    >
      <ul>
        <li v-for="(item, i) in setStep" :key="item.id">
          <div class="avatar">
            <mu-avatar color="#4176FF" class="nameShort">
              {{
                item.fullName
                  ? item.fullName.substring(item.fullName.length - 2)
                  : ""
              }}
            </mu-avatar>
          </div>
          <div class="approvalInfo">
            <div class="top">
              <div class="left-box">
                <span class="name">{{ item.fullName }}</span>
                <span
                  :class="[
                    'approvalStatus',
                    { pass: item.checkState == 1, refuse: item.checkState == 2 }
                  ]"
                  >{{
                    item.checkState == 1
                      ? "已通过"
                      : item.checkState == 2
                      ? "已拒绝"
                      : "审批中"
                  }}</span
                >
              </div>
              <div class="approvalTime">{{ item.checkTime }}</div>
            </div>
            <div
              class="bottom"
              v-html="str(item)"
              v-show="
                item.checkNote || (!item.checkNote && i != setStep.length - 1)
              "
            ></div>
          </div>
        </li>
      </ul>

      <!-- <span @click="show" v-if="setStep.length > 3">{{
        !showAll ? "展开" : "收起"
      }}</span> -->
    </div>
    <!-- <div class="step" v-else>
      <van-skeleton title :row="2" />
    </div> -->
  </div>
</template>

<script>
  import _ from "lodash";
  export default {
    data() {
      return {
        step: [],
        tip: "",
        showAll: false
      };
    },
    props: {
      stepData: {
        type: Object,
        default: () => ({})
      },
      title: {
        type: String
      }
    },

    methods: {
      show() {
        this.showAll = !this.showAll;
      },
      str(o) {
        return o.checkNote && o.checkNote.replace(/\n/g, "<br />");
      }
    },
    computed: {
      setStep() {
        console.log("走2：：：", this.stepData);

        const checkList =
          this.stepData.billCheckList ||
          this.stepData.fundsCheckList ||
          this.stepData.financeCheckList;
        return checkList;
        // console.log(
        //   _.filter(checkList, v => {
        //     return v.checkState != 0;
        //   })
        // );
        // return _.filter(checkList, v => {
        //   return v.checkState != 0;
        // });
      }
    },
    activated() {
      this.showAll = false;
    },
    watch: {
      stepData(newVal) {
        console.log("111:::", newVal);
        let checkList =
          newVal.billCheckList ||
          newVal.fundsCheckList ||
          newVal.financeCheckList;
        var flag = true;
        if (newVal.status == 5) {
          this.tip = "已撤销";
        } else {
          _.forEach(checkList, v => {
            if (flag) {
              if (v.checkState == 0) {
                this.tip = `等待${v.userName}审批`;
                flag = false;
              } else {
                this.tip = "";
              }
            }
          });
        }
      }
    }
  };
</script>

<style lang="scss" scoped>
  .steps {
    > h2 {
      padding-top: 20px;
      font-family: PingFangSC-Medium;
      color: #222222;
      font-weight: bold;
      font-size: 18px;
      > div {
        height: auto;
        display: flex;
        position: relative;
        align-items: center;
        line-height: 25px;
        margin-bottom: 10px;
        > span {
          font-family: PingFangSC-Regular;
          font-size: 14px;
          color: #999999;
          line-height: 20px;
          margin-top: 5px;
          margin-bottom: 5px;
        }
        > img {
          height: 107px;
          position: absolute;
          right: -20px;
          top: -24px;
          &.statusImage {
            width: 56px;
            height: 24px;
            right: 13px;
            top: -12px;
          }
        }
        .status {
          font-family: PingFangSC-Light;
          font-size: 13px;
          color: #f96a0e;
          display: flex;
          align-items: center;
          height: 21px;
          //margin-top: 6px;
          span {
            margin-top: 4px;
            background: url("../../../../assets/images/point.png") no-repeat
              center;
            background-size: 100% 100%;
            display: flex;
            height: 21px;
            width: 22px;
            margin-right: 2px;
            margin-left: -4px;
          }
        }
        &.look-details-h2 {
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: flex-start;
          line-height: 25px;
          span {
            display: flex;
            line-height: 20px;
            color: #aaaaaa;
          }
        }
      }
    }

    > .step {
      background: rgba(34, 34, 34, 0.03);
      border-radius: 5px;
      padding: 15px 13px 20px;
      margin-bottom: 20px;
      // max-height: 120px;
      overflow: hidden;
      position: relative;
      transition: height 0.3s;
      &.active {
        max-height: none;
      }
      .van-skeleton {
        margin-bottom: 15px;
      }
      ul {
        li {
          display: flex;
          &:last-child {
            .approvalInfo {
              .bottom {
                border-left: none;
              }
            }
          }
          .nameShort {
            font-family: PingFangSC-Regular;
            font-size: 12px !important;
            box-shadow: 0 2px 5px 0 rgba(65, 118, 255, 0.6);
          }
          .approvalInfo {
            flex: 1;
            .top {
              height: 40px;
              display: flex;
              justify-content: space-between;
              align-items: center;
              margin-left: 15px;
              .name {
                font-family: PingFangSC-Medium;
                font-size: 15px;
                color: #222222;
                font-weight: bold;
              }
              .approvalStatus {
                font-family: PingFangSC-Regular;
                font-size: 14px;
                color: #f96a0e;
              }
              .pass {
                color: #2abd0f;
              }
              .refuse {
                color: #fb4354;
              }
              .approvalTime {
                font-family: PingFangSC-Regular;
                font-size: 13px;
                color: #999999;
              }
            }
            .bottom {
              padding-left: 35px;
              margin-left: -20px;
              border-left: 1px dotted #ccc;
              min-height: 25px;
            }
          }
        }
      }
    }
  }
</style>