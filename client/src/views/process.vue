<template>
  <div class="container py-4">
    <div class="row mb-3">
      <div class="col-md-6">
        <div class="card">
          <div class="card-header">
            <div class="row">
            <span class="col">생산지시</span>
            <div class="col">{{ instHead }}</div>
          </div>
          </div>
          <div class="card-body">
            <!-- 생산지시의 LOT 별 정보-->
              <Grid :rowData="rowData" :columnDefs="columnDefs" @passInst="getInstData" />
          </div>
        </div>  
      </div>
      <div class="col-md-6">
        <div class="card h-100">
          <proController  @setRow="updateRow"/>
        </div>
      </div>
    </div>
    <div class="row">
      <div class="col-12">
        <div class="card">
          <div class="card-header">
            <div class="row">
            <span class="col-10">{{ instData.item_name }} 공정</span>
            <button class="col-1 btn btn-danger" @click="initialFlowData">초기화</button>
          </div>
          </div>
          <div class="card-body">
            <!-- 공정흐름도의 각 공정 진행 정보-->
            <Grid :rowData="flowData" :columnDefs="flowCol" @setController="onFlowClicked" />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import Grid from '@/components/Grid.vue';
import axios from 'axios';
import proController from '@/components/proController.vue';
import { useProcess } from '@/store/processStat';
import { mapActions } from 'pinia';
export default {
  data() {
    return {
      // Lot, item_code, od_cnt, item_name
      instData : {},      
      // 생산지시 data grid
      // 그리드에 들어갈 정보의 배열
      rowData : [],
      // 그리드의 컬럼 정보 field는 rowData의 key값과 일치하게, headerName은 화면에 보여지는 그리드의 컬럼명을 표시한다.
      columnDefs : [
        { field : 'lot_cnt',    headerName : 'LOT번호' ,  flex : 1},
        { field : 'item_code',  headerName : '제품번호',  flex : 1 },
        { field : 'iord_no',    headerName : '지시량',    flex : 1 },
        { field : 'state',      headerName : '진행상태',  flex : 1},
        { field : 'cur_cnt',    headerName : '현생산량',  flex : 1},
      ],
      // 생산지시 헤더 번호
      instHead : '',
      flowData : [],
      flowCol : [
         { field : 'sequence_order',  headerName : '순서' ,     flex : 1},
         { field : 'process_name',    headerName : '공정명' ,   flex : 1},
         { field : 'process_code',    headerName : '공정코드' , flex : 1},
         { field : 'sta_time',        headerName : '시작시간' , flex : 1},
         { field : 'end_time',        headerName : '종료시간' , flex : 1},
         { field : 'ac_cnt',          headerName : '실생산량' , flex : 1},
         { field : 'fault_cnt',       headerName : '불량량' ,   flex : 1},
         { field : 'pr_status',       headerName : '상태' ,     flex : 1},
      ],
    };
  },
  components : {
    Grid,
    proController
  },
  created() {
    // console.log('created');
    //생산지시 정보 화면 출력
    this.getInst()
  },
  methods : {
    ...mapActions(useProcess, ['setProCode','setOrderQty','setInst','setFlowLength']),
    // 생산지시 조회 쿼리 실행 함수
    async getInst() {
      let res = await axios.get(`api/proce`)
        .catch(err => {
          console.log(err);
        })
      // console.log(res.data);
      this.rowData = res.data
      this.instHead = res.data[0]['inst_head']
    },
    // 선택한 생산지시의 품목에 일치하는 공정흐름 업뎃
    async getInstData(data){
      this.setOrderQty('')
      this.instData = data
      let procFlow = this.instData.item_code
      let res = await axios.get(`api/getFlow/${procFlow}`)
      // console.log(res.data[0]);
      this.instData.item_name = res.data[0].item_name
      this.setFlowLength(res.data.length)
      //pinia에 담기.
      this.setInst(this.instData)
      // console.log(res.data);
      this.flowData = res.data
    },
    // 라벨용 pinia
    onFlowClicked(e) {
    this.setProCode(e); // 공정 정보 저장
    this.setOrderQty(this.instData.iord_no); // 지시량 저장
  },
  // 생산량, 불량량 저장시 공정 진행의 값 변경
  updateRow(e){
     // this.flowData[e.sequence_order-1] = e
    const updated = [...this.flowData]; // 새 배열로 복사
    updated[e.sequence_order - 1] = e;
    this.flowData = updated; // 새로운 배열로 할당하여 반응성 보장

  },
  initialFlowData(){
    this.flowData = []
    this.setProCode({})
    this.setInst({})
    this.setOrderQty(0)
  }
  },
  watch :{
    
  }
};
</script>