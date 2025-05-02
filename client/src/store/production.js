import { defineStore } from 'pinia'
export const useProductionPlanStore = defineStore('productionPlan',{
state: () => ({
  searchDate : new Date(),
  orderList: [],
  selectedOrder: [],
  isOrderModalOpen: false,
}),
actions:{
  openOrderModal(){
    this.isOrderModalOpen = true
  },
  closeOrderModal(){
    this.isOrderModalOpen = false
  },
  searchDate(date) {
    this.searchDate = date
  },
  setOrderList(list){
    this.orderList = list
  },
  setSelectedOrders(orders){
    this.selectedOrder = orders
  },
  resetAll() {
    this.searchDate = new Date()
    this.orderList = []
    this.selectedOrder = []
    this.isOrderModalOpen = false
  }
},
})