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
          <div class="card-header py-2 fs-4"><strong>장비 리스트</strong></div>
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
          <div class="card-header py-2 fs-4"><strong>장비 상세 정보</strong></div>
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
import Swal from 'sweetalert2';
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
  const eq = this.selected;

  if (!eq.equipment_name) {
    return Swal.fire('입력 오류', '장비명을 입력하세요.', 'warning');
  }
  if (!eq.equipment_type) {
    return Swal.fire('입력 오류', '유형코드를 선택하세요.', 'warning');
  }
  if (!eq.install_date) {
    return Swal.fire('입력 오류', '설치일을 입력하세요.', 'warning');
  }
  if (!eq.manufacturer) {
    return Swal.fire('입력 오류', '제조사를 입력하세요.', 'warning');
  }
  if (!eq.next_inspection_dt) {
    return Swal.fire('입력 오류', '다음 점검일을 입력하세요.', 'warning');
  }
  if (!eq.is_suitable) {
    return Swal.fire('입력 오류', '적합 여부를 선택하세요.', 'warning');
  }
  if (!eq.unit_code) {
    return Swal.fire('입력 오류', '단위코드를 선택하세요.', 'warning');
  }
if (eq.qty === '' || eq.qty == null) {
  return Swal.fire('입력 오류', '용량을 입력하세요.', 'warning');
}

  try {
    await axios.post('/api/equipments', eq);
    await this.loadEquipments();
    Swal.fire('성공', '장비가 등록/수정되었습니다.', 'success');
  } catch (err) {
    console.error('onCreate error', err);
    Swal.fire('오류', '등록 중 오류가 발생했습니다.', 'error');
  }
},
 async onDelete() {
      if (!this.selected.equipment_code) return;

      const result = await Swal.fire({
        title: '삭제하시겠습니까?',
        text: '해당 장비 정보를 삭제합니다.',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: '삭제',
        cancelButtonText: '취소'
      });

      if (!result.isConfirmed) return;

      try {
        await axios.delete(`/api/equipments/${this.selected.equipment_code}`);
        await this.loadEquipments();
        Swal.fire('삭제 완료', '장비가 삭제되었습니다.', 'success');
      } catch (err) {
        console.error(err);
        Swal.fire('오류', '삭제 중 오류가 발생했습니다.', 'error');
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
  if (!ins.inspector_id) {
    return Swal.fire('입력 오류', '점검자를 입력하세요.', 'warning');
  }
  if (!ins.inspection_date) {
    return Swal.fire('입력 오류', '점검일을 입력하세요.', 'warning');
  }

  try {
    const res = await axios.post('/api/equipments/saveInspection', ins);
    if (res.data.next_id) {
      ins.inspection_id = res.data.next_id;
    }
    Swal.fire('성공', '점검 이력이 저장되었습니다.', 'success');
  } catch (err) {
    console.error(err);
    Swal.fire('오류', '점검 저장 중 오류가 발생했습니다.', 'error');
  }
},
    
async deleteInspection(ins) {
  if (!ins.inspection_id) {
    // 아직 저장되지 않은 새 행이라면 그냥 삭제
    this.inspectionList = this.inspectionList.filter((i) => i !== ins);
    return;
  }

  const result = await Swal.fire({
    title: '삭제하시겠습니까?',
    text: '해당 점검 이력을 삭제합니다.',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonText: '삭제',
    cancelButtonText: '취소'
  });

  if (!result.isConfirmed) return;

  try {
    await axios.post('/api/equipments/deleteInspection', {
      inspection_id: ins.inspection_id
    });
    this.inspectionList = this.inspectionList.filter(
      (i) => i.inspection_id !== ins.inspection_id
    );
    Swal.fire('삭제 완료', '점검 이력이 삭제되었습니다.', 'success');
  } catch (err) {
    console.error(err);
    Swal.fire('오류', '삭제 중 오류가 발생했습니다.', 'error');
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
