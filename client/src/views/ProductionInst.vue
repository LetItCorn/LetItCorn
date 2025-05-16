<template>
  <div v-if="!isPlanModalOpen">
    <div class="inst-wrapper">
      <div class="inst-header">
        <div class="button-group">
          <button class="bg-blue-500 px-3 py-1 rounded text-black" @click="addEmptyRow">행 추가</button>
          <button class="bg-blue-500 px-3 py-1 rounded text-black" @click="resetAll">초기화</button>
          <button class="bg-blue-500 px-3 py-1 rounded text-black" @click="selectPlan">생산계획조회</button>
          <button class="bg-blue-500 px-3 py-1 rounded text-black" @click="registerInst">등록</button>
        </div>
      </div>
    </div>
    <div class="grid-wrapper">
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
  </div>
  <PlanSelectModal v-if="isPlanModalOpen" />
</template>

<script setup>
import { storeToRefs } from "pinia";
import { AgGridVue } from "ag-grid-vue3";
import "ag-grid-community/styles/ag-grid.css";
import { ref, onMounted } from "vue";
import { useInstStore } from "@/store/inst";
import { useUserStore } from "@/store/user";
import PlanSelectModal from "@/examples/ModalsExaple/InstModal.vue";
import { useRoute } from "vue-router";
import Swal from "sweetalert2";
import axios from "axios";
import router from "@/router";

const productionInstStore = useInstStore();
const userStore = useUserStore();
console.log("현재 로그인된 사용자:", userStore.user);
const route = useRoute();
const gridRef = ref(null);
const gridApi = ref(null);
const { selectedPlans } = storeToRefs(productionInstStore);
const { isPlanModalOpen } = storeToRefs(productionInstStore);
// 등록 시 header에 담을 정보 (plans_head만 전달됨)
const instHeader = ref({
  plans_head: "",
});

