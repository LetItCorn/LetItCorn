<template>
  <!--생산 지시 조회-->
  <div class="inquiry-header">
    <div class="filter-row">
  <div class="date-range">
  <label>일자</label>
  <Datepicker v-model="startDate" :format="'yy-MM-dd'" /> 
  <span>~</span> 
  <Datepicker v-model="endDate" :format="'yy-MM-dd'" />
  </div>
  <div class="button-group-inline">
  <button class="bg-blue-500 px-3 py-1 rounded text-black" @click="fetchPlanInst">조회</button>
  <button class="bg-blue-500 px-3 py-1 rounded text-black" @click="modifyPlan">수정</button>
  <button class="bg-blue-500 px-3 py-1 rounded text-black" @click="deletePlan">삭제</button>
  </div>
</div>
<div class="grid-wrapper">
<!--생산지시정보-->
  <ag-grid-vue
  class="ag-theme-alpine"
  style="width: 100%; height: 400px"
  ref="mainGridRef"
  :columnDefs="instColumnDefs"
  :rowData="planInst"
  rowSelection="multiple"
  @rowSelectionChanged="handleRowSelection"
  @rowClicked="handleRowClick"
  :defaultColDef="defaultColDef"/>

  <!--상세정보-->
  <ag-grid-vue
  class="ag-theme-alpine"
  style="width: 100%; height: 300px"
  ref="detailGridRef"
  :columnDefs="detailColumnDefs"
  :rowData="detailList"
  rowSelection="single"/>
</div>
</div>
</template>

<script setup>
//composition api 해보겠습니다이
import { onMounted, ref } from 'vue'
import axios from 'axios'
import Datepicker from "@vuepic/vue-datepicker"
import { AgGridVue } from 'ag-grid-vue3'
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-alpine.css"
import { useInstStore } from "@/store/inst";
import { useRouter } from "vue-router"
import { useRoute } from "vue-router";
import { storeToRefs } from 'pinia'
import dayjs from 'dayjs'
import Swal from "sweetalert2";
import { ModuleRegistry, ClientSideRowModelModule } from 'ag-grid-community';

ModuleRegistry.registerModules([ClientSideRowModelModule]);
const router = useRouter();
const route = useRoute(); 
const productionInstStore = useInstStore();
const { selectedInst, selectedQueryPlans } = storeToRefs(productionInstStore);
// 날짜 검색 조건
const startDate = ref(dayjs().subtract(7, "day").toDate());
const endDate = ref(dayjs().toDate());
//row Data 저장
const detailList = ref([]);
const planInst = ref([]);
const mainGridRef = ref(null);
// 그리드 데이터와 컬럼 정의
const gridRef = ref(null);
const gridApi = ref(null);
const instColumnDefs = [
  {field: "select",
    checkboxSelection: true,
    headerCheckboxSelection: true,
    pinned: "left",
    width: 50,},
  { field: "inst_no", headerName: "생산지시번호", flex: 2 },
  { field: "plan_no", headerName: "생산계획번호", flex: 2 },
  { field: "item_name", headerName: "품목명", flex: 2 },
  { field: "plan_end", headerName: "생산종료일", flex: 2, valueFormatter: (params) => {
    return params.value ? dayjs(params.value).format("YYYY-MM-DD") : ""; }},
  { field: "inster", headerName: "담당자", flex: 1},
  {field: "ins_stat_label", headerName: "지시상태", flex: 1}
  ];
const detailColumnDefs = [
{ field: "inst_no", headerName: "생산지시번호", flex: 2 },
{ field: "plan_no", headerName: "생산계획번호", flex: 2 },
{ field: "item_name", headerName: "품목명", flex: 2 },
{ field: "plans_vol", headerName: "생산계획량", flex: 1 },
{ field: "iord_no", headerName: "지시수량", flex:1 },
{ field: "plan_start", headerName: "생산시작일", flex:1,valueFormatter: (params) => {
  return params.value ? dayjs(params.value).format("YYYY-MM-DD") : "";} },
{ field: "plan_end", headerName: "생산종료일", flex: 1, valueFormatter: (params) => {
  return params.value ? dayjs(params.value).format("YYYY-MM-DD") : "";} },
{ field: "process_header_label", headerName: "공정", flex: 1}
]; 

onMounted(async ()=> {
  if (route.query.refreshed === "1") {
    await fetchPlanInst();
    router.replace({ name: "ProductionInstInquiry" });
  }
})

