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
      
      <div class="mb-3 row">
        <!-- v-if 사용 혼합살균충전 공정에선 L 붙이고 지시량에서 12 곱. pinia 사용 이전 공정의 생산량 저장, 불러내서 다음 공정의 최대 생산량 변화주기-->
        <!-- <label v-if="orderQty" class="form-label">최대 생산량: {{ orderQty }}</label> -->
        <label  class="form-label">생산수량</label>
        <div class="col-8">
        <input class="form-control text-end" v-model="manuFac" placeholder="생산수량" type="number" default="0">
        </div>
        <div class="col-4 py-2">
        <span>{{ processes.spec }}</span>
        </div>
      </div>
      <div class="mb-3 row">
        <label class="form-label">불량수량</label>
        <div class="col-8">
          <input class="form-control text-end" v-model="manuErr" placeholder="불량수량" type="number" default="0">
        </div>
        <div class="col-4 py-2">
          <span>{{ processes.spec }}</span>
        </div>
      </div>
    </div>
    <div class="col-4 d-flex align-items-center justify-content-center">
  <button class="btn btn-warning py-5 px-5" @click="turnShowModal">품질검사</button>
<QcTestModal :visible="showModal" @modalClose="turnShowModal" />
</div>
  </div>
</template>
<script>
  import {
    useProcess
  } from '@/store/processStat';
  import { useUserStore } from '@/store/user';
  import {
    mapActions,
    mapState
  } from 'pinia';
  import axios from 'axios';
  import QcTestModal from '@/examples/ModalsExaple/QcTestModal.vue';
import Swal from 'sweetalert2';
  export default {
    emits : ['setRow','setResQty'],
    components: {
      QcTestModal
    },
    data() {
      return {
        manuFac : '',
        manuErr : '',
        showModal : false,
      };
    },
    created() {},
    mounted() {},
    methods: {
      ...mapActions(useProcess,['setInst','turnStatProcess','turnStatFlow']),
     async  saveBtn(){
      // 저장버튼 클릭시 상기 정보를 공정 상세 테이블에 저장
        // console.log(this.processes);
        let data = this.processes

        let comData ={}
       
        this.processes.ac_cnt = this.manuFac
        this.processes.fault_cnt = this.manuErr
            if(this.manuErr==''){
              this.manuErr = 0
            }
            if(this.manuFac ==''){
              this.manuFac = 0
            }
        data.ac_cnt = this.manuFac
        data.fault_cnt = this.manuErr
        data.sta_time = this.getTime()
        data.end_time = this.getTime(this.processes.duration_min)
        data.pr_status = '종료'
        Object.assign(comData,this.processes,this.inst)
        console.log(comData);
        comData.userId= this.userId
        comData.flowLength = this.flowLength
        // Grid 업데이트를 위한 정보
        this.$emit('setRow',data)
        // console.log(data);
        let res = await axios.post(`/api/regPrLog`,comData)
                              .catch(err=>{
                                console.log(err);
                              })
                              console.log(res);
        if(res.data.result == 'success'){
          this.inst.p_log_no = res.data.p_log_no
          this.setInst(this.inst)
          if(this.processes.sequence_order == 1){
            // 첫공정 실행시 흐름 시작표기
            this.turnStatFlow()
          }
          this.turnStatProcess()
        }else{
          //sweetalrt
          Swal.fire({
            title: "저장 실패",
            text: "공정 결과 저장중 문제가 발생했습니다.",
            icon: "question"
          });
        };
  
        this.manuErr = ''
        this.manuFac = ''
      },
      // 가공 시간 계산 함수
      getTime(minutes=0){
        const now = new Date();
        const newTime = new Date(now.getTime() + minutes * 60000);
        const hh = String(newTime.getHours()).padStart(2, '0');
        const mm = String(newTime.getMinutes()).padStart(2, '0');
        return `${hh}:${mm}`
      },
      // 모달 상태 변화
      turnShowModal(){
        if(this.statProcess){
          if(!this.statFlow){
            this.$emit('setResQty')
          }
          this.showModal = this.showModal == true ? false : true;
        }else{
           Swal.fire({
            title: `공정`,
            text: `공정 이 진행되지 않았습니다.`,
            icon: "question"
          });
        }
      }
    },
    computed: {
  ...mapState(useProcess, ['statFlow','statProcess','processes', 'orderQty','inst','flowLength']),
  ...mapState(useUserStore,['userId']),

}
  }
</script>
<style scoped>

input[type='number']::-webkit-outer-spin-button,
input[type='number']::-webkit-inner-spin-button {
  -webkit-appearance: none;
  margin: 0;
}

</style>