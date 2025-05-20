<template>
  <div class="container-fluid py-3 vh-100 d-flex flex-column">
    <!-- 1) 상단 필터바 -->
    <div class="row mb-3">
      <div class="col-12">
        <div class="card">
          <div class="card-body">
            <QcFilter
              v-model:searchType="searchType"
              v-model:searchValue="searchValue"
              @search="loadDefects"
              @reset="resetFilter"
            />
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
            <QcList
              :list="defectList"
              :selectedCode="selected.defect_code"
              @select="selectDefect"
            />
          </div>
        </div>
      </div>

      <!-- 상세 -->
      <div class="col-md-4 h-100 d-flex flex-column">
        <div class="card flex-fill d-flex flex-column">
          <div class="card-header py-2"><strong>품질검사 상세</strong></div>
          <div class="card-body overflow-auto">
            <QcDetail
              :defect="selected"
              @create="onCreate"
              @delete="onDelete"
              @clear="clearDetail"
            />
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

export default {
  name: 'Defect',
  components: { QcDetail, QcFilter, QcList },
  data() {
    return {
      searchType: '',
      searchValue: '',
      defectList: [],
      selected: {
        test_no: '',
        test_feild: '',
        test_stand: '',
        test_target: ''
      }
    };
  },
  created() {
    this.loadDefects();
  },
  computed: {
    hasSelection() {
      return !!this.selected.defect_code;
    }
  },
  methods: {
    async loadDefects() {
      let params = {}
      if(this.searchType != '' && this.searchValue !=''){
         params = {
         [this.searchType] : this.searchValue        
      }
      }
      try {
        console.log(params);
        const res = await axios.get(`/api/getQcMgr/`, {params:params}  );
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
    selectDefect(defect) {
      this.selected = { ...defect };
    },
    clearDetail() {
      this.selected = {
        defect_code: '',
        defect_type: '',
        is_used: 'Y',
        created_date: ''
      };
    },
    async onCreate() {
      const { defect_type, is_used, created_date } = this.selected;

      if (!defect_type) return alert('불량 유형을 입력하세요.');
      if (!['Y', 'N'].includes(is_used)) return alert('사용여부는 Y 또는 N');
      if (!created_date) return alert('생성일자를 선택하세요.');

      try {
        await axios.post('/api/defect_codes', this.selected);
        await this.loadDefects();
      } catch (err) {
        console.error('onCreate error', err);
      }
    },
    async onDelete() {
      if (!this.hasSelection) return;
      if (!confirm('정말 삭제하시겠습니까?')) return;

      try {
        await axios.delete(`/api/defect_codes/${this.selected.defect_code}`);
        await this.loadDefects();
      } catch (err) {
        console.error('onDelete error', err);
      }
    }
  }
};
</script>

<style scoped>
/* 리스트 카드 스크롤 구조 */
.list-card   { display: flex; flex-direction: column; height: 100%; }
.list-scroll { overflow: auto; }

/* 테이블 헤더 고정 */
table thead th {
  position: sticky;
  top: 0;
  background: white;
  z-index: 1;
}

/* 행 스타일 */
.table-hover tbody tr:hover { background-color: #f8f9fa; }
.table-active { background-color: #d0ebff; }
</style>
