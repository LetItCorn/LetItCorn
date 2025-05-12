<template>
  <!--생산 지시 조회-->
  <div class="date-wrapper">
  <div class="date-range">
  <label>일자</label>
  <Datepicker v-model="startDate" :format="'yy-MM-dd'" /> 
  <span>~</span> 
  <Datepicker v-model="endDate" :format="'yy-MM-dd'" />
  </div>
  <div class="button-group">
  <button @click="fetchPlanInst">조회</button>
  <button @click="modifyPlan">수정</button>
  <button @click="deletePlan">삭제</button>
  </div>
</div>
<!--생산지시정보-->
  <ag-grid-vue
  class="ag-theme-alpine"
  :columnDefs="instColumnDefs"
  :rowData="List"
  rowSelection="multiple"
  @rowSelectionChanged="handleRowSelection"
  @rowClicked="handleRowClick"/>
  <!--상세정보-->
  <ag-grid-vue
  class="ag-theme-alpine"
  ref="gridRef"
  :columnDefs="detailColumnDefs"
  :rowData="rowData"
  rowSelection="single" />
</template>
<script setup>
//composition api 해보겠습니다이
import { ref } from 'vue'
import axios from 'axios'
import Datepicker from "@vuepic/vue-datepicker"
import { AgGridVue } from 'ag-grid-vue3'
import "ag-grid-community/styles/ag-theme-alpine.css"
import { useInstStore } from "@/store/inst";
import { useRouter } from "vue-router"


const router = useRouter();
const gridRef = ref(null);
const productionInstStore = useInstStore();
const instColumnDefs = [
  {field: "select",
    checkboxSelection: true,
    headerCheckboxSelection: true,
    pinned: "left",
    width: 50,},
  { field: "inst_no", headerName: "생산지시번호", flex: 2 },
  { field: "plan_no", headerName: "생산계획번호", flex: 2 },
  { field: "item_name", headerName: "품목명", flex: 2 },
  { field: "plan_end", headerName: "생산종료일", flex: 2},
  { field: "inster", headerName: "담당자", flex: 1},
  {field: "ins_stat", headername: "지시상태", flex: 1}
  ];
const detailColumnDefs = [
{ field: "inst_no", headerName: "생산지시번호", flex: 2 },
{ field: "plan_no", headerName: "생산계획번호", flex: 2 },
{ field: "item_name", headerName: "품목명", flex: 2 },
{ field: "plans_vol", headerName: "생산계획량", flex: 1 },
{ field: "iord_no", headerName: "지시수량", flex:1 },
{ field: "plan_start", headerName: "생산시작일", flex:2 },
{ field: "plan_end", headerName: "생산종료일", flex: 2},
{ field: "process_header", headerName: "공정", flex: 1}
]; 
//수정
const modifyPlan = () => {
  if(selectedPlan.value.length === null) {}
  if(selectedPlan.value.length > 1){}

  const plan = selectedPlan.value[0];
  if (plan.plan_Stat !== "J01") {
    return alert(
      `'${plan.inst_head}'은(는) 대기 상태가 아니므로 수정할 수 없습니다.`
    );
  }

  router.push({ name: "ProductionInst", query: { mode: "modify" } });
};
//삭제
const deletePlan = async()=>{
  if (selectedPlan.value.length === 0)
  return alert("삭제할 계획을 선택해주세요");
const invalid = selectedPlan.value.find((plan)=> instHead.inst_stat !== "J01");
if (invalid){
  console.log("삭제 대기상태: ", selectedPlan.value.map((p) => i.inst_stat));
  return alert(`'${invalid.inst_head}'은(는) 대기 상태가 아니므로 삭제할 수 없습니다.`);
}
for (const plan of selectedPlan.value) {
  await axios.delete(`/api/insts/${plan.inst_stat}`)
}
}
</script>