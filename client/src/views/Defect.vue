<template>
  <div class="container-fluid py-3 vh-100 d-flex flex-column">
    <!-- 1) 상단 필터바 -->
    <div class="row mb-3">
      <div class="col-12">
        <div class="card">
          <div class="card-body">
            <DefectFilter
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
          <div class="card-header py-2 fs-4"><strong>결함코드 목록</strong></div>
          <div class="card-body p-0 list-scroll flex-grow-1">
            <DefectList
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
          <div class="card-header py-2 fs-4"><strong>결함코드 상세</strong></div>
          <div class="card-body overflow-auto">
            <DefectDetail
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
import axios from 'axios';
import Swal from 'sweetalert2';
import DefectFilter from './components/DefectFilter.vue';
import DefectList from './components/DefectList.vue';
import DefectDetail from './components/DefectDetail.vue';

export default {
  name: 'Defect',
  components: { DefectFilter, DefectList, DefectDetail },
  data() {
    return {
      searchType: '',
      searchValue: '',
      defectList: [],
      selected: {
        defect_code: '',
        defect_type: '',
        is_used: 'Y',
        created_date: ''
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
      const params = {
        code: this.searchType === 'code' ? this.searchValue : '',
        type: this.searchType === 'type' ? this.searchValue : '',
        used: this.searchType === 'used' ? this.searchValue : ''
      };
      try {
        const res = await axios.get('/api/defect_codes', { params });
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

      if (!defect_type) {
        return Swal.fire('입력 오류', '불량 유형을 입력하세요.', 'warning');
      }
      if (!['Y', 'N'].includes(is_used)) {
        return Swal.fire('입력 오류', '사용여부는 Y 또는 N으로 입력하세요.', 'warning');
      }
      if (!created_date) {
        return Swal.fire('입력 오류', '생성일자를 선택하세요.', 'warning');
      }

      try {
        await axios.post('/api/defect_codes', this.selected);
        await this.loadDefects();
        Swal.fire('성공', '결함코드가 저장되었습니다.', 'success');
      } catch (err) {
        console.error('onCreate error', err);
        Swal.fire('오류', '결함코드 저장 중 오류가 발생했습니다.', 'error');
      }
    },
     async onDelete() {
      if (!this.hasSelection) {
        return Swal.fire('삭제 오류', '삭제할 결함코드를 선택하세요.', 'warning');
      }

      const result = await Swal.fire({
        title: '삭제 확인',
        text: '정말 삭제하시겠습니까?',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: '삭제',
        cancelButtonText: '취소'
      });

      if (!result.isConfirmed) return;

      try {
        await axios.delete(`/api/defect_codes/${this.selected.defect_code}`);
        await this.loadDefects();
        Swal.fire('삭제 완료', '결함코드가 삭제되었습니다.', 'success');
      } catch (err) {
        console.error('onDelete error', err);
        Swal.fire('오류', '삭제 중 오류가 발생했습니다.', 'error');
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
