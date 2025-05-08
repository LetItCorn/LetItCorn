<template>
  <div class="button-group">
    <button @click="resetAll">초기화</button>
    <button @click="selectPlan">생산계획조회</button>
    <button @click="registerInst">등록</button>
  </div>

  <PlanSelectModal v-if="isPlanModalOpen" @select="handlePlanSelected" />

  <ag-grid-vue
    ref="gridRef"
    class="ag-theme-alpine"
    :columnDefs="columnDefs"
    rowSelection="multiple"
    :rowMultiSelectWithClick="true"
    :suppressRowClickSelection="true"
  />
</template>

<script setup>
import { storeToRefs } from "pinia";
import { AgGridVue } from "ag-grid-vue3";
import "ag-grid-community/styles/ag-grid.css";
import { ref } from "vue";
import { useInstStore } from "@/store/inst";
import axios from 'axios'

const productionInstStore = useInstStore();
const gridRef = ref(null);
const { isPlanModalOpen } = storeToRefs(productionInstStore);
const columnDefs = ref([
  { field: "select", checkboxSelection: true, headerCheckboxSelection: true, pinned: "left", width: 50 },
  { field: "inst_no", headerName: "생산지시번호" },
  { field: "plan_no", headerName: "생산계획번호" },
  { field: "lot_cnt", headerName: "LOT번호" },
  { field: "item_name", headerName: "품목명" },
  { field: "plans_vol", headerName: "생산계획수량" },
  { field: "iord_no", headerName: "지시수량", editable: true },
  { field: "unassigned_count", headerName: "미지시수량" },
  { field: "plan_end", headerName: "생산종료일" },
  { field: "plan_start", headerName: "생산지시일" },
  {
    field: "process_header",
    headerName: "공정",
    editable: true,
    cellEditor: "agSelectCellEditor",
    cellEditorParams: {
      values: ["반공정", "완공정"]
    }
  },
  {
    field: "out_od",
    headerName: "외주",
    editable: true,
    cellEditor: "agSelectCellEditor",
    cellEditorParams: {
      values: ["O", "X"]
    }
  }
]);
</script>
