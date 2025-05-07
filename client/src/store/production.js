import { defineStore } from "pinia";
import axios from "axios";

export const useProductionPlanStore = defineStore("productionPlan", {
  state: () => ({
    searchDate: new Date(),
    orderList: [],
    selectedOrder: [],
    isOrderModalOpen: false,
    editTarget: null,
    editDetails: [],
  }),

  getters: {
    getSelectedOrderSafe: (state) => state.selectedOrder || [],
  },

  actions: {
    openOrderModal() {
      this.isOrderModalOpen = true;
    },
    closeOrderModal() {
      this.isOrderModalOpen = false;
    },
    updateSearchDate(date) {
      this.searchDate = date;
    },

    async fetchOrders(type, startDate, endDate) {
      const params = { type, startDate, endDate };

      let data = [];
      await axios
        .get("/api/modal/search", { params })
        .then((res) => {
          data = res.data;
          console.log("주문서 조회 응답:", data);
          this.orderList = data;
        })
        .catch((err) => {
          console.error("스토어 주문서 조회 실패:", err);
          this.orderList = [];
        });
      return data;
    },

    setOrderList(list) {
      this.orderList = list;
    },
    setSelectedOrders(orders) {
      this.selectedOrder = orders;
    },
    setEditTarget(plan) {
      this.editTarget = plan;
    },
    setEditDetails(details) {
      this.editDetails = details
    },
    resetAll() {
      this.searchDate = new Date();
      this.orderList = [];
      this.selectedOrder = [];
      this.isOrderModalOpen = false;
    },
  },
});
