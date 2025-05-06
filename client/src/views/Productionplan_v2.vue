<template>
  <div class="container-fluid py-4">
    <div v-if="!isOrderModalOpen" class="flex gap-4 justify-start items-center mb-4">
      <span>등록일자</span>
      <Datepicker v-model="searchDate" :format="'yy-MM-dd'" :min-date="minDate" :max-date="maxDate" :teleport="true" class="max-w-[150px]" />
    </div>

    <div v-if="!isOrderModalOpen" class="button-group">
      <button @click="openOrderModal">주문서 조회</button>
      <button @click="resetAll">초기화</button>
      <button @click="registerPlan">등록</button>
    </div>

    <OrderSelectModal v-if="isOrderModalOpen" @selectOrder="handleSelectedOrders"/>

    <ag-grid-vue
      ref="gridRef"
      v-if="!isOrderModalOpen"
      class="ag-theme-alpine"
      style="width: 100%; height: 400px"
      :rowData="selectedOrder"
      :columnDefs="columnDefs"
      @grid-ready="onGridReady"
    />
  </div>
</template>

<script>
import { storeToRefs } from 'pinia'
import { useProductionPlanStore } from '@/store/production'
import Datepicker from '@vuepic/vue-datepicker'
import '@vuepic/vue-datepicker/dist/main.css'
import { AgGridVue } from 'ag-grid-vue3'
import OrderSelectModal from '@/views/components/OrderModal.vue'
import axios from 'axios'
import 'ag-grid-community/styles/ag-grid.css'
import 'ag-grid-community/styles/ag-theme-alpine.css'

export default {
  components: {
    AgGridVue,
    Datepicker,
    OrderSelectModal,
  },
  data() {
    return {
      searchDate: new Date(),
      minDate: new Date('2024-01-01'),
      maxDate: new Date('2035-01-01'),
      gridRef: null,
      columnDefs: [
        { headerCheckboxSelection: true, checkboxSelection: true, width: 50 },
        { field: 'sorder_code', headerName: '주문번호', minWidth: 120 },
        { field: 'plans_head', headerName: '생산계획번호', minWidth: 120 },
        { field: 'item_code', headerName: '품목번호', minWidth: 120 },
        { field: 'item_name', headerName: '품목명', minWidth: 120 },
        { field: 'sorder_count', headerName: '주문 수량', minWidth: 100 },
        { field: 'plans_vol', headerName: '생산계획수량', minWidth: 100 },
        { field: 'delivery_date', headerName: '납기일', minWidth: 120 },
        { field: 'plan_start', headerName: '계획시작일', minWidth: 120 },
        { field: 'plan_end', headerName: '계획종료일', minWidth: 120 },
      ],
    }
  },
  computed: {
    productionPlanStore() {
      return useProductionPlanStore()
    },
    selectedOrder() {
      return this.productionPlanStore.selectedOrder
    },
    isOrderModalOpen() {
      return this.productionPlanStore.isOrderModalOpen
    },
  },
  methods: {
    openOrderModal() {
      this.productionPlanStore.openOrderModal()
    },
    resetAll() {
      this.productionPlanStore.resetAll()
    },
    onGridReady(params) {
      this.gridRef = params.api
      params.api.sizeColumnsToFit()
    },
    formatDate(date) {
      return date instanceof Date ? date.toISOString().slice(0, 10) : ''
    },
    handleSelectedOrders(orders) {
    console.log('📦 [plan.vue] 전달받은 주문서:', orders);
    this.productionPlanStore.setSelectedOrders(orders);
  },
    generatePlanCode(index) {
      const date = new Date()
      const y = String(date.getFullYear()).slice(2)
      const m = String(date.getMonth() + 1).padStart(2, '0')
      const d = String(date.getDate()).padStart(2, '0')
      return `PPHN${y}${m}${d}${String(index + 1).padStart(2, '0')}`
    },
    async registerPlan() {
      try {
        const payload = {
          header: {
           plan_start: this.selectedOrder[0]?.plan_start || '',
           plan_end: this.selectedOrder[0]?.plan_end || '',
           plan_stat: 'K01',
           plans_reg: this.formatDate(new Date()),
           planer: '관리자',
         },
       details: this.selectedOrder.map(order => ({
          sorder_code: order.sorder_code,
          item_code: order.item_code,
          plans_vol: order.plans_vol,
          delivery_date: order.delivery_date,
          item_name: order.item_name
        })),
      }
        console.log('📦 Payload:', payload)
        const res = await axios.post('/api/plan', payload)
        if (res.data.isSuccessed) {
          alert('등록 성공')
          this.resetAll()
        } else {
          alert('등록 실패')
        }
      } catch (err) {
        console.error('❌ 등록 실패:', err)
        alert('등록 실패')
      }
    },
  },
}
</script>

<style scoped>
.button-group {
  display: flex;
  justify-content: flex-start;
  gap: 8px;
  margin-bottom: 1rem;
}
button {
  padding: 0.5rem 1.2rem;
  font-size: 0.95rem;
  min-width: 100px;
  height: 40px;
  border-radius: 6px;
}
</style>