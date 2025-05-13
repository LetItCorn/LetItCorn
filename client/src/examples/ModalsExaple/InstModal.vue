<template>
  <div class="modal-header">
    <div class="date-wrapper">
      <div class="button-group">
        <button @click="handleSearch">조회</button>
        <button @click="handleSelect">선택</button>
      </div>

      <div class="date-range">
        <label>작성일자</label>
        <Datepicker v-model="startDate" :format="'yy-MM-dd'" />
        <span>~</span>
        <Datepicker v-model="endDate" :format="'yy-MM-dd'" />
      </div>
    </div>
  </div>
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
    @first-data-rendered="(params) => params.api.deselectAll()"
    @rowSelected="(e) => console.log('선택된 row:', e)"
  />
  <!--@first-data-rendered="params => params.api.deselectAll()" 쓴 이유 = 
  rowData바뀌고도 선택된 상태 유지 되는 것을 방지-->
</template>

<script setup>
import { ref, onUnmounted } from "vue";
import { useInstStore } from "@/store/inst";
import { storeToRefs } from "pinia";
import { AgGridVue } from "ag-grid-vue3";
import "ag-grid-community/styles/ag-grid.css";
import Datepicker from "@vuepic/vue-datepicker";
import axios from "axios";
import dayjs from "dayjs";
import Swal from "sweetalert2";

// Store 연결
const instStore = useInstStore();
const { planModalData } = storeToRefs(instStore);
// 날짜 검색 조건
const startDate = ref("");
const endDate = ref("");
// 그리드 데이터와 컬럼 정의
const gridRef = ref(null);        // 원래 AgGridVue 컴포넌트를 참조
const gridApi = ref(null);        // 여기에는 API만 저장
// 그리드 컬럼들어갈 값
const columnDefs = [
  {
    field: "select",
    checkboxSelection: true,
    headerCheckboxSelection: true,
    pinned: "left",
    width: 50,
  },
  { field: "plan_no", headerName: "생산계획번호", flex: 2 },
  { field: "item_name", headerName: "품목명", flex: 2 },
  { field: "spec", headerName: "규격", flex: 1 },
  { field: "item_code", headerName: "품목코드", hide: true },
  { field: "plans_vol", headerName: "생산계획수량", flex: 1 },
  {
    field: "plan_start",
    headerName: "시작일",
    flex: 2,
    valueFormatter: (params) => {
      return params.value ? dayjs(params.value).format("YYYY-MM-DD") : ""; //dayjs를 활용 날짜변환
    },
  },
  {
    field: "plan_end",
    headerName: "종료일",
    flex: 2,
    valueFormatter: (params) => {
      return params.value ? dayjs(params.value).format("YYYY-MM-DD") : "";//dayjs를 활용 날짜변환
    },
  },
  { field: "plan_stat_label", headerName: "계획상태", flex: 1 },
];
// grid ready 시 초기 데이터 로딩
function onGridReady(params) {
  console.log("[onGridReady] api:", params.api);
  gridRef.value = params;         // 필요하면 유지
  gridApi.value = params.api;     // API 따로 저장
}
onUnmounted(() => {
  instStore.reset(); // 모달이 닫히면 store 값 초기화
});
// 조회 버튼
async function handleSearch() {
  const formattedStart = startDate.value
    ? dayjs(startDate.value).format("YYYY-MM-DD")
    : null;
  const formattedEnd = endDate.value
    ? dayjs(endDate.value).format("YYYY-MM-DD")
    : null;

  console.log("검색 날짜:", formattedStart, formattedEnd);
  const res = await axios.get("/api/imodal/search", {
    params: {
      startDate: formattedStart,
      endDate: formattedEnd,
    },
  });
  instStore.setPlanModalData(res.data);
}

// 선택 버튼
async function handleSelect() {
  const selected = gridApi.value?.getSelectedRows?.() || [];
  console.log("선택된 항목:", selected);
  if (!selected.length){
    Swal.fire({icon: "error", title: "선택된 항목이 없습니다."})
    return ;
  };

instStore.setSelectedPlans(selected);
instStore.closeModal();
}
</script>

<style scoped>
.modal-header {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 12px;
  margin-top: 40px;
}

.date-wrapper {
  position: relative;
  width: 100%;
  max-width: 600px;
}

.button-group {
  position: absolute;
  top: -36px;
  right: 0;
  display: flex;
  gap: 8px;
}

.date-range {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
}

.date-range label {
  font-weight: bold;
  white-space: nowrap;
  margin-bottom: 0;
}
</style>
