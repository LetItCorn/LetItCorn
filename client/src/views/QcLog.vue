<template>
  <div class="d-flex justify-content-center align-items-center bg-light">
    <div class="card shadow-lg" >
      <div class="card-header text-start ext-white">
        <h5 class="mb-0">품질검사 기록</h5>
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
import { AgGridVue } from 'ag-grid-vue3';
import 'ag-grid-community'
import 'ag-grid-community/styles/ag-theme-alpine.css'
import axios from 'axios';
import useDate from '@/utils/useDates';
export default {

  components: {},
  data() {
    return {
      sampleData: ''
    };
  },
  created() {},
  methods: {}
}
</script>