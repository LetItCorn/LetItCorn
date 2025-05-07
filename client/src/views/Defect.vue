<!-- src/views/Defect.vue -->
<template>
  <div class="container-fluid py-3 d-flex flex-column vh-100">
    <!-- 1) 상단 조회·필터 바 -->
    <div class="row mb-3">
      <div class="col-12">
        <div class="card">
          <div class="card-body d-flex align-items-center">
            <div class="ms-auto d-flex align-items-center">
              <!-- 검색 기준 선택 -->
              <select
                v-model="searchType"
                class="form-control form-control-sm me-2"
                style="width:120px"
              >
                <option value="">[선택 없음]</option>
                <option value="code">결함코드</option>
                <option value="type">유형</option>
                <option value="used">사용여부</option>
              </select>
              <!-- 검색어 입력 -->
              <input
                v-model="searchValue"
                :placeholder="filterPlaceholder"
                class="form-control form-control-sm me-2"
                style="width:200px"
              />
              <!-- 조회 버튼 -->
              <button
                @click="loadDefects"
                class="btn btn-sm btn-primary me-2"
                style="width:80px"
              >조회</button>
              <!-- 초기화 버튼 -->
              <button
                @click="resetFilter"
                class="btn btn-sm btn-outline-secondary"
                style="width:80px"
              >초기화</button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 2) 하단: 리스트(좌 2/3) / 상세(우 1/3) -->
    <div class="row flex-grow-1 gx-3">
      <!-- 2-1) 좌측: 결함코드 리스트 -->
      <div class="col-md-8 h-100">
        <div class="card h-100">
          <div class="card-header">결함코드 목록</div>
          <div class="card-body p-0 overflow-auto">
            <table class="table table-hover table-sm mb-0">
              <thead class="thead-light sticky-top">
                <tr>
                  <th>코드</th>
                  <th>유형</th>
                  <th>사용여부</th>
                  <th>생성일자</th>
                </tr>
              </thead>
              <tbody>
                <tr
                  v-for="def in defectList"
                  :key="def.defect_code"
                  @click="selectDefect(def)"
                  :class="{ 'table-active': def.defect_code === selected.defect_code }"
                  style="cursor:pointer"
                >
                  <td>{{ def.defect_code }}</td>
                  <td>{{ def.defect_type }}</td>
                  <td>{{ def.is_used }}</td>
                  <td>{{ formatDate(def.created_date) }}</td>
                </tr>
                <tr v-if="defectList.length === 0">
                  <td colspan="4" class="text-center py-4">
                    데이터가 없습니다.
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <!-- 2-2) 우측: 상세·CRUD -->
      <div class="col-md-4 h-100">
        <div class="card h-100">
          <div class="card-header">결함코드 상세</div>
          <div class="card-body overflow-auto d-flex flex-column">
            <!-- 상세 입력 폼 -->
            <div class="mb-2">
              <label class="form-label">결함코드</label>
              <!-- 신규 등록 시 입력, 수정 시 읽기전용 -->
              <input
                v-model="selected.defect_code"
                :readonly="!!selected.defect_code"
                class="form-control form-control-sm"
              />
            </div>
            <div class="mb-2">
              <label class="form-label">유형</label>
              <input
                v-model="selected.defect_type"
                class="form-control form-control-sm"
              />
            </div>
            <div class="mb-2">
              <label class="form-label">사용여부</label>
              <select
                v-model="selected.is_used"
                class="form-select form-select-sm"
              >
                <option value="Y">Y</option>
                <option value="N">N</option>
              </select>
            </div>
            <div class="mb-2">
              <label class="form-label">생성일자</label>
              <input
                v-model="selected.created_date"
                type="date"
                class="form-control form-control-sm"
              />
            </div>
            <!-- CRUD 버튼 그룹 -->
            <div class="mt-auto d-flex gap-2">
              <!-- 초기화 -->
              <button
                @click="clearDetail"
                class="btn btn-outline-secondary flex-grow-1"
              >초기화</button>
              <!-- 등록 -->
              <button
                @click="onCreate"
                class="btn btn-success flex-grow-1"
                :disabled="!selected.defect_code"
              >등록</button>
              <!-- 수정 -->
              <button
                @click="onUpdate"
                class="btn btn-warning flex-grow-1"
                :disabled="!hasSelection"
              >수정</button>
              <!-- 삭제 -->
              <button
                @click="onDelete"
                class="btn btn-danger flex-grow-1"
                :disabled="!hasSelection"
              >삭제</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
// Defect.vue
import axios from 'axios';

export default {
  name: 'Defect',
  data() {
    return {
      // 필터용
      searchType: '',
      searchValue: '',
      // 목록 데이터
      defectList: [],
      // 선택/입력용 객체
      selected: {
        defect_code: '',
        defect_type: '',
        is_used: 'Y',
        created_date: ''
      }
    };
  },
  computed: {
    // 검색창 placeholder
    filterPlaceholder() {
      switch (this.searchType) {
        case 'code': return '결함코드';
        case 'type': return '유형';
        case 'used': return 'Y/N';
        default:     return '';
      }
    },
    // 수정/삭제 활성화 여부
    hasSelection() {
      return !!this.selected.defect_code;
    }
  },
  created() {
    // 컴포넌트 로드 시 전체 목록 호출
    this.loadDefects();
  },
  methods: {
    /** 결함코드 목록 조회 (필터 적용) */
    async loadDefects() {
      const params = {
        code: this.searchType === 'code' ? this.searchValue : '',
        type: this.searchType === 'type' ? this.searchValue : '',
        used: this.searchType === 'used' ? this.searchValue : ''
      };
      try {
        const res = await axios.get('/api/defect_codes', { params });
        this.defectList = res.data;
        this.clearDetail();
      } catch (err) {
        console.error('loadDefects error', err);
        this.defectList = [];
      }
    },
    /** 필터 초기화 */
    resetFilter() {
      this.searchType = '';
      this.searchValue = '';
      this.loadDefects();
    },
    /** 리스트 행 클릭 시 상세 바인딩 */
    selectDefect(defect) {
      this.selected = { ...defect };
    },
    /** 상세 입력창 초기화 */
    clearDetail() {
      this.selected = {
        defect_code: '',
        defect_type: '',
        is_used: 'Y',
        created_date: ''
      };
    },
    /** 신규 등록 */
    async onCreate() {
      try {
        await axios.post('/api/defect_codes', this.selected);
        await this.loadDefects();
      } catch (err) {
        console.error('onCreate error', err);
      }
    },
    /** 수정 */
    async onUpdate() {
      if (!this.hasSelection) return;
      try {
        await axios.put(
          `/api/defect_codes/${this.selected.defect_code}`,
          this.selected
        );
        await this.loadDefects();
      } catch (err) {
        console.error('onUpdate error', err);
      }
    },
    /** 삭제 */
    async onDelete() {
      if (!this.hasSelection) return;
      try {
        await axios.delete(
          `/api/defect_codes/${this.selected.defect_code}`
        );
        await this.loadDefects();
      } catch (err) {
        console.error('onDelete error', err);
      }
    },
    /** 날짜 포맷터 (YYYY-MM-DD) */
    formatDate(val) {
      if (!val) return '';
      const d = new Date(val);
      const y = d.getFullYear();
      const m = String(d.getMonth() + 1).padStart(2, '0');
      const day = String(d.getDate()).padStart(2, '0');
      return `${y}-${m}-${day}`;
    }
  }
};
</script>

<style scoped>
.sticky-top th {
  position: sticky;
  top: 0;
  background: white;
}
.table-hover tbody tr:hover {
  background-color: #f8f9fa;
}
</style>
