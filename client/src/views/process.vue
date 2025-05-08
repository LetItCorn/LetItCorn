<template>
  <div class="container py-4">
    <div class="row mb-3">
      <div class="col-md-6">
        <div class="card">
          <div class="card-header">생산지시</div>
          <div class="card-body">
              <Grid :rowData="rowData" :columnDefs="columnDefs" @passInst="getInstData" />
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
import Grid from '@/components/Grid.vue';
import axios from 'axios';
import { watch } from 'vue';
export default {
  data() {
    return {
      // 생산지시 data grid
      // 그리드에 들어갈 정보의 배열
      rowData: [],
      // 그리드의 컬럼 정보 field는 rowData의 key값과 일치하게, headerName은 화면에 보여지는 그리드의 컬럼명을 표시한다.
      columnDefs: [
        { field: 'inst_head', headerName: '지시번호' , flex: 1},
        { field: 'lot_cnt', headerName: 'LOT번호' , flex: 1},
        { field: 'item_code', headerName: '제품번호', flex: 1 },
        { field: 'iord_no', headerName: '지시량', flex: 1 },
        { field: 'cur_cnt', headerName: '현생산량', flex: 1},
        { field: 'state', headerName: '진행상태', flex: 1},
      ],
      instData : {},
    };
  },
  components: {
    Grid
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
    getInstData(data){
      this.instData = data
    }
  },
  watch:{
    instData(){
      console.log(this.instData);
    }
  }
};
</script>