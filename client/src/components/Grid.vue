<template>
  <AgGridVue class="ag-theme-alpine" style="height: 30vh;" :rowData="rowData" :columnDefs="columnDefs"
   :defaultColDef="defaultColDef"  @cell-clicked="onCellClicked"  />
</template>
<script>
import {
  AgGridVue
} from 'ag-grid-vue3';
import 'ag-grid-community'
import 'ag-grid-community/styles/ag-theme-alpine.css'
export default {
  name:'Grid',
  props : {
    // 생산지시 data grid
    // 그리드에 들어갈 정보의 배열
    rowData: Array,
    // 그리드의 컬럼 정보 field는 rowData의 key값과 일치하게, headerName은 화면에 보여지는 그리드의 컬럼명을 표시한다.
    columnDefs : Array
  },
  components: {
    AgGridVue
  },
  data() {
    return {
      // col에 적용할 기본 속성
      defaultColDef: {
        resizable: true    // 열 크기 조절 가능
      },     
      
    };
  },
  methods: {
    onCellClicked(e) {
      // console.log(e.data);
      this.$emit('passInst',e.data)
    },
    
  },
}
</script>
