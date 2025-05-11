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
        <div class="card">
          <div class="card-header"><span>공정시작</span></div>
          <div class="card-body">
            상단 오른쪽 카드 내용
          </div>
        </div>
      </div>
    </div>
    <div class="row">
      <div class="col-12">
        <div class="card">
          <div class="card-header">
            <div class="row">
            <span class="col-10">{{ instData.item_name }} 공정</span>
            <button class="col-1 btn btn-danger">초기화</button>
          </div>
          </div>
          <div class="card-body">
            <!-- 공정흐름도의 각 공정 진행 정보-->
            <Grid :rowData="flowData" :columnDefs="flowCol" />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import Grid from '@/components/Grid.vue';
import axios from 'axios';
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
        { field : 'lot_cnt', headerName : 'LOT번호' , flex : 1},
        { field : 'item_code', headerName : '제품번호', flex : 1 },
        { field : 'iord_no', headerName : '지시량', flex : 1 },
        { field : 'state', headerName : '진행상태', flex : 1},
        { field : 'cur_cnt', headerName : '현생산량', flex : 1},
      ],
      // 생산지시 헤더 번호
      instHead : '',
      flowData : [],
      flowCol : [
         { field : 'sequence_order', headerName : '순서' , flex : 1},
         { field : 'process_name', headerName : '공정명' , flex : 1},
         { field : 'process_code', headerName : '공정코드' , flex : 1},
         { field : 'sta_time', headerName : '시작시간' , flex : 1},
         { field : 'end_time', headerName : '종료시간' , flex : 1},
         { field : 'ac_cnt', headerName : '실생산량' , flex : 1},
         { field : 'fault_cnt', headerName : '불량량' , flex : 1},
         { field : 'pr_status', headerName : '상태' , flex : 1},

      ],
    };
  },
  components : {
    Grid
  },
  created() {
    // console.log('created');
    //생산지시 정보 화면 출력
    this.getInst()
  },
  methods : {
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
    // 선택한 생산지시의 품목정보 업뎃
    async getInstData(data){
      this.instData = data
      let procFlow = this.instData.item_code
      let res = await axios.get(`api/getFlow/${procFlow}`)
      this.instData.item_name = res.data[0].item_name
      this.flowData = res.data
    }
  },
  watch :{
    // 품목정보에 대응하는 공정흐름도 호출
    // async instData(){
      
    // },
  }
};
</script>