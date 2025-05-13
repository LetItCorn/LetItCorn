<template>
  <div class="modal-box">
    <div class="filter-row justify-end">
      <label for="filter" class="font-bold">검색조건</label>
      <select v-model="selected2" id="filter" class="small-select">
        <option
          v-for="(item, index) in selectList"
          :key="index"
          :value="item.value"
        >
          {{ item.name }}
        </option>
      </select>
      <Datepicker
        v-if="selected2 === '작성일자'"
        v-model="startDate"
        class="datepicker-input"
        :teleport="true"
        :format="'yy-MM-dd'"
      />
      <Datepicker
        v-if="selected2 === '작성일자'"
        v-model="endDate"
        class="datepicker-input"
        :teleport="true"
        :format="'yy-MM-dd'"
      />
      <Datepicker
        v-if="selected2 === '종료일자'"
        v-model="endDate"
        class="datepicker-input"
        :teleport="true"
        :format="'yy-MM-dd'"
      />

      <div class="button-group">
        <button @click="handleSearch">조회</button>
        <button @click="handleSelect">선택</button>
      </div>
    </div>

    <ag-grid-vue
      ref="gridRef"
      class="ag-theme-alpine"
      style="width: 100%; height: 600px"
      :rowData="selectPlan"
      :columnDefs="columnDefs"
      :defaultColDef="defaultColDef"
      rowSelection="multiple"
      :rowMultiSelectWithClick="true"
      :suppressRowClickSelection="true"
      :animateRows="true"
      :overlayNoRowsTemplate="noRowsTemplate"
      @grid-ready="onGridReady"
    />

  </div>
</template>

<script setup>
import { ref } from "vue";
import { useProductionPlanStore } from "@/store/production";
import { AgGridVue } from "ag-grid-vue3";
import Datepicker from "@vuepic/vue-datepicker";
import "@vuepic/vue-datepicker/dist/main.css";
import { ModuleRegistry, ClientSideRowModelModule } from "ag-grid-community";
import Swal from "sweetalert2";

ModuleRegistry.registerModules([ClientSideRowModelModule]);

const productionPlanStore = useProductionPlanStore();
const emit = defineEmits(["selectOrder"]);
const selected2 = ref("작성일자");
const startDate = ref(new Date());
const endDate = ref(new Date());
const selectPlan = ref([]);
const gridRef = ref(null);
const gridApi = ref(null);

const selectList = [
  { value: "작성일자", name: "작성일자" },
  { value: "종료일자", name: "종료일자" },
];

const defaultColDef = {
  sortable: true,
  filter: true,
  resizable: true,
  floatingFilter: false,
};

const columnDefs = ref([
  {
    field: "select",
    headerName: "",
    checkboxSelection: true,
    headerCheckboxSelection: true,
    pinned: "left",
    width: 50,
  },
  { field: "sorder_code", headerName: "주문서", minWidth: 150, flex: 1 },
  { field: "item_name", headerName: "품목명", minWidth: 150, flex: 1 },
  { field: "spec", headerName: "규격", minWidth: 100, flex: 1 },
  { field: "sorder_count", headerName: "수량", minWidth: 100, flex: 1 },
]);

function toYYMMDD(dateObj) {
  if (!(dateObj instanceof Date) || isNaN(dateObj.getTime())) return "";
  const y = String(dateObj.getFullYear()).slice(2);
  const m = String(dateObj.getMonth() + 1).padStart(2, "0");
  const d = String(dateObj.getDate()).padStart(2, "0");
  return `${y}${m}${d}`;
}

function onGridReady(params) {
  gridRef.value = params.api;
  gridApi.value = params.api;
}

async function handleSearch() {
  const type = selected2.value;
  const start = toYYMMDD(startDate.value);
  const end = toYYMMDD(endDate.value);

  try {
    const data = await productionPlanStore.fetchOrders(type, start, end);
    productionPlanStore.setOrderList(data);
    selectPlan.value = Array.isArray(data) ? data : [];
    console.log("조회된 주문서:", data);
  } catch (err) {
    console.error("주문서 조회 실패:", err);
  }
}

async function handleSelect() {
  const api = gridApi.value;
  if (!api || typeof api.getSelectedRows !== "function") {
    console.error("ag-Grid API가 유효하지 않음");
    return;
  }
  const selectedRows = api.getSelectedRows();
  if (!selectedRows.length) {
    Swal.fire({
      icon: "error",
      title: "선택된 항목이 없습니다.",
    });
    return;
  }
  console.log("[모달] 선택된 주문서:", selectedRows);

  const plan_start = toYYMMDD(startDate.value);
  const plan_end = toYYMMDD(endDate.value);

  const processed = selectedRows.map((row, idx) => ({
    ...row,
    plans_head: `PPHN${plan_start}${String(idx + 1).padStart(2, "0")}`,
    plan_start: `20${plan_start.slice(0, 2)}-${plan_start.slice(2, 4)}-${plan_start.slice(4, 6)}`,
    plan_end: `20${plan_end.slice(0, 2)}-${plan_end.slice(2, 4)}-${plan_end.slice(4, 6)}`,
    plans_vol: row.sorder_count,
    item_code: row.item_no || row.item_code || "",
    delivery_date: row.delivery_date
      ? new Date(row.delivery_date).toISOString().slice(0, 10)
      : "",
  }));
  console.log("[모달] 가공된 주문서:", processed);
  productionPlanStore.setSelectedOrders(processed);
  productionPlanStore.closeOrderModal();
}
</script>

<style scoped>
.modal-box {
  overflow: visible;
  position: relative;
  z-index: 10;
  width: 90vw;
  max-width: 1400px;
  margin: 0 auto;
}
.filter-row {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  align-items: center;
  justify-content: flex-end;
  margin-bottom: 16px;
}
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
.small-select {
  width: 100px;
}
::v-deep(.v3dp__calendar) {
  z-index: 9999 !important;
}
.datepicker-input {
  max-width: 150px;
  min-width: 120px;
  width: 100%;
}

</style>
