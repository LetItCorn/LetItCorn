<template>
 <div class="container-fluid py-4">
  <span>등록일자</span>
  <Datepicker v-model="searchDate" :format="'yy-MM-dd'" :min-date="minDate" :max-date="maxDate"/>
  <button @click="openOrderModal" class="btn btn-primary">주문서 조회</button>
  <OrderSelectModal v-if="isOrderModalOpen" />
  <button @click="resetAll" class="btn btn-secondary">초기화</button>
  <button @click="registerPlan" class="btn btn-success">등록</button>
  <ag-grid-vue class="ag-theme-alpine" style="width: 100%; height: 600px;"
   :rowData="selectedOrder" :columnDefs="columnDefs" /> 
 </div>
</template>

<script setup>
import { computed, ref } from 'vue'
import { useProductionPlanStore } from '@/store/production'
import Datepicker from 'vue3-datepicker'
import { AgGridVue } from 'ag-gird-vue3' 
import OrderSelectModal from '@/components/OrderSelectModal.vue'
const productionPlanStore = useProductionPlanStore()

const searchDate = ref(productionPlanStore.searchDate)
const selectedOrder = computed(()=>productionPlanStore.selectedOrder)
const isOrderModalOpen = computed(()=>productionPlanStore.isOrderModalOpen)
const openOrderModal = () => productionPlanStore.openOrderModal()
const resetAll = () => productionPlanStore.resetAll()

const minDate = new Date('2024-01-01')
const maxDate = new Date('2035-01-01')

const columnDefs = [
  {cellRenderer: 'agCheckboxCellRenderer', cellEditor: '선택'},
  {field: 'orderNumber', headerName: '주문번호'},
  {field: 'productName', headerName: '생산계획번호'},
  {field: 'lotNumber', headerName: 'LOT번호'},
  {field: 'itemName', headerName: '품목명'},
  {field: 'orderQty', headerName: '주문 수량'},
  {field: 'planQty', headerName: '생산계획수량'},
  {field: 'dueDate', headerName: '납기일'},
  {field: 'planStart', headerName: '계획시작일'},
  {field: 'planEnd', headerName: '계획종료일'},
]
</script>

