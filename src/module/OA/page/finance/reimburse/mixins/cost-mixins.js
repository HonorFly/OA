import { _getData } from '../../../../service/getData'
import {
    mapMutations
} from "vuex";
export const cost_mixins = {
    inject: ['reload'],
    data() {
        return {
            data: [],
            btn: [],
            cost: [],
            datePicker: null,
            TPSHOW: true,
            countAndSumMoney: {}
        }
    },
    methods: {
        ...mapMutations(["setTransition"]),
        goPrev() {
            if (this.cost.length) {
                this.$route.query.cost = JSON.stringify(this.cost);
            }
        },
        btnHundleClick(item) {
            console.log(item)
            let {
                note: year,
                num,
                money,
                ...rest
            } = item

            this.countAndSumMoney = {
                year,
                num,
                money,
                fullName: ''
            }
            console.log(this.countAndSumMoney)
        },
        calendar() {
            if (!this.datePicker) {
                this.datePicker = this.$createDatePicker({
                    min: new Date(this.$route.query.fromDate),
                    max: new Date(this.$route.query.endDate),
                    value: new Date(),
                    onSelect: (date, selectedVal, selectedText) => {
                        console.log(date, selectedVal, selectedText);
                        this.value = selectedVal.join("-");
                        this.$refs.time.$el.classList.remove("errorFocus");
                    }
                });
            }

            this.datePicker.show();
        },
        delClick() {
            this.$dialog
                .confirm({
                    message: "确认删除此条数据？",
                    overlayStyle: {
                        background: "rgba(0,0,0,0.30)"
                    }
                })
                .then(() => {
                    this.$route.query.action = "del";
                    this.$router.go(-1);
                });
        },
        input(name, val) {
            console.log(name)
            if (val == "") {
                this.$refs[name].$el.classList.add("errorFocus");
            } else {
                this.$refs[name].$el.classList.remove("errorFocus");
            }
            if (name == "costValue") {
                if (this.costValue.indexOf(".") != -1) {
                    this.costValue = this.costValue.substr(0, this.costValue.indexOf(".") + 3);
                }
            }
        },
    },
    props: ['detailsData', 'type', 'index'],
    beforeRouteEnter(to, from, next) {
        next(vm => {
            vm.countAndSumMoney = {}
            vm.datePicker = null
        })
    },
    activated() {
        let toast = this.$toast.loading({
            message: "加载中...",
            duration: 0,
            forbidClick: true
        });
        _getData("category/getSmallCategory", {
            wordBook: this.$route.query.name
        }).then(data => {
            this.data = data;

            this.btn = _.filter(data, o => {
                return o.id == this.$route.query.id;
            })[0].dictionaryList;
            this.column1 = _.map(data, v => {
                return { text: v.wordBook, value: v.wordBook, id: v.id };
            });
        }).then(() => {
            toast.clear();
        });
    }
}