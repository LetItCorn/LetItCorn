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
              placeholder="발주ID 또는 자재코드 검색"
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
                <th>자재코드</th>
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
                <td>{{ o.mater_code }}</td>
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
                <td>{{ o.moder_date }}</td>
                <td>{{ o.due_date }}</td>
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
          ? o.moder_id.includes(this.filterQuery) || o.mater_code.includes(this.filterQuery)
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
  async created() {
    try {
      const res = await axios.get('/api/m_orders');
      this.orders = Array.isArray(res.data)
        ? res.data
        : (Array.isArray(res.data.list) ? res.data.list : []);
    } catch (e) {
      console.error('발주서 목록 조회 실패', e);
      alert('목록 조회 중 오류가 발생했습니다.');
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
      // ...기존 handleInspection 로직 그대로...
    }
  }
};
</script>

<style scoped>
.table th,
.table td { vertical-align: middle; }
.card-header .btn { white-space: nowrap; }
</style>
