<!-- src/views/Process.vue -->
<template>
  <div class="container-fluid vh-100 py-3 d-flex flex-column">

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

    <!-- 2) 리스트 + 상세 -->
    <div class="row flex-grow-1 gx-3">
      <!-- 리스트 -->
      <div class="col-md-7 h-100">
        <div class="card h-100">
          <div class="card-header">공정 리스트</div>
          <div class="card-body p-0 overflow-auto">
            <ProcessList
              :processList="processList"
              :selectedCode="selected.process_code"
              @select="selectProcess"
            />
          </div>
        </div>
      </div>

      <!-- 상세 -->
      <div class="col-md-5 h-100">
        <div class="card h-100">
          <div class="card-header">공정 상세 정보</div>
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
      if (!this.selected.process_name) return alert('공정명을 입력하세요.');
      try {
        await axios.post('/api/processes', this.selected);
        await this.loadProcesses();
      } catch (err) {
        console.error('onSave error', err);
        alert('저장 중 오류가 발생했습니다.');
      }
    },
    async onDelete() {
      if (!this.selected.process_code) return alert('삭제할 공정을 선택하세요!');
      if (!confirm('정말 삭제하시겠습니까?')) return;
      try {
        await axios.delete(`/api/processes/${this.selected.process_code}`);
        await this.loadProcesses();
      } catch (err) {
        console.error('onDelete error', err);
        alert('삭제 중 오류가 발생했습니다.');
      }
    }
  }
};
</script>

<style scoped>
.sticky-top th { position: sticky; top: 0; background: #fff; z-index: 10; }
.table-active { background-color: #d0ebff; }
.table-hover tbody tr:hover { background-color: #f8f9fa; }
</style>
