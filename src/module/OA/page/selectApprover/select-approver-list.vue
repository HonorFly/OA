<template>
  <div id="select-approver-list">
    <header-vue name="选择审批人"></header-vue>
    <div class="container">
      <ul>
        <li
          tag="li"
          v-for="(item, i) in approveArr"
          :key="i"
          @click.stop="clickHandle(i)"
        >
          <div class="left">
            <img v-if="i == 0" src="../../../../assets/images/red.png" />
            <img v-if="i == 1" src="../../../../assets/images/yellow.png" />
            <img v-if="i == 2" src="../../../../assets/images/green.png" />
            <img v-if="i == 3" src="../../../../assets/images/blue.png" />
            <img v-if="i == 4" src="../../../../assets/images/purple.png" />
            第{{
              i == 0
                ? "一"
                : i == 1
                ? "二"
                : i == 2
                ? "三"
                : i == 3
                ? "四"
                : "五"
            }}审批人
          </div>
          <div class="right">
            <div v-if="item" class="select">
              <span class="shortName">
                <span class="name">
                  {{ item.fullName ? item.fullName.slice(-2) : "" }}
                </span>
                <span @click.stop="deletePerson(i, $event)">
                  <img src="../../../../assets/images/close.png" />
                </span>
              </span>
              <span class="fullName">{{ item.fullName }}</span>
            </div>
            <div v-else class="no-select">
              <span>请选择审批人</span>
              <img src="../../../../assets/images/add-red.png" />
            </div>
          </div>
        </li>
      </ul>
    </div>
    <div class="footer">
      <x-button type="primary" @click.native="save">
        保存
      </x-button>
      <x-button
        type="primary"
        :class="{ loadClass: loading }"
        :show-loading="loading"
        :disabled="loading"
        @click.native="submit"
      >
        提交
      </x-button>
    </div>
  </div>
</template>

<script>
  import headerVue from "../../components/header/header.vue";
  import { mapMutations } from "vuex";
  import { _getData } from "../../service/getData";
  import _ from "lodash";

  export default {
    data() {
      return {
        approveArr: this.type == "fund" ? new Array(5) : new Array(4),
        details: {},
        loading: false
      };
    },
    props: ["type"],
    activated() {
      this.details = JSON.parse(this.$route.query.details);
      console.log(this.details);
    },
    beforeRouteEnter(to, from, next) {
      console.log(from);
      next(vm => {
        if (
          from.name == "同事列表" ||
          from.name == "集团架构" ||
          from.name == "部门列表"
        ) {
          if (from.query.selectWorker) {
            let selectWorker = JSON.parse(from.query.selectWorker);
            console.log(selectWorker);
            let flag = true;
            _.each(vm.approveArr, v => {
              console.log(v);
              if (v && v.checkUser == selectWorker.checkUser) {
                flag = false;
              }
            });
            if (flag) {
              switch (from.params.index) {
                case "1":
                  vm.$set(vm.approveArr, 0, selectWorker);
                  break;
                case "2":
                  vm.$set(vm.approveArr, 1, selectWorker);
                  break;
                case "3":
                  vm.$set(vm.approveArr, 2, selectWorker);
                  break;
                case "4":
                  vm.$set(vm.approveArr, 3, selectWorker);
                  break;
                case "5":
                  vm.$set(vm.approveArr, 4, selectWorker);
                  break;
              }
            }
          }
        } else {
          if (JSON.parse(to.query.details).id == "") {
            if (vm.type == "fund") {
              vm.approveArr = new Array(5);
            } else {
              vm.approveArr = new Array(4);
            }
          } else {
            if (vm.details.billCheckList.length) {
              vm.approveArr = vm.details.billCheckList;
              if (vm.type == "fund") {
                vm.approveArr.length = 5;
              } else {
                vm.approveArr.length = 4;
              }
            } else {
              if (vm.type == "fund") {
                vm.approveArr = new Array(5);
              } else {
                vm.approveArr = new Array(4);
              }
            }
          }
        }
      });
    },
    methods: {
      ...mapMutations(["setTransition"]),
      clickHandle(i) {
        if (i > 0) {
          if (!this.approveArr[i - 1]) {
            this.$toast("请按顺序依次选择审批人");
            return;
          }
        }
        this.setTransition("turn-on");
        this.$router.push({ path: `/select-approver/${i + 1}` });
      },
      deletePerson(i, e) {
        e.stopPropagation();
        console.log(e);
        console.log(i);
        this.$set(this.approveArr, i, null);
      },
      save() {
        var checkUser = this.getDetailsInfo();
        this.details.checkUsers = checkUser.join(",");
        console.log(this.details);
        switch (this.type) {
          case "fixed":
            this.addOrUpdate("fixedAssets/saveFixedAssets", this.details);
            break;
          case "reimburse":
            this.addOrUpdate("billApply/saveBillApply", this.details);
            break;
          case "fund":
            this.addOrUpdate("financeFunds/saveFinanceFunds", this.details);
            break;
        }
      },

      submit() {
        this.loading = true;
        var checkUser = this.getDetailsInfo();
        if (checkUser.length) {
          this.details.status = 1;
          this.details.checkUsers = checkUser.join(",");
          switch (this.type) {
            case "fixed":
              this.addOrUpdate("fixedAssets/saveFixedAssets", this.details);
              break;
            case "reimburse":
              this.addOrUpdate("billApply/saveBillApply", this.details);
              break;
            case "fund":
              this.addOrUpdate("financeFunds/saveFinanceFunds", this.details);
              break;
          }
        } else {
          this.loading = false;
          this.$toast("请选择审批人");
          return false;
        }
      },
      addOrUpdate(url, params) {
        _getData(url, params)
          .then(data => {
            console.log(data);
            this.loading = false;
          })
          .then(() => {
            this.$route.params.path = "saveBtn";
            this.$router.go(-2);
            this.setTransition("turn-on");
          });
      },
      getDetailsInfo() {
        let checkUser = [];
        _.map(this.approveArr, v => {
          if (v) {
            return checkUser.push(v.checkUser);
          }
        });
        return checkUser;
      }
    },
    components: {
      headerVue
    }
  };
