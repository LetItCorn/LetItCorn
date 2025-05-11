<style scoped>
.selected {
  background-color: #d0ebff; /* 연한 하늘색 */
}
</style>

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
                class="form-control form-control-sm me-2 border"
                style="width:120px"
              >
                <option value="">[선택 없음]</option>
                <option value="code">품목코드</option>
                <option value="name">품목명</option>
                <option value="type">구분</option>
              </select>
              <!-- 필터 입력 -->
              <input
                v-model="searchValue"
                :placeholder="filterPlaceholder"
                class="form-control form-control-sm me-2 border"
                style="width:200px"
              />

              <!-- 조회 버튼 -->
              <button @click="loadItems" class="btn btn-sm btn-primary me-2" style="width:80px;">
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
      <!-- 2-1) 좌측: 품목 리스트 -->
      <div class="col-md-8">
        <div class="card h-100">
          <div class="card-body p-0 overflow-auto">
            <table class="table table-sm table-hover mb-0">
              <thead class="thead-light sticky-top">
                <tr>
                  <th>품목코드</th>
                  <th>품목명</th>
                  <th>구분</th>
                  <th>수량</th>
                  <th>단위</th>
                </tr>
              </thead>
              <tbody>
                <!-- 리스트 반복 렌더링 -->
                <tr
                  v-for="item in itemList"
                  :key="item.item_code"
                  @click="selectItem(item)"
                  :class="{'table-active': item.item_code === selected.item_code}"
                  style="cursor:pointer"
                >
                  <td>{{ item.item_code }}</td>
                  <td>{{ item.item_name }}</td>
                  <td>{{ item.type_name }}</td>
                  <td>{{ item.qty }}</td>
                  <td>{{ item.spec }}</td>
                </tr>
                <!-- 데이터 없을 때 -->
                <tr v-if="itemList.length === 0">
                  <td colspan="5" class="text-center py-4">데이터가 없습니다.</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <!-- 2-2) 우측: 상세 + 공정 -->
      <div class="col-md-4 d-flex flex-column h-100">
        <!-- 품목 상세 카드 -->
        <div class="card flex-fill mb-2">
          <div class="card-body d-flex flex-column">
            <div class="form-row flex-fill">
              <!-- 품목코드 (읽기전용) -->
              <div class="form-group col-6">
                <label>품목코드</label>
                <input
                  v-model="selected.item_code"
                  class="form-control form-control-sm"
                  readonly
                />
              </div>
              <!-- 품목명 -->
              <div class="form-group col-6">
                <label>품목명</label>
                <input v-model="selected.item_name" class="form-control form-control-sm" />
              </div>
              <!-- 구분 -->
              <div class="form-group col-6">
                <label>구분</label>
                  <select v-model="selected.item_type" class="form-control form-control-sm">
                  <option disabled value="">-- 선택하세요 --</option>
                  <option
                    v-for="code in codeList"
                    :key="code.code_values"
                    :value="code.code_values"
                  >
                    {{ code.code_name }}
                  </option>
                </select>

              </div>
              <!-- 수량 -->
              <div class="form-group col-6">
                <label>수량</label>
                <input v-model="selected.qty" class="form-control form-control-sm" />
              </div>
              <!-- 단위 -->
              <div class="form-group col-6">
                <label>구분</label>
                  <select v-model="selected.unit_code" class="form-control form-control-sm">
                  <option disabled value="">-- 선택하세요 --</option>
                  <option
                    v-for="unit in unitList"
                    :key="unit.code_values"
                    :value="unit.code_values"
                  >
                    {{ unit.code_name }}
                  </option>
                </select>

              </div>
            </div>
            <div class="mt-auto d-flex justify-content-end">
              <!-- 초기화: 신규 등록용 기본값 세팅 -->
              <button @click="clearDetail" class="btn btn-sm btn-outline-secondary mr-2" style="width:80px;">
                초기화
              </button>
              <!-- 등록/수정 병합 버튼 (머지문 사용) -->
              <button @click="saveItem" class="btn btn-sm btn-warning mr-2" style="width:80px;">
                등록
              </button>
              <!-- 삭제 -->
              <button @click="deleteItem" class="btn btn-sm btn-danger" style="width:80px;">
                삭제
              </button>
            </div>
          </div>
        </div>

        <!-- 공정 흐름 카드 -->
        <div class="card" style="height: 45%;">
          <div class="card-header d-flex justify-content-between align-items-center">
            <span>공정 흐름</span>
            <div>
              <button @click="addProcessFlow">추가</button>
              <button @click="deleteProcessItem">삭제</button>
              <button @click="saveProcessFlows">저장</button>
            </div>
          </div>
          <div class="card-body p-3 overflow-auto">
            <table class="table table-sm table-bordered text-center mb-0">
              <thead class="thead-light">
                <tr>
                  <th style="width: 10%;">순서</th>
                  <th style="width: 60%;">공정 선택</th>
                  <th style="width: 30%;">소요시간</th>
                </tr>
              </thead>
              <tbody>
                <!-- 공정 흐름 리스트 반복 -->
                <template v-if="itemProcessFlowsList.length > 0">
                  <tr
                    v-for="group in itemProcessFlowsList"
                    :key="group.sequence_order"
                    :class="{ selected: selectedSeq === group.sequence_order }"
                    @click="selectProcessItemFunc(group)"
                  >
                  <!-- 기존 흐름 행 -->
                    <template v-if="!group.isAdding">
                      <td>{{ group.sequence_order }}</td>
                      <td>{{ group.process_name }}</td>
                      <td>
                        <input
                        :value="`${group.duration_min}분`"
                        class="form-control form-control-sm text-center mb-1 no-gray"
                        readonly
                      />
                      </td>
                    </template>
                    <!-- 새로 추가 중인 빈 행 -->
                    <template v-else>
                      <td>{{ group.sequence_order }}</td>
                      <td>
                        <select v-model="group.process_code" @change="handleProcessSelect(group)">
                          <option value="">-- 선택하세요 --</option>
                          <option
                            v-for="item in processesListArr"
                            :key="item.process_code"
                            :value="item.process_code"
                          >
                            {{ item.process_name }}
                          </option>
                        </select>
                      </td>
                      <td>
                       
                      </td>
                    </template>
                  </tr>
                </template>
                <!-- 공정 흐름 없을 때 -->
                <tr v-else>
                  <td colspan="3" class="text-center">등록된 공정이 없습니다.</td>
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
  name: 'Item',
  data() {
    return {
      // 검색 필터
      searchType: '',
      searchValue: '',
      // 메인 데이터
      itemList: [],
      codeList: [],
      unitList: [],
      // 선택된 품목의 공정 흐름
      itemProcessFlowsList: [],
      // 전체 공정 목록 (설렉트 옵션)
      processesListArr: [],
      // 현재 선택된/편집 중인 품목
      selected: {
        item_code: '',
        item_name: '',
        item_type: '',
        qty: '',
        spec: ''
      },
      // 공정 흐름에서 선택된 행
      selectedSeq: null,
      selectProcessItem: {}
    };
  },
  computed: {
    // 필터 박스 placeholder 결정
    filterPlaceholder() {
      switch (this.searchType) {
        case 'code': return '품목코드';
        case 'name': return '품목명';
        case 'type': return '구분';
        default: return '';
      }
    }
  },

  // 컴포넌트 생성 시 초기 데이터 로드
  async created() {
    await this.loadItems();
    await this.processesList();
    await this.itemCode();
    await this.unitCode();
  },

  methods: {
    // 1) 품목 리스트 조회 + 필터 적용
    async loadItems() {
      const params = {
        code: this.searchType === 'code' ? this.searchValue : '',
        name: this.searchType === 'name' ? this.searchValue : '',
        type: this.searchType === 'type' ? this.searchValue : ''
      };
      try {
        const res = await axios.get('/api/items', { params });
        this.itemList = res.data;
      } catch {
        this.itemList = [];
      } finally {
        // 목록 갱신 후 신규 등록용 초기화
        this.clearDetail();
      }
    },

    // 품목구분 가져오기
    async itemCode() {
      try{
        const res = await axios.get('/api/items/itemCode');
        this.codeList = res.data;
        console.log(this.codeList);
      } catch {
        this.codeList = [];
      }
    },

    // 단위코드 가져오기
    async unitCode() {
      try {
        const res = await axios.get('/api/items/unitCode');
        this.unitList = res.data;
        console.log(this.unitList);
      }catch {
        this.unitList = [];
      }
    },

    // 필터 초기화
    resetFilter() {
      this.searchType = '';
      this.searchValue = '';
      this.loadItems();
    },

    // 리스트 행 클릭 -> 상세 데이터 바인딩 + 공정 흐름 로드
    selectItem(item) {
      this.selected = { ...item };
      this.fetchProcessFlows(item.item_code);
    },

    // 신규 등록 혹은 초기화: 자동 코드 생성 포함
    clearDetail() {
      // 자동 코드 생성
      let nextNum = 1;
      if (this.itemList.length) {
        // 기존 코드에서 숫자 부분만 추출해 최대값 구함
        const nums = this.itemList.map(i => {
          const n = parseInt(i.item_code.replace(/^ITM/, ''), 10);
          return isNaN(n) ? 0 : n;
        });
        nextNum = Math.max(...nums) + 1;
      }
      // 'ITM' + 3자리 숫자 포맷
      const nextCode = 'ITM' + String(nextNum).padStart(3, '0');
      this.selected = {
        item_code: nextCode,
        item_name: '',
        item_type: '',
        unit_code: '',
        spec: '',
        qty: ''
      };
      this.itemProcessFlowsList = [];
    },

    // 2) 등록/수정(머지문으로 처리) 호출
    async saveItem() {
      try {
        // MERGE 구문을 사용하는 POST /api/items 엔드포인트 호출
        await axios.post('/api/items', this.selected);
        // 저장 후 목록 갱신
        await this.loadItems();
      } catch (err) {
        console.error('saveItem error', err);
      }
    },

    // 3) 품목 삭제
    async deleteItem() {
      if (!this.selected.item_code) return; // 삭제할 item_code가 비어 있으면 아무것도 하지 않고 함수를 빠져나감
      try {
        await axios.delete(`/api/items/${this.selected.item_code}`);
        await this.loadItems();
      } catch (err) {
        console.error('deleteItem error', err);
      }
    },

    // 4) 선택된 품목의 공정 흐름 조회
    async fetchProcessFlows(code) {
      try {
        const res = await axios.get(`/api/items/itemProcessFlowsList/${code}`);
        this.itemProcessFlowsList = res.data;
      } catch {
        this.itemProcessFlowsList = [];
      }
    },

    // 5) 공정 흐름 추가 (빈 행)
    addProcessFlow() {
      const nextSeq = this.itemProcessFlowsList.length
        ? Math.max(...this.itemProcessFlowsList.map(f => Number(f.sequence_order))) + 1
        : 1;
      this.itemProcessFlowsList.push({
        sequence_order: nextSeq,
        process_header: '',
        item_code: this.selected.item_code,
        isAdding: true,
        duration_min: ''
      });
    },

    // 6) 공정 흐름 저장 (트랜잭션 처리)
    async saveProcessFlows() {
      try {
        console.log(this.itemProcessFlowsList);
        await axios.post('/api/saveProcessFlows', { flows: this.itemProcessFlowsList });
        this.fetchProcessFlows(this.selected.item_code);
      } catch (err) {
        console.error('saveProcessFlows error', err);
      }
    },

    // 7) 공정 흐름 행 삭제
    async deleteProcessItem() {
      if (!this.selectProcessItem.sequence_order) return;
      try {
        await axios.post('/api/items/deleteProcessItem', this.selectProcessItem);
        this.fetchProcessFlows(this.selected.item_code);
      } catch {}
    },

    // 8) 전체 공정 목록 조회 (셀렉트 옵션)
    async processesList() {
      try {
        const res = await axios.get('/api/items/processesList');
        this.processesListArr = res.data;
      } catch {
        this.processesListArr = [];
      }
    },

    // 공정 선택 콜백 (현재 사용 안함)
    handleProcessSelect(group) {
      // noop
    },

    // 공정 흐름 테이블에서 행 선택
    selectProcessItemFunc(group) {
      this.selectedSeq = group.sequence_order;
      this.selectProcessItem = group;
    }
  }
};
</script>
