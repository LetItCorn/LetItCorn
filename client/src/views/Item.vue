<!-- src/views/Item.vue -->
<template>
  <div class="container-fluid py-3">
    <!-- 1) 상단 조회·필터 바 -->
    <div class="row mb-3">
      <div class="col-12">
        <div class="card">
          <div class="card-body d-flex align-items-center">
            <div class="ms-auto d-flex align-items-center">
              <!-- 필터 유형 -->
              <select v-model="searchType"
                      class="form-control form-control-sm me-2 border"
                      style="width:120px">
                <option value="">[선택 없음]</option>
                <option value="code">품목코드</option>
                <option value="name">품목명</option>
                <option value="type">구분</option>
              </select>
              <!-- 필터 값 -->
              <input v-model="searchValue"
                     :placeholder="filterPlaceholder"
                     class="form-control form-control-sm me-2 border"
                     style="width:200px" />
              <!-- 버튼 -->
              <button @click="loadItems"
                      class="btn btn-sm btn-primary me-2"
                      style="width:80px">조회</button>
              <button @click="resetFilter"
                      class="btn btn-sm btn-outline-secondary"
                      style="width:80px">초기화</button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 2) 하단 좌우 영역(70vh 고정) -->
    <div class="row" style="height:70vh;">
      <!-- 2-1) 리스트 카드 -->
      <div class="col-md-8 h-100 d-flex flex-column">
        <div class="card list-card flex-fill">
          <div class="card-header py-2"><strong>품목 리스트</strong></div>
          <div class="card-body p-0 list-scroll flex-grow-1">
            <table class="table table-sm table-hover mb-0">
              <thead>
                <tr>
                  <th>품목코드</th>
                  <th>품목명</th>
                  <th>구분</th>
                  <th>수량</th>
                  <th>단위</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="item in itemList"
                    :key="item.item_code"
                    :class="{ 'table-active': item.item_code === selected.item_code }"
                    @click="selectItem(item)"
                    style="cursor:pointer">
                  <td>{{ item.item_code }}</td>
                  <td>{{ item.item_name }}</td>
                  <td>{{ item.type_name }}</td>
                  <td>{{ item.qty }}</td>
                  <td>{{ item.spec }}</td>
                </tr>
                <tr v-if="itemList.length === 0">
                  <td colspan="5" class="text-center py-4">데이터가 없습니다.</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <!-- 2-2) 상세 + 공정 -->
      <div class="col-md-4 h-100 d-flex flex-column">
        <!-- 상세 카드 -->
        <div class="card flex-fill mb-2 d-flex flex-column">
          <div class="card-header py-2"><strong>품목 상세</strong></div>
          <div class="card-body d-flex flex-column">
            <div class="row gx-2 gy-2 flex-fill">
              <!-- 코드 -->
              <div class="col-6">
                <label class="form-label mb-1">품목코드</label>
                <input v-model="selected.item_code"
                       class="form-control form-control-sm"
                       readonly />
              </div>
              <!-- 이름 -->
              <div class="col-6">
                <label class="form-label mb-1">품목명</label>
                <input v-model="selected.item_name"
                       class="form-control form-control-sm" />
              </div>
              <!-- 구분 -->
              <div class="col-6">
                <label class="form-label mb-1">구분</label>
                <select v-model="selected.item_type"
                        class="form-control form-control-sm">
                  <option disabled value="">-- 선택하세요 --</option>
                  <option v-for="code in codeList"
                          :key="code.code_values"
                          :value="code.code_values">
                    {{ code.code_name }}
                  </option>
                </select>
              </div>
              <!-- 수량 -->
              <div class="col-6">
                <label class="form-label mb-1">수량</label>
                <input v-model="selected.qty"
                       class="form-control form-control-sm" />
              </div>
              <!-- 단위 -->
              <div class="col-6">
                <label class="form-label mb-1">단위</label>
                <select v-model="selected.unit_code"
                        class="form-control form-control-sm">
                  <option disabled value="">-- 선택하세요 --</option>
                  <option v-for="unit in unitList"
                          :key="unit.code_values"
                          :value="unit.code_values">
                    {{ unit.code_name }}
                  </option>
                </select>
              </div>
            </div>

            <!-- 버튼 -->
            <div class="mt-auto text-end pt-2">
              <button @click="clearDetail"
                      class="btn btn-sm btn-outline-secondary me-2"
                      style="width:80px">초기화</button>
              <button @click="saveItem"
                      class="btn btn-sm btn-warning me-2"
                      style="width:80px">등록</button>
              <button @click="deleteItem"
                      class="btn btn-sm btn-danger"
                      style="width:80px">삭제</button>
            </div>
          </div>
        </div>

        <!-- 공정 흐름 카드 -->
        <div class="card" style="height:45%;">
          <div class="card-header py-2 d-flex justify-content-between align-items-center">
            <span>공정 흐름</span>
            <div class="btn-group btn-group-sm">
              <button class="btn btn-outline-primary" @click="addProcessFlow">추가</button>
              <button class="btn btn-outline-danger"  @click="deleteProcessItem">삭제</button>
              <button class="btn btn-outline-success" @click="saveProcessFlows">저장</button>
            </div>
          </div>
          <div class="card-body p-0 overflow-auto">
            <table class="table table-sm table-bordered text-center mb-0">
              <thead>
                <tr>
                  <th style="width:10%;">순서</th>
                  <th style="width:60%;">공정</th>
                  <th style="width:30%;">소요시간</th>
                </tr>
              </thead>
              <tbody>
                <template v-if="itemProcessFlowsList.length">
                  <tr v-for="group in itemProcessFlowsList"
                      :key="group.sequence_order"
                      :class="{ selected: selectedSeq === group.sequence_order }"
                      @click="selectProcessItemFunc(group)">
                    <template v-if="!group.isAdding">
                      <td>{{ group.sequence_order }}</td>
                      <td>{{ group.process_name }}</td>
                      <td>
                        <input :value="`${group.duration_min}분`"
                               class="form-control form-control-sm text-center no-gray" readonly />
                      </td>
                    </template>
                    <!-- 추가 행 -->
                    <template v-else>
                      <td>{{ group.sequence_order }}</td>
                      <td>
                        <select v-model="group.process_code"
                                @change="handleProcessSelect(group)">
                          <option value="">-- 선택하세요 --</option>
                          <option v-for="p in processesListArr"
                                  :key="p.process_code"
                                  :value="p.process_code">
                            {{ p.process_name }}
                          </option>
                        </select>
                      </td>
                      <td></td>
                    </template>
                  </tr>
                </template>
                <tr v-else>
                  <td colspan="3" class="text-center">등록된 공정이 없습니다.</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div><!-- 우측 끝 -->
    </div><!-- row -->
  </div>
