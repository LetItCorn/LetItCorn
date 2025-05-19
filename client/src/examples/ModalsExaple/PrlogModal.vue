
  <template>
  <div v-if="visible" class="modal-backdrop bg-close"  @click.self="clickLayout" >
    <div class="modal-content">
      <div class="container row">
        <div class="col-11">
          <h5>{{ item_name }} 공정기록 상세</h5>
        </div>
        <div class="col-1 text-end">
  <button class="btn-close" @click="clickLayout">X</button>
</div>
        <div class="col-1">
        </div>
      </div>
      <AgGridVue :rowData="rowData" :columnDefs="colDef" class="ag-theme-alpine" style="height: 50vh;"   />
      <button class="btn btn-info" @click="saveXcel"></button>
    </div>
  </div>
</template>

<script>
import {
  AgGridVue
} from 'ag-grid-vue3';
import 'ag-grid-community'
import 'ag-grid-community/styles/ag-theme-alpine.css'
import * as XLSX from 'xlsx';
import axios from 'axios';
export default {
  components: {},
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    clickedData: {
      type: Object,
      default: null
    },
  },
data() {
    return {
      rowData : [],
      colDef : [
        { field: 'p_log_no', headerName: '공정이력번호', flex: 1 , sortable: true},
        { field: 'process_code', headerName: '공정번호', flex: 1 , sortable: true},
        { field: 'process_name', headerName: '공정명', flex: 1 , sortable: true},
        { field: 'lot_cnt', headerName: 'LOT번호', flex: 1 , sortable: true},
        { field: 'ac_cnt', headerName: '생산량', flex: 1 , sortable: true},
        { field: 'fault_cnt', headerName: '불량량', flex: 1 , sortable: true},
        { field: 'sta_time', headerName: '공정시작시간', flex: 1 , sortable: true},
        { field: 'end_time', headerName: '공정종료시간', flex: 1 , sortable: true},
        { field: 'processer', headerName: '담당자', flex: 1 , sortable: true},
      ],
      item_name: '',
    };
  },
  created() {},
  methods: {
    clickLayout() {
      this.$emit('close');
    },
    saveXcel() {
      const ws = XLSX.utils.json_to_sheet(this.rowData);
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
     XLSX.writeFile(wb, `검사기록_${this.clickedData.p_log_no}.xlsx`);
    },
  },
  watch: {
     clickedData: {
      immediate: true,
     async handler(newVal) {
        if (newVal) {
          let res = await axios.get(`/api/getPrlogDt/${newVal.p_log_no}` )
                               .catch(err => {

            console.log(err);
          });
          console.log(res.data);
          this.item_name = newVal.item_name;
          this.rowData = res.data;
        }
      }
    }
  },
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