</script>

<style lang="scss" scoped>
  @import "../../../../../static/scss/_commonScss";
  #select-approver-list {
    position: fixed;
    .container {
      padding: 0;
      ul {
        display: flex;
        flex-direction: column;
        padding-top: 13px;
        li {
          height: 65px;
          display: flex;
          align-items: center;
          padding: 0 13px;
          background: #fff;
          margin-bottom: 10px;
          justify-content: space-between;
          .left {
            font-family: PingFangSC-Regular;
            font-size: 15px;
            color: #222222;
            display: flex;
            align-items: center;
            height: 100%;
            line-height: 65px;
            img {
              width: 16px;
              margin-right: 10px;
            }
          }
          .right {
            font-family: PingFangSC-Regular;
            font-size: 14px;
            color: #aaaaaa;
            display: flex;
            align-items: center;
            line-height: 65px;
            height: 100%;
            .no-select {
              display: flex;
              align-items: center;
              img {
                width: 25px;
                margin-left: 10px;
              }
            }
            .select {
              display: flex;
              flex-direction: column;
              align-items: center;
              .shortName {
                margin-top: 9px;
                height: 32px;
                position: relative;
                .name {
                  width: 32px;
                  height: 32px;
                  display: flex;
                  align-items: center;
                  justify-content: center;
                  color: #fff;
                  font-size: 12px;
                  border-radius: 50%;
                  background-color: #4176ff;
                }
                span:last-child {
                  width: 15px;
                  height: 15px;
                  position: absolute;
                  right: -8px;
                  top: -4px;
                  display: flex;
                }
                img {
                  width: 100%;
                }
              }
              .fullName {
                width: 48px;
                height: 17px;
                line-height: 17px;
                font-size: 12px;
                margin-top: 3px;
                text-align: center;
                white-space: nowrap;
                text-overflow: ellipsis;
                overflow: hidden;
              }
            }
          }
        }
      }
    }
    .footer {
      height: 50px;
      box-shadow: $base-box-shadow;
      display: flex;
      background: #fff;
      align-items: center;
      padding: 0 13px;
      @include iphone-X-footer;
      .weui-btn {
        height: 40px;
        border-radius: 20px;
        background: $button-color;
        font-family: PingFangSC-Regular;
        font-size: 15px;
        color: #ffffff;
        &.loadClass {
          opacity: 0.3;
        }
        &:first-child {
          background: #ffffff;
          color: #f10215;
          border: 1px solid #f10215;
          margin-right: 10px;
          width: 100px;
        }
        &:last-child {
          width: 212px;
          margin: 0;
          background: #f10215;
        }
        &::after {
          display: none;
        }
      }
    }
  }
</style>
