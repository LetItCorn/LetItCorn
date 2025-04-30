<template>
 <div class="container-fluid py-4">
  <span>등록일자</span>
  <Datepicker v-model="searchDate" :format="'yy-MM-dd'" :min-date="minDate" :max-date="maxDate"/>
  <button @click="openOrderModal" class="btn btn-primary">주문서 조회</button>
  <OrderSelectModal v-if="isOrderModalOpen" />
  <button @click="resetAll" class="btn btn-secondary">초기화</button>
  <button @click="registerPlan" class="btn btn-success">등록</button>
  <ag-grid-vue ref="gridRef" class="ag-theme-alpine" style="width: 100%; height: 600px;"
   :rowData="selectedOrder" :columnDefs="columnDefs" /> 
 </div>
</template>

<script setup>
import { computed, ref } from 'vue'
import { useProductionPlanStore } from '@/store/production'
import Datepicker from 'vue3-datepicker'
import { AgGridVue } from 'ag-grid-vue3' 
import OrderSelectModal from '@/views/components/OrderModal.vue'
import axios from 'axios'
const productionPlanStore = useProductionPlanStore()
const gridRef = ref(null)

const searchDate = ref(productionPlanStore.searchDate)
const selectedOrder = computed(()=>productionPlanStore.selectedOrder)
const isOrderModalOpen = computed(()=>productionPlanStore.isOrderModalOpen)
const openOrderModal = () => productionPlanStore.openOrderModal()
const resetAll = () => productionPlanStore.resetAll()

const minDate = new Date('2024-01-01')
const maxDate = new Date('2035-01-01')

const registerPlan = () =>
  axios.post('/plan', selectedOrder.value)
    .then(res => {
      responseData.value = res.data
      alert('등록 성공')
      productionPlanStore.resetAll()
    })
    .catch(err => {
      console.error('등록 실패:', err)
    })
const responseData = ref(null)

const columnDefs = [
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
]
</script>

