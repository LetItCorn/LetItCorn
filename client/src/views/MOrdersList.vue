<template>
  <div class="container-fluid py-4">
    <h2 class="text-center mb-4">발주서 조회</h2>

    <div class="card shadow-sm">
      <!-- 카드 헤더: 버튼 및 전체 건수 -->
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

      <!-- 카드 바디: 필터 & 테이블 -->
      <div class="card-body">
        <!-- 1) 필터 컨트롤 -->
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
            <select
              v-model="filterStatus"
              class="form-select form-select-sm"
            >
              <option value="ALL">전체 상태</option>
              <option value="PENDING">PENDING</option>
              <option value="PARTIAL">PARTIAL</option>
              <option value="COMPLETE">COMPLETE</option>
            </select>
          </div>
        </div>

        <!-- 2) 발주서 테이블 -->
        <div class="table-responsive">
          <table class="table table-striped table-hover align-middle text-center mb-0">
            <thead class="table-primary">
              <tr>
                <th style="width:1%">
                  <input
                    type="checkbox"
                    :checked="allSelected"
                    @change="toggleAll"
                  />
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
                v-for="o in filteredOrders"
                :key="o.moder_id + '-' + o.mater_code"
              >
                <td>
                  <input
                    type="checkbox"
                    v-model="selectedOrders"
                    :value="o"
                    @click.stop
                  />
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
                <td colspan="8" class="text-muted py-4">
                  조건에 맞는 발주서가 없습니다.
                </td>
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
    const inboundStore = useInboundStore();
    return { inboundStore };
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
          ? o.moder_id.includes(this.filterQuery) ||
            o.mater_code.includes(this.filterQuery)
          : true;
        const matchesStatus =
          this.filterStatus === 'ALL' ||
          o.inbound_status === this.filterStatus;
        return matchesQuery && matchesStatus;
      });
    }
  },
  async created() {
    await this.loadOrders();
  },
  methods: {
    async loadOrders() {
      try {
        const res = await axios.get('/api/m_orders');
        this.orders = res.data;
      } catch (e) {
        console.error('발주서 목록 조회 실패', e);
        alert('목록 조회 중 오류가 발생했습니다.');
      }
    },
    toggleAll(evt) {
      this.selectedOrders = evt.target.checked
        ? [...this.filteredOrders]
        : [];
    },
    async handleInspection(results) {
      try {
        // 1) QC 기록 저장
        await axios.post('/api/qc_inspections', results);

        // 2) PASS/FAIL 분리
        const pass = [], fail = [];
        this.selectedOrders.forEach(o => {
          const r = results.find(
            x => x.moder_id === o.moder_id && x.mater_code === o.mater_code
          );
          if (r.qc_result === 'PASS') pass.push(o);
          else fail.push(o);
        });

        // 3) 불합격 → 반품 처리
        if (fail.length) {
          await Promise.all(
            fail.map(o =>
              axios.post('/api/m_returns', {
                return_id: `RT${Date.now()}`,
                moder_id: o.moder_id,
                mater_code: o.mater_code,
                return_date: new Date().toISOString().slice(0,10),
                manager: '현재사용자',
                reason: 'QC 불합격',
                status: 'REQUESTED'
              })
            )
          );
        }

        // 4) 합격 → 입고 후보로 스토어에 저장
        this.inboundStore.setPendingOrders(pass);

        // 5) 이미 처리된 발주서 목록에서 제거
        const keys = results.map(r => `${r.moder_id}-${r.mater_code}`);
        this.orders = this.orders.filter(
          o => !keys.includes(`${o.moder_id}-${o.mater_code}`)
        );
        this.selectedOrders = [];
      } catch (err) {
        console.error('품질검사 처리 중 오류', err);
        alert('품질검사 처리 중 오류가 발생했습니다.');
      }
    }
  }
};
</script>

<style scoped>
.table th,
.table td {
  vertical-align: middle;
}

/* 버튼 너비 자동 조정 */
.card-header .btn {
  width: auto !important;
  white-space: nowrap;
}

/* 필터 입력기 크기 */
.form-control-sm {
  max-width: 200px;
}
.form-select-sm {
  max-width: 140px;
}
</style>
