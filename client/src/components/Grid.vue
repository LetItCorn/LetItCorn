<template>
  <AgGridVue class="ag-theme-alpine" style="height: 35vh;" :rowData="rowData" :columnDefs="columnDefs"
    :defaultColDef="defaultColDef" @cell-clicked="onCellClicked" />
</template>
<script>
  import {
    AgGridVue
  } from 'ag-grid-vue3';
  import 'ag-grid-community'
  import 'ag-grid-community/styles/ag-theme-alpine.css'
  // processStat 안의 useProcess를 가져온다.
  import {
    useProcess
  } from '@/store/processStat';
  // pinia의 mapState 를 가져온다
  import {
    mapState
  } from 'pinia';
  import {
    mapActions
  } from 'pinia';
  export default {
    name: 'Grid',
    props: {
      // 생산지시 data grid
      // 그리드에 들어갈 정보의 배열
      rowData: Array,
      // 그리드의 컬럼 정보 field는 rowData의 key값과 일치하게, headerName은 화면에 보여지는 그리드의 컬럼명을 표시한다.
      columnDefs: Array
    },
    components: {
      AgGridVue
    },
    data() {
      return {
        // col에 적용할 기본 속성
        defaultColDef: {
          resizable: true // 열 크기 조절 가능
        },

      };
    },
    methods: {
      
      onCellClicked(e) {
        // console.log(e.data);
        console.log(e.data.hasOwnProperty('lot_cnt'));
        // 생산지시 그리드일 경우
        if (e.data.hasOwnProperty('lot_cnt')) {
          this.$emit('passInst', e.data);
        }
        // 공정 클릭일 경우
        else if (e.data.hasOwnProperty('process_code')) {
          console.log(e.data);
          // 공정진행 순서 강제 pinia 에 seq정보 저장, 현재 메소드에서 검사,
          this.$emit('setController',e.data)
        }
      },


    },
  }
</script>