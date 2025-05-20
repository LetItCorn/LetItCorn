<template>
  <div class="container-fluid py-3">
    <!-- 1) 상단 필터 -->
    <div class="row mb-3">
      <div class="col-12">
        <div class="card">
          <div class="card-body">
            <ProcessFilter
              v-model:searchType="searchType"
              v-model:searchValue="searchValue"
              @search="loadProcesses"
              @reset="resetFilter"
            />
          </div>
        </div>
      </div>
    </div>

    <!-- 2) 리스트 + 상세 영역 (높이 고정) -->
    <div class="row gx-3" style="height: 70vh;">
      <!-- 리스트 -->
      <div class="col-md-7 h-100 d-flex flex-column">
        <div class="card list-card flex-fill">
          <div class="card-header py-2 fs-4"><strong>공정 리스트</strong></div>
          <div class="card-body p-0 list-scroll flex-grow-1">
            <ProcessList
              :processList="processList"
              :selectedCode="selected.process_code"
              @select="selectProcess"
            />
          </div>
        </div>
      </div>

      <!-- 상세 -->
      <div class="col-md-5 h-100 d-flex flex-column">
        <div class="card flex-fill d-flex flex-column">
          <div class="card-header py-2 fs-4"><strong>공정 상세 정보</strong></div>
          <div class="card-body overflow-auto">
            <ProcessDetail
              :process="selected"
              :unitList="unitList"
              @save="onSave"
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
import ProcessFilter from './components/ProcessFilter.vue';
import ProcessList from './components/ProcessList.vue';
import ProcessDetail from './components/ProcessDetail.vue';

export default {
  name: 'Process',
  components: { ProcessFilter, ProcessList, ProcessDetail },
  data() {
    return {
      searchType: '',
      searchValue: '',
      processList: [],
      unitList: [],
      selected: {
        process_code: '',
        process_name: '',
        duration_min: 0,
        unit_code: '',
        spec: ''
      }
    };
  },
  created() {
    this.loadProcesses();
    this.loadUnitCodes();
  },
  methods: {
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
        const { data } = await axios.get('/api/unitCode');
        this.unitList = data;
      } catch (err) {
        console.error('loadUnitCodes error', err);
        this.unitList = [];
      }
    },
    resetFilter() {
      this.searchType = '';
      this.searchValue = '';
      this.loadProcesses();
    },
    selectProcess(p) {
      this.selected = { ...p };
    },
    clearDetail() {
      this.selected = {
        process_code: '',
        process_name: '',
        duration_min: 0,
        unit_code: '',
        spec: ''
      };
    },
    async onSave() {
  const process = this.selected;

  if (!process.process_name) {
    return Swal.fire('입력 오류', '공정명을 입력하세요.', 'warning');
  }
  if (process.duration_min === '' || process.duration_min === null || process.duration_min === undefined) {
    return Swal.fire('입력 오류', '소요시간을 입력하세요.', 'warning');
  }
  if (!process.unit_code) {
    return Swal.fire('입력 오류', '단위코드를 선택하세요.', 'warning');
  }

  try {
    await axios.post('/api/processes', process);
    await this.loadProcesses();
    Swal.fire('성공', '공정이 저장되었습니다.', 'success');
  } catch (err) {
    console.error('onSave error', err);
    Swal.fire('오류', '저장 중 오류가 발생했습니다.', 'error');
  }
},
    async onDelete() {
      if (!this.selected.process_code) {
        return Swal.fire('삭제 불가', '삭제할 공정을 선택하세요!', 'warning');
      }

      const result = await Swal.fire({
        title: '정말 삭제하시겠습니까?',
        text: '해당 공정을 삭제합니다.',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: '삭제',
        cancelButtonText: '취소'
      });

      if (!result.isConfirmed) return;

      try {
        await axios.delete(`/api/processes/${this.selected.process_code}`);
        await this.loadProcesses();
        Swal.fire('삭제 완료', '공정이 삭제되었습니다.', 'success');
      } catch (err) {
        console.error('onDelete error', err);
        Swal.fire('오류', '삭제 중 오류가 발생했습니다.', 'error');
      }
    }
  }
};
</script>

<style scoped>
/* 리스트 카드 구조 */
.list-card   { display: flex; flex-direction: column; height: 100%; }
.list-scroll { overflow: auto; }

/* 테이블 헤더 고정 */
table thead th {
  position: sticky;
  top: 0;
  background: #f8f9fa;
  z-index: 1;
}

/* 선택/호버 스타일 */
.table-active { background-color: #d0ebff; }
.table-hover tbody tr:hover { background-color: #f8f9fa; }
</style>
