<template>
  <div>
    <ul :class="{'border':data.length-1!==index}">
      <li>
        <span>到达时间:</span>
        <van-field
          ref="person"
          v-model.trim="currentDate1"
          placeholder="请选择到达时间"
          readonly
          @click="showDateTimePicker1"
        />
      </li>
      <li>
        <span>离开时间:</span>
        <van-field
          ref="person"
          v-model.trim="currentDate2"
          placeholder="请选择离开时间"
          readonly
          @click="showDateTimePicker2"
        />
      </li>
      <li>
        <span>维修时长:</span>
          <van-field
          ref="person"
          v-model.trim="maintainTime"
          placeholder="维修时长"
          readonly
        />
      </li>
      <li>
        <span>出差时长:</span>
          <van-field
          ref="person"
          v-model.trim="businessTripTime"
          placeholder="请输入出差时长"
        />
      </li>
      <li>
          <div class="btn del" v-if="data.length!=1&&data.length-1==index" @click="$emit('handle','del')">删除该组</div>
          <div class="btn add" v-if="data.length-1==index" @click="$emit('handle','add')">增加一组</div>
      </li>
    </ul>
  </div>
</template>

<script>
  export default {
     data() {
       return {
          businessTripTime: '',
          maintainTime:"",
          currentDate1:'',
          currentDate2:'',
          unixDate1:"",
          unixDate2:"",
       }
     },
     props: {
       data: {
         type: Array,
         default: new Array()
       },
       index:{
         type:Number
       }
     },
     methods: {
        showDateTimePicker1() {
          if (!this.dateTimePicker1) {
            this.dateTimePicker1 = this.$createDatePicker({
              title: '选择到达时间',
              min: new Date(2018, 7, 8, 8, 0),
              max: new Date(2099, 9, 20, 20, 59),
              value: new Date(),
              columnCount: 5,
              onSelect: this.selectHandle
            })
          }
          this.dateTimePicker1.show()
        },
        showDateTimePicker2() {
          if (!this.dateTimePicker2) {
            this.dateTimePicker2 = this.$createDatePicker({
              title: '选择离开时间',
              min: new Date(2018, 7, 8, 8, 0),
              max: new Date(2099, 9, 20, 20, 59),
              value: new Date(),
              columnCount: 5,
              onSelect: this.selectHandle2
            })
          }
          this.dateTimePicker2.show()
        },
      selectHandle(date, selectedVal, selectedText) {
        if(this.unixDate2){
          if(date.getTime()>this.unixDate2){
            this.$createToast("到达时间不能晚于离开时间");
            return;
          }else{
            this.maintainTime = this.transformTime(this.unixDate2 - date.getTime());
          }
        }
        this.unixDate1 = date.getTime();
        this.currentDate1 = selectedVal.slice(0,3).join('-')+" "+selectedVal.slice(3).join(':')
      },
      selectHandle2(date, selectedVal, selectedText) {
        if(this.unixDate1){
          if(this.unixDate1>date.getTime()){
            this.$createToast({txt:"到达时间不能晚于离开时间",type:"warn",time:1000}).show();
            return;
          }else{
            this.maintainTime = this.transformTime(date.getTime() - this.unixDate1);
          }
        }
        this.unixDate2 = date.getTime();
        this.currentDate2 = selectedVal.slice(0,3).join('-')+" "+selectedVal.slice(3).join(':')
      },
      transformTime(unix){
         let h = (unix/1000/60/60).toFixed(2);
         return `${h}小时`
      },
     },
  }
</script>

<style lang="scss" scoped>
 @import "../../../../../static/scss/_commonScss";
  ul{
     margin-top: 20px;
    li{
      display: flex;
      align-items: center;
      margin-bottom: 10px;
      span{
        width: 78px;
      }
      .van-cell {
        flex: 1;
        display: flex;
        align-items: center;
        background: #f8f8f8;
        border-radius: 5px;
        font-family: PingFangSC-Regular;
        font-size: 14px;
        padding: 10px;
        justify-content: space-between;
        @include placeholder();
      }
      &:last-child{
        justify-content: center;
      }
      .btn{
        display: flex;
        align-items: center;
        justify-content: center;
        width: 86px;
        height: 30px;
        margin-top: 6px;
        font-size: 13px;
        color: #fff;
        border-radius: 4px;
        @include box_shadow_style;
        &.del{
          background-image: linear-gradient(222deg, #f10215 0%, #f84c5a 100%);
          margin-right: 20px;
        }
        &.add{
          background-image: linear-gradient(222deg, #8aabff 0%, #4176ff 100%);
        }
      }
    }
    &.border{
      border-bottom: 1px solid #ccc;
    }
  }
</style>
