<!-- src/views/ItemList.vue -->
<template>
  <div class="container-fluid py-3">
<!-- 1) 상단 조회·필터 바 -->
<div class="row mb-3">
  <div class="col-12">
    <div class="card">
      <div class="card-body d-flex align-items-center">
        <!-- 빈 공간을 밀어내고, 이 블록이 오른쪽 끝으로 정렬됩니다 -->
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

          <button
            @click="loadItems"
            class="btn btn-sm btn-primary me-2"
            style="width:80px;"
          >
            조회
          </button>
          <button
            @click="resetFilter"
            class="btn btn-sm btn-outline-secondary"
            style="width:80px;"
          >
            초기화
          </button>
        </div>
      </div>
    </div>
  </div>
</div>




    <!-- 2) 하단: 리스트(좌) / 상세(우) -->
    <div class="row" style="height: 70vh;">
      <!-- 2-1) 좌측: 품목 리스트 (2/3 너비) -->
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
                  :class="{ 'table-active': item.item_code === selected.item_code }"
                  style="cursor:pointer"
                >
                  <td>{{ item.item_code }}</td>
                  <td>{{ item.item_name }}</td>
                  <td>{{ item.item_type }}</td>
                  <td>{{ item.unit_code }}</td>
                  <td>{{ item.spec }}</td>
                </tr>
                <tr v-if="itemList.length === 0">
                  <td colspan="5" class="text-center py-4">
                    데이터가 없습니다.
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <!-- 2-2) 우측: 상세 화면 (1/3 너비) -->
      <div class="col-md-4">
        <div class="card h-100">
          <div class="card-body d-flex flex-column">
            <!-- 상세 입력 폼 -->
            <div class="form-row flex-fill">
              <div class="form-group col-6">
                <label>품목코드</label>
                <input v-model="selected.item_code" class="form-control form-control-sm" />
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

            <!-- 상세 액션 버튼 (오른쪽 정렬, 너비 10%) -->
            <div class="mt-auto d-flex justify-content-end">
              <button
                @click="clearDetail"
                class="btn btn-sm btn-outline-secondary mr-2"
                style="width:80px;"
              >
                초기화
              </button>
              <button
                @click="createItem"
                class="btn btn-sm btn-warning mr-2"
                style="width:80px;"
              >
                등록
              </button>
              <button
                @click="updateItem"
                class="btn btn-sm btn-success mr-2"
                style="width:80px;"
              >
                수정
              </button>
              <button
                @click="deleteItem"
                class="btn btn-sm btn-danger"
                style="width:80px;;"
              >
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

export default { // 외부에서 사용할 수 있도록 내보냄.
  name: 'Item',
  data() {
    return {
      searchType: '',
      searchValue: '',
      itemList: [],
      selected: {
        item_code: '',
        item_name: '',
        item_type: '',
        unit_code: '',
        spec: ''
      }
    };
  },
  computed: { // 정의된 데이터 값 변경 감시,  변경될 떄마다 정의된 함수 실행
    filterPlaceholder() {
      switch (this.searchType) {
        case 'code': return '품목코드';
        case 'name': return '품목명';
        case 'type': return '구분';
        default:     return '';
      }
    }
  },
  created() { // 컴포넌트가 처음 화면에 등장할 때 함수를 자동으로 호출하겠단 의미
    this.loadItems();
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
        console.log(res);
        console.log(res.data);
        this.itemList = res.data;
      } catch {
        this.itemList = [];
      }
    },
    resetFilter() {
      this.searchType = '';
      this.searchValue = '';
      this.loadItems();
    },
    selectItem(item) {
      this.selected = { ...item };
    },
    clearDetail() {
      this.selected = {
        item_code: '',
        item_name: '',
        item_type: '',
        unit_code: '',
        spec: ''
      };
    },
    async createItem() {
      try {
        await axios.post('/api/items', this.selected);
        this.loadItems();
        this.clearDetail();
      } catch {}
    },
    async updateItem() {
      try {
        await axios.put(`/api/items/${this.selected.item_code}`, this.selected);
        this.loadItems();
      } catch {}
    },
    async deleteItem() {
      if (!this.selected.item_code) return;
      try {
        await axios.delete(`/api/items/${this.selected.item_code}`);
        this.loadItems();
        this.clearDetail();
      } catch {}
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
</style>
