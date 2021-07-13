<template>
  <div id="index">
    <header-vue name="中国医疗传媒集团"></header-vue>
    <div class="container" ref="container">
      <div class="banner">
        <img v-lazy="img" />
      </div>
      <router-link tag="div" class="backlog" to="/backlog">
        <img src="../../../assets/images/backlog.png" />
        <i></i>
        <span>
          还有
          <span>{{ count }}</span>
          个待办事项
        </span>
        <div class="arrow">
          <img src="../../../assets/images/arrow-right.png" />
        </div>
      </router-link>
      <div class="main">
        <!-- <div class="personnel">
          <h2><img src="../../../assets/images/personnel.png" alt="" /></h2>
          <ul>
            <li>
              <h3>休假</h3>
              <div>
                <div>
                  <div>
                    <img src="../../../assets/images/vacate-apply.png" alt="" />
                    <i></i>
                  </div>
                  <span>请假申请</span>
                </div>
                <div>
                  <div>
                    <img
                      src="../../../assets/images/vacate-approve.png"
                      alt=""
                    />
                  </div>
                  <span>请假审批</span>
                </div>
              </div>
            </li>
            <li>
              <h3>签到</h3>
              <div>
                <div>
                  <div>
                    <img src="../../../assets/images/sign-in.png" alt="" />
                  </div>
                  <span>签到打卡</span>
                </div>
              </div>
            </li>
          </ul>
        </div> -->
        <div class="finance">
          <h2><img src="../../../assets/images/finance.png" /></h2>
          <ul>
            <li>
              <h3>报销</h3>
              <div>
                <router-link tag="div" to="/reimburse-apply">
                  <div>
                    <img src="../../../assets/images/reimburse-apply.png" />
                  </div>
                  <span>申请</span>
                </router-link>
                <router-link tag="div" to="/reimburse-approval">
                  <div>
                    <img src="../../../assets/images/reimburse-approve.png" />
                    <i v-show="data.billCount"></i>
                  </div>
                  <span>审批</span>
                </router-link>
              </div>
            </li>
            <li>
              <h3>款项</h3>
              <div>
                <router-link tag="div" to="/fund-apply">
                  <div>
                    <img src="../../../assets/images/borrow-apply.png" />
                  </div>
                  <span>申请</span>
                </router-link>
                <router-link tag="div" to="/fund-approval">
                  <div>
                    <img src="../../../assets/images/borrow-approve.png" />
                    <i v-show="data.fundsCount"></i>
                  </div>
                  <span>审批</span>
                </router-link>
              </div>
            </li>
            <li>
              <h3>固定资产</h3>
              <div>
                <router-link tag="div" to="/fixed-apply">
                  <div>
                    <img src="../../../assets/images/property-apply.png" />
                  </div>
                  <span>申请</span>
                </router-link>
                <router-link tag="div" to="/fixed-approval">
                  <div>
                    <img src="../../../assets/images/property-approve.png" />
                    <i v-show="data.assetsCount"></i>
                  </div>
                  <span>审批</span>
                </router-link>
              </div>
            </li>
            <li>
              <h3>项目</h3>
              <div>
                <router-link tag="div" to="/project-apply">
                  <div>
                    <img src="../../../assets/images/project-apply.png" />
                  </div>
                  <span>申请记录</span>
                </router-link>
                <router-link tag="div" to="/project-approval">
                  <div>
                    <img src="../../../assets/images/project-approve.png" />
                    <i v-show="data.itemCount"></i>
                  </div>
                  <span>审批</span>
                </router-link>
              </div>
            </li>
          </ul>
        </div>

        <div class="erp">
          <h2><img src="../../../assets/images/ERP.png" /></h2>
          <ul>
            <li>
              <h3>盖章</h3>
              <div>
                <router-link tag="div" to="/useChapter-apply">
                  <div>
                    <img src="../../../assets/images/chapter-apply.png" />
                  </div>
                  <span>申请</span>
                </router-link>
                <router-link tag="div" to="/useChapter-approval">
                  <div>
                    <img src="../../../assets/images/chapter-approve.png" />
                    <i v-show="data.sealCount"></i>
                  </div>
                  <span>审批</span>
                </router-link>
              </div>
            </li>
            <li>
              <h3>资质出借</h3>
              <div>
                <router-link tag="div" to="/qualificationLoan-apply">
                  <div>
                    <img src="../../../assets/images/qualification-apply.png" />
                  </div>
                  <span>申请</span>
                </router-link>
                <router-link tag="div" to="/qualificationLoan-approval">
                  <div>
                    <img
                      src="../../../assets/images/qualification-approve.png"
                    />
                    <i v-show="data.licenseCount"></i>
                  </div>
                  <span>审批</span>
                </router-link>
              </div>
            </li>
            <li>
              <h3>借章</h3>
              <div>
                <router-link tag="div" to="/stampChapter-apply">
                  <div>
                    <img src="../../../assets/images/stamp-apply.png" />
                  </div>
                  <span>申请</span>
                </router-link>
                <router-link tag="div" to="/stampChapter-approval">
                  <div>
                    <img src="../../../assets/images/stamp-approve.png" />
                    <i v-show="data.borrowCount"></i>
                  </div>
                  <span>审批</span>
                </router-link>
              </div>
            </li>
            <!-- <li>
              <h3>付款</h3>
              <div>
                <router-link tag="div" to="/payment-approval">
                  <div>
                    <img
                      src="../../../assets/images/payment-approve.png"
                      alt=""
                    />
                  </div>
                  <span>付款审批</span>
                </router-link>
              </div>
            </li> -->
          </ul>
        </div>

        <div class="dispatch">
          <h2><img src="../../../assets/images/finance.png" /></h2>
          <ul>
            <li>
              <h3>派工</h3>
              <div>
                <!-- <router-link tag="div" to="/reimburse-apply">
                  <div>
                    <img src="../../../assets/images/reimburse-apply.png" />
                  </div>
                  <span>申请</span>
                </router-link> -->
                <router-link tag="div" to="/dispatch">
                  <div>
                    <img src="../../../assets/images/reimburse-approve.png" />
                    <i v-show="data.billCount"></i>
                  </div>
                  <span>派工列表</span>
                </router-link>
              </div>
            </li>
          </ul>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import headerVue from "../components/header/header.vue";
  import { _getData } from "../service/getData";
  import { mapMutations } from 'vuex';
  let img = require('../../../../static/images/banner.png');
  export default {
    data() {
      return {
        img,
        scrollTop: 0,
        count: 0,
        data: {}
      };
    },
    components: {
      headerVue
    },
    methods: {
      ...mapMutations(["setTransition"])
    },
    activated() {
      _getData("backLog/AllAuditCount", {}).then(data => {
        console.log("统计：：：", data);
        this.count = data.backLogCount;
        this.data = data;
      });
    }
    // beforeRouteLeave(to, from, next) {
    //   console.log(to);
    //   this.setTransition("turn-on");
    //   this.scrollTop = this.$refs.container.scrollTop;
    //   next();
    // },
    // beforeRouteEnter(to, from, next) {
    //   next(vm => {
    //     if (from.path) {
    //       vm.$refs.container.scrollTop = vm.scrollTop;
    //     }
    //   });
    // }
  };
