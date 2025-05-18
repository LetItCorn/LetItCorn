import { defineStore } from 'pinia'
// pinia 를 통해 관리할 store(저장소)를 정의
// : defineStore(store_id, option 객체 | setup function)
export const useProcess = defineStore('flow', {
// state : store(저장소)를 통해 관리할 대상(데이터) => data 로 작성
  state : () => ({
    inst : {}, //선택한 지시의 Lot정보
    processes : {}, // 선택한 공정의 정보
    orderQty : null,  // 지시량
    currentSeq : 0,   // 앞서 진행한 공정번호, 0일때 저장 누르면 공정실적 저장.
    flowLength : 0,   // 공정흐름의 전체 길이,
    statProcess : false, // 공정흐름을 진행하고 있는지 
    statFlow : false,  //공정이 끝이 났는지
  }), // getters : state 의 값을 필터링하거나 readonly 로 조회하기 위한 함수 정의 => computed 로 작성 getters: {
  //getters는 함수형태, readonly 라서 화살표함수로 편하게 사용
  getters : {
    getInst : state => state.inst,
    prCode : state => state.processes,
    getOrderQty : state => state.orderQty,
    getSeq : state => state.currentSeq,
    getFlowLength : state => state.flowLength,
    getStatProcess : state => state.statProcess,
    getStatFlow : state => state.statFlow,
  },
// actions : state 를 변경하기 위한 함수
  actions : {
    setInst(data){
      this.inst = data
      // console.log(this.inst);
    },
    setProCode(data){
      this.processes = data
    },
    setOrderQty(qty) {
      this.orderQty = qty;
    },
    setCurrentSeq(seq){
      this.currentSeq = seq
    },
    setFlowLength(data){
      this.flowLength = data
    },
    setStatProcess(){
      this.statProcess = false
    },
    setStatFlow(){
      this.statFlow = false
    },
    turnStatProcess(){
      this.statProcess = this.statProcess == true ? false : true
    },
    turnStatFlow(){
      this.statFlow = this.statFlow == true ? false : true
    },
  }
})