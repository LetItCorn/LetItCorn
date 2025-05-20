<template>
  <div class="container-fluid py-4">
    <h2 class="text-center mb-4">발주서 조회</h2>
    <div class="card shadow-sm">
      <div class="card-header d-flex justify-content-end align-items-center bg-light">
        <small class="text-muted me-auto">
          총 {{ orders.length }}건 / 필터 {{ filteredOrders.length }}건
        </small>
        <router-link to="/m_orders" class="btn btn-sm btn-primary me-2">
          <i class="bi bi-plus-circle me-1"></i> 새 발주서 등록
        </router-link>
        <button
          class="btn btn-sm btn-warning"
          :disabled="!selectedOrders.length"
          @click="showQualityModal = true"
        >
          <i class="bi bi-gear-fill me-1"></i> 품질 검사
        </button>
      </div>

      <div class="card-body">
        <!-- 필터 -->
        <div class="row mb-3 g-2 align-items-center">
          <div class="col-auto">
            <input
              v-model="filterQuery"
              type="text"
              class="form-control form-control-sm"
              placeholder="발주ID 또는 자재명 검색"
            />
          </div>
          <div class="col-auto">
            <select v-model="filterStatus" class="form-select form-select-sm">
              <option value="ALL">전체 상태</option>
              <option value="PENDING">PENDING</option>
              <option value="PARTIAL">PARTIAL</option>
              <option value="COMPLETE">COMPLETE</option>
            </select>
          </div>
        </div>

        <!-- 목록 -->
        <div class="table-responsive">
          <table class="table table-striped table-hover align-middle text-center mb-0">
            <thead class="table-primary">
              <tr>
                <th style="width:1%">
                  <input type="checkbox" :checked="allSelected" @change="toggleAll" />
                </th>
                <th>발주ID</th>
                <th>자재명</th>
                <th>발주수량</th>
                <th>입고누적</th>
                <th>입고상태</th>
                <th>발주일</th>
                <th>납기일</th>
              </tr>
            </thead>
            <tbody>
              <tr
                v-for="o in pagedOrders"
                :key="o.moder_id + '-' + o.mater_code"
              >
                <td>
                  <input type="checkbox" v-model="selectedOrders" :value="o" @click.stop />
                </td>
                <td>{{ o.moder_id }}</td>
                <td>{{ o.mater_name }}</td>
                <td>{{ o.moder_qty }}</td>
                <td>{{ o.received_qty }}</td>
                <td>
                  <span
                    class="badge"
                    :class="{
                      'bg-success': o.inbound_status === 'COMPLETE',
                      'bg-warning text-dark': o.inbound_status === 'PARTIAL',
                      'bg-secondary': o.inbound_status === 'PENDING'
                    }"
                  >
                    {{ o.inbound_status }}
                  </span>
                </td>
                <td>{{ formatDate(o.moder_date) }}</td>
                <td>{{ formatDate(o.due_date) }}</td>
              </tr>
              <tr v-if="!filteredOrders.length">
                <td colspan="8" class="text-muted py-4">조건에 맞는 발주서가 없습니다.</td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- 페이지네이션 -->
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
    </div>

    <QualityInspectionModal
      :visible="showQualityModal"
      :orders="selectedOrders"
      @close="showQualityModal = false"
      @inspect="handleInspection"
    />
  </div>
</template>

<script>
import axios from 'axios';
import { useInboundStore } from '@/store/inbound';
import QualityInspectionModal from './components/QualityInspectionModal.vue';
import useDates from '@/utils/useDates';

export default {
  name: 'MOrdersList',
  components: { QualityInspectionModal },
  setup() {
    return { inboundStore: useInboundStore() };
  },
  data() {
    return {
      orders: [],
      selectedOrders: [],
      showQualityModal: false,
      filterQuery: '',
      filterStatus: 'ALL',
      // pagination
      currentPage: 1,
      pageSize: 10
    };
  },
  computed: {
    filteredOrders() {
      return this.orders.filter(o => {
        const matchesQuery = this.filterQuery
          ? o.moder_id.includes(this.filterQuery) || o.mater_name.includes(this.filterQuery)
          : true;
        const matchesStatus = this.filterStatus === 'ALL' || o.inbound_status === this.filterStatus;
        return matchesQuery && matchesStatus;
      });
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
        this.selectedOrders.length === this.pagedOrders.length
      );
    }
  },
  methods: {
    toggleAll(evt) {
      this.selectedOrders = evt.target.checked ? [...this.pagedOrders] : [];
    },
    changePage(page) {
      if (page < 1 || page > this.pagesCount) return;
      this.currentPage = page;
      this.selectedOrders = [];
      window.scrollTo({ top: 0, behavior: 'smooth' });
    },
    async handleInspection(results) {
      // 기존 handleInspection 로직 유지
      const normalized = results.map(r => ({
        moder_id: r.moder_id,
        mater_code: r.mater_code,
        qc_result: r.qc_result === '적합' ? 'PASS' : 'FAIL'
      }));

      const passOrders = normalized
        .filter(r => r.qc_result === 'PASS')
        .map(r => {
          const o = this.orders.find(
            x => x.moder_id === r.moder_id && x.mater_code === r.mater_code
          );
          return { moder_id: r.moder_id, mater_code: r.mater_code, moder_qty: o ? o.moder_qty : 0 };
        });

      this.inboundStore.setPendingOrders(passOrders);
      this.selectedOrders = [];
      this.showQualityModal = false;
      if (passOrders.length) {
        this.$router.push({ name: 'MInboundForm' });
      }
    },
    async deleteSelectedOrders() {
      if (!this.selectedOrders.length) return;
      if (!confirm(`선택한 ${this.selectedOrders.length}개 발주서를 삭제하시겠습니까?`)) return;
      try {
        await Promise.all(
          this.selectedOrders.map(o =>
            axios.delete(`/api/qc_order_summary/${o.moder_id}`)
          )
        );
        await this.reload();
      } catch (e) {
        console.error('삭제 실패', e);
        alert('삭제 중 오류가 발생했습니다.');
      }
    },
    async exportSelectedOrders() {
      if (!this.selectedOrders.length) return;
      try {
        const res = await axios.post(
          '/api/qc_order_summary/export',
          { ids: this.selectedOrders.map(o => o.moder_id) },
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
        this.selectedOrders = [];
      } catch (e) {
        console.error('이력 재조회 실패', e);
      }
    },
    // 날짜 포맷 함수
    formatDate(val) {
      if (!val) return '';
      if (typeof val === 'string') return val.slice(0, 10);
      if (typeof val === 'object' && 'year' in val && 'month' in val && 'day' in val) {
        const y = val.year;
        const m = String(val.month).padStart(2, '0');
        const d = String(val.day).padStart(2, '0');
        return `${y}-${m}-${d}`;
      }
      return useDates.dateFormat(val, 'yyyy-MM-dd');
    }
  },
  async created() {
    try {
      const res = await axios.get('/api/m_orders');
      this.orders = Array.isArray(res.data) ? res.data : [];
    } catch (e) {
      console.error('발주서 목록 조회 실패', e);
      alert('목록 조회 중 오류가 발생했습니다.');
    }
  }
};
</script>

<style scoped>
.table th,
.table td { vertical-align: middle; }
.card-header .btn { white-space: nowrap; }
</style>
