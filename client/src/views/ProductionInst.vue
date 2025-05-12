<template>
  <div v-if="!isPlanModalOpen">
    <div class="button-group">
      <button @click="resetAll">초기화</button>
      <button @click="selectPlan">생산계획조회</button>
      <button @click="registerInst">등록</button>
    </div>
    <ag-grid-vue
      ref="gridRef"
      class="ag-theme-alpine"
      style="width: 100%; height: 500px"
      domLayout="normal"
      :columnDefs="columnDefs"
      :rowData="selectedPlans"
      :isRowSelectable="isRowSelectable"
      rowSelection="multiple"
      :rowMultiSelectWithClick="true"
      :suppressRowClickSelection="true"
      @grid-ready="onGridReady"
    />
  </div>
  <PlanSelectModal v-if="isPlanModalOpen" />
</template>

<script setup>
import { storeToRefs } from "pinia";
import { AgGridVue } from "ag-grid-vue3";
import "ag-grid-community/styles/ag-grid.css";
import { ref } from "vue";
import { useInstStore } from "@/store/inst";
import PlanSelectModal from "@/examples/ModalsExaple/InstModal.vue";

const productionInstStore = useInstStore();
const gridRef = ref(null);
const gridApi = ref(null);
const { selectedPlans, isPlanModalOpen } = storeToRefs(productionInstStore);

// 등록 시 header에 담을 정보 (plans_head만 전달됨)
const instHeader = ref({
  plans_head: "",
});

function isRowSelectable(rowNode) {
  return selectedPlans.value.length !== 0;
}
function selectPlan() {
  productionInstStore.resetAll();
  productionInstStore.openModal();
}
function resetAll() {
  productionInstStore.resetAll();
}
function onGridReady(params) {
  gridApi.value = params.api;
}

const columnDefs = ref([
  {
    field: "select",
    checkboxSelection: true,
    headerCheckboxSelection: true,
    pinned: "left",
    width: 50,
  },
  { field: "plan_no", headerName: "생산계획번호", flex: 2 },
  { field: "item_name", headerName: "품목명", flex: 2 },
  { field: "plans_vol", headerName: "생산계획량", flex: 1 },
  {
    field: "iord_no",
    headerName: "지시수량",
    editable: true,
    flex: 1,
  },
  {
    field: "unassigned_count",
    headerName: "미지시수량",
    flex: 1,
    valueGetter: (params) => {
      const plansVol = Number(params.data.plans_vol) || 0;
      const iordNo = Number(params.data.iord_no) || 0;
      return plansVol - iordNo;
    },
  },
  {
    field: "plan_start",
    headerName: "생산지시일",
    editable: true,
    cellEditor: "agDateCellEditor",
    valueFormatter: (params) => {
      return params.value ? params.value.split("T")[0] : "";
    },
    flex: 2,
  },
  {
    field: "plan_end",
    headerName: "생산종료일",
    editable: true,
    cellEditor: "agDateCellEditor",
    valueFormatter: (params) => {
      return params.value ? params.value.split("T")[0] : "";
    },
    flex: 2,
  },
  {
    field: "process_header",
    headerName: "공정",
    editable: true,
    cellEditor: "agSelectCellEditor",
    cellEditorParams: {
      values: ["반공정", "완공정"],
    },
    flex: 1,
  },
  {
    field: "out_od",
    headerName: "외주",
    editable: true,
    cellEditor: "agSelectCellEditor",
    cellEditorParams: {
      values: ["Y", "N"],
    },
    flex: 1,
  },
]);

// 등록 로직
async function registerInst() {
  if (!gridApi.value) {
    console.error("gridRef is not ready");
    alert("그리드가 아직 초기화되지 않았습니다.");
  return;
}

const rowData = [];
const rowCount = gridApi.value.getDisplayedRowCount();

for (let i = 0; i < rowCount; i++) {
  const rowNode = gridApi.value.getDisplayedRowAtIndex(i);
  if (rowNode && rowNode.data) {
    rowData.push(rowNode.data);
  }
}
  if (rowData.length === 0) {
    alert("등록할 항목이 없습니다.");
    return;
  }
  instHeader.value.plans_head = rowData[0]?.plans_head;
  try {
    await productionInstStore.registerInstData({
      header: instHeader.value,
      details: rowData,
    });
    alert("등록 성공");
  } catch (err) {
    console.error(err);
    alert("등록 실패");
  }
}
</script>
