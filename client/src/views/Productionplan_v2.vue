<template>
  <div class="container-fluid py-4">
    <div v-if="!productionPlanStore.isOrderModalOpen" class="flex gap-4 justify-center items-center mb-4">
      <span class="inline-block">등록일자</span>
      <Datepicker v-model="searchDate" :format="'yy-MM-dd'" :min-date="minDate" :max-date="maxDate" />
    </div>
    <div v-if="!productionPlanStore.isOrderModalOpen" class="flex gap-4 justify-center mb-4">
      <button @click="openOrderModal" class="btn btn-primary">주문서 조회</button>   
      <button @click="resetAll" class="btn btn-secondary">초기화</button>
      <button @click="registerPlan" class="btn btn-success">등록</button>
    </div>
    <OrderSelectModal v-if="productionPlanStore.isOrderModalOpen" />
   <ag-grid-vue ref="gridRef" class="ag-theme-alpine" style="width: 100%; height: 600px;"
    :rowData="selectedOrder" :columnDefs="columnDefs" /> 
  </div>
 </template>
 
 <script>
 import { storeToRefs } from 'pinia'
 import { useProductionPlanStore } from '@/store/production'
 import Datepicker from 'vue3-datepicker'
 import { AgGridVue } from 'ag-grid-vue3' 
 import OrderSelectModal from '@/views/components/OrderModal.vue'
 import axios from 'axios'
 import 'ag-grid-community/styles/ag-grid.css'
 import 'ag-grid-community/styles/ag-theme-alpine.css'

 export default {
  components : {
    AgGridVue,
    Datepicker,
    OrderSelectModal,
  },
  setup(){
    const productionPlanStore = useProductionPlanStore();
    const { selectedOrder,  isOrderModalOpen } = storeToRefs(productionPlanStore); // getters

    return {
      productionPlanStore,
      selectedOrder,
      isOrderModalOpen,
      openOrderModal : productionPlanStore.openOrderModal, // actions
      resetAll : productionPlanStore.resetAll, // actions
    }
  },
  data(){
      return {
        gridRef : null,
        searchDate : new Date(),
        minDate : new Date('2024-01-01'),
        maxDate : new Date('2035-01-01'),
        responseData : null,
        columnDefs : [
          {cellRenderer: 'agCheckboxCellRenderer', cellEditor: '선택'},
          {field: 'orderNumber', headerName: '주문번호'},
          {field: 'productName', headerName: '생산계획번호'},
          {field: 'itemNo', headerName: '품목번호'},
          {field: 'itemName', headerName: '품목명'},
          {field: 'orderQty', headerName: '주문 수량'},
          {field: 'planQty', headerName: '생산계획수량'},
          {field: 'dueDate', headerName: '납기일'},
          {field: 'planStart', headerName: '계획시작일'},
          {field: 'planEnd', headerName: '계획종료일'},
        ],
      }
  }, 
  computed: {
    selectedOrder() {
      return this.productionPlanStore.selectedOrder
    }
  },
  methods : {
    registerPlan : async () => {
      axios.post('/plan', selectedOrder.value)
     .then(res => {
       responseData.value = res.data
       alert('등록 성공')
       this.productionPlanStore.resetAll()
     })
     .catch(err => {
       console.error('등록 실패:', err)
     })
   }, 
 }
}
 </script>
 
 