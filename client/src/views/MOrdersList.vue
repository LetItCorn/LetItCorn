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
              <tr v-for="o in filteredOrders" :key="o.moder_id + '-' + o.mater_code">
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
      filterStatus: 'ALL'
    };
  },
  computed: {
    allSelected() {
      return (
        this.filteredOrders.length > 0 &&
        this.selectedOrders.length === this.filteredOrders.length
      );
    },
    filteredOrders() {
      return this.orders.filter(o => {
        const matchesQuery = this.filterQuery
          ? o.moder_id.includes(this.filterQuery) || o.mater_code.includes(this.filterQuery)
          : true;
        const matchesStatus = this.filterStatus === 'ALL' || o.inbound_status === this.filterStatus;
        return matchesQuery && matchesStatus;
      });
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
      this.selectedOrders = evt.target.checked ? [...this.filteredOrders] : [];
    },
    /**
     * 검사 결과를 한글 '적합/부적합'에서 'PASS/FAIL'로 매핑
     * PASS인 발주서만 Pinia 스토어에 저장 후 입고 페이지로 이동
     */
    async handleInspection(results) {
      // 1) 한글 결과를 영문 상태로 변환
      const normalized = results.map(r => ({
        moder_id:   r.moder_id,
        mater_code: r.mater_code,
        qc_result:  r.qc_result === '적합' ? 'PASS' : 'FAIL'
      }));

      // 2) PASS인 항목만 필터링하여 Pinia store에 저장
      const passOrders = normalized
        .filter(r => r.qc_result === 'PASS')
        .map(r => {
          const o = this.orders.find(
            x => x.moder_id === r.moder_id && x.mater_code === r.mater_code
          );
          return {
            moder_id:   r.moder_id,
            mater_code: r.mater_code,
            moder_qty:  o ? o.moder_qty : 0
          };
        });

      // 3) Pinia store에 처리 대상 저장
      this.inboundStore.setPendingOrders(passOrders);

      // 4) 모달 닫고 선택 초기화
      this.selectedOrders = [];
      this.showQualityModal = false;

      // 5) 적합 항목이 있으면 입고 처리 화면으로
      if (passOrders.length) {
        this.$router.push({ name: 'MInboundForm' });
      }
    }
  }
};
</script>

<style scoped>
.table th,
.table td { vertical-align: middle; }
.card-header .btn { white-space: nowrap; }
</style>
