<!--modal.-->
<template>
<div>
  <select v-model="selected2">
    <option v-for="(item, index) in selectList" :key="index" :value="item.value">{{ item.name }}</option>
  </select>
  <input type="text" value="selected2">
<Datepicker v-model="startDate" :max-date="new Date()" :min-date="new Date('2023-01-01')" />
<Datepicker v-model="endDate" :max-date="new Date()" :min-date="startDate" />S
<button @click="handleSearch" class="btn btn-primary">조회</button>
<button @click="handleSelect" class="btn btn-success">선택</button>
<ag-grid-vue class="ag-theme-alpine" style="width: 100%; height: 500px;" :rowData="selectPlan" :columnDefs="columnDefs" />
</div>
</template>

<script setup>
import { ref } from 'vue'
import { AgGridVue } from 'ag-grid-vue3'
import Datepicker from 'vue3-datepicker'
import { useProductionPlanStore } from '@/store/production'

const productionPlanStore = useProductionPlanStore()
const selected2 = ref('')
const startDate = ref(null)
const endDate = ref(null)
const selectPlan = ref([]) 
const columnDefs = ref([
{cellRenderer: 'agCheckboxCellRenderer', cellEditor: '선택'},
{field: 'sorderCode', headerName: '주문서'},
{field: 'itemName', headerName: '품목명'},
{field: 'spec', headerName: '규격'},
{field: 'sorderCount', headerName: '수량'},
])

function handleSearch() {
  console.log('조회할 날짜:', startDate.value, '~', endDate.value)
}
function handleSelect() {
  const selectedRows = gridRef.value.api.getSelectedRows()

  productionPlanStore.setSelectedOrders(selectedRows)
  productionPlanStore.closeOrderModal()
  console.log('선택한 주문서 처리')
}
</script>

<style>
</style>