<template>
  <div class="material-stock py-4 container-fluid">
    <!-- 검색 바 -->
    <div class="row mb-3 align-items-center">
      <div class="col-auto">
        <select v-model="searchField" class="form-select">
          <option value="mater_code">자재 코드</option>
          <option value="mater_name">자재명</option>
          <option value="category_name">자재구분</option>
        </select>
      </div>
      <div class="col">
        <input
          v-model="searchQuery"
          type="text"
          class="form-control"
          placeholder="검색값 입력"
          @keyup.enter="fetchInventory"
        />
      </div>
      <div class="col-auto">
        <button class="btn btn-dark" @click="fetchInventory">
          검색
        </button>
      </div>
    </div>

    <!-- 재고 테이블 -->
    <div class="table-responsive">
      <table class="table table-bordered text-center">
        <thead class="table-light">
          <tr>
            <th>
              <input
                type="checkbox"
                :checked="allSelected"
                @change="toggleAllSelection"
              />
            </th>
            <th>자재 코드</th>
            <th>자재명</th>
            <th>자재구분</th>
            <th>안전재고</th>
            <th>전체재고</th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="material in inventoryList"
            :key="material.mater_code"
          >
            <td>
              <input
                type="checkbox"
                :value="material"
                v-model="selectedItems"
              />
            </td>
            <td>{{ material.mater_code }}</td>
            <td>{{ material.mater_name }}</td>
            <td>{{ material.category_name }}</td>
            <td>{{ material.safe_stock }}</td>
            <td
              :class="{ 'text-danger': material.total_stock < material.safe_stock }"
            >
              {{ material.total_stock }}
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- 발주 버튼 -->
    <div class="text-end">
      <button
        class="btn btn-success"
        :disabled="!selectedItems.length"
        @click="$emit('order', selectedItems)"
      >
        발주
      </button>
    </div>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  name: 'MaterialStock',
  data() {
    return {
      searchField: 'mater_code',
      searchQuery: '',
      inventoryList: [],
      selectedItems: []
    };
  },
  computed: {
    allSelected() {
      return (
        this.inventoryList.length > 0 &&
        this.selectedItems.length === this.inventoryList.length
      );
    }
  },
  created() {
    this.fetchInventory();
  },
  methods: {
    async fetchInventory() {
      try {
        const params = {};
        if (this.searchQuery) {
          params[this.searchField] = this.searchQuery;
        }
        const res = await axios.get('/api/materials', { params });
        this.inventoryList = res.data;
        this.selectedItems = [];
      } catch (e) {
        console.error('fetchInventory error', e);
      }
    },
    toggleAllSelection(evt) {
      this.selectedItems = evt.target.checked
        ? [...this.inventoryList]
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
</style>
