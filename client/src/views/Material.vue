<template>
  <div class="container-fluid py-3">
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

    <!-- 2) 리스트 / 상세 영역 (높이 고정) -->
    <div class="row gx-3" style="height: 70vh;">
      <!-- 2-1) 자재 리스트 -->
      <div class="col-md-7 h-100 d-flex flex-column">
        <div class="card list-card flex-fill">
          <div class="card-header py-2 fs-4"><strong>자재 리스트</strong></div>
          <div class="card-body p-0 list-scroll flex-grow-1">
            <MaterialList
              :materialList="materialList"
              :selectedCode="selected.mater_code"
              @select="selectMaterial"
            />
          </div>
        </div>
      </div>

      <!-- 2-2) 자재 상세 -->
      <div class="col-md-5 h-100 d-flex flex-column">
        <div class="card flex-fill">
          <div class="card-header py-2 fs-4"><strong>자재 상세 정보</strong></div>
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
import Swal from 'sweetalert2';
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
  const mat = this.selected;

  if (!mat.mater_name) {
    return Swal.fire('입력 오류', '자재명을 입력하세요.', 'warning');
  }
  if (!mat.unit_code) {
    return Swal.fire('입력 오류', '단위를 선택하세요.', 'warning');
  }
    if (!mat.m_price || isNaN(mat.m_price) || mat.m_price < 0) {
    return Swal.fire('입력 오류', '단가를 올바르게 입력하세요.', 'warning');
  }
  if (!mat.safe_stock || isNaN(mat.safe_stock) || mat.safe_stock < 0) {
    return Swal.fire('입력 오류', '안전재고를 올바르게 입력하세요.', 'warning');
  }


  try {
    await axios.post('/api/materialmains', mat);
    await this.loadMaterials();
    Swal.fire('성공', '자재가 등록/수정되었습니다.', 'success');
  } catch (err) {
    console.error('onCreate error', err);
    Swal.fire('오류', '등록 중 오류가 발생했습니다.', 'error');
  }
},
 async onDelete() {
      if (!this.selected.mater_code) {
        return Swal.fire('삭제 불가', '먼저 삭제할 행을 선택하세요!', 'warning');
      }

      const result = await Swal.fire({
        title: '정말 삭제하시겠습니까?',
        text: '삭제된 자재는 복구할 수 없습니다.',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: '삭제',
        cancelButtonText: '취소'
      });

      if (!result.isConfirmed) return;

      try {
        await axios.delete(`/api/materialmains/${this.selected.mater_code}`);
        await this.loadMaterials();
        this.clearDetail();
        Swal.fire('삭제 완료', '자재가 삭제되었습니다.', 'success');
      } catch (err) {
        console.error('onDelete error', err);
        Swal.fire('오류', '삭제 중 오류가 발생했습니다.', 'error');
      }
    }
  }
};
</script>

<style scoped>
/* 리스트 카드 레이아웃 -------------------------- */
.list-card   { display: flex; flex-direction: column; height: 100%; }
.list-scroll { overflow: auto; }

/* 테이블 헤더 고정 ----------------------------- */
table thead th {
  position: sticky;
  top: 0;
  background: #f8f9fa;
  z-index: 1;
}

/* 행 강조 ------------------------------ */
.table-active { background-color: #d0ebff; }
.table-hover tbody tr:hover { background-color: #f8f9fa; }
</style>
