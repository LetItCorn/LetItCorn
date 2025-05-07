<template>
  <div class="container-fluid py-3">
    <!-- 1) 상단 조회·필터 바 -->
    <div class="row mb-3">
      <div class="col-12">
        <div class="card">
          <div class="card-body d-flex align-items-center">
            <div class="ms-auto d-flex align-items-center">
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

              <input
                v-model="searchValue"
                :placeholder="filterPlaceholder"
                class="form-control form-control-sm me-2 border"
                style="width:200px"
              />

              <button @click="loadItems" class="btn btn-sm btn-primary me-2" style="width:80px;">
                조회
              </button>
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
                  <th>단위</th>
                  <th>규격</th>
                </tr>
              </thead>
              <tbody>
                <tr
                  v-for="item in itemList"
                  :key="item.item_code"
                  @click="selectItem(item)"
                  :class="{'table-active': item.item_code === selected.item_code} "
                  style="cursor:pointer"
                >
                  <td>{{ item.item_code }}</td>
                  <td>{{ item.item_name }}</td>
                  <td>{{ item.item_type }}</td>
                  <td>{{ item.unit_code }}</td>
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

      <!-- 2-2) 우측: 상세 + 공정 -->
      <div class="col-md-4 d-flex flex-column h-100">
        <!-- 품목 상세 카드 -->
        <div class="card flex-fill mb-2">
          <div class="card-body d-flex flex-column">
            <div class="form-row flex-fill">
              <div class="form-group col-6">
                <label>품목코드</label>
                <input
                  v-model="selected.item_code"
                  class="form-control form-control-sm"
                  readonly
                />
              </div>
              <div class="form-group col-6">
                <label>품목명</label>
                <input v-model="selected.item_name" class="form-control form-control-sm" />
              </div>
              <div class="form-group col-6">
                <label>구분</label>
                <input v-model="selected.item_type" class="form-control form-control-sm" />
              </div>
              <div class="form-group col-6">
                <label>단위</label>
                <input v-model="selected.unit_code" class="form-control form-control-sm" />
              </div>
              <div class="form-group col-12">
                <label>규격</label>
                <input v-model="selected.spec" class="form-control form-control-sm" />
              </div>
            </div>
            <div class="mt-auto d-flex justify-content-end">
              <button
                @click="clearDetail"
                class="btn btn-sm btn-outline-secondary mr-2"
                style="width:80px;"
              >
                초기화
              </button>
              <button
                @click="saveItem"
                class="btn btn-sm btn-warning mr-2"
                style="width:80px;"
              >
                등록
              </button>
              <button
                @click="deleteItem"
                class="btn btn-sm btn-danger"
                style="width:80px;"
              >
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
                <template v-if="itemProcessFlowsList.length > 0">
                  <tr
                    v-for="group in itemProcessFlowsList"
                    :key="group.sequence_order"
                    :class="{ selected: selectedSeq === group.sequence_order }"
                    @click="selectProcessItemFunc(group)"
                  >
                    <template v-if="!group.isAdding">
                      <td>{{ group.sequence_order }}</td>
                      <td>{{ group.process_name }}</td>
                      <td>
                        <input
                          v-model="group.duration"
                          class="form-control form-control-sm text-center mb-1"
                          :placeholder="`예: ${group.duration_min}분`"
                        />
                      </td>
                    </template>
                    <template v-else>
                      <td>{{ group.sequence_order }}</td>
                      <td>
                        <select
                          v-model="group.process_header"
                          @change="handleProcessSelect(group)"
                        >
                          <option value="">-- 선택하세요 --</option>
                          <option
                            v-for="item in processesListArr"
                            :key="item.process_header"
                            :value="item.process_header"
                          >
                            {{ item.process_name }}
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
      searchType: '',
      searchValue: '',
      itemList: [],
      itemProcessFlowsList: [],
      processesListArr: [],
      selected: {
        item_code: '',
        item_name: '',
        item_type: '',
        unit_code: '',
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
    await this.loadItems();
    this.processesList();
  },
  methods: {
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
        this.clearDetail();
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
      // 자동 코드는 현재 리스트에서 최대 숫자 찾아 생성
      let nextNum = 1;
      if (this.itemList.length) {
        const nums = this.itemList
          .map(i => {
            const n = parseInt(i.item_code.replace(/^ITM/, ''), 10);
            return isNaN(n) ? 0 : n;
          });
        nextNum = Math.max(...nums) + 1;
      }
      const nextCode = 'ITM' + String(nextNum).padStart(3, '0');
      this.selected = {
        item_code: nextCode,
        item_name: '',
        item_type: '',
        unit_code: '',
        spec: ''
      };
      this.itemProcessFlowsList = [];
    },
    async saveItem() {
      try {
        const exists = this.itemList.some(i => i.item_code === this.selected.item_code);
        if (exists) {
          await axios.put(`/api/items/${this.selected.item_code}`, this.selected);
        } else {
          await axios.post('/api/items', this.selected);
        }
        await this.loadItems();
      } catch (err) {
        console.error('saveItem error', err);
      }
    },
    async deleteItem() {
      if (!this.selected.item_code) return;
      try {
        await axios.delete(`/api/items/${this.selected.item_code}`);
        await this.loadItems();
      } catch (err) {
        console.error('deleteItem error', err);
      }
    },
    async fetchProcessFlows(code) {
      try {
        const res = await axios.get(`/api/items/itemProcessFlowsList/${code}`);
        this.itemProcessFlowsList = res.data;
      } catch {
        this.itemProcessFlowsList = [];
      }
    },
    addProcessFlow() {
      const nextSeq = this.itemProcessFlowsList.length
        ? Math.max(...this.itemProcessFlowsList.map(f => Number(f.sequence_order))) + 1
        : 1;
      this.itemProcessFlowsList.push({
        sequence_order: nextSeq,
        process_header: '',
        item_code: this.selected.item_code,
        isAdding: true
      });
    },
    async saveProcessFlows() {
      try {
        await axios.post('/api/saveProcessFlows', { flows: this.itemProcessFlowsList });
        this.fetchProcessFlows(this.selected.item_code);
      } catch (err) {
        console.error('saveProcessFlows error', err);
      }
    },
    async deleteProcessItem() {
      if (!this.selectProcessItem.sequence_order) return;
      try {
        await axios.post('/api/items/deleteProcessItem', this.selectProcessItem);
        this.fetchProcessFlows(this.selected.item_code);
      } catch {}
    },
    async processesList() {
      try {
        const res = await axios.get('/api/items/processesList');
        this.processesListArr = res.data;
      } catch {
        this.processesListArr = [];
      }
    },
    handleProcessSelect(group) {
      // noop
    },
    selectProcessItemFunc(group) {
      this.selectedSeq = group.sequence_order;
      this.selectProcessItem = group;
    }
  }
};
</script>
