<!-- src/views/Equipment.vue -->
<template>
  <div class="container-fluid p-0" style="height:100vh">
    <!-- ───────── 1) 상단 필터 바 ───────── -->
    <div class="row m-0" style="height:10vh">
      <div class="col-12 h-100">
        <div class="card h-100 position-relative">
          <div class="card-body p-0">
            <div class="position-absolute top-0 end-0 d-flex align-items-center" style="margin:0.5rem; z-index:1000">
              <!-- 필터 선택 -->
              <select v-model="searchType" class="form-control form-control-sm me-2" style="width:120px">
                <option value="">[전체]</option>
                <option value="code">코드</option>
                <option value="name">명칭</option>
                <option value="type">유형</option>
                <option value="manu">제조사</option>
              </select>
              <!-- 검색어 -->
              <input v-model="searchValue" :placeholder="filterPlaceholder" class="form-control form-control-sm me-2" style="width:200px">
              <button @click="loadEquipments" class="btn btn-sm btn-outline-primary me-1" style="width:80px;height:32px">조회</button>
              <button @click="resetFilter" class="btn btn-sm btn-outline-secondary" style="width:80px;height:32px">초기화</button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- ───────── 2) 하단 영역 ───────── -->
    <div class="row g-3 m-0" style="height:90vh">
      <!-- 2‑1) 장비 리스트 -->
      <div class="col-md-6 h-100">
        <div class="card h-100">
          <div class="card-body d-flex flex-column p-2">
            <div class="table-responsive flex-fill overflow-auto">
              <table class="table table-hover table-sm mb-0">
                <thead class="thead-light sticky-top">
                  <tr><th>코드</th><th>명칭</th><th>유형</th><th>제조사</th><th>용량</th></tr>
                </thead>
                <tbody>
                  <tr v-for="eq in equipmentList" :key="eq.equipment_code" @click="selectEquipment(eq)"
                      :class="{ 'table-active': eq.equipment_code === selectedEquipment?.equipment_code }" style="cursor:pointer">
                    <td>{{ eq.equipment_code }}</td>
                    <td>{{ eq.equipment_name }}</td>
                    <td>{{ eq.equipment_type }}</td>
                    <td>{{ eq.manufacturer }}</td>
                    <td>{{ eq.capacity }}</td>
                  </tr>
                  <tr v-if="equipmentList.length === 0">
                    <td colspan="5" class="text-center py-4">데이터가 없습니다.</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <div class="mt-2 d-flex justify-content-end">
              <button @click="openEqModal" class="btn btn-sm btn-warning me-1" style="width:80px;height:32px">등록</button>
              <button @click="deleteEquipment" class="btn btn-sm btn-danger" style="width:80px;height:32px"
                      :disabled="!selectedEquipment.equipment_code">삭제</button>
            </div>
          </div>
        </div>
      </div>

      <!-- 2‑2) 점검 이력 리스트 -->
      <div class="col-md-6 h-100">
        <div class="card h-100">
          <div class="card-body d-flex flex-column p-2">
            <div class="table-responsive flex-fill overflow-auto">
              <table class="table table-hover table-sm mb-0">
                <thead class="thead-light sticky-top">
                  <tr><th>ID</th><th>점검일</th><th>점검자</th><th>결과</th></tr>
                </thead>
                <tbody>
                  <tr v-for="ins in inspectionList" :key="ins.inspection_id" @click="selectInspection(ins)"
                      :class="{ 'table-active': ins.inspection_id === selectedInspection?.inspection_id }" style="cursor:pointer">
                    <td>{{ ins.inspection_id }}</td>
                    <td>{{ formatDate(ins.inspection_date) }}</td>
                    <td>{{ ins.inspector_id }}</td>
                    <td>{{ ins.result }}</td>
                  </tr>
                  <tr v-if="!selectedEquipment.equipment_code">
                    <td colspan="4" class="text-center py-4">장비를 선택하세요.</td>
                  </tr>
                  <tr v-else-if="inspectionList.length === 0">
                    <td colspan="4" class="text-center py-4">점검 이력이 없습니다.</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <div class="mt-2 d-flex justify-content-end">
              <button @click="openInsModal" class="btn btn-sm btn-warning me-1" style="width:80px;height:32px"
                      :disabled="!selectedEquipment.equipment_code">등록</button>
              <button @click="deleteInspection" class="btn btn-sm btn-danger" style="width:80px;height:32px"
                      :disabled="!selectedInspection.inspection_id">삭제</button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- ──────── [모달] 장비 상세 ──────── -->
    <div v-if="showEqModal" class="modal-backdrop">
      <div class="modal-box">
        <button class="close-btn" @click="showEqModal = false">&times;</button>
        <h5 class="mb-3">장비 {{ eqForm.equipment_code ? '수정' : '등록' }}</h5>

        <!-- 코드: 자동 생성 안내 -->
        <div class="mb-2">
          <label class="form-label">코드</label>
          <input v-model="eqForm.equipment_code" class="form-control form-control-sm"
                 :readonly="true" :placeholder="eqForm.equipment_code ? '' : '(자동 생성)'">
        </div>
        <div class="mb-2"><label class="form-label">명칭</label>
          <input v-model="eqForm.equipment_name" class="form-control form-control-sm"></div>
        <div class="mb-2"><label class="form-label">유형</label>
          <input v-model="eqForm.equipment_type" class="form-control form-control-sm"></div>
        <div class="mb-2"><label class="form-label">제조사</label>
          <input v-model="eqForm.manufacturer" class="form-control form-control-sm"></div>
        <div class="mb-3"><label class="form-label">용량</label>
          <input type="number" v-model.number="eqForm.capacity" class="form-control form-control-sm"></div>

        <div class="d-flex justify-content-end">
          <button type="button" class="btn btn-sm btn-outline-secondary me-2" @click="resetEqForm">초기화</button>
          <button type="button" class="btn btn-sm btn-primary" :disabled="savingEq" @click.prevent="saveEquipment">
            {{ savingEq ? '저장중…' : '저장' }}
          </button>
        </div>
      </div>
    </div>

    <!-- ──────── [모달] 점검 상세 ──────── -->
    <div v-if="showInsModal" class="modal-backdrop">
      <div class="modal-box">
        <button class="close-btn" @click="showInsModal = false">&times;</button>
        <h5 class="mb-3">점검 {{ insForm.inspection_id ? '수정' : '등록' }}</h5>

        <!-- ID: 자동 생성 안내 -->
        <div class="mb-2">
          <label class="form-label">ID</label>
          <input v-model="insForm.inspection_id" class="form-control form-control-sm"
                 :readonly="true" :placeholder="insForm.inspection_id ? '' : '(자동 생성)'">
        </div>
        <div class="mb-2"><label class="form-label">점검일</label>
          <input type="date" v-model="insForm.inspection_date" class="form-control form-control-sm"></div>
        <div class="mb-2"><label class="form-label">점검자</label>
          <input v-model="insForm.inspector_id" class="form-control form-control-sm"></div>
        <div class="mb-3"><label class="form-label">결과</label>
          <input v-model="insForm.result" class="form-control form-control-sm"></div>

        <div class="d-flex justify-content-end">
          <button type="button" class="btn btn-sm btn-outline-secondary me-2" @click="resetInsForm">초기화</button>
          <button type="button" class="btn btn-sm btn-primary" :disabled="savingIns" @click.prevent="saveInspection">
            {{ savingIns ? '저장중…' : '저장' }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  name: 'Equipment',
  data() {
    return {
      /* ── 검색/목록/선택 ───────────────────── */
      searchType: '',
      searchValue: '',
      equipmentList: [],
      selectedEquipment: {},
      inspectionList: [],
      selectedInspection: {},

      /* ── 모달 표시 ───────────────────────── */
      showEqModal: false,
      showInsModal: false,

      /* ── 저장 플래그 ─────────────────────── */
      savingEq: false,
      savingIns: false,

      /* ── 모달 폼 데이터 ─────────────────── */
      eqForm: {
        equipment_code: '',
        equipment_name: '',
        equipment_type: '',
        manufacturer: '',
        capacity: null,
      },
      insForm: {
        inspection_id: '',
        inspection_date: '',
        inspector_id: '',
        result: '',
      },
    };
  },
  computed: {
    filterPlaceholder() {
      return (
        { code: '장비코드', name: '장비명', type: '유형코드', manu: '제조사' }[this.searchType] || ''
      );
    },
  },
  created() { this.loadEquipments(); },
  methods: {
    // ========= 목록/선택 =========
    async loadEquipments() {
      const p = {
        code: this.searchType === 'code' ? this.searchValue : '',
        name: this.searchType === 'name' ? this.searchValue : '',
        type: this.searchType === 'type' ? this.searchValue : '',
        manu: this.searchType === 'manu' ? this.searchValue : '',
      };
      try {
        const { data } = await axios.get('/api/equipments', { params: p });
        this.equipmentList = data;
        this.clearEquipmentDetail();
      } catch (e) {
        console.error(e);
        this.equipmentList = [];
      }
    },
    resetFilter() {
      this.searchType = '';
      this.searchValue = '';
      this.loadEquipments();
    },
    selectEquipment(eq) {
      this.selectedEquipment = { ...eq };
      this.loadInspections(eq.equipment_code);
    },
    clearEquipmentDetail() {
      this.selectedEquipment = {};
      this.inspectionList = [];
      this.selectedInspection = {};
    },
    async loadInspections(code) {
      try {
        const { data } = await axios.get(`/api/equipment_inspections/${code}`);
        this.inspectionList = data;
        this.selectedInspection = {};
      } catch (e) {
        console.error(e);
        this.inspectionList = [];
      }
    },
    selectInspection(ins) { this.selectedInspection = { ...ins }; },
    clearInspectionDetail() { this.selectedInspection = {}; },

    // ========= 장비 모달 =========
    openEqModal() {
      this.eqForm = this.selectedEquipment.equipment_code
        ? { ...this.selectedEquipment }
        : { equipment_code: '', equipment_name: '', equipment_type: '', manufacturer: '', capacity: null };
      this.showEqModal = true;
    },
    resetEqForm() {
      this.eqForm = { equipment_code: '', equipment_name: '', equipment_type: '', manufacturer: '', capacity: null };
    },
    async saveEquipment() {
      if (!this.eqForm.equipment_name) { alert('장비명을 입력하세요.'); return; }
      this.savingEq = true;
      try {
        const isNew = !this.eqForm.equipment_code;
        const url    = isNew ? '/api/equipments' : `/api/equipments/${this.eqForm.equipment_code}`;
        const method = isNew ? 'post' : 'put';
        await axios[method](url, this.eqForm);

        this.showEqModal = false;
        await this.loadEquipments();
        alert(isNew ? '장비가 등록되었습니다.' : '장비가 수정되었습니다.');
      } catch (e) {
        console.error('saveEquipment error', e);
        alert('저장 중 오류가 발생했습니다.');
      } finally {
        this.savingEq = false;
      }
    },
    async deleteEquipment() {
      if (!this.selectedEquipment.equipment_code) return;
      if (!confirm('삭제하시겠습니까?')) return;
      try {
        await axios.delete(`/api/equipments/${this.selectedEquipment.equipment_code}`);
        await this.loadEquipments();
      } catch (e) { console.error(e); }
    },

    // ========= 점검 모달 =========
    openInsModal() {
      if (!this.selectedEquipment.equipment_code) return;
      this.insForm = this.selectedInspection.inspection_id
        ? { ...this.selectedInspection }
        : { inspection_id: '', inspection_date: '', inspector_id: '', result: '' };
      this.showInsModal = true;
    },
    resetInsForm() {
      this.insForm = { inspection_id: '', inspection_date: '', inspector_id: '', result: '' };
    },
    async saveInspection() {
      if (!this.selectedEquipment.equipment_code) { alert('장비를 선택하세요.'); return; }
      if (!this.insForm.inspection_date) { alert('점검일을 입력하세요.'); return; }

      this.savingIns = true;
      try {
        const payload = { ...this.insForm, equipment_code: this.selectedEquipment.equipment_code };
        const isNew = !payload.inspection_id;
        const url    = isNew ? '/api/equipment_inspections'
                             : `/api/equipment_inspections/${payload.inspection_id}`;
        const method = isNew ? 'post' : 'put';
        await axios[method](url, payload);

        this.showInsModal = false;
        await this.loadInspections(this.selectedEquipment.equipment_code);
        alert(isNew ? '점검 이력이 등록되었습니다.' : '점검 이력이 수정되었습니다.');
      } catch (e) {
        console.error('saveInspection error', e);
        alert('저장 중 오류가 발생했습니다.');
      } finally {
        this.savingIns = false;
      }
    },
    async deleteInspection() {
      if (!this.selectedInspection.inspection_id) return;
      if (!confirm('삭제하시겠습니까?')) return;
      try {
        await axios.delete(`/api/equipment_inspections/${this.selectedInspection.inspection_id}`);
        await this.loadInspections(this.selectedEquipment.equipment_code);
      } catch (e) { console.error(e); }
    },

    // ========= 기타 =========
    formatDate(v) {
      if (!v) return '';
      const d = new Date(v);
      return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
    },
  },
};
</script>

<style scoped>
.table-hover tbody tr:hover { background:#f8f9fa; }
.sticky-top th { position:sticky; top:0; background:#fff; z-index:10; }

.modal-backdrop {
  position:fixed; inset:0; background:rgba(0,0,0,0.4);
  display:flex; justify-content:center; align-items:center; z-index:2000;
}
.modal-box {
  position:relative; background:#fff; padding:1.5rem;
  border-radius:8px; width:430px; max-width:90vw;
  box-shadow:0 0 10px rgba(0,0,0,0.2);
}
.close-btn {
  position:absolute; top:.6rem; right:.8rem;
  font-size:1.4rem; line-height:1; background:none; border:none;
  cursor:pointer; opacity:.6;
}
.close-btn:hover { opacity:1; }
</style>
