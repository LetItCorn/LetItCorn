// client/src/store/inbound.js
// pinia 상태 관리 스토어: "inbound"
import { defineStore } from 'pinia';

export const useInboundStore = defineStore('inbound', {
  //1) defineStore('inbound', {...}) 호출로 스토어 생성
  //state() -> 반응형 상태 객체 반환
  state: () => ({
    // 품질검사 PASS된 발주서를 보관
    // pendingOrders : 품질검사 Pass 발주서 배열
    // processedInbouonds : 입고 처리 완료 로그 배열
    pendingOrders: [],
    // 입고 처리된 자재 로그를 보관
    processedInbounds: []
  }),
  actions: {
    setPendingOrders(orders) {
      this.pendingOrders = orders;
    },
    clearPendingOrders() {
      this.pendingOrders = [];
    },
    // 입고 처리 후 저장
    addProcessedInbounds(entries) {
      this.processedInbounds.push(...entries);
    },
    // 필요 시 초기화
    clearProcessedInbounds() {
      this.processedInbounds = [];
    }
  }
});
