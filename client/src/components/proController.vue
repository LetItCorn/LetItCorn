<template>
  <div class="card-header">
    <div class="row">
      <div class="col-2"><span>{{ processes.process_name }}</span></div>
      <span class="col-8">공정진행</span>
    </div>
  </div>
  <div class="card-body container row">
    <div class="col-8" style="border-right: 1px solid #555;">
      <div class="mb-3 text-end">
        <!-- 저장버튼 클릭시  불량 수량이 0보다 크면 사유를 입력해야한다.
         공정흐름의 공정 갯수를 pinia에 저장해 뒀다가, 저장 버튼 클릭 때 마다 현재 seq와 비교해서 공정 실적 저장 하다가 마지막 공정 완료시 지시의 상태 변경-->
         <!-- 첫공정인지 확인(pinia에 확인) -> 새로운 공정실적 저장 -->
        <button class="btn btn-success" @click="saveBtn">저장</button>
      </div>
      <div class="mb-3">
        <!-- v-if 사용 혼합살균충전 공정에선 L 붙이고 지시량에서 12 곱. pinia 사용 이전 공정의 생산량 저장, 불러내서 다음 공정의 최대 생산량 변화주기-->
        <!-- <label v-if="orderQty" class="form-label">최대 생산량: {{ orderQty }}</label> -->
        <label  class="form-label">생산수량</label>
        <input class="form-control" v-model="manuFac" placeholder="생산수량" type="number" default="0">
      </div>
      <div class="mb-3">
        <label class="form-label">불량수량</label>
        <input class="form-control" v-model="manuErr" placeholder="불량수량" type="number" default="0">
      </div>
    </div>

    <div class="col-4 d-flex align-items-center justify-content-center">
  <button class="btn btn-warning py-5 px-5">품질검사</button>
</div>
  </div>
</template>
<script>
  import {
    useProcess
  } from '@/store/processStat';
  import {
    mapState
  } from 'pinia';
  import axios from 'axios';
  export default {
    emits : ['setRow'],
    components: {},
    data() {
      return {
        manuFac: 0,
        manuErr: 0
      };
    },
    created() {},
    mounted() {},
    methods: {
     async  saveBtn(){
      // 저장버튼 클릭시 상기 정보를 공정 상세 테이블에 저장
        // console.log(this.processes);
        let data = this.processes
        // data.lot_cnt = this.inst.lot_cnt
        data.ac_cnt = this.manuFac
        data.fault_cnt = this.manuErr
        data.sta_time = this.getTime()
        data.end_time = this.getTime(this.processes.duration_min)
        data.pr_status = '종료'
        // Grid 업데이트를 위한 정보
        this.$emit('setRow',data)
        console.log(data);
        let res = await axios.post(`/api/regPrLog`,data)
                              .catch(err=>{
                                console.log(err);
                              })
        console.log(res);
        this.manuErr = 0
        this.manuFac = 0
      },
      // 가공 시간 계산 함수
      getTime(minutes=0){
        const now = new Date();
        const newTime = new Date(now.getTime() + minutes * 60000);
        const hh = String(newTime.getHours()).padStart(2, '0');
        const mm = String(newTime.getMinutes()).padStart(2, '0');
        return `${hh}:${mm}`
      }
    },
    computed: {
  ...mapState(useProcess, ['processes', 'orderQty','inst'])
}
  }
</script>
<style scoped />