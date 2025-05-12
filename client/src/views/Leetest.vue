<template>
  <div class="container-fluid py-4">
    <h2 class="text-center mb-4">자재 조회</h2>
    <div class="card shadow-sm">
      <!-- 필터 영역: 검색어 입력, 재고 부족 체크박스, 초기화 버튼 -->
      <div class="card-header bg-light">
        <div class="row g-2 align-items-center">
          <!-- 검색창: 검색어 입력시 applyFilters 호출 -->
          <div class="col-md-4">
            <input
              v-model="searchQuery"
              @input="applyFilters"
              type="text"
              class="form-control form-control-sm"
              placeholder="코드·명·카테고리 검색"
            />
          </div>
          <!-- 재고 부족만 보기위해서 체크박스로 chage 이벤트 필터 적용 -->
          <div class="col-auto">
            <div class="form-check">
              <input
                v-model="lowStockOnly"
                @change="applyFilters"
                class="form-check-input"
                type="checkbox"
                id="lowStockOnly"
              />
              <label class="form-check-label" for="lowStockOnly">
                재고 부족만 보기
              </label>
            </div>
          </div>
          <!-- 전체 초기화 버튼 필터랑 선택 리셋을 할 수 있게 한다.-->
          <div class="col-auto ms-auto">
            <button class="btn btn-sm btn-outline-secondary" @click="resetFilters">
              초기화
            </button>
          </div>
        </div>
      </div>
      <!-- 자재 목록 테이블 -->
      <div class="card-body p-0">
        <div class="table-responsive">
          <table class="table table-striped table-hover text-center mb-0">
            <thead class="table-dark">
              <tr>
                <!-- 전체 선택 체크박스 -->
                <th style="width:1%">
                  <input
                    type="checkbox"
                    :checked="allSelected"
                    @change="toggleAllSelection"
                  />
                </th>
                <th>자재 코드</th>
                <th>자재명</th>
                <th>안전재고</th>
                <th>현재재고</th>
              </tr>
            </thead>
            <tbody>
              <!-- 필터된 리스트 반복 렌더링을 해서  -->
              <tr
                v-for="mat in filteredList"
                :key="mat.mater_code"
                :class="{ 'table-danger': mat.total_stock < mat.safe_stock }"
              >
                <td>
                  <input
                    type="checkbox"
                    :value="mat"
                    v-model="selectedItems"
                  />
                </td>
                <td>{{ mat.mater_code }}</td>
                <td>{{ mat.mater_name }}</td>
                <td>{{ mat.safe_stock }}</td>
                <td>{{ mat.total_stock }}</td>
              </tr>
              <tr v-if="!filteredList.length">
                <td colspan="6" class="text-muted py-4">
                  조건에 맞는 자재가 없습니다.
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- 발주 버튼 -->
      <div class="card-footer text-end bg-light">
        <button
          class="btn btn-success"
          :disabled="!selectedItems.length"
          @click="$emit('order', selectedItems)"
        >
          발주
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  name: 'MaterialStock',
  data() {
    return {
      inventoryList: [],    // 서버에서 받아온 전체 리스트
      filteredList: [],     // 필터 적용 후 리스트
      selectedItems: [],
      searchQuery: '',
      lowStockOnly: false
    };
  },
  computed: {
    allSelected() {
      return (
        this.filteredList.length > 0 &&
        this.selectedItems.length === this.filteredList.length
      );
    }
  },
  async created() {
    await this.fetchInventory();
  },
  methods: {
    async fetchInventory() {
      try {
        const res = await axios.get('/api/materials/stock');
        // 서버에서 넘어오는 필드: mater_code, mater_name, category_name, safe_stock, total_stock
        this.inventoryList = res.data;
        this.applyFilters();
      } catch (e) {
        console.error('fetchInventory error', e);
        alert('자재 목록을 불러오는 중 오류가 발생했습니다.');
      }
    },
    applyFilters() {
      const q = this.searchQuery.trim().toLowerCase();
      this.filteredList = this.inventoryList.filter(item => {

        const code = item.mater_code?.toLowerCase() || '';
        const name = item.mater_name?.toLowerCase() || '';

        const matchesQuery = q
          ? code.includes(q) || name.includes(q)
          : true;
        const matchesLowStock = this.lowStockOnly
          ? item.total_stock < item.safe_stock
          : true;
        return matchesQuery && matchesLowStock;
      });
      // 필터링 후 선택 초기화
      this.selectedItems = [];
    },
    resetFilters() {
      this.searchQuery = '';
      this.lowStockOnly = false;
      this.applyFilters();
    },
    toggleAllSelection(evt) {
      this.selectedItems = evt.target.checked
        ? [...this.filteredList]
        : [];
    }
  }
};
</script>

<style scoped>
.material-stock .table th,
.material-stock .table td {
  vertical-align: middle;
}
.table-danger {
  background-color: #f8d7da !important;
}
</style>
