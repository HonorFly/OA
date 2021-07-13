<template>
  <div class="tab-swiper vux-center" id="apply">
    <h2>请选择{{ name }}</h2>
    <div class="apply-content" ref="content">
      <ul>
        <li
          v-for="(item, i) in applyList"
          :key="item.id"
          @click="hundleClick(item)"
        >
          <div>
            <span>
              <i v-if="type != 'fund'">
                <img :src="item.banner" alt="" />
              </i>
              <i v-else>
                <img
                  v-if="item.wordBook == '对公借款'"
                  src="../../../../assets/images/public-loan.png"
                  alt=""
                />
                <img
                  v-if="item.wordBook == '个人借款'"
                  src="../../../../assets/images/personal-loan.png"
                  alt=""
                />
              </i>
              {{ item.wordBook }}
            </span>
            <p>
              申请
              <img src="../../../../assets/images/arrow-right.png" alt="" />
            </p>
          </div>
          <span
            v-if="
              type != 'useChapter' &&
                type != 'qualification' &&
                type != 'stampChapter'
            "
          >
            {{ item.countList.time }}年你已{{
              type == "reimburse"
                ? "报销日常费用"
                : type == "fixed"
                ? "购买"
                : type == "fund"
                ? i == 0
                  ? "借款"
                  : "对公付款"
                : ""
            }}
            <i>{{ item.countList.count }}</i>
            次，累计
            <i>{{ item.countList.totalSum }}</i> 元
            <span v-if="type == 'fund' && i == 0"
              >，当前欠款<i>{{ item.countList.totalSum }}</i> 元
            </span>
          </span>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
  import { mapMutations } from "vuex";
  export default {
    data() {
      return {};
    },
    props: {
      applyList: {
        type: Array,
        default: []
      },
      name: {
        type: String
      },
      type: {
        //类型
        type: String
      },
      scrollS: {
        type: Number,
        default: 0
      }
    },
    activated() {
      this.$refs.content.scrollTop = this.scrollS;
    },
    methods: {
      ...mapMutations(["setTransition"]),
      hundleClick(item) {
        //款项
        if (this.type == "fund") {
          this.$router.push({
            path: "/fund-details",
            query: { type: "apply", fundName: item.wordBook }
          });
        } else if (this.type == "reimburse") {
          this.$router.push({
            path: "/reimburse-details",
            query: { type: "apply", reimburseName: item.wordBook }
          });
        } else if (this.type == "fixed") {
          this.$emit("scroll", this.$refs.content.scrollTop);
          this.$router.push({
            path: "/fixed-details",
            query: {
              type: "apply",
              assetName: item.wordBook,
              assetId: item.id,
              assetImgUrl: "../../../../assets/images/daily-tariff.png"
            }
          });
        } else if (this.type == "useChapter") {
          this.$router.push({
            path: "/useChapter-details",
            query: {
              type: "apply",
              chapterTypeName: item.wordBook,
              chapterTypeId: item.id
            }
          });
        } else if (this.type == "stampChapter") {
          this.$router.push({
            path: "/stampChapter-details",
            query: {
              type: "apply",
              chapterTypeName: item.wordBook,
              chapterTypeId: item.id
            }
          });
        } else if (this.type == "qualification") {
          this.$router.push({
            path: "/qualificationLoan-details",
            query: {
              type: "apply",
              qualificationTypeName: item.wordBook,
              qualificationTypeId: item.id
            }
          });
        }

        this.setTransition("turn-on");
      }
    }
  };
</script>

<style lang="scss" scoped>
  @import "../../../../../static/scss/_commonScss.scss";
  .tab-swiper {
    height: 100%;
    .apply-content {
      height: calc(100% - 50px);
      overflow: auto;
      -webkit-overflow-scrolling: touch;
      &::-webkit-scrollbar {
        width: 0 !important;
      }
      > ul {
        display: flex;
        flex-direction: column;
        li {
          display: flex;
          flex-direction: column;
          width: 100%;

          > div {
            height: 55px;
            width: 100%;
            background: #fff;
            display: flex;
            font-weight: bold;
            align-items: center;
            padding: 0 13px;
            justify-content: space-between;
            > span {
              font-weight: bold;
              font-family: PingFangSC-Medium;
              font-size: 15px;
              color: #222222;
              display: flex;
              align-items: center;

              i {
                height: 22px;
                width: 22px;
                display: flex;
                margin-right: 10px;
                align-items: center;
                justify-content: center;
                img {
                  height: 19px;
                }
              }
            }
            > p {
              font-family: PingFangSC-Regular;
              font-size: 14px;
              color: #aaaaaa;
              display: flex;
              align-items: center;
              line-height: 20px;
              img {
                height: 19px;
                margin-left: 6px;
              }
            }
          }
          &:not(:first-child) {
            > div {
              span {
                i {
                  img {
                    height: 22px;
                  }
                }
              }
            }
          }
          > span {
            // display: flex;
            padding-left: 13px;
            margin: 8px 0 14px;
            font-family: PingFangSC-Regular;
            font-size: 12px;
            color: #4176ff;
            line-height: 17px;
            align-items: center;
            i {
              color: #f8995b;
              font-style: normal;
            }
          }
        }
      }
    }
    > h2 {
      height: 50px;
      font-family: PingFangSC-Regular;
      font-size: 14px;
      color: #666666;
      display: flex;

      align-items: center;
      padding-left: 13px;
    }
  }
</style>
