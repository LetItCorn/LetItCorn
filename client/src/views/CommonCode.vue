<!-- src/views/CommonCode.vue -->
<template>
  <div class="container-fluid py-3">
    <!-- 1) 상단 조회·필터 바 -->
    <div class="row mb-3">
      <div class="col-12">
        <div class="card">
          <div class="card-body d-flex align-items-center">
            <div class="ms-auto d-flex align-items-center">
              <!-- 필터 유형 선택 -->
              <select
                v-model="searchType"
                class="form-control form-control-sm me-2"
                style="width:140px"
              >
                <option value="">[전체]</option>
                <option value="group">그룹코드</option>
                <option value="rear">하위코드</option>
                <option value="name">코드명</option>
                <option value="useYn">사용여부</option>
              </select>
              <!-- 필터 입력 -->
              <input
                v-model="searchValue"
                :placeholder="filterPlaceholder"
                class="form-control form-control-sm me-2"
                style="width:200px"
              />

              <!-- 조회 버튼 -->
              <button @click="loadCodes" class="btn btn-sm btn-primary me-2" style="width:80px;">
                조회
              </button>
              <!-- 초기화 버튼 -->
              <button @click="resetFilter" class="btn btn-sm btn-outline-secondary" style="width:80px;">
                초기화
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 2) 하단: 리스트(좌) / 상세(우) -->
    <div class="row" style="height: 70vh;">
      <!-- 2-1) 좌측: 공통코드 리스트 -->
      <div class="col-md-8">
        <div class="card h-100">
          <div class="card-body p-0 overflow-auto">
            <table class="table table-sm table-hover mb-0">
              <thead class="thead-light sticky-top">
                <tr>
                  <th>그룹</th>
                  <th>하위코드</th>
                  <th>코드명</th>
                  <th>사용여부</th>
                  <th>비고</th>
                </tr>
              </thead>
              <tbody>
                <tr
                  v-for="code in codeList"
                  :key="code.code_group + code.code_rear"
                  @click="selectCode(code)"
                  :class="{ 'table-active': isSelected(code) }"
                  style="cursor:pointer"
                >
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

      <!-- 2-2) 우측: 상세 -->
      <div class="col-md-4 d-flex flex-column h-100">
        <div class="card flex-fill">
          <div class="card-body d-flex flex-column">
            <div class="form-row flex-fill">
              <div class="form-group mb-2">
                <label>그룹코드</label>
                <input
                  v-model="selected.code_group"
                  class="form-control form-control-sm"
                  readonly
                />
              </div>
              <div class="form-group mb-2">
                <label>하위코드</label>
                <input
                  v-model="selected.code_rear"
                  class="form-control form-control-sm"
                  readonly
                />
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
            <div class="mt-auto d-flex justify-content-end">
              <!-- 초기화: 신규 입력용 -->
              <button @click="clearDetail" class="btn btn-sm btn-outline-secondary me-2" style="width:80px;">
                초기화
              </button>
              <!-- 등록/수정 병합 버튼 -->
              <button @click="saveCode" class="btn btn-sm btn-warning me-2" style="width:80px;">
                저장
              </button>
              <!-- 삭제 -->
              <button @click="deleteCode" class="btn btn-sm btn-danger" style="width:80px;">
                삭제
              </button>
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
      codeList: [],
      selected: {
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
    filterPlaceholder() {
      switch (this.searchType) {
        case 'group': return '그룹코드';
        case 'rear': return '하위코드';
        case 'name': return '코드명';
        case 'useYn': return '사용여부(Y/N)';
        default: return '전체 조회';
      }
    }
  },
  created() {
    this.loadCodes();
  },
  methods: {
    async loadCodes() {
      const params = {
        group: this.searchType === 'group' ? this.searchValue : '',
        rear:  this.searchType === 'rear'  ? this.searchValue : '',
        name:  this.searchType === 'name'  ? this.searchValue : '',
        useYn: this.searchType === 'useYn' ? this.searchValue : ''
      };
      try {
        const res = await axios.get('/api/common_codes', { params });
        this.codeList = res.data;
      } catch {
        this.codeList = [];
      } finally {
        this.clearDetail();
      }
    },
    resetFilter() {
      this.searchType = '';
      this.searchValue = '';
      this.loadCodes();
    },
    selectCode(code) {
      this.selected = { ...code };
    },
    isSelected(code) {
      return code.code_group === this.selected.code_group &&
             code.code_rear === this.selected.code_rear;
    },
    clearDetail() {
      // 빈값 또는 기본값 세팅
      this.selected = {
        code_group: '',
        code_rear: '',
        code_name: '',
        use_yn: 'Y',
        comm_etc: '',
        code_values: ''
      };
    },
    async saveCode() {
      try {
        // upsert
        await axios.post('/api/common_codes', this.selected);
        await this.loadCodes();
      } catch (err) {
        console.error('saveCode error:', err);
      }
    },
    async deleteCode() {
      if (!this.selected.code_group || !this.selected.code_rear) return;
      try {
        await axios.delete(
          `/api/common_codes/${this.selected.code_group}/${this.selected.code_rear}`
        );
        await this.loadCodes();
      } catch (err) {
        console.error('deleteCode error:', err);
      }
    }
  }
};
</script>

<style scoped>
.table-active {
  background-color: #d0ebff;
}
</style>
