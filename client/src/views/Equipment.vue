<template>
  <div class="container-fluid py-3">
    <!-- 1) 필터 -->
    <div class="row mb-3">
      <div class="col-12">
        <div class="card">
          <div class="card-body">
            <EquipmentFilter
              v-model:searchType="searchType"
              v-model:searchValue="searchValue"
              @search="loadEquipments"
              @reset="resetFilter"
            />
          </div>
        </div>
      </div>
    </div>

    <!-- 2) 리스트 / 상세 (높이 고정) -->
    <div class="row gx-3" style="height:100vh;">
      <!-- 좌측: 장비 리스트 -->
      <div class="col-md-8 h-100 d-flex flex-column">
        <div class="card list-card flex-fill">
          <div class="card-header py-2"><strong>장비 리스트</strong></div>
          <div class="card-body p-0 list-scroll flex-grow-1">
            <EquipmentList
              :equipmentList="equipmentList"
              :selectedCode="selected.equipment_code"
              @select="selectEq"
            />
          </div>
        </div>
      </div>

      <!-- 우측: 상세 + 점검이력 -->
      <div class="col-md-4 h-100 d-flex flex-column">
        <div class="card flex-fill mb-2">
          <div class="card-header py-2"><strong>장비 상세 정보</strong></div>
          <div class="card-body overflow-auto">
            <EquipmentDetail
              :eq="selected"
              :typeList="typeList"
              :unitList="unitList"
              :suitableList="suitableList"
              @create="onCreate"
              @delete="onDelete"
              @clear="clearDetail"
            />
          </div>
        </div>

        <!-- 점검 이력 카드 -->
        <div class="card" style="height:45%;">
          <div class="card-body p-0 overflow-auto">
            <InspectionHistory
              :inspectionList="inspectionList"
              @add="addInspectionRow"
              @save="saveInspection"
              @delete="deleteInspection"
              @reload="loadInspections(selected.equipment_code)"
            />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios';
import EquipmentFilter from './components/EquipmentFilter.vue';
import EquipmentList from './components/EquipmentList.vue';
import EquipmentDetail from './components/EquipmentDetail.vue';
import InspectionHistory from './components/InspectionHistory.vue';

export default {
  name: 'Equipment',
  components: {
    EquipmentFilter,
    EquipmentList,
    EquipmentDetail,
    InspectionHistory
  },
  data() {
    return {
      searchType: '',
      searchValue: '',
      equipmentList: [],
      selected: {},
      inspectionList: [],
      typeList: [],
      suitableList: [],
      unitList: []
    };
  },
  computed: {
    filterPlaceholder() {
      return {
        code: '장비코드',
        name: '장비명',
        type: '유형코드'
      }[this.searchType] || '';
    }
  },
  created() {
    this.loadEquipments();
  },
  methods: {
    formatDate(val) {
      if (!val) return '';
      const d = new Date(val);
      return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
    },
    resetFilter() {
      this.searchType = '';
      this.searchValue = '';
      this.loadEquipments();
    },
    clearDetail() {
      this.selected = { mode: 'reg' };
      this.inspectionList = [];
    },
    selectEq(eq) {
      this.selected = { ...eq, mode: 'edit' };
      this.loadInspections(eq.equipment_code);
    },
    async loadEquipments() {
      const params = {
        code: this.searchType === 'code' ? this.searchValue : '',
        name: this.searchType === 'name' ? this.searchValue : '',
        type: this.searchType === 'type' ? this.searchValue : ''
      };
      try {
        const res = await axios.get('/api/equipments', { params });
        this.equipmentList = res.data;
        this.clearDetail();
      } catch {
        this.equipmentList = [];
      }

      try {
        const [t, s, u] = await Promise.all([
          axios.get('/api/equipments/typeCode'),
          axios.get('/api/equipments/suitableCode'),
          axios.get('/api/equipments/unitCode')
        ]);
        this.typeList = t.data;
        this.suitableList = s.data;
        this.unitList = u.data;
      } catch {
        this.typeList = this.suitableList = this.unitList = [];
      }
    },
    async onCreate() {
      if (!this.selected.equipment_name) return alert('장비명을 입력하세요.');
      if (!this.selected.equipment_type) return alert('유형코드를 선택하세요.');
      if (!this.selected.unit_code) return alert('단위코드를 선택하세요.');
      try {
        await axios.post('/api/equipments', this.selected);
        await this.loadEquipments();
      } catch (err) {
        console.error(err);
      }
    },
    async onDelete() {
      if (!this.selected.equipment_code) return;
      if (!confirm('삭제하시겠습니까?')) return;
      try {
        await axios.delete(`/api/equipments/${this.selected.equipment_code}`);
        await this.loadEquipments();
      } catch (err) {
        console.error(err);
      }
    },
    async loadInspections(equipmentCode) {
      if (!equipmentCode) {
        this.inspectionList = [];
        return;
      }
      try {
        const res = await axios.get(`/api/equipments/inspectionsList/${equipmentCode}`);
        this.inspectionList = res.data.map((ins) => ({
          ...ins,
          inspection_date: ins.inspection_date?.slice(0, 10) || ''
        }));
      } catch {
        this.inspectionList = [];
      }
    },
    addInspectionRow() {
      if (!this.selected.equipment_code) return alert('먼저 장비를 선택하세요!');
      this.inspectionList.push({
        inspection_id: '',
        inspection_date: '',
        inspector_id: '',
        contents: '',
        result: '정상',
        equipment_code: this.selected.equipment_code
      });
    },
    async saveInspection(ins) {
      if (!ins.inspector_id) return alert('점검자를 입력하세요.');
      if (!ins.inspection_date) return alert('점검일을 입력하세요.');
      try {
        const res = await axios.post('/api/equipments/saveInspection', ins);
        if (res.data.next_id) ins.inspection_id = res.data.next_id;
      } catch (err) {
        console.error(err);
      }
    },
    async deleteInspection(ins) {
      if (!ins.inspection_id) {
        this.inspectionList = this.inspectionList.filter((i) => i !== ins);
        return;
      }
      if (!confirm('삭제하시겠습니까?')) return;
      try {
        await axios.post('/api/equipments/deleteInspection', {
          inspection_id: ins.inspection_id
        });
        this.inspectionList = this.inspectionList.filter(
          (i) => i.inspection_id !== ins.inspection_id
        );
      } catch (err) {
        console.error(err);
      }
    }
  }
};
</script>

<style scoped>
/* 리스트 카드 고정 높이 및 스크롤 처리 */
.list-card   { display: flex; flex-direction: column; height: 100%; }
.list-scroll { overflow: auto; }

/* 테이블 헤더 고정 */
table thead th {
  position: sticky;
  top: 0;
  background: #f8f9fa;
  z-index: 1;
}

/* 선택/호버 색상 */
.table-active { background-color: #d0ebff; }
.table-hover tbody tr:hover { background-color: #f8f9fa; }
</style>
