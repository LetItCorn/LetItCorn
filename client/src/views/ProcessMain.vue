<!-- src/views/Process.vue -->
<template>
  <!-- 전체 컨테이너 ---------------------------------------------------------->
  <div class="container-fluid vh-100 py-3 d-flex flex-column">

    <!-- 1) 상단 : 검색/필터 바 --------------------------------------------->
    <div class="row mb-3">
      <div class="col-12">
        <div class="card">
          <div class="card-body d-flex align-items-center">
            <div class="ms-auto d-flex align-items-center">
              <!-- 필터 타입 선택 -->
              <select v-model="searchType"
                      class="form-select form-select-sm me-2" style="width:140px">
                <option value="">[선택 없음]</option>
                <option value="code">공정코드</option>
                <option value="name">공정명</option>
              </select>
              <!-- 검색어 -->
              <input v-model="searchValue" :placeholder="filterPlaceholder"
                     class="form-control form-control-sm me-2" style="width:200px">
              <!-- 버튼 -->
              <button class="btn btn-sm btn-primary me-2" style="width:80px"
                      @click="loadProcesses">조회</button>
              <button class="btn btn-sm btn-outline-secondary" style="width:80px"
                      @click="resetFilter">초기화</button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 2) 리스트 / 상세 ----------------------------------------------------->
    <div class="row flex-grow-1 gx-3">

      <!-- 2‑1) 공정 리스트 --------------------------------------------------->
      <div class="col-md-7 h-100">
        <div class="card h-100">
          <div class="card-header">공정 리스트</div>
          <div class="card-body p-0 overflow-auto">
            <table class="table table-hover table-sm mb-0">
              <thead class="thead-light sticky-top">
                <tr>
                  <th>공정코드</th><th>공정명</th><th>시간(분)</th><th>단위</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="p in processList" :key="p.process_code"
                    @click="selectProcess(p)"
                    :class="{ 'table-active': p.process_code === selected.process_code }"
                    style="cursor:pointer">
                  <td>{{ p.process_code }}</td>
                  <td>{{ p.process_name }}</td>
                  <td>{{ p.duration_min }}</td>
                  <td>{{ p.spec }}</td>
                </tr>
                <tr v-if="processList.length === 0">
                  <td colspan="5" class="text-center py-4">데이터가 없습니다.</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <!-- 2‑2) 상세 입력 폼 --------------------------------------------------->
      <div class="col-md-5 h-100">
        <div class="card h-100">
          <div class="card-header">공정 상세 정보</div>
          <div class="card-body overflow-auto">
            <form @submit.prevent class="d-flex flex-column gap-3">
              <!-- 공정코드 -->
              <div>
                <label class="form-label">공정코드</label>
                <input v-model="selected.process_code" class="form-control form-control-sm"
                       readonly>
              </div>
              <!-- 공정명 -->
              <div>
                <label class="form-label">공정명</label>
                <input v-model="selected.process_name" class="form-control form-control-sm">
              </div>
              <!-- 소요시간 -->
              <div>
                <label class="form-label">소요시간(분)</label>
                <input v-model.number="selected.duration_min" type="number" min="0"
                       class="form-control form-control-sm">
              </div>
              <!-- 단위코드 선택 -->
              <div>
                <label class="form-label">단위</label>
                <select v-model="selected.unit_code" class="form-select form-select-sm">
                  <option value="">선택</option>
                  <option v-for="unit in unitList" :key="unit.code_values" :value="unit.code_values">
                    {{ unit.code_name }}
                  </option>
                </select>
              </div>

              <!-- 액션 버튼 -->
              <div class="mt-auto d-flex gap-2">
                <button type="button" class="btn btn-outline-secondary flex-grow-1"
                        @click="clearDetail">초기화</button>
                <button type="button" class="btn btn-success flex-grow-1"
                        @click="onSave">등록</button>
                <button type="button" class="btn btn-danger flex-grow-1"
                        :disabled="!selected.process_code"
                        @click="onDelete">삭제</button>
              </div>
            </form>
          </div>
        </div>
      </div>

    </div> <!-- /row -->
  </div>
</template>

<script>
import axios from 'axios';

export default {
  name: 'Process',
  data() {
    return {
      /* ----- 검색 상태 ---------------------------------------------------- */
      searchType: '', searchValue: '',
      /* ----- 데이터 ------------------------------------------------------- */
      processList: [],        // 공정 목록
      unitList: [],           // UU 공통코드
      selected: {             // 선택/편집 중인 공정
        process_code: '',
        process_name: '',
        duration_min: null,
        unit_code: '',
        spec: ''
      }
    };
  },
  computed: {
    filterPlaceholder() {
      return this.searchType === 'code' ? '공정코드'
           : this.searchType === 'name' ? '공정명' : '';
    }
  },
  created() {
    this.loadProcesses();
    this.loadUnitCodes();
  },
  // watch: {
  //   /* 단위코드가 변경되면 spec(단위 “이름”) 자동 반영 --------------------- */
  //   'selected.unit_code'(val) {
  //     const unit = this.unitList.find(u => u.code_values === val);
  //     this.selected.spec = unit ? unit.code_name : '';
  //   }
  // },
  methods: {
    /* ============================== 조회 ============================== */
    async loadProcesses() {
      const params = {};
      if (this.searchType === 'code') params.code = this.searchValue;
      if (this.searchType === 'name') params.name = this.searchValue;

      try {
        const { data } = await axios.get('/api/processes', { params });
        this.processList = data;
        this.clearDetail();
      } catch (err) {
        console.error('loadProcesses error', err);
        this.processList = [];
      }
    },
    async loadUnitCodes() {
      try {
        const { data } = await axios.get('/api/processes/unitCode'); // UU 공통코드 재사용
        this.unitList = data;
      } catch (err) {
        console.error('loadUnitCodes error', err);
        this.unitList = [];
      }
    },

    /* ============================== 유틸 ============================== */
    resetFilter() { this.searchType = ''; this.searchValue = ''; this.loadProcesses(); },
    selectProcess(p) { this.selected = { ...p }; },
    clearDetail() {
      this.selected = {
        process_code: '', process_name: '', duration_min: 0, unit_code: '', spec: ''
      };
    },
        async unitCode() {
      try {
        const res = await axios.get('/api/processes/unitCode');
        this.unitList = res.data;
      } catch (err) {
        console.error('unitCode error', err);
        this.unitList = [];
      }
    },

    /* ============================== CRUD ============================== */
    async onSave() {
      if (!this.selected.process_name) {
        alert('공정명을 입력하세요.'); return;
      }
      try {
        await axios.post('/api/processes', this.selected);
        await this.loadProcesses();
      } catch (err) {
        console.error('onSave error', err);
        alert('저장 중 오류가 발생했습니다.');
      }
    },
    async onDelete() {
      if (!this.selected.process_code) {
        alert('삭제할 공정을 먼저 선택하세요!'); return;
      }
      if (!confirm('정말 삭제하시겠습니까?')) return;

      try {
        await axios.delete(`/api/processes/${this.selected.process_code}`);
        await this.loadProcesses();
        this.clearDetail();
      } catch (err) {
        console.error('onDelete error', err);
        alert('삭제 중 오류가 발생했습니다.');
      }
    }
  }
};
</script>

<style scoped>
/* 테이블 헤더 고정 */
.sticky-top th{position:sticky;top:0;background:#fff;z-index:10;}
/* 선택 행 */
.table-active{background:#d0ebff;}
.table-hover tbody tr:hover{background:#f8f9fa;}
</style>
