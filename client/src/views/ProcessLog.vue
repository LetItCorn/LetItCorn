<template>
  <div class="d-flex justify-content-center align-items-center bg-light">
    <div class="card shadow-lg" >
      <div class="card-header text-start ext-white">
        <h5 class="mb-0">생산 기록</h5>
      </div>
      <div class="card-body p-2">
        <div class="ag-theme-alpine" >
        <ag-grid-vue
            style="height: 90vh; width: 70vw;"
            :columnDefs="columnDefs"
            :rowData="rowData"
            :pagination="true"
            :paginationPageSize="15"
            @rowClicked="onRowClicked"
           
          />
        </div>
      </div>
      
    </div>
    <PrlogModal
      :visible="showModal"
      @close="showModal = false"
      :clickedData="selectedLog"
    />
  </div>
</template>
<script>
  import {
    AgGridVue
  } from 'ag-grid-vue3';
  import 'ag-grid-community'
  import 'ag-grid-community/styles/ag-theme-alpine.css'
  import axios from 'axios';
  import PrlogModal from '@/examples/ModalsExaple/PrlogModal.vue';
  import useDate from '@/utils/useDates';
  export default {
    components: {
      AgGridVue,
      PrlogModal
    },
  
    data() {
      return {
        columnDefs: [
          { field: 'p_log_no', headerName: '공정이력번호', flex: 1 , sortable: true},
          { field: 'item_name', headerName: '제품명', flex: 1 , sortable: true},
          { field: 'item_code', headerName: '제품번호', flex: 1 , sortable: true},
          { field: 'iord_no', headerName: '생산량', flex: 1 },
          { field: 'log_dt', headerName: '기록일', flex: 1 , sortable: true},
          { field: 'emp_id', headerName: '담당자', flex: 1 , sortable: true},
        ],
        rowData: [],
        selectedLog: null,        // 선택된 행 정보
        showModal: false          // 모달 표시 여부
      };
    },
    created() {
     this.getPrLog();
    },
    methods: {
     async  getPrLog(){
      let res = await axios.get('/api/getPrlog')
                            .catch(err => {
                            console.log(err);
                          });
                          console.log(res);
      for (let i = 0; i < res.data.length; i++) {
        res.data[i].log_dt = useDate.dateFormat(res.data[i].log_dt,'yyyy-MM-dd');
      }
      this.rowData = res.data;
      },
      onRowClicked(event) { 
        this.showModal = true; // 모달 표시
        this.selectedLog = event.data; // 선택된 행 정보 저장
      },
    },
  }
</script>