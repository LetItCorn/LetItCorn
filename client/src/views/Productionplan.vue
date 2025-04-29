<template>
 <div class="container-fluid py-4">
  <Datepicker v-model="searchDate" :format="'yy-MM-dd'" :min-date="minDate" :max-date="maxDate"/>
  <button @click="openOrderModal" class="btn btn-primary">주문서 조회</button>
  <button @click="resetAll" class="btn btn-secondary">초기화</button>
  <button @click="registerPlan" class="btn btn-success">등록</button>
  <OrderSelectModal v-if="isOrderModalOpen" />
 </div>
</template>

<script setup>
import { ref } from 'vue'
import { useProductionPlanStore } from '@/store/production'
import Datepicker from 'vue3-datepicker'
//import { AgGridVue } from 'ag-gird-vue3' 
import OrderSelectModal from '@/components/OrderSelectModal.vue'
const productionPlanStore = useProductionPlanStore()

const searchDate = ref(productionPlanStore.searchDate)
const selectedOrder = ref(productionPlanStore.selectedOrder)
const isOrderModalOpen = ref(productionPlanStore.isOrderModalOpen)
const registerPlan = ref(productionPlanStore.registerPlan())

const minDate = new Date('2024-01-01')
const maxDate = new Date('2035-01-01')

function openOrderModal() {
  productionPlanStore.openOrderModal()
}
function resetAll() {
  productionPlanStore.resetAll()
}
</script>

<script>
export default {
  name: "ProductionPlan",
};
</script>