const handleRowSelection = async() => {
  const selectedNodes = mainGridRef.value.api.getSelectedNodes();
  const selectedData = selectedNodes.map(node => node.data);
  console.log("선택된 항목:", selectedData);
  productionInstStore.setSelectedQueryPlans(selectedData);
   //체크된 row가 하나라면 상세정보 조회도 자동 수행
   if (selectedData.length === 1) {
    const instNo = selectedData[0].inst_no;
    productionInstStore.setSelectedInst(selectedData[0]);

    try {
      const res = await axios.get(`/api/instHead/${instNo}`);
      detailList.value = res.data;
    } catch (err) {
      console.error("상세 조회 실패:", err);
      detailList.value = [];
    }
  } else {
    //2개 이상 체크 시 상세는 비움
    detailList.value = [];
    productionInstStore.setSelectedInst(null);
  }
};
const handleRowClick = async (event)=>{  
  let instNo = event.data.inst_no;
  productionInstStore.setSelectedInst(event.data);
  productionInstStore.setSelectedQueryPlans([event.data]);
  try{
  let res = await axios.get(`/api/instHead/${instNo}`)
  console.log("디테일 응답:", res.data);
  detailList.value = res.data;
  }
  catch(err){ 
  console.log(err);
  }
}
const defaultColDef = {
  sortable: true,
};

//조회 
const fetchPlanInst = async () => {
  //백엔드에 날짜변환
  const formattedStart = startDate.value
    ? dayjs(startDate.value).format("YYYY-MM-DD")
    : null;
  const formattedEnd = endDate.value
    ? dayjs(endDate.value).format("YYYY-MM-DD")
    : null;

  if (!formattedStart || !formattedEnd) {
    Swal.fire({
      icon: "question",
      title:"조회 시작일과 종료일을 모두 선택해주세요.",
    });
    return;
  }
  try {
    const res = await axios.get("/api/instHead", {
      params: {
        startDate: formattedStart,
        endDate: formattedEnd,
      },
    });

    console.log("응답 타입 확인:", typeof res.data);
    console.log("응답이 배열인가?", Array.isArray(res.data));
    console.log("응답 내용:", res.data);

    if (!Array.isArray(res.data)) {
    console.error("SQL 오류 발생 또는 응답이 배열이 아님:", res.data);
    planInst.value = [];
    Swal.fire({
      icon: "error", 
      title:"조회 중 오류가 발생했습니다.",
    });
    return;
  }

    planInst.value = res.data;
    productionInstStore.setSelectedInst(null);
    detailList.value = [];
  } catch (err) {
    console.error("조회 오류:", err);
    planInst.value = [];
  }
}
//수정
const modifyPlan = () => {
  //다중선택방지
  const selected = selectedQueryPlans.value;
  if (selected.length > 1) {
    return Swal.fire({
      icon: "error", 
      title:"수정은 한 건만 선택 가능합니다.",
    });
  }
  //단일 선택 
  const inst = selectedInst.value;
  console.log("선택된 inst:", inst);
  if (!inst) return Swal.fire({
      icon: "question", 
      title:"수정할 생산지시를 선택해주세요.",
    });
  //지시상태 확인
  if (inst.ins_stat !== "J01") {
    return Swal.fire({
      icon: "warning", 
      title:`'${inst.inst_head}'은(는) 대기 상태가 아니므로 수정할 수 없습니다.`,
    });
  }

  router.push({ name: "ProductionInst", query: { mode: "modify", inst_no: selectedInst.value.inst_no, }, });
};
//삭제
const deletePlan = async()=>{  
  if (selectedQueryPlans.value.length === 0) {
  return Swal.fire({
      icon: "error", 
      title:"삭제할 계획을 선택해주세요.",
    });
}

const invalid = selectedQueryPlans.value.find((instHead)=> instHead.ins_stat !== "J01");
if (invalid){
  console.log("삭제 대기상태: ", selectedQueryPlans.value.map((p) => p.ins_stat));
  return Swal.fire({
      icon: "warning", 
      title:`'${invalid.inst_head}'은(는) 대기 상태가 아니므로 삭제할 수 없습니다.`,
    });
  }
for (const inst of selectedQueryPlans.value) {
    try {
      await axios.delete(`/api/instHead/${inst.inst_head}`);
    } catch (err) {
      console.error("삭제 실패:", err);
      return Swal.fire({ icon: "error", title: "삭제 중 오류 발생" });
    }
  }  
  Swal.fire({ icon: "success", title: "삭제가 완료되었습니다." });
  await fetchPlanInst(); // 목록 새로고침
  productionInstStore.setSelectedQueryPlans([]);
};
</script>

<style scoped>
.inquiry-header {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: 20px;
}
.filter-row {
  display: flex;
  align-items: center;
  justify-content: center;
  flex-wrap: wrap;
  gap: 12px;
  margin-bottom: 20px;
}


.button-group-inline {
  display: flex;
  gap: 8px;
}

.button-group-inline button {
  min-width: 60px;
  height: 36px;
  font-size: 0.9rem;
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

.grid-wrapper {
  width: 95%;
  max-width: 1400px;
}
</style>