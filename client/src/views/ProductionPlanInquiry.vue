<template>
  <div class="p-4 space-y-4 overflow-visible">
    <div class="flex items-center gap-4 h-[80px]">
      <label class="font-bold whitespace-nowrap">등록일자</label>
      <Datepicker
         v-model="dateRange"
         range
         :format="'yyyy-MM-dd'"
         :teleport="true"
         class="max-w-[250px]"
      />
      <button @click="fetchPlanList" class="bg-blue-500 px-3 py-1 rounded text-black">조회</button>
      <button @click="deletePlans" class="bg-red-500 px-3 py-1 rounded text-black">삭제</button>
    </div>

    <ag-grid-vue
     class="ag-theme-alpine"
     style="width: 100%; height: 500px"
     ref="mainGridRef"
     :columnDefs="planColumnDefs"
     :rowData="planList"
     rowSelection="multiple"
     :modules="[ClientSideRowModelModule]"
     @rowSelectionChanged="handleRowSelection"
     @grid-ready="onGridReady"
     @rowClicked="handleRowClick"
    />

    <div v-show="selectedPlan.length > 0">
     <h2 class="font-bold mt-4">세부 생산계획</h2>
     <ag-grid-vue
        class="ag-theme-alpine"
        style="width: 100%; height: 500px"
        ref="detailGridRef"
        :columnDefs="detailColumnDefs"
        :rowData="detailList"
        rowSelection="single"
        :modules="[ClientSideRowModelModule]"
        @grid-ready="onDetailGridReady"
      />
      </div>
  </div>
</template>

<script setup>
import { ref, onMounted, watch, nextTick } from 'vue'
import axios from 'axios'
import Datepicker from '@vuepic/vue-datepicker'
import '@vuepic/vue-datepicker/dist/main.css'
import { AgGridVue } from 'ag-grid-vue3'
import 'ag-grid-community/styles/ag-grid.css'
import 'ag-grid-community/styles/ag-theme-alpine.css'
import { useProductionPlanStore } from '@/store/production'
import { ModuleRegistry } from 'ag-grid-community'
import { ClientSideRowModelModule } from 'ag-grid-community'

const store = useProductionPlanStore()

const dateRange = ref([new Date(), new Date()])
const planList = ref([])
const detailList = ref([])
const selectedPlan = ref([])
const mainGridRef = ref(null)
const detailGridRef = ref(null)
const gridApi = ref(null)
const gridColumnApi = ref(null)
const detailGridReady = ref(false)
const detailGridApi = ref(null)
const detailColumnApi = ref(null)

ModuleRegistry.registerModules([ ClientSideRowModelModule ])

const onGridReady = (params) => {
  gridApi.value = params.api
  gridColumnApi.value = params.columnApi
}

const onDetailGridReady = (params) => {
  console.log('✅ detail grid ready 됨')
  detailGridApi.value = params.api
}

watch(detailList, (newVal) => {
  console.log("🔥 detailList 변경됨:", newVal)
  console.table(JSON.parse(JSON.stringify(newVal)))
  window.__debug_detailList = newVal
})
onMounted(() => {
  const checkGridReady = () => {
    if (mainGridRef.value?.api) {
      console.log('✅ Grid API 준비됨:', mainGridRef.value.api)
      mainGridRef.value.api.setRowData(planList.value)
    } else {
      setTimeout(checkGridReady, 100)
    }
  }

  checkGridReady()
})

const planColumnDefs = [
  { headerCheckboxSelection: true, checkboxSelection: true, width: 50 },
  { headerName: '생산계획번호', field: 'plans_head' },
  { headerName: '품목명', field: 'item_name' },
  { headerName: '생산시작일', field: 'plan_start', valueFormatter: params => formatDate(params.value) },
  { headerName: '미지시수량', field: 'unissued_vol' },
  { headerName: '생산종료일', field: 'plan_end', valueFormatter: params => formatDate(params.value) },
]

const detailColumnDefs = [
  { headerName: '생산계획번호', field: 'plan_no' },
  { headerName: '품목명', field: 'item_name' },
  { headerName: '주문수량', field: 'sorder_count' },
  { headerName: '생산계획수량', field: 'plans_vol' },
  { headerName: '납기일', field: 'delivery_date', valueFormatter: params => formatDate(params.value) },
  { headerName: '생산시작일', field: 'plan_start', valueFormatter: params => formatDate(params.value) },
  { headerName: '생산종료일', field: 'plan_end', valueFormatter: params => formatDate(params.value) },
]

function formatDate(value) {
  if (!value) return ''
  const date = new Date(value)
  if (isNaN(date)) return ''
  return date.toISOString().split('T')[0]
}

const fetchPlanList = async () => {
  const [startDate, endDate] = dateRange.value.map(d =>
    d.toISOString().split('T')[0]
  )
  try {
    const res = await axios.get(`/api/plans/list`, {
      params: { startDate, endDate }
    })
    console.log("📦 받아온 planList 데이터:", res.data)
    planList.value = res.data
    selectedPlan.value = []
    detailList.value = []
    store.updateSearchDate(dateRange.value)
  } catch (err) {
    alert('생산계획 조회에 실패했습니다.')
    console.error('📛 조회 실패:', err)
  }
}

const fetchPlanDetail = async (plansHead) => {
  console.log('👉 plans_head:', plansHead)
  const res = await axios.get(`/api/plans/detail/${plansHead}`)
  detailList.value = Array.isArray(res.data) ? res.data : []

  const waitForGrid = () => {
    if (detailGridApi.value) {
      detailGridApi.value.setRowData(detailList.value)
      console.log('✅ detailGridApi에 주입 성공:', detailList.value)
    } else {
      console.warn('❗ detailGridApi 아직 준비 안됨, 재시도')
      setTimeout(waitForGrid, 100)
    }
  }

  waitForGrid()
}

const handleRowSelection = () => {
  const selectedRows = mainGridRef.value.api.getSelectedRows()
  selectedPlan.value = selectedRows
  if (selectedRows.length === 1) {
    fetchPlanDetail(selectedRows[0].plans_head)
  }
}

const handleRowClick = async (event) => {
  console.log('🖱️ Row Clicked:', event.data)
  const selectedRow = event.data
  selectedPlan.value = [selectedRow]
  await fetchPlanDetail(selectedRow.plans_head)
}

const deletePlans = async () => {
  if (selectedPlan.value.length === 0)
    return alert('삭제할 계획을 선택해주세요.')

  for (const plan of selectedPlan.value) {
    await axios.delete(`/api/plans/${plan.plans_head}`)
  }
  await fetchPlanList()
}
</script>