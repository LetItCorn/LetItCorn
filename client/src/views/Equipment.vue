<!-- src/views/Equipment.vue -->
<template>
  <div class="container-fluid p-0" style="height:100vh">
    <!-- ───────── 1) 상단 필터 바 ───────── -->
    <div class="row m-0" style="height:10vh">
      <div class="col-12 h-100">
        <div class="card h-100 position-relative">
          <div class="card-body p-0">
            <div class="position-absolute top-0 end-0 d-flex align-items-center" style="margin:.5rem; z-index:1000">
              <!-- 필터 선택 -->
              <select v-model="searchType" class="form-control form-control-sm me-2" style="width:120px">
                <option value="">[전체]</option>
                <option value="code">코드</option>
                <option value="name">명칭</option>
                <option value="type">유형</option>
                <option value="manu">제조사</option>
              </select>
              <!-- 필터 입력 -->
              <input v-model="searchValue" :placeholder="filterPlaceholder"
                     class="form-control form-control-sm me-2" style="width:200px">
              <!-- 버튼 -->
              <button @click="loadEquipments"  class="btn btn-sm btn-outline-primary me-1" style="width:80px;height:32px">조회</button>
              <button @click="resetFilter"      class="btn btn-sm btn-outline-secondary"  style="width:80px;height:32px">초기화</button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- ───────── 2) 하단 영역 ───────── -->
    <div class="row g-3 m-0" style="height:90vh">
      <!-- 2‑1) 장비 리스트 -->
      <div class="col-md-8 h-100">
        <div class="card h-100">
          <div class="card-body d-flex flex-column p-2">
            <div class="table-responsive flex-fill overflow-auto">
              <table class="table table-hover table-sm mb-0">
                <thead class="thead-light sticky-top">
                  <tr>
                    <th>코드</th><th>명칭</th><th>유형</th><th>설치일</th><th>제조사</th>
                    <th>다음점검</th><th>수량</th><th>단위</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="eq in equipmentList" :key="eq.equipment_code"
                      @click="selectEquipment(eq)"
                      :class="{ 'table-active': isSelected(eq) }"
                      style="cursor:pointer">
                    <td>{{ eq.equipment_code }}</td>
                    <td>{{ eq.equipment_name }}</td>
                    <td>{{ eq.equipment_type }}</td>
                    <td>{{ fmt(eq.install_date) }}</td>
                    <td>{{ eq.manufacturer }}</td>
                    <td>{{ fmt(eq.next_inspection_dt) }}</td>
                    <td>{{ eq.qty }}</td>
                    <td>{{ eq.spec }}</td>
                  </tr>
                  <tr v-if="equipmentList.length === 0">
                    <td colspan="8" class="text-center py-4">데이터가 없습니다.</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <div class="mt-2 d-flex justify-content-end">
              <button @click="openEqModal"   class="btn btn-sm btn-warning me-1" style="width:80px;height:32px">등록</button>
              <button @click="deleteEquipment" class="btn btn-sm btn-danger"  style="width:80px;height:32px"
                      :disabled="!selectedEquipment.equipment_code">삭제</button>
            </div>
          </div>
        </div>
      </div>

      <!-- 2‑2) 점검 이력 리스트 -->
      <div class="col-md-4 h-100">
        <div class="card h-100">
          <div class="card-body d-flex flex-column p-2">
            <div class="table-responsive flex-fill overflow-auto">
              <table class="table table-hover table-sm mb-0">
                <thead class="thead-light sticky-top">
                  <tr><th>점검일</th><th>점검자</th><th>결과</th></tr>
                </thead>
                <tbody>
                  <tr v-for="ins in inspectionList" :key="ins.inspection_id"
                      @click="selectInspection(ins)"
                      :class="{ 'table-active': isInspectionSelected(ins) }"
                      style="cursor:pointer">
                    <td>{{ fmt(ins.inspection_date) }}</td>
                    <td>{{ ins.inspector_id }}</td>
                    <td>{{ ins.result }}</td>
                  </tr>
                  <tr v-if="!selectedEquipment.equipment_code">
                    <td colspan="3" class="text-center py-4">장비를 선택하세요.</td>
                  </tr>
                  <tr v-else-if="inspectionList.length === 0">
                    <td colspan="3" class="text-center py-4">점검 이력이 없습니다.</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <div class="mt-2 d-flex justify-content-end">
              <button @click="openInsModal"   class="btn btn-sm btn-warning me-1" style="width:80px;height:32px"
                      :disabled="!selectedEquipment.equipment_code">등록</button>
              <button @click="deleteInspection" class="btn btn-sm btn-danger"  style="width:80px;height:32px"
                      :disabled="!selectedInspection.inspection_id">삭제</button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- ──────── 장비 모달 ──────── -->
    <div v-if="showEqModal" class="modal-backdrop">
      <div class="modal-box">
        <button class="close-btn" @click="closeEqModal">&times;</button>
        <h5 class="mb-3">장비 {{ eqForm.equipment_code ? '수정' : '등록' }}</h5>

        <!-- 코드(자동) -->
        <div class="mb-2">
          <label class="form-label">코드</label>
          <input v-model="eqForm.equipment_code" class="form-control form-control-sm"
                 readonly :placeholder="eqForm.equipment_code ? '' : '(자동 생성)'">
        </div>

        <!-- 상세 입력 -->
        <div class="mb-2"><label class="form-label">명칭</label>
          <input v-model="eqForm.equipment_name" class="form-control form-control-sm"></div>

        <div class="mb-2"><label class="form-label">유형</label>
          <input v-model="eqForm.equipment_type" class="form-control form-control-sm"></div>

        <div class="mb-2"><label class="form-label">설치일</label>
          <input type="date" v-model="eqForm.install_date" class="form-control form-control-sm"></div>

        <div class="mb-2"><label class="form-label">제조사</label>
          <input v-model="eqForm.manufacturer" class="form-control form-control-sm"></div>

        <div class="mb-2"><label class="form-label">다음 점검일</label>
          <input type="date" v-model="eqForm.next_inspection_dt" class="form-control form-control-sm"></div>

        <div class="mb-2"><label class="form-label">사용 여부</label>
          <select v-model="eqForm.is_suitable" class="form-control form-control-sm">
            <option v-for="opt in suitableCodes" :key="opt.is_suitable" :value="opt.is_suitable">
              {{ opt.is_suitable_name }}
            </option>
          </select>
        </div>

        <div class="mb-2"><label class="form-label">수량</label>
          <input type="number" v-model.number="eqForm.qty" class="form-control form-control-sm" min="0"></div>

        <div class="mb-2"><label class="form-label">단위</label>
          <input v-model="eqForm.spec" class="form-control form-control-sm"></div>

        <!-- 버튼 -->
        <div class="d-flex justify-content-end mt-3">
          <button class="btn btn-sm btn-outline-secondary me-2" @click="resetEqForm">초기화</button>
          <button class="btn btn-sm btn-primary" :disabled="savingEq" @click.prevent="saveEquipment">
            {{ savingEq ? '저장중…' : '저장' }}
          </button>
        </div>
      </div>
    </div>

    <!-- ──────── 점검 모달 ──────── -->
    <div v-if="showInsModal" class="modal-backdrop">
      <div class="modal-box">
        <button class="close-btn" @click="closeInsModal">&times;</button>
        <h5 class="mb-3">점검 {{ insForm.inspection_id ? '수정' : '등록' }}</h5>

        <div class="mb-2"><label class="form-label">점검일</label>
          <input type="date" v-model="insForm.inspection_date" class="form-control form-control-sm"></div>

        <div class="mb-2"><label class="form-label">점검자</label>
          <input v-model="insForm.inspector_id" class="form-control form-control-sm"></div>

        <div class="mb-3"><label class="form-label">결과</label>
          <input v-model="insForm.result" class="form-control form-control-sm"></div>

        <div class="d-flex justify-content-end">
          <button class="btn btn-sm btn-outline-secondary me-2" @click="resetInsForm">초기화</button>
          <button class="btn btn-sm btn-primary" :disabled="savingIns" @click.prevent="saveInspection">
            {{ savingIns ? '저장중…' : '저장' }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios';
import dayjs from 'dayjs';

export default {
  name: 'Equipment',
  data() {
    return {
      // 검색
      searchType: '',
      searchValue: '',
      // 리스트
      equipmentList: [],
      selectedEquipment: {},

      inspectionList: [],
      selectedInspection: {},

      // 모달 & 폼
      showEqModal: false,
      showInsModal: false,
      savingEq: false,
      savingIns: false,

      eqForm: {},       // equipment form
      insForm: {},      // inspection form

      // 공통코드
      suitableCodes: []
    };
  },
  computed: {
    filterPlaceholder() {
      switch (this.searchType) {
        case 'code': return '코드';
        case 'name': return '명칭';
        case 'type': return '유형';
        case 'manu': return '제조사';
        default:     return '전체 조회';
      }
    }
  },
  created() {
    this.loadEquipments();
    this.loadSuitableCodes();
  },
  methods: {
    /* 날짜 포맷 */
    fmt(d) {
      return d ? dayjs(d).format('YYYY-MM-DD') : '';
    },

    /* ───────── Equipments ───────── */
    async loadEquipments() {
      const params = {
        code: this.searchType === 'code' ? this.searchValue : '',
        name: this.searchType === 'name' ? this.searchValue : '',
        type: this.searchType === 'type' ? this.searchValue : '',
        manu: this.searchType === 'manu' ? this.searchValue : ''
      };
      try {
        const { data } = await axios.get('/api/equipments', { params });
        this.equipmentList = data;
        // 선택 초기화
        this.selectedEquipment = {};
        this.inspectionList = [];
        this.selectedInspection = {};
      } catch (err) {
        console.error('loadEquipments', err);
        this.equipmentList = [];
      }
    },
    resetFilter() {
      this.searchType = '';
      this.searchValue = '';
      this.loadEquipments();
    },
    isSelected(eq) {
      return eq.equipment_code === this.selectedEquipment.equipment_code;
    },
    selectEquipment(eq) {
      this.selectedEquipment = eq;
      this.loadInspections();
    },

    /* 모달 열기/닫기 */
    openEqModal() {
      if (this.selectedEquipment.equipment_code) {
        // 수정
        this.eqForm = { ...this.selectedEquipment };
      } else {
        // 신규
        this.eqForm = {
          equipment_code: '',
          equipment_name: '',
          equipment_type: '',
          install_date: '',
          manufacturer: '',
          next_inspection_dt: '',
          is_suitable: 'D01',
          qty: 0,
          spec: ''
        };
      }
      this.showEqModal = true;
    },
    closeEqModal() {
      this.showEqModal = false;
      this.eqForm = {};
    },
    resetEqForm() {
      if (this.eqForm.equipment_code) {
        // 수정 모드 → 원본 값 복구
        this.eqForm = { ...this.selectedEquipment };
      } else {
        // 신규 모드 → 빈값
        this.eqForm = {
          equipment_code: '',
          equipment_name: '',
          equipment_type: '',
          install_date: '',
          manufacturer: '',
          next_inspection_dt: '',
          is_suitable: 'D01',
          qty: 0,
          spec: ''
        };
      }
    },
    async saveEquipment() {
      this.savingEq = true;
      try {
        await axios.post('/api/equipments', this.eqForm);
        await this.loadEquipments();
        this.showEqModal = false;
      } catch (err) {
        console.error('saveEquipment', err);
      } finally {
        this.savingEq = false;
      }
    },
    async deleteEquipment() {
      if (!confirm('삭제하시겠습니까?')) return;
      try {
        await axios.delete(`/api/equipments/${this.selectedEquipment.equipment_code}`);
        await this.loadEquipments();
      } catch (err) {
        console.error('deleteEquipment', err);
      }
    },

    /* ───────── Inspections ───────── */
    async loadInspections() {
      if (!this.selectedEquipment.equipment_code) return;
      try {
        const { data } = await axios.get(`/api/equipment_inspections/${this.selectedEquipment.equipment_code}`);
        this.inspectionList = data;
        this.selectedInspection = {};
      } catch (err) {
        console.error('loadInspections', err);
        this.inspectionList = [];
      }
    },
    isInspectionSelected(ins) {
      return ins.inspection_id === this.selectedInspection.inspection_id;
    },
    selectInspection(ins) {
      this.selectedInspection = ins;
    },
    openInsModal() {
      if (this.selectedInspection.inspection_id) {
        // 수정
        this.insForm = { ...this.selectedInspection };
      } else {
        // 신규
        this.insForm = {
          inspection_id: '',
          inspection_date: dayjs().format('YYYY-MM-DD'),
          inspector_id: '',
          result: '',
          equipment_code: this.selectedEquipment.equipment_code
        };
      }
      this.showInsModal = true;
    },
    closeInsModal() {
      this.showInsModal = false;
      this.insForm = {};
    },
    resetInsForm() {
      if (this.insForm.inspection_id) {
        this.insForm = { ...this.selectedInspection };
      } else {
        this.insForm = {
          inspection_id: '',
          inspection_date: dayjs().format('YYYY-MM-DD'),
          inspector_id: '',
          result: '',
          equipment_code: this.selectedEquipment.equipment_code
        };
      }
    },
    async saveInspection() {
      this.savingIns = true;
      try {
        await axios.post('/api/equipment_inspections', this.insForm);
        await this.loadInspections();
        this.showInsModal = false;
      } catch (err) {
        console.error('saveInspection', err);
      } finally {
        this.savingIns = false;
      }
    },
    async deleteInspection() {
      if (!confirm('삭제하시겠습니까?')) return;
      try {
        await axios.delete(`/api/equipment_inspections/${this.selectedInspection.inspection_id}`);
        await this.loadInspections();
      } catch (err) {
        console.error('deleteInspection', err);
      }
    },

    /* ───────── 공통코드 ───────── */
    async loadSuitableCodes() {
      try {
        const { data } = await axios.get('/api/equipments/suitableCodes');
        this.suitableCodes = data;
      } catch (err) {
        console.error('loadSuitableCodes', err);
        this.suitableCodes = [];
      }
    }
  }
};
</script>

<style scoped>
.table-hover tbody tr:hover    { background:#f8f9fa; }
.sticky-top th                 { position:sticky; top:0; background:#fff; z-index:10; }
.modal-backdrop                { position:fixed; inset:0; background:rgba(0,0,0,.4); display:flex; justify-content:center; align-items:center; z-index:2000; }
.modal-box                     { position:relative; background:#fff; padding:1.5rem; border-radius:8px; width:430px; max-width:90vw; box-shadow:0 0 10px rgba(0,0,0,.2); }
.close-btn                     { position:absolute; top:.6rem; right:.8rem; font-size:1.4rem; background:none; border:none; cursor:pointer; opacity:.6; }
.close-btn:hover               { opacity:1; }
.table-active                  { background:#d0ebff; }
</style>
