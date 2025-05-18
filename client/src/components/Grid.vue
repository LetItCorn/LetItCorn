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
  import { mapActions } from 'pinia';
  import { mapState } from 'pinia';
  import Swal from 'sweetalert2';
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
    computed : {
      ...mapState(useProcess,['inst','currentSeq','processes','statProcess','flowLength','statFlow'])
    },
    methods: {
      ...mapActions(useProcess,['setCurrnetSeq','setProCode','setCurrentSeq']),
      onCellClicked(e) {
        // console.log(e.data);
        // console.log(e.data.hasOwnProperty('lot_cnt'));
        // 생산지시 그리드일 경우
        if (e.data.hasOwnProperty('lot_cnt')) {
          if(this.statFlow == true){
            Swal.fire({
              icon: "error",
              title: "공정을 완료하세요!",
              text: `${this.inst.item_name}의 생산 공정을 완료하세요!`,
             });
          }else{
            this.$emit('passInst', e.data);
            this.setCurrnetSeq(1)
          }
        }
        // 공정 클릭일 경우
        else if (e.data.hasOwnProperty('process_code')) {
          // console.log(e.data);
        // 공정진행 순서 강제 pinia 에 seq정보 저장, 현재 메소드에서 검사,
        if(this.currentSeq > this.flowLength){
          Swal.fire({
            icon: "error",
            title: "전체공정이 완료되었습니다!",
            text: `${this.inst.item_name}의 전체공정이 완료되었습니다. `,
           });
           return;
          }else if(this.statProcess == true){ 
          Swal.fire({
              icon: "error",
              title: "품질검사 필요!",
              text: `${this.processes.process_name} 공정의 품질검사가 필요합니다. `,
             });
        }else if (this.currentSeq != e.data.sequence_order){
            console.log(e.data.sequence_order);
            Swal.fire({
              icon: "error",
              title: "공정순서를 지켜주세요!",
              text: `${this.processes.process_name} 공정을 먼저 진행 해야합니다. `,
             });
            
          }else{
           console.log(e.data);
            this.$emit('setController',e.data)
          }
        }
      },
    },
  }
</script>