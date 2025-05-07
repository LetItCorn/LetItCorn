// client/src/store/inbound.js
import { defineStore } from 'pinia';

export const useInboundStore = defineStore('inbound', {
  state: () => ({
    // 품질검사 PASS된 발주서를 보관
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
