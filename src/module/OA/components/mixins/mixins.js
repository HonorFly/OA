import { JsCallNativeMethods } from "../../../../common/js/jsBridge";
import _ from 'lodash'


let mixins = {
    beforeRouteLeave(to, from, next) {
        this.scrollTop = this.$refs.container.scrollTop;
        next();
    },
}



export const getDay = {
    data() {
        return {
            fromDate: '', //开始时间
            endDate: '', //结束时间
            dayNum: '1' //天数
        }
    },
    methods: {
        //选择日期
        selectDay() {
            JsCallNativeMethods(
                "navNativePage", {
                    actionName: "getDateRange",
                    data: JSON.stringify({
                        beforeDate: this.fromDate || 'null',
                        afterDate: this.endDate || 'null',
                        isUpdate: this.fromDate ? true : false,
                        module: 'oa'
                    }),
                    isForResult: true
                },
                data => {
                    this.fromDate = data.beforeDate
                    this.endDate = data.afterDate;
                    this.dayNum = data.Interval

                    if (!this.fromDate) {
                        this.$refs.time && this.$refs.time.classList.add("errorFocus");
                    } else {
                        this.$refs.time && this.$refs.time.classList.remove("errorFocus");
                    }

                }
            );
        }
    }
}


/**
 * @name iosKeyboard
 * 
 * @description 兼容iOS软键盘弹起然后收回后,页面底部键盘高度假消失而引起的点击事件焦点错乱的BUG
 * 
 * @author
 */

export const iosKeyboard = {
    data() {
        return {
            isFocus: false,
        }
    },
    mounted() {
        window.addEventListener("focusin", this.focusinEvent);

        window.addEventListener("focusout", this.focusoutEvent);
    },
    methods: {
        focusinEvent() {
            this.isFocus = true;
        },
        focusoutEvent() {
            let scrollHeight =
                document.documentElement.scrollTop || document.body.scrollTop || 0;
            if (!this.$util.isAndroid()) {
                this.isFocus = false;
                //this.$toast(this.isFocus);
                setTimeout(() => {
                    if (!this.isFocus) {
                        //重置页面滚动高度，使键盘收起后页面回到原位置
                        window.scrollTo(0, Math.max(scrollHeight - 1, 0));
                    }
                }, 0);
            }
        }
    },
    destroyed() {
        window.removeEventListener("focusin", this.focusinEvent)
        window.removeEventListener("focusout", this.focusoutEvent)
    }
}