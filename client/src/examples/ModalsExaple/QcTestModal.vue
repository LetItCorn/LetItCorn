<template>
  <div v-if="visible" class="modal-backdrop bg-close"  @click.self="clickLayout" >
    <div class="modal-content">
      <div class="container row">
        <div class="col-11">
          <h5>{{ processes.process_name }} 품질 검사</h5>
        </div>
        <div class="col-1">
        </div>
      </div>
      <AgGridVue :rowData="rowData" :columnDefs="colDef" class="ag-theme-alpine" style="height: 50vh;" :singleClickEdit="true" @cell-value-changed="resQc" />
      <button class="btn btn-info" @click="confirmQc">결과 등록</button>
    </div>
  </div>
</template>
<script>
import {
  AgGridVue
} from 'ag-grid-vue3';
import 'ag-grid-community'
import 'ag-grid-community/styles/ag-theme-alpine.css'
import {
  useProcess
} from '@/store/processStat';
import {
  mapActions,
  mapState
} from 'pinia';
import axios from 'axios';
import { checkQc } from '@/utils/checkQc';
import { useUserStore } from '@/store/user';
export default {
  props: ['visible'],
  components: {
    AgGridVue,
  },
  data() {
    return {
      process_info: '',
      rowData: [],
      colDef: [{  field: 'test_no',  headerName: '검사번호',  flex: 1 },
      { field: 'test_feild', headerName: '검사항목', flex: 1 },
      { field: 'test_stand', headerName: '검사기준', flex: 1 },
      { field: 'pr_status', headerName: '측정값', flex: 1, editable: true,},
      { field: 'test_res',  headerName: '결과', flex: 1},
      { field: 'unit',  headerName: '단위', flex: 1},
      ]
    }
  },
  created() { },
  mounted() { },
  methods: {
    ...mapActions(useProcess,['turnStatProcess','setCurrentSeq','turnStatFlow']),
    async getQcTest() {
      // console.log(this.processes.process_code);
      let res = await axios.get(`api/getQcTest/${this.processes.process_code}`)
      this.rowData = res.data
    },
    // 모달 바깥 클릭시 모달창 종료 버튼
    clickLayout(){
      this.$emit('modalClose')
    },
    // 품질검사 결과 등록
    async confirmQc() {
      console.log(this.rowData);
      let qcData = this.rowData
      console.log(this.inst);
      for(let i = 0;i<qcData.length;i++){
        qcData[i].lot_cnt = this.inst.lot_cnt
        qcData[i].item_code = this.processes.item_code
        qcData[i].process_code = this.processes.process_code
        qcData[i].userId = this.userId
        qcData[i].ac_cnt = this.processes.ac_cnt
        qcData[i].sequence_order = this.processes.sequence_order
        qcData[i].flowLength = this.flowLength
        qcData[i].inst_no = this.inst.inst_no
      }
      console.log(qcData);
      let res = await axios.post(`api/regQcLog`,qcData)
                            .catch(err=>{
                              console.log(err);
                            })
      console.log(res);
      if(res.data > 0){
        this.setCurrentSeq(this.currentSeq + 1)
        if(this.processes.sequence_order == this.flowLength ){
              // 마지막 공정 실행시 흐름 종료 표기
              this.turnStatFlow()
             
            }
        this.$emit('modalClose')
      }else{
        console.log('품질검사 실패');
      }
    },
    resQc(event) {
      // console.log(event);
      let res = checkQc(event.data.pr_status,event.data.test_stand) 
      // console.log(res);
      // console.log(this.rowData[event.rowIndex]);
      let copyData = [...this.rowData]
      copyData[event.rowIndex].test_res = res
      this.rowData = copyData;
    }
  },
  computed: {
    ...mapState(useProcess, ['processes','flowLength','inst','currentSeq']),
    ...mapState(useUserStore,['userId']),
    // ...mapState(useProcess,['inst'])

  },
  watch: {
    visible(newval) {
      if (newval == true) {
        this.getQcTest()
      }
    }
  }
}
</script>
<style scoped>
.modal-backdrop {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: #fff;
  display: flex;
  justify-content: center;
  align-items: center;
}

.modal-content {
  background: white;
  padding: 1rem 2rem;
  border-radius: 10px;
  box-shadow: 0 0 10px black;
  margin-left: 266px;
  width: 70%;
  height: 60%;
}
</style>