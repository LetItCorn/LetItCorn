<template>
  <div class="container py-4">
    <div class="row mb-3">
      <div class="col-md-6">
        <div class="card">
          <div class="card-header">생산지시</div>
          <div class="card-body">
            <!-- <AgGridVue class="ag-theme-alpine" style="width: 100%; height: 500px" :rowData="rowData"
              :columnDefs="columnDefs" :modules="[ClientSideRowModelModule]" rowModelType="clientSide" /> -->
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
  import {
    ClientSideRowModelModule
  } from 'ag-grid-community';
  import axios from 'axios';

  export default {
    data() {
      return {
        rowData: null,
        columnDefs: null
      };
    },
    components: {

    },
    created() {
      this.rowData = this.getInst();
      this.columnDefs = Object.keys(this.rowData)
    },
    methods: {
      async getInst() {
        let res = await axios.get(`api/proce`)
          .catch(err => {
            console.log(err);
          })
          console.log(res.data);
        return res.data
      }
    }
  };
</script>