onMounted(async () => {
  //수정으로 진입할때만 alert 뜨게끔 설정.
  const mode = route.query.mode; //라우트의 파라미터중 mode값을 읽어옴. 화면작성/수정 구분시 사용
  const instNo = route.query.inst_no;
  if (mode === "modify" && !instNo) {
    Swal.fire({
      icon: "error",
      title: "지시 번호가 없습니다.",
    });
    return;
  }

  if (mode === "modify") {
    try {
      const res = await axios.get(`/api/instHead/${instNo}`);
      const data = Array.isArray(res.data) ? res.data : [res.data];
      // 공정코드 변환
      const processLabelMap = {
        Z01: "완공정",
        X01: "반공정",
      };
      const labelMapped = data.map((row) => ({
        ...row,
        process_header:
          processLabelMap[row.process_header] || row.process_header,
      }));
      productionInstStore.setSelectedPlans(labelMapped);
    } catch (err) {
      console.error("수정용 데이터 조회 실패:", err);
      Swal.fire({
        icon: "error",
        title: "지시 데이터 조회 중 오류 발생",
      });
    }
  }
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

const addEmptyRow = () =>{
  if (!gridApi.value) {
    Swal.fire({
      icon: "question",
      title: "그리드가 아직 초기화되지 않았습니다.",
    });
    return;
  }
  const newRow = {
    inst_no: '',            
    plan_no: '',
    lot_cnt: '', 
    item_name: '',
    item_code: '',  
    plans_vol: '',
    iord_no: '', 
    porder_seq: '',
    unassigned_count: '',
    plan_start: '',
    plan_end: '',
    process_header: '',
    out_od: ''
  };
  gridApi.value.applyTransaction({ add: [newRow] });
};

const columnDefs = ref([
  {
    field: "select",
    checkboxSelection: true,
    headerCheckboxSelection: true,
    pinned: "left",
    width: 50,
  },
  {
    field: "inst_no",
    headerName: "지시번호",
    editable: false,
    hide: route.query.mode !== "modify",
    flex: 2,
  },
  {
    field: "lot_cnt",
    headerName: "LOT 번호",
    editable: false,
    hide: route.query.mode !== "modify",
    flex: 2,
  },
  { field: "plan_no", headerName: "생산계획번호", flex: 2 },
  { field: "item_name", headerName: "품목명", flex: 2, editable: true },
  { field: "plans_vol", headerName: "생산계획량", flex: 1 },
  { field: "iord_no", headerName: "지시수량", editable: true, flex: 1 },
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

// 등록 및 수정 로직
async function registerInst() {
  if (!gridApi.value) {
    console.error("gridRef is not ready");
    Swal.fire({
      icon: "question",
      title: "그리드가 아직 초기화되지 않았습니다.",
    });
    return;
  }
  const rowData = [];
  const rowCount = gridApi.value.getDisplayedRowCount();
  const processCodeMap = {
    반공정: "X01",
    완공정: "Z01",
  };

  for (let i = 0; i < rowCount; i++) {
    const rowNode = gridApi.value.getDisplayedRowAtIndex(i);
    if (rowNode && rowNode.data) {
      //rowNode = ag-Grid 행의 실제 데이터를 스프레드 연산자로 새로운 객체(row)를 만듬.
      const row = { ...rowNode.data };
      // 공정코드 변환
      if (row.process_header in processCodeMap) {
        row.process_header = processCodeMap[row.process_header];
      }
      // 날짜 처리 보정 (T 제거)
      row.plan_start =
        typeof row.plan_start === "string"
          ? row.plan_start.split("T")[0]
          : row.plan_start;

      row.plan_end =
        typeof row.plan_end === "string"
          ? row.plan_end.split("T")[0]
          : row.plan_end;
        row.item_code = row.item_code || '';
        row.item_name = row.item_name || '';

      rowData.push(row);
    }
  }
  if (rowData.length === 0) {
    Swal.fire({
      icon: "warning",
      title: "등록할 항목이 없습니다.",
    });
    return;
  }

  const mode = route.query.mode;
  const first = rowData[0];

  if (mode === "modify") {
    // 수정일 경우 inst_no 없을 시, 경고표시
    if (mode !== "modify" && first.inst_no) {
      Swal.fire({
        icon: "error",
        title: "inst_no 누락",
      });
      return;
    }

    try {
      const result = await axios.put(`/api/inst/${first.inst_no}`, first);
      if (result.data?.isUpdated) {
        Swal.fire({
          icon: "success",
          title: "수정 성공",
        }).then(() => {
          router.push("/insts");
        });
      } else {
        Swal.fire({
          icon: "warning",
          title: "수정 실패",
          text: "DB 반영 없음",
        });
      }
    } catch (err) {
      console.error(err);
      Swal.fire({
        icon: "error",
        title: "수정 중 오류 발생",
      });
    }
  } else {
    //일반적인 등록의 경우.
    const isPlanBased = !!first.plans_head;

    if (isPlanBased) {
    instHeader.value.plans_head = first.plans_head;
    instHeader.value.plan_start = first.plan_start;
    instHeader.value.plan_end = first.plan_end;
  } else {
    instHeader.value.plans_head = null;
    instHeader.value.plan_start = first.plan_start || dayjs().format("YYYY-MM-DD");
    instHeader.value.plan_end = first.plan_end || dayjs().add(1, "day").format("YYYY-MM-DD");
  }

  instHeader.value.inster = userStore.user.id || "관리자";

  try {
    await productionInstStore.registerInstData({
      header: instHeader.value,
      details: rowData,
    });

    Swal.fire({
      icon: "success",
      title: "등록 성공",
    });
  } catch (err) {
    console.error(err);
    Swal.fire({
      icon: "error",
      title: "등록 실패",
    });
   }
  }
}
</script>

<style scoped>
.inst-wrapper {
  margin-top: 60px;
  width: 95%;
  max-width: 1400px;
  margin-left: auto;
  margin-right: auto;
}

.inst-header {
  display: flex;
  justify-content: flex-end;
  margin-bottom: 16px;
}
.grid-wrapper {
  max-width: 1400px;
  margin: 0 auto;
}
.button-group {
  display: flex;
  gap: 8px;
}
</style>
