<template>
  <div v-if="visible" class="modal-backdrop bg-close"  @click.self="confirmQc" >
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
  mapState
} from 'pinia';
import axios from 'axios';
import { checkQc } from '@/utils/checkQc';
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
      ]
    }
  },
  created() { },
  mounted() { },
  methods: {
    async getQcTest() {
      console.log(this.processes.process_code);
      let res = await axios.get(`api/getQcTest/${this.processes.process_code}`)
      this.rowData = res.data
    },
    confirmQc() {
      this.$emit('modalClose')
    },
    resQc(event) {
      console.log(event);
      let res = checkQc(event.data.pr_status,event.data.test_stand) 
      console.log(res);
      // console.log(this.rowData[event.rowIndex]);
      this.rowData[event.rowIndex].test_res = res
    }
  },
  computed: {
    ...mapState(useProcess, ['processes']),

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