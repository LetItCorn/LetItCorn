<!-- 생산계획 조회 화면-->
<template>
    <div class="plan-search-header">
      <label class="font-bold whitespace-nowrap">등록일자</label>
      <!--계획 작성기준 날짜 설정 후 조회가능-->
      <Datepicker
        v-model="dateRange"
        range
        :format="'yyyy-MM-dd'"
        :teleport="true"
        class="datepicker-input"
      />
      <button
        @click="fetchPlanList"
        class="bg-blue-500 px-3 py-1 rounded text-black"
      >
        조회
      </button>
      <button
        @click="deletePlans"
        class="bg-red-500 px-3 py-1 rounded text-black"
      >
        삭제
      </button>
      <button
        @click="modifyPlans"
        class="bg-red-500 px-3 py-1 rounded text-black"
      >
        수정
      </button>
    </div>
    <div class="grid-wrapper">
      <!--단편 정보 출력 그리드-->
      <ag-grid-vue
        class="ag-theme-alpine"
        style="width: 80%; height: 500px"
        ref="mainGridRef"
        :columnDefs="planColumnDefs"
        :rowData="planList"
        rowSelection="multiple"
        :modules="[ClientSideRowModelModule]"
        @rowSelectionChanged="handleRowSelection"
        @grid-ready="onGridReady"
        @rowClicked="handleRowClick"
      />
      <!--상세 정보 출력 그리드-->
      <div v-show="selectedPlan.length > 0">
        <h3 class="font-bold mt-4">세부 생산계획</h3>
        <ag-grid-vue
          class="ag-theme-alpine"
          style="width: 80%; height: 200px"
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
import { ref, onMounted, watch } from "vue";
import axios from "axios";
import Datepicker from "@vuepic/vue-datepicker";
import "@vuepic/vue-datepicker/dist/main.css";
import { AgGridVue } from "ag-grid-vue3";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-alpine.css";
import { useProductionPlanStore } from "@/store/production";
import { ModuleRegistry } from "ag-grid-community";
import { ClientSideRowModelModule } from "ag-grid-community";
import { useRouter } from "vue-router";
import Swal from "sweetalert2";

const store = useProductionPlanStore();
const router = useRouter();
const dateRange = ref([new Date(), new Date()]);
const planList = ref([]);
const detailList = ref([]);
const selectedPlan = ref([]);
const mainGridRef = ref(null);
const detailGridRef = ref(null);
const gridApi = ref(null);
const gridColumnApi = ref(null);
const detailGridApi = ref(null);

ModuleRegistry.registerModules([ClientSideRowModelModule]);

const onGridReady = (params) => {
  gridApi.value = params.api;
  gridColumnApi.value = params.columnApi;
};

const onDetailGridReady = (params) => {
  console.log("detail grid ready 됨");
  detailGridApi.value = params.api;
};

const statusMap={
  K01: "대기",
  K02: "진행중",
  K03: "완료"
};

// ref/reactive 값이 바뀔 때 특정 로직 실행
watch(detailList, (newVal) => {
  console.log("detailList 변경됨:", newVal);
  console.table(JSON.parse(JSON.stringify(newVal)));
  window.__debug_detailList = newVal;
});
// 컴포넌트가 화면에 나타났을 때 실행
onMounted(() => {
  const checkGridReady = () => {
    if (mainGridRef.value?.api) {
      console.log("Grid API 준비됨:", mainGridRef.value.api);
      mainGridRef.value.api.setRowData(planList.value);
    } else {
      setTimeout(checkGridReady, 100);
    }
  };

  checkGridReady();
});

const planColumnDefs = [
  { headerCheckboxSelection: true, checkboxSelection: true, width: 50 },
  { headerName: "생산계획번호", field: "plans_head", flex: 2 },
  { headerName: "품목명", field: "item_name", flex: 2 },
  {
    headerName: "생산시작일",
    field: "plan_start",
    valueFormatter: (params) => formatDate(params.value),
    flex: 2,
  },
  { headerName: "미지시수량", field: "unissued_vol", flex: 1 },
  {
    headerName: "생산종료일",
    field: "plan_end",
    valueFormatter: (params) => formatDate(params.value),
    flex: 2,
  },
  {
    headerName: "지시상태",
    field: "plan_stat",
    valueFormatter: params => statusMap[params.value] || params.value,
    flex: 1
  }
];

