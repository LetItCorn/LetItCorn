<template>
  <button @click="handleSearch">조회</button>
  <button @click="handleSelect">선택</button>
  <Datepicker
    v-model="startDate"
    class="datepicker-input"
    :teleport="true"
    :format="'yy-MM-dd'"
  />
  ~
  <Datepicker
    v-model="endDate"
    class="datepicker-input"
    :teleport="true"
    :format="'yy-MM-dd'"
  />

  <ag-grid-vue
    ref="gridRef"
    class="ag-theme-alpine"
    style="width: 100%; height: 600px"
    :rowData="planModalData"
    :columnDefs="columnDefs"
    rowSelection="multiple"
    :rowMultiSelectWithClick="true"
    :suppressRowClickSelection="true"
    @grid-ready="onGridReady"
  />
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useInstStore } from '@/store/inst'
import { storeToRefs } from 'pinia'
import axios from 'axios'
// Store 연결
const instStore = useInstStore()
const { planModalData } = storeToRefs(instStore)
// 날짜 검색 조건
const startDate = ref('')
const endDate = ref('')
// 그리드 데이터와 컬럼 정의
const gridRef = ref(null)
// 그리드 컬럼들어갈 값
const columnDefs = [
  { field: 'plans_head', headerName: '생산계획번호', checkboxSelection: true, headerCheckboxSelection: true },
  { field: 'item_name', headerName: '품목명' },
  { field: 'plans_vol', headerName: '생산계획수량' },
  { field: 'plan_start', headerName: '시작일' },
  { field: 'plan_end', headerName: '종료일' },
  { field: 'plan_stat', headerName: '계획상태' },
]
// grid ready 시 초기 데이터 로딩 가능
function onGridReady(params) {
  gridRef.value = params.api
}

// 조회 버튼
async function handleSearch() {
  const res = await axios.get('/api/plan', {
    params: {
      from: startDate.value,
      to: endDate.value
    }
  })
  instStore.setPlanModalData(res.data)
}

// 선택 버튼
function handleSelect() {
  const selected = gridRef.value.getSelectedRows()
  if (selected.length > 0) {
    instStore.setSelectedPlans(selected)  // store로 전달
  }
}
</script>
