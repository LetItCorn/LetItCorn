<template>
  <div class="container-fluid py-4">
    <h2 class="text-center mb-4">자재 조회</h2>
    <div class="card shadow-sm">
      <!-- 필터 영역 -->
      <div class="card-header bg-light">
        <div class="row g-2 align-items-center">
          <div class="col-md-4">
            <input
              v-model="searchQuery"
              @input="applyFilters"
              type="text"
              class="form-control form-control-sm"
              placeholder="코드·명·카테고리 검색"
            />
          </div>
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
              <tr
                v-for="mat in paginatedList"
                :key="mat.mater_code"
                :class="{ 'table-danger': mat.current_stock < mat.safe_stock }"
              >
                <td>
                  <input type="checkbox" :value="mat" v-model="selectedItems" />
                </td>
                <td>{{ mat.mater_code }}</td>
                <td>{{ mat.mater_name }}</td>
                <td>{{ mat.safe_stock }}</td>
                <td>{{ mat.current_stock }}</td>
              </tr>
              <tr v-if="!paginatedList.length">
                <td colspan="6" class="text-muted py-4">조건에 맞는 자재가 없습니다.</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- 페이지네이션 및 발주 버튼 -->
      <div class="card-footer bg-light">
        <nav v-if="totalPages > 1" aria-label="Page navigation">
          <ul class="pagination justify-content-center mb-2">
            <li
              class="page-item"
              :class="{ disabled: currentPage === 1 }"
              @click="changePage(currentPage - 1)"
            >
              <a class="page-link" href="javascript:;">Previous</a>
            </li>
            <li
              class="page-item"
              v-for="page in totalPages"
              :key="page"
              :class="{ active: currentPage === page }"
              @click="changePage(page)"
            >
              <a class="page-link" href="javascript:;">{{ page }}</a>
            </li>
            <li
              class="page-item"
              :class="{ disabled: currentPage === totalPages }"
              @click="changePage(currentPage + 1)"
            >
              <a class="page-link" href="javascript:;">Next</a>
            </li>
          </ul>
        </nav>
        <div class="text-end">
        </div>
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
      inventoryList: [],
      filteredList: [],
      selectedItems: [],
      searchQuery: '',
      lowStockOnly: false,
      currentPage: 1,
      pageSize: 10,
    };
  },
  computed: {
    allSelected() {
      return (
        this.filteredList.length > 0 &&
        this.selectedItems.length === this.filteredList.length
      );
    },
    totalPages() {
      return Math.ceil(this.filteredList.length / this.pageSize);
    },
    paginatedList() {
      const start = (this.currentPage - 1) * this.pageSize;
      return this.filteredList.slice(start, start + this.pageSize);
    },
  },
  async created() {
    await this.fetchInventory();
  },
  methods: {
    async fetchInventory() {
      try {
        const res = await axios.get('/api/materials/stock');
        this.inventoryList = Array.isArray(res.data)
          ? res.data.map(r => ({
              ...r,
              current_stock: r.current_stock ?? r.total_stock ?? 0
            }))
          : [];
        this.applyFilters();
      } catch (e) {
        console.error('fetchInventory error', e);
        alert('자재 목록을 불러오는 중 오류가 발생했습니다.');
      }
    },
    applyFilters() {
      const q = this.searchQuery.trim().toLowerCase();
      this.filteredList = this.inventoryList.filter(item => {
        const code = (item.mater_code || '').toLowerCase();
        const name = (item.mater_name || '').toLowerCase();
        const matchesQuery = q ? code.includes(q) || name.includes(q) : true;
        const matchesLowStock = this.lowStockOnly
          ? item.current_stock < item.safe_stock
          : true;
        return matchesQuery && matchesLowStock;
      });
      this.selectedItems = [];
      this.currentPage = 1;
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
    },
    changePage(page) {
      if (page < 1 || page > this.totalPages) return;
      this.currentPage = page;
      this.selectedItems = [];
    },
  },
};
</script>

<style scoped>
.table-danger {
  background-color: #f8d7da !important;
}
.table th,
.table td {
  vertical-align: middle;
}
</style>
