<template>
  <div class="container py-4">
    <h2 class="text-center mb-4">자재 품질검사 발주서 이력 조회</h2>

    <div class="d-flex align-items-center mb-3 gap-2">
      <input
        v-model="searchOrder"
        type="text"
        class="form-control form-control-sm w-auto"
        placeholder="발주ID 검색"
      />
      <button
        class="btn btn-sm btn-danger"
        :disabled="!selected.length"
        @click="deleteSelectedOrders"
      >
        삭제
      </button>
      <button
        class="btn btn-sm btn-success ms-auto"
        :disabled="!selected.length"
        @click="exportSelectedOrders"
      >
        선택 엑셀 다운로드
      </button>
    </div>

    <div class="table-responsive">
      <table class="table table-hover align-middle text-center mb-0">
        <thead class="table-primary">
          <tr>
            <th style="width:1%">
              <input type="checkbox" :checked="allSelected" @change="toggleAll" />
            </th>
            <th>발주ID</th>
            <th>발주일자</th>
            <th>총검사항목</th>
            <th>합격여부</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="item in pagedOrders" :key="item.moder_id">
            <td>
              <input type="checkbox" v-model="selected" :value="item.moder_id" />
            </td>
            <td>{{ item.moder_id }}</td>
            <td>{{ item.moder_date }}</td>
            <td>{{ item.total_items }}</td>
            <td>
              <span
                class="fw-bold"
                :class="{
                  'text-success': item.overall_result === 'PASS',
                  'text-danger':  item.overall_result === 'FAIL'
                }"
              >
                {{ item.overall_result }}
              </span>
            </td>
          </tr>
          <tr v-if="!filteredOrders.length">
            <td colspan="5" class="text-muted">조회된 발주서가 없습니다.</td>
          </tr>
        </tbody>
      </table>
    </div>

    <nav v-if="pagesCount > 1" class="mt-3">
      <ul class="pagination justify-content-center mb-0">
        <li class="page-item" :class="{ disabled: currentPage === 1 }">
          <a class="page-link" href="#" @click.prevent="changePage(currentPage - 1)">이전</a>
        </li>
        <li
          class="page-item"
          v-for="n in pagesCount"
          :key="n"
          :class="{ active: n === currentPage }"
        >
          <a class="page-link" href="#" @click.prevent="changePage(n)">{{ n }}</a>
        </li>
        <li class="page-item" :class="{ disabled: currentPage === pagesCount }">
          <a class="page-link" href="#" @click.prevent="changePage(currentPage + 1)">다음</a>
        </li>
      </ul>
    </nav>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  name: 'QCHistoryOrderList',
  data() {
    return {
      orders: [],
      selected: [],
      searchOrder: '',
      currentPage: 1,
      pageSize: 10
    };
  },
  computed: {
    filteredOrders() {
      return this.orders.filter(o =>
        this.searchOrder
          ? o.moder_id.includes(this.searchOrder)
          : true
      );
    },
    pagesCount() {
      return Math.ceil(this.filteredOrders.length / this.pageSize);
    },
    pagedOrders() {
      const start = (this.currentPage - 1) * this.pageSize;
      return this.filteredOrders.slice(start, start + this.pageSize);
    },
    allSelected() {
      return (
        this.pagedOrders.length > 0 &&
        this.pagedOrders.every(o => this.selected.includes(o.moder_id))
      );
    }
  },
  async created() {
    try {
      const res = await axios.get('/api/qc_order_summary');
      this.orders = Array.isArray(res.data) ? res.data : [];
    } catch (e) {
      console.error('발주서 이력 조회 실패', e);
      alert('이력 조회 중 오류가 발생했습니다.');
    }
  },
  methods: {
    toggleAll(evt) {
      this.selected = evt.target.checked
        ? this.pagedOrders.map(o => o.moder_id)
        : [];
    },
    changePage(page) {
      if (page < 1 || page > this.pagesCount) return;
      this.currentPage = page;
      this.selected = [];
      window.scrollTo({ top: 0, behavior: 'smooth' });
    },
    async deleteSelectedOrders() {
      if (!this.selected.length) return;
      if (!confirm(`선택한 ${this.selected.length}개 발주서를 삭제하시겠습니까?`)) return;
      try {
        await Promise.all(
          this.selected.map(id =>
            axios.delete(`/api/qc_order_summary/${id}`)
          )
        );
        await this.reload();
      } catch (e) {
        console.error('삭제 실패', e);
        alert('삭제 중 오류가 발생했습니다.');
      }
    },
    async exportSelectedOrders() {
      if (!this.selected.length) return;
      try {
        const res = await axios.post(
          '/api/qc_order_summary/export',
          { ids: this.selected },
          { responseType: 'blob' }
        );
        const url = window.URL.createObjectURL(new Blob([res.data]));
        const a = document.createElement('a');
        a.href = url;
        a.setAttribute('download', 'QC_Order_Summary.xlsx');
        document.body.appendChild(a);
        a.click();
        a.remove();
        window.URL.revokeObjectURL(url);
      } catch (e) {
        console.error('엑셀 다운로드 실패', e);
        alert('엑셀 다운로드 중 오류가 발생했습니다.');
      }
    },
    async reload() {
      try {
        const res = await axios.get('/api/qc_order_summary');
        this.orders = Array.isArray(res.data) ? res.data : [];
        this.selected = [];
      } catch (e) {
        console.error('이력 재조회 실패', e);
      }
    }
  }
};
</script>

<style scoped>
.table-primary {
  background-color: #f8f9fa;
}
</style>
