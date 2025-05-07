<!-- src/views/Equipment.vue -->
<template>
  <div class="container-fluid p-0" style="height:100vh;">
    <!-- 1) 상단 헤더: 필터 바 (높이 10%) -->
    <div class="row m-0" style="height:10vh;">
      <div class="col-12 h-100">
        <div class="card h-100 position-relative">
          <div class="card-body p-0">
            <div
              class="position-absolute top-0 end-0 d-flex align-items-center"
              style="margin:0.5rem; z-index:1000;"
            >
              <select
                v-model="searchType"
                class="form-control form-control-sm me-2"
                style="width:120px;"
              >
                <option value="">[전체]</option>
                <option value="code">코드</option>
                <option value="name">명칭</option>
                <option value="type">유형</option>
                <option value="manu">제조사</option>
              </select>
              <input
                v-model="searchValue"
                :placeholder="filterPlaceholder"
                class="form-control form-control-sm me-2"
                style="width:200px;"
              />
              <button
                @click="loadEquipments"
                class="btn btn-sm btn-outline-primary me-1"
                style="width:80px; height:32px;"
              >조회</button>
              <button
                @click="resetFilter"
                class="btn btn-sm btn-outline-secondary"
                style="width:80px; height:32px;"
              >초기화</button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 2) 하단: 리스트(좌 50%) / 상세(우 50%) (높이 90%) -->
    <div class="row g-3 m-0" style="height:90vh;">
      <!-- 2-1) 좌측: 장비 리스트 + CRUD -->
      <div class="col-md-6 h-100">
        <div class="card h-100">
          <div class="card-body d-flex flex-column p-2">
            <!-- 리스트 -->
            <div class="table-responsive flex-fill overflow-auto">
              <table class="table table-hover table-sm mb-0">
                <thead class="thead-light sticky-top">
                  <tr>
                    <th>코드</th>
                    <th>명칭</th>
                    <th>유형</th>
                    <th>제조사</th>
                    <th>용량</th>
                  </tr>
                </thead>
                <tbody>
                  <tr
                    v-for="eq in equipmentList"
                    :key="eq.equipment_code"
                    @click="selectEquipment(eq)"
                    :class="{ 'table-active': eq.equipment_code === selectedEquipment?.equipment_code }"
                    style="cursor:pointer"
                  >
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
            <!-- CRUD 버튼 -->
            <div class="mt-2 d-flex justify-content-end">
              <button
                @click="clearEquipmentDetail"
                class="btn btn-sm btn-outline-secondary me-1"
                style="width:80px; height:32px;"
              >초기화</button>
              <button
                @click="createEquipment"
                class="btn btn-sm btn-warning me-1"
                style="width:80px; height:32px;"
              >등록</button>
              <button
                @click="updateEquipment"
                class="btn btn-sm btn-success me-1"
                style="width:80px; height:32px;"
                :disabled="!selectedEquipment.equipment_code"
              >수정</button>
              <button
                @click="deleteEquipment"
                class="btn btn-sm btn-danger"
                style="width:80px; height:32px;"
                :disabled="!selectedEquipment.equipment_code"
              >삭제</button>
            </div>
          </div>
        </div>
      </div>

      <!-- 2-2) 우측: 점검 이력 리스트 + CRUD -->
      <div class="col-md-6 h-100">
        <div class="card h-100">
          <div class="card-body d-flex flex-column p-2">
            <!-- 점검 이력 리스트 -->
            <div class="table-responsive flex-fill overflow-auto">
              <table class="table table-hover table-sm mb-0">
                <thead class="thead-light sticky-top">
                  <tr>
                    <th>ID</th>
                    <th>점검일</th>
                    <th>점검자</th>
                    <th>결과</th>
                  </tr>
                </thead>
                <tbody>
                  <tr
                    v-for="ins in inspectionList"
                    :key="ins.inspection_id"
                    @click="selectInspection(ins)"
                    :class="{ 'table-active': ins.inspection_id === selectedInspection?.inspection_id }"
                    style="cursor:pointer"
                  >
                    <td>{{ ins.inspection_id }}</td>
                    <td>{{ formatDate(ins.inspection_date) }}</td>
                    <td>{{ ins.inspector_id }}</td>
                    <td>{{ ins.result }}</td>
                  </tr>
                  <tr v-if="!selectedEquipment">
                    <td colspan="4" class="text-center py-4">장비를 선택하세요.</td>
                  </tr>
                  <tr v-else-if="inspectionList.length===0">
                    <td colspan="4" class="text-center py-4">점검 이력이 없습니다.</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <!-- CRUD 버튼 -->
            <div class="mt-2 d-flex justify-content-end">
              <button
                @click="clearInspectionDetail"
                class="btn btn-sm btn-outline-secondary me-1"
                style="width:80px; height:32px;"
              >초기화</button>
              <button
                @click="createInspection"
                class="btn btn-sm btn-warning me-1"
                style="width:80px; height:32px;"
                :disabled="!selectedEquipment"
              >등록</button>
              <button
                @click="updateInspection"
                class="btn btn-sm btn-success me-1"
                style="width:80px; height:32px;"
                :disabled="!selectedInspection"
              >수정</button>
              <button
                @click="deleteInspection"
                class="btn btn-sm btn-danger"
                style="width:80px; height:32px;"
                :disabled="!selectedInspection"
              >삭제</button>
            </div>
          </div>
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
      searchType: '',
      searchValue: '',
      equipmentList: [],
      selectedEquipment: {},
      inspectionList: [],
      selectedInspection: {}
    };
  },
  computed: {
    filterPlaceholder() {
      switch (this.searchType) {
        case 'code': return '장비코드';
        case 'name': return '장비명';
        case 'type': return '유형코드';
        case 'manu': return '제조사';
        default:     return '';
      }
    }
  },
  created() {
    this.loadEquipments();
  },
  methods: {
    // 장비 리스트 조회
    async loadEquipments() {
      const params = {
        code: this.searchType === 'code' ? this.searchValue : '',
        name: this.searchType === 'name' ? this.searchValue : '',
        type: this.searchType === 'type' ? this.searchValue : '',
        manu: this.searchType === 'manu' ? this.searchValue : ''
      };
      try {
        const res = await axios.get('/api/equipments', { params });
        this.equipmentList = res.data;
        this.clearEquipmentDetail();
      } catch (err) {
        console.error(err);
        this.equipmentList = [];
      }
    },
    resetFilter() {
      this.searchType = '';
      this.searchValue = '';
      this.loadEquipments();
    },
    // 장비 선택 → 점검 이력 불러오기
    selectEquipment(eq) {
      this.selectedEquipment = { ...eq };
      this.loadInspections(eq.equipment_code);
    },
    clearEquipmentDetail() {
      this.selectedEquipment = {};
      this.inspectionList = [];
      this.selectedInspection = {};
    },
    // CRUD for equipments
    async createEquipment() {
      try {
        await axios.post('/api/equipments', this.selectedEquipment);
        await this.loadEquipments();
      } catch (err) {
        console.error(err);
      }
    },
    async updateEquipment() {
      if (!this.selectedEquipment.equipment_code) return;
      try {
        await axios.put(
          `/api/equipments/${this.selectedEquipment.equipment_code}`,
          this.selectedEquipment
        );
        await this.loadEquipments();
      } catch (err) {
        console.error(err);
      }
    },
    async deleteEquipment() {
      if (!this.selectedEquipment.equipment_code) return;
      try {
        await axios.delete(`/api/equipments/${this.selectedEquipment.equipment_code}`);
        await this.loadEquipments();
      } catch (err) {
        console.error(err);
      }
    },

    // 점검 이력 조회
    async loadInspections(code) {
      try {
        const res = await axios.get(`/api/equipment_inspections/${code}`);
        this.inspectionList = res.data;
        this.selectedInspection = {};
      } catch (err) {
        console.error(err);
        this.inspectionList = [];
      }
    },
    selectInspection(ins) {
      this.selectedInspection = { ...ins };
    },
    clearInspectionDetail() {
      this.selectedInspection = {};
    },
    // CRUD for inspections
    async createInspection() {
      if (!this.selectedEquipment.equipment_code) return;
      const payload = { ...this.selectedInspection, equipment_code: this.selectedEquipment.equipment_code };
      try {
        await axios.post('/api/equipment_inspections', payload);
        await this.loadInspections(this.selectedEquipment.equipment_code);
      } catch (err) {
        console.error(err);
      }
    },
    async updateInspection() {
      if (!this.selectedInspection.inspection_id) return;
      try {
        await axios.put(
          `/api/equipment_inspections/${this.selectedInspection.inspection_id}`,
          this.selectedInspection
        );
        await this.loadInspections(this.selectedEquipment.equipment_code);
      } catch (err) {
        console.error(err);
      }
    },
    async deleteInspection() {
      if (!this.selectedInspection.inspection_id) return;
      try {
        await axios.delete(`/api/equipment_inspections/${this.selectedInspection.inspection_id}`);
        await this.loadInspections(this.selectedEquipment.equipment_code);
      } catch (err) {
        console.error(err);
      }
    },

    formatDate(val) {
      if (!val) return '';
      const d = new Date(val);
      return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`;
    }
  }
};
</script>

<style scoped>
.table-hover tbody tr:hover {
  background-color: #f8f9fa;
}
.sticky-top th {
  position: sticky;
  top: 0;
  background: white;
  z-index: 10;
}
</style>
