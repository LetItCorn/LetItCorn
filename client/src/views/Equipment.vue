<!-- src/views/Equipment.vue -->
<template>
  <div class="container-fluid vh-100 py-3 d-flex flex-column">
    <!-- 1) 상단 조회·필터 바 ------------------------------------------------ -->
    <div class="row mb-3">
      <div class="col-12">
        <div class="card">
          <div class="card-body d-flex align-items-center">
            <div class="ms-auto d-flex align-items-center">
              <select
                v-model="searchType"
                class="form-select form-select-sm me-2"
                style="width:140px"
              >
                <option value="">[선택 없음]</option>
                <option value="code">장비코드</option>
                <option value="name">장비명</option>
                <option value="type">유형코드</option>
              </select>
              <input
                v-model="searchValue"
                :placeholder="filterPlaceholder"
                class="form-control form-control-sm me-2"
                style="width:200px"
              />
              <button
                @click="loadEquipments"
                class="btn btn-sm btn-primary me-2"
                style="width:80px"
              >
                조회
              </button>
              <button
                @click="resetFilter"
                class="btn btn-sm btn-outline-secondary"
                style="width:80px"
              >
                초기화
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 2) 하단: 리스트(좌) / 상세+이력(우) ----------------------------------- -->
    <div class="row flex-grow-1 gx-3">
      <!-- 좌측: 장비 리스트 ------------------------------------------------ -->
      <div class="col-md-8 h-100">
        <div class="card h-100">
          <div class="card-header">
            장비 리스트 ({{ equipmentList.length }})
          </div>
          <div class="card-body p-0 overflow-auto">
            <table class="table table-hover table-sm mb-0">
              <thead class="thead-light sticky-top">
                <tr>
                  <th>코드</th>
                  <th>장비명</th>
                  <th>유형</th>
                  <th>설치일</th>
                  <th>제조사</th>
                  <th>다음점검</th>
                </tr>
              </thead>
              <tbody>
                <tr
                  v-for="eq in equipmentList"
                  :key="eq.equipment_code"
                  @click="selectEq(eq)"
                  :class="{ 'table-active': eq.equipment_code === selected.equipment_code }"
                  style="cursor:pointer"
                >
                  <td>{{ eq.equipment_code }}</td>
                  <td>{{ eq.equipment_name }}</td>
                  <td>{{ eq.type_name || eq.equipment_type }}</td>
                  <td>{{ formatDate(eq.install_date) }}</td>
                  <td>{{ eq.manufacturer }}</td>
                  <td>{{ formatDate(eq.next_inspection_dt) }}</td>
                </tr>
                <tr v-if="equipmentList.length === 0">
                  <td colspan="6" class="text-center py-4">데이터가 없습니다.</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <!-- 우측: 상세 + 점검 이력 -------------------------------------------- -->
      <div class="col-md-4 h-100 d-flex flex-column">
        <!-- 상세 카드 ---------------------------------------------------- -->
        <div class="card flex-grow-1 mb-2">
          <div class="card-header">장비 상세 정보</div>
          <div class="card-body overflow-auto">
            <table class="table table-borderless mb-3">
              <tbody>
                <tr>
                  <th>코드</th>
                  <td>
                    <input
                      v-model="selected.equipment_code"
                      class="form-control form-control-sm"
                      readonly
                      placeholder="자동 생성"
                    />
                  </td>
                </tr>
                <tr>
                  <th>장비명</th>
                  <td>
                    <input
                      v-model="selected.equipment_name"
                      class="form-control form-control-sm"
                    />
                  </td>
                </tr>
                <tr>
                  <th>유형코드</th>
                  <td>
                    <select
                      v-model="selected.equipment_type"
                      class="form-select form-select-sm"
                    >
                      <option value="">선택</option>
                      <option
                        v-for="code in typeList"
                        :key="code.code_values"
                        :value="code.code_values"
                      >
                        {{ code.code_name }}
                      </option>
                    </select>
                  </td>
                </tr>
                <tr>
                  <th>설치일</th>
                  <td>
                    <input
                      v-model="selected.install_date"
                      type="date"
                      class="form-control form-control-sm"
                    />
                  </td>
                </tr>
                <tr>
                  <th>제조사</th>
                  <td>
                    <input
                      v-model="selected.manufacturer"
                      class="form-control form-control-sm"
                    />
                  </td>
                </tr>
                <tr>
                  <th>다음점검일</th>
                  <td>
                    <input
                      v-model="selected.next_inspection_dt"
                      type="date"
                      class="form-control form-control-sm"
                    />
                  </td>
                </tr>
                <tr>
                  <th>적합여부</th>
                  <td>
                    <select
                      v-model="selected.is_suitable"
                      class="form-select form-select-sm"
                    >
                      <option value="">선택</option>
                      <option
                        v-for="code in suitableList"
                        :key="code.code_values"
                        :value="code.code_values"
                      >
                        {{ code.code_name }}
                      </option>
                    </select>
                  </td>
                </tr>
                <tr>
                  <th>단위코드</th>
                  <td>
                    <select
                      v-model="selected.unit_code"
                      class="form-select form-select-sm"
                    >
                      <option value="">선택</option>
                      <option
                        v-for="code in unitList"
                        :key="code.code_values"
                        :value="code.code_values"
                      >
                        {{ code.code_name }}
                      </option>
                    </select>
                  </td>
                </tr>
                <tr>
                  <th>용량/수량</th>
                  <td>
                    <input
                      v-model="selected.qty"
                      type="number"
                      class="form-control form-control-sm"
                    />
                  </td>
                </tr>
              </tbody>
            </table>
            <div class="d-flex gap-2">
              <button
                class="btn btn-outline-secondary flex-grow-1"
                @click="clearDetail"
              >
                초기화
              </button>
              <button class="btn btn-success flex-grow-1" @click="onCreate">
                등록/수정
              </button>
              <button
                class="btn btn-danger flex-grow-1"
                @click="onDelete"
                :disabled="!selected.equipment_code || selected.mode==='reg'"
              >
                삭제
              </button>
            </div>
          </div>
        </div>

        <!-- 점검 이력 카드 ------------------------------------------------ -->
        <div class="card flex-grow-1 d-flex flex-column">
          <div
            class="card-header d-flex align-items-center justify-content-between"
          >
            <span>설비 점검 이력 ({{ inspectionList.length }})</span>
            <div class="d-flex gap-1">
              <button
                class="btn btn-sm btn-outline-primary"
                @click="addInspectionRow"
              >
                추가
              </button>
              <button
                class="btn btn-sm btn-outline-secondary"
                @click="loadInspections(selected.equipment_code)"
              >
                새로고침
              </button>
            </div>
          </div>
          <div class="card-body p-0 overflow-auto">
            <table class="table table-sm table-hover mb-0">
              <thead class="thead-light sticky-top">
                <tr>
                  <th style="width:20%">점검자</th>
                  <th style="width:20%">점검일</th>
                  <th style="width:35%">내용</th>
                  <th style="width:15%">결과</th>
                  <th style="width:10%"></th>
                </tr>
              </thead>
              <tbody>
                <tr
                  v-for="(ins, idx) in inspectionList"
                  :key="ins.inspection_id || `new-${idx}`"
                >
                  <td>
                    <input
                      v-model="ins.inspector_id"
                      class="form-control form-control-sm"
                    />
                  </td>
                  <td>
                    <input
                      v-model="ins.inspection_date"
                      type="date"
                      class="form-control form-control-sm"
                    />
                  </td>
                  <td>
                    <input
                      v-model="ins.contents"
                      class="form-control form-control-sm"
                    />
                  </td>
                  <td>
                    <select
                      v-model="ins.result"
                      class="form-select form-select-sm"
                    >
                      <option value="정상">정상</option>
                      <option value="이상 발견">이상 발견</option>
                    </select>
                  </td>
                  <td class="text-nowrap">
                    <!-- 저장: 단일 행만 API 호출, 전체 reload 제거 -->
                    <button
                      class="btn btn-sm btn-success me-1"
                      @click="saveInspection(ins)"
                    >
                      저장
                    </button>
                    <button
                      class="btn btn-sm btn-danger"
                      @click="deleteInspection(ins)"
                    >
                      삭제
                    </button>
                  </td>
                </tr>
                <tr v-if="inspectionList.length===0">
                  <td colspan="5" class="text-center py-3">이력이 없습니다.</td>
                </tr>
              </tbody>
            </table>
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
      selected: {},
      typeList: [],
      suitableList: [],
      unitList: [],
      inspectionList: [],
    };
  },
  computed: {
    filterPlaceholder() {
      return (
        { code: '장비코드', name: '장비명', type: '유형코드' }[
          this.searchType
        ] || ''
      );
    },
  },
  created() {
    this.loadEquipments();
  },
  methods: {
    // 1) 장비 목록 + 공통코드
    async loadEquipments() {
      const params = {
        code: this.searchType === 'code' ? this.searchValue : '',
        name: this.searchType === 'name' ? this.searchValue : '',
        type: this.searchType === 'type' ? this.searchValue : '',
      };
      try {
        const res = await axios.get('/api/equipments', { params });
        this.equipmentList = res.data;
        this.clearDetail();
        this.inspectionList = [];
      } catch {
        this.equipmentList = [];
      }
      try {
        const [t, s, u] = await Promise.all([
          axios.get('/api/equipments/typeCode'),
          axios.get('/api/equipments/suitableCode'),
          axios.get('/api/equipments/unitCode'),
        ]);
        this.typeList = t.data;
        this.suitableList = s.data;
        this.unitList = u.data;
      } catch {
        this.typeList = this.suitableList = this.unitList = [];
      }
    },

    // 2) 상세 + 이력 로딩
    selectEq(eq) {
      this.selected = { ...eq, mode: 'edit' };
      this.loadInspections(eq.equipment_code);
    },
    clearDetail() {
      this.selected = { mode: 'reg' };
    },
    async loadInspections(equipmentCode) {
      if (!equipmentCode) {
        this.inspectionList = [];
        return;
      }
      try {
        const res = await axios.get(
          `/api/equipments/inspectionsList/${equipmentCode}`
        );
        // 날짜 포맷 YYYY-MM-DD로 자르기
        this.inspectionList = res.data.map((ins) => ({
          ...ins,
          inspection_date: ins.inspection_date
            ? ins.inspection_date.slice(0, 10)
            : '',
        }));
      } catch {
        this.inspectionList = [];
      }
    },

    // 3) 점검 이력 CRUD
    addInspectionRow() {
      if (!this.selected.equipment_code) {
        return alert('먼저 장비를 선택하세요!');
      }
      this.inspectionList.push({
        inspection_id: '',
        inspection_date: '',
        inspector_id: '',
        contents: '',
        result: '정상',
        equipment_code: this.selected.equipment_code,
      });
    },
    async saveInspection(ins) {
      if (!ins.inspector_id) return alert('점검자를 입력하세요.');
      if (!ins.inspection_date) return alert('점검일을 입력하세요.');
      try {
        const res = await axios.post('/api/equipments/saveInspection', ins);
        // 신규 저장 시 inspection_id가 돌아온다면 할당
        if (res.data.next_id) ins.inspection_id = res.data.next_id;
        // **전체 reload 제거** → 여러 개를 순차 저장해도 리스트 유지
      } catch (err) {
        console.error(err);
      }
    },
    async deleteInspection(ins) {
      // 새로 추가된 행이라 ID 없으면 배열에서만 제거
      if (!ins.inspection_id) {
        this.inspectionList = this.inspectionList.filter((i) => i !== ins);
        return;
      }
      if (!confirm('삭제하시겠습니까?')) return;
      try {
        await axios.post('/api/equipments/deleteInspection', {
          inspection_id: ins.inspection_id,
        });
        // 삭제 후 해당 행만 제거
        this.inspectionList = this.inspectionList.filter(
          (i) => i.inspection_id !== ins.inspection_id
        );
      } catch (err) {
        console.error(err);
      }
    },

    // 4) 장비 CRUD (기존)
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
        await axios.delete(
          `/api/equipments/${this.selected.equipment_code}`
        );
        await this.loadEquipments();
      } catch (err) {
        console.error(err);
      }
    },

    // 5) 유틸
    formatDate(val) {
      if (!val) return '';
      const d = new Date(val);
      const y = d.getFullYear();
      const m = String(d.getMonth() + 1).padStart(2, '0');
      const day = String(d.getDate()).padStart(2, '0');
      return `${y}-${m}-${day}`;
    },
  },
};
</script>

<style scoped>
.table-hover tbody tr:hover {
  background-color: #f8f9fa;
}
.sticky-top th {
  position: sticky;
  top: 0;
  background: #fff;
  z-index: 10;
}
</style>