</script>

<style lang="scss" scoped>
  @import "../../../../static/scss/_commonScss";

  #index {
    position: fixed;
    .container {
      background: #fff;
      .banner {
        display: flex;
        height: 155px;
        margin-top: 10px;
        margin-bottom: 13px;
        width: 100%;
        // background: #03ccbb;
        background: #f6f6f6;
        img {
          width: 100%;
        }
      }
      .backlog {
        height: 42px;
        width: 100%;
        display: flex;
        background: #f6f6f6;
        border-radius: 20px;
        align-items: center;
        margin-bottom: 28px;
        padding: 0 15px;
        position: relative;
        > img {
          height: 19px;
          margin-top: 2px;
        }
        i {
          background: #ccc;
          height: 13px;
          width: 1px;
          margin: 0 9px;
        }
        > span {
          font-family: PingFangSC-Regular;
          font-size: 14px;
          color: #222222;
          > span {
            color: #f10215;
            font-family: PingFangSC-Regular;
            font-size: 14px;
          }
        }
        .arrow {
          position: absolute;
          right: 11px;
          top: 11px;
          img {
            width: 18px;
          }
        }
      }
      .main {
        padding-top: 0.5px;
        h2 {
          height: 26px;
          margin-top: 10px;
          margin-bottom: 27px;
          font-family: FZZCHJW--GB1-0;
          font-size: 21px;
          color: #333333;
          display: flex;
          align-items: center;
          justify-content: center;
          img {
            height: 23px;
          }
        }
        ul {
          display: flex;
          justify-content: space-between;
          flex-direction: row;
          flex-wrap: wrap;
          > li {
            width: 170px;
            margin-bottom: 28px;
            h3 {
              font-family: PingFangSC-Medium;
              font-weight: bold;
              font-size: 15px;
              color: #222222;
              height: 21px;
              display: flex;
              align-items: center;
              margin-bottom: 10px;
              margin-left: 10px;
            }
            > div {
              min-height: 106px;
              opacity: 0.75;
              background: #fffaf5;
              display: flex;
              align-items: center;
              padding: 18px 20px 16px;
              justify-content: space-between;
              > div {
                > div {
                  height: 48px;
                  width: 48px;
                  //background: #f4463e;
                  display: flex;
                  justify-content: center;
                  flex-direction: column;
                  align-items: center;
                  position: relative;
                  border-radius: 5px;
                  margin: 0 auto;

                  &:active {
                    position: relative;
                    &::after {
                      content: "";
                      position: absolute;
                      height: 100%;
                      width: 100%;
                      z-index: 1;
                      background: rgba($color: #000000, $alpha: 0.5);
                      border-radius: 6px;
                    }
                  }
                  img {
                    height: 100%;
                    width: 48px;
                  }
                  i {
                    display: flex;
                    height: 10px;
                    width: 10px;
                    background: #f10215;
                    position: absolute;
                    border-radius: 5px;
                    top: -2px;
                    right: -2px;
                  }
                }
                span {
                  font-family: PingFangRC-Regular;
                  font-size: 13px;
                  color: #222222;
                  display: flex;
                  width: 52px;
                  justify-content: center;
                  text-align: center;
                  line-height: 18px;
                  margin-top: 6px;
                }
              }
            }
          }
        }
        & > .personnel {
          ul {
            li {
              &:nth-child(2) {
                > div {
                  opacity: 0.71;
                  background: rgba(255, 249, 227, 0.6);
                }
              }
            }
          }
        }
        & > .finance {
          ul {
            li {
              &:first-child {
                > div {
                  background: #eaf5ff;
                }
              }
              &:nth-child(2) {
                > div {
                  background: #ebfef6;
                }
              }
              &:nth-child(3) {
                > div {
                  background: #fffbeb;
                }
              }
              &:last-child {
                > div {
                  background: rgba(254, 246, 237, 1);
                }
              }
            }
          }
        }
        & > .erp {
          ul {
            li {
              &:nth-child(1) {
                > div {
                  background: #fef6ed;
                }
              }
              &:nth-child(2) {
                > div {
                  background: #fffbeb;
                }
              }
              &:nth-child(3) {
                > div {
                  background: #eaf5ff;
                }
              }
            }
          }
        }
      }
    }
  }
</style>
