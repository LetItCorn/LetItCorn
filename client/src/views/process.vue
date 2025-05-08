<template>
  <div class="container py-4">
    <div class="row mb-3">
      <div class="col-md-6">
        <div class="card">
          <div class="card-header">생산지시</div>
          <div class="card-body">
            <AgGridVue 
            class="ag-theme-alpine" 
            style="width: 100%; height: 60vh;"
            :rowData="rowData"
            :columnDefs="columnDefs"
            :defaultColDef ="defaultColDef" 
            @cell-clicked="onCellClicked" />
          </div>
        </div>
      </div>
      <div class="col-md-6">
        <div class="card">
          <div class="card-header">공정시작</div>
          <div class="card-body">
            상단 오른쪽 카드 내용
          </div>
        </div>
      </div>
    </div>

    <div class="row">
      <div class="col-12">
        <div class="card">
          <div class="card-header">공정결과</div>
          <div class="card-body">
            하단 전체 카드 내용
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
  import {
    AgGridVue
  } from 'ag-grid-vue3'; 
  import axios from 'axios';
  export default {
    data() {
      return {
        // 생산지시 data grid
        // 그리드에 들어갈 정보의 배열
        rowData: [],
        // 그리드의 컬럼 정보 field는 rowData의 key값과 일치하게, headerName은 화면에 보여지는 그리드의 컬럼명을 표시한다.
        columnDefs: [
          {field:'inst_head',headerName:'지시번호'},
          {field:'lot_cnt',headerName:'LOT번호'},
          {field:'item_code',headerName:'제품번호'},
          {field:'iord_no',headerName:'지시량'},
        ],
        // col에 적용할 기본 속성
        defaultColDef : {
        sortable: true,    // 정렬 가능
        filter: true,      // 필터링 가능
        resizable: true    // 열 크기 조절 가능
        }
      };
    },
    components: {
      AgGridVue
    },
    created() {
      console.log('created');
      this.getInst()
      
    },
    methods: {
      async getInst() {
        let res = await axios.get(`api/proce`)
          .catch(err => {
            console.log(err);
          })
          console.log(res.data);
        
       
        this.rowData = res.data
      },
      onCellClicked (e){
        console.log(e.data);
      }
    }
  };
</script>