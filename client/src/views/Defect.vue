<!-- src/views/Defect.vue -->
<template>
  <div class="container-fluid py-3 d-flex flex-column vh-100">
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

    <!-- 2) 리스트 + 상세 -->
    <div class="row flex-grow-1 gx-3">
      <!-- 리스트 -->
      <div class="col-md-8 h-100">
        <div class="card h-100">
          <div class="card-header">결함코드 목록</div>
          <div class="card-body p-0 overflow-auto">
            <DefectList
              :list="defectList"
              :selectedCode="selected.defect_code"
              @select="selectDefect"
            />
          </div>
        </div>
      </div>

      <!-- 상세 -->
      <div class="col-md-4 h-100">
        <div class="card h-100">
          <div class="card-header">결함코드 상세</div>
          <div class="card-body overflow-auto d-flex flex-column">
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
.sticky-top th { position: sticky; top: 0; background: white; }
.table-hover tbody tr:hover { background-color: #f8f9fa; }
.table-active { background-color: #d0ebff; }
</style>
