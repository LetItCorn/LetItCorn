<!-- src/views/CommonCode.vue -->
<template>
  <div class="container-fluid py-3">
    <!-- ───────── 1) 상단 조회/필터 바 ───────── -->
    <div class="row mb-3">
      <div class="col-12">
        <div class="card">
          <div class="card-body d-flex align-items-center">
            <div class="ms-auto d-flex align-items-center">
              <!-- 🔍 필터 선택 -->
              <select v-model="searchType" class="form-control form-control-sm me-2" style="width:140px">
                <option value="">[전체]</option>
                <option value="group">그룹코드</option>
                <option value="rear">하위코드</option>
                <option value="name">코드명</option>
                <option value="useYn">사용여부</option>
              </select>
              <!-- 🔎 입력 -->
              <input v-model="searchValue" :placeholder="filterPlaceholder"
                     class="form-control form-control-sm me-2" style="width:200px" />
              <button @click="loadCodes"  class="btn btn-sm btn-primary me-2" style="width:80px;">조회</button>
              <button @click="resetFilter" class="btn btn-sm btn-outline-secondary" style="width:80px;">초기화</button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- ───────── 2) 리스트 & 상세 ───────── -->
    <div class="row" style="height:70vh;">
      <!-- ◀ 2‑1) 리스트 카드 -->
      <div class="col-md-8 h-100">
        <!-- 🟡 h-100 + flex-column → 세로 전체 사용 -->
        <div class="card h-100 d-flex flex-column">
          <!-- 카드 본문을 flex‑fill로 잡고, 안에서 overflow‑auto -->
          <div class="card-body p-0 flex-fill overflow-auto">
            <table class="table table-sm table-hover mb-0">
              <thead class="thead-light sticky-top">
                <tr>
                  <th>그룹</th><th>하위코드</th><th>코드명</th><th>사용여부</th><th>비고</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="code in codeList" :key="code.code_group + code.code_rear"
                    @click="selectCode(code)"
                    :class="{ 'table-active': isSelected(code) }"
                    style="cursor:pointer;">
                  <td>{{ code.code_group }}</td>
                  <td>{{ code.code_rear }}</td>
                  <td>{{ code.code_name }}</td>
                  <td>{{ code.use_yn }}</td>
                  <td>{{ code.comm_etc }}</td>
                </tr>
                <tr v-if="codeList.length === 0">
                  <td colspan="5" class="text-center py-4">데이터가 없습니다.</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <!-- ▶ 2‑2) 상세 카드 -->
      <div class="col-md-4 h-100">
        <!-- 🟡 좌측과 동일하게 h-100 설정 -->
        <div class="card h-100 d-flex flex-column">
          <!-- flex-fill + overflow-auto → 입력필드가 많아져도 스크롤 -->
          <div class="card-body d-flex flex-column flex-fill overflow-auto">
            <div>
              <div class="form-group mb-2">
                <label>그룹코드</label>
                <input v-model.trim="selected.code_group" maxlength="2"
                       placeholder="AA" class="form-control form-control-sm" />
              </div>
              <div class="form-group mb-2">
                <label>하위코드</label>
                <input v-model.trim="selected.code_rear" maxlength="2"
                       placeholder="01" class="form-control form-control-sm" />
              </div>
              <div class="form-group mb-2">
                <label>코드명</label>
                <input v-model="selected.code_name" class="form-control form-control-sm" />
              </div>
              <div class="form-group mb-2">
                <label>사용여부</label>
                <select v-model="selected.use_yn" class="form-control form-control-sm">
                  <option value="Y">Y</option>
                  <option value="N">N</option>
                </select>
              </div>
              <div class="form-group mb-2">
                <label>비고</label>
                <input v-model="selected.comm_etc" class="form-control form-control-sm" />
              </div>
              <div class="form-group mb-2">
                <label>코드값</label>
                <input v-model="selected.code_values" class="form-control form-control-sm" />
              </div>
            </div>

            <!-- 🟡 footer 버튼 영역: 카드 하단 고정 -->
            <div class="mt-auto d-flex justify-content-end pt-2 border-top">
              <button @click="clearDetail" class="btn btn-sm btn-outline-secondary me-2" style="width:80px;">초기화</button>
              <button @click="saveCode"  class="btn btn-sm btn-warning me-2" style="width:80px;">저장</button>
              <button @click="deleteCode" class="btn btn-sm btn-danger" style="width:80px;"
                      :disabled="!selected.code_group || !selected.code_rear">삭제</button>
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
  name: 'CommonCode',
  data() {
    return {
      searchType: '',
      searchValue: '',
      codeList: [],              // ▶ 리스트 데이터 (초기값 빈 배열)
      selected: {                // ▶ 상세 바인딩 객체
        code_group: '',
        code_rear: '',
        code_name: '',
        use_yn: 'Y',
        comm_etc: '',
        code_values: ''
      }
    };
  },
  computed: {
    /* 🔍 필터 placeholder 동적 변경 */
    filterPlaceholder() {
      return {
        group: '그룹코드',
        rear:  '하위코드',
        name:  '코드명',
        useYn: '사용여부(Y/N)'
      }[this.searchType] || '전체 조회';
    }
  },
  created() {
    this.loadCodes(); // 페이지 로드 시 초기 리스트
  },
  methods: {
    /** 🔄 공통코드 목록 조회 */
    async loadCodes() {
      const params = {
        group: this.searchType === 'group' ? this.searchValue : '',
        rear:  this.searchType === 'rear'  ? this.searchValue : '',
        name:  this.searchType === 'name'  ? this.searchValue : '',
        useYn: this.searchType === 'useYn' ? this.searchValue : ''
      };
      try {
        const { data } = await axios.get('/api/common_codes', { params });
        this.codeList = data || [];           // 에러 방지: undefined → []
      } catch (err) {
        console.error('loadCodes error:', err);
        this.codeList = [];
      }
    },
    /** 🔄 필터 초기화 */
    resetFilter() {
      this.searchType = '';
      this.searchValue = '';
      this.loadCodes();
    },
    /** ✔ 행 선택 */
    selectCode(code) {
      this.selected = { ...code };
    },
    /** 행 하이라이트 여부 */
    isSelected(code) {
      return code.code_group === this.selected.code_group &&
             code.code_rear  === this.selected.code_rear;
    },
    /** 🆕 상세 입력 초기화 */
    clearDetail() {
      this.selected = {
        code_group: '', code_rear: '', code_name: '',
        use_yn: 'Y', comm_etc: '', code_values: ''
      };
    },
    /** 💾 저장(신규/수정) */
    async saveCode() {
      if (!this.selected.code_group || !this.selected.code_rear) {
        alert('그룹·하위코드는 필수입니다.'); return;
      }
      try {
        await axios.post('/api/common_codes', this.selected);
        await this.loadCodes();
        alert('저장 완료');
      } catch (err) {
        console.error('saveCode error:', err);
        alert('저장 실패');
      }
    },
    /** 🗑️ 삭제 */
    async deleteCode() {
      const { code_group, code_rear } = this.selected;
      if (!confirm(`삭제하시겠습니까? (${code_group}-${code_rear})`)) return;
      try {
        await axios.delete(`/api/common_codes/${code_group}/${code_rear}`);
        await this.loadCodes();
        this.clearDetail();
        alert('삭제 완료');
      } catch (err) {
        console.error('deleteCode error:', err);
        alert('삭제 실패');
      }
    }
  }
};
</script>

<style scoped>
/* 🔹 리스트 선택 행 색상 */
.table-active { background-color:#d0ebff; }
</style>
