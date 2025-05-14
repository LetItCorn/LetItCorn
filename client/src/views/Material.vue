<!-- src/views/Material.vue -->
<template>
  <!-- 전체 화면 컨테이너 -->
  <div class="container-fluid vh-100 py-3 d-flex flex-column">
    <!-- 1) 상단 조회·필터 바 -->
    <div class="row mb-3">
      <div class="col-12">
        <div class="card">
          <div class="card-body d-flex align-items-center">
            <div class="ms-auto d-flex align-items-center">
              <!-- 필터 타입 선택 (자재코드 or 자재명) -->
              <select
                v-model="searchType"                  
                class="form-select form-select-sm me-2"
                style="width:140px"
              >
                <option value="">[선택 없음]</option>
                <option value="code">자재코드</option>
                <option value="name">자재명</option>
              </select>

              <!-- 검색어 입력창 -->
              <input
                v-model="searchValue"                 
                :placeholder="filterPlaceholder"      
                class="form-control form-control-sm me-2"
                style="width:200px"
              />

              <!-- 조회 버튼 -->
              <button
                @click="loadMaterials"                
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

    <!-- 3) 리스트 / 상세 영역 -->
    <div class="row flex-grow-1 gx-3">
      <!-- 3-1) 좌측: 자재 리스트 -->
      <div class="col-md-7 h-100">
        <div class="card h-100">
          <div class="card-header">자재 리스트</div>
          <div class="card-body p-0 overflow-auto">
            <table class="table table-hover table-sm mb-0">
              <thead class="thead-light sticky-top">
                <tr>
                  <th>자재코드</th>
                  <th>자재명</th>
                  <th>단위</th>
                  <th>단가</th>
                  <th>안전재고</th>
                </tr>
              </thead>
              <tbody>
                <!-- materialList 반복 렌더링 -->
                <tr
                  v-for="mat in materialList"
                  :key="mat.mater_code"                
                  @click="selectMaterial(mat)"         
                  :class="{ 'table-active': mat.mater_code === selected.mater_code }"
                  style="cursor:pointer"
                >
                  <td>{{ mat.mater_code }}</td>       <!-- 자재코드 -->
                  <td>{{ mat.mater_name }}</td>       <!-- 자재명 -->
                  <td>{{ mat.spec }}</td>             <!-- 단위 -->
                  <td>{{ mat.m_price }}</td>          <!-- 단가 -->
                  <td>{{ mat.safe_stock }}</td>       <!-- 안전재고 -->
                </tr>
                <!-- 데이터 없을 때 안내 -->
                <tr v-if="materialList.length === 0">
                  <td colspan="5" class="text-center py-4">데이터가 없습니다.</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <!-- 3-2) 우측: 자재 상세 정보 -->
      <div class="col-md-5 h-100">
        <div class="card h-100">
          <div class="card-header">자재 상세 정보</div>
          <div class="card-body overflow-auto">
            <form @submit.prevent class="d-flex flex-column gap-3">
              <!-- 자재코드 (읽기전용) -->
              <div class="mb-2">
                <label class="form-label">자재코드</label>
                <input
                  v-model="selected.mater_code"         
                  type="text"
                  class="form-control form-control-sm"
                  readonly                              
                />
              </div>
              <!-- 자재명 -->
              <div class="mb-2">
                <label class="form-label">자재명</label>
                <input
                  v-model="selected.mater_name"         
                  type="text"
                  class="form-control form-control-sm"
                />
              </div>
              <!-- 단위코드 선택 -->
              <div class="mb-2">
                <label class="form-label">단위</label>
                <select
                  v-model="selected.unit_code"         
                  class="form-select form-select-sm"
                >
                  <option value="">선택</option>
                  <option
                    v-for="unit in unitList"            
                    :key="unit.code_values"
                    :value="unit.code_values"
                  >
                    {{ unit.code_name }}                
                  </option>
                </select>
              </div>
              <!-- 단가 -->
              <div class="mb-2">
                <label class="form-label">단가</label>
                <input
                  v-model.number="selected.m_price"      
                  type="number"
                  class="form-control form-control-sm"
                />
              </div>
              <!-- 안전재고 -->
              <div class="mb-2">
                <label class="form-label">안전재고</label>
                <input
                  v-model.number="selected.safe_stock"  
                  type="number"
                  class="form-control form-control-sm"
                />
              </div>
              <!-- 액션 버튼 그룹 -->
              <div class="mt-auto d-flex gap-2">
                <button
                  type="button"
                  @click="clearDetail"                  
                  class="btn btn-outline-secondary flex-grow-1"
                >초기화</button>
                <button
                  type="button"
                  @click="onCreate"                     
                  class="btn btn-success flex-grow-1"
                >등록</button>
                <button
                  type="button"
                  @click="onDelete"                     
                  class="btn btn-danger flex-grow-1"
                  :disabled="!selected.mater_code"       
                >삭제</button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  name: 'Material',
  data() {
    return {
      // 1) 검색 필터
      searchType: '',              // 'code' or 'name'
      searchValue: '',             // 검색어

      // 2) 데이터 목록
      materialList: [],            // 자재 목록
      unitList: [],                // 단위 코드 목록

      // 3) 선택된 자재 (초기 상태는 빈 객체)
      selected: {
        mater_code: '',            // 자재코드
        mater_name: '',            // 자재명
        unit_code: '',             // 단위코드
        m_price: null,             // 단가
        safe_stock: null,          // 안전재고
        current_stock: null,       // 현재재고 (사용 시)
        spec: ''                   // 규격 (사용 시)
      }
    };
  },
  computed: {
    // materialList 길이 표시
    count() {
      return this.materialList.length;
    },
    // 검색창 placeholder 설정
    filterPlaceholder() {
      if (this.searchType === 'code') return '자재코드';
      if (this.searchType === 'name') return '자재명';
      return '';
    }
  },
  created() {
    // 컴포넌트 생성 시 목록/코드 조회
    this.loadMaterials();
    this.loadUnitCodes();
  },
  methods: {
    // 자재 목록 조회 (전체 or 필터)
    async loadMaterials() {
      const params = {};
      if (this.searchType === 'code') params.code = this.searchValue;
      if (this.searchType === 'name') params.name = this.searchValue;
      try {
        const res = await axios.get('/api/materialmains', { params });
        this.materialList = res.data;   // 응답 바인딩
        this.clearDetail();             // 상세 초기화
      } catch (err) {
        console.error('loadMaterials error', err);
        this.materialList = [];
      }
    },
    // 단위 코드 목록 조회 (common_codes UU)
    async loadUnitCodes() {
      try {
        const res = await axios.get('/api/materialmains/unitCode');
        this.unitList = res.data;       // unitList에 할당
      } catch (err) {
        console.error('loadUnitCodes error', err);
        this.unitList = [];
      }
    },
    // 검색 필터 초기화 및 재조회
    resetFilter() {
      this.searchType = '';
      this.searchValue = '';
      this.loadMaterials();
    },
    // 리스트 클릭 시 상세 객체에 복사
    selectMaterial(mat) {
      this.selected = { ...mat };       // 객체 복사
    },
    // 상세 폼 초기값으로 모두 리셋
    clearDetail() {
      this.selected = {
        mater_code: '',    // ← 빈 값으로 두면 서버가 자동 발번
        mater_name: '',
        spec: '',
        unit_code: '',
        m_price: 0,
        safe_stock: 0,
        current_stock: 0
      };
    },
    // 등록/수정 (MERGE)
    async onCreate() {
      if (!this.selected.mater_name) {
        alert('자재명을 입력하세요.');
        return;
      }
      try {
        await axios.post('/api/materialmains', this.selected);
        await this.loadMaterials();      // 저장 후 목록 갱신
      } catch (err) {
        console.error('onCreate error', err);
      }
    },
    // 삭제
    async onDelete () {
  if (!this.selected.mater_code) {
    alert('먼저 삭제할 행을 선택하세요!');
    return;                     // 행 미선택 → 바로 종료
  }

  if (!confirm('정말 삭제하시겠습니까?')) return;

  try {
    await axios.delete(`/api/materialmains/${this.selected.mater_code}`);
    await this.loadMaterials(); // 목록 새로고침
    this.clearDetail();         // 상세 영역 비우기
  } catch (err) {
    console.error('onDelete error', err);
    alert('삭제 중 오류가 발생했습니다');
  }
}
  }
};
</script>

<style scoped>
/* 테이블 헤더 고정 */
.sticky-top th {
  position: sticky;
  top: 0;
  background: white;
  z-index: 10;
}
/* 선택된 행 하이라이트 */
.table-active {
  background-color: #d0ebff;
}
/* 호버 시 효과 */
.table-hover tbody tr:hover {
  background-color: #f8f9fa;
}
</style>
