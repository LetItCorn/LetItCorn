<template>
  <div class="container-fluid py-3 vh-100 d-flex flex-column">
    <!-- 1) 상단 필터바 -->
    <div class="row mb-3">
      <div class="col-12">
        <div class="card">
          <div class="card-body">
            <QcFilter v-model:searchType="searchType" v-model:searchValue="searchValue" @search="loadDefects"
              @reset="resetFilter" />
          </div>
        </div>
      </div>
    </div>

    <!-- 2) 리스트 + 상세 (고정 높이) -->
    <div class="row gx-3" style="height: 70vh;">
      <!-- 리스트 -->
      <div class="col-md-8 h-100 d-flex flex-column">
        <div class="card list-card flex-fill">
          <div class="card-header py-2"><strong>품질검사 목록</strong></div>
          <div class="card-body p-0 list-scroll flex-grow-1">
            <QcList :list="defectList" :selectedCode="selected.defect_code" @select="selectDefect" />
          </div>
        </div>
      </div>

      <!-- 상세 -->
      <div class="col-md-4 h-100 d-flex flex-column">
        <div class="card flex-fill d-flex flex-column">
          <div class="card-header py-2"><strong>품질검사 상세</strong></div>
          <div class="card-body overflow-auto">
            <QcDetail :defect="selected" @create="onCreate" @delete="onDelete" @clear="clearDetail" :prOptions="prOptions"/>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import QcDetail from '@/components/QcDetail.vue';
  import QcFilter from '@/components/QcFilter.vue';
  import QcList from '@/components/QcList.vue';
  import axios from 'axios';
import Swal from 'sweetalert2';

  export default {
    name: 'Defect',
    components: {
      QcDetail,
      QcFilter,
      QcList
    },
    data() {
      return {
        searchType: '',
        searchValue: '',
        defectList: [],
        selected: {
          test_no: '',
          test_feild: '',
          test_stand_min: '',
          test_stand_max: '',
          test_target: '',
          unit_name: ''
        },
        mkedSelected:{
          test_no: '',
          test_feild: '',
          test_stand: '',
          test_target: '',
          unit_name: ''
        },
        prOptions : [],
        syncSource: null,
        alertStat : false
      };
    },
    created() {
      this.loadDefects();
      this.getOptions()
    },
    computed: {
      hasSelection() {
        return !!this.selected.defect_code;
      },
    
    },
    methods: {
      async loadDefects() {
        let params = {}
        if (this.searchType != '' && this.searchValue != '') {
          params = {
            [this.searchType]: this.searchValue
          }
        }
        try {
          console.log(params);
          const res = await axios.get(`/api/getQcMgr/`, {
            params: params
          });
          console.log(res);
          this.defectList = res.data;
          this.clearDetail();
        } catch (err) {
          console.error('loadDefects error', err);
          this.defectList = [];
        }
      },
      resetFilter() {
        this.searchType = '';
        this.searchValue = '';
        this.loadDefects();
      },
      selectDefect(val) {
        const [min, max] = (val.test_stand || '').split('~');
      const { test_stand, ...rest } = val;

      // mkedSelected → selected 변환
      this.selected = {
        ...rest,
        test_stand_min: min?.trim() || '',
        test_stand_max: max?.trim() || ''
      };
        
      },
      clearDetail() {
        this.selected = {
           test_no: '',
          test_feild: '',
          test_stand_min: '',
          test_stand_max: '',
          test_target: '',
          unit_name: ''
        };
      },
      async onCreate() {
        const {
          
          test_feild,
          test_stand,
          test_target,
          unit_name
        } = this.mkedSelected;

       
        if (!test_feild) return this.alertStat = '검사이름'
        if (!test_stand) return this.alertStat = '기준값'
        if (!test_target) return this.alertStat = '검사대상'
        if (!unit_name) return this.alertStat = '단위'
        if(this.alertStat){
          Swal.fire({
              icon: "error",
              title: "값이 입력되지 않았습니다.",
              text: `${this.alertStat}가 입력되지 않았습니다.`,
             
            });
        }
        try {
          console.log(this.mkedSelected);
          let res = await axios.post('/api/mergeQcData', this.mkedSelected);
          console.log(res.data);
          await this.loadDefects();
        } catch (err) {
          console.error('onCreate error', err);
        }
      },
      async onDelete() {
        if (!this.hasSelection) return;
        //Swal
        if (!confirm('정말 삭제하시겠습니까?')) return;

        try {
          let res = await axios.delete(`/api/defect_codes/${this.selected.defect_code}`);
          if(res.data.affectedRows >0){
            Swal.fire({
                icon: "success",
                title: "삭제완료!",
                text: `삭제되었습니다!`,
               
              });
              await this.loadDefects();
          }
          
        } catch (err) {
          console.error('onDelete error', err);
        }
      },
     async getOptions(){
      const res = await axios.get('/api/getOptions')
                            .catch(err=>{
                              console.log(err);
                            }
                            )
      console.log(res.data);
      this.prOptions=res.data
     }
    },
    watch: {
  selected: {
    deep: true,
    handler(val) {
      if (this.syncSource === 'mked') return;
      this.syncSource = 'selected';

      // selected → mkedSelected 변환
      const { test_stand_min, test_stand_max, ...rest } = val;
      this.mkedSelected = {
        ...rest,
        test_stand: test_stand_min && test_stand_max
          ? `${test_stand_min}~${test_stand_max}`
          : ''
      };

      this.$nextTick(() => {
        this.syncSource = null;
      });
    }
  },

  mkedSelected: {
    deep: true,
    handler(val) {
    
      if (this.syncSource === 'selected') return;
      this.syncSource = 'mked';

      const [min, max] = (val.test_stand || '').split('~');
      const { test_stand, ...rest } = val;

      // mkedSelected → selected 변환
      this.selected = {
        ...rest,
        test_stand_min: min?.trim() || '',
        test_stand_max: max?.trim() || ''
      };

      this.$nextTick(() => {
        this.syncSource = null;
      });
    }
  }
}

  };
</script>

<style scoped>
  /* 리스트 카드 스크롤 구조 */
  .list-card {
    display: flex;
    flex-direction: column;
    height: 100%;
  }

  .list-scroll {
    overflow: auto;
  }

  /* 테이블 헤더 고정 */
  table thead th {
    position: sticky;
    top: 0;
    background: white;
    z-index: 1;
  }

  /* 행 스타일 */
  .table-hover tbody tr:hover {
    background-color: #f8f9fa;
  }

  .table-active {
    background-color: #d0ebff;
  }
</style>