</template>

<script>
import axios from 'axios';

export default {
  name: 'Item',
  data() {
    return {
      /* ───────── 검색/필터 ───────── */
      searchType: '',
      searchValue: '',
      /* ───────── 리스트 & 코드 ───────── */
      itemList: [],
      codeList: [],
      unitList: [],
      /* ───────── 공정 ───────── */
      itemProcessFlowsList: [],
      processesListArr: [],
      /* ───────── 선택 항목 ───────── */
      selected: {
        item_code: '',
        item_name: '',
        item_type: '',
        qty: '',
        spec: ''
      },
      selectedSeq: null,
      selectProcessItem: {}
    };
  },
  computed: {
    filterPlaceholder() {
      switch (this.searchType) {
        case 'code': return '품목코드';
        case 'name': return '품목명';
        case 'type': return '구분';
        default: return '';
      }
    }
  },
  async created() {
    await this.loadItems();          // 초기 품목 로드
    await this.processesList();      // 전체 공정 목록
    await this.itemCode();           // 구분 코드
    await this.unitCode();           // 단위 코드
  },
  methods: {
    /* ──────────────────────────── 품목 관련 ──────────────────────────── */
    async loadItems() {
      const params = {
        code: this.searchType === 'code' ? this.searchValue : '',
        name: this.searchType === 'name' ? this.searchValue : '',
        type: this.searchType === 'type' ? this.searchValue : ''
      };
      try {
        const res = await axios.get('/api/items', { params });
        this.itemList = res.data;
      } catch (err) {
        console.error('loadItems error', err);
        this.itemList = [];
      } finally {
        this.clearDetail();
      }
    },
    async itemCode() {
      try {
        const res = await axios.get('/api/items/itemCode');
        this.codeList = res.data;
      } catch (err) {
        console.error('itemCode error', err);
        this.codeList = [];
      }
    },
    async unitCode() {
      try {
        const res = await axios.get('/api/items/unitCode');
        this.unitList = res.data;
      } catch (err) {
        console.error('unitCode error', err);
        this.unitList = [];
      }
    },
    resetFilter() {
      this.searchType = '';
      this.searchValue = '';
      this.loadItems();
    },
    selectItem(item) {
      this.selected = { ...item };
      this.fetchProcessFlows(item.item_code);
    },
    clearDetail() {
      let nextNum = 1;
      if (this.itemList.length) {
        const nums = this.itemList.map(i =>
          parseInt(i.item_code.replace(/^ITM/, ''), 10) || 0
        );
        nextNum = Math.max(...nums) + 1;
      }
      this.selected = {
        item_code: 'ITM' + String(nextNum).padStart(3, '0'),
        item_name: '',
        item_type: '',
        qty: '',
        spec: ''
      };
      this.itemProcessFlowsList = [];
      this.selectedSeq = null;
      this.selectProcessItem = {};
    },
    async saveItem() {
      try {
        await axios.post('/api/items', this.selected);
        await this.loadItems();
      } catch (err) {
        console.error('saveItem error', err);
      }
    },
    async deleteItem() {
      if (!this.selected.item_code) return;
      if (!confirm('정말 삭제하시겠습니까?')) return;
      try {
        await axios.delete(`/api/items/${this.selected.item_code}`);
        await this.loadItems();
      } catch (err) {
        console.error('deleteItem error', err);
      }
    },

    /* ──────────────────────────── 공정 흐름 ──────────────────────────── */
    async fetchProcessFlows(code) {
      try {
        const res = await axios.get(`/api/items/itemProcessFlowsList/${code}`);
        this.itemProcessFlowsList = res.data;
      } catch (err) {
        console.error('fetchProcessFlows error', err);
        this.itemProcessFlowsList = [];
      }
    },
    addProcessFlow() {
      const nextSeq = this.itemProcessFlowsList.length
        ? Math.max(...this.itemProcessFlowsList.map(f => +f.sequence_order)) + 1
        : 1;
      this.itemProcessFlowsList.push({
        process_header: '',
        process_code: '',
        sequence_order: nextSeq,
        item_code: this.selected.item_code,
        isAdding: true,
        duration_min: ''
      });
    },
    async saveProcessFlows() {
      try {
        const newFlows = this.itemProcessFlowsList.filter(f => f.isAdding);
        if (!newFlows.length) {
          alert('추가된 공정이 없습니다.');
          return;
        }
        await axios.post('/api/items/saveProcessFlows', {
          flows: newFlows.map(f => ({
            process_code: f.process_code,
            sequence_order: f.sequence_order,
            item_code: f.item_code
          }))
        });
        await this.fetchProcessFlows(this.selected.item_code);
      } catch (err) {
        console.error('saveProcessFlows error', err);
      }
    },
    async deleteProcessItem() {
      if (!this.selectProcessItem.sequence_order) return;
      if (!confirm('선택한 공정을 삭제하시겠습니까?')) return;
      try {
        await axios.post('/api/items/deleteProcessItem', {
          process_header: this.selectProcessItem.process_header,
          item_code: this.selectProcessItem.item_code,
          sequence_order: this.selectProcessItem.sequence_order
        });
        await this.fetchProcessFlows(this.selected.item_code);
      } catch (err) {
        console.error('deleteProcessItem error', err);
      }
    },
    async processesList() {
      try {
        const res = await axios.get('/api/items/processesList');
        this.processesListArr = res.data;
      } catch (err) {
        console.error('processesList error', err);
        this.processesListArr = [];
      }
    },
    handleProcessSelect(group) {
      /* 선택 시 추가 로직이 필요하다면 작성 */
    },
    selectProcessItemFunc(group) {
      this.selectedSeq = group.sequence_order;
      this.selectProcessItem = { ...group };
    }
  }
};
</script>

<style scoped>
/* 선택 강조색 */
.selected { background-color:#d0ebff; }

/* 리스트 카드 레이아웃 */
.list-card   { display:flex; flex-direction:column; height:100%; }
.list-scroll { overflow:auto; }

/* 테이블 헤더 고정 */
table thead th {
  position:sticky;
  top:0;
  z-index:1;
  background:#f8f9fa;
}

/* 읽기 전용 input 회색 제거 */
.no-gray[readonly] { background:transparent; border:none; padding:0; }
</style>
