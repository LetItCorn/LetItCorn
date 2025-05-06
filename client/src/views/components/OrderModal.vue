<!--modal.-->
<template>
<div class="modal-box">
  <div class="flex items-center gap-2 mb-4">
      <label for="filter" class="font-bold">검색조건</label>
      <select v-model="selected2" id="filter" class="border p-1 rounded">
        <option v-for="(item, index) in selectList" :key="index" :value="item.value">
          {{ item.name }}
        </option>
      </select>
      <template v-if="selected2 === '작성일자'">
        <Datepicker v-model="startDate" :min-date="new Date('2023-01-01')" :max-date="new Date()" />
        <Datepicker v-model="endDate" :min-date="startDate" :max-date="new Date()" />
      </template>
      <button @click="handleSearch" class="btn btn-primary">조회</button>
      <button @click="handleSelect" class="btn btn-warning">선택</button>
    </div>

<ag-grid-vue ref="gridRef" class="ag-theme-alpine" style="width: 100%; height: 500px;" :rowData="selectPlan" :columnDefs="columnDefs" />
</div>
</template>

<script setup>
import { ref } from 'vue'
import { AgGridVue } from 'ag-grid-vue3'
import Datepicker from 'vue3-datepicker'
import { useProductionPlanStore } from '@/store/production'

const productionPlanStore = useProductionPlanStore() 

const selected2 = ref('')
const selectList = [
  { value: '작성일자', name: '작성일자' },
  { value: '종료일자', name: '종료일자' }
]
const startDate = ref(new Date())
const endDate = ref(new Date())
const selectPlan = ref([]) 

const gridRef = ref(null)
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
  console.log('주문서 선택 완료')
}
</script>

<style>
.modal-box {
  padding: 20px;
}

.flex {
  display: flex;
}

.gap-2 {
  gap: 8px;
}

.mb-4 {
  margin-bottom: 16px;
}
</style>