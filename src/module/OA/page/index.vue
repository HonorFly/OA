<template>
  <div id="index">
    <header-vue name="执与生物科技" :showBack="false">
      <van-icon name="user-o" @click="openFullscreen = true" />
    </header-vue>
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
          <h2>财务管理</h2>
          <ul>
            <li>
              <h3>报销</h3>
              <div>
                <router-link tag="div" to="/reimburse-apply">
                  <div>
                    <img src="../../../assets/images/5.png" />
                  </div>
                  <span>申请</span>
                </router-link>
                <router-link tag="div" to="/reimburse-approval">
                  <div>
                    <img src="../../../assets/images/6.png" />
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
                    <img src="../../../assets/images/7.png" />
                  </div>
                  <span>申请</span>
                </router-link>
                <router-link tag="div" to="/fund-approval">
                  <div>
                    <img src="../../../assets/images/8.png" />
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
                    <img src="../../../assets/images/9.png" />
                  </div>
                  <span>申请</span>
                </router-link>
                <router-link tag="div" to="/fixed-approval">
                  <div>
                    <img src="../../../assets/images/10.png" />
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
                    <img src="../../../assets/images/11.png" />
                  </div>
                  <span>申请记录</span>
                </router-link>
                <router-link tag="div" to="/project-approval">
                  <div>
                    <img src="../../../assets/images/12.png" />
                    <i v-show="data.itemCount"></i>
                  </div>
                  <span>审批</span>
                </router-link>
              </div>
            </li>
          </ul>
        </div>

        <div class="erp">
          <h2>资质管理</h2>
          <ul>
            <li>
              <h3>盖章</h3>
              <div>
                <router-link tag="div" to="/useChapter-apply">
                  <div>
                    <img src="../../../assets/images/13.png" />
                  </div>
                  <span>申请</span>
                </router-link>
                <router-link tag="div" to="/useChapter-approval">
                  <div>
                    <img src="../../../assets/images/14.png" />
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
                    <img src="../../../assets/images/15.png" />
                  </div>
                  <span>申请</span>
                </router-link>
                <router-link tag="div" to="/qualificationLoan-approval">
                  <div>
                    <img src="../../../assets/images/16.png" />
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
                    <img src="../../../assets/images/17.png" />
                  </div>
                  <span>申请</span>
                </router-link>
                <router-link tag="div" to="/stampChapter-approval">
                  <div>
                    <img src="../../../assets/images/18.png" />
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
          <h2>派工管理</h2>
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
                    <img src="../../../assets/images/19.png" />
                    <!-- <i v-show="data.billCount"></i> -->
                  </div>
                  <span>派工</span>
                </router-link>
              </div>
            </li>
          </ul>
        </div>

        <div class="train">
          <h2>培训管理</h2>
          <ul>
            <li>
              <h3>培训</h3>
              <div>
                <!-- <router-link tag="div" to="/reimburse-apply">
                  <div>
                    <img src="../../../assets/images/reimburse-apply.png" />
                  </div>
                  <span>申请</span>
                </router-link> -->
                <router-link tag="div" to="/train">
                  <div>
                    <img src="../../../assets/images/20.png" />
                    <!-- <i v-show="data.billCount"></i> -->
                  </div>
                  <span>培训</span>
                </router-link>
              </div>
            </li>
          </ul>
        </div>
      </div>
      <mu-dialog transition="slide-right" :open.sync="openFullscreen">
        <div class="container">
          <div class="headerImg">
            <img src="@/assets/images/8.png" alt="logo" />
          </div>
          <div class="userName">刘鹏</div>
          <div class="content">
            <ul>
              <li>版本 1.0.0</li>
              <li @click="cacheHandle">清理缓存</li>
            </ul>
          </div>
          <div class="footer" @click="window.command.loginOut('s')">
            退出登录
          </div>
        </div>
      </mu-dialog>
    </div>
  </div>
</template>