const detailColumnDefs = [
  { headerName: "생산계획번호", field: "plan_no", flex: 2 },
  { headerName: "품목명", field: "item_name", flex: 2  },
  { headerName: "주문수량", field: "sorder_count", flex: 1  },
  { headerName: "생산계획수량", field: "plans_vol", flex: 2  },
  {
    headerName: "납기일",
    field: "delivery_date",
    valueFormatter: (params) => formatDate(params.value), flex: 2 
  },
  {
    headerName: "생산시작일",
    field: "plan_start",
    valueFormatter: (params) => formatDate(params.value), flex: 2 
  },
  {
    headerName: "생산종료일",
    field: "plan_end",
    valueFormatter: (params) => formatDate(params.value), flex: 2 
  },
];

function formatDate(value) {
  if (!value) return "";
  const date = new Date(value);
  if (isNaN(date)) return "";
  return date.toISOString().split("T")[0];
}

const fetchPlanList = async () => {
  const [startDate, endDate] = dateRange.value.map(
    (d) => d.toISOString().split("T")[0]
  );
  try {
    const res = await axios.get(`/api/plans/list`, {
      params: { startDate, endDate },
    });
    console.log("받아온 planList 데이터:", res.data);
    planList.value = res.data;
    selectedPlan.value = [];
    detailList.value = [];
    store.updateSearchDate(dateRange.value);
  } catch (err) {
    Swal.fire({
      icon: "error",
      title: "생산계획 조회에 실패했습니다.",
    });
    console.error("조회 실패:", err);
  }
};

const fetchPlanDetail = async (plansHead) => {
  console.log("plans_head:", plansHead);
  const res = await axios.get(`/api/plans/detail/${plansHead}`);
  detailList.value = Array.isArray(res.data) ? res.data : [];

  const waitForGrid = () => {
    if (detailGridApi.value) {
      detailGridApi.value.setRowData(detailList.value);
    } else {
      console.warn("detailGridApi 아직 준비 안됨, 재시도");
      setTimeout(waitForGrid, 100);
    }
  };

  waitForGrid();
};

const handleRowSelection = () => {
  const selectedRows = mainGridRef.value.api.getSelectedRows();
  selectedPlan.value = selectedRows;
  if (selectedRows.length === 1) {
    fetchPlanDetail(selectedRows[0].plans_head);
  }
};
// 클릭이벤트
const handleRowClick = async (event) => {
  console.log("Row Clicked:", event.data);
  const selectedRow = event.data;
  selectedPlan.value = [selectedRow];
  await fetchPlanDetail(selectedRow.plans_head);
};
//수정
const modifyPlans = () => {
  if (selectedPlan.value.length === 0) {
    return Swal.fire({
      icon: "question",
      title: "수정할 계획을 선택해주세요.",
    });
  }
  if (selectedPlan.value.length > 1) {
    return Swal.fire({
      icon: "warning",
      title: "수정은 하나의 계획만 선택할 수 있습니다.",
    });
  }
  const plan = selectedPlan.value[0];
  if (plan.plan_stat !== "K01") {
    return Swal.fire({
      icon: "warning",
      title: `'${plan.plans_head}'은(는) 대기 상태가 아니므로 수정할 수 없습니다.`,
    });
  }
  // Pinia store에 수정 대상 저장
  store.setEditTarget(plan);
  store.setEditDetails(detailList.value);
  //수정 페이지로 이동
  router.push({ name: "ProductionPlan", query: { mode: "modify" } });
};
//삭제
const deletePlans = async () => {
  if (selectedPlan.value.length === 0)
    return Swal.fire({
      icon: "question",
      title: "삭제할 계획을 선택해주세요.",
    });
  const invalid = selectedPlan.value.find((plan) => plan.plan_stat !== "K01");
  if (invalid) {
    console.log(
      "삭제 대상 상태:",
      selectedPlan.value.map((p) => p.plan_stat)
    );
    return Swal.fire({
      icon: "warning",
      title: `'${invalid.plans_head}'은(는) 대기 상태가 아니므로 삭제할 수 없습니다.`,
    });
  }
  for (const plan of selectedPlan.value) {
    await axios.delete(`/api/plans/${plan.plans_head}`);
  }
  await fetchPlanList();
};
</script>

<style scoped>
.plan-search-header {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 12px;
  margin-top: 40px;
  margin-bottom: 24px;
}

.grid-wrapper {
  max-width: 1400px;
  margin: 0 auto;
}
.datepicker-input {
  max-width: 150px;
  min-width: 120px;
  width: 100%;
}
</style>
