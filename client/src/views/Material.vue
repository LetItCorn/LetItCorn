<template>
  <div class="container-fluid vh-100 py-3 d-flex flex-column">
    <!-- 1) 상단 필터 -->
    <div class="row mb-3">
      <div class="col-12">
        <div class="card">
          <div class="card-body">
            <MaterialFilter
              v-model:searchType="searchType"
              v-model:searchValue="searchValue"
              @search="loadMaterials"
              @reset="resetFilter"
            />
          </div>
        </div>
      </div>
    </div>

    <!-- 2) 리스트 / 상세 영역 -->
    <div class="row flex-grow-1 gx-3">
      <!-- 2-1) 자재 리스트 -->
      <div class="col-md-7 h-100">
        <div class="card h-100">
          <div class="card-header">자재 리스트</div>
          <div class="card-body p-0 overflow-auto">
            <MaterialList
              :materialList="materialList"
              :selectedCode="selected.mater_code"
              @select="selectMaterial"
            />
          </div>
        </div>
      </div>

      <!-- 2-2) 자재 상세 -->
      <div class="col-md-5 h-100">
        <div class="card h-100">
          <div class="card-header">자재 상세 정보</div>
          <div class="card-body overflow-auto">
            <MaterialDetail
              :mat="selected"
              :unitList="unitList"
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
import MaterialFilter from './components/MaterialFilter.vue';
import MaterialList from './components/MaterialList.vue';
import MaterialDetail from './components/MaterialDetail.vue';

export default {
  name: 'Material',
  components: {
    MaterialFilter,
    MaterialList,
    MaterialDetail
  },
  data() {
    return {
      searchType: '',
      searchValue: '',
      materialList: [],
      unitList: [],
      selected: {
        mater_code: '',
        mater_name: '',
        spec: '',
        unit_code: '',
        m_price: 0,
        safe_stock: 0,
        current_stock: 0
      }
    };
  },
  computed: {
    filterPlaceholder() {
      if (this.searchType === 'code') return '자재코드';
      if (this.searchType === 'name') return '자재명';
      return '';
    }
  },
  created() {
    this.loadMaterials();
    this.loadUnitCodes();
  },
  methods: {
    async loadMaterials() {
      const params = {};
      if (this.searchType === 'code') params.code = this.searchValue;
      if (this.searchType === 'name') params.name = this.searchValue;
      try {
        const res = await axios.get('/api/materialmains', { params });
        this.materialList = res.data;
        this.clearDetail();
      } catch (err) {
        console.error('loadMaterials error', err);
        this.materialList = [];
      }
    },
    async loadUnitCodes() {
      try {
        const res = await axios.get('/api/materialmains/unitCode');
        this.unitList = res.data;
      } catch (err) {
        console.error('loadUnitCodes error', err);
        this.unitList = [];
      }
    },
    resetFilter() {
      this.searchType = '';
      this.searchValue = '';
      this.loadMaterials();
    },
    selectMaterial(mat) {
      this.selected = { ...mat };
    },
    clearDetail() {
      this.selected = {
        mater_code: '',
        mater_name: '',
        spec: '',
        unit_code: '',
        m_price: 0,
        safe_stock: 0,
        current_stock: 0
      };
    },
    async onCreate() {
      if (!this.selected.mater_name) {
        alert('자재명을 입력하세요.');
        return;
      }
      try {
        await axios.post('/api/materialmains', this.selected);
        await this.loadMaterials();
      } catch (err) {
        console.error('onCreate error', err);
      }
    },
    async onDelete() {
      if (!this.selected.mater_code) {
        alert('먼저 삭제할 행을 선택하세요!');
        return;
      }
      if (!confirm('정말 삭제하시겠습니까?')) return;
      try {
        await axios.delete(`/api/materialmains/${this.selected.mater_code}`);
        await this.loadMaterials();
        this.clearDetail();
      } catch (err) {
        console.error('onDelete error', err);
        alert('삭제 중 오류가 발생했습니다');
      }
    }
  }
};
</script>

<style scoped>
.sticky-top th {
  position: sticky;
  top: 0;
  background: white;
  z-index: 10;
}
.table-active {
  background-color: #d0ebff;
}
.table-hover tbody tr:hover {
  background-color: #f8f9fa;
}
</style>