<script>
  import headerVue from "../components/header/header.vue";
  import { _getData } from "../service/getData";
  import { mapMutations } from "vuex";
  let img = require("../../../../static/images/banner@2x.png");
  export default {
    data() {
      return {
        img,
        scrollTop: 0,
        count: 0,
        data: {},
        openFullscreen: false,
      };
    },
    components: {
      headerVue,
    },
    methods: {
      ...mapMutations(["setTransition"]),
      cacheHandle() {
        this.$toast("清理成功");
      },
    },
    activated() {
      _getData("backLog/AllAuditCount", {}).then((data) => {
        console.log("统计：：：", data);
        this.count = data.backLogCount;
        this.data = data;
      });
    },
    beforeRouteLeave(to, from, next) {
      console.log(to);
      this.setTransition("turn-on");
      this.scrollTop = this.$refs.container.scrollTop;
      next();
    },
    beforeRouteEnter(to, from, next) {
      next((vm) => {
        if (from.path) {
          vm.$refs.container.scrollTop = vm.scrollTop;
        }
      });
    },
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
          height: 43px;
          background: url("../../../assets/images/1.png") no-repeat center;
          background-size: 211px 100%;
          margin-top: 10px;
          margin-bottom: 27px;
          font-size: 21px;
          font-family: PingFangSC-Semibold, PingFang SC;
          font-weight: 600;
          color: #000000;
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
                  height: 56px;
                  width: 56px;
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
                    width: 56px;
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
        .erp {
          h2 {
            background-image: url("../../../assets/images/2.png");
          }
        }

        .dispatch {
          h2 {
            background-image: url("../../../assets/images/3.png");
          }
        }

        .erp {
          h2 {
            background-image: url("../../../assets/images/4.png");
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
                  background: rgba(2, 159, 248, 0.05);
                }
              }
              &:nth-child(2) {
                > div {
                  background: rgba(255, 102, 6, 0.05);
                }
              }
              &:nth-child(3) {
                > div {
                  background: rgba(254, 171, 8, 0.05);
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
                  background: rgba(253, 79, 195, 0.04);
                }
              }
              &:nth-child(2) {
                > div {
                  background: #fffbeb;
                }
              }
              &:nth-child(3) {
                > div {
                  background: #fef6ed;
                }
              }
            }
          }
        }
        & > .dispatch {
          ul {
            li {
              &:nth-child(1) {
                > div {
                  background: #f1f9fe;
                }
              }
            }
          }
        }
        & > .train {
          ul {
            li {
              &:nth-child(1) {
                > div {
                  background: rgba(255, 98, 2, 0.04);
                }
              }
            }
          }
        }
      }
    }
  }
  /deep/ #header {
    .quit {
      justify-content: center;
      align-items: center;
    }
  }
  .mu-dialog-wrapper {
    justify-content: flex-end;
    /deep/ .mu-dialog {
      width: 75%;
      height: 100%;
      .mu-dialog-body {
        width: 100%;
        height: 100%;
        padding: 0;
        .container {
          width: 100%;
          height: 100%;
          background-color: #fff;
        }
      }
      .headerImg {
        display: flex;
        justify-content: center;
        align-items: center;
        height: 100px;
        img {
          width: 60px;
          height: 60px;
          border-radius: 50%;
        }
      }
      .userName {
        display: flex;
        justify-content: center;
        height: 76px;
      }
      .content {
        padding: 0 13px;
        margin-bottom: 30px;
        ul {
          li {
            width: 100%;
            height: 46px;
            display: flex;
            justify-content: center;
            align-items: center;
            font-size: 16px;
            color: #666;
          }
        }
      }
      .footer {
        height: 46px;
        display: flex;
        justify-content: center;
        align-items: center;
        color: #40a9ff;
        border-top: 1px solid #ddd;
        border-bottom: 1px solid #ddd;
      }
    }
  }
</style>
<style>
  .van-toast {
    z-index: 99999999 !important;
  }
</style>
